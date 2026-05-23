const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  experience: {
    type: DataTypes.INTEGER, // in years
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
  emergencyContact: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Active', 'On Leave', 'Suspended', 'Inactive'),
    defaultValue: 'Active',
  },
  performanceScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100, // out of 100
  }
}, {
  timestamps: true,
});

module.exports = Driver;
