const express = require('express');
const passport = require('passport');
const { register, login, googleCallback, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/register', register);
router.post('/login', login);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);


router.get('/me', authMiddleware, getMe);

module.exports = router;
