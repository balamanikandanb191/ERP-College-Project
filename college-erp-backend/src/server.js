const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require('./config/database');
const { seedDatabase } = require('./utils/seed');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("College ERP Backend Running");
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