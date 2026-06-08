const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Student = require('./Student');
const Staff = require('./Staff');
const StudentAttendance = require('./StudentAttendance');
const StaffAttendance = require('./StaffAttendance');
const Book = require('./Book');
const BorrowRecord = require('./BorrowRecord');
const Enquiry = require('./Enquiry');
const Caste = require('./Caste');
const District = require('./District');

// Transport Models
const Driver = require('./Driver');
const Bus = require('./Bus');
const TransportRoute = require('./TransportRoute');
const MaintenanceRecord = require('./MaintenanceRecord');

const HostelRoom = require('./HostelRoom');
const HostelWarden = require('./HostelWarden');
const HostelStudent = require('./HostelStudent');
const HostelComplaint = require('./HostelComplaint');
const HostelExpense = require('./HostelExpense');
const HostelFinancialReport = require('./HostelFinancialReport');

// Fee Models
const FeeStructure = require('./FeeStructure');
const StudentFee = require('./StudentFee');
const FeePaymentHistory = require('./FeePaymentHistory');

// Timetable Models
const Timetable = require('./Timetable');
const TimetableSettings = require('./TimetableSettings');

// Document Models
const StudentDocument = require('./StudentDocument');
const StaffDocument = require('./StaffDocument');
const SystemSetting = require('./SystemSetting');
const MasterRecord = require('./MasterRecord');
const AcademicYearMaster = require('./AcademicYearMaster');
const ClassMaster = require('./ClassMaster');
const DesignationMaster = require('./DesignationMaster');
const ExamMaster = require('./ExamMaster');
const FeeMaster = require('./FeeMaster');
const { Company, PlacementDrive, PlacementRecord, PlacementFee, Internship } = require('./Placement');
const { Announcement, Event, Holiday, Notification, AnnouncementRead, AcademicEvent } = require('./Communication')(sequelize);
const ClassAllocation = require('./ClassAllocation');
const ApplicationIssue = require('./ApplicationIssue');
const AssessmentConfig = require('./AssessmentConfig');
const AssessmentMark = require('./AssessmentMark');

// Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Student, { as: 'ParentStudent', foreignKey: 'parent_user_id' });
Student.belongsTo(User, { as: 'Parent', foreignKey: 'parent_user_id' });

User.hasOne(Staff, { foreignKey: 'user_id' });
Staff.belongsTo(User, { foreignKey: 'user_id' });

Student.hasMany(StudentAttendance, { foreignKey: 'student_id' });
StudentAttendance.belongsTo(Student, { foreignKey: 'student_id' });

User.hasMany(StudentAttendance, {
  foreignKey: 'marked_by',
  as: 'MarkedStudentAttendance'
});

StudentAttendance.belongsTo(User, {
  foreignKey: 'marked_by',
  as: 'StudentMarker'
});

Staff.hasMany(StaffAttendance, { foreignKey: 'staff_id' });
StaffAttendance.belongsTo(Staff, { foreignKey: 'staff_id' });

User.hasMany(StaffAttendance, {
  foreignKey: 'marked_by',
  as: 'MarkedStaffAttendance'
});

StaffAttendance.belongsTo(User, {
  foreignKey: 'marked_by',
  as: 'StaffMarker'
});

Book.hasMany(BorrowRecord, { foreignKey: 'bookId' });
BorrowRecord.belongsTo(Book, { foreignKey: 'bookId', as: 'Book' });

Student.hasMany(BorrowRecord, { foreignKey: 'studentId' });
BorrowRecord.belongsTo(Student, { foreignKey: 'studentId', as: 'Student' });

Staff.hasMany(BorrowRecord, { foreignKey: 'staffId' });
BorrowRecord.belongsTo(Staff, { foreignKey: 'staffId', as: 'Staff' });

// Hostel Associations
HostelRoom.hasMany(HostelStudent, { foreignKey: 'roomId', as: 'occupants' });
HostelStudent.belongsTo(HostelRoom, { foreignKey: 'roomId', as: 'room' });

HostelWarden.hasMany(HostelRoom, { foreignKey: 'assignedWardenId', as: 'managedRooms' });
HostelRoom.belongsTo(HostelWarden, { foreignKey: 'assignedWardenId', as: 'warden' });

Student.hasOne(HostelStudent, { foreignKey: 'studentId', as: 'hostelProfile' });
HostelStudent.belongsTo(Student, { foreignKey: 'studentId', as: 'studentDetails' });

