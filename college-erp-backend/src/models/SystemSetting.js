const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemSetting = sequelize.define('SystemSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  group: {
    type: DataTypes.STRING, // e.g., 'institution', 'branding', 'attendance'
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT, // Using TEXT to store JSON or large strings
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING, // 'string', 'number', 'boolean', 'json', 'image'
    defaultValue: 'string',
  }
}, {
  timestamps: true,
  tableName: 'system_settings'
});

module.exports = SystemSetting;
