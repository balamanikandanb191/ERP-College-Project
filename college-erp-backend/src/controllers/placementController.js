const { Company, PlacementDrive, PlacementRecord, PlacementFee, Internship, Student, Staff } = require('../models');
const { Op } = require('sequelize');

// @desc    Get placement analytics
// @route   GET /api/placement/analytics
// @access  Private
exports.getPlacementAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const placedCount = await PlacementRecord.count({ where: { status: 'Accepted' } });
    const companiesCount = await Company.count();
    const internshipsCount = await Internship.count();
    const totalOffers = await PlacementRecord.count();
    
    // Package stats
    const records = await PlacementRecord.findAll({ where: { status: 'Accepted' } });
    const packages = records.map(r => Number(r.package)).filter(p => !isNaN(p));
    const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
    const avgPackage = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0;

    // Fee stats
    const fees = await PlacementFee.findAll();
    const totalFeesCollected = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const paidCount = fees.filter(f => f.status === 'Paid').length;
    const pendingCount = totalStudents - paidCount;

    res.json({
      totalStudents,
      placedCount,
      companiesCount,
      internshipsCount,
      totalOffers,
      highestPackage,
      avgPackage,
      successPercentage: totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(1) : 0,
      fees: {
        totalFeesCollected,
        paidCount,
        pendingCount
      }
    });
  } catch (error) {
    console.error('Placement Analytics Error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};

// --- COMPANY CONTROLLERS ---

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [['name', 'ASC']] });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- DRIVE CONTROLLERS ---

exports.getAllDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.findAll({
      include: [{ model: Company }],
      order: [['driveDate', 'DESC']]
    });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- PLACEMENT RECORDS ---

exports.getAllPlacementRecords = async (req, res) => {
  try {
    const records = await PlacementRecord.findAll({
      include: [
        { model: Student, attributes: ['fullName', 'registerNumber', 'department'] },
        { model: Company, attributes: ['name', 'logoUrl'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- INTERNSHIPS ---

exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll({
      include: [{ model: Student, attributes: ['fullName', 'registerNumber', 'department'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- FEES ---

exports.getPlacementFees = async (req, res) => {
  try {
    const fees = await PlacementFee.findAll({
      include: [{ model: Student, attributes: ['fullName', 'registerNumber', 'department'] }]
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
