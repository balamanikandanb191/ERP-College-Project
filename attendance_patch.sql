-- ============================================================
-- FINAL PATCH: student_attendance table for College ERP
-- Disable FK checks to avoid collation conflicts
-- ============================================================

USE college_erp;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `student_attendance`;

CREATE TABLE `student_attendance` (
  `id`          CHAR(36)     NOT NULL,
  `student_id`  CHAR(36)     NOT NULL,
  `date`        DATE         NOT NULL,
  `status`      ENUM('Present','Absent','Late','Half Day') NOT NULL DEFAULT 'Present',
  `remarks`     TEXT         DEFAULT NULL,
  `course_id`   VARCHAR(255) DEFAULT NULL,
  `semester_id` VARCHAR(50)  DEFAULT NULL,
  `subject_id`  VARCHAR(255) DEFAULT NULL,
  `staff_id`    CHAR(36)     DEFAULT NULL,
  `period_hour` VARCHAR(50)  DEFAULT NULL,
  `marked_by`   CHAR(36)     DEFAULT NULL,
  `created_at`  DATETIME     NOT NULL,
  `updated_at`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_attendance_subject_period`
    (`student_id`, `date`, `subject_id`, `period_hour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Confirm
DESCRIBE `student_attendance`;
SELECT 'Done! student_attendance table created successfully.' AS result;
