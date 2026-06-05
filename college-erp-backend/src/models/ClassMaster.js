const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClassMaster = sequelize.define('ClassMaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  depts: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  maxSections: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  maxStrength: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  semType: {
    type: DataTypes.STRING,
    defaultValue: 'Semester'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'classes'
});

module.exports = ClassMaster;
