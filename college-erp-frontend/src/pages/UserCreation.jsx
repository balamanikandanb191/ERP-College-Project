import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Shield, 
  User, 
  Users, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  KeyRound, 
  LayoutDashboard, 
  Database, 
  GraduationCap, 
  Building2, 
  Lock, 
  List, 
  UserCheck, 
  AlertCircle, 
  ChevronDown,
  Info,
  CheckSquare,
  Ban
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import api from '../services/api';

const DEFAULT_ROLES = ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student', 'Parent'];
const ROLE_COLORS = {
  'Admin': 'bg-violet-100 text-violet-700 border-violet-200',
  'Super Admin': 'bg-rose-100 text-rose-700 border-rose-200',
  'Staff': 'bg-blue-100 text-blue-700 border-blue-200',
  'Teacher': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Student': 'bg-amber-100 text-amber-700 border-amber-200',
  'Parent': 'bg-pink-100 text-pink-700 border-pink-200',
};

const MODULE_GROUPS = [
  {
    id: 'common',
    title: 'Common Modules',
    gradient: 'from-purple-600 to-indigo-600',
    iconName: 'LayoutDashboard',
    modules: [
      { name: 'Dashboard', key: 'dashboard_dashboard', desc: 'dashboard' }
    ]
  },
  {
    id: 'admin',
    title: 'Admin Modules',
    gradient: 'from-pink-500 to-rose-500',
    iconName: 'Shield',
    modules: [
      { name: 'User Creation', key: 'file_user_creation', desc: 'file_user_creation' },
      { name: 'Log Details', key: 'file_log_details', desc: 'file_log_details' }
    ]
  },
  {
    id: 'master',
    title: 'Master Modules',
    gradient: 'from-sky-500 to-cyan-500',
    iconName: 'Database',
    modules: [
      { name: 'Academic Calendar', key: 'academic_AcademicCalendar', desc: 'academic_AcademicCalendar' },
      { name: 'Standard', key: 'academic_Standard', desc: 'academic_Standard' },
      { name: 'Subject', key: 'academic_Subject', desc: 'academic_Subject' },
      { name: 'Class Allocation', key: 'academic_Class_Allocation', desc: 'academic_Class_Allocation' },
      { name: 'Subject Allocation', key: 'academic_Subject_Allocation', desc: 'academic_Subject_Allocation' },
      { name: 'Time Table', key: 'academic_TimeTable', desc: 'academic_TimeTable' },
      { name: 'Staff Details', key: 'academic_StaffDetails', desc: 'academic_StaffDetails' },
      { name: 'Fee Details', key: 'academic_FeeDetails', desc: 'academic_FeeDetails' },
      { name: 'Class Master', key: 'others_ClassMaster', desc: 'others_ClassMaster' },
      { name: 'Exam Master', key: 'others_ExamMaster', desc: 'others_ExamMaster' },
      { name: 'Fee Master', key: 'others_FeeMaster', desc: 'others_FeeMaster' },
      { name: 'Academic Year Master', key: 'others_AcademicYearMaster', desc: 'others_AcademicYearMaster' },
      { name: 'Designation Master', key: 'others_DesignationMaster', desc: 'others_DesignationMaster' }
    ]
  },
  {
    id: 'admission',
    title: 'Admission Modules',
    gradient: 'from-rose-500 to-pink-500',
    iconName: 'Users',
    modules: [
      { name: 'Enquiry Dashboard', key: 'enquiry_Enquiry Dashboard', desc: 'enquiry_Enquiry Dashboard' },
      { name: 'Student Enquiry', key: 'enquiry_StudentEnquiry', desc: 'enquiry_StudentEnquiry' },
      { name: 'Assign Call', key: 'enquiry_Assign Call', desc: 'enquiry_Assign Call' },
      { name: 'Caller Details', key: 'enquiry_Caller Details', desc: 'enquiry_Caller Details' },
      { name: 'Lead Management', key: 'enquiry_Lead Management', desc: 'enquiry_Lead Management' },
      { name: 'Enquiry Report', key: 'enquiry_EnquiryReport', desc: 'enquiry_EnquiryReport' },
      { name: 'Application Issue', key: 'application_ApplicationIssue', desc: 'application_ApplicationIssue' },
      { name: 'Student Register', key: 'application_StudentRegister', desc: 'application_StudentRegister' },
      { name: 'Admitted Student', key: 'application_AdmittedStudent', desc: 'application_AdmittedStudent' },
      { name: 'Student Profile', key: 'application_StudentProfile', desc: 'application_StudentProfile' },
      { name: 'General Forms', key: 'application_GeneralForms', desc: 'application_GeneralForms' },
      { name: 'App Issue Consolidate', key: 'application_AppIssueConsolidate', desc: 'application_AppIssueConsolidate' },
      { name: 'EditTC', key: 'tc_EditTC', desc: 'tc_EditTC' },
      { name: 'TC', key: 'tc_TC', desc: 'tc_TC' },
      { name: 'Fees Estimation', key: 'tc_FeesEstimation', desc: 'tc_FeesEstimation' },
      { name: 'Course Completion', key: 'tc_CourseCompletion', desc: 'tc_CourseCompletion' },
      { name: 'Conduct', key: 'tc_Conduct', desc: 'tc_Conduct' },
      { name: 'Bonafide', key: 'tc_Bonafide', desc: 'tc_Bonafide' },
      { name: 'Id Card Generator', key: 'tc_IdCardGenerator', desc: 'tc_IdCardGenerator' }
    ]
  },
  {
    id: 'academic',
    title: 'Academic Modules',
    gradient: 'from-emerald-500 to-teal-500',
    iconName: 'GraduationCap',
    modules: [
      { name: 'Attendance Configuration', key: 'attendance_AttendanceConfiguration', desc: 'attendance_AttendanceConfiguration' },
      { name: 'Daily Attendance', key: 'attendance_DailyAttendance', desc: 'attendance_DailyAttendance' },
      { name: 'Marked Attendance', key: 'attendance_MarkedAttendance', desc: 'attendance_MarkedAttendance' },
      { name: 'Assessment Configuration', key: 'attendance_AssessmentConfiguration', desc: 'attendance_AssessmentConfiguration' },
      { name: 'Assignment Mark Entry', key: 'attendance_AssignmentMarkEntry', desc: 'attendance_AssignmentMarkEntry' }
    ]
  },
  {
    id: 'campus',
    title: 'Campus & Career Modules',
    gradient: 'from-amber-500 to-orange-500',
    iconName: 'Building2',
    modules: [
      { name: 'Hostel', key: 'campus_Hostel', desc: 'campus_Hostel' },
      { name: 'Transport', key: 'campus_Transport', desc: 'campus_Transport' },
      { name: 'Library', key: 'campus_Library', desc: 'campus_Library' },
      { name: 'Placement', key: 'campus_Placement', desc: 'campus_Placement' },
      { name: 'Placement Analytics', key: 'campus_PlacementAnalytics', desc: 'campus_PlacementAnalytics' },
      { name: 'Companies', key: 'campus_Companies', desc: 'campus_Companies' },
      { name: 'Student Timeline', key: 'campus_StudentTimeline', desc: 'campus_StudentTimeline' }
    ]
  },
  {
    id: 'security',
    title: 'Settings & Security Modules',
    gradient: 'from-slate-600 to-slate-800',
    iconName: 'Lock',
    modules: [
      { name: 'System Settings', key: 'security_SystemSettings', desc: 'security_SystemSettings' },
      { name: 'Roles & Permissions', key: 'security_RolesPermissions', desc: 'security_RolesPermissions' },
      { name: 'Profile Settings', key: 'security_ProfileSettings', desc: 'security_ProfileSettings' },
      { name: 'Backup & Security', key: 'security_BackupSecurity', desc: 'security_BackupSecurity' }
    ]
  }
];

