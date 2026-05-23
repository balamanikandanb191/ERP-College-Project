const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BorrowRecord = sequelize.define('BorrowRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  borrowerType: {
    type: DataTypes.ENUM('Student', 'Staff'),
    allowNull: false,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  staffId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  bookId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  borrowDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  actualReturnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fineAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('Borrowed', 'Returned', 'Overdue'),
    allowNull: false,
    defaultValue: 'Borrowed',
  }
}, {
  timestamps: true,
  tableName: 'borrow_records'
});

module.exports = BorrowRecord;
