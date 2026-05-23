import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, GraduationCap, DollarSign, CalendarDays, TrendingUp, TrendingDown, 
  ArrowRight, AlertTriangle, ShieldAlert, Clock, Bus, Building, BookOpen, 
  Briefcase, Layers, Video, MapPin, Activity, FileText, CheckCircle, IndianRupee, Percent
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, LineChart, Line, ComposedChart, Legend 
} from 'recharts';
import api from '../services/api';
import GlobalDrilldownModal from '../components/common/GlobalDrilldownModal';
import GlobalProfileDrawer from '../components/common/GlobalProfileDrawer';

// Seed baseline Admission Structures with full breakdown
const SEED_ADMISSION_YEAR_FEE_STRUCTURES = [
  {
    id: 'struct-2023-cse',
    admissionYear: '2023',
    name: 'CSE B.Tech baseline fee (2023 Admitted)',
    department: 'Computer Science',
    year: 'III',
    semester: '6',
    tuitionFee: 60000,
    labFee: 7000,
    libraryFee: 1500,
    examFee: 2500,
    semesterFee: 5000,
    developmentFee: 3000,
    universityFee: 2000,
    recordFee: 500,
    hostelAdmission: 5000,
    roomRent: 15000,
    messFee: 10000,
    electricity: 3000,
    laundry: 1000,
    hostelMaintenance: 1000,
    busRouteFee: 10000,
    gpsFee: 1000,
    transportMaintenance: 1000,
    internalExam: 1000,
    externalExam: 1500,
    hallTicket: 500,
    revaluationFee: 1000,
    arrearFee: 500,
    latePaymentFine: 1000,
    attendanceFine: 500,
    libraryFine: 200,
    disciplineFine: 1000,
    hostelFine: 500,
    placementTrainingFee: 4000,
    certificationFee: 2000,
    industrialVisitFee: 1500,
    workshopFee: 1000,
    GST: 18,
    status: 'Active'
  },
  {
    id: 'struct-2024-cse',
    admissionYear: '2024',
    name: 'CSE B.Tech baseline fee (2024 Admitted)',
    department: 'Computer Science',
    year: 'II',
    semester: '4',
    tuitionFee: 65000,
    labFee: 8000,
    libraryFee: 2000,
    examFee: 3000,
    semesterFee: 6000,
    developmentFee: 4000,
    universityFee: 2500,
    recordFee: 600,
    hostelAdmission: 6000,
    roomRent: 16000,
    messFee: 11000,
    electricity: 3500,
    laundry: 1200,
    hostelMaintenance: 1200,
    busRouteFee: 11000,
    gpsFee: 1200,
    transportMaintenance: 1200,
    internalExam: 1200,
    externalExam: 1800,
    hallTicket: 600,
    revaluationFee: 1200,
    arrearFee: 600,
    latePaymentFine: 1200,
    attendanceFine: 600,
    libraryFine: 300,
    disciplineFine: 1200,
    hostelFine: 600,
    placementTrainingFee: 5000,
    certificationFee: 2500,
    industrialVisitFee: 1800,
    workshopFee: 1200,
    GST: 18,
    status: 'Active'
  }
];

// Seed student registry
const SEED_STUDENT_FEE_REGISTRY = [
  { id: 'stud-fee-1', rollNo: '2026CSE001', studentName: 'Arjun Kumar', department: 'Computer Science', admissionYear: '2023', year: 'III', semester: '6', paidAmount: 85000 },
  { id: 'stud-fee-2', rollNo: '2026ECE002', studentName: 'Priya Singh', department: 'Electronics', admissionYear: '2024', year: 'II', semester: '4', paidAmount: 110000 },
  { id: 'stud-fee-3', rollNo: '2026CSE042', studentName: 'Rahul Verma', department: 'Computer Science', admissionYear: '2024', year: 'II', semester: '3', paidAmount: 30000 },
  { id: 'stud-fee-4', rollNo: '2026IT004', studentName: 'Sneha Reddy', department: 'Information Technology', admissionYear: '2024', year: 'IV', semester: '8', paidAmount: 0 },
  { id: 'stud-fee-5', rollNo: '2026ECE005', studentName: 'Ananya Roy', department: 'Electronics', admissionYear: '2025', year: 'I', semester: '2', paidAmount: 90000 },
  { id: 'stud-fee-6', rollNo: '2026ME006', studentName: 'Vikram Seth', department: 'Mechanical', admissionYear: '2023', year: 'III', semester: '6', paidAmount: 80000 },
  { id: 'stud-fee-7', rollNo: '2026CSE007', studentName: 'Divya Iyer', department: 'Computer Science', admissionYear: '2022', year: 'IV', semester: '8', paidAmount: 100000 },
  { id: 'stud-fee-8', rollNo: '2026CIV008', studentName: 'Aditya Gupta', department: 'Civil', admissionYear: '2024', year: 'II', semester: '4', paidAmount: 10000 },
  { id: 'stud-fee-9', rollNo: '2026IT009', studentName: 'Meera Pillai', department: 'Information Technology', admissionYear: '2023', year: 'III', semester: '6', paidAmount: 95000 },
  { id: 'stud-fee-10', rollNo: '2026CSE010', studentName: 'Karan Malhotra', department: 'Computer Science', admissionYear: '2025', year: 'I', semester: '2', paidAmount: 115000 },
  { id: 'stud-fee-11', rollNo: '2026ECE011', studentName: 'Riya Sen', department: 'Electronics', admissionYear: '2023', year: 'III', semester: '6', paidAmount: 88000 },
  { id: 'stud-fee-12', rollNo: '2026ME012', studentName: 'Sanjay Dutt', department: 'Mechanical', admissionYear: '2022', year: 'IV', semester: '8', paidAmount: 0 }
];

// Seed scholarship registry
const SEED_SCHOLARSHIP_REGISTRY = [
  { id: 'sch-1', rollNo: '2026CSE001', scholarshipType: 'Merit Scholarship', scholarshipCategory: 'Merit', scholarshipProvider: 'College Management', scholarshipReason: 'Academic Excellence', scholarshipPercentage: 20, scholarshipAmount: 17000, approvalStatus: 'Approved', approvedBy: 'Principal Office', approvalDate: '2025-08-15', validityPeriod: '2025-2026', renewalStatus: 'Active' },
  { id: 'sch-2', rollNo: '2026IT009', scholarshipType: 'Sports Quota Scholarship', scholarshipCategory: 'Sports Quota', scholarshipProvider: 'State Sports Authority', scholarshipReason: 'Sports achievement', scholarshipPercentage: 50, scholarshipAmount: 47500, approvalStatus: 'Approved', approvedBy: 'Physical Director', approvalDate: '2026-01-10', validityPeriod: '2026-2027', renewalStatus: 'Active' }
];

// Seed fine registry
const SEED_FINE_REGISTRY = [
  { fineId: 'fine-1', rollNo: '2026CSE042', fineType: 'Library Fine', fineAmount: 1200, fineReason: 'Library book overdue 12 days', fineDate: '2026-05-01', dueDate: '2026-05-15', issuedBy: 'Chief Librarian', status: 'Pending', appealStatus: 'None' },
  { fineId: 'fine-2', rollNo: '2026IT004', fineType: 'Late Fee Fine', fineAmount: 2500, fineReason: 'Late semester fee payment', fineDate: '2026-05-05', dueDate: '2026-05-20', issuedBy: 'Accounts Officer', status: 'Pending', appealStatus: 'Appealed' },
  { fineId: 'fine-3', rollNo: '2026CIV008', fineType: 'Attendance Shortage Fine', fineAmount: 1800, fineReason: 'Attendance below 75% threshold', fineDate: '2026-05-03', dueDate: '2026-05-18', issuedBy: 'HOD Civil', status: 'Pending', appealStatus: 'None' }
];

