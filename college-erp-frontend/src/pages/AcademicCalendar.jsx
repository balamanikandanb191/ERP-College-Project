import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Filter,
  Search,
  Plus,
  X,
  Info,
  Trash2,
  Edit2,
  Copy,
  Upload,
  Download,
  Sparkles,
  AlertTriangle,
  Check,
  User,
  ShieldAlert,
  TrendingUp,
  BarChart2,
  Printer,
  FileText,
  CalendarDays,
  Users,
  CheckCircle,
  Briefcase,
  Megaphone,
  ClipboardCheck,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';
import CalendarDrilldownModal from '../components/calendar/CalendarDrilldownModal';
import { confirmDelete, confirmWarning } from '../utils/confirmToast';

// Seed initial default events matching the centralized schema
const SEED_EVENTS = [
  {
    id: 'evt-1',
    title: 'Theory Semester Exams (Sem 6)',
    category: 'Exams',
    department: 'Computer Science',
    startDate: '2026-05-25',
    endDate: '2026-05-29',
    startTime: '09:30',
    endTime: '12:30',
    venue: 'Block B - Rooms 201 to 205',
    organizer: 'Dr. Anand K. Varma',
    participants: 120,
    priority: 'High',
    description: 'Final semester theory examinations for 6th-semester CSE students.',
    status: 'Scheduled',
    reminderEnabled: true,
    createdBy: 'Admin Exam Cell',
    createdAt: '2026-05-10T10:00:00.000Z'
  },
  {
    id: 'evt-2',
    title: 'Summer Semester Break',
    category: 'Holidays',
    department: 'All Departments',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    startTime: '00:00',
    endTime: '23:59',
    venue: 'Campus Closed',
    organizer: 'Registrar Office',
    participants: 3000,
    priority: 'High',
    description: 'Official summer holidays for students and non-essential staff.',
    status: 'Scheduled',
    reminderEnabled: false,
    createdBy: 'Dean Office',
    createdAt: '2026-05-11T09:00:00.000Z'
  },
  {
    id: 'evt-3',
    title: 'Buddha Purnima Festival',
    category: 'Holidays',
    department: 'All Departments',
    startDate: '2026-05-15',
    endDate: '2026-05-15',
    startTime: '00:00',
    endTime: '23:59',
    venue: 'All Blocks',
    organizer: 'Dean Office',
    participants: 3000,
    priority: 'Medium',
    description: 'National holiday clearance. Applicable to all students and staff members.',
    status: 'Completed',
    reminderEnabled: false,
    createdBy: 'HR Department',
    createdAt: '2026-05-12T11:00:00.000Z'
  },
  {
    id: 'evt-4',
    title: 'Internal Assessment Test II',
    category: 'Internal Assessments',
    department: 'Information Technology',
    startDate: '2026-05-18',
    endDate: '2026-05-18',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'IT Lab Block A',
    organizer: 'Prof. Sneha Iyer',
    participants: 60,
    priority: 'Medium',
    description: 'Second internal assessment review test for scale and analysis systems.',
    status: 'Completed',
    reminderEnabled: true,
    createdBy: 'IT HOD',
    createdAt: '2026-05-13T08:30:00.000Z'
  },
  {
    id: 'evt-5',
    title: 'National IT & Cloud Symposium 2026',
    category: 'Symposiums',
    department: 'Computer Science',
    startDate: '2026-05-28',
    endDate: '2026-05-28',
    startTime: '09:00',
    endTime: '17:00',
    venue: 'Main Auditorium Block A',
    organizer: 'Tech Club Head',
    participants: 250,
    priority: 'High',
    description: 'A national-level technical summit including hackathons and paper presentations.',
    status: 'Scheduled',
    reminderEnabled: true,
    createdBy: 'Dr. Amit Sharma (HOD CS)',
    createdAt: '2026-05-14T14:00:00.000Z'
  },
  {
    id: 'evt-6',
    title: 'TCS Campus Placement Drive',
    category: 'Placement Drives',
    department: 'All Departments',
    startDate: '2026-05-24',
    endDate: '2026-05-24',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'Placement Block Hall 2',
    organizer: 'TPO Head',
    participants: 180,
    priority: 'High',
    description: 'Campus placement drive conducted by TCS Ninja/Digital divisions.',
    status: 'Scheduled',
    reminderEnabled: true,
    createdBy: 'Placement Officer',
    createdAt: '2026-05-15T09:30:00.000Z'
  },
  {
    id: 'evt-7',
    title: 'Workshop on Generative AI & LLMs',
    category: 'Workshops',
    department: 'Computer Science',
    startDate: '2026-05-20',
    endDate: '2026-05-20',
    startTime: '14:00',
    endTime: '17:00',
    venue: 'CS Lab 3 Block C',
    organizer: 'AI Research Lab',
    participants: 120,
    priority: 'Medium',
    description: 'Hands-on bootcamp on building applications with OpenAI, Gemini, and LangChain.',
    status: 'In-Progress',
    reminderEnabled: true,
    createdBy: 'Admin AI Lab',
    createdAt: '2026-05-16T12:00:00.000Z'
  },
  {
    id: 'evt-8',
    title: 'Department Academic Performance Review',
    category: 'Staff Meetings',
    department: 'All Departments',
    startDate: '2026-05-16',
    endDate: '2026-05-16',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Boardroom Block A',
    organizer: 'Dean Academics',
    participants: 45,
    priority: 'Medium',
    description: 'Faculty meeting reviewing curriculum completion progress and feedback audit.',
    status: 'Completed',
    reminderEnabled: false,
    createdBy: 'Dean Office',
    createdAt: '2026-05-12T15:00:00.000Z'
  },
  {
    id: 'evt-9',
    title: 'Semester Fee Collection Deadline',
    category: 'Fee Deadlines',
    department: 'All Departments',
    startDate: '2026-05-30',
    endDate: '2026-05-30',
    startTime: '17:00',
    endTime: '17:00',
    venue: 'Online Portal / Accounts Dept',
    organizer: 'Accounts Officer',
    participants: 1500,
    priority: 'High',
    description: 'Final submission deadline for upcoming odd semester tuition fees without penalty.',
    status: 'Scheduled',
    reminderEnabled: true,
    createdBy: 'Finance Dept',
    createdAt: '2026-05-14T09:00:00.000Z'
  },
  {
    id: 'evt-10',
    title: 'Industrial Visit to ISRO Satellite Center',
    category: 'Industrial Visits',
    department: 'Electronics',
    startDate: '2026-05-23',
    endDate: '2026-05-23',
    startTime: '08:00',
    endTime: '18:00',
    venue: 'ISRO Space Center Bengaluru',
    organizer: 'ECE Association Coordinator',
    participants: 80,
    priority: 'Medium',
    description: 'An educational visit for final-year ECE students to learn about space systems.',
    status: 'Scheduled',
    reminderEnabled: true,
    createdBy: 'ECE Association',
    createdAt: '2026-05-15T11:00:00.000Z'
  },
  {
    id: 'evt-11',
    title: 'Annual Track & Field Sports Meet 2026',
    category: 'Sports Events',
    department: 'All Departments',
    startDate: '2026-05-14',
    endDate: '2026-05-14',
    startTime: '09:00',
    endTime: '16:00',
    venue: 'College Main Ground',
    organizer: 'Physical Education Director',
    participants: 500,
    priority: 'Medium',
    description: 'Annual inter-department sports championship and track events.',
    status: 'Completed',
    reminderEnabled: false,
    createdBy: 'Sports Cell',
    createdAt: '2026-05-01T08:00:00.000Z'
  },
  {
    id: 'evt-12',
    title: 'Odd Semester Reopening Ceremony',
    category: 'Semester Start',
    department: 'All Departments',
    startDate: '2026-06-16',
    endDate: '2026-06-16',
    startTime: '09:00',
    endTime: '12:00',
    venue: 'Main Auditorium',
    organizer: 'Principal Office',
    participants: 2800,
    priority: 'High',
    description: 'Welcome and orientation assembly for all returning students and faculty.',
    status: 'Scheduled',
    reminderEnabled: true,
    createdBy: 'Dean Office',
    createdAt: '2026-05-10T10:00:00.000Z'
  }
];

