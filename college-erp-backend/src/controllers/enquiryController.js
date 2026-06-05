const { Enquiry, Staff } = require('../models');
const { Op } = require('sequelize');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const {
      studentName,
      mobileNo,
      parentName,
      parentMobile,
      doorNo,
      streetName,
      village,
      post,
      taluk,
      district,
      pinCode,
      annualIncome,
      community,
      schoolType,
      currentStandard,
      neededStandard,
      studentRegNo,
      source,
      transport,
      hostel,
      status,
      schoolName,
      schoolAddress,
      city,
      tenantId,
      notes
    } = req.body;

    // Field validations
    if (!studentName || studentName.trim() === '') {
      return res.status(400).json({ message: 'Student Name is required' });
    }
    if (!mobileNo || mobileNo.trim() === '') {
      return res.status(400).json({ message: 'Mobile Number is required' });
    }
    if (!parentName || parentName.trim() === '') {
      return res.status(400).json({ message: 'Parent Name is required' });
    }
    if (!parentMobile || parentMobile.trim() === '') {
      return res.status(400).json({ message: 'Parent Mobile is required' });
    }
    if (!neededStandard || neededStandard.trim() === '') {
      return res.status(400).json({ message: 'Needed Standard is required' });
    }
    if (!source || source.trim() === '') {
      return res.status(400).json({ message: 'Source is required' });
    }

    // Auto-generate Unique EQID (EQ_YYYY_XXX)
    const currentYear = new Date().getFullYear();
    const count = await Enquiry.count({
      where: {
        eqid: {
          [Op.like]: `EQ_${currentYear}_%`
        }
      }
    });
    const sequentialNumber = String(count + 1).padStart(3, '0');
    const eqid = `EQ_${currentYear}_${sequentialNumber}`;

    const newEnquiry = await Enquiry.create({
      eqid,
      studentName,
      mobileNo,
      parentName,
      parentMobile,
      doorNo,
      streetName,
      village,
      post,
      taluk,
      district,
      pinCode,
      annualIncome,
      community,
      schoolType,
      currentStandard,
      neededStandard,
      studentRegNo,
      source,
      transport: transport || 'No',
      hostel: hostel || 'No',
      status: status || 'New',
      schoolName,
      schoolAddress,
      city: city || district, // fallback to district if city is empty
      tenantId: tenantId || 'Tenant',
      calls: 0,
      notes
    });

    res.status(201).json({ success: true, data: newEnquiry });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ message: 'Server error while creating enquiry', error: error.message });
  }
};

// Fetch enquiries with search, sorting, filtering, and pagination
exports.getEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      neededStandard,
      source,
      city,
      tenantId,
      staffId,
      hostel,
      transport,
      unassigned, // boolean string 'true' / 'false'
      called, // 'true' / 'false'
      startDate,
      endDate
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = {};

    // Global Search
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { studentName: { [Op.like]: `%${search}%` } },
        { mobileNo: { [Op.like]: `%${search}%` } },
        { studentRegNo: { [Op.like]: `%${search}%` } },
        { eqid: { [Op.like]: `%${search}%` } }
      ];
    }

    // Specific Filters
    if (status && status !== 'All') {
      whereClause.status = status;
    }
    if (neededStandard && neededStandard !== 'All') {
      whereClause.neededStandard = neededStandard;
    }
    if (source && source !== 'All') {
      whereClause.source = source;
    }
    if (city && city !== 'All') {
      whereClause.city = city;
    }
    if (tenantId && tenantId !== 'All') {
      whereClause.tenantId = tenantId;
    }
    if (staffId) {
      if (staffId === 'Unassigned') {
        whereClause.staffId = null;
      } else {
        whereClause.staffId = staffId;
      }
    }
    if (unassigned === 'true') {
      whereClause.staffId = null;
    }
    if (hostel && hostel !== 'All') {
      whereClause.hostel = hostel;
    }
    if (transport && transport !== 'All') {
      whereClause.transport = transport;
    }

    // Called vs Not Called
    if (called === 'true') {
      whereClause.calls = { [Op.gt]: 0 };
    } else if (called === 'false') {
      whereClause.calls = 0;
    }

    // Date range
    if (startDate && endDate) {
      whereClause.enquiryDate = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.enquiryDate = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.enquiryDate = {
        [Op.lte]: endDate
      };
    }

    const { count, rows } = await Enquiry.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
      data: rows
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Server error while fetching enquiries', error: error.message });
  }
};

// Update an enquiry (e.g. status, calls, assigned staff, notes)
exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const payload = { ...req.body };

    // If staff assignment is being modified, map staffName if needed
    if (payload.staffId && payload.staffId !== enquiry.staffId) {
      if (payload.staffId === 'Unassigned') {
        payload.staffId = null;
        payload.staffName = null;
      } else {
        const staffMember = await Staff.findOne({ where: { staffId: payload.staffId } });
        if (staffMember) {
          payload.staffName = staffMember.fullName;
        }
      }
    }

    await enquiry.update(payload);
    res.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ message: 'Server error while updating enquiry', error: error.message });
  }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    await enquiry.destroy();
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ message: 'Server error while deleting enquiry' });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Enquiry.count();
    
    // Active Leads = New + Follow-up + Interested
    const activeLeads = await Enquiry.count({
      where: {
        status: {
          [Op.in]: ['New', 'Follow-up', 'Interested']
        }
      }
    });

    // Confirmed Leads = Confirmed
    const confirmedLeads = await Enquiry.count({
      where: { status: 'Confirmed' }
    });

    // Rejected/Closed = Rejected + Closed
    const rejectedClosedLeads = await Enquiry.count({
      where: {
        status: {
          [Op.in]: ['Rejected', 'Closed']
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalLeads,
        activeLeads,
        confirmedLeads,
        rejectedClosedLeads
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error while getting dashboard stats' });
  }
};

// Get Caller Team Stats
exports.getCallerStats = async (req, res) => {
  try {
    // Fetch all staff who can be callers (e.g. staff whose role allows telecalling, or just all staff for simplicity)
    const staffMembers = await Staff.findAll({
      order: [['fullName', 'ASC']]
    });

    const callerStats = [];

    for (const staff of staffMembers) {
      // Find enquiries assigned to this staffId
      const assignedCount = await Enquiry.count({
        where: { staffId: staff.staffId }
      });

      // Sum of calls for enquiries assigned to this staffId
      const totalCalls = await Enquiry.sum('calls', {
        where: { staffId: staff.staffId }
      }) || 0;

      // Confirmed enquiries assigned to this staffId
      const confirmedCount = await Enquiry.count({
        where: {
          staffId: staff.staffId,
          status: 'Confirmed'
        }
      });

      // Conversion rate = (Confirmed / Assigned) * 100
      const conversionRate = assignedCount > 0 
        ? ((confirmedCount / assignedCount) * 100).toFixed(2) 
        : '0.00';

      callerStats.push({
        staffId: staff.staffId,
        fullName: staff.fullName,
        designation: staff.designation || 'Caller',
        phone: staff.phone || '',
        assignedLeads: assignedCount,
        totalCalls,
        conversionRate: parseFloat(conversionRate)
      });
    }

    res.json({ success: true, data: callerStats });
  } catch (error) {
    console.error('Error getting caller stats:', error);
    res.status(500).json({ message: 'Server error while getting caller stats' });
  }
};
