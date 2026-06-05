const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentAttendance = sequelize.define('StudentAttendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late'),
    allowNull: false,
    defaultValue: 'Present',
  },
  course_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  semester_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  period_hour: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  marked_by: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'User ID of the staff/admin who marked attendance'
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'student_attendance',
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'date', 'subject_id', 'period_hour'],
      name: 'unique_student_attendance_subject_period'
    }
  ]
});

module.exports = StudentAttendance;
