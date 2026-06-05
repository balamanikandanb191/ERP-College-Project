const { StudentAttendance, Student, User } = require('../models');
const { Op } = require('sequelize');

exports.getAttendance = async (req, res) => {
  try {
    const { course_id, semester_id, subject_id, staff_id, period_hour, date, academicYear, search } = req.query;
    
    const where = {};
    if (course_id) where.course_id = course_id;
    if (semester_id) where.semester_id = semester_id;
    if (subject_id) where.subject_id = subject_id;
    if (staff_id) where.staff_id = staff_id;
    if (period_hour) where.period_hour = period_hour;
    if (date) where.date = date;

    const studentWhere = {};
    if (academicYear) studentWhere.academicYear = academicYear;
    if (search) {
      studentWhere[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { registerNumber: { [Op.like]: `%${search}%` } }
      ];
    }

    const attendance = await StudentAttendance.findAll({
      where,
      include: [
        { 
          model: Student, 
          where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
          attributes: ['id', 'fullName', 'registerNumber', 'department', 'semester', 'academicYear'] 
        },
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
    if (Array.isArray(req.body)) {
      const results = [];
      for (const item of req.body) {
        const { student_id, date, status, remarks, course_id, semester_id, subject_id, staff_id, period_hour } = item;
        
        // Find existing record by student_id, date, subject_id, period_hour
        const existing = await StudentAttendance.findOne({ 
          where: { 
            student_id, 
            date, 
            subject_id: subject_id || null, 
            period_hour: period_hour || null 
          } 
        });

        if (existing) {
          await existing.update({ status, remarks, course_id, semester_id, staff_id, marked_by: req.user.id });
          results.push(existing);
        } else {
          const attendance = await StudentAttendance.create({
            student_id,
            date,
            status,
            remarks,
            course_id,
            semester_id,
            subject_id,
            staff_id,
            period_hour,
            marked_by: req.user.id
          });
          results.push(attendance);
        }
      }
      return res.status(201).json(results);
    } else {
      const { student_id, date, status, remarks, course_id, semester_id, subject_id, staff_id, period_hour } = req.body;
      
      const existing = await StudentAttendance.findOne({ 
        where: { 
          student_id, 
          date, 
          subject_id: subject_id || null, 
          period_hour: period_hour || null 
        } 
      });

      if (existing) {
        await existing.update({ status, remarks, course_id, semester_id, staff_id, marked_by: req.user.id });
        return res.json(existing);
      }

      const attendance = await StudentAttendance.create({
        student_id,
        date,
        status,
        remarks,
        course_id,
        semester_id,
        subject_id,
        staff_id,
        period_hour,
        marked_by: req.user.id
      });
      
      return res.status(201).json(attendance);
    }
  } catch (error) {
    console.error('Error creating student attendance:', error);
    res.status(500).json({ message: 'Server error creating student attendance' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, course_id, semester_id, subject_id, staff_id, period_hour } = req.body;

    const attendance = await StudentAttendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.update({ status, remarks, course_id, semester_id, subject_id, staff_id, period_hour });
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
