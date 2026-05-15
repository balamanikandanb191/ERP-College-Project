const bcrypt = require('bcrypt');
const { User, Role, Staff } = require('../models');

async function seedDatabase() {
    // 1. Seed Roles
    const roles = ['Admin', 'Staff', 'Student'];
    for (const roleName of roles) {
        await Role.findOrCreate({
            where: { name: roleName }
        });
    }

    // 2. Seed Default Admin User
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    
    if (!adminRole) {
        throw new Error('Admin role not found during seeding.');
    }

    const adminEmail = 'admin@eduerp.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('Admin@123', 10);
        
        const newAdmin = await User.create({
            email: adminEmail,
            password_hash: passwordHash,
            role_id: adminRole.id,
            is_active: true
        });

        // Create Admin Profile
        await Staff.create({
            user_id: newAdmin.id,
            first_name: 'Super',
            last_name: 'Admin',
            employee_id: 'EMP-ADMIN-001',
            department: 'Administration',
            designation: 'System Administrator',
            date_of_joining: new Date(),
            contact_number: '1234567890'
        });

        console.log('Default admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }
}

module.exports = { seedDatabase };