// Seed transactions
const SEED_FEE_TRANSACTIONS = [
  { id: 'tx-1', rollNo: '2026CSE001', studentName: 'Arjun Kumar', amount: 85000, paymentMode: 'UPI', referenceId: 'UPI9849204910', date: '2026-05-10', remarks: 'Full Term Fee Payment' },
  { id: 'tx-2', rollNo: '2026ECE002', studentName: 'Priya Singh', amount: 110000, paymentMode: 'Net Banking', referenceId: 'NET9820491024', date: '2026-05-12', remarks: 'Semester Fee Cleared' },
  { id: 'tx-3', rollNo: '2026ECE005', studentName: 'Ananya Roy', amount: 90000, paymentMode: 'Credit Card', referenceId: 'CC8930491024', date: '2026-05-14', remarks: 'Tuition Payment' },
  { id: 'tx-4', rollNo: '2026ME006', studentName: 'Vikram Seth', amount: 80000, paymentMode: 'UPI', referenceId: 'UPI1039581024', date: '2026-05-08', remarks: 'Term Fee' }
];

// Seed Students list
const SEED_STUDENTS = [
  { id: 1, fullName: 'Arjun Kumar', name: 'Arjun Kumar', registerNumber: '2026CSE001', reg: '2026CSE001', email: 'arjun.kumar@college.edu', phone: '+91 98401 23456', department: 'Computer Science', dept: 'Computer Science', year: 'III', semester: '6', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 88, status: 'placed', companySelected: 'Zoho', packageOffered: 8.5, cgpa: 8.50 },
  { id: 2, fullName: 'Priya Singh', name: 'Priya Singh', registerNumber: '2026ECE002', reg: '2026ECE002', email: 'priya.singh@college.edu', phone: '+91 98401 23457', department: 'Electronics', dept: 'Electronics', year: 'II', semester: '4', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 92, status: 'placed', companySelected: 'Cognizant', packageOffered: 6.0, cgpa: 7.20 },
  { id: 3, fullName: 'Rahul Verma', name: 'Rahul Verma', registerNumber: '2026CSE042', reg: '2026CSE042', email: 'rahul.verma@college.edu', phone: '+91 98401 23458', department: 'Computer Science', dept: 'Computer Science', year: 'II', semester: '3', admissionStatus: 'Verified', feesPaid: 'Pending', attendancePercentage: 72, status: 'rejected', cgpa: 6.10, malpracticeCount: 1 },
  { id: 4, fullName: 'Sneha Reddy', name: 'Sneha Reddy', registerNumber: '2026IT004', reg: '2026IT004', email: 'sneha.reddy@college.edu', phone: '+91 98401 23459', department: 'Information Technology', dept: 'Information Technology', year: 'IV', semester: '8', admissionStatus: 'Approved', feesPaid: 'Pending', attendancePercentage: 91, status: 'in_progress', cgpa: 9.10 },
  { id: 5, fullName: 'Ananya Roy', name: 'Ananya Roy', registerNumber: '2026ECE005', reg: '2026ECE005', email: 'ananya.roy@college.edu', phone: '+91 98401 23460', department: 'Electronics', dept: 'Electronics', year: 'I', semester: '2', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 83, status: 'eligible', cgpa: 7.80 },
  { id: 6, fullName: 'Vikram Seth', name: 'Vikram Seth', registerNumber: '2026ME006', reg: '2026ME006', email: 'vikram.seth@college.edu', phone: '+91 98401 23461', department: 'Mechanical', dept: 'Mechanical', year: 'III', semester: '6', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 78, status: 'placed', companySelected: 'TCS', packageOffered: 4.5, cgpa: 7.00 },
  { id: 7, fullName: 'Divya Iyer', name: 'Divya Iyer', registerNumber: '2026CSE007', reg: '2026CSE007', email: 'divya.iyer@college.edu', phone: '+91 98401 23462', department: 'Computer Science', dept: 'Computer Science', year: 'IV', semester: '8', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 95, status: 'placed', companySelected: 'Zoho', packageOffered: 10.0, cgpa: 9.40 },
  { id: 8, fullName: 'Aditya Gupta', name: 'Aditya Gupta', registerNumber: '2026CIV008', reg: '2026CIV008', email: 'aditya.gupta@college.edu', phone: '+91 98401 23463', department: 'Civil', dept: 'Civil', year: 'II', semester: '4', admissionStatus: 'Approved', feesPaid: 'Pending', attendancePercentage: 68, status: 'eligible', cgpa: 6.50 },
  { id: 9, fullName: 'Meera Pillai', name: 'Meera Pillai', registerNumber: '2026IT009', reg: '2026IT009', email: 'meera.pillai@college.edu', phone: '+91 98401 23464', department: 'Information Technology', dept: 'Information Technology', year: 'III', semester: '6', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 86, status: 'placed', companySelected: 'Infosys', packageOffered: 5.5, cgpa: 8.10 },
  { id: 10, fullName: 'Karan Malhotra', name: 'Karan Malhotra', registerNumber: '2026CSE010', reg: '2026CSE010', email: 'karan.malhotra@college.edu', phone: '+91 98401 23465', department: 'Computer Science', dept: 'Computer Science', year: 'I', semester: '2', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 74, status: 'eligible', cgpa: 6.90 },
  { id: 11, fullName: 'Riya Sen', name: 'Riya Sen', registerNumber: '2026ECE011', reg: '2026ECE011', email: 'riya.sen@college.edu', phone: '+91 98401 23466', department: 'Electronics', dept: 'Electronics', year: 'III', semester: '6', admissionStatus: 'Approved', feesPaid: 'Paid', attendancePercentage: 89, status: 'placed', companySelected: 'Cognizant', packageOffered: 6.0, cgpa: 8.30 },
  { id: 12, fullName: 'Sanjay Dutt', name: 'Sanjay Dutt', registerNumber: '2026ME012', reg: '2026ME012', email: 'sanjay.dutt@college.edu', phone: '+91 98401 23467', department: 'Mechanical', dept: 'Mechanical', year: 'IV', semester: '8', admissionStatus: 'Approved', feesPaid: 'Pending', attendancePercentage: 81, status: 'eligible', cgpa: 7.45 }
];

// Seed Staff list
const SEED_STAFF = [
  { id: 1, fullName: 'Dr. Amit Sharma', staffId: 'EMP-CSE-001', employeeId: 'EMP-CSE-001', department: 'Computer Science', designation: 'Associate Professor', experience: '8 Years', email: 'amit.sharma@college.edu', phone: '+91 94440 12345', status: 'Active', salaryStatus: 'Credited' },
  { id: 2, fullName: 'Prof. Sneha Iyer', staffId: 'EMP-IT-015', employeeId: 'EMP-IT-015', department: 'Information Technology', designation: 'Assistant Professor', experience: '4 Years', email: 'sneha.iyer@college.edu', phone: '+91 94440 23456', status: 'On Leave', salaryStatus: 'Pending' },
  { id: 3, fullName: 'Dr. Rajesh Patel', staffId: 'EMP-MECH-029', employeeId: 'EMP-MECH-029', department: 'Mechanical', designation: 'Professor', experience: '12 Years', email: 'rajesh.patel@college.edu', phone: '+91 94440 34567', status: 'Active', salaryStatus: 'Credited' },
  { id: 4, fullName: 'Prof. Priya Nair', staffId: 'EMP-ECE-008', employeeId: 'EMP-ECE-008', department: 'Electronics', designation: 'Assistant Professor', experience: '6 Years', email: 'priya.nair@college.edu', phone: '+91 94440 45678', status: 'Active', salaryStatus: 'Credited' },
  { id: 5, fullName: 'Dr. Anand K. Varma', staffId: 'EMP-CSE-002', employeeId: 'EMP-CSE-002', department: 'Computer Science', designation: 'Professor', experience: '15 Years', email: 'anand.varma@college.edu', phone: '+91 94440 56789', status: 'Active', salaryStatus: 'Credited' },
  { id: 6, fullName: 'Prof. Rajesh Kumar', staffId: 'EMP-IT-003', employeeId: 'EMP-IT-003', department: 'Information Technology', designation: 'Assistant Professor', experience: '5 Years', email: 'rajesh.kumar@college.edu', phone: '+91 94440 67890', status: 'Active', salaryStatus: 'Credited' }
];

