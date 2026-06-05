const bcrypt = require('bcrypt');
const { 
  User, Role, Staff, Student, SystemSetting, FeeStructure, ClassAllocation, Book,
  AcademicYearMaster, ClassMaster, DesignationMaster, ExamMaster, FeeMaster 
} = require('../models');

async function seedDatabase() {
    // 1. Seed Roles
    const roles = ['Super Admin', 'Admin', 'Staff', 'Teacher', 'Student', 'Parent'];
    for (const roleName of roles) {
        await Role.findOrCreate({
            where: { name: roleName }
        });
    }

    // Seed academic_years master
    await AcademicYearMaster.bulkCreate([
        { id: 'acad-year-1', year: '2025-2026', startDate: '2025-06-01', endDate: '2026-05-31', admissionStart: '2025-04-01', admissionEnd: '2025-07-31', active: true },
        { id: 'acad-year-2', year: '2024-2025', startDate: '2024-06-01', endDate: '2025-05-31', admissionStart: '2024-04-01', admissionEnd: '2025-07-31', active: false },
        { id: 'acad-year-3', year: '2023-2024', startDate: '2023-06-01', endDate: '2024-05-31', admissionStart: '2023-04-01', admissionEnd: '2024-07-31', active: false }
    ], { ignoreDuplicates: true });

    // Seed classes master
    await ClassMaster.bulkCreate([
        { id: 'class-1', name: 'I Year', shortCode: 'I', depts: 'Computer Science, Information Technology, Electronics, Mechanical, Civil', maxSections: 4, maxStrength: 60, semType: 'Semester', active: true },
        { id: 'class-2', name: 'II Year', shortCode: 'II', depts: 'Computer Science, Information Technology, Electronics, Mechanical, Civil', maxSections: 4, maxStrength: 60, semType: 'Semester', active: true },
        { id: 'class-3', name: 'III Year', shortCode: 'III', depts: 'Computer Science, Information Technology, Electronics, Mechanical, Civil', maxSections: 3, maxStrength: 60, semType: 'Semester', active: true },
        { id: 'class-4', name: 'IV Year', shortCode: 'IV', depts: 'Computer Science, Information Technology, Electronics, Mechanical, Civil', maxSections: 3, maxStrength: 55, semType: 'Semester', active: true }
    ], { ignoreDuplicates: true });

    // Seed designations master
    await DesignationMaster.bulkCreate([
        { id: 'desig-1', title: 'Professor', shortCode: 'Prof.', dept: 'All', gradePay: 'AGP-10000', level: 'Senior', active: true },
        { id: 'desig-2', title: 'Associate Professor', shortCode: 'Assoc. Prof.', dept: 'All', gradePay: 'AGP-8000', level: 'Senior', active: true },
        { id: 'desig-3', title: 'Assistant Professor', shortCode: 'Asst. Prof.', dept: 'All', gradePay: 'AGP-6000', level: 'Junior', active: true },
        { id: 'desig-4', title: 'Head of Department', shortCode: 'HOD', dept: 'All', gradePay: 'AGP-10000', level: 'Senior', active: true },
        { id: 'desig-5', title: 'Registrar', shortCode: 'Reg.', dept: 'Administration', gradePay: 'AGP-7600', level: 'Administrative', active: true },
        { id: 'desig-6', title: 'Lab Instructor', shortCode: 'Lab Instr.', dept: 'Technical', gradePay: 'AGP-4200', level: 'Technical', active: true }
    ], { ignoreDuplicates: true });

    // Seed exams master
    await ExamMaster.bulkCreate([
        { id: 'exam-1', name: 'Internal Assessment 1', shortName: 'IA1', type: 'Internal', maxMarks: 50, passMark: 20, month: 'August', year: '2026', gpaWeight: 20, active: true },
        { id: 'exam-2', name: 'Internal Assessment 2', shortName: 'IA2', type: 'Internal', maxMarks: 50, passMark: 20, month: 'November', year: '2026', gpaWeight: 20, active: true },
        { id: 'exam-3', name: 'End Semester Examination', shortName: 'ESE', type: 'External', maxMarks: 100, passMark: 40, month: 'December', year: '2026', gpaWeight: 60, active: true },
        { id: 'exam-4', name: 'Lab Practical Exam', shortName: 'LAB', type: 'Practical', maxMarks: 75, passMark: 30, month: 'November', year: '2026', gpaWeight: 0, active: true }
    ], { ignoreDuplicates: true });

    // Seed fees master
    await FeeMaster.bulkCreate([
        { id: 'fee-1', feeType: 'Tuition Fee', year: 'I', dept: 'Computer Science', amount: 85000, dueDate: '2026-06-30', term: 'Annual', active: true },
        { id: 'fee-2', feeType: 'Tuition Fee', year: 'II', dept: 'Computer Science', amount: 85000, dueDate: '2026-06-30', term: 'Annual', active: true },
        { id: 'fee-3', feeType: 'Transport Fee', year: 'ALL', dept: 'ALL', amount: 18000, dueDate: '2026-06-15', term: 'Annual', active: true },
        { id: 'fee-4', feeType: 'Library Deposit', year: 'I', dept: 'ALL', amount: 2000, dueDate: '2026-07-01', term: 'One-time', active: true },
        { id: 'fee-5', feeType: 'Hostel Fee', year: 'ALL', dept: 'ALL', amount: 45000, dueDate: '2026-06-30', term: 'Annual', active: true }
    ], { ignoreDuplicates: true });

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

    // 8. Seed Class Allocations
    const defaultAllocations = [
        {
            department: 'Computer Science',
            year: 'III',
            semester: '6',
            section: 'A',
            classroomNumber: 'Block A - 301',
            classAdvisor: 'Dr. Amit Sharma',
            assignedFaculty: 'Prof. Sneha Iyer, Dr. Anand K. Varma',
            labAllocation: 'None',
            currentStrength: 55,
            status: 'Occupied',
            timetableSyncStatus: 'Synced'
        },
        {
            department: 'Information Technology',
            year: 'II',
            semester: '4',
            section: 'B',
            classroomNumber: 'Block B - 202',
            classAdvisor: 'Prof. Sneha Iyer',
            assignedFaculty: 'Dr. Anand K. Varma, Prof. Rajesh Kumar',
            labAllocation: 'IT Lab Block A',
            currentStrength: 50,
            status: 'Lab Active',
            timetableSyncStatus: 'Synced'
        },
        {
            department: 'Electronics',
            year: 'IV',
            semester: '8',
            section: 'A',
            classroomNumber: 'Block C - 105',
            classAdvisor: 'Dr. Anand K. Varma',
            assignedFaculty: 'Dr. Amit Sharma, Prof. Rajesh Kumar',
            labAllocation: 'None',
            currentStrength: 42,
            status: 'Occupied',
            timetableSyncStatus: 'Synced'
        },
        {
            department: 'Mechanical',
            year: 'I',
            semester: '2',
            section: 'A',
            classroomNumber: 'Block A - 101',
            classAdvisor: 'Prof. Rajesh Kumar',
            assignedFaculty: 'Dr. Amit Sharma, Prof. Sneha Iyer',
            labAllocation: 'None',
            currentStrength: 65,
            status: 'Available',
            timetableSyncStatus: 'Synced'
        },
        {
            department: 'Computer Science',
            year: 'II',
            semester: '4',
            section: 'C',
            classroomNumber: 'Block B - 102',
            classAdvisor: 'Dr. Anand K. Varma',
            assignedFaculty: 'Prof. Rajesh Kumar',
            labAllocation: 'None',
            currentStrength: 52,
            status: 'Occupied',
            timetableSyncStatus: 'Synced'
        }
    ];

    for (const alloc of defaultAllocations) {
        await ClassAllocation.create(alloc);
    }
    console.log('Class allocations seeded successfully.');

    // 9. Seed Books
    const defaultBooks = [
        {
            customBookId: 'BK001',
            bookName: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen',
            isbn: '9780262033848',
            category: 'Engineering',
            language: 'English',
            publisher: 'MIT Press',
            edition: '3rd Edition',
            publicationYear: 2009,
            pages: 1292,
            price: 1500,
            status: 'Available',
            quantity: 5,
            availableCopies: 5,
            rack: 'A1',
            position: 'Shelf 2',
            description: 'A comprehensive guide to the design and analysis of computer algorithms.',
            coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200'
        },
        {
            customBookId: 'BK002',
            bookName: 'Clean Code',
            author: 'Robert C. Martin',
            isbn: '9780132350884',
            category: 'Engineering',
            language: 'English',
            publisher: 'Prentice Hall',
            edition: '1st Edition',
            publicationYear: 2008,
            pages: 464,
            price: 950,
            status: 'Available',
            quantity: 3,
            availableCopies: 3,
            rack: 'A2',
            position: 'Shelf 1',
            description: 'A handbook of agile software craftsmanship.',
            coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'
        },
        {
            customBookId: 'BK003',
            bookName: 'Brief Answers to the Big Questions',
            author: 'Stephen Hawking',
            isbn: '9781473560734',
            category: 'Science',
            language: 'English',
            publisher: 'Bantam Books',
            edition: '1st Edition',
            publicationYear: 2018,
            pages: 256,
            price: 450,
            status: 'Available',
            quantity: 4,
            availableCopies: 4,
            rack: 'B1',
            position: 'Shelf 3',
            description: 'The final book from the world-famous cosmologist Stephen Hawking.',
            coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=200'
        },
        {
            customBookId: 'BK004',
            bookName: 'The Art of Computer Programming',
            author: 'Donald E. Knuth',
            isbn: '9780201485417',
            category: 'Engineering',
            language: 'English',
            publisher: 'Addison-Wesley',
            edition: '1st Edition',
            publicationYear: 1997,
            pages: 650,
            price: 3200,
            status: 'Available',
            quantity: 2,
            availableCopies: 2,
            rack: 'A1',
            position: 'Shelf 1',
            description: 'Highly detailed monographs on computer programming algorithms and analysis.',
            coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200'
        }
    ];

    for (const book of defaultBooks) {
        await Book.findOrCreate({
            where: { customBookId: book.customBookId },
            defaults: book
        });
    }
    console.log('Books seeded successfully.');
}

module.exports = { seedDatabase };
