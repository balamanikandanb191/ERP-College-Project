const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const HostelWarden = require('./HostelWarden');

const HostelRoom = sequelize.define('HostelRoom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hostelBlock: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  floor: {
    type: DataTypes.INTEGER,
  },
  roomType: {
    type: DataTypes.ENUM('Single', 'Double', 'Triple', 'Quad', 'Dormitory'),
    defaultValue: 'Double',
  },
  totalBeds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  occupiedBeds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  roomStatus: {
    type: DataTypes.ENUM('Available', 'Full', 'Maintenance', 'Reserved'),
    defaultValue: 'Available',
  },
  monthlyFee: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.JSONB, // e.g. ['AC', 'Attached Bath', 'Balcony']
    defaultValue: [],
  },
  assignedWardenId: {
    type: DataTypes.INTEGER,
    references: {
      model: HostelWarden,
      key: 'id'
    },
    allowNull: true
  }
}, {
  timestamps: true,
});

module.exports = HostelRoom;
