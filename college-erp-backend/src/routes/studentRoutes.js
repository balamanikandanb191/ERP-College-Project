const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Protect all routes
router.use(authenticateToken);

router.route('/')
  .get(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), studentController.getStudents)
  .post(requireRole(['Super Admin', 'Admin', 'Staff']), studentController.createStudent);

router.route('/:id')
  .get(requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher', 'Student', 'Parent']), studentController.getStudentById)
  .put(requireRole(['Super Admin', 'Admin', 'Staff']), studentController.updateStudent)
  .delete(requireRole(['Super Admin', 'Admin']), studentController.deleteStudent);

module.exports = router;
