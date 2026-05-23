const { Student } = require('../models');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

// @desc    Get a single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error while fetching student' });
  }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private
exports.createStudent = async (req, res) => {
  try {
    const payload = { ...req.body };
    
    // Sanitize data: completely clear out empty strings and undefined
    if (!payload.email || payload.email.trim() === '') payload.email = null;
    if (!payload.dob || payload.dob.trim() === '') payload.dob = null;
    if (!payload.admissionDate || payload.admissionDate.trim() === '') payload.admissionDate = null;
    
    // Auto-generate register number if missing or marked as AUTO
    if (!payload.registerNumber || payload.registerNumber === 'AUTO') {
      const year = new Date().getFullYear().toString().slice(-2);
      const deptCode = (payload.department || 'GEN').substring(0, 3).toUpperCase();
      const count = await Student.count() + 1;
      payload.registerNumber = `REG-${year}${deptCode}${count.toString().padStart(4, '0')}`;
    }

    const { registerNumber, email, aadhaarNumber, phone } = payload;

    // Check for duplicates
    if (registerNumber) {
      const existingStudent = await Student.findOne({ where: { registerNumber } });
      if (existingStudent) {
        return res.status(400).json({ message: 'A student with this register number already exists' });
      }
    }

    if (email) {
      const existingEmail = await Student.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'A student with this email already exists' });
      }
    }

    if (phone) {
      const existingPhone = await Student.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({ message: 'A student with this mobile number already exists' });
      }
    }

    if (aadhaarNumber) {
      const existingAadhaar = await Student.findOne({ where: { aadhaarNumber } });
      if (existingAadhaar) {
        return res.status(400).json({ message: 'A student with this Aadhaar number already exists' });
      }
    }

    const newStudent = await Student.create(payload);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    // Also catch database level errors (e.g., PostgreSQL strict mode errors)
    if (error.name === 'SequelizeDatabaseError') {
       return res.status(400).json({ message: 'Database format error: ' + error.message });
    }
    res.status(500).json({ message: 'Server error while creating student', error: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const payload = { ...req.body };
    
    // Sanitize data
    if (payload.email === '') payload.email = null;
    if (payload.dob === '') payload.dob = null;
    if (payload.admissionDate === '') payload.admissionDate = null;
    if (payload.attendancePercentage === '') payload.attendancePercentage = 0;

    // Check for duplicates if updating registerNumber, email, or Aadhaar
    const { registerNumber, email, aadhaarNumber } = payload;
    
    if (registerNumber && registerNumber !== student.registerNumber) {
      const existingStudent = await Student.findOne({ where: { registerNumber } });
      if (existingStudent) {
        return res.status(400).json({ message: 'A student with this register number already exists' });
      }
    }

    if (email && email !== student.email) {
      const existingEmail = await Student.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'A student with this email already exists' });
      }
    }

    if (aadhaarNumber && aadhaarNumber !== student.aadhaarNumber) {
      const existingAadhaar = await Student.findOne({ where: { aadhaarNumber } });
      if (existingAadhaar) {
        return res.status(400).json({ message: 'A student with this Aadhaar number already exists' });
      }
    }

    await student.update(payload);
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error while updating student', error: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.json({ message: 'Student removed' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error while deleting student' });
  }
};
