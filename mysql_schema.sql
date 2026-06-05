-- ==========================================
-- EduERP Database Schema for MySQL
-- Auto-generated DDL Script matching Express Models
-- ==========================================

DROP DATABASE IF EXISTS college_erp;
CREATE DATABASE college_erp;
USE college_erp;

-- Disable foreign key checks temporarily to avoid drop ordering conflicts
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist (both plural/singular, underscored/non-underscored variants from Sequelize/previous migrations)
DROP TABLE IF EXISTS `announcement_reads`;
DROP TABLE IF EXISTS `announcement_read`;
DROP TABLE IF EXISTS `announcementreads`;
DROP TABLE IF EXISTS `announcementread`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `announcement`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `holidays`;
DROP TABLE IF EXISTS `holiday`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `notification`;
DROP TABLE IF EXISTS `academic_events`;
DROP TABLE IF EXISTS `academic_event`;
DROP TABLE IF EXISTS `academicevents`;
DROP TABLE IF EXISTS `academicevent`;
DROP TABLE IF EXISTS `placement_records`;
DROP TABLE IF EXISTS `placement_record`;
DROP TABLE IF EXISTS `placementrecords`;
DROP TABLE IF EXISTS `placementrecord`;
DROP TABLE IF EXISTS `placement_drives`;
DROP TABLE IF EXISTS `placement_drive`;
DROP TABLE IF EXISTS `placementdrives`;
DROP TABLE IF EXISTS `placementdrive`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `company`;
DROP TABLE IF EXISTS `placement_fees`;
DROP TABLE IF EXISTS `placement_fee`;
DROP TABLE IF EXISTS `placementfees`;
DROP TABLE IF EXISTS `placementfee`;
DROP TABLE IF EXISTS `internships`;
DROP TABLE IF EXISTS `internship`;
DROP TABLE IF EXISTS `student_documents`;
DROP TABLE IF EXISTS `student_document`;
DROP TABLE IF EXISTS `studentdocuments`;
DROP TABLE IF EXISTS `studentdocument`;
DROP TABLE IF EXISTS `staff_documents`;
DROP TABLE IF EXISTS `staff_document`;
DROP TABLE IF EXISTS `staffdocuments`;
DROP TABLE IF EXISTS `staffdocument`;
DROP TABLE IF EXISTS `timetables`;
DROP TABLE IF EXISTS `timetable`;
DROP TABLE IF EXISTS `timetable_settings`;
DROP TABLE IF EXISTS `timetable_setting`;
DROP TABLE IF EXISTS `timetablesettings`;
DROP TABLE IF EXISTS `timetablesetting`;
DROP TABLE IF EXISTS `class_allocations`;
DROP TABLE IF EXISTS `class_allocation`;
DROP TABLE IF EXISTS `classallocations`;
DROP TABLE IF EXISTS `classallocation`;
DROP TABLE IF EXISTS `fee_payment_histories`;
DROP TABLE IF EXISTS `fee_payment_history`;
DROP TABLE IF EXISTS `feepaymenthistories`;
DROP TABLE IF EXISTS `feepaymenthistory`;
DROP TABLE IF EXISTS `student_fees`;
DROP TABLE IF EXISTS `student_fee`;
DROP TABLE IF EXISTS `studentfees`;
DROP TABLE IF EXISTS `studentfee`;
DROP TABLE IF EXISTS `fee_structures`;
DROP TABLE IF EXISTS `fee_structure`;
DROP TABLE IF EXISTS `feestructures`;
DROP TABLE IF EXISTS `feestructure`;
DROP TABLE IF EXISTS `hostel_complaints`;
DROP TABLE IF EXISTS `hostel_complaint`;
DROP TABLE IF EXISTS `hostelcomplaints`;
DROP TABLE IF EXISTS `hostelcomplaint`;
DROP TABLE IF EXISTS `hostel_expenses`;
DROP TABLE IF EXISTS `hostel_expense`;
DROP TABLE IF EXISTS `hostelexpenses`;
DROP TABLE IF EXISTS `hostelexpense`;
DROP TABLE IF EXISTS `hostel_financial_reports`;
DROP TABLE IF EXISTS `hostel_financial_report`;
DROP TABLE IF EXISTS `hostelfinancialreports`;
DROP TABLE IF EXISTS `hostelfinancialreport`;
DROP TABLE IF EXISTS `hostel_students`;
DROP TABLE IF EXISTS `hostel_student`;
DROP TABLE IF EXISTS `hostelstudents`;
DROP TABLE IF EXISTS `hostelstudent`;
DROP TABLE IF EXISTS `hostel_rooms`;
DROP TABLE IF EXISTS `hostel_room`;
DROP TABLE IF EXISTS `hostelrooms`;
DROP TABLE IF EXISTS `hostelroom`;
DROP TABLE IF EXISTS `hostel_wardens`;
DROP TABLE IF EXISTS `hostel_warden`;
DROP TABLE IF EXISTS `hostelwardens`;
DROP TABLE IF EXISTS `hostelwarden`;
DROP TABLE IF EXISTS `maintenance_records`;
DROP TABLE IF EXISTS `maintenance_record`;
DROP TABLE IF EXISTS `maintenancerecords`;
DROP TABLE IF EXISTS `maintenancerecord`;
DROP TABLE IF EXISTS `buses`;
DROP TABLE IF EXISTS `bus`;
DROP TABLE IF EXISTS `drivers`;
DROP TABLE IF EXISTS `driver`;
DROP TABLE IF EXISTS `transport_routes`;
DROP TABLE IF EXISTS `transport_route`;
DROP TABLE IF EXISTS `transportroutes`;
DROP TABLE IF EXISTS `transportroute`;
DROP TABLE IF EXISTS `borrow_records`;
DROP TABLE IF EXISTS `borrow_record`;
DROP TABLE IF EXISTS `borrowrecords`;
DROP TABLE IF EXISTS `borrowrecord`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `book`;
DROP TABLE IF EXISTS `staff_attendance`;
DROP TABLE IF EXISTS `staff_attendance_record`;
DROP TABLE IF EXISTS `staffattendance`;
DROP TABLE IF EXISTS `student_attendance`;
DROP TABLE IF EXISTS `student_attendance_record`;
DROP TABLE IF EXISTS `studentattendance`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `student`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `system_settings`;
DROP TABLE IF EXISTS `system_setting`;
DROP TABLE IF EXISTS `systemsettings`;
DROP TABLE IF EXISTS `systemsetting`;
DROP TABLE IF EXISTS `master_records`;
DROP TABLE IF EXISTS `master_record`;
DROP TABLE IF EXISTS `masterrecords`;
DROP TABLE IF EXISTS `masterrecord`;
DROP TABLE IF EXISTS `academic_years`;
DROP TABLE IF EXISTS `academic_year`;
DROP TABLE IF EXISTS `academicyears`;
DROP TABLE IF EXISTS `academicyear`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `class`;
DROP TABLE IF EXISTS `designations`;
DROP TABLE IF EXISTS `designation`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `exam`;
DROP TABLE IF EXISTS `fees`;
DROP TABLE IF EXISTS `fee`;

