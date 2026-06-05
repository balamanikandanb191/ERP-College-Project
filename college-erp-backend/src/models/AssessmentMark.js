const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssessmentMark = sequelize.define('AssessmentMark', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  register_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roll_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assessment_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  assessment_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assessment_number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  staff_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  staff_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  marks_obtained: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  max_marks: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observation_mark: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  record_mark: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  viva_mark: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  practical_mark: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Present'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'assessment_marks'
});

module.exports = AssessmentMark;
