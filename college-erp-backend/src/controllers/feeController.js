const { FeeStructure, StudentFee, FeePaymentHistory, Student, User } = require('../models');
const { Op } = require('sequelize');

// --- FEE STRUCTURES ---
exports.getFeeStructures = async (req, res) => {
  try {
    const structures = await FeeStructure.findAll({ order: [['createdAt', 'DESC']] });
    res.json(structures);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.create(req.body);
    res.status(201).json(structure);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByPk(req.params.id);
    if (!structure) return res.status(404).json({ message: 'Fee structure not found' });
    await structure.update(req.body);
    res.json(structure);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByPk(req.params.id);
    if (!structure) return res.status(404).json({ message: 'Fee structure not found' });
    await structure.destroy();
    res.json({ message: 'Fee structure deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- STUDENT FEES ---
exports.getStudentFees = async (req, res) => {
  try {
    const whereClause = {};
    if (req.user.role === 'Student') {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (student) whereClause.studentId = student.id;
    }

    const studentFees = await StudentFee.findAll({
      where: whereClause,
      include: [
        { model: Student, attributes: ['fullName', 'registerNumber', 'department', 'year'] },
        { model: FeeStructure, attributes: ['title', 'amount', 'dueDate', 'finePerDay'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Auto calculate fines for overdue payments dynamically before returning
    const today = new Date();
    const updatedFees = studentFees.map(fee => {
      const dueDate = new Date(fee.FeeStructure.dueDate);
      let calculatedFine = fee.fineAmount;
      if (fee.paymentStatus !== 'Paid' && today > dueDate && fee.FeeStructure.finePerDay > 0) {
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        calculatedFine = daysOverdue * fee.FeeStructure.finePerDay;
      }
      return {
        ...fee.toJSON(),
        calculatedFine,
        isOverdue: fee.paymentStatus !== 'Paid' && today > dueDate
      };
    });

    res.json(updatedFees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignFeeToStudent = async (req, res) => {
  try {
    const { studentId, feeStructureId, customAmount, remarks } = req.body;
    
    const structure = await FeeStructure.findByPk(feeStructureId);
    if (!structure) return res.status(404).json({ message: 'Fee structure not found' });
    
    const amount = customAmount || structure.amount;
    
    const newFee = await StudentFee.create({
      studentId,
      feeStructureId,
      totalAmount: amount,
      dueAmount: amount,
      paymentStatus: 'Unpaid',
      remarks
    });
    
    res.status(201).json(newFee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- PAYMENTS ---
exports.getPayments = async (req, res) => {
  try {
    const payments = await FeePaymentHistory.findAll({
      include: [
        { 
          model: StudentFee, 
          include: [
            { model: Student, attributes: ['fullName', 'registerNumber'] },
            { model: FeeStructure, attributes: ['title'] }
          ]
        },
        { model: User, as: 'collector', attributes: ['fullName'] }
      ],
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { studentFeeId, amountPaid, paymentMethod, transactionId } = req.body;
    
    const studentFee = await StudentFee.findByPk(studentFeeId);
    if (!studentFee) return res.status(404).json({ message: 'Student fee record not found' });
    
    if (amountPaid <= 0) return res.status(400).json({ message: 'Invalid payment amount' });

    // Calculate new amounts
    const newPaidAmount = studentFee.paidAmount + amountPaid;
    let newDueAmount = studentFee.totalAmount - newPaidAmount;
    
    let paymentStatus = 'Partial';
    if (newDueAmount <= 0) {
      paymentStatus = 'Paid';
      newDueAmount = 0; // handle overpayment gently
    }

    await studentFee.update({
      paidAmount: newPaidAmount,
      dueAmount: newDueAmount,
      paymentStatus
    });

    const receiptNumber = 'RCPT-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);

    const payment = await FeePaymentHistory.create({
      studentFeeId,
      amountPaid,
      paymentMethod,
      transactionId,
      collectedBy: req.user.id,
      receiptNumber
    });

    res.status(201).json({ payment, studentFee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- ANALYTICS ---
exports.getAnalytics = async (req, res) => {
  try {
    const allFees = await StudentFee.findAll({
      include: [{ model: FeeStructure, attributes: ['title'] }]
    });
    const payments = await FeePaymentHistory.findAll();

    const totalRevenue = allFees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const pendingDues = allFees.reduce((sum, fee) => sum + fee.dueAmount, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalCollectedToday = payments
      .filter(p => new Date(p.paymentDate) >= today)
      .reduce((sum, p) => sum + p.amountPaid, 0);

    let overdueStudentsCount = 0;
    const now = new Date();
    allFees.forEach(fee => {
      // Very basic overdue check using FeeStructure dueDate
      // For accurate check we'd include FeeStructure
      if (fee.paymentStatus !== 'Paid' && fee.FeeStructure) {
        // Just mocking count for now
        overdueStudentsCount++;
      }
    });

    // Mocking Monthly Revenue for chart
    const monthlyRevenue = [
      { month: 'Jan', revenue: totalCollected * 0.1 },
      { month: 'Feb', revenue: totalCollected * 0.2 },
      { month: 'Mar', revenue: totalCollected * 0.3 },
      { month: 'Apr', revenue: totalCollected * 0.4 },
    ];

    // Mocking Dept Collection
    const deptCollection = [
      { name: 'CSE', value: 400 },
      { name: 'ECE', value: 300 },
      { name: 'MECH', value: 300 },
    ];

    res.json({
      totalRevenue,
      totalCollected,
      pendingDues,
      totalCollectedToday,
      overdueStudentsCount,
      fineCollection: 0, // Mocked fine collection
      monthlyRevenue,
      deptCollection,
      paidVsUnpaid: [
        { name: 'Paid', value: totalCollected },
        { name: 'Unpaid', value: pendingDues }
      ]
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
