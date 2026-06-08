require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { sequelize, Role, User } = require('./models');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Seed initial data
const seedInitialData = async () => {
  try {
    const roles = ['Admin', 'Staff', 'Student', 'Parent', 'Librarian', 'TransportAdmin'];
    for (const roleName of roles) {
      await Role.findOrCreate({ where: { name: roleName } });
    }

    // Create an initial admin if none exists
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (adminRole) {
      const adminExists = await User.findOne({ where: { email: 'admin@college.edu' } });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
          email: 'admin@college.edu',
          password_hash: hashedPassword,
          role_id: adminRole.id,
          is_active: true
        });
        console.log('Initial admin user created: admin@college.edu / admin123');
      }
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Start Server
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database connected and synced.');
    
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
