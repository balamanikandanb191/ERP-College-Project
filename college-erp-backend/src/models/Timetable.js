const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timetable = sequelize.define('Timetable', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  staffId: { type: DataTypes.UUID, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING, allowNull: false },
  day: { type: DataTypes.STRING, allowNull: false },
  periodNumber: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  roomNumber: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.STRING, allowNull: false },
  academicYear: { type: DataTypes.STRING, defaultValue: '2025-2026' },
  status: { type: DataTypes.STRING, defaultValue: 'Scheduled' } // Scheduled, Cancelled, Substitute
}, {
  timestamps: true,
  tableName: 'timetables'
});

module.exports = Timetable;
