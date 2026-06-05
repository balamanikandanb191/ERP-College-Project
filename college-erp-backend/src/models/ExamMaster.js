const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamMaster = sequelize.define('ExamMaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maxMarks: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  passMark: {
    type: DataTypes.INTEGER,
    defaultValue: 40
  },
  month: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gpaWeight: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'exams'
});

module.exports = ExamMaster;
