const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
  },
  last_name: {
    type: DataTypes.STRING(100),
  },
  department: {
    type: DataTypes.STRING(100),
  },
  designation: {
    type: DataTypes.STRING(100),
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'staff'
});

module.exports = Staff;
