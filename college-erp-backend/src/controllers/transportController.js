const { Driver, Bus, TransportRoute, MaintenanceRecord, sequelize } = require('../models');

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      include: [{ model: Bus, as: 'assignedBus' }]
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const [updated] = await Driver.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedDriver = await Driver.findByPk(req.params.id);
      res.json(updatedDriver);
    } else {
      res.status(404).json({ error: 'Driver not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const deleted = await Driver.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Driver not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll({
      include: [
        { model: Driver, as: 'driver' },
        { model: TransportRoute, as: 'route' }
      ]
    });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const [updated] = await Bus.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedBus = await Bus.findByPk(req.params.id);
      res.json(updatedBus);
    } else {
      res.status(404).json({ error: 'Bus not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const deleted = await Bus.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Bus not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await TransportRoute.findAll({
      include: [{ model: Bus, as: 'bus', include: [{ model: Driver, as: 'driver' }] }]
    });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const route = await TransportRoute.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const [updated] = await TransportRoute.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRoute = await TransportRoute.findByPk(req.params.id);
      res.json(updatedRoute);
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const deleted = await TransportRoute.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMaintenanceRecords = async (req, res) => {
  try {
    const records = await MaintenanceRecord.findAll({
      include: [{ model: Bus, as: 'bus' }]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMaintenanceRecord = async (req, res) => {
  try {
    const record = await MaintenanceRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMaintenanceRecord = async (req, res) => {
  try {
    const [updated] = await MaintenanceRecord.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await MaintenanceRecord.findByPk(req.params.id);
      res.json(updatedRecord);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMaintenanceRecord = async (req, res) => {
  try {
    const deleted = await MaintenanceRecord.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalBuses = await Bus.count();
    const activeBuses = await Bus.count({ where: { status: 'Active' } });
    const maintenanceBuses = await Bus.count({ where: { condition: 'Maintenance' } });
    const nonRunningBuses = await Bus.count({ where: { condition: 'Not Running' } });
    
    const totalDrivers = await Driver.count();
    const activeRoutes = await TransportRoute.count({ where: { status: 'Active' } });
    
    // Calculate average occupancy
    const buses = await Bus.findAll();
    let totalCapacity = 0;
    let totalOccupancy = 0;
    buses.forEach(b => {
      totalCapacity += b.capacity || 0;
      totalOccupancy += b.occupancy || 0;
    });
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
    
    const delayedRoutes = await TransportRoute.count({ where: { status: 'Delayed' } });

    // Mock values for advanced analytics as no historical data is built
    const fuelEfficiencyScore = 85; 
    const monthlyCost = 125000;

    res.json({
      totalBuses, activeBuses, maintenanceBuses, nonRunningBuses,
      totalDrivers, activeRoutes, avgOccupancy, delayedRoutes,
      fuelEfficiencyScore, monthlyCost
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
