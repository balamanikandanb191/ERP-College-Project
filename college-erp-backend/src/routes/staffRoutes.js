const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Protect all routes
router.use(authenticateToken);

// For staff, restrict everything to Admin and Super Admin for now
router.use(requireRole(['Super Admin', 'Admin']));

router.route('/')
  .get(staffController.getAllStaff)
  .post(staffController.createStaff);

router.route('/:id')
  .get(staffController.getStaffById)
  .put(staffController.updateStaff)
  .delete(staffController.deleteStaff);

module.exports = router;
