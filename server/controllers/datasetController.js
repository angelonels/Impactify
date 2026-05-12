const ingestionService = require("../services/ingestionService");
const cleanerService = require("../services/cleanerService");
const aiService = require("../services/aiService");
const pool = require("../config/pg");
const prisma = require("../config/db");

/**
 * Coerces stringified numeric values from PostgreSQL into actual JS numbers.
 *
 * The node-postgres driver returns bigint, numeric, and aggregate results
 * (SUM, COUNT, AVG) as strings to avoid floating-point precision loss.
 * This is correct behavior for the driver, but it breaks every frontend
 * chart component that relies on `typeof value === 'number'` to detect
 * which columns are plottable axes vs. category labels.
 *
 * @param {Object[]} rows - Raw rows from pg query result.
 * @returns {Object[]} Rows with numeric strings parsed into JS numbers.
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

exports.uploadDataset = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let userId;
    if (req.user) {
      userId = req.user.id;
    } else {
      // Default to the first user in the database for unauthenticated uploads
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        // If no user exists, create a temporary guest user
        const guestUser = await prisma.user.create({
          data: {
            email: `guest_${Date.now()}@example.com`,
            name: "Guest User",
            role: "GUEST",
            authProvider: "EMAIL",
          },
        });
        userId = guestUser.id;
      } else {
        userId = defaultUser.id;
      }
    }

    const dataset = await ingestionService.ingestFile(
      req.file.path,
      userId,
      req.file.originalname
    );

    cleanerService.cleanDataset(dataset.id).catch(console.error);

    res.json({
      success: true,
      datasetId: dataset.id,
      message: "Dataset uploaded and processing started.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeQuery = async (req, res) => {
  try {
    const { datasetId, query } = req.body;

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
    });
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });

    const aiConfig = await aiService.generateQuery(datasetId, query);

    let { rows } = await pool.query(aiConfig.sql);

    // If the AI query returned no rows, fall back to a raw table preview.
    // This happens when the user's dataset has sparse/null data and the AI
    // generates over-restrictive WHERE clauses.
    let emptyResult = false;
    let fallbackMessage = null;
    if (!rows || rows.length === 0) {
      emptyResult = true;
      fallbackMessage = "The query returned no results — here's a preview of your data instead.";
      const fallback = await pool.query(
        `SELECT * FROM ${dataset.tableName} LIMIT 50`
      );
      rows = fallback.rows;
      aiConfig.chartType = "table"; // table is the only sensible fallback
    }

    res.json({
      data: coerceNumericValues(rows),
      config: aiConfig,
      emptyResult,
      fallbackMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

