const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeMaster = sequelize.define('FeeMaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  feeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dept: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  term: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'fees'
});

module.exports = FeeMaster;
