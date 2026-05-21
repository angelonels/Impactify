const conversationService = require("../services/conversationService");
const prisma = require("../config/db");
const { validateReadOnlySql } = require("../utils/sqlGuard");
const { runReadOnlyQuery } = require("../services/sqlRunner");

const ROW_CAP = parseInt(process.env.ANALYZE_ROW_CAP || "5000", 10);

const coerceNumericValues = (rows) => {
    if (!rows || rows.length === 0) return rows;
    return rows.map((row) => {
        const out = {};
        for (const [k, v] of Object.entries(row)) {
            if (v === null || v === undefined) out[k] = v;
            else if (typeof v === "string" && v.trim() !== "" && !isNaN(v)) out[k] = Number(v);
            else out[k] = v;
        }
        return out;
    });
};

const userIdOr401 = (req, res) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({ error: "Authentication required" });
        return null;
    }
    return req.user.id;
};

exports.list = async (req, res, next) => {
    try {
        const userId = userIdOr401(req, res);
        if (!userId) return;
        const datasetId = req.query.datasetId || undefined;
        const conversations = await conversationService.listConversations({ userId, datasetId });
        res.json({ conversations });
    } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
    try {
        const userId = userIdOr401(req, res);
        if (!userId) return;
        const conversation = await conversationService.getConversation({
            conversationId: req.params.id,
            userId,
        });
        res.json({ conversation });
    } catch (e) { next(e); }
};

exports.rename = async (req, res, next) => {
    try {
        const userId = userIdOr401(req, res);
        if (!userId) return;
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title required" });
        const conversation = await conversationService.renameConversation({
            conversationId: req.params.id,
            userId,
            title,
        });
        res.json({ conversation });
    } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
    try {
        const userId = userIdOr401(req, res);
        if (!userId) return;
        await conversationService.deleteConversation({
            conversationId: req.params.id,
            userId,
        });
        res.json({ success: true });
    } catch (e) { next(e); }
};

/**
 * Re-execute the SQL stored on a single assistant message.
 * Used by the client when loading a conversation history so historical
 * charts get fresh data instead of being SQL-only stubs.
 */
exports.executeMessage = async (req, res, next) => {
    try {
        const userId = userIdOr401(req, res);
        if (!userId) return;

        const message = await prisma.message.findUnique({
            where: { id: req.params.msgId },
            include: { conversation: true },
        });
        if (!message || message.conversationId !== req.params.id) {
            return res.status(404).json({ error: "Message not found" });
        }
        if (message.conversation.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        if (!message.sql) {
            return res.status(400).json({ error: "Message has no SQL to execute." });
        }

        const guard = validateReadOnlySql(message.sql);
        if (!guard.ok) {
            return res.status(400).json({ error: `SQL rejected: ${guard.reason}` });
        }

        const rows = await runReadOnlyQuery(message.sql, { rowCap: ROW_CAP });
        res.json({
            data: coerceNumericValues(rows),
            config: { sql: message.sql, chartType: message.chartType, overview: message.content },
        });
    } catch (e) { next(e); }
};
