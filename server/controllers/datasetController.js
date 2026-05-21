const ingestionService = require("../services/ingestionService");
const cleanerService = require("../services/cleanerService");
const aiService = require("../services/aiService");
const conversationService = require("../services/conversationService");
const { explainSql } = require("../services/sqlExplainer");
const pool = require("../config/pg");
const prisma = require("../config/db");
const { validateReadOnlySql } = require("../utils/sqlGuard");
const { runReadOnlyQuery } = require("../services/sqlRunner");

const ANALYZE_ROW_CAP = parseInt(process.env.ANALYZE_ROW_CAP || "5000", 10);

/**
 * Coerces stringified numeric values from PostgreSQL into actual JS numbers.
 * node-postgres returns bigint/numeric/aggregate results as strings to avoid
 * precision loss; the frontend chart components rely on `typeof === 'number'`.
 */
const coerceNumericValues = (rows) => {
  if (!rows || rows.length === 0) return rows;
  return rows.map((row) => {
    const coerced = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === null || value === undefined) {
        coerced[key] = value;
      } else if (typeof value === "string" && value.trim() !== "" && !isNaN(value)) {
        coerced[key] = Number(value);
      } else {
        coerced[key] = value;
      }
    }
    return coerced;
  });
};

const requireUser = (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return req.user.id;
};

exports.uploadDataset = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const dataset = await ingestionService.ingestFile(
      req.file.path,
      userId,
      req.file.originalname
    );

    cleanerService.cleanDataset(dataset.id).catch((e) =>
      console.error("[cleanerService] background error:", e)
    );

    res.json({
      success: true,
      datasetId: dataset.id,
      message: "Dataset uploaded and processing started.",
    });
  } catch (error) {
    next(error);
  }
};

exports.analyzeQuery = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const { datasetId, query, conversationId: incomingConvId } = req.body;
    if (!datasetId || !query) {
      return res.status(400).json({ error: "datasetId and query are required." });
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { schema: true },
    });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    if (dataset.userId !== userId) {
      return res.status(403).json({ error: "You do not have access to this dataset." });
    }
    if (dataset.status !== "READY") {
      return res.status(409).json({
        error: "Dataset is not ready yet. Cleaning still in progress.",
        status: dataset.status,
      });
    }

    // --- Resolve / create conversation, load history ---
    let conversation;
    let history = [];
    if (incomingConvId) {
      conversation = await conversationService.getConversation({
        conversationId: incomingConvId,
        userId,
      });
      if (conversation.datasetId !== datasetId) {
        return res.status(400).json({ error: "Conversation belongs to a different dataset." });
      }
      history = await conversationService.getHistoryForLLM(conversation.id);
    } else {
      conversation = await conversationService.createConversation({
        userId,
        datasetId,
        firstPrompt: query,
      });
    }

    // Persist the user turn up front so it shows in history even if AI fails
    await conversationService.appendMessage(conversation.id, {
      role: "user",
      content: query,
    });

    // --- Run AI with multi-turn history ---
    let aiConfig;
    try {
      aiConfig = await aiService.generateQuery(datasetId, query, { history });
    } catch (aiErr) {
      await conversationService.appendMessage(conversation.id, {
        role: "assistant",
        content: aiErr.message || "AI failed to respond.",
        errorMessage: aiErr.message,
      });
      throw aiErr;
    }

    const guard = validateReadOnlySql(aiConfig.sql);
    if (!guard.ok) {
      await conversationService.appendMessage(conversation.id, {
        role: "assistant",
        content: `Generated query was rejected: ${guard.reason}`,
        sql: aiConfig.sql,
        errorMessage: guard.reason,
      });
      return res.status(400).json({
        error: `Generated query rejected by SQL guard: ${guard.reason}`,
        sql: aiConfig.sql,
        conversationId: conversation.id,
      });
    }

    let rows;
    let usedRepair = false;
    try {
      rows = await runReadOnlyQuery(aiConfig.sql, { rowCap: ANALYZE_ROW_CAP });
    } catch (qErr) {
      // Single retry: ask Gemini to repair using the error message.
      // Skip retry on timeout (57014) — that's a perf issue, not a syntax one.
      if (qErr.code !== "57014") {
        try {
          const repaired = await aiService.repairQuery(
            datasetId,
            query,
            aiConfig.sql,
            qErr.message,
            { history }
          );
          const repairGuard = validateReadOnlySql(repaired.sql);
          if (repairGuard.ok) {
            rows = await runReadOnlyQuery(repaired.sql, { rowCap: ANALYZE_ROW_CAP });
            aiConfig = repaired;
            usedRepair = true;
          } else {
            throw qErr;
          }
        } catch (_repairErr) {
          await conversationService.appendMessage(conversation.id, {
            role: "assistant",
            content: `SQL execution failed: ${qErr.message}`,
            sql: aiConfig.sql,
            errorMessage: qErr.message,
          });
          return res.status(400).json({
            error: `SQL execution failed: ${qErr.message}`,
            sql: aiConfig.sql,
            conversationId: conversation.id,
          });
        }
      } else {
        await conversationService.appendMessage(conversation.id, {
          role: "assistant",
          content: `SQL execution timed out: ${qErr.message}`,
          sql: aiConfig.sql,
          errorMessage: qErr.message,
        });
        return res.status(504).json({
          error: `SQL execution failed: ${qErr.message}`,
          sql: aiConfig.sql,
          conversationId: conversation.id,
        });
      }
    }

    let emptyResult = false;
    let fallbackMessage = null;
    if (!rows || rows.length === 0) {
      emptyResult = true;
      fallbackMessage = "The query returned no results — here's a preview of your data instead.";
      rows = await runReadOnlyQuery(
        `SELECT * FROM ${dataset.tableName} LIMIT 50`,
        { rowCap: 50 }
      );
      aiConfig.chartType = "table";
    }

    const explanation = explainSql(aiConfig.sql);

    // Persist assistant turn
    await conversationService.appendMessage(conversation.id, {
      role: "assistant",
      content: aiConfig.overview || explanation,
      sql: aiConfig.sql,
      chartType: aiConfig.chartType,
      rowCount: rows.length,
    });

    res.json({
      data: coerceNumericValues(rows),
      config: aiConfig,
      explanation,
      emptyResult,
      fallbackMessage,
      conversationId: conversation.id,
      repaired: usedRepair,
    });
  } catch (error) {
    next(error);
  }
};