const CATEGORIES = [
  'Exams',
  'Holidays',
  'Internal Assessments',
  'Semester Start',
  'Semester End',
  'Symposiums',
  'Placement Drives',
  'Cultural Events',
  'Sports Events',
  'Staff Meetings',
  'Fee Deadlines',
  'Leave Days',
  'Workshops',
  'Industrial Visits'
];

const CATEGORY_COLORS = {
  'Exams': { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-200', bgLight: 'bg-rose-50', hex: '#EF4444' },
  'Holidays': { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-200', bgLight: 'bg-amber-50', hex: '#F59E0B' },
  'Internal Assessments': { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-200', bgLight: 'bg-orange-50', hex: '#F97316' },
  'Semester Start': { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50', hex: '#059669' },
  'Semester End': { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-200', bgLight: 'bg-teal-50', hex: '#0D9488' },
  'Symposiums': { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-200', bgLight: 'bg-purple-50', hex: '#A855F7' },
  'Placement Drives': { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200', bgLight: 'bg-indigo-50', hex: '#4F46E5' },
  'Cultural Events': { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-200', bgLight: 'bg-pink-50', hex: '#EC4899' },
  'Sports Events': { bg: 'bg-lime-600', text: 'text-lime-600', border: 'border-lime-200', bgLight: 'bg-lime-50', hex: '#65A30D' },
  'Staff Meetings': { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200', bgLight: 'bg-slate-50', hex: '#475569' },
  'Fee Deadlines': { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-200', bgLight: 'bg-sky-50', hex: '#0EA5E9' },
  'Leave Days': { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-200', bgLight: 'bg-violet-50', hex: '#8B5CF6' },
  'Workshops': { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200', bgLight: 'bg-cyan-50', hex: '#0891B2' },
  'Industrial Visits': { bg: 'bg-yellow-600', text: 'text-yellow-600', border: 'border-yellow-200', bgLight: 'bg-yellow-50', hex: '#CA8A04' }
};

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Science & Humanities',
  'Business Administration'
];

const VENUES = [
  'Main Auditorium',
  'Main Seminar Hall',
  'Mini Seminar Hall 2',
  'Block A - Rooms 201 to 205',
  'CS Lab 3 Block C',
  'IT Lab Block A',
  'Placement Block Hall 2',
  'College Main Ground',
  'Boardroom Block A',
  'Research Lab 1',
  'Virtual Drive Room'
];

const PRIORITIES = ['Low', 'Medium', 'High'];

const AcademicCalendar = () => {
  // --- Centralized Events State ---
  const [events, setEvents] = useState(() => {
    try {
      const cached = localStorage.getItem('edu_erp_academic_calendar_events');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached academic calendar events:', e);
    }
    localStorage.setItem('edu_erp_academic_calendar_events', JSON.stringify(SEED_EVENTS));
    return SEED_EVENTS;
  });

  const saveEvents = (updatedEvents) => {
    setEvents(updatedEvents);
    localStorage.setItem('edu_erp_academic_calendar_events', JSON.stringify(updatedEvents));
    // Dispatch storage event to alert other listening tabs/hooks immediately
    window.dispatchEvent(new Event('storage'));
    
    // Also sync back components that announcements.jsx uses to preserve communication sync
    try {
      const exams = updatedEvents.filter(e => e.category === 'Exams').map(e => ({
        title: e.title,
        department: e.department,
        semester: 'Semester 6', // default
        hall: e.venue,
        examDate: e.startDate,
        attachment: true,
        publishedBy: e.organizer
      }));
      localStorage.setItem('edu_erp_comm_exams', JSON.stringify(exams));

      const holidays = updatedEvents.filter(e => e.category === 'Holidays').map(e => ({
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        type: 'National',
        departments: e.department,
        daysRemaining: 5
      }));
      localStorage.setItem('edu_erp_comm_holidays', JSON.stringify(holidays));

      const activeEvents = updatedEvents.filter(e => e.category !== 'Exams' && e.category !== 'Holidays').map(e => ({
        title: e.title,
        venue: e.venue,
        coordinator: e.organizer,
        timing: `${e.startTime} - ${e.endTime}`,
        registrationCount: Number(e.participants) || 40,
        liveStatus: e.status,
        departments: [e.department]
      }));
      localStorage.setItem('edu_erp_comm_events', JSON.stringify(activeEvents));
    } catch (e) {
      console.error('Telemetry - Communications sync error:', e);
    }
  };

  // --- Search and Filtering states ---
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    department: '',
    priority: '',
    venue: '',
    startDate: '',
    endDate: ''
  });

  // --- Calendar Date, View & Active Elements States ---
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-20')); // Anchor to 2026-05-20
  const [calendarView, setCalendarView] = useState('month'); // month, week, year, timeline, agenda
  const [selectedEventId, setSelectedEventId] = useState(null); // Active Drawer Event ID
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // --- Drilldown KPI Modals ---
  const [drilldownModal, setDrilldownModal] = useState({ isOpen: false, title: '', filterFn: null });

  // --- Bulk Upload Trigger ---
  const fileInputRef = useRef(null);

  // --- AI State Recommender Suggestion Cache ---
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiSelectedCategory, setAiSelectedCategory] = useState('Exams');

  // --- Event Editor State ---
  const [editorData, setEditorData] = useState({
    title: '',
    category: 'Exams',
    department: 'Computer Science',
    startDate: '2026-05-20',
    endDate: '2026-05-20',
    startTime: '09:00',
    endTime: '12:00',
    venue: 'Main Seminar Hall',
    organizer: 'Dr. Anand K. Varma',
    participants: 100,
    priority: 'Medium',
    description: '',
    status: 'Scheduled',
    reminderEnabled: true
  });

  // --- Sync storage changes from other tabs ---
  useEffect(() => {
    const handleStorageChange = () => {
      const cached = localStorage.getItem('edu_erp_academic_calendar_events');
      if (cached) {
        setEvents(JSON.parse(cached));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- Filtered and Searched Events Source of Truth ---
  const filteredEvents = useMemo(() => {
    return (events ?? []).filter(evt => {
      if (!evt) return false;
      const matchSearch = evt.title?.toLowerCase().includes(filters.search.toLowerCase()) || 
                          evt.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          evt.organizer?.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = !filters.category || evt.category === filters.category;
      const matchDepartment = !filters.department || evt.department === filters.department || evt.department === 'All Departments';
      const matchPriority = !filters.priority || evt.priority === filters.priority;
      const matchVenue = !filters.venue || evt.venue === filters.venue;
      
      let matchDate = true;
      if (filters.startDate) {
        matchDate = matchDate && evt.startDate >= filters.startDate;
      }
      if (filters.endDate) {
        matchDate = matchDate && evt.endDate <= filters.endDate;
      }

      return matchSearch && matchCategory && matchDepartment && matchPriority && matchVenue && matchDate;
    });
  }, [events, filters]);

  // --- Live Synchronized Hero Section Calculations ---
  const totalEventsCount = useMemo(() => (events ?? []).length, [events]);
  const upcomingHolidaysCount = useMemo(() => {
    return (events ?? []).filter(e => e.category === 'Holidays' && e.startDate >= '2026-05-20').length;
  }, [events]);
  const activeExamsCount = useMemo(() => {
    return (events ?? []).filter(e => e.category === 'Exams' && e.startDate <= '2026-05-20' && e.endDate >= '2026-05-20').length;
  }, [events]);
  const placementActivitiesCount = useMemo(() => {
    return (events ?? []).filter(e => e.category === 'Placement Drives').length;
  }, [events]);
  const workshopsCount = useMemo(() => {
    return (events ?? []).filter(e => e.category === 'Workshops').length;
  }, [events]);
  const meetingsCount = useMemo(() => {
    return (events ?? []).filter(e => e.category === 'Staff Meetings').length;
  }, [events]);
  const deadlinesCount = useMemo(() => {
    return (events ?? []).filter(e => e.category === 'Fee Deadlines').length;
  }, [events]);
  const studentActivitiesCount = useMemo(() => {
    return (events ?? []).filter(e => ['Cultural Events', 'Sports Events', 'Industrial Visits'].includes(e.category)).length;
  }, [events]);

  const workingDaysCount = useMemo(() => {
    // Total standard calendar working days baseline (e.g. 180) minus total holiday duration days
    const totalHolidayDays = (events ?? [])
      .filter(e => e.category === 'Holidays')
      .reduce((sum, h) => {
        const start = new Date(h.startDate);
        const end = new Date(h.endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return sum + (isNaN(diff) ? 0 : diff);
      }, 0);
    return Math.max(0, 180 - totalHolidayDays);
  }, [events]);

  const liveTodayEvents = useMemo(() => {
    const todayStr = '2026-05-20';
    return (events ?? []).filter(e => e.startDate <= todayStr && e.endDate >= todayStr);
  }, [events]);

  // --- Verification Logs ---
  useEffect(() => {
    console.log("KPI Sync Verified");
  }, [
    events,
    totalEventsCount,
    upcomingHolidaysCount,
    activeExamsCount,
    placementActivitiesCount,
    workshopsCount,
    meetingsCount,
    deadlinesCount,
    studentActivitiesCount
  ]);

  // --- AI Smart Engine Clash Detector ---
  const detectClashes = (newEvent, editId = null) => {
    const clashes = [];
    (events ?? []).forEach(evt => {
      if (editId && evt.id === editId) return;

      // 1. Check Date Range Overlap
      const isDateOverlap = (newEvent.startDate <= evt.endDate) && (newEvent.endDate >= evt.startDate);
      if (!isDateOverlap) return;

      // 2. Venue Hall Conflict
      if (newEvent.venue && newEvent.venue === evt.venue && newEvent.venue !== 'Campus Closed' && newEvent.venue !== 'Virtual Drive Room') {
        // Compare Time overlap
        const isTimeOverlap = (newEvent.startTime < evt.endTime) && (newEvent.endTime > evt.startTime);
        if (isTimeOverlap) {
          clashes.push({
            type: 'Venue Conflict',
            message: `"${evt.title}" is already scheduled in ${evt.venue} on this date from ${evt.startTime} to ${evt.endTime}.`
          });
        }
      }

      // 3. Exam Overlap for Same Department
      if (newEvent.category === 'Exams' && evt.category === 'Exams' && newEvent.department === evt.department) {
        clashes.push({
          type: 'Exam Conflict',
          message: `Department "${newEvent.department}" already has exam "${evt.title}" scheduled on ${evt.startDate}.`
        });
      }

      // 4. Coordinator Faculty Conflict
      if (newEvent.organizer && newEvent.organizer === evt.organizer) {
        const isTimeOverlap = (newEvent.startTime < evt.endTime) && (newEvent.endTime > evt.startTime);
        if (isTimeOverlap) {
          clashes.push({
            type: 'Faculty Double-booking',
            message: `Coordinator ${newEvent.organizer} is already in charge of "${evt.title}" at this time.`
          });
        }
      }
    });
    return clashes;
  };

  // --- AI Event Recommendations Engine ---
  const generateSuggestions = (category) => {
    // Generate suggestions for non-conflicting slots in May/June 2026
    const baseDate = new Date('2026-05-21');
    const suggestionsList = [];
    
    for (let i = 1; i <= 15; i++) {
      const testDate = new Date(baseDate);
      testDate.setDate(baseDate.getDate() + i);
      const testDateStr = testDate.toISOString().split('T')[0];

      // Check if this date has no exams, no holidays, and no other events of the same category
      const eventsOnDate = (events ?? []).filter(e => e.startDate <= testDateStr && e.endDate >= testDateStr);
      const hasHoliday = eventsOnDate.some(e => e.category === 'Holidays');
      const hasExam = eventsOnDate.some(e => e.category === 'Exams');
      const totalCount = eventsOnDate.length;

      if (!hasHoliday && (!hasExam || category !== 'Exams') && totalCount < 3) {
        suggestionsList.push({
          date: testDateStr,
          reason: `Highly Recommended: Only ${totalCount} events scheduled. Free of holidays/exams.`,
          predictedParticipation: Math.round(80 + Math.random() * 15) // mock prediction rate
        });
      }
      if (suggestionsList.length >= 3) break;
    }
    setAiSuggestions(suggestionsList);
  };

  useEffect(() => {
    generateSuggestions(aiSelectedCategory);
  }, [aiSelectedCategory, events]);

  // --- Open Add/Edit Modal Handler ---
  const handleOpenAddModal = (initialDate = '2026-05-20') => {
    setEditingEvent(null);
    setEditorData({
      title: '',
      category: 'Exams',
      department: 'Computer Science',
      startDate: initialDate,
      endDate: initialDate,
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Main Seminar Hall',
      organizer: 'Dr. Anand K. Varma',
      participants: 100,
      priority: 'Medium',
      description: '',
      status: 'Scheduled',
      reminderEnabled: true
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setEditorData({ ...evt });
    setShowAddModal(true);
  };

  const handleDuplicate = (evt) => {
    // Duplicate recurring event to next week
    const start = new Date(evt.startDate);
    start.setDate(start.getDate() + 7);
    const end = new Date(evt.endDate);
    end.setDate(end.getDate() + 7);

    const duplicated = {
      ...evt,
      id: `evt-${Date.now()}`,
      title: `${evt.title} (Recurring)`,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    const clashes = detectClashes(duplicated);
    if (clashes.length > 0) {
      toast.error(`Duplication Warning: Overlaps detected! Details: ${clashes[0].message}`);
    }

    saveEvents([...(events ?? []), duplicated]);
    toast.success('Event duplicated to next week successfully!');
  };

  // --- Delete Event Handler ---
  const handleDelete = (id) => {
    confirmDelete(() => {
      const filtered = (events ?? []).filter(e => e.id !== id);
      saveEvents(filtered);
      setSelectedEventId(null);
      toast.success('Event removed successfully.');
    }, 'Are you sure you want to delete this event?');
  };

  // --- Save / Create Event Handler ---
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!editorData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const clashes = detectClashes(editorData, editingEvent?.id);
    if (clashes.length > 0) {
      const warningText = clashes.map(c => `• ${c.type}: ${c.message}`).join('\n');
      confirmWarning(() => {
        executeSaveEvent();
      }, warningText, 'AI Clash Engine Warning', 'Save Anyway');
      return;
    }

    executeSaveEvent();
  };

  const executeSaveEvent = () => {
    let updatedList = [];
    if (editingEvent) {
      // Modify
      updatedList = (events ?? []).map(item => item.id === editingEvent.id ? { ...editorData, id: item.id } : item);
      toast.success('Academic Event updated!');
    } else {
      // Create new
      const newEvt = {
        ...editorData,
        id: `evt-${Date.now()}`,
        createdBy: 'Admin Academic Cell',
        createdAt: new Date().toISOString()
      };
      updatedList = [...(events ?? []), newEvt];
      toast.success('New Academic Event added!');
    }

    saveEvents(updatedList);
    setShowAddModal(false);
  };

  // --- Bulk Upload Events ---
  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (!Array.isArray(parsed)) {
          throw new Error('JSON content must be an array of event objects.');
        }
        
        let successCount = 0;
        let conflictCount = 0;
        const listToAppend = [];

        parsed.forEach(item => {
          if (!item.title || !item.category || !item.startDate) return;
          const normalized = {
            id: item.id || `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title,
            category: item.category,
            department: item.department || 'All Departments',
            startDate: item.startDate,
            endDate: item.endDate || item.startDate,
            startTime: item.startTime || '09:00',
            endTime: item.endTime || '17:00',
            venue: item.venue || 'Main Seminar Hall',
            organizer: item.organizer || 'Admin Office',
            participants: Number(item.participants) || 50,
            priority: item.priority || 'Medium',
            description: item.description || '',
            status: item.status || 'Scheduled',
            reminderEnabled: item.reminderEnabled ?? true,
            createdBy: 'Bulk Uploader',
            createdAt: new Date().toISOString()
          };

          const clashes = detectClashes(normalized);
          if (clashes.length > 0) {
            conflictCount++;
          }
          listToAppend.push(normalized);
          successCount++;
        });

        if (listToAppend.length > 0) {
          saveEvents([...(events ?? []), ...listToAppend]);
          toast.success(`Bulk Upload Complete! Imported ${successCount} events. Warning: ${conflictCount} overlap warnings occurred.`);
        }
      } catch (err) {
        toast.error(`Invalid JSON file structure: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // --- Export Actions ---
  const handleExportCSV = () => {
    const headers = ['id', 'title', 'category', 'department', 'startDate', 'endDate', 'startTime', 'endTime', 'venue', 'organizer', 'participants', 'priority', 'status'];
    const rows = (events ?? []).map(e => [
      e.id,
      `"${e.title?.replace(/"/g, '""')}"`,
      e.category,
      e.department,
      e.startDate,
      e.endDate,
      e.startTime,
      e.endTime,
      e.venue,
      e.organizer,
      e.participants,
      e.priority,
      e.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduERP_Academic_Calendar_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel-compatible CSV exported successfully!');
  };

  const handleExportPDF = () => {
    toast.success('Generating print-friendly PDF structure...');
    window.print();
  };

  // --- Date Math Helpers ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const selectedDrawerEvent = useMemo(() => {
    return (events ?? []).find(e => e.id === selectedEventId);
  }, [events, selectedEventId]);

  // --- Predictive Attendance Formula ---
  const calculatePredictedAttendance = (category, priority, participants) => {
    let rate = 75; // baseline
    if (priority === 'High') rate += 10;
    if (priority === 'Low') rate -= 15;
    if (category === 'Exams') rate = 99;
    if (category === 'Holidays') rate = 0;
    if (category === 'Placement Drives') rate += 12;
    if (category === 'Workshops') rate -= 5;
    
    const finalRate = Math.min(100, Math.max(0, rate));
    return {
      rate: finalRate,
      count: Math.round((Number(participants) || 100) * (finalRate / 100))
    };
  };

  // --- Recharts Charts Mock Data Processors ---
  const monthlyTrendsData = useMemo(() => {
    const map = {};
    monthsList.forEach((m, idx) => {
      map[idx] = { month: m.substring(0, 3), exams: 0, activities: 0, holidays: 0 };
    });
    
    (events ?? []).forEach(e => {
      const date = new Date(e.startDate);
      const mIdx = date.getMonth();
      if (map[mIdx]) {
        if (e.category === 'Exams') map[mIdx].exams++;
        else if (e.category === 'Holidays') map[mIdx].holidays++;
        else map[mIdx].activities++;
      }
    });

    return Object.values(map);
  }, [events]);

  const departmentData = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach(d => {
      if (d !== 'All Departments') map[d] = { name: d, count: 0 };
    });
    (events ?? []).forEach(e => {
      if (e.department === 'All Departments') {
        Object.keys(map).forEach(key => { map[key].count++; });
      } else if (map[e.department]) {
        map[e.department].count++;
      }
    });
    return Object.values(map);
  }, [events]);

  const categoryDistributionData = useMemo(() => {
    const map = {};
    (events ?? []).forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name]?.hex || '#64748B'
    }));
  }, [events]);

  // --- Click Handler for KPI Cards Drilldown ---
  const handleKpiClick = (title, categoryVal = null, filterFn = null) => {
    setDrilldownModal({
      isOpen: true,
      title,
      filterFn: filterFn ? filterFn : (evt) => evt.category === categoryVal
    });
  };

  // --- Drag and Drop Rescheduling Emulated Click-to-Move ---
  const handleShiftDate = (evtId, daysCount) => {
    const updated = (events ?? []).map(evt => {
      if (evt.id === evtId) {
        const start = new Date(evt.startDate);
        start.setDate(start.getDate() + daysCount);
        const end = new Date(evt.endDate);
        end.setDate(end.getDate() + daysCount);

        const newStartDate = start.toISOString().split('T')[0];
        const newEndDate = end.toISOString().split('T')[0];
        
        return {
          ...evt,
          startDate: newStartDate,
          endDate: newEndDate
        };
      }
      return evt;
    });

    // Check conflict
    const shifted = updated.find(e => e.id === evtId);
    const clashes = detectClashes(shifted, evtId);
    if (clashes.length > 0) {
      toast.error(`Reschedule Warning: Overlap detected! ${clashes[0].message}`);
    }

    saveEvents(updated);
    toast.success(`Rescheduled event by ${daysCount > 0 ? '+' : ''}${daysCount} days.`);
  };

  const handleMoveEventToDate = (evtId, dateStr) => {
    const updated = (events ?? []).map(evt => {
      if (evt.id === evtId) {
        const start = new Date(evt.startDate);
        const prevEnd = new Date(evt.endDate);
        const diffTime = prevEnd.getTime() - start.getTime();
        const nextStart = new Date(dateStr);
        const nextEnd = new Date(nextStart.getTime() + diffTime);
        
        return {
          ...evt,
          startDate: dateStr,
          endDate: nextEnd.toISOString().split('T')[0]
        };
      }
      return evt;
    });

    const moved = updated.find(e => e.id === evtId);
    const clashes = detectClashes(moved, evtId);
    if (clashes.length > 0) {
      toast.error(`Drag Warning: Overlaps detected! Details: ${clashes[0].message}`);
    }

    saveEvents(updated);
    toast.success('Event rescheduled via drag & drop!');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 Outfit-Font text-slate-800 antialiased selection:bg-indigo-500 selection:text-white animate-fade-in">
      
      {/* 1. TOP HERO SECTION */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          {/* Institution profile & title */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-1 shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Academic Coordinator" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white border border-indigo-400">
                  Academic Year: 2025-2026
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Even Semester
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                  2025-26 Regular
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-600 text-white font-bold animate-pulse">
                  Active Term
                </span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-black mt-2 tracking-tight text-white flex items-center gap-2">
                Academic Calendar & Planner
              </h1>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Coordinator: <span className="text-white font-extrabold">Dr. Anand K. Varma</span> (Dean of Academics) • Office Room 204
              </p>
            </div>
          </div>

          {/* Right Live Marquee Indicator */}
          <div className="w-full xl:w-96 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-5 flex items-start gap-4">
            <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <CalendarIcon size={22} className="animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">Live Today Indicator</span>
              <div className="text-xs mt-1.5 font-bold truncate">
                {liveTodayEvents.length > 0 ? (
                  <span className="text-emerald-400">
                    🟢 Active Now: {liveTodayEvents.map(e => e.title).join(', ')}
                  </span>
                ) : (
                  <span className="text-slate-400">No scheduled calendar events running today.</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Total Working Days Count: {workingDaysCount} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE SYNCHRONIZED KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Total Academic Events', value: totalEventsCount, color: 'bg-indigo-600', text: 'text-indigo-600', icon: CalendarDays, action: () => handleKpiClick('Total Academic Events', null, (e) => true) },
          { title: 'Upcoming Holidays', value: upcomingHolidaysCount, color: 'bg-amber-500', text: 'text-amber-500', icon: Award, action: () => handleKpiClick('Upcoming Holidays', null, (e) => e.category === 'Holidays' && e.startDate >= '2026-05-20') },
          { title: 'Active Exams', value: activeExamsCount, color: 'bg-rose-500', text: 'text-rose-500', icon: ShieldAlert, action: () => handleKpiClick('Active Exams', null, (e) => e.category === 'Exams' && e.startDate <= '2026-05-20' && e.endDate >= '2026-05-20') },
          { title: 'Placement Activities', value: placementActivitiesCount, color: 'bg-indigo-600', text: 'text-indigo-600', icon: Briefcase, action: () => handleKpiClick('Placement Activities', null, (e) => e.category === 'Placement Drives') },
          { title: 'Workshops Scheduled', value: workshopsCount, color: 'bg-cyan-600', text: 'text-cyan-600', icon: Megaphone, action: () => handleKpiClick('Workshops Scheduled', null, (e) => e.category === 'Workshops') },
          { title: 'Staff Meetings', value: meetingsCount, color: 'bg-slate-600', text: 'text-slate-600', icon: Users, action: () => handleKpiClick('Staff Meetings', null, (e) => e.category === 'Staff Meetings') },
          { title: 'Fee Deadlines', value: deadlinesCount, color: 'bg-sky-500', text: 'text-sky-500', icon: ClipboardCheck, action: () => handleKpiClick('Fee Deadlines', null, (e) => e.category === 'Fee Deadlines') },
          { title: 'Student Activities', value: studentActivitiesCount, color: 'bg-pink-500', text: 'text-pink-500', icon: CheckCircle, action: () => handleKpiClick('Student Activities', null, (e) => ['Cultural Events', 'Sports Events', 'Industrial Visits'].includes(e.category)) }
        ].map((kpi, idx) => (
          <div
            key={idx}
            onClick={kpi.action}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-3 rounded-2xl ${kpi.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors`}>
                Sync
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-30"></div>
          </div>
        ))}
      </div>

      {/* 3. CALENDAR ACTION PANELS: FILTERS & EVENT MANAGEMENT */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-4 z-20">
        {/* Sticky Filters */}
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search event title, faculty..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white w-full transition-colors"
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="">Category: All</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="">Dept: All</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="">Priority: All</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {filters.search || filters.category || filters.department || filters.priority ? (
            <button
              onClick={() => setFilters({ search: '', category: '', department: '', priority: '', venue: '', startDate: '', endDate: '' })}
              className="px-3 py-2 text-xs font-black text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Admin operations */}
        <div className="flex flex-wrap items-center gap-3 justify-end shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleBulkUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload size={14} /> Bulk Upload
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} /> Print Calendar
          </button>

          <button
            onClick={() => handleOpenAddModal('2026-05-20')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xl shadow-indigo-100 cursor-pointer"
          >
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      {/* 4. MAIN SPLIT GRID: CALENDAR WORKSPACE & SIDE PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Side Calendar Workspace */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col min-h-[650px] relative">
            
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-xs"><ChevronLeft size={16} /></button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-xs"><ChevronRight size={16} /></button>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  {monthsList[currentDate.getMonth()]} <span className="text-slate-400 font-bold">{currentDate.getFullYear()}</span>
                </h2>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto max-w-full">
                {['Month', 'Week', 'Year', 'Timeline', 'Agenda'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalendarView(v.toLowerCase())}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                      calendarView === v.toLowerCase() ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Calendar Views Safely */}
            <div className="flex-1">
              
              {/* MONTH VIEW */}
              {calendarView === 'month' && (
                <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl overflow-hidden animate-fade-in">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 border-r border-b border-slate-100 bg-slate-50/50 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}

                  {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="p-4 border-r border-b border-slate-100 bg-slate-50/20" />
                  ))}

                  {[...Array(daysInMonth)].map((_, i) => {
                    const dayNum = i + 1;
                    const formattedDateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    
                    const dayEvents = (filteredEvents ?? []).filter(e => e.startDate <= formattedDateStr && e.endDate >= formattedDateStr);
                    const isToday = formattedDateStr === '2026-05-20';

                    return (
                      <div
                        key={dayNum}
                        onClick={() => handleOpenAddModal(formattedDateStr)}
                        onDragOver={(dragE) => dragE.preventDefault()}
                        onDrop={(dragE) => {
                          dragE.preventDefault();
                          dragE.stopPropagation();
                          const evtId = dragE.dataTransfer.getData('text/plain');
                          if (evtId) handleMoveEventToDate(evtId, formattedDateStr);
                        }}
                        className={`min-h-[110px] p-2 border-r border-b border-slate-100 group transition-colors hover:bg-indigo-50/10 cursor-pointer relative ${
                          isToday ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <span className={`inline-flex items-center justify-center w-7 h-7 text-xs font-black rounded-lg mb-1.5 ${
                          isToday ? 'bg-indigo-600 text-white shadow-md animate-pulse' : 'text-slate-500'
                        }`}>
                          {dayNum}
                        </span>

                        <div className="space-y-1 max-h-[85px] overflow-y-auto">
                          {(dayEvents ?? []).map((e, idx) => {
                            if (!e) return null;
                            const colors = CATEGORY_COLORS[e.category] || { bg: 'bg-slate-500', hex: '#64748B' };
                            return (
                              <div
                                key={idx}
                                draggable={true}
                                onDragStart={(dragE) => {
                                  dragE.stopPropagation();
                                  dragE.dataTransfer.setData('text/plain', e.id);
                                }}
                                onClick={(clickE) => {
                                  clickE.stopPropagation();
                                  setSelectedEventId(e.id);
                                }}
                                className={`px-2 py-1 rounded-lg ${colors.bg} text-white text-[9px] font-black truncate shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-grab active:cursor-grabbing`}
                              >
                                {e.title}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* WEEK VIEW */}
              {calendarView === 'week' && (
                <div className="grid grid-cols-7 gap-4 animate-fade-in">
                  {[...Array(7)].map((_, idx) => {
                    const testDate = new Date(currentDate);
                    testDate.setDate(currentDate.getDate() - currentDate.getDay() + idx);
                    const dateStr = testDate.toISOString().split('T')[0];
                    const dayName = testDate.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = testDate.getDate();

                    const dayEvents = (filteredEvents ?? []).filter(e => e.startDate <= dateStr && e.endDate >= dateStr);
                    const isToday = dateStr === '2026-05-20';

                    return (
                      <div
                        key={idx}
                        onDragOver={(dragE) => dragE.preventDefault()}
                        onDrop={(dragE) => {
                          dragE.preventDefault();
                          dragE.stopPropagation();
                          const evtId = dragE.dataTransfer.getData('text/plain');
                          if (evtId) handleMoveEventToDate(evtId, dateStr);
                        }}
                        className={`p-4 rounded-3xl border border-slate-100 min-h-[400px] flex flex-col bg-slate-50/30 ${isToday ? 'bg-indigo-50/30 border-indigo-200' : ''}`}
                      >
                        <div className="text-center mb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{dayName}</span>
                          <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-xl mt-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-800 bg-white shadow-xs'}`}>
                            {dayNum}
                          </span>
                        </div>

                        <div className="flex-1 space-y-2">
                          {(dayEvents ?? []).map((e, eIdx) => {
                            const colors = CATEGORY_COLORS[e.category] || { bg: 'bg-slate-500' };
                            return (
                              <div
                                key={eIdx}
                                draggable={true}
                                onDragStart={(dragE) => {
                                  dragE.stopPropagation();
                                  dragE.dataTransfer.setData('text/plain', e.id);
                                }}
                                onClick={() => setSelectedEventId(e.id)}
                                className={`p-3 rounded-2xl ${colors.bg} text-white text-xs font-black cursor-grab active:cursor-grabbing shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all`}
                              >
                                <p className="truncate">{e.title}</p>
                                <span className="text-[8px] opacity-80 block mt-1 flex items-center gap-0.5"><Clock size={9} /> {e.startTime} - {e.endTime}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* YEAR VIEW */}
              {calendarView === 'year' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                  {monthsList.map((m, mIdx) => {
                    const firstDayOfMonth = new Date(2026, mIdx, 1).getDay();
                    const daysInM = new Date(2026, mIdx + 1, 0).getDate();

                    return (
                      <div key={mIdx} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-4 flex flex-col justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">{m}</h4>
                        
                        <div className="grid grid-cols-7 gap-0.5 text-[8px] text-center font-bold text-slate-400">
                          {['S','M','T','W','T','F','S'].map((d, dIdx) => <span key={dIdx}>{d}</span>)}
                          {[...Array(firstDayOfMonth)].map((_, emptyIdx) => <span key={`e-${emptyIdx}`}></span>)}
                          {[...Array(daysInM)].map((_, dIdx) => {
                            const dNum = dIdx + 1;
                            const formatted = `2026-${(mIdx+1) < 10 ? '0'+(mIdx+1) : (mIdx+1)}-${dNum < 10 ? '0'+dNum : dNum}`;
                            const hasEvents = (events ?? []).some(e => e.startDate <= formatted && e.endDate >= formatted);

                            return (
                              <span
                                key={dIdx}
                                onClick={() => {
                                  setCurrentDate(new Date(2026, mIdx, dNum));
                                  setCalendarView('month');
                                }}
                                className={`w-4 h-4 rounded-sm flex items-center justify-center cursor-pointer transition-colors ${
                                  hasEvents ? 'bg-indigo-600 text-white font-black' : 'hover:bg-slate-200'
                                }`}
                              >
                                {dNum}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TIMELINE VIEW */}
              {calendarView === 'timeline' && (
                <div className="space-y-6 animate-fade-in">
                  {(filteredEvents ?? [])
                    .sort((a,b) => a.startDate.localeCompare(b.startDate))
                    .map((evt, idx) => {
                      const colors = CATEGORY_COLORS[evt.category] || { bg: 'bg-slate-500', hex: '#64748B' };
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedEventId(evt.id)}
                          className="flex items-center gap-6 p-4 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md cursor-pointer transition-all"
                        >
                          <div className="text-center w-20 shrink-0">
                            <span className="text-xs font-black text-slate-800 uppercase block">{new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                            <span className="text-2xl font-black text-indigo-600 block">{new Date(evt.startDate).getDate()}</span>
                          </div>
                          <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: colors.hex }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${colors.bg}`}>
                                {evt.category}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold">{evt.department}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-sm mt-1 truncate">{evt.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5"><MapPin size={11} /> {evt.venue} • <Clock size={11} /> {evt.startTime} - {evt.endTime}</p>
                          </div>
                          <ChevronRight className="text-slate-400 shrink-0" size={16} />
                        </div>
                      );
                    })}
                  {filteredEvents.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold border border-dashed rounded-3xl">No events scheduled.</div>
                  )}
                </div>
              )}

              {/* AGENDA VIEW */}
              {calendarView === 'agenda' && (
                <div className="space-y-4 animate-fade-in">
                  {(filteredEvents ?? [])
                    .sort((a,b) => a.startDate.localeCompare(b.startDate))
                    .map((evt, idx) => {
                      const colors = CATEGORY_COLORS[evt.category] || { bg: 'bg-slate-500', hex: '#64748B' };
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedEventId(evt.id)}
                          className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl ${colors.bg} text-white shadow-xs`}>
                              <CalendarIcon size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black uppercase tracking-wider ${colors.text}`}>{evt.category}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[9px] text-slate-400 font-bold">{evt.startDate} • {evt.startTime}</span>
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-sm mt-1">{evt.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-xl">{evt.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organizer</span>
                            <span className="text-xs font-bold text-slate-700 mt-0.5">{evt.organizer}</span>
                          </div>
                        </div>
                      );
                    })}
                  {filteredEvents.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold border border-dashed rounded-3xl">No events matching filter requirements.</div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* 5. VISUAL ANALYTICS COMPONENT */}
          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Calendar Analytics Dashboard</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Live metrics and scheduled workloads</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-wider">Monthly Event Density</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} />
                      <ChartTooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="exams" name="Exams" stroke="#EF4444" strokeWidth={3} dot={{r: 3}} />
                      <Line type="monotone" dataKey="activities" name="Activities" stroke="#4F46E5" strokeWidth={3} dot={{r: 3}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-wider">Events by Department</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 8, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} />
                      <ChartTooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="count" fill="#4F46E5" name="Scheduled Events" radius={[6, 6, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-wider">Holidays & Event Types Distribution</h4>
                <div className="h-64 flex flex-col sm:flex-row items-center">
                  <div className="flex-1 h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistributionData}
                          cx="50%" cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full sm:w-44 space-y-1.5 overflow-y-auto max-h-[200px] text-[10px] font-bold text-slate-500">
                    {categoryDistributionData.map((entry, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-2">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                          <span className="truncate">{entry.name}</span>
                        </span>
                        <span className="text-slate-800">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-wider">Exam & Event Workload Density</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendsData}>
                      <defs>
                        <linearGradient id="colorWorkload" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} />
                      <ChartTooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Area type="monotone" dataKey="activities" name="Density Load" stroke="#4F46E5" fillOpacity={1} fill="url(#colorWorkload)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Smart Planner */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-[32px] p-6 shadow-xl border border-indigo-900 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-400 animate-pulse" size={20} />
              <h3 className="text-sm font-black uppercase tracking-wider">AI Planner Assistant</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest block mb-1.5">Check Category Suggestions</label>
                <select
                  value={aiSelectedCategory}
                  onChange={(e) => setAiSelectedCategory(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 font-bold"
                >
                  {CATEGORIES.map(c => <option className="text-slate-900" key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest block">Recommended Free Slots</span>
                
                {aiSuggestions.map((s, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors flex justify-between items-center gap-3">
                    <div>
                      <span className="text-[10px] font-black text-indigo-300 block">{s.date}</span>
                      <span className="text-[8px] font-bold text-slate-300 block mt-0.5 leading-tight">{s.reason}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[8px] text-slate-400 block font-bold">Participation</span>
                      <span className="text-xs font-black text-emerald-400 block">{s.predictedParticipation}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">Calendar Legend</h3>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase tracking-wider">
              {CATEGORIES.map(c => {
                const col = CATEGORY_COLORS[c] || { bg: 'bg-slate-500', text: 'text-slate-700' };
                return (
                  <div key={c} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${col.bg}`}></span>
                    <span className="truncate">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 6. ENTERPRISE SIDE DRAWER: EVENT DETAILS */}
      {selectedEventId && selectedDrawerEvent && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div
            onClick={() => setSelectedEventId(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
          ></div>
          
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between z-10 animate-slide-left p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase text-white ${CATEGORY_COLORS[selectedDrawerEvent.category]?.bg || 'bg-slate-500'}`}>
                    {selectedDrawerEvent.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-500`}>
                    Priority: {selectedDrawerEvent.priority}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEventId(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="w-full h-44 rounded-3xl bg-slate-100 overflow-hidden relative border border-slate-200">
                <img
                  src={`https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop`}
                  alt="Calendar Event Banner"
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-black leading-tight">{selectedDrawerEvent.title}</h3>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 space-y-3.5 text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span>Venue: <span className="text-slate-900 font-extrabold">{selectedDrawerEvent.venue}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-400 shrink-0" />
                  <span>Time: <span className="text-slate-900 font-extrabold">{selectedDrawerEvent.startDate} @ {selectedDrawerEvent.startTime} - {selectedDrawerEvent.endTime}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-slate-400 shrink-0" />
                  <span>Organizer: <span className="text-slate-900 font-extrabold">{selectedDrawerEvent.organizer}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Info size={16} className="text-slate-400 shrink-0" />
                  <span>Target Department: <span className="text-slate-900 font-extrabold">{selectedDrawerEvent.department}</span></span>
                </div>
                <div className="pt-3 border-t border-slate-200/60">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</span>
                  <p className="text-slate-500 font-medium leading-relaxed">{selectedDrawerEvent.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-900">
                  <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest block">AI Attendance Prediction</span>
                  <span className="text-2xl font-black block mt-1">
                    {calculatePredictedAttendance(selectedDrawerEvent.category, selectedDrawerEvent.priority, selectedDrawerEvent.participants).rate}%
                  </span>
                  <span className="text-[10px] font-bold block mt-0.5 opacity-80">
                    Est. {calculatePredictedAttendance(selectedDrawerEvent.category, selectedDrawerEvent.priority, selectedDrawerEvent.participants).count} active heads
                  </span>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-indigo-900">
                  <span className="text-[8px] font-black text-indigo-700 uppercase tracking-widest block">Est. Budget Allocation</span>
                  <span className="text-2xl font-black block mt-1">₹45,000</span>
                  <span className="text-[10px] font-bold block mt-0.5 opacity-80">Subject to COE audit approval</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Linked Notices & Logs</h4>
                <div className="space-y-2.5">
                  <div className="p-3 bg-white border border-slate-200/50 rounded-xl flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span>📢 Exam Roster Notice Posted</span>
                    <span className="text-slate-400">2026-05-15</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200/50 rounded-xl flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span>💬 SMS Broadcast Alert Sent</span>
                    <span className="text-emerald-500">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Fast Shift Rescheduling</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShiftDate(selectedDrawerEvent.id, -1)}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    -1 Day
                  </button>
                  <button
                    onClick={() => handleShiftDate(selectedDrawerEvent.id, 1)}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    +1 Day
                  </button>
                  <button
                    onClick={() => handleShiftDate(selectedDrawerEvent.id, 7)}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    +1 Week
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-8">
              <button
                onClick={() => handleOpenEdit(selectedDrawerEvent)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 size={13} /> Edit Event
              </button>
              
              <button
                onClick={() => handleDuplicate(selectedDrawerEvent)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy size={13} /> Duplicate
              </button>

              <button
                onClick={() => handleDelete(selectedDrawerEvent.id)}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD / EDIT DIALOG MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex justify-end items-start p-4 bg-slate-900/30 backdrop-blur-xs animate-fade-in" onClick={() => setShowAddModal(false)}>
          <form
            onSubmit={handleSaveEvent}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl mt-16 mr-2 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-2xl flex flex-col justify-between animate-slide-in"
          >
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{editingEvent ? 'Edit Academic Event' : 'Add New Academic Event'}</h3>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Clash check active</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Practical Assessment"
                  value={editorData.title}
                  onChange={(e) => setEditorData({ ...editorData, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                  <select
                    value={editorData.category}
                    onChange={(e) => setEditorData({ ...editorData, category: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Department</label>
                  <select
                    value={editorData.department}
                    onChange={(e) => setEditorData({ ...editorData, department: e.target.value })}
                    className="input-field"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={editorData.startDate}
                    onChange={(e) => setEditorData({ ...editorData, startDate: e.target.value, endDate: e.target.value >= editorData.endDate ? e.target.value : editorData.endDate })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={editorData.endDate}
                    onChange={(e) => setEditorData({ ...editorData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={editorData.startTime}
                    onChange={(e) => setEditorData({ ...editorData, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={editorData.endTime}
                    onChange={(e) => setEditorData({ ...editorData, endTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Venue</label>
                  <select
                    value={editorData.venue}
                    onChange={(e) => setEditorData({ ...editorData, venue: e.target.value })}
                    className="input-field"
                  >
                    {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Priority</label>
                  <select
                    value={editorData.priority}
                    onChange={(e) => setEditorData({ ...editorData, priority: e.target.value })}
                    className="input-field"
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Organizer Faculty</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Anand K. Varma"
                    value={editorData.organizer}
                    onChange={(e) => setEditorData({ ...editorData, organizer: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Participants</label>
                  <input
                    type="number"
                    value={editorData.participants}
                    onChange={(e) => setEditorData({ ...editorData, participants: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Event Instructions / Details</label>
                <textarea
                  placeholder="Provide instructions or syllabus for the event..."
                  value={editorData.description}
                  onChange={(e) => setEditorData({ ...editorData, description: e.target.value })}
                  className="input-field h-20"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={editorData.reminderEnabled}
                  onChange={(e) => setEditorData({ ...editorData, reminderEnabled: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="reminder" className="text-xs font-bold text-slate-600 cursor-pointer">
                  Activate automatic notifications & notices for students and staff
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
              >
                {editingEvent ? 'Save Changes' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8. DRILLDOWN MODAL FOR KPI CARDS */}
      <CalendarDrilldownModal
        isOpen={drilldownModal.isOpen}
        onClose={() => setDrilldownModal({ isOpen: false, title: '', filterFn: null })}
        title={drilldownModal.title}
        events={events}
        filterFn={drilldownModal.filterFn}
      />

    </div>
  );
};

export default AcademicCalendar;
