const { MasterRecord } = require('../models');

// Fetch all records of a specific master type
exports.getMasters = async (req, res) => {
  try {
    const { type } = req.params;
    const records = await MasterRecord.findAll({
      where: { type },
      order: [['created_at', 'ASC']]
    });
    res.json(records);
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

    const record = await MasterRecord.create({
      type,
      data
    });
    
    res.status(201).json(record);
  } catch (error) {
    console.error(`Error creating master for type ${req.params.type}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing master record
exports.updateMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const record = await MasterRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await record.update({ data });
    res.json(record);
  } catch (error) {
    console.error(`Error updating master ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a master record
exports.deleteMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MasterRecord.findByPk(id);
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
