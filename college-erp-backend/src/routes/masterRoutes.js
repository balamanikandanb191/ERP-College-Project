const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const masterController = require('../controllers/masterController');

router.use(authenticateToken);

// GET /api/masters/:type
router.get('/:type', requireRole(['Super Admin', 'Admin', 'Staff', 'Teacher']), masterController.getMasters);

// POST /api/masters/:type
router.post('/:type', requireRole(['Super Admin', 'Admin', 'Staff']), masterController.createMaster);

// PUT /api/masters/:type/:id
router.put('/:type/:id', requireRole(['Super Admin', 'Admin', 'Staff']), masterController.updateMaster);

// DELETE /api/masters/:type/:id
router.delete('/:type/:id', requireRole(['Super Admin', 'Admin']), masterController.deleteMaster);

module.exports = router;
