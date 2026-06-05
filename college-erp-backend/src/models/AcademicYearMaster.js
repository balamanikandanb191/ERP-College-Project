const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYearMaster = sequelize.define('AcademicYearMaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  admissionStart: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  admissionEnd: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'academic_years'
});

module.exports = AcademicYearMaster;
