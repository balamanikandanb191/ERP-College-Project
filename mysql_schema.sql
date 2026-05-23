-- ==========================================
-- EduERP Database Schema for MySQL
-- Auto-generated DDL Script matching Express Models
-- ==========================================

CREATE DATABASE IF NOT EXISTS college_erp;
USE college_erp;

-- Disable foreign key checks temporarily to avoid drop ordering conflicts
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS `announcement_reads`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `holidays`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `academic_events`;
DROP TABLE IF EXISTS `placement_records`;
DROP TABLE IF EXISTS `placement_drives`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `placement_fees`;
DROP TABLE IF EXISTS `internships`;
DROP TABLE IF EXISTS `student_documents`;
DROP TABLE IF EXISTS `staff_documents`;
DROP TABLE IF EXISTS `timetables`;
DROP TABLE IF EXISTS `timetable_settings`;
DROP TABLE IF EXISTS `fee_payment_histories`;
DROP TABLE IF EXISTS `student_fees`;
DROP TABLE IF EXISTS `fee_structures`;
DROP TABLE IF EXISTS `hostel_complaints`;
DROP TABLE IF EXISTS `hostel_expenses`;
DROP TABLE IF EXISTS `hostel_financial_reports`;
DROP TABLE IF EXISTS `hostel_students`;
DROP TABLE IF EXISTS `hostel_rooms`;
DROP TABLE IF EXISTS `hostel_wardens`;
DROP TABLE IF EXISTS `maintenance_records`;
DROP TABLE IF EXISTS `buses`;
DROP TABLE IF EXISTS `drivers`;
DROP TABLE IF EXISTS `transport_routes`;
DROP TABLE IF EXISTS `borrow_records`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `staff_attendance`;
DROP TABLE IF EXISTS `student_attendance`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `system_settings`;

SET FOREIGN_KEY_CHECKS = 1;

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
  `aadhaarNumber` VARCHAR(50) UNIQUE DEFAULT NULL,
  `panNumber` VARCHAR(50) UNIQUE DEFAULT NULL,
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

CREATE TABLE `timetables` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `staffId` CHAR(36) NOT NULL,
  `day` VARCHAR(50) NOT NULL,
  `periodNumber` INT NOT NULL,
  `roomNumber` VARCHAR(50) DEFAULT NULL,
  `department` VARCHAR(255) DEFAULT NULL,
  `year` VARCHAR(50) DEFAULT NULL,
  `semester` VARCHAR(50) DEFAULT NULL,
  `section` VARCHAR(50) DEFAULT NULL,
  `subjectName` VARCHAR(255) DEFAULT NULL,
  `subjectCode` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('Scheduled', 'Completed', 'Cancelled', 'Substitute') DEFAULT 'Scheduled',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_timetable_staffId` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `timetable_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `periodsPerDay` INT DEFAULT 8,
  `periodDuration` INT DEFAULT 50, -- in minutes
  `workingDays` VARCHAR(255) DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. LIBRARY
-- ==========================================

CREATE TABLE `books` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `isbn` VARCHAR(100) UNIQUE DEFAULT NULL,
  `publisher` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT NULL,
  `quantity` INT DEFAULT 1,
  `availableQuantity` INT DEFAULT 1,
  `location` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `borrow_records` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `bookId` CHAR(36) NOT NULL,
  `studentId` CHAR(36) DEFAULT NULL,
  `staffId` CHAR(36) DEFAULT NULL,
  `borrowDate` DATE NOT NULL,
  `dueDate` DATE NOT NULL,
  `returnDate` DATE DEFAULT NULL,
  `fineAmount` FLOAT DEFAULT 0,
  `status` ENUM('Borrowed', 'Returned', 'Overdue') DEFAULT 'Borrowed',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  CONSTRAINT `fk_borrow_bookId` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_borrow_studentId` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_borrow_staffId` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
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