-- ==========================================
-- 1. ROLES & USERS
-- ==========================================

CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_users_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. STUDENTS & STAFF PROFILES
-- ==========================================

CREATE TABLE `students` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `user_id` CHAR(36) DEFAULT NULL,
  `parent_user_id` CHAR(36) DEFAULT NULL,
  
  -- Personal Info
  `fullName` VARCHAR(255) NOT NULL,
  `registerNumber` VARCHAR(100) NOT NULL UNIQUE,
  `gender` VARCHAR(50) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `bloodGroup` VARCHAR(20) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(255) UNIQUE DEFAULT NULL,
  `nationality` VARCHAR(100) DEFAULT 'Indian',
  `religion` VARCHAR(100) DEFAULT NULL,
  `community` VARCHAR(100) DEFAULT NULL,
  `aadhaarNumber` VARCHAR(50) UNIQUE DEFAULT NULL,
  `idMark1` VARCHAR(255) DEFAULT NULL,
  `idMark2` VARCHAR(255) DEFAULT NULL,
  `photoUrl` VARCHAR(255) DEFAULT NULL,

  -- Academic Info
  `department` VARCHAR(255) DEFAULT NULL,
  `course` VARCHAR(255) DEFAULT NULL,
  `degree` VARCHAR(255) DEFAULT NULL,
  `academicYear` VARCHAR(100) DEFAULT NULL,
  `semester` VARCHAR(50) DEFAULT NULL,
  `section` VARCHAR(50) DEFAULT NULL,
  `admissionType` VARCHAR(100) DEFAULT NULL,
  `previousInstitution` VARCHAR(255) DEFAULT NULL,
  `percentage10th` FLOAT DEFAULT NULL,
  `percentage12th` FLOAT DEFAULT NULL,
  `cutoffMark` FLOAT DEFAULT NULL,
  `entranceScore` FLOAT DEFAULT NULL,
  `tcNumber` VARCHAR(100) DEFAULT NULL,
  `admissionDate` DATE DEFAULT NULL,

  -- Parent / Guardian Details
  `fatherName` VARCHAR(255) DEFAULT NULL,
  `fatherPhone` VARCHAR(50) DEFAULT NULL,
  `fatherOccupation` VARCHAR(255) DEFAULT NULL,
  `fatherIncome` VARCHAR(100) DEFAULT NULL,
  `motherName` VARCHAR(255) DEFAULT NULL,
  `motherPhone` VARCHAR(50) DEFAULT NULL,
  `motherOccupation` VARCHAR(255) DEFAULT NULL,
  `guardianName` VARCHAR(255) DEFAULT NULL,
  `emergencyContact` VARCHAR(50) DEFAULT NULL,
  `parentAddress` TEXT DEFAULT NULL,

  -- Addresses
  `permanentAddress` TEXT DEFAULT NULL,
  `communicationAddress` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `pincode` VARCHAR(20) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT 'India',

  -- Hostel & Transport
  `hostelRequired` TINYINT(1) DEFAULT 0,
  `roomPreference` VARCHAR(100) DEFAULT NULL,
  `busRequired` TINYINT(1) DEFAULT 0,
  `busRoute` VARCHAR(255) DEFAULT NULL,
  `pickupPoint` VARCHAR(255) DEFAULT NULL,

  -- Medical Information
  `disabilityDetails` TEXT DEFAULT NULL,
  `allergies` TEXT DEFAULT NULL,
  `medicalConditions` TEXT DEFAULT NULL,
  `medicalNotes` TEXT DEFAULT NULL,

  -- Status & Metadata
  `admissionStatus` ENUM('Pending', 'Verified', 'Approved', 'Rejected') DEFAULT 'Pending',
  `attendancePercentage` FLOAT DEFAULT 0,
  `feesPaid` VARCHAR(50) DEFAULT 'Pending',
  `address` TEXT DEFAULT NULL, -- Legacy field
  `parentPhone` VARCHAR(50) DEFAULT NULL, -- Legacy field
  `parentName` VARCHAR(255) DEFAULT NULL, -- Legacy field

  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_students_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_parent_user_id` FOREIGN KEY (`parent_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `user_id` CHAR(36) DEFAULT NULL,
  
  -- Personal Details
  `fullName` VARCHAR(255) NOT NULL,
  `staffId` VARCHAR(100) NOT NULL UNIQUE,
  `gender` VARCHAR(50) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `bloodGroup` VARCHAR(20) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `alternatePhone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(255) UNIQUE DEFAULT NULL,
  `officialEmail` VARCHAR(255) UNIQUE DEFAULT NULL,
  `maritalStatus` VARCHAR(50) DEFAULT NULL,
  `nationality` VARCHAR(100) DEFAULT 'Indian',
  `aadhaarNumber` VARCHAR(50) DEFAULT NULL,
  `panNumber` VARCHAR(50) DEFAULT NULL,
  `religion` VARCHAR(100) DEFAULT NULL,
  `community` VARCHAR(100) DEFAULT NULL,
  `photoUrl` VARCHAR(255) DEFAULT NULL,

  -- Professional Details
  `department` VARCHAR(255) DEFAULT NULL,
  `designation` VARCHAR(255) DEFAULT NULL,
  `teachingType` ENUM('Teaching', 'Non-Teaching') DEFAULT 'Teaching',
  `qualification` VARCHAR(255) DEFAULT NULL,
  `specialization` VARCHAR(255) DEFAULT NULL,
  `experienceYears` INT DEFAULT 0,
  `joiningDate` DATE DEFAULT NULL,
  `employmentType` VARCHAR(100) DEFAULT NULL,
  `role` VARCHAR(100) DEFAULT NULL,
  `assignedSubjects` TEXT DEFAULT NULL,
  `timetableHandling` TINYINT(1) DEFAULT 0,
  `employeeStatus` ENUM('Active', 'On Leave', 'Suspended') DEFAULT 'Active',

  -- Salary & Employment
  `basicSalary` FLOAT DEFAULT 0,
  `allowances` FLOAT DEFAULT 0,
  `salary` FLOAT DEFAULT 0,
  `bankName` VARCHAR(255) DEFAULT NULL,
  `accountNumber` VARCHAR(100) DEFAULT NULL,
  `ifscCode` VARCHAR(50) DEFAULT NULL,
  `pfNumber` VARCHAR(100) DEFAULT NULL,
  `salaryType` ENUM('Monthly', 'Hourly') DEFAULT 'Monthly',
  `workingHours` VARCHAR(100) DEFAULT NULL,
  `weeklyOff` VARCHAR(100) DEFAULT NULL,

  -- Address & Emergency
  `permanentAddress` TEXT DEFAULT NULL,
  `currentAddress` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL, -- Legacy field
  `guardianName` VARCHAR(255) DEFAULT NULL,
  `emergencyPhone` VARCHAR(50) DEFAULT NULL,
  `emergencyAddress` TEXT DEFAULT NULL,

  -- System Access
  `username` VARCHAR(100) UNIQUE DEFAULT NULL,
  `allowLogin` TINYINT(1) DEFAULT 1,
  `status` VARCHAR(50) DEFAULT 'Active', -- Legacy field

  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_staff_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. ATTENDANCE & ACADEMICS
-- ==========================================

CREATE TABLE `student_attendance` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `student_id` CHAR(36) NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Half Day') NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `marked_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_stud_attendance_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_stud_attendance_marked_by` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff_attendance` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `staff_id` CHAR(36) NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Half Day') NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `marked_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_staff_attendance_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_staff_attendance_marked_by` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `timetable_settings` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `totalPeriods` INT DEFAULT 8,
  `breakAfterPeriod` INT DEFAULT 4,
  `collegeStartTime` TIME DEFAULT '09:00:00',
  `collegeEndTime` TIME DEFAULT '16:00:00',
  `workingDays` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `timetables` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `staffId` CHAR(36) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) NOT NULL,
  `year` VARCHAR(255) NOT NULL,
  `section` VARCHAR(255) NOT NULL,
  `day` VARCHAR(255) NOT NULL,
  `periodNumber` INT NOT NULL DEFAULT 1,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `roomNumber` VARCHAR(255) NOT NULL,
  `semester` VARCHAR(255) NOT NULL,
  `academicYear` VARCHAR(255) DEFAULT '2025-2026',
  `status` VARCHAR(255) DEFAULT 'Scheduled',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_timetables_staffId` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `class_allocations` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `department` VARCHAR(255) NOT NULL,
  `year` VARCHAR(50) NOT NULL,
  `semester` VARCHAR(50) NOT NULL,
  `section` VARCHAR(50) NOT NULL,
  `classroomNumber` VARCHAR(255) NOT NULL,
  `classAdvisor` VARCHAR(255) DEFAULT NULL,
  `assignedFaculty` TEXT DEFAULT NULL,
  `labAllocation` VARCHAR(255) DEFAULT 'None',
  `currentStrength` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(100) NOT NULL DEFAULT 'Occupied',
  `timetableSyncStatus` VARCHAR(100) NOT NULL DEFAULT 'Synced',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. LIBRARY
-- ==========================================

CREATE TABLE `books` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `customBookId` VARCHAR(255) NOT NULL UNIQUE,
  `bookName` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `isbn` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(255) NOT NULL,
  `language` VARCHAR(255) DEFAULT NULL,
  `publisher` VARCHAR(255) DEFAULT NULL,
  `edition` VARCHAR(255) DEFAULT NULL,
  `publicationYear` INT DEFAULT NULL,
  `pages` INT DEFAULT NULL,
  `price` DOUBLE NOT NULL DEFAULT 0,
  `status` VARCHAR(255) NOT NULL DEFAULT 'Available',
  `quantity` INT NOT NULL DEFAULT 1,
  `availableCopies` INT NOT NULL DEFAULT 1,
  `rack` VARCHAR(255) DEFAULT NULL,
  `position` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `coverImage` VARCHAR(255) DEFAULT NULL,
  `borrowCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `borrow_records` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `borrowerType` ENUM('Student', 'Staff') NOT NULL,
  `studentId` CHAR(36) DEFAULT NULL,
  `staffId` CHAR(36) DEFAULT NULL,
  `bookId` CHAR(36) NOT NULL,
  `borrowDate` DATE NOT NULL,
  `returnDate` DATE NOT NULL,
  `actualReturnDate` DATE DEFAULT NULL,
  `fineAmount` DOUBLE NOT NULL DEFAULT 0,
  `status` ENUM('Borrowed', 'Returned', 'Overdue') NOT NULL DEFAULT 'Borrowed',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  CONSTRAINT `fk_borrow_records_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_borrow_records_staffId` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_borrow_records_bookId` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. HOSTEL
-- ==========================================

CREATE TABLE `hostel_rooms` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `roomNumber` VARCHAR(50) NOT NULL UNIQUE,
  `block` VARCHAR(100) DEFAULT NULL,
  `type` ENUM('AC', 'Non-AC') DEFAULT 'Non-AC',
  `capacity` INT NOT NULL,
  `occupied` INT DEFAULT 0,
  `rent` FLOAT DEFAULT 0,
  `status` ENUM('Available', 'Full', 'Maintenance') DEFAULT 'Available',
  `assignedWardenId` CHAR(36) DEFAULT NULL, -- Resolved later
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `hostel_wardens` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `staffId` CHAR(36) NOT NULL,
  `block` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_hostel_warden_staffId` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add circular relationship for warden assignment to rooms
