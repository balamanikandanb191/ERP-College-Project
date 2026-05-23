const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HostelExpense = sequelize.define('HostelExpense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expenseTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('Electricity', 'Water', 'Internet', 'Food', 'Cleaning', 'Maintenance', 'Security', 'Salaries', 'Furniture', 'Repairs', 'Other'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  paidTo: {
    type: DataTypes.STRING,
  },
  paymentMethod: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  }
}, {
  timestamps: true,
});

module.exports = HostelExpense;
