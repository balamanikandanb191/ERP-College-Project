const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StaffDocument = sequelize.define('StaffDocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  staffId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'staff',
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
  tableName: 'staff_documents',
  timestamps: true,
});

module.exports = StaffDocument;
