const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Announcements
router.get('/announcements', communicationController.getAnnouncements);
router.post('/announcements', authorizeRole(['Admin', 'Super Admin']), communicationController.createAnnouncement);
router.get('/announcements/analytics', communicationController.getAnnouncementAnalytics);

// Calendar
router.get('/calendar', communicationController.getCalendarEvents);

// Notifications
router.get('/notifications', communicationController.getNotifications);
router.put('/notifications/:id/read', communicationController.markNotificationRead);

module.exports = router;
