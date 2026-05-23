const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const timetableController = require('../controllers/timetableController');

router.use(authenticateToken);

// Analytics
router.get('/analytics', requireRole(['Super Admin', 'Admin']), timetableController.getAnalytics);

// Settings
router.get('/settings', requireRole(['Super Admin', 'Admin']), timetableController.getSettings);
router.put('/settings', requireRole(['Super Admin', 'Admin']), timetableController.updateSettings);

// Timetables
router.get('/my-schedule', requireRole(['Staff', 'Teacher']), timetableController.getMySchedule);
router.get('/', requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), timetableController.getTimetables);
router.post('/', requireRole(['Super Admin', 'Admin']), timetableController.createTimetable);
router.put('/:id', requireRole(['Super Admin', 'Admin']), timetableController.updateTimetable);
router.delete('/:id', requireRole(['Super Admin', 'Admin']), timetableController.deleteTimetable);

module.exports = router;
