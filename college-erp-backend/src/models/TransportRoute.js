const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bus = require('./Bus');

const TransportRoute = sequelize.define('TransportRoute', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  routeName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  startPoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endPoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stops: {
    type: DataTypes.JSON, // Array of strings or objects [{ name: 'Stop A', timing: '08:00 AM' }]
    allowNull: true,
  },
  distance: {
    type: DataTypes.FLOAT, // in km
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // in minutes
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Delayed'),
    defaultValue: 'Active',
  },
  busId: {
    type: DataTypes.INTEGER,
    references: {
      model: Bus,
      key: 'id'
    },
    allowNull: true
  }
}, {
  timestamps: true,
});

TransportRoute.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });
Bus.hasOne(TransportRoute, { foreignKey: 'busId', as: 'route' });

module.exports = TransportRoute;
