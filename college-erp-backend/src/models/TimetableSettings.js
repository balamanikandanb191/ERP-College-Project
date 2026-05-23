const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimetableSettings = sequelize.define('TimetableSettings', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  totalPeriods: { type: DataTypes.INTEGER, defaultValue: 8 },
  breakAfterPeriod: { type: DataTypes.INTEGER, defaultValue: 4 },
  collegeStartTime: { type: DataTypes.TIME, defaultValue: '09:00:00' },
  collegeEndTime: { type: DataTypes.TIME, defaultValue: '16:00:00' },
  workingDays: { type: DataTypes.JSON, defaultValue: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
}, {
  timestamps: true,
  tableName: 'timetable_settings'
});

module.exports = TimetableSettings;
