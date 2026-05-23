const { SystemSetting } = require('../models');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findAll();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
};

// @desc    Get settings by group
// @route   GET /api/settings/group/:group
// @access  Private/Admin
exports.getSettingsByGroup = async (req, res) => {
  try {
    const settings = await SystemSetting.findAll({
      where: { group: req.params.group }
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings group:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
};

// @desc    Update or create settings (bulk)
// @route   POST /api/settings/bulk
// @access  Private/Admin
exports.updateSettingsBulk = async (req, res) => {
  try {
    const { settings } = req.body; // Array of { group, key, value, type }
    
    if (!Array.isArray(settings)) {
      return res.status(400).json({ message: 'Invalid settings format' });
    }

    for (const item of settings) {
      const { group, key, value, type } = item;
      
      const existing = await SystemSetting.findOne({ where: { key } });
      
      if (existing) {
        await existing.update({ group, value, type });
      } else {
        await SystemSetting.create({ group, key, value, type });
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
};

// @desc    Update a single setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { group, value, type } = req.body;

    const existing = await SystemSetting.findOne({ where: { key } });
    
    if (existing) {
      await existing.update({ group, value, type });
      res.json(existing);
    } else {
      const created = await SystemSetting.create({ group, key, value, type });
      res.status(201).json(created);
    }
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Server error while updating setting' });
  }
};
