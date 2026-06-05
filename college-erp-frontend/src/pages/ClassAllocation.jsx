import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  School,
  LayoutGrid,
  Search,
  Plus,
  X,
  Trash2,
  Edit2,
  AlertTriangle,
  Check,
  Users,
  TrendingUp,
  Activity,
  Printer,
  FileText,
  Download,
  HelpCircle,
  Clock,
  Layers,
  MapPin,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Legend,
  ComposedChart,
  AreaChart,
  Area
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../services/api';
import { confirmDelete } from '../utils/confirmToast';

// Master list of classrooms and labs
const ALL_ROOMS = [
  { roomNumber: 'Block A - 101', block: 'Block A', floor: '1st Floor', capacity: 70, type: 'Classroom' },
  { roomNumber: 'Block A - 102', block: 'Block A', floor: '1st Floor', capacity: 60, type: 'Classroom' },
  { roomNumber: 'Block A - 201', block: 'Block A', floor: '2nd Floor', capacity: 60, type: 'Classroom' },
  { roomNumber: 'Block A - 202', block: 'Block A', floor: '2nd Floor', capacity: 60, type: 'Classroom' },
  { roomNumber: 'Block A - 301', block: 'Block A', floor: '3rd Floor', capacity: 60, type: 'Classroom' },
  { roomNumber: 'Block B - 101', block: 'Block B', floor: '1st Floor', capacity: 50, type: 'Classroom' },
  { roomNumber: 'Block B - 102', block: 'Block B', floor: '1st Floor', capacity: 50, type: 'Classroom' },
  { roomNumber: 'Block B - 201', block: 'Block B', floor: '2nd Floor', capacity: 50, type: 'Classroom' },
  { roomNumber: 'Block B - 202', block: 'Block B', floor: '2nd Floor', capacity: 50, type: 'Classroom' },
  { roomNumber: 'Block C - 101', block: 'Block C', floor: '1st Floor', capacity: 40, type: 'Classroom' },
  { roomNumber: 'Block C - 102', block: 'Block C', floor: '1st Floor', capacity: 40, type: 'Classroom' },
  { roomNumber: 'Block C - 105', block: 'Block C', floor: '1st Floor', capacity: 45, type: 'Classroom' },
  { roomNumber: 'CS Lab 3 Block C', block: 'Block C', floor: '1st Floor', capacity: 80, type: 'Lab' },
  { roomNumber: 'IT Lab Block A', block: 'Block A', floor: '2nd Floor', capacity: 60, type: 'Lab' },
  { roomNumber: 'EC Lab Block B', block: 'Block B', floor: '3rd Floor', capacity: 50, type: 'Lab' }
];

const SEED_ALLOCATIONS = [
  {
    id: 'alloc-1',
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
    id: 'alloc-2',
    department: 'Information Technology',
    year: 'II',
    semester: '4',
    section: 'B',
    classroomNumber: 'Block B - 202',
    classAdvisor: 'Prof. Sneha Iyer',
    assignedFaculty: 'Dr. Anand K. Varma, Prof. Rajesh Kumar',
    labAllocation: 'IT Lab Block A',
    status: 'Lab Active',
    timetableSyncStatus: 'Synced'
  },
  {
    id: 'alloc-3',
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
    id: 'alloc-4',
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
    id: 'alloc-5',
    department: 'Computer Science',
    year: 'II',
    semester: '4',
    section: 'C',
    classroomNumber: 'Block B - 104',
    classAdvisor: 'Dr. Anand K. Varma',
    assignedFaculty: 'Prof. Rajesh Kumar',
    labAllocation: 'None',
    currentStrength: 52, // Exceeds capacity of Block B - 104 (looks up details)
    status: 'Occupied',
    timetableSyncStatus: 'Synced'
  }
];

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Science & Humanities',
  'Business Administration'
];

