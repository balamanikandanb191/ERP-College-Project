import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, Calendar, FileClock, ShieldAlert, 
  Search, Filter, Download, CheckCircle2, XCircle, 
  AlertTriangle, FileText, User, ChevronRight, Info,
  TrendingUp, BarChart3, PieChart as PieIcon, Award, Briefcase,
  Users, Check, X, ArrowUpRight, ShieldCheck, HeartPulse
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../services/api';
import GlobalProfileDrawer from '../components/common/GlobalProfileDrawer';

// Seed Initial Mock Leave Requests Data if not present
const SEED_LEAVE_REQUESTS = [
  {
    id: 'LR-2026-001',
    staffName: 'Dr. Amit Sharma',
    employeeId: 'EMP-ADMIN-001', // Super admin employee profile
    department: 'Computer Science',
    designation: 'Associate Professor',
    avatarColor: 'bg-indigo-500',
    attendance: 84.5,
    experience: '8 Years',
    leaveType: 'Medical Leave',
    startDate: '2026-05-18',
    endDate: '2026-05-22',
    days: 5,
    reason: 'Undergoing major knee surgery and require medical observation.',
    attachmentName: 'medical_certificate.pdf',
    remainingLeaves: 12,
    priority: 'Critical',
    appliedTime: '2 hours ago',
    status: 'Pending'
  },
  {
    id: 'LR-2026-002',
    staffName: 'Prof. Sneha Iyer',
    employeeId: 'EMP-IT-015',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    avatarColor: 'bg-emerald-500',
    attendance: 92.1,
    experience: '4 Years',
    leaveType: 'Casual Leave',
    startDate: '2026-05-20',
    endDate: '2026-05-21',
    days: 2,
    reason: 'Attending sibling\'s wedding in home town.',
    attachmentName: 'wedding_invitation.pdf',
    remainingLeaves: 8,
    priority: 'Info',
    appliedTime: '5 hours ago',
    status: 'Pending'
  },
  {
    id: 'LR-2026-003',
    staffName: 'Dr. Rajesh Patel',
    employeeId: 'EMP-ME-029',
    department: 'Mechanical',
    designation: 'Professor',
    avatarColor: 'bg-amber-500',
    attendance: 72.8, // low attendance
    experience: '12 Years',
    leaveType: 'Sick Leave',
    startDate: '2026-05-19',
    endDate: '2026-05-20',
    days: 2,
    reason: 'Suffering from acute food poisoning and running fever.',
    attachmentName: 'doctor_prescription.pdf',
    remainingLeaves: 4,
    priority: 'Warning',
    appliedTime: '1 day ago',
    status: 'Pending'
  },
  {
    id: 'LR-2026-004',
    staffName: 'Prof. Priya Nair',
    employeeId: 'EMP-ECE-008',
    department: 'Electronics',
    designation: 'Assistant Professor',
    avatarColor: 'bg-indigo-600',
    attendance: 95.5,
    experience: '6 Years',
    leaveType: 'Maternity Leave',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    days: 90,
    reason: 'Maternity leave extension as advised by senior gynaecologist.',
    attachmentName: 'medical_advice_letter.pdf',
    remainingLeaves: 15,
    priority: 'Info',
    appliedTime: '2 days ago',
    status: 'Approved',
    approvedBy: 'System Administrator',
    actionTimestamp: '2026-05-15 10:30 AM'
  },
  {
    id: 'LR-2026-005',
    staffName: 'Mr. Vikram Singh',
    employeeId: 'EMP-ADM-004',
    department: 'Administration',
    designation: 'Senior Registrar',
    avatarColor: 'bg-pink-500',
    attendance: 88.0,
    experience: '10 Years',
    leaveType: 'Loss Of Pay',
    startDate: '2026-05-11',
    endDate: '2026-05-15',
    days: 5,
    reason: 'Personal overseas travel for urgent property deal settlement.',
    attachmentName: 'property_document.pdf',
    remainingLeaves: 0,
    priority: 'Warning',
    appliedTime: '3 days ago',
    status: 'Rejected',
    rejectedBy: 'System Administrator',
    rejectionReason: 'Peak admission season; administrative presence required.',
    actionTimestamp: '2026-05-15 03:45 PM'
  }
];

