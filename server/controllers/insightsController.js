const prisma = require("../config/db");
const { validateReadOnlySql } = require("../utils/sqlGuard");
const { runReadOnlyQuery } = require("../services/sqlRunner");

const ANALYZE_ROW_CAP = parseInt(process.env.ANALYZE_ROW_CAP || "5000", 10);

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

const requireUser = (req, res) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({ error: "Authentication required" });
        return null;
    }
    return req.user.id;
};

exports.list = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const where = { userId };
        if (req.query.datasetId) where.datasetId = req.query.datasetId;
        const insights = await prisma.savedInsight.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { dataset: { select: { datasetName: true, status: true } } },
        });
        res.json({ insights });
    } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const { datasetId, title, sql, chartType, overview } = req.body;
        if (!datasetId || !title || !sql || !chartType) {
            return res.status(400).json({ error: "datasetId, title, sql, chartType required" });
        }
        const guard = validateReadOnlySql(sql);
        if (!guard.ok) return res.status(400).json({ error: `SQL rejected: ${guard.reason}` });

        const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
        if (!dataset) return res.status(404).json({ error: "Dataset not found" });
        if (dataset.userId !== userId) return res.status(403).json({ error: "Forbidden" });

        const insight = await prisma.savedInsight.create({
            data: { userId, datasetId, title, sql, chartType, overview },
        });
        res.status(201).json({ insight });
    } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const ins = await prisma.savedInsight.findUnique({ where: { id: req.params.id } });
        if (!ins) return res.status(404).json({ error: "Insight not found" });
        if (ins.userId !== userId) return res.status(403).json({ error: "Forbidden" });
        await prisma.savedInsight.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { next(e); }
};

exports.execute = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const ins = await prisma.savedInsight.findUnique({ where: { id: req.params.id } });
        if (!ins) return res.status(404).json({ error: "Insight not found" });
        if (ins.userId !== userId) return res.status(403).json({ error: "Forbidden" });

        const guard = validateReadOnlySql(ins.sql);
        if (!guard.ok) return res.status(400).json({ error: `SQL rejected: ${guard.reason}` });

        const rows = await runReadOnlyQuery(ins.sql, { rowCap: ANALYZE_ROW_CAP });
        res.json({
            insight: ins,
            data: coerceNumericValues(rows),
            config: { sql: ins.sql, chartType: ins.chartType, overview: ins.overview },
        });
    } catch (e) { next(e); }
};