// Seed Initial Mock Exams Data
const SEED_EXAMS = [
  { id: 1, examId: "EX-2026-001", subjectName: "Data Structures & Algorithms", subjectCode: "CS6301", department: "CSE", year: "2", semester: "3", section: "A", examType: "Semester", examDate: "2026-05-18", roomNumber: "LH-101", blockName: "Newton Block", totalStudents: 45, presentStudents: 43, absentStudents: 2, invigilatorId: "1", invigilatorName: "Dr. Amit Sharma", status: "Completed" },
  { id: 2, examId: "EX-2026-002", subjectName: "Database Management Systems", subjectCode: "CS6302", department: "CSE", year: "2", semester: "3", section: "B", examType: "Semester", examDate: "2026-05-18", roomNumber: "LH-102", blockName: "Newton Block", totalStudents: 40, presentStudents: 40, absentStudents: 0, invigilatorId: "2", invigilatorName: "Prof. Sneha Iyer", status: "Completed" }
];

const SEED_MALPRACTICE = [
  { id: "MP-2026-001", studentName: "Rahul Verma", registerNumber: "2026CSE042", roomNumber: "LH-102", subjectName: "Database Management Systems", invigilatorName: "Prof. Sneha Iyer", incidentDetails: "Possession of micro-chits detailing SQL index constraints hidden under examination writing pad.", fineAmount: 5000, actionStatus: "Suspension Recommended", timestamp: "2026-05-17 10:15 AM" }
];

// Seed Initial Mock Leave Requests Data
const SEED_LEAVE_REQUESTS = [
  { id: 'LR-2026-001', staffName: 'Dr. Amit Sharma', employeeId: 'EMP-CSE-001', department: 'Computer Science', designation: 'Associate Professor', leaveType: 'Medical Leave', startDate: '2026-05-18', endDate: '2026-05-22', days: 5, reason: 'Undergoing major knee surgery and require medical observation.', attachmentName: 'medical_certificate.pdf', status: 'Pending' },
  { id: 'LR-2026-002', staffName: 'Prof. Sneha Iyer', employeeId: 'EMP-IT-015', department: 'Information Technology', designation: 'Assistant Professor', leaveType: 'Casual Leave', startDate: '2026-05-20', endDate: '2026-05-21', days: 2, reason: 'Attending sibling\'s wedding in home town.', attachmentName: 'wedding_invitation.pdf', status: 'Pending' }
];

// Classrooms/Labs allocation
const SEED_ALLOCATIONS = [
  { id: 'alloc-1', roomNumber: 'Block A - 101', block: 'Block A', floor: '1st Floor', capacity: 70, type: 'Classroom', department: 'Computer Science', year: 'III', semester: '6', section: 'A', classAdvisor: 'Dr. Amit Sharma', currentStrength: 55, status: 'Occupied' },
  { id: 'alloc-2', roomNumber: 'Block A - 301', block: 'Block A', floor: '3rd Floor', capacity: 60, type: 'Classroom', department: 'Information Technology', year: 'II', semester: '4', section: 'B', classAdvisor: 'Prof. Sneha Iyer', currentStrength: 45, status: 'Occupied' },
  { id: 'alloc-3', roomNumber: 'CS Lab 3 Block C', block: 'Block C', floor: '1st Floor', capacity: 80, type: 'Lab', department: 'Computer Science', year: 'II', semester: '4', section: 'A', classAdvisor: 'Dr. Anand K. Varma', currentStrength: 60, status: 'Lab Active' },
  { id: 'alloc-4', roomNumber: 'Block B - 102', block: 'Block B', floor: '1st Floor', capacity: 50, type: 'Classroom', department: 'Electronics', year: 'IV', semester: '8', section: 'A', classAdvisor: 'Prof. Priya Nair', currentStrength: 42, status: 'Occupied' },
  { id: 'alloc-5', roomNumber: 'Block C - 102', block: 'Block C', floor: '1st Floor', capacity: 40, type: 'Classroom', status: 'Vacant' }
];

// Academic Calendar events
const SEED_EVENTS = [
  { id: 1, title: 'Spring End-Semester Examinations', name: 'Spring End-Semester Examinations', type: 'Exam', startDate: '2026-05-18', endDate: '2026-05-25', audience: 'All Students', department: 'All', priority: 'High', description: 'Main end semester exams for all years.' },
  { id: 2, title: 'Zoho Campus Placement Drive', name: 'Zoho Campus Placement Drive', type: 'Placement', startDate: '2026-05-22', endDate: '2026-05-22', audience: 'IV Year Students', department: 'CSE & IT', priority: 'High', description: 'Placement recruitment drive by Zoho Corporation.' },
  { id: 3, title: 'Advanced React Architecture Workshop', name: 'Advanced React Architecture Workshop', type: 'Workshop', startDate: '2026-05-20', endDate: '2026-05-20', audience: 'CSE & IT Students', department: 'CSE', priority: 'Medium', description: 'Hands-on session on advanced state management.' },
  { id: 4, title: 'National Technology Day Holiday', name: 'National Technology Day Holiday', type: 'Holiday', startDate: '2026-05-11', endDate: '2026-05-11', audience: 'All Staff & Students', department: 'All', priority: 'Low', description: 'Institutional holiday celebrating national tech achievements.' }
];

// Library Books
const SEED_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '9780262033848', category: 'Computer Science', copies: 15, available: 12 },
  { id: 2, title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', isbn: '9780073523323', category: 'Computer Science', copies: 10, available: 8 },
  { id: 3, title: 'Signals and Systems', author: 'Oppenheim, Willsky, Hamid', isbn: '9780138147570', category: 'Electronics', copies: 8, available: 6 },
  { id: 4, title: 'Vector Mechanics for Engineers', author: 'Beer, Johnston', isbn: '9780073398273', category: 'Mechanical', copies: 6, available: 5 }
];

const SEED_BORROWS = [
  { id: 1, title: 'Introduction to Algorithms', studentName: 'Arjun Kumar', registerNumber: '2026CSE001', borrowDate: '2026-05-01', dueDate: '2026-05-15', returnStatus: 'Overdue', daysOverdue: 5, fineAmount: 100 },
  { id: 2, title: 'Database System Concepts', studentName: 'Rahul Verma', registerNumber: '2026CSE042', borrowDate: '2026-05-05', dueDate: '2026-05-19', returnStatus: 'Borrowed', daysOverdue: 1, fineAmount: 20 },
  { id: 3, title: 'Signals and Systems', studentName: 'Priya Singh', registerNumber: '2026ECE002', borrowDate: '2026-05-10', dueDate: '2026-05-24', returnStatus: 'Borrowed', daysOverdue: 0, fineAmount: 0 }
];

const SEED_PLACEMENT_STUDENTS = [
  { id: 1, fullName: 'Arjun Kumar', name: 'Arjun Kumar', registerNumber: '2026CSE001', cgpa: 8.5, department: 'Computer Science', status: 'placed', companySelected: 'Zoho', packageOffered: 8.5, placementDate: '10 May 2026' },
  { id: 2, fullName: 'Priya Singh', name: 'Priya Singh', registerNumber: '2026ECE002', cgpa: 7.2, department: 'Electronics', status: 'placed', companySelected: 'Cognizant', packageOffered: 6.0, placementDate: '11 May 2026' },
  { id: 3, fullName: 'Vikram Seth', name: 'Vikram Seth', registerNumber: '2026ME006', cgpa: 7.0, department: 'Mechanical', status: 'placed', companySelected: 'TCS', packageOffered: 4.5, placementDate: '12 May 2026' },
  { id: 4, fullName: 'Divya Iyer', name: 'Divya Iyer', registerNumber: '2026CSE007', cgpa: 9.4, department: 'Computer Science', status: 'placed', companySelected: 'Zoho', packageOffered: 10.0, placementDate: '13 May 2026' }
];

const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const formatCompactINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};

const StatCard = ({ title, value, icon: Icon, colorClass, onClick }) => (
  <button 
    onClick={onClick}
    className="card p-6 flex items-start justify-between relative overflow-hidden group text-left w-full hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-slate-100 bg-white rounded-2xl cursor-pointer"
  >
    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-white/0 to-current opacity-5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110" style={{ color: 'inherit' }}></div>
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1.5">{title}</p>
      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
      <span className="text-[10px] font-black text-indigo-600 block mt-3 uppercase tracking-wider">Click for Drilldown Ledger</span>
    </div>
    <div className={`p-4 rounded-2xl shadow-sm ${colorClass} shrink-0 text-white`}>
      <Icon size={24} />
    </div>
  </button>
);

