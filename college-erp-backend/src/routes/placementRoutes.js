const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');

// Analytics
router.get('/analytics', placementController.getPlacementAnalytics);

// Companies
router.get('/companies', placementController.getAllCompanies);
router.post('/companies', placementController.createCompany);

// Drives
router.get('/drives', placementController.getAllDrives);

// Records
router.get('/records', placementController.getAllPlacementRecords);

// Internships
router.get('/internships', placementController.getAllInternships);

// Fees
router.get('/fees', placementController.getPlacementFees);

module.exports = router;
