const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Dashboard statistics
router.get('/dashboard-stats', enquiryController.getDashboardStats);

// Caller team performance statistics
router.get('/caller-stats', enquiryController.getCallerStats);

// General Enquiry CRUD
router.route('/')
  .get(enquiryController.getEnquiries)
  .post(enquiryController.createEnquiry);

router.route('/:id')
  .put(enquiryController.updateEnquiry)
  .delete(enquiryController.deleteEnquiry);

module.exports = router;
