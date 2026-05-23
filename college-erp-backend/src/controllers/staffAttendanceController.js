const { StaffAttendance, Staff, User } = require('../models');

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await StaffAttendance.findAll({
      include: [
        { model: Staff, attributes: ['id', 'fullName', 'staffId', 'department', 'designation'] },
        { model: User, as: 'StaffMarker', attributes: ['email'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching staff attendance:', error);
    res.status(500).json({ message: 'Server error fetching staff attendance' });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { staff_id, date, status, remarks } = req.body;
    
    // Check for existing record
    const existing = await StaffAttendance.findOne({ where: { staff_id, date } });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this staff on this date' });
    }

    const attendance = await StaffAttendance.create({
      staff_id,
      date,
      status,
      remarks,
      marked_by: req.user.id
    });
    
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating staff attendance:', error);
    res.status(500).json({ message: 'Server error creating staff attendance' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await StaffAttendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.update({ status, remarks });
    res.json(attendance);
  } catch (error) {
    console.error('Error updating staff attendance:', error);
    res.status(500).json({ message: 'Server error updating staff attendance' });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await StaffAttendance.findByPk(id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff attendance:', error);
    res.status(500).json({ message: 'Server error deleting staff attendance' });
  }
};
