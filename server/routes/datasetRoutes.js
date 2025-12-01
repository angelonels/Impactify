const express = require('express');
const router = express.router(); 
const multer = require('multer');
const datasetController = require('../controllers/datasetController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), datasetController.uploadDataset);

router.post('/analyze', datasetController.analyzeQuery);

module.exports = router;