const SEED_USERS = [
  { id: 'u-001', name: 'Dr. Amit Sharma', email: 'amit.sharma@edu.in', role: 'Admin', status: 'Active', staffId: 'STF001', userId: 'STF001', lastLogin: '23 May 2026, 09:12 AM', allowedModules: MODULE_GROUPS.flatMap(s => s.modules.map(m => m.name)) },
  { id: 'u-002', name: 'Prof. Sneha Iyer', email: 'sneha.iyer@edu.in', role: 'Teacher', status: 'Active', staffId: 'STF002', userId: 'STF002', lastLogin: '23 May 2026, 08:45 AM', allowedModules: ['Academic Calendar', 'Time Table', 'Daily Attendance', 'Assignment Mark Entry'] },
  { id: 'u-003', name: 'Rajesh Kumar', email: 'rajesh.kumar@edu.in', role: 'Staff', status: 'Active', staffId: 'STF003', userId: 'STF003', lastLogin: '22 May 2026, 04:30 PM', allowedModules: ['Enquiry Dashboard', 'Student Enquiry', 'Caller Details', 'Daily Attendance'] },
  { id: 'u-004', name: 'Priya Mehta', email: 'priya.m@students.edu.in', role: 'Student', status: 'Active', staffId: 'STF004', userId: 'STF004', lastLogin: '23 May 2026, 07:55 AM', allowedModules: ['Daily Attendance', 'Time Table', 'Library'] },
  { id: 'u-005', name: 'Ramesh Nair', email: 'ramesh.nair@edu.in', role: 'Parent', status: 'Inactive', staffId: 'STF005', userId: 'STF005', lastLogin: '15 May 2026, 11:00 AM', allowedModules: ['Daily Attendance', 'Time Table'] },
];