ALTER TABLE `hostel_rooms` ADD CONSTRAINT `fk_hostel_rooms_wardenId` 
FOREIGN KEY (`assignedWardenId`) REFERENCES `hostel_wardens` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE `hostel_students` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `roomId` CHAR(36) NOT NULL,
  `admissionDate` DATE NOT NULL,
  `status` ENUM('Active', 'Vaccated') DEFAULT 'Active',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_hostel_student_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hostel_student_roomId` FOREIGN KEY (`roomId`) REFERENCES `hostel_rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `hostel_complaints` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `roomId` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `severity` ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
  `status` ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_hostel_complaint_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hostel_complaint_roomId` FOREIGN KEY (`roomId`) REFERENCES `hostel_rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `hostel_expenses` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `amount` FLOAT NOT NULL,
  `date` DATE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `hostel_financial_reports` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `month` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `totalRevenue` FLOAT DEFAULT 0,
  `totalExpenses` FLOAT DEFAULT 0,
  `netProfit` FLOAT DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. TRANSPORT
-- ==========================================

CREATE TABLE `transport_routes` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `routeName` VARCHAR(255) NOT NULL,
  `startPoint` VARCHAR(255) DEFAULT NULL,
  `endPoint` VARCHAR(255) DEFAULT NULL,
  `stops` TEXT DEFAULT NULL,
  `fare` FLOAT DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `drivers` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `fullName` VARCHAR(255) NOT NULL,
  `licenseNumber` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `buses` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `busNumber` VARCHAR(100) NOT NULL UNIQUE,
  `capacity` INT NOT NULL,
  `routeId` CHAR(36) DEFAULT NULL,
  `driverId` CHAR(36) DEFAULT NULL,
  `status` ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_buses_routeId` FOREIGN KEY (`routeId`) REFERENCES `transport_routes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_buses_driverId` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `maintenance_records` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `busId` CHAR(36) NOT NULL,
  `maintenanceDate` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `cost` FLOAT NOT NULL,
  `status` VARCHAR(100) DEFAULT 'Completed',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_maintenance_busId` FOREIGN KEY (`busId`) REFERENCES `buses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 7. FEES MANAGEMENT
-- ==========================================

CREATE TABLE `fee_structures` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) DEFAULT NULL,
  `batch` VARCHAR(100) DEFAULT NULL,
  `semester` VARCHAR(50) DEFAULT NULL,
  `academicYear` VARCHAR(100) DEFAULT NULL,
  `amount` FLOAT NOT NULL,
  `dueDate` DATE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `student_fees` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `feeStructureId` CHAR(36) NOT NULL,
  `amountPaid` FLOAT DEFAULT 0,
  `remainingAmount` FLOAT NOT NULL,
  `status` ENUM('Unpaid', 'Partially Paid', 'Paid') DEFAULT 'Unpaid',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_student_fee_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_student_fee_feeStructureId` FOREIGN KEY (`feeStructureId`) REFERENCES `fee_structures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `fee_payment_histories` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentFeeId` CHAR(36) NOT NULL,
  `amountPaid` FLOAT NOT NULL,
  `paymentDate` DATE NOT NULL,
  `paymentMode` ENUM('Cash', 'Card', 'Net Banking', 'UPI', 'Cheque') NOT NULL,
  `transactionId` VARCHAR(255) DEFAULT NULL,
  `collectedBy` CHAR(36) DEFAULT NULL,
  `status` VARCHAR(100) DEFAULT 'Success',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_payment_studentFeeId` FOREIGN KEY (`studentFeeId`) REFERENCES `student_fees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_collectedBy` FOREIGN KEY (`collectedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 8. PLACEMENT & CAREERS
