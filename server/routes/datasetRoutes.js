const express = require('express');
const router = express.Router();
const multer = require('multer');
const datasetController = require('../controllers/datasetController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
    fileFilter: (req, file, cb) => {
        const ok = /\.(csv|xlsx|xls)$/i.test(file.originalname);
        cb(ok ? null : new Error("Only CSV, XLSX, or XLS files are allowed."), ok);
    },
});

router.post('/upload', authMiddleware, upload.single('file'), datasetController.uploadDataset);
router.post('/analyze', authMiddleware, datasetController.analyzeQuery);
router.get('/list', authMiddleware, datasetController.listDatasets);
router.get('/:id', authMiddleware, datasetController.getDataset);
router.patch('/:id', authMiddleware, datasetController.renameDataset);
router.delete('/:id', authMiddleware, datasetController.deleteDataset);
router.patch('/:id/schema/:colId', authMiddleware, datasetController.updateColumnDescription);

module.exports = router;