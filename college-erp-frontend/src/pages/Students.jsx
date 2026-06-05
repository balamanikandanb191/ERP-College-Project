import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, GraduationCap, Users, UserCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import StudentTable from '../components/StudentTable';
import StudentModal from '../components/StudentModal';
import ProfileDrawer from '../components/profile/ProfileDrawer';
import StudentEnterpriseProfile from '../components/students/StudentEnterpriseProfile';
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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerStudent, setDrawerStudent] = useState(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  
  // Enterprise Profile View state
  const [activeProfileStudent, setActiveProfileStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await api.get('/students');
      console.log("Students API response:", response.data);
      
      const data = Array.isArray(response.data) ? response.data : 
                   (response.data?.students ? response.data.students : []);
      
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students', error);
      setApiError('Failed to load students data.');
      toast.error('Failed to fetch students from the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter(s => s.id !== id));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }, 'Are you sure you want to delete this student?');
  };

  const handleSave = async (data) => {
    const { photo, ...studentData } = data;
    try {
      let savedStudent;
      if (selectedStudent) {
        // Update
        const response = await api.put(`/students/${selectedStudent.id}`, studentData);
        savedStudent = response.data;
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? savedStudent : s));
        toast.success('Student updated successfully');
      } else {
        // Add
        const response = await api.post('/students', studentData);
        savedStudent = response.data;
        setStudents(prev => [savedStudent, ...prev]);
        toast.success('Student added successfully');
      }

      // Handle photo upload if a new file was selected
      if (photo instanceof File && savedStudent?.id) {
        const formData = new FormData();
        formData.append('photo', photo);
        const photoRes = await api.post(`/uploads/photo/students/${savedStudent.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Update state with new photo URL
        const updatedStudent = { ...savedStudent, photoUrl: photoRes.data.photoUrl };
        setStudents(prev => prev.map(s => s.id === savedStudent.id ? updatedStudent : s));
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save student data');
    }
  };

  // Safe Array Reference
  const safeStudents = Array.isArray(students) ? students : [];

  // Filtering Logic
  const filteredStudents = safeStudents.filter(student => {
    if (!student) return false;
    const searchString = student.fullName || student.name || '';
    const registerNum = student.registerNumber || '';
    const matchesSearch = searchString.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          registerNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter ? student.department === departmentFilter : true;
    const matchesYear = yearFilter ? student.year === yearFilter : true;
    return matchesSearch && matchesDept && matchesYear;
  });

  if (apiError && !loading && safeStudents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 max-w-7xl mx-auto pb-10">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to load data</h2>
        <p className="text-slate-500 mb-6">{apiError}</p>
        <button 
          onClick={fetchStudents}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (activeProfileStudent) {
    return (
      <StudentEnterpriseProfile 
        student={activeProfileStudent} 
        onClose={() => setActiveProfileStudent(null)} 
      />
    );
  }

  if (isModalOpen) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setIsModalOpen(false); setSelectedStudent(null); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm animate-fade-in"
          >
            ← Back to List
          </button>
        </div>
        <StudentModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedStudent(null); }} 
          student={selectedStudent}
          onSave={handleSave}
          inline={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Students Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">View, add, and manage student records across all departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-sm text-sm">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={handleAdd}
            className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-md shadow-blue-500/20 text-sm"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={safeStudents.length} icon={Users} colorClass="bg-blue-500" />
        <StatCard title="Active Enrolled" value={safeStudents.length} icon={UserCheck} colorClass="bg-emerald-500" />
        <StatCard title="Fees Pending" value={safeStudents.filter(s => s && s.feesPaid !== 'Paid').length} icon={AlertCircle} colorClass="bg-amber-500" />
        <StatCard title="Avg Attendance" value={`${Math.round(safeStudents.reduce((acc, curr) => acc + (curr?.attendancePercentage || 0), 0) / (safeStudents.length || 1))}%`} icon={GraduationCap} colorClass="bg-indigo-500" />
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
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="Search by name or register number..."
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
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
              <GraduationCap size={16} className="text-slate-400" />
              <select 
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
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
          <StudentTable 
            students={filteredStudents} 
            onEdit={(student) => {
              setSelectedStudent(student);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete} 
            onRowClick={(student) => {
              setActiveProfileStudent(student);
            }}
          />
        )}
        
        {/* Pagination Footer */}
        {!loading && filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-800 font-bold">1</span> to <span className="text-slate-800 font-bold">{filteredStudents.length}</span> of <span className="text-slate-800 font-bold">{filteredStudents.length}</span> students
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors" disabled>Previous</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
      <ProfileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        data={drawerStudent} 
        type="Student" 
      />
    </div>
  );
};

export default Students;
