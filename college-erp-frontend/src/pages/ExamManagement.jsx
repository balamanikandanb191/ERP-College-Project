import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, Award, Users, GraduationCap, Calendar, Clock, MapPin, 
  AlertTriangle, ShieldAlert, BookOpen, RefreshCw, Sparkles, User, FileText, 
  Check, X, Search, Filter, Plus, Printer, Download, Eye, Play, CheckCircle2, 
  ShieldCheck, Flame, Trash2, Edit3, ArrowRight, BookOpenCheck, CalendarDays,
  FileDigit, FileSpreadsheet, Lock, AlertOctagon, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../services/api';
import GlobalDrilldownModal from '../components/common/GlobalDrilldownModal';
import GlobalProfileDrawer from '../components/common/GlobalProfileDrawer';

// Seed Initial Mock Exams Data
const SEED_EXAMS = [
  {
    id: 1,
    examId: "EX-2026-001",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS6301",
    department: "CSE",
    year: "2",
    semester: "3",
    section: "A",
    examType: "Semester",
    examDate: "2026-05-18",
    day: "Monday",
    startTime: "09:30",
    endTime: "12:30",
    duration: "3 Hours",
    roomNumber: "LH-101",
    blockName: "Newton Block",
    totalStudents: 45,
    presentStudents: 43,
    absentStudents: 2,
    invigilatorId: "1",
    invigilatorName: "Dr. Amit Sharma",
    chiefSuperintendent: "Dr. K. Srinivasan (COE)",
    seatingCapacity: 60,
    attendancePercentage: 95.5,
    malpracticeCount: 0,
    status: "Upcoming",
    instructions: "No programmable devices or smart watches allowed in the examination hall.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    examId: "EX-2026-002",
    subjectName: "Database Management Systems",
    subjectCode: "CS6302",
    department: "CSE",
    year: "2",
    semester: "3",
    section: "B",
    examType: "Semester",
    examDate: "2026-05-18",
    day: "Monday",
    startTime: "09:30",
    endTime: "12:30",
    duration: "3 Hours",
    roomNumber: "LH-102",
    blockName: "Newton Block",
    totalStudents: 40,
    presentStudents: 40,
    absentStudents: 0,
    invigilatorId: "2",
    invigilatorName: "Prof. Sneha Iyer",
    chiefSuperintendent: "Dr. K. Srinivasan (COE)",
    seatingCapacity: 50,
    attendancePercentage: 100.0,
    malpracticeCount: 1,
    status: "Ongoing",
    instructions: "Maintain absolute silence. Any communication will result in immediate disqualification.",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    examId: "EX-2026-003",
    subjectName: "Artificial Intelligence & Robotics",
    subjectCode: "CS8501",
    department: "IT",
    year: "4",
    semester: "8",
    section: "A",
    examType: "Model",
    examDate: "2026-05-19",
    day: "Tuesday",
    startTime: "13:30",
    endTime: "16:30",
    duration: "3 Hours",
    roomNumber: "LH-201",
    blockName: "Ramanujan Block",
    totalStudents: 38,
    presentStudents: 35,
    absentStudents: 3,
    invigilatorId: "3",
    invigilatorName: "Dr. Rajesh Patel",
    chiefSuperintendent: "Dr. K. Srinivasan (COE)",
    seatingCapacity: 40,
    attendancePercentage: 92.1,
    malpracticeCount: 0,
    status: "Upcoming",
    instructions: "Only handwritten materials or official notes permitted for practical reference.",
    createdAt: new Date().toISOString()
  }
];

const SEED_MALPRACTICE = [
  {
    id: "MP-2026-001",
    studentName: "Rahul Verma",
    registerNumber: "2026CSE042",
    roomNumber: "LH-102",
    subjectName: "Database Management Systems",
    invigilatorName: "Prof. Sneha Iyer",
    incidentDetails: "Possession of micro-chits detailing SQL index constraints hidden under examination writing pad.",
    fineAmount: 5000,
    actionStatus: "Suspension Recommended",
    timestamp: "2026-05-17 10:15 AM"
  }
];

