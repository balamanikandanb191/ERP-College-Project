const express = require('express');
const router = express.Router();
const classAllocationController = require('../controllers/classAllocationController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.route('/')
  .get(classAllocationController.getAllAllocations)
  .post(requireRole(['Super Admin', 'Admin', 'Staff']), classAllocationController.createAllocation);

router.route('/:id')
  .put(requireRole(['Super Admin', 'Admin', 'Staff']), classAllocationController.updateAllocation)
  .delete(requireRole(['Super Admin', 'Admin']), classAllocationController.deleteAllocation);

module.exports = router;