const AdminDashboard = () => {
  // Live states
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [exams, setExams] = useState([]);
  const [malpracticeList, setMalpracticeList] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [placementStudents, setPlacementStudents] = useState([]);

  // Fees states
  const [admissionYearFeeStructures, setAdmissionYearFeeStructures] = useState([]);
  const [studentFeeRegistry, setStudentFeeRegistry] = useState([]);
  const [scholarshipRegistry, setScholarshipRegistry] = useState([]);
  const [fineRegistry, setFineRegistry] = useState([]);
  const [feeTransactions, setFeeTransactions] = useState([]);

  // Library
  const [booksInventory, setBooksInventory] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);

  // Universal Modals & Drawer States
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [globalModalTitle, setGlobalModalTitle] = useState('');
  const [globalModalData, setGlobalModalData] = useState([]);
  const [globalModalColumns, setGlobalModalColumns] = useState([]);
  const [globalModalSearchKeys, setGlobalModalSearchKeys] = useState([]);

  const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);
  const [globalDrawerType, setGlobalDrawerType] = useState('student');
  const [globalDrawerData, setGlobalDrawerData] = useState(null);

  // Load and sync all data in Promise.allSettled
  useEffect(() => {
    const loadAllData = async () => {
      // 1. Fetch Students
      try {
        const res = await api.get('/students');
        const data = Array.isArray(res.data) ? res.data : (res.data?.students || []);
        setStudents(data.length > 0 ? data : SEED_STUDENTS);
      } catch (e) {
        setStudents(SEED_STUDENTS);
      }

      // 2. Fetch Staff
      try {
        const res = await api.get('/staff');
        const data = Array.isArray(res.data) ? res.data : (res.data?.staff || []);
        setStaff(data.length > 0 ? data : SEED_STAFF);
      } catch (e) {
        setStaff(SEED_STAFF);
      }

      // 3. Load Fees registries
      const cachedStruct = localStorage.getItem('edu_erp_admission_fee_structures');
      setAdmissionYearFeeStructures(cachedStruct ? JSON.parse(cachedStruct) : SEED_ADMISSION_YEAR_FEE_STRUCTURES);

      const cachedFeeReg = localStorage.getItem('edu_erp_student_fee_registry_v2');
      setStudentFeeRegistry(cachedFeeReg ? JSON.parse(cachedFeeReg) : SEED_STUDENT_FEE_REGISTRY);

      const cachedScholarship = localStorage.getItem('edu_erp_scholarship_registry');
      setScholarshipRegistry(cachedScholarship ? JSON.parse(cachedScholarship) : SEED_SCHOLARSHIP_REGISTRY);

      const cachedFine = localStorage.getItem('edu_erp_fine_registry');
      setFineRegistry(cachedFine ? JSON.parse(cachedFine) : SEED_FINE_REGISTRY);

      const cachedTx = localStorage.getItem('edu_erp_fee_transactions_v2');
      setFeeTransactions(cachedTx ? JSON.parse(cachedTx) : SEED_FEE_TRANSACTIONS);

      // 4. Load Exams
      const cachedExams = localStorage.getItem('edu_erp_exams_registry');
      setExams(cachedExams ? JSON.parse(cachedExams) : SEED_EXAMS);

      const cachedMp = localStorage.getItem('edu_erp_exam_malpractice');
      setMalpracticeList(cachedMp ? JSON.parse(cachedMp) : SEED_MALPRACTICE);

      // 5. Load Leave Requests
      const cachedLeaves = localStorage.getItem('edu_erp_leave_requests');
      setLeaveRequests(cachedLeaves ? JSON.parse(cachedLeaves) : SEED_LEAVE_REQUESTS);

      // 6. Load Allocations
      const cachedAllocs = localStorage.getItem('edu_erp_class_allocations');
      setAllocations(cachedAllocs ? JSON.parse(cachedAllocs) : SEED_ALLOCATIONS);

      // 7. Load Placement
      const cachedPlacement = localStorage.getItem('edu_erp_placement_students');
      setPlacementStudents(cachedPlacement ? JSON.parse(cachedPlacement) : SEED_PLACEMENT_STUDENTS);

      // 8. Load Library
      try {
        const res = await api.get('/books');
        setBooksInventory(Array.isArray(res.data) && res.data.length > 0 ? res.data : SEED_BOOKS);
      } catch (e) {
        setBooksInventory(SEED_BOOKS);
      }

      try {
        const res = await api.get('/borrow-records');
        setBorrowRecords(Array.isArray(res.data) && res.data.length > 0 ? res.data : SEED_BORROWS);
      } catch (e) {
        setBorrowRecords(SEED_BORROWS);
      }
    };

    loadAllData();
  }, []);

  // Safe helper to calculate student outstanding balance specifically matching FeesManagement
  const getStudentFeeDetails = (student) => {
    const struct = (admissionYearFeeStructures ?? []).find(s => 
      s.admissionYear === student.admissionYear && s.department === student.department
    ) || {
      tuitionFee: 60000, labFee: 5000, libraryFee: 2000, examFee: 2500, semesterFee: 3000
    };
    const total = (struct.tuitionFee || 0) + (struct.labFee || 0) + (struct.libraryFee || 0) + (struct.examFee || 0) + (struct.semesterFee || 0);
    const scholarship = (scholarshipRegistry ?? []).find(sch => sch.rollNo === student.rollNo || sch.rollNo === student.registerNumber);
    const discount = scholarship ? (scholarship.scholarshipPercentage / 100) * total : 0;
    const fines = (fineRegistry ?? []).filter(f => f.rollNo === student.rollNo || f.rollNo === student.registerNumber).reduce((sum, f) => sum + (f.fineAmount || 0), 0);
    const finalFee = total - discount + fines;
    const balance = finalFee - (student.paidAmount || 0);
    return { total, discount, fines, finalFee, balance };
  };

  // Dynamically compute registries based on Single Source of Truth
  const pendingFeesList = useMemo(() => {
    return (studentFeeRegistry ?? []).map(student => {
      const details = getStudentFeeDetails(student);
      return { ...student, ...details };
    }).filter(student => student.balance > 0);
  }, [studentFeeRegistry, admissionYearFeeStructures, scholarshipRegistry, fineRegistry]);

  const feeDefaultersList = useMemo(() => {
    return (studentFeeRegistry ?? []).map(student => {
      const details = getStudentFeeDetails(student);
      return { ...student, ...details };
    }).filter(student => student.balance > 25000);
  }, [studentFeeRegistry, admissionYearFeeStructures, scholarshipRegistry, fineRegistry]);

  const finesPendingList = useMemo(() => {
    return (fineRegistry ?? []).filter(f => f.status === 'Pending');
  }, [fineRegistry]);

  const lowAttendanceList = useMemo(() => {
    return (students ?? []).filter(s => s && s.attendancePercentage < 75);
  }, [students]);

  const pendingAdmissionsList = useMemo(() => {
    return (students ?? []).filter(s => s && s.admissionStatus !== 'Approved');
  }, [students]);

  const salaryPendingList = useMemo(() => {
    return (staff ?? []).filter(s => s && (s.salaryStatus === 'Pending' || s.status === 'On Leave'));
  }, [staff]);

  const staffOnLeaveList = useMemo(() => {
    return (staff ?? []).filter(s => s && s.status === 'On Leave');
  }, [staff]);

  // Exams computed values
  const allAppearingStudents = useMemo(() => {
    const list = [];
    (exams ?? []).forEach(ex => {
      const total = ex.totalStudents ?? 40;
      const absentCount = ex.absentStudents ?? 0;
      for (let i = 1; i <= total; i++) {
        const isAbsent = i <= absentCount;
        const reg = `2026${ex.department}0${String(i).padStart(2, '0')}`;
        list.push({
          registerNumber: reg,
          studentName: `Student ${ex.department} #${i}`,
          department: ex.department,
          year: ex.year,
          semester: ex.semester,
          subjectName: ex.subjectName,
          subjectCode: ex.subjectCode,
          roomNumber: ex.roomNumber,
          examDate: ex.examDate,
          attendanceStatus: isAbsent ? 'Absent' : 'Present',
          feeStatus: 'CLEARED',
          attendancePercentage: isAbsent ? 71.5 : 94.2
        });
      }
    });
    return list;
  }, [exams]);

  const activeAllocations = useMemo(() => {
    return (allocations ?? []).filter(a => a.status === 'Occupied' || a.status === 'Lab Active');
  }, [allocations]);

  const vacantClassrooms = useMemo(() => {
    return (allocations ?? []).filter(a => a.status === 'Vacant');
  }, [allocations]);

  const borrowRecordsActive = useMemo(() => {
    return (borrowRecords ?? []).filter(b => b.returnStatus === 'Borrowed');
  }, [borrowRecords]);

  const borrowRecordsOverdue = useMemo(() => {
    return (borrowRecords ?? []).filter(b => b.returnStatus === 'Overdue');
  }, [borrowRecords]);

  const totalCollectedRevenue = useMemo(() => {
    return (feeTransactions ?? []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [feeTransactions]);

  const totalBooksInventoryCount = useMemo(() => {
    return (booksInventory ?? []).reduce((acc, curr) => acc + (curr.copies || 0), 0);
  }, [booksInventory]);

  // Global handle drilldown clicks mapping to tables
  const handleKPIClick = (type, title) => {
    let drillList = [];
    let cols = [];
    let search = [];

    switch (type) {
      case 'total_students':
        drillList = students ?? [];
        cols = [
          { header: 'Register No', accessor: 'registerNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.registerNumber || row.reg}</span> },
          { header: 'Student Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName || row.name}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Year / Sem', render: (row) => <span>{row.year} Year • Sem {row.semester}</span> },
          { header: 'Attendance %', accessor: 'attendancePercentage', render: (row) => <span>{row.attendancePercentage}%</span> },
          { header: 'Admission Status', accessor: 'admissionStatus', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${row.admissionStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {row.admissionStatus}
            </span>
          )}
        ];
        search = ['registerNumber', 'fullName', 'name', 'department'];
        break;

      case 'total_staff':
        drillList = staff ?? [];
        cols = [
          { header: 'Staff ID', accessor: 'staffId', render: (row) => <span className="font-extrabold text-indigo-600">{row.staffId || row.employeeId}</span> },
          { header: 'Faculty Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Designation', accessor: 'designation' },
          { header: 'Campus Status', accessor: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {row.status}
            </span>
          )}
        ];
        search = ['staffId', 'fullName', 'department', 'designation'];
        break;

      case 'revenue_collected':
        drillList = feeTransactions ?? [];
        cols = [
          { header: 'Receipt ID', accessor: 'id', render: (row) => <span className="font-extrabold text-indigo-600">{row.id}</span> },
          { header: 'Roll Number', accessor: 'rollNo' },
          { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-800">{row.studentName}</span> },
          { header: 'Paid Amount', accessor: 'amount', render: (row) => <span className="font-extrabold text-emerald-600">₹{row.amount?.toLocaleString()}</span> },
          { header: 'Method', accessor: 'paymentMode' },
          { header: 'Date', accessor: 'date' }
        ];
        search = ['id', 'rollNo', 'studentName', 'paymentMode'];
        break;

      case 'pending_fees':
        drillList = pendingFeesList;
        cols = [
          { header: 'Roll Number', accessor: 'rollNo', render: (row) => <span className="font-extrabold text-indigo-600">{row.rollNo}</span> },
          { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-800">{row.studentName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Tuition + Term Fees', accessor: 'total', render: (row) => <span>₹{row.total?.toLocaleString()}</span> },
          { header: 'Paid Amount', accessor: 'paidAmount', render: (row) => <span className="text-emerald-600 font-bold">₹{row.paidAmount?.toLocaleString()}</span> },
          { header: 'Outstanding Balance', accessor: 'balance', render: (row) => <span className="text-rose-600 font-black">₹{row.balance?.toLocaleString()}</span> }
        ];
        search = ['rollNo', 'studentName', 'department'];
        break;

      case 'fee_defaulters':
        drillList = feeDefaultersList;
        cols = [
          { header: 'Roll Number', accessor: 'rollNo', render: (row) => <span className="font-extrabold text-rose-600">{row.rollNo}</span> },
          { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-800">{row.studentName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Overdue Dues', accessor: 'balance', render: (row) => <span className="text-rose-600 font-black">₹{row.balance?.toLocaleString()}</span> },
          { header: 'Status Alert', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100">Action Required</span> }
        ];
        search = ['rollNo', 'studentName', 'department'];
        break;

      case 'scholarships':
        drillList = scholarshipRegistry ?? [];
        cols = [
          { header: 'Scholarship ID', accessor: 'id', render: (row) => <span className="font-extrabold text-indigo-600">{row.id}</span> },
          { header: 'Roll Number', accessor: 'rollNo' },
          { header: 'Scholarship Scheme', accessor: 'scholarshipType', render: (row) => <span className="font-bold text-slate-800">{row.scholarshipType}</span> },
          { header: 'Discount Percentage', accessor: 'scholarshipPercentage', render: (row) => <span className="font-extrabold text-emerald-600">{row.scholarshipPercentage}% Concession</span> },
          { header: 'Approved By', accessor: 'approvedBy' },
          { header: 'Validity Term', accessor: 'validityPeriod' }
        ];
        search = ['id', 'rollNo', 'scholarshipType', 'approvedBy'];
        break;

      case 'fines_pending':
        drillList = finesPendingList;
        cols = [
          { header: 'Fine Reference ID', accessor: 'fineId', render: (row) => <span className="font-extrabold text-rose-600">{row.fineId}</span> },
          { header: 'Roll Number', accessor: 'rollNo' },
          { header: 'Fine Reason', accessor: 'fineReason', render: (row) => <span className="font-bold text-slate-800">{row.fineReason}</span> },
          { header: 'Fine Type', accessor: 'fineType' },
          { header: 'Fine Amount', accessor: 'fineAmount', render: (row) => <span className="font-black text-rose-600">₹{row.fineAmount?.toLocaleString()}</span> },
          { header: 'Due Date', accessor: 'dueDate' }
        ];
        search = ['fineId', 'rollNo', 'fineReason', 'fineType'];
        break;

      case 'low_attendance':
        drillList = lowAttendanceList;
        cols = [
          { header: 'Register No', accessor: 'registerNumber', render: (row) => <span className="font-extrabold text-rose-600">{row.registerNumber}</span> },
          { header: 'Student Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Attendance Percentage', accessor: 'attendancePercentage', render: (row) => <span className="font-black text-rose-600">{row.attendancePercentage}%</span> },
          { header: 'Exam Admit Card status', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-50 text-rose-600 uppercase">Blocked</span> }
        ];
        search = ['registerNumber', 'fullName', 'department'];
        break;

      case 'pending_admissions':
        drillList = pendingAdmissionsList;
        cols = [
          { header: 'Register No', accessor: 'registerNumber' },
          { header: 'Student Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Admission Year', accessor: 'admissionYear', render: () => <span>2024</span> },
          { header: 'Status Flag', accessor: 'admissionStatus', render: (row) => (
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-50 text-amber-600 uppercase">{row.admissionStatus}</span>
          )}
        ];
        search = ['registerNumber', 'fullName', 'department'];
        break;

      case 'salary_pending':
        drillList = salaryPendingList;
        cols = [
          { header: 'Employee ID', accessor: 'staffId', render: (row) => <span className="font-extrabold text-indigo-600">{row.staffId}</span> },
          { header: 'Staff Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Salary Month', render: () => <span>May 2026</span> },
          { header: 'Salary Status', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-50 text-amber-600 uppercase">Awaiting Approval</span> }
        ];
        search = ['staffId', 'fullName', 'department'];
        break;

      case 'staff_on_leave':
        drillList = staffOnLeaveList;
        cols = [
          { header: 'Employee ID', accessor: 'staffId', render: (row) => <span className="font-extrabold text-rose-600">{row.staffId}</span> },
          { header: 'Staff Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Leave Duration', render: () => <span>Today</span> },
          { header: 'Substitute invigilator', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-50 text-indigo-600 uppercase">Assigned</span> }
        ];
        search = ['staffId', 'fullName', 'department'];
        break;

      case 'active_exams':
        drillList = exams ?? [];
        cols = [
          { header: 'Exam ID', accessor: 'examId', render: (row) => <span className="font-extrabold text-indigo-600">{row.examId}</span> },
          { header: 'Subject Code / Name', accessor: 'subjectName', render: (row) => (
            <div>
              <div className="font-black text-slate-800">{row.subjectName}</div>
              <span className="text-[9px] text-slate-400 font-bold uppercase">{row.subjectCode}</span>
            </div>
          )},
          { header: 'Department', accessor: 'department' },
          { header: 'Hall Room', accessor: 'roomNumber', render: (row) => <span className="font-bold text-slate-700">{row.roomNumber}</span> },
          { header: 'Invigilator Assigned', accessor: 'invigilatorName' },
          { header: 'Present / Absent', render: (row) => <span>{row.presentStudents} / {row.absentStudents}</span> }
        ];
        search = ['examId', 'subjectName', 'subjectCode', 'roomNumber'];
        break;

      case 'appearing_students':
        drillList = allAppearingStudents;
        cols = [
          { header: 'Register No', accessor: 'registerNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.registerNumber}</span> },
          { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-800">{row.studentName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Subject Code', accessor: 'subjectCode' },
          { header: 'Room Allocation', accessor: 'roomNumber', render: (row) => <span className="font-bold text-slate-700">{row.roomNumber}</span> },
          { header: 'Presence Status', accessor: 'attendanceStatus', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${row.attendanceStatus === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {row.attendanceStatus}
            </span>
          )}
        ];
        search = ['registerNumber', 'studentName', 'department', 'subjectCode'];
        break;

      case 'malpractice_cases':
        drillList = malpracticeList ?? [];
        cols = [
          { header: 'Infraction ID', accessor: 'id', render: (row) => <span className="font-extrabold text-rose-600">{row.id}</span> },
          { header: 'Student Name', accessor: 'studentName', render: (row) => (
            <div>
              <div className="font-bold text-slate-800">{row.studentName}</div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{row.registerNumber}</span>
            </div>
          )},
          { header: 'Exam / Hall', accessor: 'roomNumber', render: (row) => <span>{row.subjectName} ({row.roomNumber})</span> },
          { header: 'Invigilator', accessor: 'invigilatorName' },
          { header: 'Penalty Dues', accessor: 'fineAmount', render: (row) => <span className="font-black text-rose-600">₹{row.fineAmount}</span> },
          { header: 'Action Recommended', accessor: 'actionStatus', render: (row) => (
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase">{row.actionStatus}</span>
          )}
        ];
        search = ['id', 'studentName', 'registerNumber', 'subjectName'];
        break;

      case 'classes_today':
        drillList = activeAllocations;
        cols = [
          { header: 'Room Hall', accessor: 'roomNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.roomNumber}</span> },
          { header: 'Block / Floor', render: (row) => <span>{row.block} • {row.floor}</span> },
          { header: 'Class/Department Mapped', render: (row) => <span className="font-bold text-slate-700">{row.department} {row.year} Year</span> },
          { header: 'Strength', accessor: 'currentStrength', render: (row) => <span>{row.currentStrength || 40} Students</span> },
          { header: 'Advisor', accessor: 'classAdvisor' },
          { header: 'Status', accessor: 'status', render: (row) => (
            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${row.status === 'Occupied' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {row.status}
            </span>
          )}
        ];
        search = ['roomNumber', 'block', 'department', 'classAdvisor'];
        break;

      case 'staff_workload':
        drillList = staff.map((s, idx) => ({ ...s, periodHours: 12 + (idx % 3) * 4 }));
        cols = [
          { header: 'Employee ID', accessor: 'staffId', render: (row) => <span className="font-extrabold text-indigo-600">{row.staffId}</span> },
          { header: 'Staff Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Workload Rating', render: () => <span className="text-emerald-600 font-extrabold">Optimal</span> },
          { header: 'Weekly Periods Assigned', accessor: 'periodHours', render: (row) => <span className="font-black text-slate-800">{row.periodHours} Hours/week</span> }
        ];
        search = ['staffId', 'fullName', 'department'];
        break;

      case 'hostel_residents':
        drillList = students.filter((_, idx) => idx % 2 === 0).map((s, idx) => ({ ...s, room: `Room ${201 + idx}`, bed: `Bed ${1 + (idx % 3)}`, block: 'Block B' }));
        cols = [
          { header: 'Register No', accessor: 'registerNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.registerNumber}</span> },
          { header: 'Student Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Room Assignment', render: (row) => <span className="font-bold text-slate-700">{row.block} • {row.room} • {row.bed}</span> },
          { header: 'Mess Plan Type', render: () => <span>Vegetarian Plan</span> }
        ];
        search = ['registerNumber', 'fullName', 'department'];
        break;

      case 'transport_routes':
        drillList = [
          { routeId: 'RT-12', routeName: 'Tambaram Boarding Area', busNo: 'TN-22-E-1234', driver: 'Mr. Murugan', capacity: 55, occupancy: 42 },
          { routeId: 'RT-05', routeName: 'Guindy Central Routing', busNo: 'TN-22-A-5678', driver: 'Mr. Selvam', capacity: 50, occupancy: 38 },
          { routeId: 'RT-08', routeName: 'Velachery Route Mapping', busNo: 'TN-22-B-9012', driver: 'Mr. Ravi', capacity: 50, occupancy: 44 }
        ];
        cols = [
          { header: 'Route ID', accessor: 'routeId', render: (row) => <span className="font-extrabold text-indigo-600">{row.routeId}</span> },
          { header: 'Route Name', accessor: 'routeName', render: (row) => <span className="font-bold text-slate-800">{row.routeName}</span> },
          { header: 'Bus Number', accessor: 'busNo' },
          { header: 'Driver', accessor: 'driver' },
          { header: 'Utilization', render: (row) => <span>{row.occupancy} / {row.capacity} Mapped</span> }
        ];
        search = ['routeId', 'routeName', 'busNo', 'driver'];
        break;

      case 'library_inventory':
        drillList = booksInventory ?? [];
        cols = [
          { header: 'Book ID', accessor: 'id', render: (row) => <span className="font-extrabold text-indigo-600">{row.id}</span> },
          { header: 'Book Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Author', accessor: 'author' },
          { header: 'ISBN', accessor: 'isbn' },
          { header: 'Category', accessor: 'category' },
          { header: 'Stock copies', accessor: 'copies', render: (row) => <span className="font-bold">{row.available} / {row.copies} Copies Available</span> }
        ];
        search = ['title', 'author', 'isbn', 'category'];
        break;

      case 'borrowed_books':
        drillList = borrowRecordsActive;
        cols = [
          { header: 'Borrow ID', accessor: 'id', render: (row) => <span className="font-extrabold text-indigo-600">{row.id}</span> },
          { header: 'Book Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Borrower Name', accessor: 'studentName', render: (row) => <span className="font-semibold text-slate-700">{row.studentName} ({row.registerNumber})</span> },
          { header: 'Issue Date', accessor: 'borrowDate' },
          { header: 'Due Date', accessor: 'dueDate' }
        ];
        search = ['title', 'studentName', 'registerNumber'];
        break;

      case 'overdue_books':
        drillList = borrowRecordsOverdue;
        cols = [
          { header: 'Borrow ID', accessor: 'id', render: (row) => <span className="font-extrabold text-rose-600">{row.id}</span> },
          { header: 'Book Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Borrower Name', accessor: 'studentName', render: (row) => <span className="font-semibold text-slate-700">{row.studentName} ({row.registerNumber})</span> },
          { header: 'Days Overdue', accessor: 'daysOverdue', render: (row) => <span className="text-rose-600 font-extrabold">{row.daysOverdue} Days overdue</span> },
          { header: 'Library Fine Accrued', accessor: 'fineAmount', render: (row) => <span className="font-black text-rose-600">₹{row.fineAmount}</span> }
        ];
        search = ['title', 'studentName', 'registerNumber'];
        break;

      case 'placed_students':
        drillList = placementStudents ?? [];
        cols = [
          { header: 'Register No', accessor: 'registerNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.registerNumber}</span> },
          { header: 'Student Name', accessor: 'fullName', render: (row) => <span className="font-bold text-slate-800">{row.fullName || row.name}</span> },
          { header: 'Department', accessor: 'department' },
          { header: 'Company Recruited', accessor: 'companySelected', render: (row) => <span className="font-black text-slate-800">{row.companySelected}</span> },
          { header: 'Annual CTC Package', accessor: 'packageOffered', render: (row) => <span className="font-extrabold text-emerald-600">₹{row.packageOffered} LPA</span> },
          { header: 'Date Offered', accessor: 'placementDate' }
        ];
        search = ['registerNumber', 'fullName', 'companySelected'];
        break;

      case 'pending_leaves':
        drillList = leaveRequests.filter(l => l.status === 'Pending');
        cols = [
          { header: 'Request ID', accessor: 'id', render: (row) => <span className="font-extrabold text-indigo-600">{row.id}</span> },
          { header: 'Faculty Name', accessor: 'staffName', render: (row) => <span className="font-bold text-slate-800">{row.staffName}</span> },
          { header: 'Leave Category', accessor: 'leaveType' },
          { header: 'Leave Duration', render: (row) => <span>{row.days} Days ({row.startDate} to {row.endDate})</span> },
          { header: 'Reason Justification', accessor: 'reason', render: (row) => <span className="text-slate-500 italic">"{row.reason}"</span> },
          { header: 'Action status', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-50 text-amber-600 uppercase">Pending review</span> }
        ];
        search = ['id', 'staffName', 'leaveType', 'reason'];
        break;

      case 'approved_leaves':
        drillList = leaveRequests.filter(l => l.status === 'Approved');
        cols = [
          { header: 'Request ID', accessor: 'id', render: (row) => <span className="font-extrabold text-emerald-600">{row.id}</span> },
          { header: 'Faculty Name', accessor: 'staffName', render: (row) => <span className="font-bold text-slate-800">{row.staffName}</span> },
          { header: 'Leave Category', accessor: 'leaveType' },
          { header: 'Leave Duration', render: (row) => <span>{row.days} Days ({row.startDate} to {row.endDate})</span> },
          { header: 'Action status', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-50 text-emerald-600 uppercase">Approved</span> }
        ];
        search = ['id', 'staffName', 'leaveType'];
        break;

      case 'total_events':
        drillList = SEED_EVENTS;
        cols = [
          { header: 'Event ID', accessor: 'id', render: (row) => <span className="font-extrabold text-indigo-600">EV-{row.id}</span> },
          { header: 'Event Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Category', accessor: 'type', render: (row) => <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-extrabold rounded text-[9px] uppercase">{row.type}</span> },
          { header: 'Audience Group', accessor: 'audience' },
          { header: 'Start Date', accessor: 'startDate' },
          { header: 'Description notes', accessor: 'description' }
        ];
        search = ['id', 'title', 'type', 'audience'];
        break;

      case 'workshops_count':
        drillList = SEED_EVENTS.filter(e => e.type === 'Workshop');
        cols = [
          { header: 'Workshop Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Target Audience', accessor: 'audience' },
          { header: 'Date scheduled', accessor: 'startDate' },
          { header: 'Specialization Dept', accessor: 'department' }
        ];
        search = ['title', 'audience', 'department'];
        break;

      case 'holidays_count':
        drillList = SEED_EVENTS.filter(e => e.type === 'Holiday');
        cols = [
          { header: 'Holiday Event', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Date scheduled', accessor: 'startDate' },
          { header: 'Scope', accessor: 'audience' }
        ];
        search = ['title', 'audience'];
        break;

      case 'exams_calendar':
        drillList = SEED_EVENTS.filter(e => e.type === 'Exam');
        cols = [
          { header: 'Exam Cycle', accessor: 'title', render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
          { header: 'Start Date', accessor: 'startDate' },
          { header: 'End Date', accessor: 'endDate' },
          { header: 'Priority Level', accessor: 'priority', render: (row) => (
            <span className="px-2.5 py-0.5 rounded text-[9px] font-black bg-rose-50 text-rose-600 uppercase border border-rose-100">{row.priority}</span>
          )}
        ];
        search = ['title', 'priority'];
        break;

      case 'vacant_classrooms':
        drillList = vacantClassrooms;
        cols = [
          { header: 'Room Hall', accessor: 'roomNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.roomNumber}</span> },
          { header: 'Block', accessor: 'block' },
          { header: 'Floor Location', accessor: 'floor' },
          { header: 'Max seating Capacity', accessor: 'capacity', render: (row) => <span>{row.capacity} Seats</span> },
          { header: 'State status', render: () => <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-50 text-emerald-600 uppercase">Vacant</span> }
        ];
        search = ['roomNumber', 'block', 'floor'];
        break;

      default:
        break;
    }

    // Enrich records with their target drawerType for advanced profile view
    const enrichedList = drillList.map(row => {
      let drawerType = null;
      if (['pending_fees', 'fee_defaulters', 'fines_pending'].includes(type)) {
        drawerType = 'pending_fees';
      } else if (['low_attendance'].includes(type)) {
        drawerType = 'attendance';
      } else if (['pending_leaves', 'approved_leaves'].includes(type)) {
        drawerType = 'leave_request';
      } else if (['malpractice_cases'].includes(type)) {
        drawerType = 'malpractice';
      } else if (['classes_today', 'active_exams'].includes(type)) {
        drawerType = 'timetable';
      } else if (['total_events', 'workshops_count', 'holidays_count', 'exams_calendar'].includes(type)) {
        drawerType = 'communication';
      }
      return drawerType ? { ...row, drawerType } : row;
    });

    setGlobalModalTitle(title);
    setGlobalModalData(enrichedList);
    setGlobalModalColumns(cols);
    setGlobalModalSearchKeys(search);
    setIsGlobalModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 Outfit-Font bg-slate-50/30 p-2 sm:p-6 rounded-3xl">
      
      {/* Dynamic Drilldown Modal Overlay */}
      <GlobalDrilldownModal 
        isOpen={isGlobalModalOpen}
        onClose={() => setIsGlobalModalOpen(false)}
        title={globalModalTitle}
        data={globalModalData}
        columns={globalModalColumns}
        searchKeys={globalModalSearchKeys}
        onRowClick={(row) => {
          if (row.drawerType) {
            setGlobalDrawerType(row.drawerType);
          } else if (row.registerNumber || row.rollNo) {
            setGlobalDrawerType('student');
          } else if (row.staffId || row.employeeId) {
            setGlobalDrawerType('staff');
          } else {
            setGlobalDrawerType('hall');
          }
          setGlobalDrawerData(row);
          setIsGlobalDrawerOpen(true);
        }}
      />

      {/* Global Profile Drawer Slide-out */}
      <GlobalProfileDrawer 
        isOpen={isGlobalDrawerOpen}
        onClose={() => setIsGlobalDrawerOpen(false)}
        type={globalDrawerType}
        profileData={globalDrawerData}
      />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Activity className="text-indigo-600" size={32} />
            Enterprise Control Center
          </h1>
          <p className="text-slate-500 mt-1 font-semibold text-sm">Synchronized dynamic metrics audit ledgers from all administrative modules.</p>
        </div>
      </div>

      {/* Main General Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Enrolled Students" 
          value={students.length} 
          icon={GraduationCap} 
          colorClass="bg-indigo-600"
          onClick={() => handleKPIClick('total_students', 'Total Enrolled Students')}
        />
        <StatCard 
          title="Active Faculty & Staff" 
          value={staff.length} 
          icon={Users} 
          colorClass="bg-emerald-600"
          onClick={() => handleKPIClick('total_staff', 'Active Faculty & Staff')}
        />
        <StatCard 
          title="Fee Revenue Collected" 
          value={formatINR(totalCollectedRevenue)} 
          icon={DollarSign} 
          colorClass="bg-blue-600"
          onClick={() => handleKPIClick('revenue_collected', 'Fee Revenue Collected')}
        />
        <StatCard 
          title="Academic Events Scheduled" 
          value={SEED_EVENTS.length} 
          icon={CalendarDays} 
          colorClass="bg-violet-600"
          onClick={() => handleKPIClick('total_events', 'Academic Events Scheduled')}
        />
      </div>

      {/* Grid of Administrative Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FINANCE COMPONENT */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign size={20} />
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-wide text-xs">Fee Structure & Financial Audits</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleKPIClick('pending_fees', 'Students with Pending Fees')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pending Fees</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{pendingFeesList.length} Students</span>
            </button>
            <button onClick={() => handleKPIClick('fee_defaulters', 'Defaulters Overdue Dues')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Fee Defaulters</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1 block">{feeDefaultersList.length} Students</span>
            </button>
            <button onClick={() => handleKPIClick('scholarships', 'Scholarship Grants Registry')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Scholarships Awarded</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1 block">{scholarshipRegistry.length} Awards</span>
            </button>
            <button onClick={() => handleKPIClick('fines_pending', 'Unpaid Penalties & Fines')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pending Penalty Fines</span>
              <span className="text-xl font-extrabold text-amber-600 mt-1 block">{finesPendingList.length} Dues</span>
            </button>
          </div>
        </div>

        {/* ACADEMICS & EXAMINATIONS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen size={20} />
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-wide text-xs">Academics & Examination Control</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleKPIClick('active_exams', 'Scheduled Active Exams')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active Exams</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{exams.length} Slots</span>
            </button>
            <button onClick={() => handleKPIClick('appearing_students', 'Appeared Student Logs')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Students Appearing</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{allAppearingStudents.length} Students</span>
            </button>
            <button onClick={() => handleKPIClick('malpractice_cases', 'Logged Malpractice Infractions')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Malpractice Cases</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1 block">{malpracticeList.length} Logged</span>
            </button>
            <button onClick={() => handleKPIClick('exams_calendar', 'Academic Calendar Exam Cycles')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Exam Calendar Dates</span>
              <span className="text-xl font-extrabold text-violet-600 mt-1 block">{SEED_EVENTS.filter(e => e.type === 'Exam').length} Events</span>
            </button>
          </div>
        </div>

        {/* CAMPUS INFRASTRUCTURE & MAPPINGS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Building size={20} />
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-wide text-xs">Campus Infrastructure & Allocations</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleKPIClick('classes_today', 'Timetabled Classrooms')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Classrooms Active</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{activeAllocations.length} Occupied</span>
            </button>
            <button onClick={() => handleKPIClick('vacant_classrooms', 'Vacant Classroom Mappings')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Vacant Rooms</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1 block">{vacantClassrooms.length} Halls Available</span>
            </button>
            <button onClick={() => handleKPIClick('hostel_residents', 'Hostel Housing Bed Allocations')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Hostel Residents</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{students.filter((_, idx) => idx % 2 === 0).length} Checked-In</span>
            </button>
            <button onClick={() => handleKPIClick('transport_routes', 'Active Fleet Routes Mapped')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Transport Routes</span>
              <span className="text-xl font-extrabold text-blue-600 mt-1 block">3 Active Routes</span>
            </button>
          </div>
        </div>

        {/* LIBRARY & CAMPUS SERVICES */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
              <BookOpen size={20} />
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-wide text-xs">Library Ledger & Campus Services</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleKPIClick('library_inventory', 'Library Catalog Ledger')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Book Inventory</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{totalBooksInventoryCount} Books</span>
            </button>
            <button onClick={() => handleKPIClick('borrowed_books', 'Active Issued Books')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Borrowed Books</span>
              <span className="text-xl font-extrabold text-indigo-600 mt-1 block">{borrowRecordsActive.length} Issued</span>
            </button>
            <button onClick={() => handleKPIClick('overdue_books', 'Library Overdue Book Warnings')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Overdue Books</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1 block">{borrowRecordsOverdue.length} Overdue</span>
            </button>
            <button onClick={() => handleKPIClick('placed_students', 'Placed Student Drives')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Placed Students</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1 block">{placementStudents.length} Offers</span>
            </button>
          </div>
        </div>

        {/* STAFF DUTY ROSTERS & LEAVE REQUESTS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users size={20} />
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-wide text-xs">Faculty Duty Rosters & Leaves</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleKPIClick('pending_leaves', 'Pending Leave Applications')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pending Leave Requests</span>
              <span className="text-xl font-extrabold text-indigo-600 mt-1 block">{leaveRequests.filter(l => l.status === 'Pending').length} Pending</span>
            </button>
            <button onClick={() => handleKPIClick('approved_leaves', 'Approved Leave Log')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Approved Leaves</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1 block">{leaveRequests.filter(l => l.status === 'Approved').length} Approved</span>
            </button>
            <button onClick={() => handleKPIClick('salary_pending', 'Faculty Salary Authorizations')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Salary Pending</span>
              <span className="text-xl font-extrabold text-amber-600 mt-1 block">{salaryPendingList.length} Staff</span>
            </button>
            <button onClick={() => handleKPIClick('staff_on_leave', 'Staff On Leave Today')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Staff On Leave</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1 block">{staffOnLeaveList.length} Leave Today</span>
            </button>
          </div>
        </div>

        {/* ATTENDANCE & ENROLLMENT COMPLIANCE */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <GraduationCap size={20} />
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-wide text-xs">Attendance & Compliance Checks</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleKPIClick('low_attendance', 'Students with Low Attendance')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Low Attendance Alerts</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1 block">{lowAttendanceList.length} Students (&lt;75%)</span>
            </button>
            <button onClick={() => handleKPIClick('pending_admissions', 'Students Awaiting Verification')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pending Admissions</span>
              <span className="text-xl font-extrabold text-amber-600 mt-1 block">{pendingAdmissionsList.length} Verification</span>
            </button>
            <button onClick={() => handleKPIClick('staff_workload', 'Faculty Weekly Workload Rating')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/70 border border-slate-200/40 text-left cursor-pointer transition-colors col-span-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Faculty Workload Profiles</span>
              <span className="text-xl font-extrabold text-indigo-600 mt-1 block">{staff.length} Active Workloads Mapped</span>
            </button>
          </div>
        </div>

      </div>

      {/* Historical YoY Growth Charts */}
      <div className="card p-6 bg-white border border-slate-100 rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Year-over-Year Admissions & Revenue</h3>
            <p className="text-slate-400 text-xs font-semibold mt-1">Institutional admissions and collections compared with previous terms</p>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={[
              { month: 'Jan', lastYearAdmissions: 120, thisYearAdmissions: 145, lastYearRevenue: 1200000, thisYearRevenue: 1450000 },
              { month: 'Feb', lastYearAdmissions: 98, thisYearAdmissions: 110, lastYearRevenue: 980000, thisYearRevenue: 1100000 },
              { month: 'Mar', lastYearAdmissions: 150, thisYearAdmissions: 190, lastYearRevenue: 1500000, thisYearRevenue: 1900000 },
              { month: 'Apr', lastYearAdmissions: 210, thisYearAdmissions: 260, lastYearRevenue: 2100000, thisYearRevenue: 2600000 },
              { month: 'May', lastYearAdmissions: 300, thisYearAdmissions: 350, lastYearRevenue: 3000000, thisYearRevenue: 3500000 }
            ]} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: 700}} dy={10} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: 700}} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => formatCompactINR(value)} tick={{fill: '#10B981', fontSize: 11, fontWeight: 700}} dx={10} />
              <Tooltip 
                cursor={{fill: '#F8FAFC'}}
                contentStyle={{borderRadius: '16px', border: '1px solid #E2E8F0', padding: '12px'}}
                formatter={(value, name) => {
                   if(name.includes('Revenue')) return [formatINR(value), name];
                   return [value, name];
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar yAxisId="left" dataKey="lastYearAdmissions" name="2025 Admissions" fill="#DBEAFE" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="thisYearAdmissions" name="2026 Admissions" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="thisYearRevenue" name="2026 Revenue Collections" stroke="#10B981" strokeWidth={3} dot={{r: 5, fill: '#fff', strokeWidth: 2}} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
