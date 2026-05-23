const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeePaymentHistory = sequelize.define('FeePaymentHistory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentFeeId: { type: DataTypes.UUID, allowNull: false },
  amountPaid: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  transactionId: { type: DataTypes.STRING },
  collectedBy: { type: DataTypes.UUID },
  receiptNumber: { type: DataTypes.STRING, unique: true },
  paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: true,
  tableName: 'fee_payment_history'
});

module.exports = FeePaymentHistory;
