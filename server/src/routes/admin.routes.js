const router = require('express').Router();
const { stats, users } = require('../controllers/admin.controller');

router.get('/stats', stats);
router.get('/users', users);

module.exports = router;