const BLOCKS = ['Block A', 'Block B', 'Block C'];
const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor'];
const STATUS_COLORS = {
  'Occupied': { bg: 'bg-indigo-600', text: 'text-white', hex: '#4F46E5' },
  'Available': { bg: 'bg-emerald-500', text: 'text-white', hex: '#10B981' },
  'Maintenance': { bg: 'bg-amber-500', text: 'text-white', hex: '#F59E0B' },
  'Lab Active': { bg: 'bg-purple-500', text: 'text-white', hex: '#A855F7' },
  'Exam Reserved': { bg: 'bg-rose-500', text: 'text-white', hex: '#EF4444' },
  'Timetable Conflict': { bg: 'bg-red-600', text: 'text-white', hex: '#DC2626' }
};

const ClassAllocation = () => {
  const navigate = useNavigate();
  // --- Central Allocation State ---
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/class-allocations');
      setAllocations(res.data || []);
    } catch (err) {
      console.error('Failed to fetch allocations:', err);
      toast.error('Failed to load class allocations from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const saveAllocations = (updated) => {
    setAllocations(updated);
    localStorage.setItem('edu_erp_class_allocations', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    // Auto-sync telemetry with related modules (timetable, exams, staff, attendance)
    try {
      const timetableSync = updated.map(a => ({
        room: a.classroomNumber,
        department: a.department,
        section: a.section,
        advisor: a.classAdvisor,
        faculty: a.assignedFaculty,
        strength: a.currentStrength,
        status: a.status
      }));
      localStorage.setItem('edu_erp_timetable_sync_rooms', JSON.stringify(timetableSync));
    } catch (err) {
      console.error('Failed to dispatch allocation telemetry:', err);
    }
  };

  // --- Search and Filters State ---
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    block: '',
    floor: '',
    status: '',
    faculty: '',
    capacity: '',
    semester: '',
    section: ''
  });

  // --- UI Modal & Drawer States ---
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [drilldownModal, setDrilldownModal] = useState({ isOpen: false, title: '', filterFn: null });
  const [selectedAllocationId, setSelectedAllocationId] = useState(null); // Side Drawer

  // --- Form State ---
  const [formData, setFormData] = useState({
    department: 'Computer Science',
    year: 'III',
    semester: '6',
    section: 'A',
    classroomNumber: 'Block A - 301',
    classAdvisor: 'Dr. Amit Sharma',
    assignedFaculty: 'Prof. Sneha Iyer',
    labAllocation: 'None',
    currentStrength: 50,
    status: 'Occupied',
    timetableSyncStatus: 'Synced'
  });

  // Helper lookup function for room properties
  const getRoomDetails = (roomNum) => {
    const room = ALL_ROOMS.find(r => r.roomNumber === roomNum);
    return room || { block: 'Unknown', floor: 'Unknown', capacity: 50, type: 'Classroom' };
  };

  // --- Smart Conflict Engine ---
  const getConflicts = (alloc, list = allocations) => {
    const conflicts = [];
    if (!alloc.classroomNumber || alloc.classroomNumber === 'None') return conflicts;

    const rDetails = getRoomDetails(alloc.classroomNumber);

    // 1. Capacity Overflow
    if (Number(alloc.currentStrength) > Number(rDetails.capacity)) {
      conflicts.push({
        type: 'Capacity Exceeded',
        message: `Strength (${alloc.currentStrength}) exceeds Room Capacity (${rDetails.capacity})`
      });
    }

    // 2. Double Booked Room (same room allocated to different divisions/departments)
    const roomOverlap = list.filter(a => a.id !== alloc.id && a.classroomNumber === alloc.classroomNumber);
    if (roomOverlap.length > 0) {
      conflicts.push({
        type: 'Double Booking',
        message: `Room is also allocated to ${roomOverlap[0].department} Year ${roomOverlap[0].year} Sec ${roomOverlap[0].section}`
      });
    }

    // 3. Staff Advisor Double-Booking
    if (alloc.classAdvisor && alloc.classAdvisor !== 'None') {
      const advisorOverlap = list.filter(a => a.id !== alloc.id && a.classAdvisor === alloc.classAdvisor);
      if (advisorOverlap.length > 0) {
        conflicts.push({
          type: 'Advisor Overlap',
          message: `Advisor ${alloc.classAdvisor} is already assigned to ${advisorOverlap[0].department} Year ${advisorOverlap[0].year} Sec ${advisorOverlap[0].section}`
        });
      }
    }

    // 4. Same Section Mapped to Multiple Classrooms
    const sectionOverlap = list.filter(a => a.id !== alloc.id && a.department === alloc.department && a.year === alloc.year && a.section === alloc.section);
    if (sectionOverlap.length > 0) {
      conflicts.push({
        type: 'Section Duplicate',
        message: `Section ${alloc.department} Y${alloc.year}-${alloc.section} is already mapped to ${sectionOverlap[0].classroomNumber}`
      });
    }

    return conflicts;
  };

  // --- Synchronized Calculations (Derive from Single Source of Truth) ---
  const totalClassrooms = ALL_ROOMS.length;

  const activeAllocationsCount = useMemo(() => {
    return (allocations ?? []).filter(a => a.classroomNumber !== 'None').length;
  }, [allocations]);

  const departmentsAllocatedCount = useMemo(() => {
    const depts = (allocations ?? []).map(a => a.department).filter(Boolean);
    return new Set(depts).size;
  }, [allocations]);

  const staffAdvisorsCount = useMemo(() => {
    const advisors = (allocations ?? []).map(a => a.classAdvisor).filter(a => a && a !== 'None');
    return new Set(advisors).size;
  }, [allocations]);

  const labRoomsActiveCount = useMemo(() => {
    return (allocations ?? []).filter(a => a.labAllocation && a.labAllocation !== 'None').length;
  }, [allocations]);

  const totalStudentsAllocated = useMemo(() => {
    return (allocations ?? []).reduce((sum, a) => sum + (Number(a.currentStrength) || 0), 0);
  }, [allocations]);

  const vacantRoomsCount = useMemo(() => {
    const allocatedRooms = (allocations ?? []).map(a => a.classroomNumber);
    return ALL_ROOMS.filter(r => !allocatedRooms.includes(r.roomNumber)).length;
  }, [allocations]);

  const conflictWarningsCount = useMemo(() => {
    return (allocations ?? []).reduce((sum, a) => sum + (getConflicts(a).length > 0 ? 1 : 0), 0);
  }, [allocations]);

  // --- Filtered Registry List ---
  const filteredAllocations = useMemo(() => {
    return (allocations ?? []).filter(a => {
      const rDetails = getRoomDetails(a.classroomNumber);
      const matchSearch = a.department?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.classAdvisor?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.classroomNumber?.toLowerCase().includes(filters.search.toLowerCase());

      const matchDept = !filters.department || a.department === filters.department;
      const matchBlock = !filters.block || rDetails.block === filters.block;
      const matchFloor = !filters.floor || rDetails.floor === filters.floor;
      const matchStatus = !filters.status || a.status === filters.status;
      const matchFaculty = !filters.faculty || a.assignedFaculty?.toLowerCase().includes(filters.faculty.toLowerCase());
      const matchCapacity = !filters.capacity || Number(rDetails.capacity) >= Number(filters.capacity);
      const matchSemester = !filters.semester || a.semester === filters.semester;
      const matchSection = !filters.section || a.section === filters.section;

      return matchSearch && matchDept && matchBlock && matchFloor && matchStatus && matchFaculty && matchCapacity && matchSemester && matchSection;
    });
  }, [allocations, filters]);

  // --- Click Handlers for KPI Cards ---
  const handleKpiClick = (title, filterFn) => {
    setDrilldownModal({
      isOpen: true,
      title,
      filterFn
    });
  };

  // --- Delete Handler ---
  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await api.delete(`/class-allocations/${id}`);
        const updated = (allocations ?? []).filter(a => a.id !== id);
        saveAllocations(updated);
        setSelectedAllocationId(null);
        toast.success('Class allocation removed successfully.');
      } catch (err) {
        console.error(err);
        toast.error('Failed to remove class allocation.');
      }
    }, 'Are you sure you want to remove this classroom allocation? This action cannot be undone.');
  };

  // --- Open Modals ---
  const handleOpenAdd = () => {
    setEditingAllocation(null);
    setFormData({
      department: 'Computer Science',
      year: 'III',
      semester: '6',
      section: 'A',
      classroomNumber: ALL_ROOMS[0].roomNumber,
      classAdvisor: 'Dr. Amit Sharma',
      assignedFaculty: 'Prof. Sneha Iyer',
      labAllocation: 'None',
      currentStrength: 50,
      status: 'Occupied',
      timetableSyncStatus: 'Synced'
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (alloc) => {
    setEditingAllocation(alloc);
    setFormData({ ...alloc });
    setShowFormModal(true);
  };

  // --- Save Handler ---
  const handleSave = (e) => {
    e.preventDefault();

    const executeSave = async () => {
      try {
        if (editingAllocation) {
          const res = await api.put(`/class-allocations/${editingAllocation.id}`, formData);
          const updated = (allocations ?? []).map(a => a.id === editingAllocation.id ? res.data : a);
          saveAllocations(updated);
          toast.success('Classroom allocation updated!');
        } else {
          const res = await api.post('/class-allocations', formData);
          const updated = [res.data, ...(allocations ?? [])];
          saveAllocations(updated);
          toast.success('Classroom allocation created!');
        }
        setShowFormModal(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to save classroom allocation.');
      }
    };

    const conflicts = getConflicts(formData, allocations.filter(a => a.id !== editingAllocation?.id));
    if (conflicts.length > 0) {
      toast((t) => (
        <div className="flex flex-col gap-2.5 p-1 text-slate-100 max-w-sm">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-extrabold text-sm tracking-tight">Validation Warnings Detected</h4>
              <div className="mt-2 space-y-1.5 text-xs text-slate-300 max-h-48 overflow-y-auto pr-1">
                {conflicts.map((c, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start leading-relaxed">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                    <span>
                      <strong className="text-slate-100 font-bold">{c.type}:</strong> {c.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700/50 my-1"></div>
          <p className="text-xs font-semibold text-slate-200">
            Do you want to override and save anyway?
          </p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeSave();
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/10"
            >
              Yes, Override
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors border border-slate-700/60"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        id: 'validation-conflict-toast',
        style: {
          background: '#0F172A',
          color: '#fff',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
        }
      });
      return;
    }

    executeSave();
  };

  // --- Export Actions ---
  const handleExportCSV = () => {
    const headers = ['id', 'department', 'year', 'semester', 'section', 'classroomNumber', 'classAdvisor', 'assignedFaculty', 'labAllocation', 'currentStrength', 'status', 'timetableSyncStatus'];
    const rows = (allocations ?? []).map(a => [
      a.id,
      a.department,
      a.year,
      a.semester,
      a.section,
      a.classroomNumber,
      a.classAdvisor,
      `"${a.assignedFaculty}"`,
      a.labAllocation,
      a.currentStrength,
      a.status,
      a.timetableSyncStatus
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'EduERP_Class_Allocations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Allocations CSV exported successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Recharts Data Mappings ---
  const barChartData = useMemo(() => {
    // Room occupancy % (Capacity vs strength)
    return (allocations ?? []).map(a => {
      const rDetails = getRoomDetails(a.classroomNumber);
      const usagePct = Math.round((Number(a.currentStrength) / Number(rDetails.capacity)) * 100) || 0;
      return {
        name: a.classroomNumber,
        occupancy: usagePct,
        capacity: rDetails.capacity,
        strength: a.currentStrength
      };
    });
  }, [allocations]);

  const pieChartData = useMemo(() => {
    // Department allocation ratio
    const counts = {};
    (allocations ?? []).forEach(a => {
      counts[a.department] = (counts[a.department] || 0) + 1;
    });
    return Object.keys(counts).map(dept => ({
      name: dept,
      value: counts[dept]
    }));
  }, [allocations]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#A855F7', '#EF4444', '#EC4899', '#06B6D4'];

  const selectedDrawerAlloc = allocations.find(a => a.id === selectedAllocationId);

  if (showFormModal) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in Outfit-Font">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setShowFormModal(false); setEditingAllocation(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm"
          >
            ← Back to List
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-slide-in p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {editingAllocation ? 'Modify Class Allocation' : 'Create Class Allocation'}
              </h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                Configure department classrooms and advisors
              </span>
            </div>
            <button onClick={() => { setShowFormModal(false); setEditingAllocation(null); }} className="p-2 hover:bg-slate-100 rounded-xl">
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs font-semibold text-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  <option value="I">I Year</option>
                  <option value="II">II Year</option>
                  <option value="III">III Year</option>
                  <option value="IV">IV Year</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Classroom Number</label>
                <select
                  value={formData.classroomNumber}
                  onChange={(e) => setFormData({ ...formData, classroomNumber: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  {ALL_ROOMS.map(r => <option key={r.roomNumber} value={r.roomNumber}>{r.roomNumber}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Class Advisor</label>
                <input
                  type="text"
                  value={formData.classAdvisor}
                  onChange={(e) => setFormData({ ...formData, classAdvisor: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                  placeholder="Dr. John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Student Strength</label>
                <input
                  type="number"
                  value={formData.currentStrength}
                  onChange={(e) => setFormData({ ...formData, currentStrength: Number(e.target.value) })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Assigned Subject Faculty</label>
              <input
                type="text"
                value={formData.assignedFaculty}
                onChange={(e) => setFormData({ ...formData, assignedFaculty: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                placeholder="e.g. Prof. Sneha Iyer, Dr. Anand K. Varma (comma separated)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Lab Mapping</label>
                <select
                  value={formData.labAllocation}
                  onChange={(e) => setFormData({ ...formData, labAllocation: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  <option value="None">None</option>
                  <option value="IT Lab Block A">IT Lab Block A</option>
                  <option value="CS Lab 3 Block C">CS Lab 3 Block C</option>
                  <option value="EC Lab Block B">EC Lab Block B</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase mb-1.5 block">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-bold"
                >
                  {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setShowFormModal(false); setEditingAllocation(null); }}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/15"
              >
                Save Allocation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 Outfit-Font text-slate-800 antialiased selection:bg-indigo-500 selection:text-white animate-fade-in">

      {/* 1. TOP HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-1 shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
              <School size={36} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white border border-indigo-400">
                  Infrastructure Module
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Real-time Synced
                </span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-black mt-2 tracking-tight text-white">
                Class Allocation & Room Manager
              </h1>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Centralized allocation engine mapping classrooms, advisors, timetables, and conflicts.
              </p>
            </div>
          </div>

          <div className="w-full xl:w-96 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-5 flex items-start gap-4">
            <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Activity size={22} className="animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block font-bold">Smart System Status</span>
              <div className="text-xs mt-1.5 font-bold truncate">
                {conflictWarningsCount > 0 ? (
                  <span className="text-rose-400 flex items-center gap-1.5 font-extrabold animate-bounce">
                    ⚠️ {conflictWarningsCount} Conflict Warnings Detected
                  </span>
                ) : (
                  <span className="text-emerald-400">🟢 System Consistent: No Room Overlaps</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Vacant Classrooms: {vacantRoomsCount} Rooms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC LIVE SYNCHRONIZED KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Total Classrooms', value: totalClassrooms, color: 'bg-indigo-600', icon: School, action: () => handleKpiClick('Total Classrooms', (e) => true) },
          { title: 'Active Allocations', value: activeAllocationsCount, color: 'bg-emerald-500', icon: Building2, action: () => handleKpiClick('Active Allocations', (e) => e.classroomNumber !== 'None') },
          { title: 'Departments Allocated', value: departmentsAllocatedCount, color: 'bg-purple-500', icon: LayoutGrid, action: () => handleKpiClick('Departments Mapped', (e) => e.department) },
          { title: 'Staff Advisors Assigned', value: staffAdvisorsCount, color: 'bg-cyan-600', icon: Users, action: () => handleKpiClick('Staff Advisors Mapped', (e) => e.classAdvisor && e.classAdvisor !== 'None') },
          { title: 'Lab Rooms Active', value: labRoomsActiveCount, color: 'bg-violet-600', icon: Layers, action: () => handleKpiClick('Active Labs', (e) => e.labAllocation && e.labAllocation !== 'None') },
          { title: 'Total Students Allocated', value: totalStudentsAllocated, color: 'bg-pink-500', icon: Users, action: () => handleKpiClick('Allocated Student Strengths', (e) => Number(e.currentStrength) > 0) },
          {
            title: 'Vacant Rooms', value: vacantRoomsCount, color: 'bg-amber-500', icon: MapPin, action: () => handleKpiClick('Vacant Classrooms', (e) => {
              const allocatedRooms = allocations.map(a => a.classroomNumber);
              return !allocatedRooms.includes(e.roomNumber);
            }, true)
          }, // true indicates to filter from ALL_ROOMS
          { title: 'Conflict Warnings', value: conflictWarningsCount, color: 'bg-rose-500', icon: AlertTriangle, action: () => handleKpiClick('Conflict Warnings', (e) => getConflicts(e).length > 0) }
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
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
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

      {/* 3. FILTERS & EXPORTS PANEL */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by Department, Advisor, or Classroom Number..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Printer size={15} /> Print Sheet
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <FileText size={15} /> Export CSV
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md shadow-indigo-100 ml-auto lg:ml-0"
            >
              <Plus size={16} /> New Allocation
            </button>
          </div>
        </div>

        {/* Detailed Grid Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            >
              <option value="">All</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Block</label>
            <select
              value={filters.block}
              onChange={(e) => setFilters({ ...filters, block: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            >
              <option value="">All</option>
              {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Floor</label>
            <select
              value={filters.floor}
              onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            >
              <option value="">All</option>
              {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            >
              <option value="">All</option>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Min Capacity</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={filters.capacity}
              onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Faculty</label>
            <input
              type="text"
              placeholder="Name..."
              value={filters.faculty}
              onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Semester</label>
            <input
              type="text"
              placeholder="1-8"
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Section</label>
            <input
              type="text"
              placeholder="A, B, C"
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. MAIN ALLOCATION REGISTRY TABLE */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  <th className="p-4">Department & Class</th>
                  <th className="p-4">Classroom Info</th>
                  <th className="p-4">Advisor & Faculty</th>
                  <th className="p-4">Student Capacity</th>
                  <th className="p-4">Smart Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-400 font-bold">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[11px] uppercase tracking-widest text-slate-500 font-black">Loading classroom allocations...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (filteredAllocations ?? []).map((alloc, idx) => {
                    if (!alloc) return null;
                    const rDetails = getRoomDetails(alloc.classroomNumber);
                    const conflicts = getConflicts(alloc);
                    const isConflict = conflicts.length > 0;
                    const colors = STATUS_COLORS[alloc.status] || { bg: 'bg-slate-500', text: 'text-white' };

                    return (
                      <tr
                        key={alloc.id || idx}
                        className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${isConflict ? 'bg-red-50/30' : ''}`}
                        onClick={() => {
                          if (alloc.classAdvisor && alloc.classAdvisor !== 'None') {
                            navigate('/admin/staff', { state: { searchStaffName: alloc.classAdvisor } });
                          } else {
                            setSelectedAllocationId(alloc.id);
                          }
                        }}
                      >
                        <td className="p-4">
                          <div className="font-black text-slate-800 text-sm">{alloc.department}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                            Year {alloc.year} • Semester {alloc.semester} • Section {alloc.section}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-extrabold text-indigo-600 text-sm flex items-center gap-1">
                            <School size={13} /> {alloc.classroomNumber}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                            {rDetails.block} • {rDetails.floor}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-700">Advisor: {alloc.classAdvisor}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">
                            Faculty: {alloc.assignedFaculty}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-700">
                            {alloc.currentStrength} / {rDetails.capacity} Students
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isConflict ? 'bg-rose-500' : 'bg-indigo-600'}`}
                              style={{ width: `${Math.min(100, (Number(alloc.currentStrength) / Number(rDetails.capacity)) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase text-white ${isConflict ? 'bg-rose-600' : colors.bg}`}>
                              {isConflict ? 'Timetable Conflict' : alloc.status}
                            </span>
                            <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                              {alloc.timetableSyncStatus}
                            </span>
                            {isConflict && (
                              <span className="text-[8px] text-rose-600 font-black animate-pulse flex items-center gap-0.5 mt-0.5">
                                <AlertCircle size={10} /> Conflict Detected
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(alloc)}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"
                              title="Edit Allocation"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(alloc.id)}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                {!loading && (filteredAllocations ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl m-4">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-wider flex justify-between">
            <span>Showing {filteredAllocations.length} mappings</span>
            <span>EduERP Allocation Engine</span>
          </div>
        </div>

        {/* 5. SIDE DETAIL DRAWER */}
        <div className="w-full xl:w-96 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Allocation Details</h3>
              {selectedDrawerAlloc ? (
                <div className="space-y-4 text-slate-600 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wide">Division</div>
                    <div className="font-extrabold text-slate-900 text-base mt-0.5">{selectedDrawerAlloc.department}</div>
                    <div className="font-bold text-slate-500 mt-1">Year {selectedDrawerAlloc.year} • Sec {selectedDrawerAlloc.section} (Sem {selectedDrawerAlloc.semester})</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Classroom</span>
                      <span className="font-black text-slate-800 text-sm flex items-center gap-1 mt-1">
                        <School size={14} className="text-indigo-600" /> {selectedDrawerAlloc.classroomNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white inline-block mt-1 ${STATUS_COLORS[selectedDrawerAlloc.status]?.bg || 'bg-slate-500'}`}>
                        {selectedDrawerAlloc.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Class Advisor</span>
                    <span className="font-bold text-slate-700 mt-1 block">{selectedDrawerAlloc.classAdvisor}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Assigned Faculty</span>
                    <span className="font-bold text-slate-700 mt-1 block leading-relaxed">{selectedDrawerAlloc.assignedFaculty}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Lab Room Mapping</span>
                    <span className="font-bold text-slate-700 mt-1 block">{selectedDrawerAlloc.labAllocation || 'None'}</span>
                  </div>

                  {getConflicts(selectedDrawerAlloc).length > 0 && (
                    <div className="bg-rose-50 p-4 border border-rose-100 rounded-2xl text-rose-600 mt-3 space-y-1">
                      <div className="font-black flex items-center gap-1 text-[11px] uppercase tracking-wide">
                        <AlertTriangle size={14} /> Rule Violations
                      </div>
                      <div className="text-[10px] font-bold leading-relaxed space-y-1 mt-1.5">
                        {getConflicts(selectedDrawerAlloc).map((c, i) => (
                          <div key={i}>• {c.type}: {c.message}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 font-bold border border-dashed border-slate-100 rounded-3xl">
                  Select a mapping in the table to view complete attributes.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. AI UTILIZATION ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {/* Occupancy % vs Capacity */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Room Occupancy & Density %</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} />
                <YAxis unit="%" tick={{ fontSize: 9, fontWeight: 700 }} />
                <ChartTooltip formatter={(v) => [`${v}%`, 'Occupancy Ratio']} />
                <Bar dataKey="occupancy" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Ratio */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Department Allocation Ratio</h3>
          <div className="h-72 flex justify-center items-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(v) => [`${v} Classes`, 'Department Mapping']} />
                  <Legend verticalAlign="bottom" height={36} tick={{ fontSize: 9, fontWeight: 700 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-400 font-bold">No active allocations to chart.</span>
            )}
          </div>
        </div>
      </div>

      {/* 7. REUSABLE DRILLDOWN MODAL */}
      {drilldownModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-5xl bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between max-h-[85vh]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{drilldownModal.title} Drilldown</h3>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Synchronized live allocation registry details
                </span>
              </div>
              <button
                onClick={() => setDrilldownModal({ isOpen: false, title: '', filterFn: null })}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {(() => {
                // If it is Vacant Rooms, filter from ALL_ROOMS
                if (drilldownModal.title === 'Vacant Classrooms') {
                  const allocatedRooms = allocations.map(a => a.classroomNumber);
                  const vacant = ALL_ROOMS.filter(r => !allocatedRooms.includes(r.roomNumber));

                  return vacant.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-bold">No vacant rooms found.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vacant.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1">
                              <School size={14} className="text-emerald-500" /> {item.roomNumber}
                            </h4>
                            <div className="text-[10px] text-slate-400 font-bold mt-1">
                              Block: {item.block} • Floor: {item.floor}
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-bold mt-3">
                            <span>Capacity: {item.capacity} Seats</span>
                            <span className="text-emerald-500">Utilization: 0% (Vacant)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                const filtered = (allocations ?? []).filter(drilldownModal.filterFn || (() => true));
                return filtered.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 font-bold">No matching records found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((item, idx) => {
                      if (!item) return null;
                      const rDetails = getRoomDetails(item.classroomNumber);
                      const conflicts = getConflicts(item);
                      const usagePct = Math.round((Number(item.currentStrength) / Number(rDetails.capacity)) * 100) || 0;

                      return (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-indigo-50 text-indigo-600">
                                {item.department}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${STATUS_COLORS[item.status]?.bg || 'bg-slate-500'}`}>
                                {item.status}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm mt-3 flex items-center gap-1">
                              <School size={14} className="text-indigo-600" /> {item.classroomNumber}
                            </h4>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-[10px] text-slate-600 font-bold">
                            <div>
                              <span>Floor: <span className="text-slate-800">{rDetails.floor}</span></span>
                            </div>
                            <div>
                              <span>Block: <span className="text-slate-800">{rDetails.block}</span></span>
                            </div>
                            <div>
                              <span>Advisor: <span className="text-slate-800">{item.classAdvisor}</span></span>
                            </div>
                            <div>
                              <span>Capacity: <span className="text-slate-800">{rDetails.capacity} Seats</span></span>
                            </div>
                            <div>
                              <span>Occupancy: <span className="text-indigo-600">{item.currentStrength} Students</span></span>
                            </div>
                            <div>
                              <span>Utilization: <span className="text-indigo-600">{usagePct}%</span></span>
                            </div>
                            <div className="col-span-2">
                              <span>Faculty: <span className="text-slate-800">{item.assignedFaculty}</span></span>
                            </div>
                            {conflicts.length > 0 && (
                              <div className="col-span-2 text-rose-500 bg-rose-50 p-2 rounded-lg font-black text-[9px] uppercase tracking-wide">
                                Conflict Alert: {conflicts[0].message}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDrilldownModal({ isOpen: false, title: '', filterFn: null })}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassAllocation;
