const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HostelWarden = sequelize.define('HostelWarden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  assignedBlock: {
    type: DataTypes.STRING,
  },
  experienceYears: {
    type: DataTypes.INTEGER,
  },
  address: {
    type: DataTypes.TEXT,
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('Active', 'On Leave', 'Inactive'),
    defaultValue: 'Active',
  }
}, {
  timestamps: true,
});

module.exports = HostelWarden;
