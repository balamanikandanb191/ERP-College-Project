const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Caste = sequelize.define('Caste', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  casteName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'castes'
});

module.exports = Caste;
