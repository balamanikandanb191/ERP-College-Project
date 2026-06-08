const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Protect all routes
router.use(authenticateToken);

router.route('/')
  .get(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), staffController.getAllStaff)
  .post(requireRole(['Super Admin', 'Admin']), staffController.createStaff);

router.route('/:id')
  .get(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), staffController.getStaffById)
  .put(requireRole(['Super Admin', 'Admin']), staffController.updateStaff)
  .delete(requireRole(['Super Admin', 'Admin']), staffController.deleteStaff);

module.exports = router;
