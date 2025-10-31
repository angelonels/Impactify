const router = require('express').Router();
const { translate, execute } = require('../controllers/ai.controller');

router.post('/translate', translate);
router.post('/execute', execute);

module.exports = router;