-- ==========================================

CREATE TABLE `companies` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(255) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `contactPerson` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `placement_drives` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `companyId` CHAR(36) NOT NULL,
  `jobTitle` VARCHAR(255) NOT NULL,
  `jobDescription` TEXT DEFAULT NULL,
  `eligibilityCriteria` TEXT DEFAULT NULL,
  `package` FLOAT DEFAULT 0, -- Salary package
  `driveDate` DATE DEFAULT NULL,
  `venue` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Upcoming', 'Ongoing', 'Completed') DEFAULT 'Upcoming',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_drives_companyId` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `placement_records` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `companyId` CHAR(36) NOT NULL,
  `driveId` CHAR(36) NOT NULL,
  `status` ENUM('Applied', 'Shortlisted', 'Selected', 'Rejected') DEFAULT 'Applied',
  `salaryOffered` FLOAT DEFAULT 0,
  `offerLetterUrl` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_records_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_records_companyId` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_records_driveId` FOREIGN KEY (`driveId`) REFERENCES `placement_drives` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `placement_fees` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `amount` FLOAT NOT NULL,
  `status` ENUM('Unpaid', 'Paid') DEFAULT 'Unpaid',
  `dueDate` DATE NOT NULL,
  `paymentDate` DATE DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_placement_fee_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `internships` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `companyName` VARCHAR(255) NOT NULL,
  `projectTitle` VARCHAR(255) DEFAULT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `stipend` FLOAT DEFAULT 0,
  `status` ENUM('Ongoing', 'Completed') DEFAULT 'Ongoing',
  `certificateUrl` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_internship_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 9. DOCUMENTS
