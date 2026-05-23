const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const HostelRoom = require('./HostelRoom');
const Student = require('./Student'); // Optional for reporting student

const HostelComplaint = sequelize.define('HostelComplaint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.UUID,
    references: {
      model: Student,
      key: 'id'
    },
    allowNull: true, // Complaint could be general
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: HostelRoom,
      key: 'id'
    },
    allowNull: true,
  },
  complaintTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Low',
  },
  status: {
    type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
    defaultValue: 'Open',
  },
  resolvedAt: {
    type: DataTypes.DATE,
  }
}, {
  timestamps: true,
});

module.exports = HostelComplaint;
