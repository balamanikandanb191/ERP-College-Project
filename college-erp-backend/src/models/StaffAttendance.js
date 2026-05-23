const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StaffAttendance = sequelize.define('StaffAttendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Leave'),
    allowNull: false,
    defaultValue: 'Present',
  },
  marked_by: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'User ID of the admin who marked attendance'
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'staff_attendance',
  indexes: [
    {
      unique: true,
      fields: ['staff_id', 'date'],
      name: 'unique_staff_attendance_per_day'
    }
  ]
});

module.exports = StaffAttendance;
