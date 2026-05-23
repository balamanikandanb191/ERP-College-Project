const express = require('express');
const router = express.Router();
const borrowRecordController = require('../controllers/borrowRecordController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.route('/')
  .get(borrowRecordController.getAllBorrowRecords)
  .post(requireRole(['Super Admin', 'Admin', 'Staff']), borrowRecordController.createBorrowRecord);

router.route('/:id')
  .put(requireRole(['Super Admin', 'Admin', 'Staff']), borrowRecordController.updateBorrowRecord)
  .delete(requireRole(['Super Admin', 'Admin']), borrowRecordController.deleteBorrowRecord);

module.exports = router;
