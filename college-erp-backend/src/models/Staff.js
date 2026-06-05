const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // 1. Personal Details
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  staffId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gender: {
    type: DataTypes.STRING,
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  bloodGroup: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  alternatePhone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  officialEmail: {
    type: DataTypes.STRING,
    unique: true,
  },
  maritalStatus: {
    type: DataTypes.STRING,
  },
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'Indian',
  },
  aadhaarNumber: {
    type: DataTypes.STRING,
  },
  panNumber: {
    type: DataTypes.STRING,
  },
  religion: {
    type: DataTypes.STRING,
  },
  community: {
    type: DataTypes.STRING,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },

  // 2. Professional Details
  department: {
    type: DataTypes.STRING,
  },
  designation: {
    type: DataTypes.STRING,
  },
  teachingType: {
    type: DataTypes.ENUM('Teaching', 'Non-Teaching'),
    defaultValue: 'Teaching',
  },
  qualification: {
    type: DataTypes.STRING,
  },
  specialization: {
    type: DataTypes.STRING,
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
  },
  employmentType: {
    type: DataTypes.STRING, // Permanent, Contract, etc.
  },
  role: {
    type: DataTypes.STRING, // Professor, HOD, etc.
  },
  assignedSubjects: {
    type: DataTypes.TEXT, // Can store as comma separated or JSON string
  },
  timetableHandling: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  employeeStatus: {
    type: DataTypes.ENUM('Active', 'On Leave', 'Suspended'),
    defaultValue: 'Active',
  },

  // 3. Salary & Employment
  basicSalary: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  allowances: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  salary: { // Total Salary (Calculated)
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bankName: {
    type: DataTypes.STRING,
  },
  accountNumber: {
    type: DataTypes.STRING,
  },
  ifscCode: {
    type: DataTypes.STRING,
  },
  pfNumber: {
    type: DataTypes.STRING,
  },
  salaryType: {
    type: DataTypes.ENUM('Monthly', 'Hourly'),
    defaultValue: 'Monthly',
  },
  workingHours: {
    type: DataTypes.STRING,
  },
  weeklyOff: {
    type: DataTypes.STRING,
  },

  // 4. Address & Emergency
  permanentAddress: {
    type: DataTypes.TEXT,
  },
  currentAddress: {
    type: DataTypes.TEXT,
  },
  address: { // Legacy field
    type: DataTypes.TEXT,
  },
  guardianName: {
    type: DataTypes.STRING,
  },
  emergencyPhone: {
    type: DataTypes.STRING,
  },
  emergencyAddress: {
    type: DataTypes.TEXT,
  },

  // 5. System Access
  username: {
    type: DataTypes.STRING,
    unique: true,
  },
  allowLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  status: { // Legacy status field
    type: DataTypes.STRING,
    defaultValue: 'Active',
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'staff'
});

module.exports = Staff;
