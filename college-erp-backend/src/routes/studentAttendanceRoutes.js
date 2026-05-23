const express = require('express');
const router = express.Router();
const studentAttendanceController = require('../controllers/studentAttendanceController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.route('/')
  .get(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), studentAttendanceController.getAttendance)
  .post(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), studentAttendanceController.createAttendance);

router.route('/:id')
  .put(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), studentAttendanceController.updateAttendance)
  .delete(requireRole(['Super Admin', 'Admin']), studentAttendanceController.deleteAttendance);

module.exports = router;
