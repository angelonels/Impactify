const router = require('express').Router();
const { upload, profile, commit } = require('../controllers/dataset.controller');

router.post('/upload', upload);
router.post('/:id/profile', profile);
router.post('/:id/commit', commit);

module.exports = router;


