const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  enrollment_no: {
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
  semester: {
    type: DataTypes.INTEGER,
  },
  batch_year: {
    type: DataTypes.STRING(20),
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'students'
});

module.exports = Student;
