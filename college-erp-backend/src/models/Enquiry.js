const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enquiry = sequelize.define('Enquiry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eqid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentMobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doorNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  streetName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  village: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  post: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taluk: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pinCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  annualIncome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  community: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  schoolType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currentStandard: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  neededStandard: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  studentRegNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transport: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hostel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('New', 'Follow-up', 'Interested', 'Confirmed', 'Rejected', 'Closed'),
    defaultValue: 'New',
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  schoolAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tenantId: {
    type: DataTypes.STRING,
    defaultValue: 'Tenant',
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  staffId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  staffName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  calls: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  enquiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'enquiries'
});

module.exports = Enquiry;