HostelRoom.hasMany(HostelComplaint, { foreignKey: 'roomId', as: 'roomComplaints' });
HostelComplaint.belongsTo(HostelRoom, { foreignKey: 'roomId', as: 'complaintRoom' });

Student.hasMany(HostelComplaint, { foreignKey: 'studentId', as: 'studentComplaints' });
HostelComplaint.belongsTo(Student, { foreignKey: 'studentId', as: 'complainingStudent' });

// Fee Associations
Student.hasMany(StudentFee, { foreignKey: 'studentId' });
StudentFee.belongsTo(Student, { foreignKey: 'studentId' });

FeeStructure.hasMany(StudentFee, { foreignKey: 'feeStructureId' });
StudentFee.belongsTo(FeeStructure, { foreignKey: 'feeStructureId' });

StudentFee.hasMany(FeePaymentHistory, { foreignKey: 'studentFeeId' });
FeePaymentHistory.belongsTo(StudentFee, { foreignKey: 'studentFeeId' });

User.hasMany(FeePaymentHistory, { foreignKey: 'collectedBy', as: 'collectedPayments' });
FeePaymentHistory.belongsTo(User, { foreignKey: 'collectedBy', as: 'collector' });

// Timetable Associations
Staff.hasMany(Timetable, { foreignKey: 'staffId', as: 'classes' });
Timetable.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });

// Document Associations
Student.hasMany(StudentDocument, { foreignKey: 'studentId', as: 'documents' });
StudentDocument.belongsTo(Student, { foreignKey: 'studentId' });

Staff.hasMany(StaffDocument, { foreignKey: 'staffId', as: 'documents' });
StaffDocument.belongsTo(Staff, { foreignKey: 'staffId' });

// Placement Associations
Company.hasMany(PlacementDrive, { foreignKey: 'companyId' });
PlacementDrive.belongsTo(Company, { foreignKey: 'companyId' });

Student.hasMany(PlacementRecord, { foreignKey: 'studentId' });
PlacementRecord.belongsTo(Student, { foreignKey: 'studentId' });

Company.hasMany(PlacementRecord, { foreignKey: 'companyId' });
PlacementRecord.belongsTo(Company, { foreignKey: 'companyId' });

PlacementDrive.hasMany(PlacementRecord, { foreignKey: 'driveId' });
PlacementRecord.belongsTo(PlacementDrive, { foreignKey: 'driveId' });

Student.hasMany(PlacementFee, { foreignKey: 'studentId' });
PlacementFee.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Internship, { foreignKey: 'studentId' });
Internship.belongsTo(Student, { foreignKey: 'studentId' });

// Communication Associations
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Announcement.hasMany(AnnouncementRead, { foreignKey: 'announcementId', as: 'readRecords' });
AnnouncementRead.belongsTo(Announcement, { foreignKey: 'announcementId' });

User.hasMany(AnnouncementRead, { foreignKey: 'userId', as: 'readAnnouncements' });
AnnouncementRead.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Announcement, { foreignKey: 'authorId', as: 'authoredAnnouncements' });
Announcement.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Student.hasMany(AssessmentMark, { foreignKey: 'student_id' });
AssessmentMark.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = {
  sequelize,
  Role,
  User,
  Student,
  Staff,
  StudentAttendance,
  StaffAttendance,
  Book,
  BorrowRecord,
  Driver,
  Bus,
  TransportRoute,
  MaintenanceRecord,
  HostelRoom,
  HostelWarden,
  HostelStudent,
  HostelComplaint,
  HostelExpense,
  HostelFinancialReport,
  FeeStructure,
  StudentFee,
  FeePaymentHistory,
  Timetable,
  TimetableSettings,
  StudentDocument,
  StaffDocument,
  SystemSetting,
  MasterRecord,
  AcademicYearMaster,
  ClassMaster,
  DesignationMaster,
  ExamMaster,
  FeeMaster,
  Company,
  PlacementDrive,
  PlacementRecord,
  PlacementFee,
  Internship,
  Announcement,
  Event,
  Holiday,
  Notification,
  AnnouncementRead,
  AcademicEvent,
  ClassAllocation,
  Enquiry,
  Caste,
  District,
  ApplicationIssue,
  AssessmentConfig,
  AssessmentMark
};