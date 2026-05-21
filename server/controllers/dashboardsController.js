const prisma = require("../config/db");

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
        const dashboards = await prisma.dashboard.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: { _count: { select: { items: true } } },
        });
        res.json({ dashboards });
    } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const dashboard = await prisma.dashboard.findUnique({
            where: { id: req.params.id },
            include: { items: { include: { savedInsight: true } } },
        });
        if (!dashboard) return res.status(404).json({ error: "Dashboard not found" });
        if (dashboard.userId !== userId) return res.status(403).json({ error: "Forbidden" });
        res.json({ dashboard });
    } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "name required" });
        const dashboard = await prisma.dashboard.create({ data: { userId, name } });
        res.status(201).json({ dashboard });
    } catch (e) { next(e); }
};

exports.rename = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const existing = await prisma.dashboard.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ error: "Dashboard not found" });
        if (existing.userId !== userId) return res.status(403).json({ error: "Forbidden" });
        const { name } = req.body;
        const dashboard = await prisma.dashboard.update({
            where: { id: req.params.id },
            data: { name },
        });
        res.json({ dashboard });
    } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const existing = await prisma.dashboard.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ error: "Dashboard not found" });
        if (existing.userId !== userId) return res.status(403).json({ error: "Forbidden" });
        await prisma.dashboard.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { next(e); }
};

exports.addItem = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const dashboard = await prisma.dashboard.findUnique({ where: { id: req.params.id } });
        if (!dashboard) return res.status(404).json({ error: "Dashboard not found" });
        if (dashboard.userId !== userId) return res.status(403).json({ error: "Forbidden" });

        const { savedInsightId, x = 0, y = 0, w = 6, h = 4 } = req.body;
        const insight = await prisma.savedInsight.findUnique({ where: { id: savedInsightId } });
        if (!insight || insight.userId !== userId) return res.status(404).json({ error: "Insight not found" });

        const item = await prisma.dashboardItem.create({
            data: { dashboardId: dashboard.id, savedInsightId, x, y, w, h },
        });
        await prisma.dashboard.update({ where: { id: dashboard.id }, data: { updatedAt: new Date() } });
        res.status(201).json({ item });
    } catch (e) { next(e); }
};

exports.removeItem = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const item = await prisma.dashboardItem.findUnique({
            where: { id: req.params.itemId },
            include: { dashboard: true },
        });
        if (!item) return res.status(404).json({ error: "Item not found" });
        if (item.dashboard.userId !== userId) return res.status(403).json({ error: "Forbidden" });
        await prisma.dashboardItem.delete({ where: { id: item.id } });
        res.json({ success: true });
    } catch (e) { next(e); }
};

exports.updateLayout = async (req, res, next) => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;
        const dashboard = await prisma.dashboard.findUnique({ where: { id: req.params.id } });
        if (!dashboard) return res.status(404).json({ error: "Dashboard not found" });
        if (dashboard.userId !== userId) return res.status(403).json({ error: "Forbidden" });

        const { items } = req.body;
        if (!Array.isArray(items)) return res.status(400).json({ error: "items[] required" });

        const updates = items.map((it) =>
            prisma.dashboardItem.update({
                where: { id: it.id },
                data: { x: it.x, y: it.y, w: it.w, h: it.h },
            })
        );
        await prisma.$transaction(updates);
        await prisma.dashboard.update({ where: { id: dashboard.id }, data: { updatedAt: new Date() } });
        res.json({ success: true });
    } catch (e) { next(e); }
};
