const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // 1. Personal Information
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registerNumber: {
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
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'Indian',
  },
  religion: {
    type: DataTypes.STRING,
  },
  community: {
    type: DataTypes.STRING,
  },
  aadhaarNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  idMark1: {
    type: DataTypes.STRING,
  },
  idMark2: {
    type: DataTypes.STRING,
  },
  photoUrl: {
    type: DataTypes.TEXT('long'),
  },

  // 2. Academic Information
  department: {
    type: DataTypes.STRING,
  },
  course: {
    type: DataTypes.STRING,
  },
  degree: {
    type: DataTypes.STRING,
  },
  academicYear: {
    type: DataTypes.STRING,
  },
  semester: {
    type: DataTypes.STRING,
  },
  section: {
    type: DataTypes.STRING,
  },
  admissionType: {
    type: DataTypes.STRING,
  },
  previousInstitution: {
    type: DataTypes.STRING,
  },
  percentage10th: {
    type: DataTypes.FLOAT,
  },
  percentage12th: {
    type: DataTypes.FLOAT,
  },
  cutoffMark: {
    type: DataTypes.FLOAT,
  },
  entranceScore: {
    type: DataTypes.FLOAT,
  },
  tcNumber: {
    type: DataTypes.STRING,
  },
  admissionDate: {
    type: DataTypes.DATEONLY,
  },

  // 3. Parent / Guardian Details
  fatherName: {
    type: DataTypes.STRING,
  },
  fatherPhone: {
    type: DataTypes.STRING,
  },
  fatherOccupation: {
    type: DataTypes.STRING,
  },
  fatherIncome: {
    type: DataTypes.STRING,
  },
  motherName: {
    type: DataTypes.STRING,
  },
  motherPhone: {
    type: DataTypes.STRING,
  },
  motherOccupation: {
    type: DataTypes.STRING,
  },
  guardianName: {
    type: DataTypes.STRING,
  },
  emergencyContact: {
    type: DataTypes.STRING,
  },
  parentAddress: {
    type: DataTypes.TEXT,
  },

  // 4. Address Information
  permanentAddress: {
    type: DataTypes.TEXT,
  },
  communicationAddress: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  pincode: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'India',
  },

  // 5. Hostel & Transport
  hostelRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  roomPreference: {
    type: DataTypes.STRING,
  },
  busRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  busRoute: {
    type: DataTypes.STRING,
  },
  pickupPoint: {
    type: DataTypes.STRING,
  },

  // 6. Medical Information
  disabilityDetails: {
    type: DataTypes.TEXT,
  },
  allergies: {
    type: DataTypes.TEXT,
  },
  medicalConditions: {
    type: DataTypes.TEXT,
  },
  medicalNotes: {
    type: DataTypes.TEXT,
  },

  // Status & Metadata
  admissionStatus: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
  },
  attendancePercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  feesPaid: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  address: { // Keeping legacy address field just in case, but using specific ones above
    type: DataTypes.TEXT,
  },
  parentPhone: { // Legacy field
    type: DataTypes.STRING,
  },
  parentName: { // Legacy field
    type: DataTypes.STRING,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'students'
});

module.exports = Student;
