const { Staff } = require('../models');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error while fetching staff' });
  }
};

// @desc    Get a single staff member
// @route   GET /api/staff/:id
// @access  Private
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ message: 'Server error while fetching staff member' });
  }
};

// @desc    Create a staff member
// @route   POST /api/staff
// @access  Private
exports.createStaff = async (req, res) => {
  try {
    const payload = { ...req.body };
    
    // Sanitize data: completely clear out empty strings and undefined
    if (!payload.email || payload.email.trim() === '') payload.email = null;
    if (!payload.officialEmail || payload.officialEmail.trim() === '') payload.officialEmail = null;
    if (!payload.joiningDate || payload.joiningDate.trim() === '') payload.joiningDate = null;
    if (!payload.dob || payload.dob.trim() === '') payload.dob = null;
    
    // Calculate total salary
    const basic = Number(payload.basicSalary) || 0;
    const allow = Number(payload.allowances) || 0;
    payload.salary = basic + allow;

    // Auto-generate staffId if missing or marked as AUTO
    if (!payload.staffId || payload.staffId === 'AUTO') {
      const count = await Staff.count() + 1;
      payload.staffId = `STAFF-${count.toString().padStart(3, '0')}`;
    }

    const { staffId, email, officialEmail, username } = payload;

    // Check for duplicates
    const checkFields = { staffId, email, officialEmail, username };
    for (const [key, value] of Object.entries(checkFields)) {
      if (value) {
        const existing = await Staff.findOne({ where: { [key]: value } });
        if (existing) {
          return res.status(400).json({ message: `A staff member with this ${key} already exists` });
        }
      }
    }

    const newStaff = await Staff.create(payload);
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff member:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    if (error.name === 'SequelizeDatabaseError') {
       return res.status(400).json({ message: 'Database format error: ' + error.message });
    }
    res.status(500).json({ message: 'Server error while creating staff member', error: error.message });
  }
};

// @desc    Update a staff member
// @route   PUT /api/staff/:id
// @access  Private
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const payload = { ...req.body };
    
    // Sanitize data
    if (payload.email === '') payload.email = null;
    if (payload.officialEmail === '') payload.officialEmail = null;
    if (payload.joiningDate === '') payload.joiningDate = null;
    if (payload.dob === '') payload.dob = null;
    
    // Calculate total salary if updated
    if (payload.basicSalary !== undefined || payload.allowances !== undefined) {
      const basic = Number(payload.basicSalary !== undefined ? payload.basicSalary : staff.basicSalary) || 0;
      const allow = Number(payload.allowances !== undefined ? payload.allowances : staff.allowances) || 0;
      payload.salary = basic + allow;
    }

    // Check for duplicates if updating unique fields
    const uniqueFields = ['staffId', 'email', 'officialEmail', 'username'];
    for (const field of uniqueFields) {
      if (payload[field] && payload[field] !== staff[field]) {
        const existing = await Staff.findOne({ where: { [field]: payload[field] } });
        if (existing) {
          return res.status(400).json({ message: `A staff member with this ${field} already exists` });
        }
      }
    }

    await staff.update(payload);
    res.json(staff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    if (error.name === 'SequelizeDatabaseError') {
       return res.status(400).json({ message: 'Database format error: ' + error.message });
    }
    res.status(500).json({ message: 'Server error while updating staff member', error: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/staff/:id
// @access  Private
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.destroy();
    res.json({ message: 'Staff member removed' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: 'Server error while deleting staff member' });
  }
};
