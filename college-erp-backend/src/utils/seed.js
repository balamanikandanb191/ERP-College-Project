const bcrypt = require('bcrypt');
const { User, Role, Staff, Student, SystemSetting, FeeStructure } = require('../models');

async function seedDatabase() {
    // 1. Seed Roles
    const roles = ['Super Admin', 'Admin', 'Staff', 'Teacher', 'Student', 'Parent'];
    for (const roleName of roles) {
        await Role.findOrCreate({
            where: { name: roleName }
        });
    }

    // Hash password helper
    const hashPassword = async (pwd) => await bcrypt.hash(pwd, 10);

    // 2. Seed Default Admin User
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) throw new Error('Admin role not found during seeding.');

    const adminEmail = 'admin@eduerp.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const newAdmin = await User.create({
            email: adminEmail,
            password_hash: await hashPassword('Admin@123'),
            role_id: adminRole.id,
            is_active: true
        });

        await Staff.create({
            user_id: newAdmin.id,
            fullName: 'Super Admin',
            staffId: 'EMP-ADMIN-001',
            department: 'Administration',
            designation: 'System Administrator',
            joiningDate: new Date(),
            phone: '1234567890',
            email: adminEmail
        });
        console.log('Default admin user created successfully.');
    }

    // 3. Seed Default Teacher User
    const teacherRole = await Role.findOne({ where: { name: 'Teacher' } });
    if (teacherRole) {
        const teacherEmail = 'teacher@eduerp.com';
        const existingTeacher = await User.findOne({ where: { email: teacherEmail } });
        if (!existingTeacher) {
            const newTeacher = await User.create({
                email: teacherEmail,
                password_hash: await hashPassword('Teacher@123'),
                role_id: teacherRole.id,
                is_active: true
            });

            await Staff.create({
                user_id: newTeacher.id,
                fullName: 'Prof. Sarah Jenkins',
                staffId: 'EMP-TCH-102',
                department: 'Computer Science',
                designation: 'Senior Professor',
                teachingType: 'Teaching',
                joiningDate: new Date(),
                phone: '9876543211',
                email: teacherEmail
            });
            console.log('Default teacher user created successfully.');
        }
    }

    // 4. Seed Default Staff User
    const staffRole = await Role.findOne({ where: { name: 'Staff' } });
    if (staffRole) {
        const staffEmail = 'staff@eduerp.com';
        const existingStaff = await User.findOne({ where: { email: staffEmail } });
        if (!existingStaff) {
            const newStaff = await User.create({
                email: staffEmail,
                password_hash: await hashPassword('Staff@123'),
                role_id: staffRole.id,
                is_active: true
            });

            await Staff.create({
                user_id: newStaff.id,
                fullName: 'Robert Miller',
                staffId: 'EMP-STF-205',
                department: 'Registrar Office',
                designation: 'Academic Coordinator',
                teachingType: 'Non-Teaching',
                joiningDate: new Date(),
                phone: '9876543212',
                email: staffEmail
            });
            console.log('Default staff user created successfully.');
        }
    }

    // 5. Seed Default Student User
    const studentRole = await Role.findOne({ where: { name: 'Student' } });
    if (studentRole) {
        const studentEmail = 'student@eduerp.com';
        const existingStudent = await User.findOne({ where: { email: studentEmail } });
        if (!existingStudent) {
            const newStudent = await User.create({
                email: studentEmail,
                password_hash: await hashPassword('Student@123'),
                role_id: studentRole.id,
                is_active: true
            });

            await Student.create({
                user_id: newStudent.id,
                fullName: 'Alex Mercer',
                registerNumber: 'REG-2023-0045',
                gender: 'Male',
                dob: '2003-08-15',
                email: studentEmail,
                department: 'Information Technology',
                course: 'B.Tech Information Technology',
                academicYear: '2023-2027',
                semester: 'Semester 4',
                section: 'A',
                phone: '9876543213',
                admissionStatus: 'Approved'
            });
            console.log('Default student user created successfully.');
        }
    }

    // 6. Seed Default Parent User
    const parentRole = await Role.findOne({ where: { name: 'Parent' } });
    if (parentRole) {
        const parentEmail = 'parent@eduerp.com';
        const existingParent = await User.findOne({ where: { email: parentEmail } });
        if (!existingParent) {
            const newParent = await User.create({
                email: parentEmail,
                password_hash: await hashPassword('Parent@123'),
                role_id: parentRole.id,
                is_active: true
            });

            // Try to link this parent to the student we just seeded
            const seededStudent = await Student.findOne({ where: { registerNumber: 'REG-2023-0045' } });
            if (seededStudent) {
                seededStudent.parent_user_id = newParent.id;
                seededStudent.fatherName = 'David Mercer';
                seededStudent.fatherPhone = '9876543214';
                await seededStudent.save();
            }
            console.log('Default parent user created successfully.');
        }
    }

    // 6.5 Seed Default Fee Structures
    const defaultStructures = [
        {
            title: 'Tuition Fees - 2026',
            department: 'Information Technology',
            year: '2023-2027',
            semester: 'Semester 4',
            amount: 45000,
            dueDate: '2026-06-30',
            finePerDay: 50,
            description: 'Regular semester tuition fees',
            status: 'Active'
        },
        {
            title: 'Hostel Fees - 2026',
            department: 'All Departments',
            year: '2023-2027',
            semester: 'Semester 4',
            amount: 35000,
            dueDate: '2026-06-15',
            finePerDay: 100,
            description: 'Hostel and mess charges',
            status: 'Active'
        }
    ];

    for (const struct of defaultStructures) {
        await FeeStructure.findOrCreate({
            where: { title: struct.title },
            defaults: struct
        });
    }
    console.log('Fee structures seeded successfully.');

    // 7. Seed Default System Settings
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
