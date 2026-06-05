const {
  MasterRecord,
  AcademicYearMaster,
  ClassMaster,
  DesignationMaster,
  ExamMaster,
  FeeMaster
} = require('../models');

const getModelAndMapping = (type) => {
  switch (type) {
    case 'acad_year':
      return {
        model: AcademicYearMaster,
        toClient: (record) => ({ id: record.id, data: record.toJSON() }),
        fromClient: (data) => ({
          year: data.year,
          startDate: data.startDate,
          endDate: data.endDate,
          admissionStart: data.admissionStart || null,
          admissionEnd: data.admissionEnd || null,
          active: data.active === true
        })
      };
    case 'class_master':
      return {
        model: ClassMaster,
        toClient: (record) => ({ id: record.id, data: record.toJSON() }),
        fromClient: (data) => ({
          name: data.name,
          shortCode: data.shortCode || null,
          depts: data.depts || null,
          maxSections: data.maxSections !== undefined ? Number(data.maxSections) : 4,
          maxStrength: data.maxStrength !== undefined ? Number(data.maxStrength) : 60,
          semType: data.semType || 'Semester',
          active: data.active !== false
        })
      };
    case 'designation':
      return {
        model: DesignationMaster,
        toClient: (record) => ({ id: record.id, data: record.toJSON() }),
        fromClient: (data) => ({
          title: data.title,
          shortCode: data.shortCode || null,
          dept: data.dept || 'All',
          gradePay: data.gradePay || null,
          level: data.level || 'Junior',
          active: data.active !== false
        })
      };
    case 'exam_master':
      return {
        model: ExamMaster,
        toClient: (record) => ({ id: record.id, data: record.toJSON() }),
        fromClient: (data) => ({
          name: data.name,
          shortName: data.shortName || null,
          type: data.type || null,
          maxMarks: data.maxMarks !== undefined ? Number(data.maxMarks) : 100,
          passMark: data.passMark !== undefined ? Number(data.passMark) : 40,
          month: data.month || null,
          year: data.year || null,
          gpaWeight: data.gpaWeight !== undefined ? Number(data.gpaWeight) : 0,
          active: data.active !== false
        })
      };
    case 'fee_master':
      return {
        model: FeeMaster,
        toClient: (record) => ({ id: record.id, data: record.toJSON() }),
        fromClient: (data) => ({
          feeType: data.feeType,
          year: data.year || null,
          dept: data.dept || null,
          amount: data.amount !== undefined ? Number(data.amount) : 0,
          dueDate: data.dueDate,
          term: data.term || null,
          active: data.active !== false
        })
      };
    default:
      return {
        model: MasterRecord,
        toClient: (record) => ({ id: record.id, data: record.data }),
        fromClient: (data) => ({ data })
      };
  }
};

// Fetch all records of a specific master type
exports.getMasters = async (req, res) => {
  try {
    const { type } = req.params;
    const { model, toClient } = getModelAndMapping(type);
    
    let records;
    if (model === MasterRecord) {
      records = await MasterRecord.findAll({
        where: { type },
        order: [['created_at', 'ASC']]
      });
    } else {
      records = await model.findAll({
        order: [['created_at', 'ASC']]
      });
    }

    res.json(records.map(toClient));
  } catch (error) {
    console.error(`Error fetching masters for type ${req.params.type}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new master record
exports.createMaster = async (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ message: 'Data payload is required' });
    }

    const { model, toClient, fromClient } = getModelAndMapping(type);
    
    let record;
    if (model === MasterRecord) {
      record = await MasterRecord.create({
        type,
        data
      });
    } else {
      const dbData = fromClient(data);
      record = await model.create(dbData);
    }
    
    res.status(201).json(toClient(record));
  } catch (error) {
    console.error(`Error creating master for type ${req.params.type}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing master record
exports.updateMaster = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { data } = req.body;

    const { model, toClient, fromClient } = getModelAndMapping(type);
    const record = await model.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (model === MasterRecord) {
      await record.update({ data });
    } else {
      const dbData = fromClient(data);
      await record.update(dbData);
    }

    res.json(toClient(record));
  } catch (error) {
    console.error(`Error updating master ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a master record
exports.deleteMaster = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { model } = getModelAndMapping(type);
    
    const record = await model.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(`Error deleting master ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};
