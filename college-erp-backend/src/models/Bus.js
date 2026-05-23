const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Driver = require('./Driver');

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  busName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  occupancy: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  condition: {
    type: DataTypes.ENUM('Excellent', 'Good', 'Maintenance', 'Critical', 'Not Running'),
    defaultValue: 'Good',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Delayed', 'Offline', 'In Service'),
    defaultValue: 'Offline',
  },
  fuelType: {
    type: DataTypes.ENUM('Diesel', 'Petrol', 'Electric', 'CNG'),
    defaultValue: 'Diesel',
  },
  insuranceExpiry: {
    type: DataTypes.DATEONLY,
  },
  lastMaintenanceDate: {
    type: DataTypes.DATEONLY,
  },
  assignedDriverId: {
    type: DataTypes.INTEGER,
    references: {
      model: Driver,
      key: 'id'
    },
    allowNull: true
  }
}, {
  timestamps: true,
});

Bus.belongsTo(Driver, { foreignKey: 'assignedDriverId', as: 'driver' });
Driver.hasOne(Bus, { foreignKey: 'assignedDriverId', as: 'assignedBus' });

module.exports = Bus;
