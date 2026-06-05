import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Briefcase, UserCheck, Plus, X, Upload } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const defaultAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const AddBorrower = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('student');
  const [formLoading, setFormLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: '', registerNumber: '', gender: 'Male', dob: '',
    email: '', phone: '', department: '', course: '', semester: 'Semester 1',
    section: 'A', academicYear: '2024-2028'
  });
  const [staffForm, setStaffForm] = useState({
    fullName: '', staffId: '', gender: 'Male', dob: '',
    email: '', phone: '', department: '', designation: '', teachingType: 'Teaching'
  });

  // Search & filter states for student auto-fill
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Search & filter states for staff auto-fill
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  // Filter students by typed register number / name search term for Register Number input
  const matchingStudents = students.filter(s => {
    const search = (studentForm.registerNumber || '').toLowerCase();
    return (s.registerNumber || '').toLowerCase().includes(search) ||
           (s.fullName || '').toLowerCase().includes(search);
  });

  // Filter staff by typed staffId / name search term for Staff ID input
  const matchingStaff = staffList.filter(s => {
    const search = (staffForm.staffId || '').toLowerCase();
    return (s.staffId || '').toLowerCase().includes(search) ||
           (s.fullName || '').toLowerCase().includes(search);
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch students, staff and borrow records to match who has what active borrow
      const [studentsRes, staffRes, recordsRes] = await Promise.all([
        api.get('/students'),
        api.get('/staff'),
        api.get('/borrow-records')
      ]);

      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setStaffList(Array.isArray(staffRes.data) ? staffRes.data : []);
      setBorrowRecords(Array.isArray(recordsRes.data) ? recordsRes.data : []);
    } catch (error) {
      console.error('Error fetching borrower data:', error);
      toast.error('Failed to load borrower records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetStudentForm = () => {
    setStudentForm({
      fullName: '', registerNumber: '', gender: 'Male', dob: '',
      email: '', phone: '', department: '', course: '', semester: 'Semester 1',
      section: 'A', academicYear: '2024-2028'
    });
    setSelectedStudentId(null);
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const handleResetStaffForm = () => {
    setStaffForm({
      fullName: '', staffId: '', gender: 'Male', dob: '',
      email: '', phone: '', department: '', designation: '', teachingType: 'Teaching'
    });
    setSelectedStaffId(null);
  };

  // Helper: count active borrows for a student/staff
  const getActiveBorrowsCount = (id, type) => {
    return borrowRecords.filter(r => 
      r.status === 'Borrowed' && 
      (type === 'student' ? r.studentId === id : r.staffId === id)
    ).length;
  };

  // Helper: check if student/staff has unpaid fines
  const getFinesDue = (id, type) => {
    const records = borrowRecords.filter(r => 
      (type === 'student' ? r.studentId === id : r.staffId === id) &&
      r.fineAmount > 0 &&
      r.status !== 'Returned' // fine not cleared
    );
    return records.reduce((sum, r) => sum + r.fineAmount, 0);
  };

  // Filter students or staff
  const getFilteredBorrowers = () => {
    if (activeTab === 'student') {
      return students.filter(s => {
        const matchSearch = 
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = departmentFilter === 'All' || s.department === departmentFilter;
        return matchSearch && matchDept;
      });
    } else {
      return staffList.filter(s => {
        const matchSearch = 
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.staffId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = departmentFilter === 'All' || s.department === departmentFilter;
        return matchSearch && matchDept;
      });
    }
  };

  const filteredItems = getFilteredBorrowers();

  // Get departments lists
  const departments = ['All', ...new Set(
    (activeTab === 'student' ? students : staffList).map(x => x.department).filter(Boolean)
  )];

  const handlePhotoChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = type === 'students' ? selectedStudentId : selectedStaffId;

    if (id) {
      // Upload immediately for existing student/staff
      const formData = new FormData();
      formData.append('photo', file);
      try {
        setUploadingPhoto(true);
        const res = await api.post(`/upload/photo/${type}/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Photo updated successfully');
        setPhotoPreview(`http://localhost:5000/${res.data.photoUrl}`);
        fetchData(); // reload list
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to upload photo');
      } finally {
        setUploadingPhoto(false);
      }
    } else {
      // Just preview locally for new student/staff
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (selectedStudentId) {
        // Update existing student
        await api.put(`/students/${selectedStudentId}`, { ...studentForm });

        // If there's a new photo file, upload it
        if (photoFile) {
          const formData = new FormData();
          formData.append('photo', photoFile);
          await api.post(`/upload/photo/students/${selectedStudentId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        toast.success('Student borrower details updated successfully!');
      } else {
        // Create new student
        const res = await api.post('/students', { ...studentForm, admissionStatus: 'Approved' });
        const newStudent = res.data;

        // Upload photo if file is selected
        if (photoFile && newStudent?.id) {
          const formData = new FormData();
          formData.append('photo', photoFile);
          await api.post(`/upload/photo/students/${newStudent.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        toast.success('Student borrower registered successfully!');
      }

      handleResetStudentForm();
      fetchData();
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save student borrower');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      if (selectedStaffId) {
        await api.put(`/staff/${selectedStaffId}`, staffForm);

        // If there's a new photo file, upload it
        if (photoFile) {
          const formData = new FormData();
          formData.append('photo', photoFile);
          await api.post(`/upload/photo/staff/${selectedStaffId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        toast.success('Staff borrower details updated successfully!');
      } else {
        const res = await api.post('/staff', staffForm);
        const newStaff = res.data;

        // Upload photo if file is selected
        if (photoFile && newStaff?.id) {
          const formData = new FormData();
          formData.append('photo', photoFile);
          await api.post(`/upload/photo/staff/${newStaff.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        toast.success('Staff borrower registered successfully!');
      }
      handleResetStaffForm();
      fetchData();
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save staff borrower');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <UserCheck size={24} />
            </div>
            Borrower Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage library borrowing accounts, view limits, and check outstanding active loans</p>
        </div>
        <button
          onClick={() => {
            setShowForm(v => !v);
            setFormType(activeTab);
            handleResetStudentForm();
            handleResetStaffForm();
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-600/10 shrink-0"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'Add Borrower'}
        </button>
      </div>

      {/* Add Borrower Form Panel */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-indigo-900">Register New Borrower</h2>
            <div className="flex gap-2">
              {['student','staff'].map(t => (
                <button key={t} onClick={() => setFormType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    formType === t ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                  }`}>
                  {t === 'student' ? '🎓 Student' : '👔 Staff'}
                </button>
              ))}
            </div>
          </div>

          {formType === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left: Photo Upload Profile Card */}
                <div className="flex flex-col items-center justify-center p-5 bg-gray-50 border border-gray-200/60 rounded-2xl md:w-56 shrink-0 h-fit">
                  <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/20 bg-white flex items-center justify-center shadow-inner">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={defaultAvatar}
                        alt="Default Avatar"
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}

                    {/* Hover upload overlay */}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer text-xs font-semibold">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handlePhotoChange(e, 'students')}
                        className="hidden"
                      />
                      <Upload size={18} className="mb-1" />
                      {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    </label>
                  </div>
                  
                  <div className="text-center mt-3">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Student Photo</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG or WEBP (Max 10MB)</p>
                  </div>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview('');
                      }}
                      className="mt-3 text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100/50 hover:bg-rose-100/50 transition-colors"
                    >
                      <X size={12} /> Remove
                    </button>
                  )}
                </div>

                {/* Right: Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  
                  {/* Register Number Input with Searchable Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Register Number *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Search or enter Reg No..."
                        value={studentForm.registerNumber}
                        onChange={e => {
                          setStudentForm(p => ({ ...p, registerNumber: e.target.value }));
                          setShowDropdown(true);
                          if (selectedStudentId) {
                            setSelectedStudentId(null);
                          }
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-semibold"
                      />
                      {studentForm.registerNumber && (
                        <button
                          type="button"
                          onClick={handleResetStudentForm}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {showDropdown && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {matchingStudents.length === 0 ? (
                          <div className="p-3 text-xs text-gray-400 text-center">No students found</div>
                        ) : (
                          matchingStudents.map(student => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(student.id);
                                setStudentForm({
                                  fullName: student.fullName || '',
                                  registerNumber: student.registerNumber || '',
                                  gender: student.gender || 'Male',
                                  dob: student.dob || '',
                                  email: student.email || '',
                                  phone: student.phone || '',
                                  department: student.department || '',
                                  course: student.course || '',
                                  semester: student.semester || 'Semester 1',
                                  section: student.section || 'A',
                                  academicYear: student.academicYear || '2024-2028'
                                });
                                if (student.photoUrl) {
                                  setPhotoPreview(`http://localhost:5000/${student.photoUrl}`);
                                } else {
                                  setPhotoPreview('');
                                }
                                setShowDropdown(false);
                              }}
                              className="w-full text-left p-2.5 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2.5 transition-colors"
                            >
                              {student.photoUrl ? (
                                <img src={`http://localhost:5000/${student.photoUrl}`} alt={student.fullName} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                  {student.fullName.charAt(0)}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0 font-sans">
                                <span className="text-xs font-bold text-gray-900 truncate">{student.fullName}</span>
                                <span className="text-[10px] text-gray-500 font-medium">
                                  {student.registerNumber} • {student.department || 'GEN'} • Sem {student.semester?.replace('Semester ', '') || '1'} {student.section || 'A'}
                                </span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rest of the fields */}
                  {[['fullName','Full Name','text',true],
                    ['email','Email','email',true],['phone','Phone','text',false],
                    ['department','Department','text',true],['course','Course','text',true]].map(([name,label,type,req]) => (
                    <div key={name}>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{label}{req&&' *'}</label>
                      <input type={type} required={req} value={studentForm[name]}
                        onChange={e => setStudentForm(p=>({...p,[name]:e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Gender</label>
                    <select value={studentForm.gender} onChange={e=>setStudentForm(p=>({...p,gender:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500">
                      {['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Date of Birth</label>
                    <input type="date" value={studentForm.dob} onChange={e=>setStudentForm(p=>({...p,dob:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Semester</label>
                    <select value={studentForm.semester} onChange={e=>setStudentForm(p=>({...p,semester:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500">
                      {['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Section</label>
                    <input type="text" value={studentForm.section} onChange={e=>setStudentForm(p=>({...p,section:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Academic Year</label>
                    <input type="text" value={studentForm.academicYear} onChange={e=>setStudentForm(p=>({...p,academicYear:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  
                  {/* Buttons */}
                  <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                    {selectedStudentId && (
                      <button type="button" onClick={handleResetStudentForm}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all">
                        Cancel Update
                      </button>
                    )}
                    <button type="submit" disabled={formLoading}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70">
                      {formLoading ? 'Saving...' : selectedStudentId ? 'Update & Register Borrower' : 'Register Student Borrower'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStaffSubmit} className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left: Photo Upload Profile Card */}
                <div className="flex flex-col items-center justify-center p-5 bg-gray-50 border border-gray-200/60 rounded-2xl md:w-56 shrink-0 h-fit">
                  <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/20 bg-white flex items-center justify-center shadow-inner">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={defaultAvatar}
                        alt="Default Avatar"
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}

                    {/* Hover upload overlay */}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer text-xs font-semibold">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handlePhotoChange(e, 'staff')}
                        className="hidden"
                      />
                      <Upload size={18} className="mb-1" />
                      {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    </label>
                  </div>
                  
                  <div className="text-center mt-3">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Staff Photo</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG or WEBP (Max 10MB)</p>
                  </div>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview('');
                      }}
                      className="mt-3 text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100/50 hover:bg-rose-100/50 transition-colors"
                    >
                      <X size={12} /> Remove
                    </button>
                  )}
                </div>

                {/* Right: Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  
                  {/* Staff ID Input with Searchable Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Staff ID *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Search or enter Staff ID..."
                        value={staffForm.staffId}
                        onChange={e => {
                          setStaffForm(p => ({ ...p, staffId: e.target.value }));
                          setShowStaffDropdown(true);
                          if (selectedStaffId) {
                            setSelectedStaffId(null);
                          }
                        }}
                        onFocus={() => setShowStaffDropdown(true)}
                        onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-semibold"
                      />
                      {staffForm.staffId && (
                        <button
                          type="button"
                          onClick={handleResetStaffForm}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {showStaffDropdown && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {matchingStaff.length === 0 ? (
                          <div className="p-3 text-xs text-gray-400 text-center">No staff found</div>
                        ) : (
                          matchingStaff.map(staff => (
                            <button
                              key={staff.id}
                              type="button"
                              onClick={() => {
                                setSelectedStaffId(staff.id);
                                setStudentForm({
                                  fullName: staff.fullName || '',
                                  registerNumber: staff.registerNumber || '',
                                  gender: staff.gender || 'Male',
                                  dob: staff.dob || '',
                                  email: staff.email || '',
                                  phone: staff.phone || '',
                                  department: staff.department || '',
                                  course: staff.course || '',
                                  semester: staff.semester || 'Semester 1',
                                  section: staff.section || 'A',
                                  academicYear: staff.academicYear || '2024-2028'
                                });
                                setStaffForm({
                                  fullName: staff.fullName || '',
                                  staffId: staff.staffId || '',
                                  gender: staff.gender || 'Male',
                                  dob: staff.dob || '',
                                  email: staff.email || '',
                                  phone: staff.phone || '',
                                  department: staff.department || '',
                                  designation: staff.designation || '',
                                  teachingType: staff.teachingType || 'Teaching'
                                });
                                if (staff.photoUrl) {
                                  setPhotoPreview(`http://localhost:5000/${staff.photoUrl}`);
                                } else {
                                  setPhotoPreview('');
                                }
                                setShowStaffDropdown(false);
                              }}
                              className="w-full text-left p-2.5 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2.5 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                {staff.fullName.charAt(0)}
                              </div>
                              <div className="flex flex-col min-w-0 font-sans">
                                <span className="text-xs font-bold text-gray-900 truncate">{staff.fullName}</span>
                                <span className="text-[10px] text-gray-500 font-medium">
                                  {staff.staffId} • {staff.department || 'GEN'} • {staff.designation || 'Staff'}
                                </span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Other Fields */}
                  {[['fullName','Full Name','text',true],
                    ['email','Email','email',true],['phone','Phone','text',false],
                    ['department','Department','text',true],['designation','Designation','text',true]].map(([name,label,type,req]) => (
                    <div key={name}>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{label}{req&&' *'}</label>
                      <input type={type} required={req} value={staffForm[name]}
                        onChange={e => setStaffForm(p=>({...p,[name]:e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Gender</label>
                    <select value={staffForm.gender} onChange={e=>setStaffForm(p=>({...p,gender:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500">
                      {['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Date of Birth</label>
                    <input type="date" value={staffForm.dob} onChange={e=>setStaffForm(p=>({...p,dob:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Teaching Type</label>
                    <select value={staffForm.teachingType} onChange={e=>setStaffForm(p=>({...p,teachingType:e.target.value}))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500">
                      {['Teaching','Non-Teaching'].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  
                  {/* Buttons */}
                  <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                    {selectedStaffId && (
                      <button type="button" onClick={handleResetStaffForm}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all">
                        Cancel Update
                      </button>
                    )}
                    <button type="submit" disabled={formLoading}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70">
                      {formLoading ? 'Saving...' : selectedStaffId ? 'Update & Register Borrower' : 'Register Staff Borrower'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6">
        <button
          onClick={() => { setActiveTab('student'); setSearchTerm(''); setDepartmentFilter('All'); }}
          className={`pb-4 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'student' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <GraduationCap size={18} />
          Student Borrowers
        </button>
        <button
          onClick={() => { setActiveTab('staff'); setSearchTerm(''); setDepartmentFilter('All'); }}
          className={`pb-4 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'staff' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Briefcase size={18} />
          Staff Borrowers
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder={activeTab === 'student' ? 'Search students by name, reg number...' : 'Search staff by name, staff ID...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="All">All Departments</option>
            {departments.filter(d => d !== 'All').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Borrower List Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-100 font-semibold">
              <tr>
                <th className="px-6 py-4">Borrower Name</th>
                <th className="px-6 py-4">ID Number</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Active Loans</th>
                <th className="px-6 py-4">Max Limits</th>
                <th className="px-6 py-4">Fines Due</th>
                <th className="px-6 py-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p>Loading borrower list...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                    <UserCheck className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-lg font-bold text-gray-700">No borrowers found</p>
                    <p className="text-sm">Verify filters or register student profiles.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const activeCount = getActiveBorrowsCount(item.id, activeTab);
                  const maxLimit = activeTab === 'student' ? 3 : 7;
                  const fine = getFinesDue(item.id, activeTab);
                  const isBlocked = activeCount >= maxLimit || fine > 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.photoUrl ? `http://localhost:5000/${item.photoUrl}` : defaultAvatar}
                            alt={item.fullName}
                            className="w-10 h-10 object-cover rounded-full border border-gray-100"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{item.fullName}</span>
                            <span className="text-gray-400 text-xs">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {activeTab === 'student' ? item.registerNumber : item.staffId}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {item.department || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-extrabold ${activeCount > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                          {activeCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-semibold">
                        {maxLimit} books
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${fine > 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                          {fine > 0 ? `₹${fine}` : 'Nil'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max ${
                          isBlocked 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
                          {isBlocked ? 'Limit Reached / Fine Due' : 'Active / Approved'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddBorrower;
