const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeStructure = sequelize.define('FeeStructure', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  finePerDay: { type: DataTypes.FLOAT, defaultValue: 0 },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
}, {
  timestamps: true,
  tableName: 'fee_structures'
});

module.exports = FeeStructure;
