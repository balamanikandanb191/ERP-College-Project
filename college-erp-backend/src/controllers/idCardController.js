const { Student, Staff } = require('../models');

// @desc    Get all students for ID Card generation
// @route   GET /api/id-cards/students
// @access  Private
exports.getIdCardStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: [
        'id', 'fullName', 'registerNumber', 'gender', 'dob', 'bloodGroup', 'phone', 'email',
        'department', 'course', 'semester', 'section', 'academicYear', 'photoUrl',
        'fatherName', 'fatherPhone', 'emergencyContact', 'parentAddress', 'permanentAddress',
        'busRoute', 'hostelRequired'
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students for ID Cards:', error);
    res.status(500).json({ message: 'Server error while fetching student data for ID cards' });
  }
};

// @desc    Get all staff for ID Card generation
// @route   GET /api/id-cards/staff
// @access  Private
exports.getIdCardStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      attributes: [
        'id', 'fullName', 'staffId', 'gender', 'dob', 'bloodGroup', 'phone', 'email',
        'department', 'designation', 'employmentType', 'photoUrl', 'status', 'employeeStatus'
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff for ID Cards:', error);
    res.status(500).json({ message: 'Server error while fetching staff data for ID cards' });
  }
};
