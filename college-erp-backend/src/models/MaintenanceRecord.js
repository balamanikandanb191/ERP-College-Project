const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bus = require('./Bus');

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  busId: {
    type: DataTypes.INTEGER,
    references: {
      model: Bus,
      key: 'id'
    },
    allowNull: false,
  },
  issueType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  repairCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  serviceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  nextServiceDate: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Completed',
  }
}, {
  timestamps: true,
});

MaintenanceRecord.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });
Bus.hasMany(MaintenanceRecord, { foreignKey: 'busId', as: 'maintenanceHistory' });

module.exports = MaintenanceRecord;
