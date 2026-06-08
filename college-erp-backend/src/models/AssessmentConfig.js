const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssessmentConfig = sequelize.define('AssessmentConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section: {
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
  assessment_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assessment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  max_marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  assessment_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  staff_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  staff_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experiment_count: {
    type: DataTypes.INTEGER,
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
  tableName: 'assessment_configs'
});

module.exports = AssessmentConfig;
