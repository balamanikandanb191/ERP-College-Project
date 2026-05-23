const { Timetable, TimetableSettings, Staff } = require('../models');
const { Op } = require('sequelize');

exports.getMySchedule = async (req, res) => {
  try {
    const staff = await Staff.findOne({ where: { user_id: req.user.id } });
    if (!staff) return res.status(404).json({ message: 'Staff profile not found' });
    
    const timetables = await Timetable.findAll({
      where: { staffId: staff.id },
      include: [{ model: Staff, as: 'staff', attributes: ['id', 'fullName', 'staffId', 'department'] }],
      order: [['day', 'ASC'], ['periodNumber', 'ASC']]
    });
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTimetables = async (req, res) => {
  try {
    const whereClause = {};
    if (req.user.role === 'Staff' || req.user.role === 'Teacher') {
      const staff = await Staff.findOne({ where: { user_id: req.user.id } });
      if (staff) whereClause.staffId = staff.id;
    } else if (req.query.department) {
      whereClause.department = req.query.department;
    }

    const timetables = await Timetable.findAll({
      where: whereClause,
      include: [{ model: Staff, as: 'staff', attributes: ['id', 'fullName', 'staffId', 'department'] }],
      order: [['day', 'ASC'], ['periodNumber', 'ASC']]
    });

    res.json(timetables);
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTimetable = async (req, res) => {
  try {
    const { staffId, day, periodNumber, roomNumber, department, year, semester, section } = req.body;

    // Conflict detection
    const existingConflicts = await Timetable.findAll({
      where: {
        day,
        periodNumber,
        [Op.or]: [
          { staffId }, // Staff assigned elsewhere
          { roomNumber }, // Room occupied
          { department, year, semester, section } // Class already has a period
        ]
      }
    });

    if (existingConflicts.length > 0) {
      const conflictReason = existingConflicts.map(c => {
        if (c.staffId === staffId) return 'Staff is already assigned to another class in this period.';
        if (c.roomNumber === roomNumber) return `Classroom ${roomNumber} is already occupied.`;
        return 'This class section already has an assigned period at this time.';
      })[0];
      return res.status(400).json({ success: false, message: conflictReason });
    }

    const timetable = await Timetable.create(req.body);
    res.status(201).json({ success: true, data: timetable });
  } catch (error) {
    console.error('Timetable Save Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    await timetable.update(req.body);
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    await timetable.destroy();
    res.json({ message: 'Timetable deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    let settings = await TimetableSettings.findOne();
    if (!settings) {
      settings = await TimetableSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await TimetableSettings.findOne();
    if (settings) {
      await settings.update(req.body);
    } else {
      settings = await TimetableSettings.create(req.body);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const allTimetables = await Timetable.findAll();
    const activeStaffSet = new Set();
    const departmentDensity = {};
    let freePeriods = 0; // Mocked - requires all possible periods
    let substituteClasses = 0;

    allTimetables.forEach(t => {
      activeStaffSet.add(t.staffId);
      departmentDensity[t.department] = (departmentDensity[t.department] || 0) + 1;
      if (t.status === 'Substitute') substituteClasses++;
    });

    const activeStaffToday = activeStaffSet.size;
    const totalScheduled = allTimetables.filter(t => t.status === 'Scheduled').length;
    
    const densityArray = Object.keys(departmentDensity).map(k => ({
      name: k,
      value: departmentDensity[k]
    }));

    res.json({
      totalScheduled,
      activeStaffToday,
      freePeriods: 120, // Example mocked metric
      substituteClasses,
      classroomUsage: 85, // Example mocked %
      densityArray
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
