import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Filter, Download, Users, UserCheck, AlertCircle, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import StaffTable from '../components/StaffTable';
import StaffModal from '../components/StaffModal';
import ProfileDrawer from '../components/profile/ProfileDrawer';
import StaffEnterpriseProfile from '../components/staff/StaffEnterpriseProfile';
import { confirmDelete } from '../utils/confirmToast';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Staff = () => {
  const location = useLocation();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerStaff, setDrawerStaff] = useState(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Enterprise Profile View state
  const [activeProfileStaff, setActiveProfileStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await api.get('/staff');
      const data = Array.isArray(response.data) ? response.data :
        (response.data?.staff ? response.data.staff : []);
      setStaffList(data);
    } catch (error) {
      console.error('Failed to fetch staff', error);
      setApiError('Failed to load staff data.');
      toast.error('Failed to fetch staff from the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (location.state?.searchStaffName && staffList.length > 0) {
      const nameToFind = location.state.searchStaffName.toLowerCase().replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, '');
      const found = staffList.find(s => {
        const fullName = (s.fullName || '').toLowerCase();
        return fullName.includes(nameToFind) || nameToFind.includes(fullName);
      });
      if (found) {
        setActiveProfileStaff(found);
      } else {
        setSearchTerm(location.state.searchStaffName);
      }
    }
  }, [location.state, staffList]);

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await api.delete(`/staff/${id}`);
        setStaffList(staffList.filter(s => s.id !== id));
        toast.success('Staff member deleted successfully');
      } catch (error) {
        toast.error('Failed to delete staff member');
      }
    }, 'Are you sure you want to delete this staff member?');
  };

  const handleSave = async (staffData, photoFile, documentFiles) => {
    try {
      let savedStaff;
      if (selectedStaff) {
        const response = await api.put(`/staff/${selectedStaff.id}`, staffData);
        savedStaff = response.data;
        setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? savedStaff : s));
        toast.success('Staff record updated successfully');
      } else {
        const response = await api.post('/staff', staffData);
        savedStaff = response.data;
        setStaffList([savedStaff, ...staffList]);
        toast.success('Staff member onboarding complete');
      }

      if (photoFile && savedStaff?.id) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        const photoRes = await api.post(`/uploads/photo/staff/${savedStaff.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const updatedStaff = { ...savedStaff, photoUrl: photoRes.data.photoUrl };
        setStaffList(prev => prev.map(s => s.id === savedStaff.id ? updatedStaff : s));
      }

      if (documentFiles && Object.keys(documentFiles).length > 0 && savedStaff?.id) {
        const uploadPromises = Object.entries(documentFiles).map(async ([docType, file]) => {
          const docFormData = new FormData();
          docFormData.append('document', file);
          docFormData.append('documentType', docType);
          return api.post(`/uploads/document/staff/${savedStaff.id}`, docFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        });
        await Promise.all(uploadPromises);
        toast.success('All onboarding documents uploaded successfully');
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save staff data');
    }
  };

  const safeStaffList = Array.isArray(staffList) ? staffList : [];

  const filteredStaff = safeStaffList.filter(staff => {
    if (!staff) return false;
    const searchString = staff.fullName || '';
    const staffIdStr = staff.staffId || '';
    const matchesSearch = searchString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffIdStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter ? staff.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  if (apiError && !loading && safeStaffList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full pb-10">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to load data</h2>
        <p className="text-slate-500 mb-6">{apiError}</p>
        <button
          onClick={fetchStaff}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }



  if (activeProfileStaff) {
    return (
      <StaffEnterpriseProfile
        staff={activeProfileStaff}
        onClose={() => setActiveProfileStaff(null)}
        onUpdate={(updated) => {
          setActiveProfileStaff(updated);
          setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
        }}
      />
    );
  }

  if (isModalOpen) {
    return (
      <div className="space-y-6 w-full pb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setIsModalOpen(false); setSelectedStaff(null); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-650 cursor-pointer shadow-sm animate-fade-in"
          >
            ← Back to List
          </button>
        </div>
        <StaffModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedStaff(null); }} 
          staff={selectedStaff}
          onSave={handleSave}
          inline={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manage teaching and non-teaching staff records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-sm text-sm">
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-md shadow-indigo-500/20 text-sm"
          >
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={safeStaffList.length} icon={Users} colorClass="bg-indigo-500" />
        <StatCard title="Active Staff" value={safeStaffList.filter(s => s && s.employeeStatus === 'Active').length} icon={UserCheck} colorClass="bg-emerald-500" />
        <StatCard title="On Leave" value={safeStaffList.filter(s => s && s.employeeStatus === 'On Leave').length} icon={Briefcase} colorClass="bg-amber-500" />
        <StatCard title="Departments" value={new Set(safeStaffList.map(s => s.department).filter(Boolean)).size} icon={Filter} colorClass="bg-blue-500" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Search by name or staff ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
              <Filter size={16} className="text-slate-400" />
              <select
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Administration">Administration</option>
                <option value="Accounts">Accounts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                <div className="w-1/4 h-4 bg-slate-200 rounded"></div>
                <div className="w-1/4 h-4 bg-slate-200 rounded hidden sm:block"></div>
                <div className="w-1/4 h-4 bg-slate-200 rounded hidden md:block"></div>
                <div className="w-16 h-6 bg-slate-200 rounded-full ml-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <StaffTable
            staffList={filteredStaff}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowClick={(s) => {
              setActiveProfileStaff(s);
            }}
          />
        )}


      </div>


      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={drawerStaff}
        type="Staff"
      />
    </div>
  );
};

export default Staff;
