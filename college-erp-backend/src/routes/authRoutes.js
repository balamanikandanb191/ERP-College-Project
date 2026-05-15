const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/me
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