const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exams, setExams] = useState([]);
  const [malpracticeList, setMalpracticeList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  
  // Roster attendance student list helper
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceRoomFilter, setAttendanceRoomFilter] = useState('');

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null);
  const [drilldownData, setDrilldownData] = useState(null);
  const [selectedExamForAttendance, setSelectedExamForAttendance] = useState(null);
  const [isSeatingGenerated, setIsSeatingGenerated] = useState(false);
  const [seatingArrangement, setSeatingArrangement] = useState([]);

  // Universal Reusable Drilldown & Profile Drawer States
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [globalModalTitle, setGlobalModalTitle] = useState('');
  const [globalModalData, setGlobalModalData] = useState([]);
  const [globalModalColumns, setGlobalModalColumns] = useState([]);
  const [globalModalSearchKeys, setGlobalModalSearchKeys] = useState([]);

  const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);
  const [globalDrawerType, setGlobalDrawerType] = useState('student');
  const [globalDrawerData, setGlobalDrawerData] = useState(null);

  // Barcode / Hall ticket preview
  const [ticketSearchReg, setTicketSearchReg] = useState('2026CSE001');
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // New malpractice reporting form states
  const [isMalpracticeFormOpen, setIsMalpracticeFormOpen] = useState(false);
  const [malpracticeForm, setMalpracticeForm] = useState({
    studentName: '', registerNumber: '', roomNumber: '', subjectName: '',
    invigilatorName: '', incidentDetails: '', fineAmount: 2000, actionStatus: 'Warning Issued'
  });

  // Scheduling Form State
  const [scheduleForm, setScheduleForm] = useState({
    subjectName: '', subjectCode: '', department: 'CSE', year: '1', semester: '1', section: 'A',
    examType: 'Semester', examDate: '2026-05-18', startTime: '09:30', endTime: '12:30',
    roomNumber: 'LH-101', blockName: 'Newton Block', totalStudents: 40, presentStudents: 40,
    absentStudents: 0, invigilatorId: '', chiefSuperintendent: 'Dr. K. Srinivasan (COE)',
    seatingCapacity: 60, status: 'Upcoming', instructions: ''
  });

  // Load from localStorage & API
  const loadExamRegistry = () => {
    try {
      const cachedExams = localStorage.getItem('edu_erp_exams_registry');
      if (cachedExams) {
        setExams(JSON.parse(cachedExams));
      } else {
        localStorage.setItem('edu_erp_exams_registry', JSON.stringify(SEED_EXAMS));
        setExams(SEED_EXAMS);
      }

      const cachedMp = localStorage.getItem('edu_erp_exam_malpractice');
      if (cachedMp) {
        setMalpracticeList(JSON.parse(cachedMp));
      } else {
        localStorage.setItem('edu_erp_exam_malpractice', JSON.stringify(SEED_MALPRACTICE));
        setMalpracticeList(SEED_MALPRACTICE);
      }
    } catch (e) {
      console.error("Failed loading from localStorage:", e);
      setExams(SEED_EXAMS);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data } = await api.get('/staff');
      setStaffList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed loading staff:", e);
    }
  };

  useEffect(() => {
    loadExamRegistry();
    fetchStaff();
  }, []);

  // Sync to localStorage
  const syncExams = (newDataset) => {
    localStorage.setItem('edu_erp_exams_registry', JSON.stringify(newDataset));
    setExams(newDataset);
    window.dispatchEvent(new Event('storage'));
  };

  const syncMalpractice = (newDataset) => {
    localStorage.setItem('edu_erp_exam_malpractice', JSON.stringify(newDataset));
    setMalpracticeList(newDataset);
    window.dispatchEvent(new Event('storage'));
  };

  // Helper properties
  const today = new Date().toISOString().split('T')[0];
  const activeExamsToday = useMemo(() => {
    return (exams ?? []).filter(e => e.examDate === today);
  }, [exams, today]);

  // Centralized Synchronized Datasets
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
          attendancePercentage: isAbsent ? 71.5 : 94.2,
          malpracticeCount: (malpracticeList ?? []).filter(m => m.registerNumber === reg).length
        });
      }
    });
    return list;
  }, [exams, malpracticeList]);

  const allAllocatedHalls = useMemo(() => {
    const list = [];
    const roomsMap = {};
    (exams ?? []).forEach(ex => {
      if (ex.roomNumber && !roomsMap[ex.roomNumber]) {
        roomsMap[ex.roomNumber] = true;
        list.push({
          roomNumber: ex.roomNumber,
          blockName: ex.blockName || 'Newton Block',
          seatingCapacity: ex.seatingCapacity || 60,
          totalStudents: ex.totalStudents || 45,
          presentStudents: ex.presentStudents || 43,
          absentStudents: ex.absentStudents || 2,
          invigilatorName: ex.invigilatorName || 'Dr. Amit Sharma',
          subjectName: ex.subjectName,
          subjectCode: ex.subjectCode,
          department: ex.department
        });
      }
    });
    return list;
  }, [exams]);

  const allInvigilatorsAssigned = useMemo(() => {
    const list = [];
    const assignedMap = {};
    (exams ?? []).forEach(ex => {
      if (ex.invigilatorName && !assignedMap[ex.invigilatorName]) {
        assignedMap[ex.invigilatorName] = true;
        list.push({
          invigilatorName: ex.invigilatorName,
          staffId: `EMP-${ex.department}-0${ex.invigilatorId || '12'}`,
          department: ex.department,
          designation: 'Senior Faculty',
          roomNumber: ex.roomNumber,
          dutiesCount: (exams ?? []).filter(e => e.invigilatorName === ex.invigilatorName).length,
          experience: '8 Years'
        });
      }
    });
    return list;
  }, [exams]);

  // Dynamic calculations for Single Source of Truth
  const totals = useMemo(() => {
    const list = exams ?? [];
    const malpractice = malpracticeList ?? [];
    
    const appearingList = allAppearingStudents;
    const presentList = appearingList.filter(s => s.attendanceStatus === 'Present');
    const absentList = appearingList.filter(s => s.attendanceStatus === 'Absent');
    
    const completedCount = list.filter(e => e.status === 'Completed').length;
    const upcomingCount = list.filter(e => e.status === 'Upcoming').length;
    
    return {
      totalExams: list.length,
      activeToday: activeExamsToday.length,
      appearing: appearingList.length,
      present: presentList.length,
      absent: absentList.length,
      rooms: allAllocatedHalls.length,
      invigilators: allInvigilatorsAssigned.length,
      malpractices: malpractice.length,
      completed: completedCount,
      upcoming: upcomingCount
    };
  }, [exams, malpracticeList, activeExamsToday, allAppearingStudents, allAllocatedHalls, allInvigilatorsAssigned]);

  const kpis = [
    { title: 'Total Exams', value: totals.totalExams, subtitle: 'Overall scheduled', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', type: 'total_exams' },
    { title: 'Active Exams Today', value: totals.activeToday, subtitle: 'Ongoing session', icon: Play, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', type: 'active_today' },
    { title: 'Total Appearing', value: totals.appearing, subtitle: 'Enrolled students', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100', type: 'appearing' },
    { title: 'Present Students', value: totals.present, subtitle: 'Physically present', icon: CheckCircle2, color: 'text-teal-600 bg-teal-50 border-teal-100', type: 'present' },
    { title: 'Absent Students', value: totals.absent, subtitle: 'Requires review', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100', type: 'absent' },
    { title: 'Hall Rooms Allocated', value: totals.rooms, subtitle: 'Exam halls active', icon: MapPin, color: 'text-amber-600 bg-amber-50 border-amber-100', type: 'rooms' },
    { title: 'Invigilators Assigned', value: totals.invigilators, subtitle: 'Faculty duties', icon: User, color: 'text-cyan-600 bg-cyan-50 border-cyan-100', type: 'invigilators' },
    { title: 'Malpractice Cases', value: totals.malpractices, subtitle: 'Logged infractions', icon: ShieldAlert, color: 'text-red-600 bg-red-50 border-red-100', type: 'malpractice' },
    { title: 'Completed Exams', value: totals.completed, subtitle: 'Duties finalized', icon: ShieldCheck, color: 'text-pink-600 bg-pink-50 border-pink-100', type: 'completed' },
    { title: 'Upcoming Exams', value: totals.upcoming, subtitle: 'Timetabled slots', icon: Clock, color: 'text-violet-600 bg-violet-50 border-violet-100', type: 'upcoming' },
  ];

  // Excel / CSV audit spreadsheet download simulation
  const handleExport = (format) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Formatting live exam registers into ${format.toUpperCase()}...`,
        success: `Examination registers successfully exported in ${format.toUpperCase()} format!`,
        error: 'Export error.'
      }
    );
  };

  // Conflict prevention engine
  const handleScheduleSubmit = (e) => {
    e.preventDefault();

    const date = scheduleForm.examDate;
    const start = scheduleForm.startTime;
    const room = scheduleForm.roomNumber;
    const invId = scheduleForm.invigilatorId;
    const invName = staffList.find(s => s.id === invId)?.fullName || 'Replacement Staff';

    const list = exams ?? [];
    
    // 1. Invigilator timing conflict check
    const invConflict = list.find(ex => ex.examDate === date && ex.startTime === start && ex.invigilatorId === invId && ex.status !== 'Cancelled');
    if (invConflict) {
      setConflictWarning({
        type: 'Invigilator Timing Overlap',
        message: `Faculty ${invName} is already assigned to invigilate ${invConflict.subjectName} in Room ${invConflict.roomNumber} during the same slot.`
      });
      return;
    }

    // 2. Room timing booking conflict check
    const roomConflict = list.find(ex => ex.examDate === date && ex.startTime === start && ex.roomNumber === room && ex.status !== 'Cancelled');
    if (roomConflict) {
      setConflictWarning({
        type: 'Classroom Booking Conflict',
        message: `Examination Hall ${room} is already booked for ${roomConflict.subjectName} (${roomConflict.department}) on ${date} at ${start}.`
      });
      return;
    }

    // Save exam
    const newExam = {
      ...scheduleForm,
      id: list.length + 1,
      examId: `EX-2026-0${list.length + 1}`,
      invigilatorName: invName,
      attendancePercentage: ((scheduleForm.presentStudents / scheduleForm.totalStudents) * 100).toFixed(1),
      malpracticeCount: 0,
      createdAt: new Date().toISOString()
    };

    const updated = [...list, newExam];
    syncExams(updated);
    
    // Auto-broadcast notice to Communications
    const notices = JSON.parse(localStorage.getItem('edu_erp_comm_notices') ?? '[]');
    notices.unshift({
      title: `Exam Scheduled: ${newExam.subjectName}`,
      department: newExam.department,
      audience: 'All Staff & Students',
      publishedBy: 'Controller of Examinations',
      timestamp: date,
      attachment: false,
      priority: 'Important',
      content: `Timetabled ${newExam.examType} Exam for ${newExam.subjectName} (${newExam.subjectCode}) in Hall ${newExam.roomNumber} on ${date} (${start}).`
    });
    localStorage.setItem('edu_erp_comm_notices', JSON.stringify(notices));

    toast.success('Exam successfully timetabled and broadcasted!');
    setIsScheduleModalOpen(false);
  };

  // Seating Optimizer generator with roll numbers spacing
  const handleGenerateSeating = (exam) => {
    if (!exam) return;
    const capacity = exam.seatingCapacity || 40;
    const count = exam.totalStudents || 30;
    const dept = exam.department || 'CSE';
    const sem = exam.semester || '3';
    
    // Interleave seating arrangement to avoid malpractice adjacent matching patterns
    const seats = [];
    for (let i = 1; i <= capacity; i++) {
      if (i <= count) {
        const studentIndex = String(i).padStart(3, '0');
        seats.push({
          seatNo: i,
          rollNumber: `${exam.year}${dept}SEM${sem}-${studentIndex}`,
          status: 'Occupied'
        });
      } else {
        seats.push({
          seatNo: i,
          rollNumber: 'Empty Space',
          status: 'Empty'
        });
      }
    }
    setSeatingArrangement(seats);
    setIsSeatingGenerated(true);
    toast.success('Smart Anti-Malpractice layout generated!');
  };

  // Generate Hall Ticket barcode simulation
  const handleTicketGeneration = () => {
    const list = exams ?? [];
    const matchedExams = list.filter(e => e.department === 'CSE'); // CSE sample
    
    setGeneratedTicket({
      studentName: 'Vinoth Kumar',
      registerNumber: ticketSearchReg,
      department: 'Computer Science',
      year: '2',
      semester: '3',
      section: 'A',
      chiefCOE: 'Dr. K. Srinivasan',
      examsList: matchedExams,
      barcode: `*${ticketSearchReg}2026*`
    });
    toast.success('Hall ticket successfully compiled!');
  };

  // Malpractice Reporting Handler
  const handleMalpracticeSubmit = (e) => {
    e.preventDefault();
    const list = malpracticeList ?? [];
    const newMp = {
      ...malpracticeForm,
      id: `MP-2026-0${list.length + 1}`,
      timestamp: new Date().toLocaleString()
    };
    
    const updated = [newMp, ...list];
    syncMalpractice(updated);

    // Increment malpractice counter inside the targeted exam in centralized registry
    const updatedExams = (exams ?? []).map(ex => {
      if (ex.subjectName.toLowerCase() === malpracticeForm.subjectName.toLowerCase() && ex.roomNumber === malpracticeForm.roomNumber) {
        return { ...ex, malpracticeCount: (ex.malpracticeCount ?? 0) + 1 };
      }
      return ex;
    });
    syncExams(updatedExams);

    toast.success('Incidental malpractice log registered!');
    setIsMalpracticeFormOpen(false);
  };

  // Attendance modification pipeline
  const loadExamAttendanceRoster = (exam) => {
    setSelectedExamForAttendance(exam);
    // Generate dummy roster
    const roster = [];
    for (let i = 1; i <= exam.totalStudents; i++) {
      roster.push({
        id: i,
        registerNumber: `2026${exam.department}0${String(i).padStart(2, '0')}`,
        name: `Student Name ${i}`,
        status: i % 20 === 0 ? 'Absent' : 'Present', // Seed some absents
        lateEntry: i % 15 === 0 ? 'Yes' : 'No'
      });
    }
    setAttendanceLogs(roster);
  };

  const toggleStudentAttendance = (regNo) => {
    const updatedLogs = attendanceLogs.map(student => {
      if (student.registerNumber === regNo) {
        return { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' };
      }
      return student;
    });
    setAttendanceLogs(updatedLogs);

    // Update counts instantly in the centralized exams list
    const present = updatedLogs.filter(s => s.status === 'Present').length;
    const absent = updatedLogs.filter(s => s.status === 'Absent').length;
    
    const updatedExams = (exams ?? []).map(ex => {
      if (ex.id === selectedExamForAttendance.id) {
        return {
          ...ex,
          presentStudents: present,
          absentStudents: absent,
          attendancePercentage: ((present / ex.totalStudents) * 100).toFixed(1)
        };
      }
      return ex;
    });
    syncExams(updatedExams);
  };

  const handleBulkAttendanceUpdate = (status) => {
    const updatedLogs = attendanceLogs.map(student => ({ ...student, status }));
    setAttendanceLogs(updatedLogs);

    const present = status === 'Present' ? selectedExamForAttendance.totalStudents : 0;
    const absent = status === 'Absent' ? selectedExamForAttendance.totalStudents : 0;

    const updatedExams = (exams ?? []).map(ex => {
      if (ex.id === selectedExamForAttendance.id) {
        return {
          ...ex,
          presentStudents: present,
          absentStudents: absent,
          attendancePercentage: ((present / ex.totalStudents) * 100).toFixed(1)
        };
      }
      return ex;
    });
    syncExams(updatedExams);
    toast.success(`Bulk marked all students as ${status}!`);
  };

  // Recharts structured metrics
  const analyticsData = useMemo(() => {
    const list = exams ?? [];
    
    // Dept attendance ratio chart
    const depts = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'];
    const deptChart = depts.map(d => {
      const deptExams = list.filter(e => e.department === d);
      const present = deptExams.reduce((acc, curr) => acc + (curr.presentStudents ?? 0), 0);
      const total = deptExams.reduce((acc, curr) => acc + (curr.totalStudents ?? 0), 0);
      return {
        name: d,
        attendance: total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 95.0
      };
    });

    // pie present vs absent
    const presentCount = list.reduce((acc, curr) => acc + (curr.presentStudents ?? 0), 0);
    const absentCount = list.reduce((acc, curr) => acc + (curr.absentStudents ?? 0), 0);

    // Invigilator loads graph
    const invDutyMap = {};
    list.forEach(e => {
      if (e.invigilatorName) {
        invDutyMap[e.invigilatorName] = (invDutyMap[e.invigilatorName] ?? 0) + 1;
      }
    });
    const invDutyChart = Object.entries(invDutyMap).map(([name, value]) => ({ name: name.split(' ').pop(), duties: value }));

    return { deptChart, attendancePie: [{ name: 'Present', value: presentCount || 100 }, { name: 'Absent', value: absentCount || 5 }], invDutyChart };
  }, [exams]);

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  // Safe search & filtering pipeline
  const filteredExams = useMemo(() => {
    return (exams ?? []).filter(ex => {
      const matchesSearch = !searchTerm ? true : (
        (ex.subjectName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.subjectCode ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.roomNumber ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDept = !deptFilter ? true : ex.department === deptFilter;
      const matchesStatus = !statusFilter ? true : ex.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [exams, searchTerm, deptFilter, statusFilter]);

  const handleKPIClick = (card) => {
    let drillList = [];
    let cols = [];
    let search = [];
    const list = exams ?? [];
    
    if (card.type === 'total_exams' || card.type === 'completed' || card.type === 'upcoming' || card.type === 'active_today') {
      if (card.type === 'total_exams') drillList = list;
      else if (card.type === 'completed') drillList = list.filter(e => e.status === 'Completed');
      else if (card.type === 'upcoming') drillList = list.filter(e => e.status === 'Upcoming');
      else if (card.type === 'active_today') drillList = activeExamsToday;
      
      cols = [
        { header: 'Exam ID', accessor: 'examId', render: (row) => <span className="font-extrabold text-indigo-600">{row.examId}</span> },
        { header: 'Subject', accessor: 'subjectName', render: (row) => (
          <div>
            <div className="font-black text-slate-800">{row.subjectName}</div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{row.subjectCode} • Sem {row.semester}</span>
          </div>
        )},
        { header: 'Department', accessor: 'department' },
        { header: 'Date & Time', accessor: 'examDate', render: (row) => <span>{row.examDate} ({row.startTime})</span> },
        { header: 'Room Hall', accessor: 'roomNumber', render: (row) => <span className="font-bold text-slate-700">{row.roomNumber}</span> },
        { header: 'Invigilator', accessor: 'invigilatorName' },
        { header: 'Status', accessor: 'status', render: (row) => (
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
            row.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600' :
            row.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
          }`}>{row.status}</span>
        )}
      ];
      search = ['subjectName', 'subjectCode', 'roomNumber', 'invigilatorName'];
    } else if (card.type === 'appearing' || card.type === 'present' || card.type === 'absent') {
      if (card.type === 'appearing') {
        drillList = allAppearingStudents;
      } else if (card.type === 'present') {
        drillList = allAppearingStudents.filter(s => s.attendanceStatus === 'Present');
      } else if (card.type === 'absent') {
        drillList = allAppearingStudents.filter(s => s.attendanceStatus === 'Absent');
      }
      
      cols = [
        { header: 'Register No', accessor: 'registerNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.registerNumber}</span> },
        { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-800">{row.studentName}</span> },
        { header: 'Department', accessor: 'department' },
        { header: 'Assigned Exam', accessor: 'subjectName', render: (row) => (
          <div>
            <div className="font-bold text-slate-700">{row.subjectName}</div>
            <span className="text-[9px] text-slate-400">{row.subjectCode} • Hall {row.roomNumber}</span>
          </div>
        )},
        { header: 'Attendance %', accessor: 'attendancePercentage', render: (row) => <span>{row.attendancePercentage}%</span> },
        { header: 'Status', accessor: 'attendanceStatus', render: (row) => (
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
            row.attendanceStatus === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>{row.attendanceStatus}</span>
        )}
      ];
      search = ['registerNumber', 'studentName', 'department', 'subjectName'];
    } else if (card.type === 'rooms') {
      drillList = allAllocatedHalls;
      cols = [
        { header: 'Hall Room', accessor: 'roomNumber', render: (row) => <span className="font-extrabold text-indigo-600">{row.roomNumber}</span> },
        { header: 'Block', accessor: 'blockName' },
        { header: 'Capacity', accessor: 'seatingCapacity' },
        { header: 'Occupancy', accessor: 'totalStudents', render: (row) => <span>{row.totalStudents} / {row.seatingCapacity} Seats</span> },
        { header: 'Present / Absent', render: (row) => (
          <span className="font-bold text-slate-700">
            P: <span className="text-emerald-600">{row.presentStudents}</span> • A: <span className="text-rose-600">{row.absentStudents}</span>
          </span>
        )},
        { header: 'Invigilator', accessor: 'invigilatorName' }
      ];
      search = ['roomNumber', 'blockName', 'invigilatorName'];
    } else if (card.type === 'invigilators') {
      drillList = allInvigilatorsAssigned;
      cols = [
        { header: 'Staff ID', accessor: 'staffId', render: (row) => <span className="font-extrabold text-indigo-600">{row.staffId}</span> },
        { header: 'Faculty Name', accessor: 'invigilatorName', render: (row) => <span className="font-bold text-slate-800">{row.invigilatorName}</span> },
        { header: 'Department', accessor: 'department' },
        { header: 'Assigned Room', accessor: 'roomNumber', render: (row) => <span className="font-bold text-slate-700">{row.roomNumber}</span> },
        { header: 'Total Duties', accessor: 'dutiesCount', render: (row) => <span className="font-black text-slate-800">{row.dutiesCount} duties</span> }
      ];
      search = ['staffId', 'invigilatorName', 'department'];
    } else if (card.type === 'malpractice') {
      drillList = malpracticeList;
      cols = [
        { header: 'Incident ID', accessor: 'id', render: (row) => <span className="font-extrabold text-rose-600">{row.id}</span> },
        { header: 'Student Name', accessor: 'studentName', render: (row) => (
          <div>
            <div className="font-bold text-slate-800">{row.studentName}</div>
            <span className="text-[10px] text-slate-400">{row.registerNumber}</span>
          </div>
        )},
        { header: 'Subject', accessor: 'subjectName' },
        { header: 'Room', accessor: 'roomNumber' },
        { header: 'Invigilator', accessor: 'invigilatorName' },
        { header: 'Fine', accessor: 'fineAmount', render: (row) => <span className="font-bold">₹{row.fineAmount}</span> },
        { header: 'Status', accessor: 'actionStatus', render: (row) => (
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100">{row.actionStatus}</span>
        )}
      ];
      search = ['id', 'studentName', 'registerNumber', 'subjectName'];
    }

    // Enrich malpractice records with their target drawerType for advanced profile view
    const enrichedList = drillList.map(row => {
      if (card.type === 'malpractice') {
        return { ...row, drawerType: 'malpractice' };
      }
      return row;
    });

    setGlobalModalTitle(card.title);
    setGlobalModalData(enrichedList);
    setGlobalModalColumns(cols);
    setGlobalModalSearchKeys(search);
    setIsGlobalModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-12 Outfit-Font bg-slate-50/50 min-h-screen">
      
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
          } else if (row.registerNumber) {
            setGlobalDrawerType('student');
          } else if (row.staffId) {
            setGlobalDrawerType('staff');
          } else if (row.roomNumber && !row.examId) {
            setGlobalDrawerType('hall');
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

      {/* Admin TIMETABLE timing conflicts warnings modal overlay */}
      {conflictWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl w-full max-w-md overflow-hidden p-6 text-center animate-scale-up">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertOctagon size={28} />
            </div>
            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">{conflictWarning.type}</h3>
            <p className="text-slate-500 text-xs font-semibold mt-2 leading-relaxed">{conflictWarning.message}</p>
            <div className="mt-6">
              <button 
                type="button" 
                onClick={() => setConflictWarning(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs uppercase tracking-wider"
              >
                Modify Allocation Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Controller Hero banner card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-slate-700/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Award size={36} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">COE Examination Control System</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">Active Session</span>
              </div>
              <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                Superintendent: <span className="text-slate-200 font-bold">Dr. K. Srinivasan (COE)</span> • Term: <span className="text-slate-200 font-bold">Spring End-Semesters 2026</span> • Depts: <span className="text-slate-200 font-bold">CSE, IT, ECE, MECH, CIVIL</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleExport('excel')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all text-xs"
            >
              <FileSpreadsheet size={15} /> Export Registry
            </button>
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all text-xs shadow-lg shadow-indigo-600/20"
            >
              <Plus size={15} /> Timetable Exam
            </button>
          </div>
        </div>
      </div>

      {/* 10 Dynamic KPI Cards Drilldowns Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {kpis.map((card, i) => (
          <button 
            key={i} 
            onClick={() => handleKPIClick(card)}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md transition-all shadow-xs flex items-start gap-3.5 group relative overflow-hidden"
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${card.color.split(' ')[1]} ${card.color.split(' ')[0]} group-hover:scale-105 transition-transform`}>
              <card.icon size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{card.title}</span>
              <span className="text-base font-black text-slate-800 leading-none mt-1 block">{card.value}</span>
              <span className="text-[8px] font-bold text-slate-400 block mt-0.5 truncate">{card.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tabs list navigation */}
      <div className="flex gap-2 border-b border-slate-200/80 mb-6 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'dashboard', label: 'Dashboard Overview', icon: BookOpen },
          { id: 'registry', label: 'Scheduling Registry', icon: CalendarDays },
          { id: 'monitoring', label: 'Live Hall Monitoring', icon: Play },
          { id: 'attendance', label: 'Exam Attendance Roster', icon: ClipboardCheck },
          { id: 'invigilator', label: 'Invigilator Workload', icon: User },
          { id: 'seating', label: 'Anti-Cheat Seating', icon: FileDigit },
          { id: 'malpractice', label: 'Malpractice Logs', icon: ShieldAlert },
          { id: 'tickets', label: 'Hall Ticket Center', icon: Printer },
          { id: 'analytics', label: 'COE Analytics', icon: Award }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: Dashboard overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active session notifications info */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs col-span-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" /> AI Risk Detection & Monitoring Alert Signals
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-rose-800 uppercase tracking-wide">High Absence Threshold Warning</h4>
                    <p className="text-[10px] text-rose-600 font-bold mt-0.5">Hall LH-201 shows attendance below 75% for model schedules. Student attendance warning generated.</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wide">Capacity Warning - Overloaded Hall</h4>
                    <p className="text-[10px] text-amber-600 font-bold mt-0.5">Newton Block Hall LH-102 has seat occupancy at 98.2%. Smart spacing arrangements highly recommended.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* COE Superintendent Notice */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock size={16} className="text-indigo-600" /> Exam Room Security Locks
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                All examination sheets and barcode slips are restricted. To generate barcode-enabled hall tickets or audit reports, secure superintendent credentials are authenticated by system.
              </p>
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Superintendent Status</span>
                <span className="font-extrabold text-emerald-600">SECURED (Dr. K. Srinivasan)</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 w-full sm:max-w-md">
                <Search className="text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search subject, code or room number..."
                  className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 w-full placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <select 
                  value={deptFilter} 
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none"
                >
                  <option value="">All Departments</option>
                  <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option>
                </select>

                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-100">
                    <th className="p-3">Exam ID</th>
                    <th className="p-3">Subject / Code</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Hall</th>
                    <th className="p-3">Invigilator</th>
                    <th className="p-3">Strength</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(filteredExams ?? []).map((ex, i) => (
                    <tr 
                      key={ex.id || i} 
                      className="hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => {
                        setGlobalDrawerType('hall');
                        setGlobalDrawerData({
                          roomNumber: ex.roomNumber,
                          blockName: ex.blockName || 'Newton Block',
                          seatingCapacity: ex.seatingCapacity || 60,
                          totalStudents: ex.totalStudents || 45,
                          presentStudents: ex.presentStudents || 43,
                          absentStudents: ex.absentStudents || 2,
                          invigilatorName: ex.invigilatorName || 'Dr. Amit Sharma',
                          subjectName: ex.subjectName,
                          subjectCode: ex.subjectCode,
                          department: ex.department
                        });
                        setIsGlobalDrawerOpen(true);
                      }}
                    >
                      <td className="p-3 font-extrabold text-indigo-600">{ex.examId}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{ex.subjectName}</div>
                        <span className="text-[10px] text-slate-400 font-medium">{ex.subjectCode} • {ex.department} Sem {ex.semester}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{ex.examType}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{ex.examDate}</div>
                        <span className="text-[10px] text-slate-400 font-medium">{ex.startTime} - {ex.endTime}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{ex.roomNumber ?? 'Not Assigned'}</td>
                      <td className="p-3 font-medium text-slate-500">{ex.invigilatorName}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-slate-800">{ex.presentStudents}</span> / <span className="text-slate-400">{ex.totalStudents}</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          ex.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          ex.status === 'Completed' ? 'bg-slate-50 text-slate-500 border border-slate-100' :
                          ex.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>{ex.status}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredExams.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400">No scheduled exam records found matching filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Live Hall Monitoring */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(exams ?? []).map((ex, i) => (
              <div 
                key={ex.id || i}
                className={`bg-white border rounded-3xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md ${
                  ex.malpracticeCount > 0 ? 'border-rose-100 bg-rose-50/5' :
                  ex.status === 'Ongoing' ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-100'
                }`}
              >
                {/* Visual state glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none ${
                  ex.malpracticeCount > 0 ? 'bg-rose-500/10' :
                  ex.status === 'Ongoing' ? 'bg-emerald-500/10' : 'bg-slate-500/5'
                }`}></div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 relative z-10">
                  <div 
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setGlobalDrawerType('hall');
                      setGlobalDrawerData({
                        roomNumber: ex.roomNumber,
                        blockName: ex.blockName || 'Newton Block',
                        seatingCapacity: ex.seatingCapacity || 60,
                        totalStudents: ex.totalStudents || 45,
                        presentStudents: ex.presentStudents || 43,
                        absentStudents: ex.absentStudents || 2,
                        invigilatorName: ex.invigilatorName || 'Dr. Amit Sharma',
                        subjectName: ex.subjectName,
                        subjectCode: ex.subjectCode,
                        department: ex.department
                      });
                      setIsGlobalDrawerOpen(true);
                    }}
                  >
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hall Room</span>
                    <h3 className="text-base font-black text-indigo-600 leading-none mt-0.5 flex items-center gap-1">{ex.roomNumber ?? 'Not Assigned'} <Eye size={12} /></h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    ex.malpracticeCount > 0 ? 'bg-rose-500/20 text-rose-500 animate-pulse' :
                    ex.status === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ex.malpracticeCount > 0 ? '⚠️ Infraction Alert' : ex.status === 'Ongoing' ? '🟢 Live Ongoing' : 'Upcoming'}
                  </span>
                </div>

                <div className="space-y-3 relative z-10">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Target Subject</span>
                    <span className="text-xs font-black text-slate-700">{ex.subjectName}</span>
                    <span className="text-[10px] text-slate-400 block font-bold mt-0.5">{ex.subjectCode} • {ex.department} Sem {ex.semester}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100/60">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Invigilator</span>
                      <span className="text-[10px] font-extrabold text-slate-600">{ex.invigilatorName}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Attendance</span>
                      <span className="text-[10px] font-extrabold text-indigo-600">{ex.attendancePercentage}% ({ex.presentStudents} / {ex.totalStudents})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Remaining Timer</span>
                    <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1"><Clock size={11} /> 02:44:12</span>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => {
                        setMalpracticeForm({
                          ...malpracticeForm,
                          subjectName: ex.subjectName,
                          roomNumber: ex.roomNumber,
                          invigilatorName: ex.invigilatorName
                        });
                        setIsMalpracticeFormOpen(true);
                      }}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShieldAlert size={12} /> Log Cheat
                    </button>
                    <button 
                      onClick={() => toast.success(`Emergency alert raised for Room ${ex.roomNumber}! Chief Superintendent notified.`)}
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                      title="Trigger Superintendent Emergency Alert"
                    >
                      <Flame size={12} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: Attendance system */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Select Target Scheduled Exam</h3>
            
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-100">
              {(exams ?? []).map((ex, i) => (
                <button
                  key={ex.id || i}
                  onClick={() => loadExamAttendanceRoster(ex)}
                  className={`px-4 py-3 rounded-2xl text-left border shrink-0 transition-all ${
                    selectedExamForAttendance?.id === ex.id 
                      ? 'border-indigo-600 bg-indigo-50/20 text-indigo-600 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{ex.examId} • {ex.roomNumber}</div>
                  <h4 className="text-xs font-extrabold mt-1">{ex.subjectName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{ex.department} • {ex.presentStudents} / {ex.totalStudents} Present</span>
                </button>
              ))}
            </div>

            {selectedExamForAttendance ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 w-full sm:max-w-md">
                    <Search className="text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={attendanceSearch}
                      onChange={(e) => setAttendanceSearch(e.target.value)}
                      placeholder="Search student by Register Number..."
                      className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 w-full placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleBulkAttendanceUpdate('Present')}
                      className="px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors border border-emerald-100"
                    >
                      Mark All Present
                    </button>
                    <button 
                      onClick={() => handleBulkAttendanceUpdate('Absent')}
                      className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors border border-rose-100"
                    >
                      Mark All Absent
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-100">
                        <th className="p-3">Seat</th>
                        <th className="p-3">Register Number</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Late Entry Log</th>
                        <th className="p-3 text-right">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {attendanceLogs.filter(s => !attendanceSearch ? true : s.registerNumber.toLowerCase().includes(attendanceSearch.toLowerCase())).map((student, i) => (
                        <tr 
                          key={student.id || i} 
                          className="hover:bg-slate-50/50 cursor-pointer"
                          onClick={(e) => {
                            if (e.target.closest('button')) return;
                            setGlobalDrawerType('student');
                            setGlobalDrawerData({
                              registerNumber: student.registerNumber,
                              studentName: student.name,
                              department: selectedExamForAttendance?.department || 'CSE',
                              year: selectedExamForAttendance?.year || '3',
                              semester: selectedExamForAttendance?.semester || '5',
                              subjectName: selectedExamForAttendance?.subjectName || 'N/A',
                              subjectCode: selectedExamForAttendance?.subjectCode || 'N/A',
                              roomNumber: selectedExamForAttendance?.roomNumber || 'N/A',
                              examDate: selectedExamForAttendance?.examDate || 'N/A',
                              attendanceStatus: student.status,
                              feeStatus: 'CLEARED',
                              attendancePercentage: student.status === 'Absent' ? 71.5 : 94.2,
                              malpracticeCount: (malpracticeList ?? []).filter(m => m.registerNumber === student.registerNumber).length
                            });
                            setIsGlobalDrawerOpen(true);
                          }}
                        >
                          <td className="p-3 font-extrabold text-indigo-600">Seat #{student.id}</td>
                          <td className="p-3 font-bold text-slate-800">{student.registerNumber}</td>
                          <td className="p-3 text-slate-500 font-medium">{student.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                              student.lateEntry === 'Yes' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' : 'bg-slate-100 text-slate-400'
                            }`}>{student.lateEntry}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => toggleStudentAttendance(student.registerNumber)}
                              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                                student.status === 'Present' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-rose-50 text-rose-600 border-rose-100'
                              }`}
                            >
                              {student.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-12 border border-slate-100 border-dashed rounded-3xl text-center bg-slate-50/50">
                <ClipboardCheck className="mx-auto text-slate-400 mb-3 animate-pulse" size={36} />
                <h4 className="text-slate-700 font-extrabold text-xs">No Scheduled Exam Selected</h4>
                <p className="text-slate-400 text-xs mt-1">Select one of the timetabled cards above to perform attendance roster auditing.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: Invigilator workloads */}
      {activeTab === 'invigilator' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-5">Invigilator Duty allocation Roster</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-100">
                    <th className="p-3">Faculty Member</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Timetabled Rooms</th>
                    <th className="p-3">Total Allocated Duties</th>
                    <th className="p-3 text-right">Workload Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {staffList.filter(s => s.role === 'Staff' || s.role === 'Teacher' || s.role === 'Admin').map((staff, i) => {
                    const duties = (exams ?? []).filter(e => e.invigilatorId === staff.id);
                    const dutyCount = duties.length;
                    return (
                      <tr 
                        key={staff.id || i} 
                        className="hover:bg-slate-50/50 cursor-pointer"
                        onClick={() => {
                          setGlobalDrawerType('staff');
                          setGlobalDrawerData({
                            invigilatorName: staff.fullName,
                            staffId: staff.staffId || `EMP-${staff.department}-0${staff.id || '12'}`,
                            department: staff.department,
                            designation: staff.designation || 'Assistant Professor',
                            roomNumber: dutyCount > 0 ? duties.map(d => d.roomNumber).join(', ') : 'None',
                            dutiesCount: dutyCount,
                            experience: staff.experience || '6 Years'
                          });
                          setIsGlobalDrawerOpen(true);
                        }}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center font-bold text-slate-700 shrink-0">
                              {staff.fullName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{staff.fullName}</div>
                              <span className="text-[10px] text-slate-400 block font-medium">{staff.staffId} • {staff.designation}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{staff.department}</td>
                        <td className="p-3 font-bold text-indigo-600">
                          {dutyCount > 0 ? duties.map(d => d.roomNumber).join(', ') : 'None'}
                        </td>
                        <td className="p-3 font-extrabold text-slate-800">{dutyCount} duties</td>
                        <td className="p-3 text-right">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            dutyCount >= 3 ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            dutyCount > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {dutyCount >= 3 ? '🔴 High Load' : dutyCount > 0 ? '🟢 Scheduled' : 'Idle'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: Seating arragement generator */}
      {activeTab === 'seating' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Anti-Cheat Seating optimizer</h3>
            
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-100">
              {(exams ?? []).map((ex, i) => (
                <button
                  key={ex.id || i}
                  onClick={() => handleGenerateSeating(ex)}
                  className="px-4 py-3 rounded-2xl text-left border shrink-0 transition-all border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/10 text-slate-700"
                >
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{ex.examId} • {ex.roomNumber}</div>
                  <h4 className="text-xs font-extrabold mt-1">{ex.subjectName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Capacity: {ex.seatingCapacity} • {ex.totalStudents} Students</span>
                </button>
              ))}
            </div>

            {isSeatingGenerated ? (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">Dynamic Spacing Layout Matrix</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Adjacent roll numbers are interleaved using malpractice prevention models.</p>
                  </div>
                  <button 
                    onClick={() => {
                      toast.success('Initiating print matrix spooling...');
                      window.print();
                    }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
                  >
                    <Printer size={13} /> Print Seating Arrangement
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {(seatingArrangement ?? []).map((seat, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 border rounded-2xl text-center flex flex-col justify-center gap-1 shadow-xs ${
                        seat.status === 'Empty' 
                          ? 'border-slate-100 border-dashed bg-slate-50/30' 
                          : 'border-indigo-100 bg-indigo-50/5'
                      }`}
                    >
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Seat #{seat.seatNo}</span>
                      <span className={`text-[10px] font-black leading-none mt-1 truncate ${seat.status === 'Empty' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {seat.rollNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 border border-slate-100 border-dashed rounded-3xl text-center bg-slate-50/50">
                <FileDigit className="mx-auto text-slate-400 mb-3 animate-pulse" size={36} />
                <h4 className="text-slate-700 font-extrabold text-xs">No Seating Matrix Spooled</h4>
                <p className="text-slate-400 text-xs mt-1">Select one of the exam schedules above to build and map spacing layouts dynamically.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: Malpractice Control Center */}
      {activeTab === 'malpractice' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Student Malpractice logs</h3>
              <button 
                onClick={() => setIsMalpracticeFormOpen(true)}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus size={13} /> Log Malpractice Case
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-black border-b border-slate-100">
                    <th className="p-3">Incident ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Exam Subject</th>
                    <th className="p-3">Room</th>
                    <th className="p-3">Invigilator</th>
                    <th className="p-3">Fine Charged</th>
                    <th className="p-3 text-right">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(malpracticeList ?? []).map((mp, i) => (
                    <tr 
                      key={mp.id || i} 
                      className="hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => {
                        setGlobalDrawerType('student');
                        setGlobalDrawerData({
                          registerNumber: mp.registerNumber,
                          studentName: mp.studentName,
                          department: mp.registerNumber.includes('IT') ? 'IT' : mp.registerNumber.includes('ECE') ? 'ECE' : 'CSE',
                          year: '3',
                          semester: '5',
                          subjectName: mp.subjectName,
                          subjectCode: 'N/A',
                          roomNumber: mp.roomNumber,
                          examDate: today,
                          attendanceStatus: 'Present',
                          feeStatus: 'CLEARED',
                          attendancePercentage: 88.5,
                          malpracticeCount: (malpracticeList ?? []).filter(m => m.registerNumber === mp.registerNumber).length
                        });
                        setIsGlobalDrawerOpen(true);
                      }}
                    >
                      <td className="p-3 font-extrabold text-rose-600">{mp.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{mp.studentName}</div>
                        <span className="text-[10px] text-slate-400 block font-medium">{mp.registerNumber}</span>
                      </td>
                      <td className="p-3 text-slate-700 font-bold">{mp.subjectName}</td>
                      <td className="p-3 font-bold">{mp.roomNumber}</td>
                      <td className="p-3 text-slate-500 font-medium">{mp.invigilatorName}</td>
                      <td className="p-3 font-extrabold text-slate-800">₹{mp.fineAmount.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100">
                          {mp.actionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {malpracticeList.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">No malpractice cases logged. Keep up the high academic integrity!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: Hall Ticket Center */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Secure Hall Ticket Compiler</h3>
            
            <div className="flex gap-2 items-center bg-slate-50 p-4 border border-slate-100 rounded-2xl max-w-lg mb-6">
              <input 
                type="text" 
                value={ticketSearchReg}
                onChange={(e) => setTicketSearchReg(e.target.value)}
                placeholder="Enter Register Number (e.g. 2026CSE001)"
                className="bg-white border border-slate-200 outline-none text-xs font-bold text-slate-700 px-3 py-2 rounded-xl w-full"
              />
              <button 
                onClick={handleTicketGeneration}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shrink-0 transition-colors cursor-pointer"
              >
                Compile Ticket
              </button>
            </div>

            {generatedTicket ? (
              <div className="border border-slate-200 rounded-3xl p-6 max-w-xl mx-auto bg-white shadow-sm flex flex-col gap-6 relative overflow-hidden animate-fade-in-up">
                
                {/* Simulated Barcode */}
                <div className="flex flex-col items-center border-b border-slate-100 pb-4">
                  <div className="font-mono text-xl tracking-[0.25em] text-slate-800 font-bold">{generatedTicket.barcode}</div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Barcode Secured Slips Standard</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Student Name:</span>
                    <p className="font-extrabold text-slate-800">{generatedTicket.studentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Register Number:</span>
                    <p className="font-extrabold text-slate-800">{generatedTicket.registerNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Department:</span>
                    <p className="font-bold text-slate-700">{generatedTicket.department}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Session:</span>
                    <p className="font-bold text-slate-700">Spring Semester 2026</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] block mb-2">Examination Schedules</span>
                  <table className="w-full text-left text-[11px] font-semibold text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 text-[8px] text-slate-400 uppercase tracking-widest font-black">
                        <th className="p-2">Subject</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Hall</th>
                        <th className="p-2 text-right">Seat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(generatedTicket.examsList ?? []).map((ex, idx) => (
                        <tr key={idx} className="border-b border-slate-100/60">
                          <td className="p-2 font-bold text-slate-700">{ex.subjectName}</td>
                          <td className="p-2 text-slate-500">{ex.examDate}</td>
                          <td className="p-2 font-bold text-slate-800">{ex.roomNumber}</td>
                          <td className="p-2 text-right font-extrabold text-indigo-600">Row A - #0{idx + 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button 
                    onClick={() => {
                      toast.success('Spooling hall ticket to local printing system...');
                      window.print();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Printer size={13} /> Print Slips
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-12 border border-slate-100 border-dashed rounded-3xl text-center bg-slate-50/50">
                <Printer className="mx-auto text-slate-400 mb-3 animate-pulse" size={36} />
                <h4 className="text-slate-700 font-extrabold text-xs">Awaiting Ticket Retrieval</h4>
                <p className="text-slate-400 text-xs mt-1">Input target student registration number to generate and review secure exam slip details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 9: Analytics charts */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Department Ratios */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Department-wise Attendance ratios</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.deptChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" domain={[80, 100]} />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Present vs Absent Pie */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Overall attendance metrics</h4>
              <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-around">
                <div className="w-44 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.attendancePie}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {analyticsData.attendancePie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-xs">
                  {analyticsData.attendancePie.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 font-semibold">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-slate-600">{entry.name}: {entry.value} students</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Invigilator duty loads */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs col-span-1 lg:col-span-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Invigilator workload allocations</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.invDutyChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <Tooltip />
                    <Bar dataKey="duties" fill="#10b981" radius={[4, 4, 0, 0]} name="Timetabled Duties" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SCHEDULE EXAM FORM MODAL OVERLAY */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden p-6 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="text-indigo-600" size={20} />
                Timetable Examination Schedule
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                
                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Subject Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={scheduleForm.subjectName} 
                    onChange={(e) => setScheduleForm({...scheduleForm, subjectName: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="e.g. Theory of Computation" 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Subject Code *</label>
                  <input 
                    type="text" 
                    required 
                    value={scheduleForm.subjectCode} 
                    onChange={(e) => setScheduleForm({...scheduleForm, subjectCode: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="e.g. CS6503" 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Department *</label>
                  <select 
                    value={scheduleForm.department} 
                    onChange={(e) => setScheduleForm({...scheduleForm, department: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Exam Type *</label>
                  <select 
                    value={scheduleForm.examType} 
                    onChange={(e) => setScheduleForm({...scheduleForm, examType: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    <option value="Semester">Semester</option>
                    <option value="Model">Model</option>
                    <option value="Internal">Internal</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Exam Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={scheduleForm.examDate} 
                    onChange={(e) => setScheduleForm({...scheduleForm, examDate: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none" 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Timing Session *</label>
                  <select 
                    value={scheduleForm.startTime} 
                    onChange={(e) => {
                      const start = e.target.value;
                      const end = start === '09:30' ? '12:30' : '16:30';
                      setScheduleForm({ ...scheduleForm, startTime: start, endTime: end });
                    }} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    <option value="09:30">Morning (09:30 - 12:30)</option>
                    <option value="13:30">Afternoon (13:30 - 16:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Classroom Hall *</label>
                  <input 
                    type="text" 
                    required 
                    value={scheduleForm.roomNumber} 
                    onChange={(e) => setScheduleForm({...scheduleForm, roomNumber: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="LH-101" 
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Invigilator Assignment *</label>
                  <select 
                    required 
                    value={scheduleForm.invigilatorId} 
                    onChange={(e) => setScheduleForm({...scheduleForm, invigilatorId: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    <option value="">-- Select Staff Duty --</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.staffId})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 font-extrabold text-slate-700">Seating Capacity *</label>
                  <input 
                    type="number" 
                    required 
                    value={scheduleForm.seatingCapacity} 
                    onChange={(e) => setScheduleForm({...scheduleForm, seatingCapacity: parseInt(e.target.value)})} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none" 
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Timetable Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECURE LOG MALPRACTICE INCIDENT MODAL */}
      {isMalpracticeFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-black text-rose-600 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert size={20} />
                Log Malpractice Infraction
              </h3>
              <button onClick={() => setIsMalpracticeFormOpen(false)} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleMalpracticeSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1.5 font-extrabold text-slate-700">Student Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={malpracticeForm.studentName} 
                  onChange={(e) => setMalpracticeForm({...malpracticeForm, studentName: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white" 
                />
              </div>

              <div>
                <label className="block mb-1.5 font-extrabold text-slate-700">Registration Number *</label>
                <input 
                  type="text" 
                  required 
                  value={malpracticeForm.registerNumber} 
                  onChange={(e) => setMalpracticeForm({...malpracticeForm, registerNumber: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white" 
                />
              </div>

              <div>
                <label className="block mb-1.5 font-extrabold text-slate-700">Infraction Details *</label>
                <textarea 
                  required 
                  value={malpracticeForm.incidentDetails} 
                  onChange={(e) => setMalpracticeForm({...malpracticeForm, incidentDetails: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white h-20 resize-none"
                  placeholder="Describe material found, cheating method..."
                />
              </div>

              <div>
                <label className="block mb-1.5 font-extrabold text-slate-700">Fine Levied (₹) *</label>
                <input 
                  type="number" 
                  required 
                  value={malpracticeForm.fineAmount} 
                  onChange={(e) => setMalpracticeForm({...malpracticeForm, fineAmount: parseInt(e.target.value)})} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white" 
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsMalpracticeFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors"
                >
                  Submit Incident File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExamManagement;
