import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Users, GraduationCap, MapPin, Award, BookOpen, Clock, 
  ShieldAlert, ShieldCheck, Phone, CheckCircle2, XCircle, Video, Flame, AlertTriangle,
  CreditCard, DollarSign, Calendar, FileText, CheckCircle, HelpCircle, Briefcase, Bus, Building, Mail,
  MessageSquare, FileSpreadsheet, Eye, ChevronRight, Activity, Bell, Info
} from 'lucide-react';

const GlobalProfileDrawer = ({ isOpen, onClose, type, profileData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !profileData) return null;

  // ----------------------------------------------------
  // NORMALIZATION ENGINE (Safely maps all record types)
  // ----------------------------------------------------

  // Student details
  const studentName = profileData.studentName || profileData.fullName || profileData.name || 'Vinoth Kumar';
  const registerNumber = profileData.registerNumber || profileData.reg || profileData.rollNo || '2026CSE001';
  const department = profileData.department || profileData.dept || 'Computer Science';
  const year = profileData.year || 'III';
  const semester = profileData.semester || '6';
  const email = profileData.email || `${studentName.toLowerCase().replace(/\s+/g, '')}@college.edu`;
  const phone = profileData.phone || profileData.guardianPhone || profileData.parentContact || '+91 98401 23456';
  const attendancePercentage = profileData.attendancePercentage ?? 84.5;
  const feesPaid = profileData.feesPaid || profileData.feeStatus || 'Paid';

  // Staff details
  const staffName = profileData.fullName || profileData.staffName || profileData.invigilatorName || 'Prof. Sneha Iyer';
  const staffId = profileData.staffId || profileData.employeeId || 'EMP-IT-012';
  const designation = profileData.designation || 'Associate Professor';
  const salaryStatus = profileData.salaryStatus || (profileData.id % 2 === 0 ? 'Pending' : 'Credited');
  const leaveStatus = profileData.status === 'On Leave' || profileData.hostelStatus === 'On Leave' || profileData.leaveType ? 'On Leave' : 'Active / On Campus';

  // Hall details
  const roomNumber = profileData.roomNumber || profileData.classroomNumber || 'Block A - 301';
  const blockName = profileData.blockName || profileData.block || 'Block A';
  const capacity = profileData.seatingCapacity || profileData.capacity || 60;
  const totalStudents = profileData.totalStudents || profileData.currentStrength || 45;

  // Malpractice details
  const examSubject = profileData.subjectName || 'Data Structures & Algorithms';
  const examCode = profileData.subjectCode || 'CS801';
  const reportingStaff = profileData.reportingStaff || 'Prof. Sneha Iyer';
  const malpracticeType = profileData.malpracticeType || 'Possession of Unauthorized Material (Chits)';
  const detailedReason = profileData.detailedReason || 'Caught with micro-photocopies of Unit 3/4 notes hidden under the question paper.';
  const evidenceStatus = profileData.evidenceStatus || 'Confiscated & Logged';
  const timeReported = profileData.timeReported || '10:45 AM';
  const actionTaken = profileData.actionTaken || profileData.actionStatus || 'Suspended for 2 Exams';
  const finePenalty = profileData.fineAmount || '₹5,000';
  const parentNotifiedStatus = profileData.parentNotifiedStatus || 'Notified via Registered Mail & SMS';
  const suspensionStatus = profileData.suspensionStatus || 'Pending Board Final Decision';
  const cctvReference = profileData.cctvReference || 'CCTV-NEWTON-B3-P2';
  const examSessionTiming = profileData.examSessionTiming || 'Forenoon Session (09:30 AM - 12:30 PM)';

  // Pending Fees details
  const pendingAmount = profileData.balance || profileData.pendingAmount || 45000;
  const dueDate = profileData.dueDate || '2026-06-15';
  const scholarshipDetails = profileData.scholarshipDetails || profileData.scholarshipType || '15% Merit Concession';
  const tuitionFeeBreakdown = profileData.tuitionFee || 85000;
  const hostelFeeBreakdown = profileData.hostelFee || 45000;
  const transportFeeBreakdown = profileData.transportFee || 15000;
  const examFeeBreakdown = profileData.examFee || 5000;
  const fineReason = profileData.fineReason || 'Library Books Overdue & Late Term Registration';
  const installmentHistory = profileData.installmentHistory || [
    { installment: '1st Installment', amount: '₹50,000', date: '2026-01-10', status: 'Paid' },
    { installment: '2nd Installment', amount: `₹${pendingAmount.toLocaleString()}`, date: dueDate, status: 'Overdue' }
  ];

  // Leave Request details
  const leaveType = profileData.leaveType || 'Medical Leave';
  const startDate = profileData.startDate || '2026-05-18';
  const endDate = profileData.endDate || '2026-05-22';
  const durationDays = profileData.days || 5;
  const leaveReason = profileData.reason || 'Undergoing major knee surgery and require medical observation.';
  const emergencyLevel = profileData.priority || 'Critical';
  const remainingLeaves = profileData.remainingLeaves ?? 12;
  const substituteFaculty = profileData.substituteStaff || 'Prof. Rajesh Kumar';
  const timetableImpact = profileData.timetableImpact || '4 sessions roster swapped';
  const principalRemarks = profileData.rejectionReason || 'Coverage confirmed. Approved with active substitute matching.';
  const supportingDocuments = profileData.attachmentName || 'medical_certificate.pdf';

  // Attendance Trend
  const presentDays = profileData.presentDays || 85;
  const absentDays = profileData.absentDays || 10;
  const odDays = profileData.odDays || 5;
  const lateEntries = profileData.lateEntries || 3;
  const attendanceTrend = profileData.attendanceTrend || '90% (CSE-A Average: 86%)';
  const warningLevel = attendancePercentage < 75 ? 'Critical Alert' : attendancePercentage < 85 ? 'Moderate Warning' : 'Excellent Status';
  const parentNotifiedStatusAttendance = profileData.parentNotifiedStatusAttendance || 'SMS dispatched on low attendance trigger';

  // Timetable Class Schedule
  const liveClassStatus = profileData.liveClassStatus || profileData.status || 'Active Now';
  const weeklyWorkload = profileData.periodHours || profileData.weeklyWorkload || 16;
  const periodTiming = profileData.periodTiming || 'Period 3 (11:30 AM - 12:30 PM)';

  // Communication Notice details
  const noticeTitle = profileData.title || 'Urgent: Revision of Semester Roster';
  const postedBy = profileData.publishedBy || profileData.postedBy || 'System Administrator';
  const targetDepartment = profileData.department || 'All Departments';
  const readCount = profileData.readCount || 320;
  const unreadCount = profileData.unreadCount || 120;
  const priorityLevel = profileData.priority || 'High';
  const attachments = profileData.attachmentName || 'academic_schedule_v2.pdf';
  const publishTime = profileData.publishTime || '2026-05-15 09:00 AM';
  const expiryDate = profileData.expiryDate || '2026-06-30';
  const audienceType = profileData.audience || 'All Staff & Students';

  // ----------------------------------------------------
  // RENDER DYNAMIC CARD BADGES
  // ----------------------------------------------------
  const renderHeaderBadge = () => {
    switch (type) {
      case 'malpractice':
        return <span className="bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Malpractice Infraction</span>;
      case 'pending_fees':
        return <span className="bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Outstanding Payment</span>;
      case 'leave_request':
        return <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Leave Application</span>;
      case 'attendance':
        return <span className="bg-violet-50 border border-violet-100 text-violet-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Attendance Profile</span>;
      case 'timetable':
        return <span className="bg-cyan-50 border border-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Roster Schedule</span>;
      case 'communication':
        return <span className="bg-pink-50 border border-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Announcement notice</span>;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end">
          
          {/* Backdrop blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          ></motion.div>

          {/* Slide-out Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg bg-white border-l border-slate-100 shadow-2xl h-screen flex flex-col z-10 Outfit-Font"
          >
            
            {/* Header segment */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl shrink-0 ${
                  type === 'student' || type === 'malpractice' || type === 'pending_fees' || type === 'attendance' ? 'bg-indigo-50 text-indigo-600' :
                  type === 'staff' || type === 'leave_request' || type === 'timetable' ? 'bg-emerald-50 text-emerald-600' : 'bg-pink-50 text-pink-600'
                }`}>
                  {type === 'student' || type === 'malpractice' || type === 'pending_fees' || type === 'attendance' ? <GraduationCap size={20} /> :
                   type === 'staff' || type === 'leave_request' || type === 'timetable' ? <Users size={20} /> : <Bell size={20} />}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Detailed Audit View</h3>
                  <h4 className="text-sm font-black text-slate-800 uppercase mt-1.5 leading-none flex items-center gap-2">
                    <span>
                      {type === 'student' ? 'Student Ledger' :
                       type === 'staff' ? 'Faculty Dossier' :
                       type === 'hall' ? 'Hall Audit Log' :
                       type === 'malpractice' ? 'Incidents Board' :
                       type === 'pending_fees' ? 'Accounts Registry' :
                       type === 'leave_request' ? 'HR Leave Roster' :
                       type === 'attendance' ? 'Compliance Center' :
                       type === 'timetable' ? 'Workload Scheduler' : 'Communications Hub'}
                    </span>
                    {renderHeaderBadge()}
                  </h4>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Detailed profile content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* STUDENT PROFILE TYPE */}
              {type === 'student' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 border border-indigo-700 flex items-center justify-center font-black text-white text-2xl shadow-sm shrink-0 uppercase">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800">{studentName}</h4>
                      <span className="text-xs text-indigo-600 font-extrabold block mt-0.5">{registerNumber}</span>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">{department} Department • Year {year} • Sem {semester}</span>
                    </div>
                  </div>

                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'academics', 'finance', 'details'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${attendancePercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Attendance Ratio</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Minimum 75% required for exams</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-black ${attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {attendancePercentage}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${feesPaid === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Fee Settlement</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Academic Term Dues</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                          feesPaid === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {feesPaid === 'Paid' ? 'Cleared' : 'Pending Dues'}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'academics' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">GPA Grade Metric</span>
                        <p className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm">
                          <Award size={16} className="text-amber-500" /> {profileData.cgpa || '8.20'} / 10.00 CGPA
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'finance' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-slate-500">Academic Tuition Fee</span>
                          <span className="font-black text-slate-800">₹85,000</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="font-black text-slate-800">Outstanding Balance</span>
                          <span className="font-black text-indigo-600 text-sm">
                            {feesPaid === 'Paid' ? '₹0' : '₹45,000'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Guardian Contact</span>
                        <p className="font-extrabold text-slate-800 flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {phone}</p>
                        <p className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-1"><Mail size={14} className="text-slate-400" /> {email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAFF PROFILE TYPE */}
              {type === 'staff' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 border border-emerald-700 flex items-center justify-center font-black text-white text-2xl shadow-sm shrink-0 uppercase">
                      {staffName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800">{staffName}</h4>
                      <span className="text-xs text-emerald-600 font-extrabold block mt-0.5">{staffId}</span>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">{department} Department • {designation}</span>
                    </div>
                  </div>

                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'dossier'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl bg-emerald-50 text-emerald-600`}>
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Salary Status</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">May Month</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-50 text-emerald-600`}>
                          {salaryStatus}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'dossier' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specialization</span>
                        <p className="font-extrabold text-slate-800">Advanced Algorithms & Relational Schemas</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* HALL PROFILE TYPE */}
              {type === 'hall' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Examination Hall</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">{roomNumber}</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">{blockName}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Video size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-700">CCTV System</h5>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Stream Secured</p>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Seating Capacity Utilization</span>
                      <span className="text-slate-800">{totalStudents} / {capacity} Seats</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                      <div 
                        className="h-full rounded-full bg-indigo-600" 
                        style={{ width: `${(totalStudents / capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. MALPRACTICE PROFILE VIEW */}
              {type === 'malpractice' && (
                <div className="space-y-6">
                  
                  {/* Photo & Identity Banner */}
                  <div className="flex items-center gap-4 bg-red-50/20 p-4 rounded-2xl border border-red-100/50">
                    <div className="w-16 h-16 rounded-2xl bg-rose-600 border border-rose-700 flex items-center justify-center font-black text-white text-2xl shadow-sm shrink-0 uppercase">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800">{studentName}</h4>
                      <span className="text-xs text-rose-600 font-extrabold block mt-0.5">{registerNumber}</span>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">{department} Department • Year {year} • Sem {semester}</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'incident', 'sanctions'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-rose-50 text-rose-600 font-black' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      {/* Telemetry info row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Exam Subject</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5">{examSubject}</span>
                          <span className="text-[8px] font-extrabold text-indigo-600 uppercase block mt-0.5">{examCode}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Hall & Seat</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5">{roomNumber}</span>
                          <span className="text-[8px] font-extrabold text-indigo-600 uppercase block mt-0.5">Seat No: {profileData.seatNo || 'B-14'}</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                            <ShieldAlert size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Invigilator Name</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Duty Staff</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">{staffName}</span>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <Clock size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Reported Time</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Session: {examSessionTiming}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">{timeReported}</span>
                      </div>

                    </div>
                  )}

                  {activeTab === 'incident' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-red-50/30 border border-red-100 rounded-2xl p-4">
                        <span className="text-[8px] font-black text-rose-700 uppercase tracking-wider block mb-1">Type of Infraction</span>
                        <p className="text-xs font-black text-rose-950">{malpracticeType}</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Detailed Reason</span>
                        <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">"{detailedReason}"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Evidence Status</span>
                          <span className="text-xs font-black text-emerald-600 block mt-0.5">{evidenceStatus}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">CCTV Reference</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5">{cctvReference}</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === 'sanctions' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Penalty Dues</span>
                          <span className="text-sm font-black text-rose-600 mt-0.5 block">{finePenalty}</span>
                        </div>
                        <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded text-[9px] font-black uppercase">Unpaid</span>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-rose-600" />
                          <h5 className="font-black text-slate-700">Actions Logged</h5>
                        </div>
                        <p className="font-bold text-slate-800">{actionTaken}</p>
                        <span className="text-[9px] text-slate-400 block font-bold">Suspension: {suspensionStatus}</span>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-indigo-600" />
                          <h5 className="font-black text-slate-700">Guardian Correspondence</h5>
                        </div>
                        <p className="font-bold text-slate-800">{parentNotifiedStatus}</p>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 2. PENDING FEES PROFILE VIEW */}
              {type === 'pending_fees' && (
                <div className="space-y-6">
                  
                  {/* Photo & Identity Banner */}
                  <div className="flex items-center gap-4 bg-amber-50/20 p-4 rounded-2xl border border-amber-100/50">
                    <div className="w-16 h-16 rounded-2xl bg-amber-600 border border-amber-700 flex items-center justify-center font-black text-white text-2xl shadow-sm shrink-0 uppercase">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800">{studentName}</h4>
                      <span className="text-xs text-amber-600 font-extrabold block mt-0.5">{registerNumber}</span>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">{department} Department • Year {year} • Sem {semester}</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'breakdown', 'installments'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-amber-50 text-amber-600 font-black' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      <div className="bg-red-50/20 border border-red-100/60 p-5 rounded-2xl flex justify-between items-center animate-pulse">
                        <div>
                          <span className="text-[8px] font-black text-rose-700 uppercase tracking-wider block">Pending Balance</span>
                          <span className="text-2xl font-black text-rose-600 mt-1 block">₹{pendingAmount.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-slate-400 uppercase block">Payment Due Date</span>
                          <span className="text-xs font-extrabold text-slate-800 mt-1 block">{dueDate}</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <Award size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Scholarship Relief</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Applied Schemes</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-600">{scholarshipDetails}</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Fine Accrual Reason</span>
                        <p className="text-[11px] font-bold text-amber-700">⚠️ {fineReason}</p>
                      </div>

                    </div>
                  )}

                  {activeTab === 'breakdown' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-slate-500">Tuition Fees</span>
                          <span className="font-black text-slate-800">₹{tuitionFeeBreakdown.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-slate-500">Hostel & Messing</span>
                          <span className="font-black text-slate-800">₹{hostelFeeBreakdown.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-slate-500">Transport Fleet</span>
                          <span className="font-black text-slate-800">₹{transportFeeBreakdown.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="text-slate-500">End Sem Exam Tickets</span>
                          <span className="font-black text-slate-800">₹{examFeeBreakdown.toLocaleString()}</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === 'installments' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Payment Installment History</span>
                      <div className="space-y-2">
                        {installmentHistory.map((inst, i) => (
                          <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                            <div>
                              <p className="font-extrabold text-slate-800">{inst.installment}</p>
                              <span className="text-[10px] text-slate-400 font-bold mt-0.5">Due Date: {inst.date}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-slate-800 block">{inst.amount}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase mt-0.5 inline-block ${inst.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>{inst.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 3. LEAVE REQUEST PROFILE VIEW */}
              {type === 'leave_request' && (
                <div className="space-y-6">
                  
                  {/* Photo & Identity Banner */}
                  <div className="flex items-center gap-4 bg-blue-50/20 p-4 rounded-2xl border border-blue-100/50">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 border border-blue-700 flex items-center justify-center font-black text-white text-2xl shadow-sm shrink-0 uppercase">
                      {staffName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800">{staffName}</h4>
                      <span className="text-xs text-blue-600 font-extrabold block mt-0.5">{staffId}</span>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">{department} Department • {designation}</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'workload', 'approval'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Duration requested</span>
                          <span className="text-xs font-black text-slate-800 mt-1 block">{startDate} to {endDate}</span>
                        </div>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded text-xs font-black uppercase">{durationDays} Days</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Remaining Balance</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5">{remainingLeaves} Days</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Emergency Priority</span>
                          <span className={`text-xs font-black block mt-0.5 ${emergencyLevel === 'Critical' ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`}>{emergencyLevel}</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Reason Stated</span>
                        <p className="text-[11px] font-bold text-slate-700 italic">"{leaveReason}"</p>
                      </div>

                    </div>
                  )}

                  {activeTab === 'workload' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                            <Users size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Substitute Faculty</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assigned Coverage</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">{substituteFaculty}</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Timetable Roster Impact</span>
                        <p className="text-[11px] font-bold text-indigo-600">{timetableImpact}</p>
                      </div>

                    </div>
                  )}

                  {activeTab === 'approval' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <h5 className="font-black text-slate-700">Principal Audit Remarks</h5>
                        </div>
                        <p className="font-bold text-slate-800">{principalRemarks}</p>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-indigo-600" />
                          <h5 className="font-black text-slate-700">Supporting Documentation</h5>
                        </div>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                          <Eye size={12} /> View {supportingDocuments}
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 4. ATTENDANCE COMPLIANCE PROFILE VIEW */}
              {type === 'attendance' && (
                <div className="space-y-6">
                  
                  {/* Photo & Identity Banner */}
                  <div className="flex items-center gap-4 bg-violet-50/20 p-4 rounded-2xl border border-violet-100/50">
                    <div className="w-16 h-16 rounded-2xl bg-violet-600 border border-violet-700 flex items-center justify-center font-black text-white text-2xl shadow-sm shrink-0 uppercase">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800">{studentName}</h4>
                      <span className="text-xs text-violet-600 font-extrabold block mt-0.5">{registerNumber}</span>
                      <span className="text-[10px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">{department} Department • Year {year} • Sem {semester}</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'subjects', 'warnings'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-violet-50 text-violet-600 font-black' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase block">Biometric Attendance Rate</span>
                          <span className={`text-2xl font-black mt-1 block ${attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}`}>{attendancePercentage}%</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${attendancePercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {warningLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { title: 'Present', val: presentDays, color: 'text-emerald-600 bg-emerald-50' },
                          { title: 'Absent', val: absentDays, color: 'text-rose-600 bg-rose-50' },
                          { title: 'OD Days', val: odDays, color: 'text-indigo-600 bg-indigo-50' },
                          { title: 'Late Entries', val: lateEntries, color: 'text-amber-600 bg-amber-50' }
                        ].map((stat, idx) => (
                          <div key={idx} className="bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm text-center">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider block">{stat.title}</span>
                            <span className={`text-sm font-black mt-1 block ${stat.color}`}>{stat.val}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {activeTab === 'subjects' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Subject-wise Biometric Log</span>
                      <div className="space-y-2">
                        {[
                          { name: 'Advanced Systems Architecture (CS801)', pct: 88, status: 'Clear' },
                          { name: 'Distributed Systems Engineering (CS402)', pct: 72, status: 'Warning' },
                          { name: 'Web Programming Laboratory (CS205)', pct: 92, status: 'Clear' }
                        ].map((sub, i) => (
                          <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                            <div className="flex-1 pr-4">
                              <p className="font-extrabold text-slate-800 leading-tight">{sub.name}</p>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                <div className={`h-full rounded-full ${sub.pct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${sub.pct}%` }}></div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`font-black text-sm ${sub.pct >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>{sub.pct}%</span>
                              <span className={`block text-[8px] font-black uppercase mt-0.5 ${sub.status === 'Clear' ? 'text-emerald-500' : 'text-rose-500'}`}>{sub.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {activeTab === 'warnings' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4">
                        <span className="text-[8px] font-black text-amber-800 uppercase block mb-1">Administrative Alert</span>
                        <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                          {attendancePercentage < 75 
                            ? 'CRITICAL WARNING: Biometric rates are below the institutional 75% limits. Admit card releases for final examinations will be blocked.' 
                            : 'COMPLIANCE CLEAR: Attendance requirements are fully consistent and satisfied for this student.'}
                        </p>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-indigo-600" />
                          <h5 className="font-black text-slate-700">Guardian Communications</h5>
                        </div>
                        <p className="font-bold text-slate-800">{parentNotifiedStatusAttendance}</p>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 5. TIMETABLE ROSTER PROFILE VIEW */}
              {type === 'timetable' && (
                <div className="space-y-6">
                  
                  {/* Identity Header */}
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Allocated Classroom</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">{roomNumber}</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">{blockName} Floor Mapping</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'workload'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-cyan-50 text-cyan-600 font-black' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase block">Session Period Roster</span>
                          <span className="text-xs font-black text-slate-800 mt-1 block">{periodTiming}</span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider animate-pulse">{liveClassStatus}</span>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Course Code & Department</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{examSubject}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-indigo-600">{examCode}</span>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                            <Users size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Target Group Section</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Year {year} Sem {semester}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">Sec {profileData.section || 'A'}</span>
                      </div>

                    </div>
                  )}

                  {activeTab === 'workload' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Weekly Faculty Workload</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assigned load metrics</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-indigo-600">{weeklyWorkload} Hours/week</span>
                      </div>

                      {profileData.substituteStaff && (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Assigned Coverage Faculty</span>
                          <p className="text-[11px] font-bold text-slate-800">{profileData.substituteStaff}</p>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* 6. COMMUNICATION ANNOUNCEMENT PROFILE VIEW */}
              {type === 'communication' && (
                <div className="space-y-6">
                  
                  {/* Identity Header */}
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Announcement Notice</span>
                    <h3 className="text-lg font-black text-slate-800 mt-1 leading-tight">{noticeTitle}</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">Posted by: {postedBy}</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 text-xs font-bold gap-1 pb-1">
                    {['overview', 'audience', 'analytics'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          activeTab === tab ? 'bg-pink-50 text-pink-600 font-black' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase block">Published Timestamp</span>
                          <span className="text-xs font-black text-slate-800 mt-1 block">{publishTime}</span>
                        </div>
                        <span className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider">{priorityLevel} Priority</span>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Message Content</span>
                        <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                          {profileData.content || 'This notice highlights standard compliance protocols regarding biometric parameters and examination schedules.'}
                        </p>
                      </div>

                      {attachments && (
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                              <FileText size={18} />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-700">Attachments Dossier</h5>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reference Documents</p>
                            </div>
                          </div>
                          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                            <Eye size={12} /> View {attachments}
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                  {activeTab === 'audience' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600">
                            <Users size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-700">Audience Scope</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Who can view this notice</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-pink-600">{audienceType}</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Target Department Scope</span>
                        <p className="text-[11px] font-bold text-slate-800">{targetDepartment}</p>
                      </div>

                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Read Count</span>
                          <span className="text-lg font-black text-emerald-600 block mt-1">{readCount} Readers</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Unread Count</span>
                          <span className="text-lg font-black text-slate-400 block mt-1">{unreadCount} Pending</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-indigo-600" />
                          <h5 className="font-black text-slate-700">Activity & Delivery Log</h5>
                        </div>
                        <div className="space-y-1.5 text-[10px]">
                          <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="text-slate-500">Notice Created</span>
                            <span className="font-bold text-slate-700">{publishTime}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="text-slate-500">Email Alerts Dispatched</span>
                            <span className="font-bold text-slate-700">Success</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Roster Sync Status</span>
                            <span className="font-bold text-indigo-600">Synced</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalProfileDrawer;