const SEED_STAFF = [
  { id: '1', fullName: 'Dr. Amit Sharma', staffId: 'STF001', department: 'Computer Science', email: 'amit.sharma@edu.in' },
  { id: '2', fullName: 'Prof. Sneha Iyer', staffId: 'STF002', department: 'Information Technology', email: 'sneha.iyer@edu.in' },
  { id: '3', fullName: 'Rajesh Kumar', staffId: 'STF003', department: 'Administration', email: 'rajesh.kumar@edu.in' },
  { id: '4', fullName: 'Priya Mehta', staffId: 'STF004', department: 'Computer Science', email: 'priya.m@students.edu.in' },
  { id: '5', fullName: 'Ramesh Nair', staffId: 'STF005', department: 'Accounts', email: 'ramesh.nair@edu.in' }
];

const emptyForm = {
  role: 'Staff',
  staffName: '',
  staffId: '',
  userId: '',
  password: '',
  confirmPassword: '',
  allowedModules: []
};

const renderIcon = (name, size = 18, className = "") => {
  switch (name) {
    case 'LayoutDashboard': return <LayoutDashboard size={size} className={className} />;
    case 'Shield': return <Shield size={size} className={className} />;
    case 'Database': return <Database size={size} className={className} />;
    case 'Users': return <Users size={size} className={className} />;
    case 'GraduationCap': return <GraduationCap size={size} className={className} />;
    case 'Building2': return <Building2 size={size} className={className} />;
    case 'Lock': return <Lock size={size} className={className} />;
    default: return <Database size={size} className={className} />;
  }
};

