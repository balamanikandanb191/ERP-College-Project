const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentFee = sequelize.define('StudentFee', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: { type: DataTypes.UUID, allowNull: false },
  feeStructureId: { type: DataTypes.UUID, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  paidAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  dueAmount: { type: DataTypes.FLOAT, allowNull: false },
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'Unpaid' }, // Paid, Unpaid, Partial, Overdue
  fineAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  remarks: { type: DataTypes.TEXT }
}, {
  timestamps: true,
  tableName: 'student_fees'
});

module.exports = StudentFee;
