const express = require('express');
const router = express.Router();
const idCardController = require('../controllers/idCardController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Protect all routes under /api/id-cards
router.use(authenticateToken);

// Restrict to roles that can manage or generate ID cards
router.get('/students', requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), idCardController.getIdCardStudents);
router.get('/staff', requireRole(['Super Admin', 'Admin', 'Staff']), idCardController.getIdCardStaff);

module.exports = router;
