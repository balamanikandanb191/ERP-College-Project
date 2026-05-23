const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  logoUrl: { type: DataTypes.STRING },
  industryType: { type: DataTypes.STRING },
  hrName: { type: DataTypes.STRING },
  hrContact: { type: DataTypes.STRING },
  hrEmail: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  packageOffered: { type: DataTypes.DECIMAL(10, 2) }, // in LPA
  jobRole: { type: DataTypes.STRING },
  requiredSkills: { type: DataTypes.JSON }, // Array of skills
  minCGPA: { type: DataTypes.DECIMAL(3, 2), defaultValue: 6.0 },
  allowedDepartments: { type: DataTypes.JSON }, // Array of dept names
  hiringType: { type: DataTypes.ENUM('Internship', 'Full-Time', 'Internship + PPO'), defaultValue: 'Full-Time' },
  status: { type: DataTypes.ENUM('Upcoming', 'Active', 'Completed', 'Cancelled'), defaultValue: 'Upcoming' }
}, { timestamps: true, tableName: 'companies' });

const PlacementDrive = sequelize.define('PlacementDrive', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  companyId: { type: DataTypes.UUID, allowNull: false },
  driveDate: { type: DataTypes.DATE },
  venue: { type: DataTypes.STRING },
  interviewMode: { type: DataTypes.ENUM('Online', 'Offline'), defaultValue: 'Offline' },
  rounds: { type: DataTypes.JSON }, // e.g. ['Aptitude', 'Technical', 'HR']
  status: { type: DataTypes.STRING, defaultValue: 'Scheduled' }
}, { timestamps: true, tableName: 'placement_drives' });

const PlacementRecord = sequelize.define('PlacementRecord', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: { type: DataTypes.UUID, allowNull: false },
  companyId: { type: DataTypes.UUID, allowNull: false },
  driveId: { type: DataTypes.UUID },
  package: { type: DataTypes.DECIMAL(10, 2) },
  offerLetterUrl: { type: DataTypes.STRING },
  joiningDate: { type: DataTypes.DATE },
  placementType: { type: DataTypes.STRING }, // 'Full-Time', 'Internship + PPO'
  status: { type: DataTypes.ENUM('Offered', 'Accepted', 'Joined', 'Rejected'), defaultValue: 'Offered' }
}, { timestamps: true, tableName: 'placement_records' });

const PlacementFee = sequelize.define('PlacementFee', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  status: { type: DataTypes.ENUM('Paid', 'Pending', 'Partial'), defaultValue: 'Pending' },
  paymentDate: { type: DataTypes.DATE },
  receiptNumber: { type: DataTypes.STRING },
  paymentMode: { type: DataTypes.STRING }
}, { timestamps: true, tableName: 'placement_fees' });

const Internship = sequelize.define('Internship', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: { type: DataTypes.UUID, allowNull: false },
  companyName: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING }, // e.g. '3 Months'
  stipend: { type: DataTypes.DECIMAL(10, 2) },
  guideName: { type: DataTypes.STRING },
  completionStatus: { type: DataTypes.ENUM('In Progress', 'Completed', 'Terminated'), defaultValue: 'In Progress' },
  certificateUrl: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE }
}, { timestamps: true, tableName: 'internships' });

module.exports = { Company, PlacementDrive, PlacementRecord, PlacementFee, Internship };
