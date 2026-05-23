const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const HostelRoom = require('./HostelRoom');
const Student = require('./Student'); // Reusing existing Student model

const HostelStudent = sequelize.define('HostelStudent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.UUID, // Matching existing Student model PK
    references: {
      model: Student,
      key: 'id'
    },
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: HostelRoom,
      key: 'id'
    },
    allowNull: false,
  },
  bedNumber: {
    type: DataTypes.STRING,
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  expectedCheckoutDate: {
    type: DataTypes.DATEONLY,
  },
  actualCheckoutDate: {
    type: DataTypes.DATEONLY,
  },
  guardianName: {
    type: DataTypes.STRING,
  },
  guardianPhone: {
    type: DataTypes.STRING,
  },
  emergencyContact: {
    type: DataTypes.STRING,
  },
  hostelStatus: {
    type: DataTypes.ENUM('Checked In', 'Checked Out', 'On Leave', 'Expelled'),
    defaultValue: 'Checked In',
  },
  feeStatus: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Overdue'),
    defaultValue: 'Pending',
  },
  monthlyFeePaid: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  pendingAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  }
}, {
  timestamps: true,
});

module.exports = HostelStudent;
