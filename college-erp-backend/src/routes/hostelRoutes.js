const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const hostelController = require('../controllers/hostelController');

// All hostel routes require admin/staff
router.use(authenticateToken);
router.use(requireRole(['Super Admin', 'Admin', 'Staff', 'Warden']));

// Analytics
router.get('/analytics', hostelController.getAnalytics);

// Rooms
router.get('/rooms', hostelController.getRooms);
router.post('/rooms', hostelController.createRoom);
router.put('/rooms/:id', hostelController.updateRoom);
router.delete('/rooms/:id', hostelController.deleteRoom);

// Wardens
router.get('/wardens', hostelController.getWardens);
router.post('/wardens', hostelController.createWarden);
router.put('/wardens/:id', hostelController.updateWarden);
router.delete('/wardens/:id', hostelController.deleteWarden);

// Students
router.get('/available-students', hostelController.getAvailableStudents);
router.get('/students', hostelController.getStudents);
router.post('/students', hostelController.createStudent);
router.put('/students/:id', hostelController.updateStudent);
router.delete('/students/:id', hostelController.deleteStudent);

// Complaints
router.get('/complaints', hostelController.getComplaints);
router.post('/complaints', hostelController.createComplaint);
router.put('/complaints/:id', hostelController.updateComplaint);
router.delete('/complaints/:id', hostelController.deleteComplaint);

// Expenses
router.get('/expenses', hostelController.getExpenses);
router.post('/expenses', hostelController.createExpense);
router.put('/expenses/:id', hostelController.updateExpense);
router.delete('/expenses/:id', hostelController.deleteExpense);

module.exports = router;
