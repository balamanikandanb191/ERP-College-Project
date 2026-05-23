const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// All settings routes are typically admin-only in a real app
// For now, keeping them simple
router.get('/', settingController.getAllSettings);
router.get('/group/:group', settingController.getSettingsByGroup);
router.post('/bulk', settingController.updateSettingsBulk);
router.put('/:key', settingController.updateSetting);

module.exports = router;
