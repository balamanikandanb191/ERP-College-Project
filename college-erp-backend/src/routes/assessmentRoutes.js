const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assessmentController');

// Assessment Configuration
router.get('/config', ctrl.getConfigs);
router.post('/config', ctrl.createConfig);
router.get('/config/:id', ctrl.getConfigById);
router.put('/config/:id', ctrl.updateConfig);
router.delete('/config/:id', ctrl.deleteConfig);

// Assessment Marks
router.get('/marks', ctrl.getMarks);
router.post('/marks', ctrl.saveMarks);
router.put('/marks/:id', ctrl.updateMark);
router.delete('/marks/:id', ctrl.deleteMark);

// Reports
router.get('/report', ctrl.getReport);

// Students by Course/Semester
router.get('/students', ctrl.getStudentsByCourse);

module.exports = router;
