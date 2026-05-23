const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { StudentDocument, StaffDocument, Student, Staff } = require('../models');

const router = express.Router();

// Define allowed mime types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Create multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params; // 'students' or 'staff'
    const isPhoto = file.fieldname === 'photo';
    const folder = `uploads/${type}/${isPhoto ? 'photos' : 'documents'}`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.'));
    }
  }
});

// Helper for error handling
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// POST: Upload Profile Photo
router.post('/photo/:type/:id', upload.single('photo'), handleUploadError, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const photoUrl = req.file.path.replace(/\\/g, '/'); // Normalize slashes for web

    // Update the corresponding model
    if (type === 'students') {
      const student = await Student.findByPk(id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      student.photoUrl = photoUrl;
      await student.save();
    } else if (type === 'staff') {
      const staff = await Staff.findByPk(id);
      if (!staff) return res.status(404).json({ message: 'Staff not found' });
      staff.photoUrl = photoUrl;
      await staff.save();
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.json({ message: 'Photo uploaded successfully', photoUrl });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ message: 'Server error during photo upload' });
  }
});

// POST: Upload Document
router.post('/document/:type/:id', upload.single('document'), handleUploadError, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { documentType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No document uploaded' });
    }
    if (!documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    const filePath = req.file.path.replace(/\\/g, '/');
    const fileData = {
      documentType,
      fileName: req.file.originalname,
      filePath,
      mimeType: req.file.mimetype,
    };

    let document;
    if (type === 'students') {
      document = await StudentDocument.create({ ...fileData, studentId: id });
    } else if (type === 'staff') {
      document = await StaffDocument.create({ ...fileData, staffId: id });
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.status(201).json(document);
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Server error during document upload' });
  }
});

// GET: List Documents
router.get('/document/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let documents;

    if (type === 'students') {
      documents = await StudentDocument.findAll({ where: { studentId: id }, order: [['createdAt', 'DESC']] });
    } else if (type === 'staff') {
      documents = await StaffDocument.findAll({ where: { staffId: id }, order: [['createdAt', 'DESC']] });
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    res.json(documents);
  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).json({ message: 'Server error fetching documents' });
  }
});

// DELETE: Remove Document
router.delete('/document/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let document;

    if (type === 'students') {
      document = await StudentDocument.findByPk(id);
    } else if (type === 'staff') {
      document = await StaffDocument.findByPk(id);
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    const absolutePath = path.join(__dirname, '../../', document.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await document.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error deleting document' });
  }
});

module.exports = router;