const LeaveRequests = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [leaveRequests, setLeaveRequests] = useState([]);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const [staffList, setStaffList] = useState([]);
  const [substituteModalOpen, setSubstituteModalOpen] = useState(false);
  const [activeLeaveIdForSubstitute, setActiveLeaveIdForSubstitute] = useState(null);
  const [selectedSubstituteId, setSelectedSubstituteId] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await api.get('/staff');
        setStaffList(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error fetching staff list for substitute matching:', e);
      }
    };
    fetchStaff();
  }, []);

  // Load centralized leave requests from localStorage
  const loadRegistry = () => {
    try {
      const cached = localStorage.getItem('edu_erp_leave_requests');
      if (cached) {
        setLeaveRequests(JSON.parse(cached));
      } else {
        localStorage.setItem('edu_erp_leave_requests', JSON.stringify(SEED_LEAVE_REQUESTS));
        setLeaveRequests(SEED_LEAVE_REQUESTS);
      }
    } catch (e) {
      console.error('Failed to load leave requests from localStorage', e);
      setLeaveRequests(SEED_LEAVE_REQUESTS);
    }
  };

  useEffect(() => {
    loadRegistry();
    // Storage listener for dynamic multi-tab updates
    const handleStorageChange = (e) => {
      if (e.key === 'edu_erp_leave_requests') {
        loadRegistry();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Centralized Approval / Rejection Processor
  const handleApprove = (id) => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;
    setSelectedRequest(req);
    setActiveLeaveIdForSubstitute(id);
    setSubstituteModalOpen(true);
  };

  const processApprovalWithSubstitute = async (id, substituteId) => {
    try {
      const req = leaveRequests.find(r => r.id === id);
      if (!req) return;

      const substituteObj = staffList.find(s => s.id === substituteId);
      const subName = substituteObj?.fullName || 'Replacement Faculty';

      // 1. Fetch and update timetable records for this staff member
      const staffObj = staffList.find(s => s.staffId === req.employeeId || s.fullName === req.staffName);
      if (staffObj) {
        try {
          const { data: timetables } = await api.get('/timetable');
          const slotsToSubstitute = (timetables ?? []).filter(t => t.staffId === staffObj.id && t.status !== 'Cancelled');
          
          for (const slot of slotsToSubstitute) {
            await api.put(`/timetable/${slot.id}`, {
              ...slot,
              status: 'Substitute',
              substituteStaff: subName
            });
          }
          if (slotsToSubstitute.length > 0) {
            toast.success(`Substitute ${subName} allocated to ${slotsToSubstitute.length} roster periods!`);
          }
        } catch (e) {
          console.error('Failed to auto-substitute timetable records:', e);
        }
      }

      // 2. Perform leave requests approval
      const updated = (leaveRequests ?? []).map(r => {
        if (r.id === id) {
          toast.success(`Leave request for ${r.staffName} approved successfully!`);
          
          // Sync with staff status override
          const overrides = JSON.parse(localStorage.getItem('staff_status_override') ?? '{}');
          overrides[r.employeeId] = 'On Leave';
          localStorage.setItem('staff_status_override', JSON.stringify(overrides));
          
          // Generate Activity Log
          const logs = JSON.parse(localStorage.getItem('edu_erp_activity_logs') ?? '[]');
          logs.unshift({
            module: 'Leave Requests',
            action: 'Leave Approved',
            detail: `Approved ${r.leaveType} for ${r.staffName} (${r.days} days). Substitute assigned: ${subName}`,
            timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
            operator: 'System Administrator'
          });
          localStorage.setItem('edu_erp_activity_logs', JSON.stringify(logs));

          // Generate Communications Notification
          const commNotices = JSON.parse(localStorage.getItem('edu_erp_comm_notices') ?? '[]');
          commNotices.unshift({
            title: `Approved Leave: ${r.staffName} (Substitute: ${subName})`,
            department: r.department,
            audience: 'All Staff & Students',
            publishedBy: 'System Administrator',
            timestamp: new Date().toISOString().split('T')[0],
            attachment: false,
            priority: r.priority === 'Critical' || r.priority === 'Warning' ? 'Important' : 'General',
            content: `${r.designation} ${r.staffName} of ${r.department} is approved for leave from ${r.startDate} to ${r.endDate}. Substitute Faculty ${subName} has been assigned.`
          });
          localStorage.setItem('edu_erp_comm_notices', JSON.stringify(commNotices));

          // Dispatch storage event to alert dashboard and communications module instantly
          window.dispatchEvent(new Event('storage'));

          return {
            ...r,
            status: 'Approved',
            approvedBy: 'System Administrator',
            substituteStaff: subName,
            actionTimestamp: new Date().toLocaleString()
          };
        }
        return r;
      });

      localStorage.setItem('edu_erp_leave_requests', JSON.stringify(updated));
      setLeaveRequests(updated);
      setSubstituteModalOpen(false);
      setActiveLeaveIdForSubstitute(null);
      setSelectedSubstituteId('');
    } catch (err) {
      toast.error('Failed to process approval with substitute.');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    try {
      const id = selectedRequest?.id;
      const updated = (leaveRequests ?? []).map(req => {
        if (req.id === id) {
          toast.success(`Leave request for ${req.staffName} rejected.`);

          // Generate Activity Log
          const logs = JSON.parse(localStorage.getItem('edu_erp_activity_logs') ?? '[]');
          logs.unshift({
            module: 'Leave Requests',
            action: 'Leave Rejected',
            detail: `Rejected ${req.leaveType} for ${req.staffName} - Reason: ${rejectionReason}`,
            timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
            operator: 'System Administrator'
          });
          localStorage.setItem('edu_erp_activity_logs', JSON.stringify(logs));

          // Generate Communications Alert
          const commNotices = JSON.parse(localStorage.getItem('edu_erp_comm_notices') ?? '[]');
          commNotices.unshift({
            title: `Leave Rejected: ${req.staffName}`,
            department: req.department,
            audience: 'System Administration',
            publishedBy: 'System Administrator',
            timestamp: new Date().toISOString().split('T')[0],
            attachment: false,
            priority: 'General',
            content: `Leave request for ${req.staffName} (${req.leaveType}) from ${req.startDate} to ${req.endDate} was declined.`
          });
          localStorage.setItem('edu_erp_comm_notices', JSON.stringify(commNotices));

          // Dispatch storage event to alerts dashboard
          window.dispatchEvent(new Event('storage'));

          return {
            ...req,
            status: 'Rejected',
            rejectedBy: 'System Administrator',
            rejectionReason: rejectionReason,
            actionTimestamp: new Date().toLocaleString()
          };
        }
        return req;
      });

      localStorage.setItem('edu_erp_leave_requests', JSON.stringify(updated));
      setLeaveRequests(updated);
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (err) {
      toast.error('Failed to process rejection workflow.');
    }
  };

  // 1. Matches Filter matching engine
  const matchesFilters = (req) => {
    if (!req) return false;
    
    // Search text matching
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ? true : (
      (req.staffName ?? '').toLowerCase().includes(searchLower) ||
      (req.employeeId ?? '').toLowerCase().includes(searchLower) ||
      (req.reason ?? '').toLowerCase().includes(searchLower)
    );

    // Selector matching
    const matchesDept = !deptFilter ? true : req.department === deptFilter;
    const matchesType = !typeFilter ? true : req.leaveType === typeFilter;
    const matchesPriority = !priorityFilter ? true : req.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesType && matchesPriority;
  };

  // 2. Safe, Centralized Computed Datasets Pipelines
  const pendingLeaves = useMemo(() => {
    return (leaveRequests ?? []).filter(req => req && req.status === 'Pending' && matchesFilters(req));
  }, [leaveRequests, searchTerm, deptFilter, typeFilter, priorityFilter]);

  const approvedLeaves = useMemo(() => {
    return (leaveRequests ?? []).filter(req => req && req.status === 'Approved' && matchesFilters(req));
  }, [leaveRequests, searchTerm, deptFilter, typeFilter, priorityFilter]);

  const rejectedLeaves = useMemo(() => {
    return (leaveRequests ?? []).filter(req => req && req.status === 'Rejected' && matchesFilters(req));
  }, [leaveRequests, searchTerm, deptFilter, typeFilter, priorityFilter]);

  const emergencyLeaves = useMemo(() => {
    return (leaveRequests ?? []).filter(req => req && req.priority === 'Critical' && req.status === 'Pending' && matchesFilters(req));
  }, [leaveRequests, searchTerm, deptFilter, typeFilter, priorityFilter]);

  // 3. Dynamic active tab alias dataset (keeps tables aligned perfectly)
  const filteredRequests = useMemo(() => {
    switch (activeTab) {
      case 'pending': return pendingLeaves;
      case 'approved': return approvedLeaves;
      case 'rejected': return rejectedLeaves;
      case 'emergency': return emergencyLeaves;
      default: return [];
    }
  }, [activeTab, pendingLeaves, approvedLeaves, rejectedLeaves, emergencyLeaves]);

  // 4. Centralized synchronized stats for legacy widgets/analytics compatibility
  const stats = useMemo(() => {
    return {
      pending: pendingLeaves.length,
      approved: approvedLeaves.length,
      rejected: rejectedLeaves.length,
      emergency: emergencyLeaves.length,
      totalCount: (leaveRequests ?? []).length
    };
  }, [pendingLeaves, approvedLeaves, rejectedLeaves, emergencyLeaves, leaveRequests]);

  // 5. Debug Validation
  useEffect(() => {
    console.log('[DEBUG Leave Management Sync]');
    console.log('- Total requests:', (leaveRequests ?? []).length);
    console.log('- Pending leaves count:', pendingLeaves.length);
    console.log('- Approved leaves count:', approvedLeaves.length);
    console.log('- Rejected leaves count:', rejectedLeaves.length);
    console.log('- Emergency leaves count:', emergencyLeaves.length);
    console.log('- Active filters:', { searchTerm, deptFilter, typeFilter, priorityFilter });
  }, [leaveRequests, pendingLeaves, approvedLeaves, rejectedLeaves, emergencyLeaves, searchTerm, deptFilter, typeFilter, priorityFilter]);

  // Smart Warnings alerts builder
  const smartWarnings = useMemo(() => {
    const list = leaveRequests ?? [];
    const alertsList = [];

    // 1. Excessive leaves warning
    list.filter(r => r.status === 'Pending').forEach(r => {
      if (r.days >= 5) {
        alertsList.push({
          type: 'danger',
          message: `Excessive Leave Request: ${r.staffName} requested ${r.days} consecutive days (Medical Leave). Remaining balance: ${r.remainingLeaves} days.`
        });
      }
    });

    // 2. Low attendance alert
    list.filter(r => r.status === 'Pending').forEach(r => {
      if (r.attendance < 75) {
        alertsList.push({
          type: 'warning',
          message: `Attendance Alert: ${r.staffName}'s biometric attendance rate is at ${r.attendance}% (below 75% critical threshold).`
        });
      }
    });

    // 3. Emergency Spikes
    const pendingCritical = list.filter(r => r.status === 'Pending' && r.priority === 'Critical').length;
    const totalPending = list.filter(r => r.status === 'Pending').length;
    if (totalPending > 0 && (pendingCritical / totalPending) >= 0.3) {
      alertsList.push({
        type: 'danger',
        message: `Emergency Spike: High ratio of pending requests are Critical/Emergency leaves (${(pendingCritical / totalPending * 100).toFixed(0)}%). Staff capacity may be affected.`
      });
    }

    return alertsList;
  }, [leaveRequests]);

  // Recharts Analytics data
  const chartsData = useMemo(() => {
    // 1. Monthly Trends
    const monthlyTrends = [
      { month: 'Dec', requests: 4, approved: 3 },
      { month: 'Jan', requests: 7, approved: 6 },
      { month: 'Feb', requests: 5, approved: 4 },
      { month: 'Mar', requests: 8, approved: 7 },
      { month: 'Apr', requests: 12, approved: 10 },
      { month: 'May', requests: (leaveRequests ?? []).length, approved: (leaveRequests ?? []).filter(r => r.status === 'Approved').length }
    ];

    // 2. Department Ratios
    const deptMap = {};
    (leaveRequests ?? []).forEach(r => {
      if (r && r.department) {
        deptMap[r.department] = (deptMap[r.department] ?? 0) + r.days;
      }
    });
    const deptRatios = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

    // 3. Frequent reasons
    const reasonMap = {};
    (leaveRequests ?? []).forEach(r => {
      if (r && r.leaveType) {
        reasonMap[r.leaveType] = (reasonMap[r.leaveType] ?? 0) + 1;
      }
    });
    const reasonsData = Object.entries(reasonMap).map(([name, value]) => ({ name, value }));

    // 4. Approval Ratio
    const approvedCount = (leaveRequests ?? []).filter(r => r.status === 'Approved').length;
    const rejectedCount = (leaveRequests ?? []).filter(r => r.status === 'Rejected').length;
    const approvalRatio = [
      { name: 'Approved', value: approvedCount || 1 },
      { name: 'Rejected', value: rejectedCount || 1 }
    ];

    return { monthlyTrends, deptRatios, reasonsData, approvalRatio };
  }, [leaveRequests]);

  // Excel / PDF Mock Export Triggers
  const handleExport = (format) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Preparing leave requests audit report in ${format.toUpperCase()}...`,
        success: `Audit spreadsheet downloaded successfully in ${format.toUpperCase()} format!`,
        error: 'Export failed.'
      }
    );
  };

  const getPriorityBadgeColor = (p) => {
    switch (p) {
      case 'Critical': return 'bg-red-50 text-red-600 border-red-100';
      case 'Warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 Outfit-Font">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-2xl border border-indigo-100 text-indigo-600 shrink-0">
              <ClipboardCheck size={28} />
            </div>
            Leave Management Center
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Review, approve, and analyze academic and administrative faculty leave requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('excel')}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-xs text-xs"
          >
            <Download size={15} />
            Export XLS
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-md shadow-indigo-500/10 text-xs"
          >
            <FileText size={15} />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100/80 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-xs">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
            <FileClock size={22} />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pending Leaves</span>
            <span className="text-2xl font-black text-slate-800 uppercase leading-none mt-1 block">{stats.pending}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100/80 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-xs">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Approved Leaves</span>
            <span className="text-2xl font-black text-slate-800 uppercase leading-none mt-1 block">{stats.approved}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100/80 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-xs">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
            <XCircle size={22} />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Rejected Leaves</span>
            <span className="text-2xl font-black text-slate-800 uppercase leading-none mt-1 block">{stats.rejected}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100/80 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-xs">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Emergency Leaves</span>
            <span className="text-2xl font-black text-slate-800 uppercase leading-none mt-1 block">{stats.emergency}</span>
          </div>
        </div>

      </div>

      {/* Smart Warning and Burnout Panel */}
      {smartWarnings.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={15} /> Administrative Intelligence & Warnings
          </h4>
          <div className="space-y-1.5">
            {(smartWarnings ?? []).map((warn, i) => (
              <div key={i} className="text-xs font-medium text-amber-700 flex items-start gap-2">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{warn.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Tab Menu Header */}
      <div className="border-b border-slate-200 flex flex-wrap gap-2">
        {[
          { key: 'pending', label: 'Pending Requests', count: stats.pending, color: 'text-amber-600 bg-amber-50 border-amber-300' },
          { key: 'approved', label: 'Approved Leaves', count: stats.approved, color: 'text-emerald-600 bg-emerald-50 border-emerald-300' },
          { key: 'rejected', label: 'Rejected Leaves', count: stats.rejected, color: 'text-rose-600 bg-rose-50 border-rose-300' },
          { key: 'emergency', label: 'Emergency Focus', count: stats.emergency, color: 'text-red-600 bg-red-50 border-red-300' },
          { key: 'analytics', label: 'Leave Analytics', count: null, color: 'text-indigo-600 bg-indigo-50 border-indigo-300' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all relative ${
              activeTab === tab.key 
                ? 'border-indigo-600 text-indigo-600 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-black border ${
                activeTab === tab.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filtering Options Bar (Hidden in Analytics Tab) */}
      {activeTab !== 'analytics' && (
        <div className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center gap-3 shadow-xs">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by staff name, ID or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/20 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 w-full md:w-auto shrink-0">
            
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">All Dept</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electronics">Electronics</option>
              <option value="Administration">Administration</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">All Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Loss Of Pay">Loss Of Pay</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>

          </div>

        </div>
      )}

      {/* Tab Panel Context */}
      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.length > 0 ? (
            (filteredRequests ?? []).map(req => (
              <div key={req.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative">
                
                {/* Emergency Tag in upper right */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getPriorityBadgeColor(req.priority)}`}>
                    {req.priority}
                  </span>
                </div>

                {/* Profile header */}
                <div className="flex gap-4">
                  
                  {/* Photo Avatar */}
                  <div className={`w-12 h-12 rounded-2xl shrink-0 ${req.avatarColor || 'bg-slate-300'} flex items-center justify-center text-white font-extrabold text-lg shadow-inner`}>
                    {req.staffName ? req.staffName.charAt(0) : 'U'}
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-none">{req.staffName}</h3>
                    <span className="text-[10px] font-bold text-indigo-600 block mt-1">{req.designation} • {req.department}</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">ID: {req.employeeId}</span>
                  </div>

                </div>

                {/* Telemetry info row */}
                <div className="grid grid-cols-3 gap-2 border-y border-slate-100 my-4 py-3 shrink-0">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
                    <span className={`text-[11px] font-extrabold block mt-0.5 ${req.attendance < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {req.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Experience</span>
                    <span className="text-[11px] font-extrabold text-slate-700 block mt-0.5">{req.experience}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Remaining Balance</span>
                    <span className={`text-[11px] font-extrabold block mt-0.5 ${req.remainingLeaves < 5 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {req.remainingLeaves} days
                    </span>
                  </div>
                </div>

                {/* Leave details */}
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider block">Type & Duration</span>
                      <span className="text-[10px] font-black text-slate-700">{req.leaveType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider block">Total Days</span>
                      <span className="text-[10px] font-extrabold text-indigo-600">{req.days} Days</span>
                    </div>
                  </div>

                  <div className="text-[9px] font-bold text-slate-500">
                    <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[8px] block mb-0.5">Duration Timeline</span>
                    From <span className="font-extrabold text-slate-800">{req.startDate}</span> to <span className="font-extrabold text-slate-800">{req.endDate}</span>
                  </div>

                  <div className="text-[9px] font-bold text-slate-500">
                    <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[8px] block mb-0.5">Stated Reason</span>
                    "{req.reason}"
                  </div>

                  {req.attachmentName && (
                    <button 
                      onClick={() => setAttachmentPreview({ name: req.attachmentName, staff: req.staffName })}
                      className="text-[9px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 hover:text-indigo-800 mt-2 transition-colors cursor-pointer"
                    >
                      <FileText size={12} />
                      Preview Attachment ({req.attachmentName})
                    </button>
                  )}

                </div>

                {/* Buttons footer */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-4">
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsRejectModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-100 border border-rose-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsProfileModalOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl border border-slate-200/60 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center col-span-2">
              <ClipboardCheck className="mx-auto text-slate-300 mb-3" size={48} />
              <h3 className="text-base font-black text-slate-700">No Pending Requests</h3>
              <p className="text-slate-400 text-xs mt-1">All staff leave requests are successfully processed and in-sync.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="p-4 pl-6">Staff Member</th>
                  <th className="p-4">Leave Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Approved By</th>
                  <th className="p-4">Action Date</th>
                  <th className="p-4 text-right pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-600 divide-y divide-slate-100/60">
                {filteredRequests.length > 0 ? (
                  (filteredRequests ?? []).map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${req.avatarColor || 'bg-slate-400'} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                            {req.staffName ? req.staffName.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="font-black text-slate-800 block leading-tight">{req.staffName}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{req.designation} • {req.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 rounded-md px-2 py-0.5">
                          {req.leaveType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-700">{req.days} Days</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{req.startDate} to {req.endDate}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-700">{req.approvedBy || 'Dean'}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Admin Auditor</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] text-slate-500 font-medium">{req.actionTimestamp || 'Recent'}</span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No approved requests found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rejected' && (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="p-4 pl-6">Staff Member</th>
                  <th className="p-4">Leave Type</th>
                  <th className="p-4">Rejection Reason</th>
                  <th className="p-4">Rejected By</th>
                  <th className="p-4">Action Date</th>
                  <th className="p-4 text-right pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-600 divide-y divide-slate-100/60">
                {filteredRequests.length > 0 ? (
                  (filteredRequests ?? []).map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${req.avatarColor || 'bg-slate-400'} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                            {req.staffName ? req.staffName.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="font-black text-slate-800 block leading-tight">{req.staffName}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{req.designation} • {req.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 rounded-md px-2 py-0.5">
                          {req.leaveType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-bold text-rose-600 block">"{req.rejectionReason || 'No reason provided.'}"</span>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-700">{req.rejectedBy || 'Dean'}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] text-slate-500 font-medium">{req.actionTimestamp || 'Recent'}</span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                          Rejected
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No rejected requests found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.length > 0 ? (
            (filteredRequests ?? []).map(req => (
              <div key={req.id} className="bg-red-50/15 border border-red-200/65 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative">
                
                {/* Emergency Tag in upper right */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider bg-red-50 text-red-600 border-red-100">
                    EMERGENCY
                  </span>
                </div>

                {/* Profile header */}
                <div className="flex gap-4">
                  
                  {/* Photo Avatar */}
                  <div className={`w-12 h-12 rounded-2xl shrink-0 ${req.avatarColor || 'bg-slate-300'} flex items-center justify-center text-white font-extrabold text-lg shadow-inner`}>
                    {req.staffName ? req.staffName.charAt(0) : 'U'}
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-none">{req.staffName}</h3>
                    <span className="text-[10px] font-bold text-red-600 block mt-1">{req.designation} • {req.department}</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">ID: {req.employeeId}</span>
                  </div>

                </div>

                {/* Telemetry info row */}
                <div className="grid grid-cols-3 gap-2 border-y border-red-100 my-4 py-3 shrink-0">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
                    <span className={`text-[11px] font-extrabold block mt-0.5 ${req.attendance < 75 ? 'text-red-600 font-black' : 'text-slate-700'}`}>
                      {req.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Experience</span>
                    <span className="text-[11px] font-extrabold text-slate-700 block mt-0.5">{req.experience}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Remaining Balance</span>
                    <span className="text-[11px] font-extrabold text-red-600 block mt-0.5">
                      {req.remainingLeaves} days
                    </span>
                  </div>
                </div>

                {/* Leave details */}
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  
                  <div className="flex justify-between items-center bg-red-50/40 p-2 rounded-xl border border-red-100/50">
                    <div>
                      <span className="text-[7px] font-black text-red-600 uppercase tracking-wider block">Critical Type</span>
                      <span className="text-[10px] font-black text-red-700">{req.leaveType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7px] font-black text-red-600 uppercase tracking-wider block">Duration</span>
                      <span className="text-[10px] font-extrabold text-red-700">{req.days} Days</span>
                    </div>
                  </div>

                  <div className="text-[9px] font-bold text-slate-500">
                    <span className="font-extrabold text-red-700 uppercase tracking-wider text-[8px] block mb-0.5">Timeline Dates</span>
                    From <span className="font-extrabold text-slate-800">{req.startDate}</span> to <span className="font-extrabold text-slate-800">{req.endDate}</span>
                  </div>

                  <div className="text-[9px] font-bold text-slate-500">
                    <span className="font-extrabold text-red-700 uppercase tracking-wider text-[8px] block mb-0.5">Critical Reason</span>
                    "{req.reason}"
                  </div>

                  {req.attachmentName && (
                    <button 
                      onClick={() => setAttachmentPreview({ name: req.attachmentName, staff: req.staffName })}
                      className="text-[9px] font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5 hover:text-red-800 mt-2 transition-colors cursor-pointer"
                    >
                      <FileText size={12} />
                      Preview Critical File ({req.attachmentName})
                    </button>
                  )}

                </div>

                {/* Buttons footer */}
                <div className="flex items-center gap-2 border-t border-red-100 pt-4 mt-4">
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-red-500/10"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsRejectModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-white text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 border border-red-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsProfileModalOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl border border-slate-200/60 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    Profile
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center col-span-2">
              <ShieldCheck className="mx-auto text-emerald-500 mb-3 animate-pulse" size={48} />
              <h3 className="text-base font-black text-slate-700">No Critical Emergencies</h3>
              <p className="text-slate-400 text-xs mt-1">There are no pending emergency leave request applications currently.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Main Chart Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly Trends Area Curve */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500" /> Monthly Leave Requests & Approvals
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartsData.monthlyTrends}>
                    <defs>
                      <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} name="Total Requests" fillOpacity={1} fill="url(#reqGrad)" />
                    <Area type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" fillOpacity={1} fill="url(#appGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department-wise Bar Chart */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-indigo-500" /> Department Leave load (Cumulative Days)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.deptRatios}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
                    <Tooltip />
                    <Bar dataKey="value" name="Days Requested" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={28}>
                      {(chartsData.deptRatios ?? []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Approval / Rejection split Pie */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <PieIcon size={16} className="text-indigo-500" /> Approval vs Rejection Ratio
              </h4>
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartsData.approvalRatio}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Success</span>
                  <span className="text-lg font-black text-slate-800 leading-none mt-1">
                    {(stats.approved / (stats.approved + stats.rejected || 1) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Approved</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Rejected</span>
              </div>
            </div>

            {/* Frequent leave reason Pie */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HeartPulse size={16} className="text-indigo-500" /> Stated Leave Type Distribution
              </h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartsData.reasonsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(chartsData.reasonsData ?? []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[9px] font-bold text-slate-400">
                {(chartsData.reasonsData ?? []).map((entry, index) => (
                  <span key={entry.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'][index % 5] }}></div>
                    {entry.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Attendance Impact and Burnout intelligence */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-indigo-500" /> Attendance Impact & Burnout Risks
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                  Predictive analysis indicating active fatigue/overload levels based on recent leave trends.
                </p>
              </div>
              
              <div className="space-y-2.5 mt-4">
                
                <div className="bg-slate-50 border border-slate-200/40 rounded-xl p-2.5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-700 block">Systemic Burnout Risk</span>
                    <span className="text-[8px] font-medium text-slate-400">Based on staff load fluctuations</span>
                  </div>
                  <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2.5 py-0.5">
                    MODERATE
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/40 rounded-xl p-2.5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-700 block">Critical Absence Impact</span>
                    <span className="text-[8px] font-medium text-slate-400">Low attendance staff with active requests</span>
                  </div>
                  <span className="text-[9px] font-black uppercase bg-red-50 text-red-600 border border-red-100 rounded-full px-2.5 py-0.5">
                    HIGH RISK
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL 1: VIEW STAFF PROFILE DRAWER */}
      <GlobalProfileDrawer 
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedRequest(null);
        }}
        type="leave_request"
        profileData={selectedRequest}
      />

      {/* MODAL 2: REJECTION SPECIFICATION MODAL */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 relative shadow-2xl">
            
            <button 
              onClick={() => {
                setIsRejectModalOpen(false);
                setSelectedRequest(null);
                setRejectionReason('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-base font-black text-slate-800 mb-2">Specify Rejection Reason</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-normal">
              Kindly outline the administrative logic/conflict causing this leave application rejection. The faculty member will receive this notification.
            </p>

            <textarea
              rows="4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Peak admission season requires department presence; alternative faculty coverage is unavailable."
              className="w-full p-3 text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder-slate-400 resize-none text-slate-700"
            />

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
              <button 
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: ATTACHMENT SIMULATED PREVIEW */}
      {attachmentPreview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 relative shadow-2xl">
            
            <button 
              onClick={() => setAttachmentPreview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-base font-black text-slate-800 mb-1">Document Attachment Preview</h3>
            <span className="text-[10px] font-bold text-slate-400 block mb-4">File: {attachmentPreview.name} • Applied by {attachmentPreview.staff}</span>

            {/* Mock PDF preview viewer box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-64 select-none">
              
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl border border-indigo-100/60 mb-3 animate-bounce">
                <FileText size={32} />
              </div>
              
              <span className="text-xs font-black text-slate-700">{attachmentPreview.name}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Adobe PDF Document • 1.4 MB</span>
              
              <p className="text-[10px] text-slate-500 font-semibold max-w-xs mt-3 leading-normal">
                This is a simulated document preview. In production, this frame loads the uploaded binary BLOB certificate via safe object URI stream.
              </p>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
              <button 
                onClick={() => setAttachmentPreview(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Substitute Allocation Premium Modal */}
      {substituteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden p-6 animate-scale-up">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Assign Substitute Faculty</h3>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              Select a substitute instructor to take over classes for <span className="text-indigo-600 font-extrabold">{selectedRequest?.staffName}</span> during their leave.
            </p>
            
            <div className="mt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Substitute Faculty Member *</label>
              <select
                value={selectedSubstituteId}
                onChange={(e) => setSelectedSubstituteId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-200 outline-none bg-white text-xs font-bold text-slate-700"
              >
                <option value="">-- Select Replacement Staff --</option>
                {staffList.filter(s => s.fullName !== selectedRequest?.staffName).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.staffId} - {s.department})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2.5 mt-6 border-t border-slate-100 pt-4">
              <button 
                type="button" 
                onClick={() => {
                  setSubstituteModalOpen(false);
                  setActiveLeaveIdForSubstitute(null);
                  setSelectedSubstituteId('');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={!selectedSubstituteId}
                onClick={() => processApprovalWithSubstitute(activeLeaveIdForSubstitute, selectedSubstituteId)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & Approve
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveRequests;