exports.listDatasets = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const datasets = await prisma.dataset.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        datasetName: true,
        tableName: true,
        status: true,
        createdAt: true,
      },
    });
    res.json({ datasets });
  } catch (error) {
    next(error);
  }
};

exports.getDataset = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const dataset = await prisma.dataset.findUnique({
      where: { id: req.params.id },
      include: { schema: { orderBy: { columnName: "asc" } } },
    });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    if (dataset.userId !== userId) {
      return res.status(403).json({ error: "You do not have access to this dataset." });
    }
    res.json({ dataset });
  } catch (error) {
    next(error);
  }
};

exports.renameDataset = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;
    const { datasetName } = req.body;
    if (!datasetName || !datasetName.trim()) {
      return res.status(400).json({ error: "datasetName required" });
    }
    const dataset = await prisma.dataset.findUnique({ where: { id: req.params.id } });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    if (dataset.userId !== userId) return res.status(403).json({ error: "Forbidden" });
    const updated = await prisma.dataset.update({
      where: { id: req.params.id },
      data: { datasetName: datasetName.trim() },
    });
    res.json({ dataset: updated });
  } catch (e) { next(e); }
};

exports.deleteDataset = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;
    const dataset = await prisma.dataset.findUnique({ where: { id: req.params.id } });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    if (dataset.userId !== userId) return res.status(403).json({ error: "Forbidden" });

    // Drop physical table, then prisma cascade removes the metadata.
    // tableName is generated server-side and matches ^ds_\d+_[a-z0-9]+$, so it's safe to inline.
    if (/^ds_\d+_[a-z0-9]+$/.test(dataset.tableName)) {
      await pool.query(`DROP TABLE IF EXISTS "${dataset.tableName}"`);
    }
    await prisma.dataset.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

exports.updateColumnDescription = async (req, res, next) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const { id: datasetId, colId } = req.params;
    const { description } = req.body;

    const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    if (dataset.userId !== userId) {
      return res.status(403).json({ error: "You do not have access to this dataset." });
    }

    const col = await prisma.datasetSchema.findUnique({ where: { id: colId } });
    if (!col || col.datasetId !== datasetId) {
      return res.status(404).json({ error: "Column not found" });
    }

    const updated = await prisma.datasetSchema.update({
      where: { id: colId },
      data: { description: (description || "").trim() || null },
    });
    res.json({ column: updated });
  } catch (error) {
    next(error);
  }
};