-- ==========================================

CREATE TABLE `student_documents` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `studentId` CHAR(36) NOT NULL,
  `documentName` VARCHAR(255) NOT NULL,
  `documentUrl` VARCHAR(255) NOT NULL,
  `status` ENUM('Uploaded', 'Approved', 'Rejected') DEFAULT 'Uploaded',
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_student_doc_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff_documents` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `staffId` CHAR(36) NOT NULL,
  `documentName` VARCHAR(255) NOT NULL,
  `documentUrl` VARCHAR(255) NOT NULL,
  `status` ENUM('Uploaded', 'Approved', 'Rejected') DEFAULT 'Uploaded',
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_staff_doc_staffId` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 10. SYSTEM SETTINGS
-- ==========================================

CREATE TABLE `system_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT 'string',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 11. COMMUNICATION / NOTIFICATIONS
-- ==========================================

CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `userId` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `isRead` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_notif_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `announcements` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `audience` ENUM('All', 'Staff', 'Student', 'Parent') DEFAULT 'All',
  `authorId` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_announcements_authorId` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `announcement_reads` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `announcementId` CHAR(36) NOT NULL,
  `userId` CHAR(36) NOT NULL,
  `readAt` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_reads_announcementId` FOREIGN KEY (`announcementId`) REFERENCES `announcements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reads_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `events` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `venue` VARCHAR(255) DEFAULT NULL,
  `organizedBy` VARCHAR(255) DEFAULT NULL,
  `audience` ENUM('All', 'Staff', 'Student') DEFAULT 'All',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `holidays` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `date` DATE NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `academic_events` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `term` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `master_records` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `type` VARCHAR(255) NOT NULL,
  `data` JSON NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `academic_years` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `year` VARCHAR(100) NOT NULL UNIQUE,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `admissionStart` DATE DEFAULT NULL,
  `admissionEnd` DATE DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `classes` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `shortCode` VARCHAR(50) DEFAULT NULL,
  `depts` TEXT DEFAULT NULL,
  `maxSections` INT DEFAULT 4,
  `maxStrength` INT DEFAULT 60,
  `semType` VARCHAR(50) DEFAULT 'Semester',
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `designations` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `shortCode` VARCHAR(100) DEFAULT NULL,
  `dept` VARCHAR(255) DEFAULT 'All',
  `gradePay` VARCHAR(100) DEFAULT NULL,
  `level` VARCHAR(100) DEFAULT 'Junior',
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exams` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `shortName` VARCHAR(100) DEFAULT NULL,
  `type` VARCHAR(100) DEFAULT NULL,
  `maxMarks` INT DEFAULT 100,
  `passMark` INT DEFAULT 40,
  `month` VARCHAR(50) DEFAULT NULL,
  `year` VARCHAR(50) DEFAULT NULL,
  `gpaWeight` INT DEFAULT 0,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `fees` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `feeType` VARCHAR(255) NOT NULL,
  `year` VARCHAR(50) DEFAULT NULL,
  `dept` VARCHAR(255) DEFAULT NULL,
  `amount` DOUBLE NOT NULL DEFAULT 0,
  `dueDate` DATE NOT NULL,
  `term` VARCHAR(100) DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 13. SEED DATA FOR MASTERS
-- ==========================================

INSERT INTO `academic_years` (`id`, `year`, `startDate`, `endDate`, `admissionStart`, `admissionEnd`, `active`, `created_at`, `updated_at`) VALUES
('acad-year-1', '2025-2026', '2025-06-01', '2026-05-31', '2025-04-01', '2025-07-31', 1, NOW(), NOW()),
('acad-year-2', '2024-2025', '2024-06-01', '2025-05-31', '2024-04-01', '2025-07-31', 0, NOW(), NOW()),
('acad-year-3', '2023-2024', '2023-06-01', '2024-05-31', '2023-04-01', '2024-07-31', 0, NOW(), NOW());

INSERT INTO `classes` (`id`, `name`, `shortCode`, `depts`, `maxSections`, `maxStrength`, `semType`, `active`, `created_at`, `updated_at`) VALUES
('class-1', 'I Year', 'I', 'CS, IT, EC, ME', 4, 60, 'Semester', 1, NOW(), NOW()),
('class-2', 'II Year', 'II', 'CS, IT, EC, ME', 4, 60, 'Semester', 1, NOW(), NOW()),
('class-3', 'III Year', 'III', 'CS, IT, EC', 3, 60, 'Semester', 1, NOW(), NOW()),
('class-4', 'IV Year', 'IV', 'CS, IT, EC', 3, 55, 'Semester', 1, NOW(), NOW());

INSERT INTO `designations` (`id`, `title`, `shortCode`, `dept`, `gradePay`, `level`, `active`, `created_at`, `updated_at`) VALUES
('desig-1', 'Professor', 'Prof.', 'All', 'AGP-10000', 'Senior', 1, NOW(), NOW()),
('desig-2', 'Associate Professor', 'Assoc. Prof.', 'All', 'AGP-8000', 'Senior', 1, NOW(), NOW()),
('desig-3', 'Assistant Professor', 'Asst. Prof.', 'All', 'AGP-6000', 'Junior', 1, NOW(), NOW()),
('desig-4', 'Head of Department', 'HOD', 'All', 'AGP-10000', 'Senior', 1, NOW(), NOW()),
('desig-5', 'Registrar', 'Reg.', 'Administration', 'AGP-7600', 'Administrative', 1, NOW(), NOW()),
('desig-6', 'Lab Instructor', 'Lab Instr.', 'Technical', 'AGP-4200', 'Technical', 1, NOW(), NOW());

INSERT INTO `exams` (`id`, `name`, `shortName`, `type`, `maxMarks`, `passMark`, `month`, `year`, `gpaWeight`, `active`, `created_at`, `updated_at`) VALUES
('exam-1', 'Internal Assessment 1', 'IA1', 'Internal', 50, 20, 'August', '2026', 20, 1, NOW(), NOW()),
('exam-2', 'Internal Assessment 2', 'IA2', 'Internal', 50, 20, 'November', '2026', 20, 1, NOW(), NOW()),
('exam-3', 'End Semester Examination', 'ESE', 'External', 100, 40, 'December', '2026', 60, 1, NOW(), NOW()),
('exam-4', 'Lab Practical Exam', 'LAB', 'Practical', 75, 30, 'November', '2026', 0, 1, NOW(), NOW());

INSERT INTO `fees` (`id`, `feeType`, `year`, `dept`, `amount`, `dueDate`, `term`, `active`, `created_at`, `updated_at`) VALUES
('fee-1', 'Tuition Fee', 'I', 'Computer Science', 85000, '2026-06-30', 'Annual', 1, NOW(), NOW()),
('fee-2', 'Tuition Fee', 'II', 'Computer Science', 85000, '2026-06-30', 'Annual', 1, NOW(), NOW()),
('fee-3', 'Transport Fee', 'ALL', 'ALL', 18000, '2026-06-15', 'Annual', 1, NOW(), NOW()),
('fee-4', 'Library Deposit', 'I', 'ALL', 2000, '2026-07-01', 'One-time', 1, NOW(), NOW()),
('fee-5', 'Hostel Fee', 'ALL', 'ALL', 45000, '2026-06-30', 'Annual', 1, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;

