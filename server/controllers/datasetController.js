const ingestionService = require('../services/ingestionService');
const cleanerService = require('../services/cleanerService');
const aiService = require('../services/aiService');
const pool = require('../config/pg');
const prisma = require('../config/db');

exports.uploadDataset = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const userId = req.user.id;

        const dataset = await ingestionService.ingestFile(req.file.path, userId, req.file.originalname);

        cleanerService.cleanDataset(dataset.id).catch(console.error);

        res.json({ success: true, datasetId: dataset.id, message: "Dataset uploaded and processing started." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.analyzeQuery = async (req, res) => {
    try {
        const { datasetId, query } = req.body;


        const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
        if (!dataset) return res.status(404).json({ error: "Dataset not found" });
        if (dataset.userId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

        const aiConfig = await aiService.generateQuery(datasetId, query);

        const { rows } = await pool.query(aiConfig.sql);

        res.json({ data: rows, config: aiConfig });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};