const { AssessmentConfig, AssessmentMark, Student, Staff } = require('../models');
const { Op } = require('sequelize');

// ─── Assessment Configuration CRUD ──────────────────────────────────────────

exports.createConfig = async (req, res) => {
  try {
    const { academic_year, course, semester, subject_name, subject_code,
      assessment_type, assessment_date, max_marks, staff_id, staff_name, experiment_count } = req.body;

    if (!academic_year || !course || !semester || !subject_name || !assessment_type || !max_marks) {
      return res.status(400).json({ message: 'Missing required fields: academic_year, course, semester, subject_name, assessment_type, max_marks' });
    }

    // Auto-generate assessment number per type, course, semester, subject, year
    const countExisting = await AssessmentConfig.count({
      where: { academic_year, course, semester, subject_name, assessment_type }
    });
    const assessment_number = countExisting + 1;

    const config = await AssessmentConfig.create({
      academic_year, course, semester, subject_name, subject_code: subject_code || '',
      assessment_type, assessment_date: assessment_date || null,
      max_marks: Number(max_marks), assessment_number, staff_id: staff_id || null,
      staff_name: staff_name || null, experiment_count: experiment_count ? Number(experiment_count) : null
    });

    res.status(201).json(config);
  } catch (error) {
    console.error('Error creating assessment config:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getConfigs = async (req, res) => {
  try {
    const { academic_year, course, semester, subject_name, assessment_type } = req.query;
    const where = {};
    if (academic_year) where.academic_year = academic_year;
    if (course) where.course = course;
    if (semester) where.semester = semester;
    if (subject_name) where.subject_name = subject_name;
    if (assessment_type) where.assessment_type = assessment_type;

    const configs = await AssessmentConfig.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(configs);
  } catch (error) {
    console.error('Error fetching assessment configs:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getConfigById = async (req, res) => {
  try {
    const config = await AssessmentConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ message: 'Config not found' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const config = await AssessmentConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ message: 'Config not found' });
    await config.update(req.body);
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.deleteConfig = async (req, res) => {
  try {
    const config = await AssessmentConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ message: 'Config not found' });
    await config.destroy();
    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ─── Assessment Marks CRUD ──────────────────────────────────────────────────

exports.saveMarks = async (req, res) => {
  try {
    const { marks } = req.body; // Array of mark objects
    if (!Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ message: 'marks array is required' });
    }

    const results = [];
    for (const mark of marks) {
      const { student_id, register_no, course, semester, subject_name, assessment_type,
        academic_year, assessment_number, marks_obtained, max_marks, status,
        observation_mark, record_mark, viva_mark, practical_mark,
        staff_id, staff_name, subject_code, roll_number, student_name, assessment_id } = mark;

      // Upsert: update if exists, create if not
      const existing = await AssessmentMark.findOne({
        where: {
          student_id,
          course,
          semester,
          subject_name,
          assessment_type,
          academic_year,
          assessment_number: assessment_number || 1
        }
      });

      if (existing) {
        await existing.update({
          marks_obtained: marks_obtained !== undefined ? marks_obtained : existing.marks_obtained,
          observation_mark: observation_mark !== undefined ? observation_mark : existing.observation_mark,
          record_mark: record_mark !== undefined ? record_mark : existing.record_mark,
          viva_mark: viva_mark !== undefined ? viva_mark : existing.viva_mark,
          practical_mark: practical_mark !== undefined ? practical_mark : existing.practical_mark,
          status: status || existing.status,
          staff_id,
          staff_name,
          subject_code,
          roll_number,
          assessment_id
        });
        results.push(existing);
      } else {
        const newMark = await AssessmentMark.create({
          student_id, register_no, roll_number, student_name,
          course, semester, subject_name, subject_code: subject_code || '',
          assessment_type, assessment_number: assessment_number || 1,
          academic_year, assessment_id: assessment_id || null,
          staff_id: staff_id || null, staff_name: staff_name || null,
          marks_obtained: marks_obtained !== undefined ? Number(marks_obtained) : null,
          max_marks: Number(max_marks) || 100,
          observation_mark: observation_mark !== undefined ? Number(observation_mark) : null,
          record_mark: record_mark !== undefined ? Number(record_mark) : null,
          viva_mark: viva_mark !== undefined ? Number(viva_mark) : null,
          practical_mark: practical_mark !== undefined ? Number(practical_mark) : null,
          status: status || 'Present'
        });
        results.push(newMark);
      }
    }
    res.status(201).json({ saved: results.length, marks: results });
  } catch (error) {
    console.error('Error saving assessment marks:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const { academic_year, course, semester, subject_name, assessment_type, assessment_number, student_id } = req.query;
    const where = {};
    if (academic_year) where.academic_year = academic_year;
    if (course) where.course = course;
    if (semester) where.semester = semester;
    if (subject_name) where.subject_name = subject_name;
    if (assessment_type) where.assessment_type = assessment_type;
    if (assessment_number) where.assessment_number = Number(assessment_number);
    if (student_id) where.student_id = student_id;

    const marks = await AssessmentMark.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateMark = async (req, res) => {
  try {
    const mark = await AssessmentMark.findByPk(req.params.id);
    if (!mark) return res.status(404).json({ message: 'Mark not found' });
    await mark.update(req.body);
    res.json(mark);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.deleteMark = async (req, res) => {
  try {
    const mark = await AssessmentMark.findByPk(req.params.id);
    if (!mark) return res.status(404).json({ message: 'Mark not found' });
    await mark.destroy();
    res.json({ message: 'Mark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ─── Report Endpoints ─────────────────────────────────────────────────────────

exports.getReport = async (req, res) => {
  try {
    const { reportType, academic_year, course, semester, subject_name, assessment_type } = req.query;
    const where = {};
    if (academic_year) where.academic_year = academic_year;
    if (course) where.course = course;
    if (semester) where.semester = semester;
    if (subject_name) where.subject_name = subject_name;
    if (assessment_type) where.assessment_type = assessment_type;

    const marks = await AssessmentMark.findAll({ where, order: [['student_name', 'ASC']] });

    // Group and compute summary stats
    const summary = {
      totalStudents: marks.length,
      present: marks.filter(m => m.status === 'Present').length,
      absent: marks.filter(m => m.status === 'Absent').length,
      averageMarks: marks.length > 0
        ? (marks.reduce((s, m) => s + (m.marks_obtained || 0), 0) / marks.filter(m => m.marks_obtained !== null).length).toFixed(2)
        : 0,
      highest: marks.length > 0 ? Math.max(...marks.map(m => m.marks_obtained || 0)) : 0,
      lowest: marks.filter(m => m.marks_obtained !== null).length > 0
        ? Math.min(...marks.filter(m => m.marks_obtained !== null).map(m => m.marks_obtained))
        : 0,
      passed: marks.filter(m => m.marks_obtained !== null && m.max_marks > 0 && m.marks_obtained >= m.max_marks * 0.4).length,
      failed: marks.filter(m => m.marks_obtained !== null && m.max_marks > 0 && m.marks_obtained < m.max_marks * 0.4).length
    };

    res.json({ marks, summary, reportType });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// ─── Get students for a course/semester combination ──────────────────────────

exports.getStudentsByCourse = async (req, res) => {
  try {
    const { course, semester, academic_year } = req.query;
    if (!course) return res.status(400).json({ message: 'course is required' });

    const where = {};
    // Match exactly or partly
    where.course = { [Op.like]: `%${course}%` };
    if (semester) where.semester = semester;
    if (academic_year) where.academicYear = academic_year;

    const students = await Student.findAll({
      where,
      attributes: ['id', 'fullName', 'registerNumber', 'course', 'semester', 'section', 'academicYear', 'department'],
      order: [['fullName', 'ASC']]
    });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students by course:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
