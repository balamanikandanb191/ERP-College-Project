const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentDocument = sequelize.define('StudentDocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'student_documents',
  timestamps: true,
});

module.exports = StudentDocument;
