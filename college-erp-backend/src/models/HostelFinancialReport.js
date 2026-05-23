const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HostelFinancialReport = sequelize.define('HostelFinancialReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  totalRevenue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalExpenses: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  profit: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  loss: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  occupancyRevenue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  maintenanceCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
});

module.exports = HostelFinancialReport;
