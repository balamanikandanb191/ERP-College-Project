const { HostelRoom, HostelWarden, HostelStudent, HostelComplaint, HostelExpense, HostelFinancialReport, Student } = require('../models');

// --- ROOMS ---
exports.getRooms = async (req, res) => {
  try {
    const rooms = await HostelRoom.findAll({
      include: [
        { model: HostelWarden, as: 'warden', attributes: ['id', 'fullName', 'phone'] },
        { 
          model: HostelStudent, 
          as: 'occupants',
          include: [{ model: Student, as: 'studentDetails', attributes: ['fullName', 'registerNumber', 'department', 'photoUrl'] }]
        }
      ]
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching hostel rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await HostelRoom.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    await room.update(req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    await room.destroy();
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- WARDENS ---
exports.getWardens = async (req, res) => {
  try {
    const wardens = await HostelWarden.findAll();
    res.json(wardens);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createWarden = async (req, res) => {
  try {
    const warden = await HostelWarden.create(req.body);
    res.status(201).json(warden);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWarden = async (req, res) => {
  try {
    const warden = await HostelWarden.findByPk(req.params.id);
    if (!warden) return res.status(404).json({ message: 'Warden not found' });
    await warden.update(req.body);
    res.json(warden);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteWarden = async (req, res) => {
  try {
    const warden = await HostelWarden.findByPk(req.params.id);
    if (!warden) return res.status(404).json({ message: 'Warden not found' });
    await warden.destroy();
    res.json({ message: 'Warden deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- STUDENTS ---

// Returns all master students who are NOT currently checked-in to any hostel room
// Used to populate the "Select Student" dropdown in the Add Resident modal
exports.getAvailableStudents = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    // Get IDs of students already in hostel (active)
    const activeHostelStudents = await HostelStudent.findAll({
      where: { hostelStatus: 'Checked In' },
      attributes: ['studentId']
    });
    const assignedIds = activeHostelStudents.map(h => h.studentId);

    // Fetch all master students excluding already-assigned ones
    const where = assignedIds.length > 0 ? { id: { [Op.notIn]: assignedIds } } : {};
    const students = await Student.findAll({
      where,
      attributes: ['id', 'fullName', 'registerNumber', 'department', 'course', 'semester', 'phone'],
      order: [['fullName', 'ASC']]
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching available students for hostel:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const students = await HostelStudent.findAll({
      include: [
        { model: Student, as: 'studentDetails', attributes: ['fullName', 'registerNumber', 'department', 'phone'] },
        { model: HostelRoom, as: 'room', attributes: ['roomNumber', 'hostelBlock'] }
      ]
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching hostel students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = await HostelStudent.create(req.body);
    
    // Update occupied beds
    const room = await HostelRoom.findByPk(req.body.roomId);
    if (room) {
      await room.update({ occupiedBeds: room.occupiedBeds + 1 });
    }
    
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await HostelStudent.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await HostelStudent.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    // Decrease occupied beds
    const room = await HostelRoom.findByPk(student.roomId);
    if (room && room.occupiedBeds > 0) {
      await room.update({ occupiedBeds: room.occupiedBeds - 1 });
    }
    
    await student.destroy();
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- COMPLAINTS ---
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await HostelComplaint.findAll({
      include: [
        { model: Student, as: 'complainingStudent', attributes: ['fullName', 'registerNumber'] },
        { model: HostelRoom, as: 'complaintRoom', attributes: ['roomNumber', 'hostelBlock'] }
      ]
    });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching hostel complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await HostelComplaint.create(req.body);
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await HostelComplaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    await complaint.update(req.body);
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await HostelComplaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    await complaint.destroy();
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- EXPENSES ---
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await HostelExpense.findAll({ order: [['expenseDate', 'DESC']] });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const expense = await HostelExpense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await HostelExpense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await expense.update(req.body);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await HostelExpense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await expense.destroy();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- ANALYTICS ---
exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await HostelStudent.count({ where: { hostelStatus: 'Checked In' } });
    const rooms = await HostelRoom.findAll();
    const wardens = await HostelWarden.count();
    
    let totalRooms = rooms.length;
    let occupiedRooms = rooms.filter(r => r.occupiedBeds > 0).length;
    let availableRooms = rooms.filter(r => r.occupiedBeds < r.totalBeds).length;
    
    let totalBeds = rooms.reduce((sum, r) => sum + r.totalBeds, 0);
    let occupiedBeds = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
    let availableBeds = totalBeds - occupiedBeds;

    // Financial Analytics
    const expenses = await HostelExpense.findAll();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const students = await HostelStudent.findAll();
    const totalRevenue = students.reduce((sum, s) => sum + (s.monthlyFeePaid || 0), 0);
    const pendingFees = students.reduce((sum, s) => sum + (s.pendingAmount || 0), 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;
    
    const monthlyRevenueTrend = [
      { month: 'Jan', revenue: totalRevenue * 0.8 },
      { month: 'Feb', revenue: totalRevenue * 0.85 },
      { month: 'Mar', revenue: totalRevenue * 0.9 },
      { month: 'Apr', revenue: totalRevenue },
    ];
    
    const expenseCategories = {};
    expenses.forEach(e => {
      expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
    });
    const expenseDistribution = Object.keys(expenseCategories).map(k => ({
      name: k,
      value: expenseCategories[k]
    }));

    res.json({
      totalStudents,
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      totalWardens: wardens,
      checkInsToday: 0,
      checkOutsToday: 0,
      totalRevenue,
      totalExpenses,
      netProfit,
      pendingFees,
      profitMargin,
      monthlyRevenueTrend,
      expenseDistribution
    });
  } catch (error) {
    console.error('Error fetching hostel analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
