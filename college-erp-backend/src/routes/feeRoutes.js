const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const feeController = require('../controllers/feeController');

router.use(authenticateToken);

// Analytics
router.get('/analytics', requireRole(['Super Admin', 'Admin', 'Staff']), feeController.getAnalytics);

// Fee Structures
router.get('/structures', requireRole(['Super Admin', 'Admin', 'Staff']), feeController.getFeeStructures);
router.post('/structures', requireRole(['Super Admin', 'Admin']), feeController.createFeeStructure);
router.put('/structures/:id', requireRole(['Super Admin', 'Admin']), feeController.updateFeeStructure);
router.delete('/structures/:id', requireRole(['Super Admin', 'Admin']), feeController.deleteFeeStructure);

// Student Fees
router.get('/students', requireRole(['Super Admin', 'Admin', 'Staff', 'Student']), feeController.getStudentFees);
router.post('/students', requireRole(['Super Admin', 'Admin']), feeController.assignFeeToStudent);

// Payments
router.get('/payments', requireRole(['Super Admin', 'Admin', 'Staff']), feeController.getPayments);
router.post('/payments', requireRole(['Super Admin', 'Admin', 'Staff']), feeController.recordPayment);

module.exports = router;