const UserCreation = () => {
  const { records: users, addRecord, updateRecord, deleteRecord } = useMasterData('user_creation', SEED_USERS);
  
  // App views
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'
  
  // Dropdown lists
  const [customRoles, setCustomRoles] = useState(DEFAULT_ROLES);
  const [staffList, setStaffList] = useState(SEED_STAFF);
  
  // Form states
  const [form, setForm] = useState(emptyForm);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Search state for list view
  const [search, setSearch] = useState('');

  // No collapsible state, groups always fully visible

  // Modals for Quick Add
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ fullName: '', staffId: '', department: 'Administration', email: '' });

  // Fetch staff list from database
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get('/staff');
        const data = Array.isArray(response.data) ? response.data : 
                     (response.data?.staff ? response.data.staff : []);
        if (data && data.length > 0) {
          setStaffList(data);
        }
      } catch (error) {
        console.error('Failed to fetch staff from API, using fallback staff', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await api.get('/auth/roles');
        if (response.data && response.data.length > 0) {
          const roleNames = response.data.map(role => role.name);
          setCustomRoles(roleNames);
        }
      } catch (error) {
        console.error('Failed to fetch roles from database, using defaults', error);
      }
    };
    fetchStaff();
    fetchRoles();
  }, []);

  const handleStaffChange = (staffName) => {
    const selected = staffList.find(s => s.fullName === staffName);
    if (selected) {
      setForm(prev => ({
        ...prev,
        staffName: selected.fullName,
        staffId: selected.staffId,
        userId: selected.staffId // Autocomplete User ID with Staff ID as placeholder
      }));
    } else {
      setForm(prev => ({
        ...prev,
        staffName,
        staffId: '',
        userId: ''
      }));
    }
  };

  const applyDefaultRoleModules = (role) => {
    let defaults = [];
    const allNames = MODULE_GROUPS.flatMap(g => g.modules.map(m => m.name));
    
    if (role === 'Admin' || role === 'Super Admin') {
      defaults = allNames;
    } else if (role === 'Staff') {
      defaults = [
        'Enquiry Dashboard', 'Student Enquiry', 'Assign Call', 'Caller Details', 'Lead Management', 'Enquiry Report',
        'Application Issue', 'Student Register', 'Admitted Student', 'Student Profile', 'General Forms', 'App Issue Consolidate',
        'TC', 'Course Completion', 'Conduct', 'Bonafide', 'Id Card Generator', 'Daily Attendance', 'Marked Attendance'
      ];
    } else if (role === 'Teacher') {
      defaults = [
        'Academic Calendar', 'Time Table', 'Daily Attendance', 'Assignment Mark Entry'
      ];
    } else if (role === 'Student' || role === 'Parent') {
      defaults = [
        'Daily Attendance', 'Time Table', 'Library'
      ];
    }
    setForm(prev => ({ ...prev, allowedModules: defaults }));
  };

  const handleRoleChange = (role) => {
    setForm(prev => ({ ...prev, role }));
    applyDefaultRoleModules(role);
  };

  const handleToggleModule = (moduleName) => {
    const current = form.allowedModules || [];
    if (current.includes(moduleName)) {
      setForm(prev => ({ ...prev, allowedModules: current.filter(m => m !== moduleName) }));
    } else {
      setForm(prev => ({ ...prev, allowedModules: [...current, moduleName] }));
    }
  };

  const handleSelectCategory = (categoryModules) => {
    const current = form.allowedModules || [];
    const categoryNames = categoryModules.map(m => m.name);
    const filtered = current.filter(name => !categoryNames.includes(name));
    setForm(prev => ({ ...prev, allowedModules: [...filtered, ...categoryNames] }));
  };

  const handleClearCategory = (categoryModules) => {
    const current = form.allowedModules || [];
    const categoryNames = categoryModules.map(m => m.name);
    setForm(prev => ({ ...prev, allowedModules: current.filter(name => !categoryNames.includes(name)) }));
  };

  const handleSelectAllAll = () => {
    const allNames = MODULE_GROUPS.flatMap(g => g.modules.map(m => m.name));
    setForm(prev => ({ ...prev, allowedModules: allNames }));
  };

  const handleClearAllAll = () => {
    setForm(prev => ({ ...prev, allowedModules: [] }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { toast.error('User Role is required'); return; }
    if (!form.staffName) { toast.error('Staff selection is required'); return; }
    if (!editing && !form.password) { toast.error('Password is required'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }

    const selectedStaffObj = staffList.find(s => s.fullName === form.staffName);
    const email = selectedStaffObj?.email || selectedStaffObj?.officialEmail || `${form.userId || form.staffId || 'user'}@college-erp.edu.in`;
    
    const userPayload = {
      name: form.staffName,
      email,
      role: form.role,
      status: editing ? editing.status : 'Active',
      staffId: form.staffId,
      userId: form.userId || form.staffId,
      allowedModules: form.allowedModules,
      lastLogin: editing ? editing.lastLogin : 'Never'
    };

    if (editing) {
      if (form.password) {
        userPayload.password = form.password;
      }
      const res = await updateRecord(editing.id, userPayload);
      if (res.success) {
        toast.success('User updated successfully!');
      }
    } else {
      userPayload.password = form.password;
      const res = await addRecord(userPayload);
      if (res.success) {
        toast.success('User created successfully!');
      }
    }

    setForm(emptyForm);
    setEditing(null);
    setViewMode('list');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    const res = await deleteRecord(id);
    if (res.success) toast.success('User removed.');
  };

  const toggleStatus = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const entry = { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' };
    const res = await updateRecord(id, entry);
    if (res.success) toast.success('Status updated!');
  };

  const openEdit = (user) => { 
    setEditing(user); 
    setForm({
      role: user.role || 'Staff',
      staffName: user.name || '',
      staffId: user.staffId || '',
      userId: user.userId || user.id || '',
      password: '',
      confirmPassword: '',
      allowedModules: user.allowedModules || []
    }); 
    setViewMode('form');
  };

  // Quick addition handlers
  const handleAddRoleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const trimmed = newRoleName.trim();
    if (customRoles.includes(trimmed)) {
      toast.error('Role already exists');
      return;
    }
    
    try {
      await api.post('/auth/roles', { name: trimmed });
      setCustomRoles([...customRoles, trimmed]);
      setForm(prev => ({ ...prev, role: trimmed }));
      setNewRoleName('');
      setShowRoleModal(false);
      toast.success('Role created in database and added to options!');
    } catch (error) {
      console.error('Failed to save role to database:', error);
      toast.error(error.response?.data?.message || 'Failed to save role to database');
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.staffId) {
      toast.error('Full Name and Staff ID are required');
      return;
    }
    const payload = {
      fullName: newStaff.fullName,
      staffId: newStaff.staffId,
      department: newStaff.department,
      email: newStaff.email || `${newStaff.staffId.toLowerCase()}@college.edu.in`,
      employeeStatus: 'Active',
      allowLogin: true
    };
    
    let savedStaff = payload;
    try {
      const response = await api.post('/staff', payload);
      if (response.data) {
        savedStaff = response.data;
      }
    } catch (apiErr) {
      console.warn("Could not save staff to database, adding locally:", apiErr);
    }
    
    setStaffList([savedStaff, ...staffList]);
    setForm(prev => ({
      ...prev,
      staffName: savedStaff.fullName,
      staffId: savedStaff.staffId,
      userId: savedStaff.staffId
    }));
    
    setShowStaffModal(false);
    setNewStaff({ fullName: '', staffId: '', department: 'Administration', email: '' });
    toast.success('Staff onboarding complete!');
  };

  const getCategoryToggleColor = (id) => {
    switch (id) {
      case 'common': return 'bg-violet-600';
      case 'admin': return 'bg-pink-500';
      case 'master': return 'bg-sky-500';
      case 'admission': return 'bg-rose-500';
      case 'academic': return 'bg-emerald-500';
      case 'campus': return 'bg-amber-500';
      case 'security': return 'bg-slate-700';
      default: return 'bg-primary';
    }
  };

  const filtered = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.role || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.staffId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full pb-12">
      
      {/* Dynamic View Header */}
      {viewMode === 'form' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Creation</h1>
            <div className="flex flex-col mt-1">
              <span className="text-xs font-bold text-indigo-600">Add User Details</span>
              <span className="text-xs text-slate-500 font-medium">Fill all the fields below to add user information</span>
            </div>
          </div>
          <button 
            onClick={() => { setViewMode('list'); setEditing(null); setForm(emptyForm); }}
            className="px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-100/70 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <List size={16} /> View Users
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Creation</h1>
            <div className="flex flex-col mt-1">
              <span className="text-xs font-bold text-emerald-600">Users Directory</span>
              <span className="text-xs text-slate-500 font-medium">View and manage all system users and their access permissions</span>
            </div>
          </div>
          <button 
            onClick={() => setViewMode('form')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus size={16} /> Create User
          </button>
        </div>
      )}

      {/* Form Workspace Mode */}
      {viewMode === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* User Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/40">
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">User Information</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* User Role */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">User Role <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select 
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
                      value={form.role}
                      onChange={e => handleRoleChange(e.target.value)}
                    >
                      {customRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowRoleModal(true)}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-xl transition-colors shadow-sm"
                    title="Add Custom Role"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Staff Name */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Staff Name <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select 
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
                      value={form.staffName}
                      onChange={e => handleStaffChange(e.target.value)}
                    >
                      <option value="">Select Staff</option>
                      {staffList.map(s => <option key={s.id} value={s.fullName}>{s.fullName} ({s.staffId})</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowStaffModal(true)}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-xl transition-colors shadow-sm"
                    title="Onboard New Staff"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Staff ID */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Staff ID</label>
                <input 
                  type="text" 
                  disabled
                  placeholder="Auto-filled from staff selection"
                  className="w-full border border-slate-100 bg-slate-50 text-slate-500 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none"
                  value={form.staffId}
                />
              </div>

              {/* User ID */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">User ID <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Default: Staff ID"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={form.userId}
                  onChange={e => setForm(prev => ({ ...prev, userId: e.target.value }))}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showConfirmPwd ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={form.confirmPassword}
                    onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Access Modules Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                  Access Modules <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Select modules to grant access permissions</p>
              </div>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={handleSelectAllAll}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-600 font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-colors"
                >
                  <CheckSquare size={13} /> Select All
                </button>
                <button 
                  type="button" 
                  onClick={handleClearAllAll}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100/85 border border-red-200 text-red-500 font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Ban size={13} /> Clear All
                </button>
              </div>
            </div>

            {/* Modules Expansion Section - Natural full page scroll */}
            <div className="p-6 space-y-8">
              {MODULE_GROUPS.map((group) => {
                const isSelected = group.modules.every(m => form.allowedModules?.includes(m.name));
                const totalModulesCount = group.modules.length;
                
                return (
                  <div key={group.id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    
                    {/* Category Header */}
                    <div className={`p-4 bg-gradient-to-r ${group.gradient} text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center shadow-inner">
                          {renderIcon(group.iconName, 20, "text-white")}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm tracking-wide">{group.title}</h3>
                          <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider block mt-0.5">
                            {totalModulesCount} module{totalModulesCount === 1 ? '' : 's'} available
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => handleSelectCategory(group.modules)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <Check size={10} /> Select All
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleClearCategory(group.modules)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <X size={10} /> Clear
                        </button>
                      </div>
                    </div>

                    {/* Category Modules Body Grid */}
                    <div className="p-4 bg-slate-50/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {group.modules.map((module) => {
                        const isChecked = form.allowedModules?.includes(module.name);
                        return (
                          <div 
                            key={module.name} 
                            onClick={() => handleToggleModule(module.name)}
                            className={`p-3.5 bg-white border rounded-xl flex items-center justify-between gap-3 shadow-sm hover:shadow transition-all cursor-pointer select-none ${
                              isChecked ? 'border-indigo-100 ring-2 ring-indigo-500/5' : 'border-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0">
                                {renderIcon(group.iconName, 15, "text-slate-400")}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-slate-700 truncate">{module.name}</p>
                                <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{module.key}</p>
                              </div>
                            </div>
                            
                            {/* Premium Custom Switch Toggle */}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleToggleModule(module.name); }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 outline-none ${
                                isChecked ? getCategoryToggleColor(group.id) : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                                  isChecked ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => { setViewMode('list'); setEditing(null); setForm(emptyForm); }}
              className="px-6 py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm shadow-md shadow-violet-500/20 transition-all"
            >
              {editing ? 'Save User Changes' : 'Save User Details'}
            </button>
          </div>

        </form>
      )}

      {/* User Directory Table Mode */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Table Header toolbar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 font-medium transition-colors"
                placeholder="Search by name, email, or role..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
              Showing {filtered.length} of {users.length} users
            </span>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Staff ID</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Permissions Scope</th>
                  <th className="px-6 py-4">Access Status</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm select-none shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">
                      {user.staffId || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border tracking-wide inline-block ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                        {(user.allowedModules || []).length} modules allowed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className={`flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full border transition-colors shadow-sm ${
                          user.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100/80' 
                            : 'bg-rose-50 text-rose-700 border-rose-250 hover:bg-rose-100/80'
                        }`}
                      >
                        {user.status === 'Active' ? <Check size={11} /> : <X size={11} />} {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-semibold">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { toast.success(`Password reset link sent to ${user.email}`); }} 
                          className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-xl transition-all shadow-sm" 
                          title="Reset Password"
                        >
                          <KeyRound size={14} />
                        </button>
                        <button 
                          onClick={() => openEdit(user)} 
                          className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm" 
                          title="Edit Settings"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-sm" 
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400 font-bold">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK ADD CUSTOM ROLE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Add Custom Role</h3>
              <button 
                type="button" 
                onClick={() => setShowRoleModal(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddRoleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Role Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Accounts Manager"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2.5 border border-slate-205 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow shadow-blue-500/20 transition-all"
                >
                  Add Role Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD NEW STAFF MODAL */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-105 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Quick Onboard Staff</h3>
              <button 
                type="button" 
                onClick={() => setShowStaffModal(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddStaffSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  required
                  placeholder="Dr. John Smith"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={newStaff.fullName}
                  onChange={e => setNewStaff(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Staff ID <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="STF101"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={newStaff.staffId}
                    onChange={e => setNewStaff(prev => ({ ...prev, staffId: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Department</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none bg-white"
                    value={newStaff.department}
                    onChange={e => setNewStaff(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="Administration">Administration</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accounts">Accounts</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email (Optional)</label>
                <input 
                  type="email"
                  placeholder="john.smith@college.edu.in"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={newStaff.email}
                  onChange={e => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2.5 border border-slate-205 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow shadow-blue-500/20 transition-all"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserCreation;
