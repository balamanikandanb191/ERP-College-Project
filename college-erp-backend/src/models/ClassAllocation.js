const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClassAllocation = sequelize.define('ClassAllocation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classroomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classAdvisor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assignedFaculty: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  labAllocation: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'None',
  },
  currentStrength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Occupied',
  },
  timetableSyncStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Synced',
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'class_allocations'
});

module.exports = ClassAllocation;
