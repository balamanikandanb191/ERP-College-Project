const { StudentAttendance, Student, User } = require('../models');

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await StudentAttendance.findAll({
      include: [
        { model: Student, attributes: ['id', 'fullName', 'registerNumber', 'department', 'semester'] },
        { model: User, as: 'StudentMarker', attributes: ['email'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Server error fetching student attendance' });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { student_id, date, status, remarks } = req.body;
    
    // Check for existing record
    const existing = await StudentAttendance.findOne({ where: { student_id, date } });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this student on this date' });
    }

    const attendance = await StudentAttendance.create({
      student_id,
      date,
      status,
      remarks,
      marked_by: req.user.id
    });
    
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating student attendance:', error);
    res.status(500).json({ message: 'Server error creating student attendance' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await StudentAttendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.update({ status, remarks });
    res.json(attendance);
  } catch (error) {
    console.error('Error updating student attendance:', error);
    res.status(500).json({ message: 'Server error updating student attendance' });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await StudentAttendance.findByPk(id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting student attendance:', error);
    res.status(500).json({ message: 'Server error deleting student attendance' });
  }
};
