const bcrypt = require('bcrypt');
const { User, Role, Staff, SystemSetting } = require('../models');

async function seedDatabase() {
    // 1. Seed Roles
    const roles = ['Super Admin', 'Admin', 'Staff', 'Teacher', 'Student', 'Parent'];
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
            fullName: 'Super Admin',
            staffId: 'EMP-ADMIN-001',
            department: 'Administration',
            designation: 'System Administrator',
            joiningDate: new Date(),
            phone: '1234567890'
        });

        console.log('Default admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }

    // 3. Seed Default System Settings
    const defaultSettings = [
        { group: 'institution', key: 'college_name', value: 'EduERP Engineering College', type: 'string' },
        { group: 'institution', key: 'short_name', value: 'EEC', type: 'string' },
        { group: 'institution', key: 'institution_code', value: 'EEC001', type: 'string' },
        { group: 'institution', key: 'academic_year', value: '2023-2024', type: 'string' },
        { group: 'branding', key: 'theme_color', value: '#2563eb', type: 'string' },
        { group: 'admission', key: 'auto_reg_number', value: 'true', type: 'boolean' },
        { group: 'attendance', key: 'min_attendance', value: '75', type: 'number' }
    ];

    for (const setting of defaultSettings) {
        await SystemSetting.findOrCreate({
            where: { key: setting.key },
            defaults: setting
        });
    }
    console.log('System settings seeded successfully.');
}

module.exports = { seedDatabase };
