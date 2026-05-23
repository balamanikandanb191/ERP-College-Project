const express = require('express');
const router = express.Router();
const libraryAnalyticsController = require('../controllers/libraryAnalyticsController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', requireRole(['Super Admin', 'Admin', 'Staff']), libraryAnalyticsController.getAnalytics);

module.exports = router;
