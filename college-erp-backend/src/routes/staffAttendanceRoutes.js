const express = require('express');
const router = express.Router();
const staffAttendanceController = require('../controllers/staffAttendanceController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Only Admins can manage Staff Attendance
router.use(requireRole(['Super Admin', 'Admin']));

router.route('/')
  .get(staffAttendanceController.getAttendance)
  .post(staffAttendanceController.createAttendance);

router.route('/:id')
  .put(staffAttendanceController.updateAttendance)
  .delete(staffAttendanceController.deleteAttendance);

module.exports = router;
