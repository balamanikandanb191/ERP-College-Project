const { ClassAllocation } = require('../models');

exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await ClassAllocation.findAll({ order: [['created_at', 'DESC']] });
    res.json(allocations);
  } catch (error) {
    console.error('Error fetching class allocations:', error);
    res.status(500).json({ message: 'Server error fetching class allocations' });
  }
};

exports.createAllocation = async (req, res) => {
  try {
    const newAllocation = await ClassAllocation.create(req.body);
    res.status(201).json(newAllocation);
  } catch (error) {
    console.error('Error creating class allocation:', error);
    res.status(500).json({ message: 'Server error creating class allocation' });
  }
};

exports.updateAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const allocation = await ClassAllocation.findByPk(id);
    if (!allocation) return res.status(404).json({ message: 'Class allocation not found' });

    await allocation.update(req.body);
    res.json(allocation);
  } catch (error) {
    console.error('Error updating class allocation:', error);
    res.status(500).json({ message: 'Server error updating class allocation' });
  }
};

exports.deleteAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const allocation = await ClassAllocation.findByPk(id);
    if (!allocation) return res.status(404).json({ message: 'Class allocation not found' });

    await allocation.destroy();
    res.json({ message: 'Class allocation deleted successfully' });
  } catch (error) {
    console.error('Error deleting class allocation:', error);
    res.status(500).json({ message: 'Server error deleting class allocation' });
  }
};
