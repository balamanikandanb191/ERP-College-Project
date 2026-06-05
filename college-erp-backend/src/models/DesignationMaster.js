const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DesignationMaster = sequelize.define('DesignationMaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dept: {
    type: DataTypes.STRING,
    defaultValue: 'All'
  },
  gradePay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'Junior'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'designations'
});

module.exports = DesignationMaster;
