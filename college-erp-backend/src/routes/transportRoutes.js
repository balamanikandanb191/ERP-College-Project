const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');

// Bus Routes
router.get('/buses', transportController.getBuses);
router.post('/buses', transportController.createBus);
router.put('/buses/:id', transportController.updateBus);
router.delete('/buses/:id', transportController.deleteBus);

// Driver Routes
router.get('/drivers', transportController.getDrivers);
router.post('/drivers', transportController.createDriver);
router.put('/drivers/:id', transportController.updateDriver);
router.delete('/drivers/:id', transportController.deleteDriver);

// Route Routes
router.get('/routes', transportController.getRoutes);
router.post('/routes', transportController.createRoute);
router.put('/routes/:id', transportController.updateRoute);
router.delete('/routes/:id', transportController.deleteRoute);

// Maintenance Routes
router.get('/maintenance', transportController.getMaintenanceRecords);
router.post('/maintenance', transportController.createMaintenanceRecord);
router.put('/maintenance/:id', transportController.updateMaintenanceRecord);
router.delete('/maintenance/:id', transportController.deleteMaintenanceRecord);

// Analytics
router.get('/analytics', transportController.getAnalytics);

module.exports = router;
