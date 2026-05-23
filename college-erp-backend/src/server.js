const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require('./config/database');
const { seedDatabase } = require('./utils/seed');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
const staffAttendanceRoutes = require('./routes/staffAttendanceRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRecordRoutes = require('./routes/borrowRecordRoutes');
const libraryAnalyticsRoutes = require('./routes/libraryAnalyticsRoutes');
const transportRoutes = require('./routes/transportRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const feeRoutes = require('./routes/feeRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const settingRoutes = require('./routes/settingRoutes');
const placementRoutes = require('./routes/placementRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const masterRoutes = require('./routes/masterRoutes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend static files from college-erp-frontend/dist
const frontendDist = path.join(__dirname, '../../college-erp-frontend/dist');
app.use(express.static(frontendDist));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/student-attendance', studentAttendanceRoutes);
app.use('/api/staff-attendance', staffAttendanceRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow-records', borrowRecordRoutes);
app.use('/api/library-analytics', libraryAnalyticsRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/masters', masterRoutes);

// Fallback all non-API GET requests to frontend's index.html
app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
    }
    res.sendFile('index.html', { root: frontendDist }, (err) => {
        if (err) {
            next();
        }
    });
});

const PORT = process.env.PORT || 5000;

// Sync DB and Start Server
sequelize.sync({ alter: true }) // Alter will sync the schema
    .then(async () => {
        console.log('Database synced successfully');
        try {
            await seedDatabase();
            console.log('Database seeded successfully');
        } catch (err) {
            console.error('Failed to seed database:', err);
        }
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to sync database:', error);
    });