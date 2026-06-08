import React, { useState, useMemo } from 'react';
import { 
  Save, 
  User, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Info, 
  CreditCard, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Upload, 
  X, 
  RotateCcw, 
  Eye, 
  ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../../hooks/useMasterData';

const StudentRegister = () => {
  const { records: registrations, addRecord, deleteRecord } = useMasterData('student_register');
  const { records: applications } = useMasterData('application_issue');
  const { records: classes } = useMasterData('class_master');
  
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'personal', 'bank', 'address', 'education', 'course'
  const [searchQuery, setSearchQuery] = useState('');

  // Course options from ClassMaster depts field
  const courses = useMemo(() => {
    const set = new Set();
    classes.forEach(c => {
      if (c.depts) {
        const list = typeof c.depts === 'string' ? c.depts.split(',') : c.depts;
        if (Array.isArray(list)) {
          list.forEach(d => {
            const trimmed = d.trim();
            if (trimmed) set.add(trimmed);
          });
        }
      }
    });
    if (set.size === 0) {
      return ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
    }
    return Array.from(set);
  }, [classes]);

  const [form, setForm] = useState({
    applicationNo: '',
    studentName: '',
    gender: 'Male',
    dob: '',
    age: '',
    email: '',
    bloodGroup: 'O+',
    
    // Personal Details
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    fatherIncome: '',
    motherName: '',
    motherPhone: '',
    motherOccupation: '',
    motherIncome: '',
    guardianName: '',
    guardianPhone: '',
    guardianOccupation: '',
    guardianRelation: '',
    guardianIncome: '',
    nationality: 'Indian',
    religion: '',
    community: '',
    caste: '',
    physicallyChallenged: 'No',
    aadharNumber: '',
    motherTongue: 'Tamil',
    emisNumber: '',
    mediumOfInstruction: 'English',
    photoUrl: '',

    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',

    // Address
    permanentDistrict: '',
    permanentState: 'Tamil Nadu',
    permanentPincode: '',
    permanentAddress: '',
    currentDistrict: '',
    currentState: 'Tamil Nadu',
    currentPincode: '',
    currentAddress: '',

    // Education
    tenthSchool: '',
    tenthBoard: 'State Board',
    tenthScore: '',
    tenthYear: '2024',
    twelfthSchool: '',
    twelfthBoard: 'State Board',
    twelfthScore: '',
    twelfthYear: '2026',

    // Course Details
    academicYear: '2025-2026',
    course: 'Computer Science',
    admissionType: 'Regular',
    admissionDate: new Date().toISOString().split('T')[0],
    section: 'A',
    semester: 'Semester 1',
    rollNumber: '',
    registerNumber: '',
    reference: 'Direct',
    admissionStatus: 'Pending',
    scholarshipRequired: 'No',
    bankLoanRequired: 'No',
    hostelRequired: 'No',
    transportRequired: 'No'
  });

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : '';
  };

  const handleDOBChange = (e) => {
    const dobVal = e.target.value;
    const ageVal = calculateAge(dobVal);
    setForm(prev => ({
      ...prev,
      dob: dobVal,
      age: ageVal
    }));
  };

  const handleSelectApplication = (appNo) => {
    if (!appNo) return;
    const app = applications.find(a => a.applicationNo === appNo);
    if (app) {
      setForm(prev => ({
        ...prev,
        applicationNo: app.applicationNo,
        studentName: app.name || '',
        gender: app.gender || 'Male',
        community: app.community || '',
        fatherName: app.parentName || '',
        fatherPhone: app.parentMobile || '',
        permanentAddress: app.address || '',
        currentAddress: app.address || '',
        course: app.standard || 'Computer Science'
      }));
      toast.success(`Auto-filled details for Application No: ${appNo}`);
    } else {
      setForm(prev => ({ ...prev, applicationNo: appNo }));
    }
  };

  const handleCopyAddress = () => {
    setForm(prev => ({
      ...prev,
      currentDistrict: prev.permanentDistrict,
      currentState: prev.permanentState,
      currentPincode: prev.permanentPincode,
      currentAddress: prev.permanentAddress
    }));
    toast.success('Address copied successfully!');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photoUrl: reader.result }));
        toast.success('Photo loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setForm({
      applicationNo: '',
      studentName: '',
      gender: 'Male',
      dob: '',
      age: '',
      email: '',
      bloodGroup: 'O+',
      fatherName: '',
      fatherPhone: '',
      fatherOccupation: '',
      fatherIncome: '',
      motherName: '',
      motherPhone: '',
      motherOccupation: '',
      motherIncome: '',
      guardianName: '',
      guardianPhone: '',
      guardianOccupation: '',
      guardianRelation: '',
      guardianIncome: '',
      nationality: 'Indian',
      religion: '',
      community: '',
      caste: '',
      physicallyChallenged: 'No',
      aadharNumber: '',
      motherTongue: 'Tamil',
      emisNumber: '',
      mediumOfInstruction: 'English',
      photoUrl: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
      permanentDistrict: '',
      permanentState: 'Tamil Nadu',
      permanentPincode: '',
      permanentAddress: '',
      currentDistrict: '',
      currentState: 'Tamil Nadu',
      currentPincode: '',
      currentAddress: '',
      tenthSchool: '',
      tenthBoard: 'State Board',
      tenthScore: '',
      tenthYear: '2024',
      twelfthSchool: '',
      twelfthBoard: 'State Board',
      twelfthScore: '',
      twelfthYear: '2026',
      academicYear: '2025-2026',
      course: 'Computer Science',
      admissionType: 'Regular',
      admissionDate: new Date().toISOString().split('T')[0],
      section: 'A',
      semester: 'Semester 1',
      rollNumber: '',
      registerNumber: '',
      reference: 'Direct',
      admissionStatus: 'Pending',
      scholarshipRequired: 'No',
      bankLoanRequired: 'No',
      hostelRequired: 'No',
      transportRequired: 'No'
    });
    toast.success('Form cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName) {
      toast.error('Student Name is required');
      setActiveTab('basic');
      return;
    }
    if (!form.applicationNo) {
      toast.error('Application No is required');
      setActiveTab('basic');
      return;
    }

    try {
      // Split names for legacy display compatibility
      const nameParts = form.studentName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const regPayload = {
        ...form,
        firstName,
        lastName,
        phone: form.fatherPhone || form.motherPhone || '',
        prevSchool: form.tenthSchool,
        prevMarks: form.tenthScore,
        prevBoard: form.tenthBoard,
        interestedCourse: form.course,
        quota: form.admissionType,
        status: 'Pending Review',
        regDate: new Date().toLocaleDateString('en-IN')
      };

      const res = await addRecord(regPayload);
      if (res.success) {
        toast.success('Student registered successfully in queue!');
        clearForm();
        setActiveTab('basic');
      }
    } catch (err) {
      toast.error('Registration failed: ' + err.message);
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => 
      (r.studentName || `${r.firstName} ${r.lastName}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.applicationNo && r.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [registrations, searchQuery]);

  return (
    <div className="w-full px-6 py-8 space-y-6">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span>Admission</span>
            <ChevronRight size={10} />
            <span className="text-violet-600">Student Register</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mt-1">
            <GraduationCap className="text-violet-600 w-7 h-7" />
            Student Register
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            Fill accurate details to register or update student information
          </p>
        </div>

        <button 
          onClick={() => setViewMode(viewMode === 'form' ? 'list' : 'form')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all duration-300 border ${
            viewMode === 'form' 
              ? 'bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {viewMode === 'form' ? (
            <>
              <Eye size={14} /> Student List
            </>
          ) : (
            <>
              <ArrowLeft size={14} /> Back to Form
            </>
          )}
        </button>
      </div>

      {viewMode === 'form' ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          
          {/* Tab Navigation Headers */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {[
              { id: 'basic', label: 'Basic Information', icon: FileText },
              { id: 'personal', label: 'Personal Details', icon: User },
              { id: 'bank', label: 'Bank Details', icon: CreditCard },
              { id: 'address', label: 'Address', icon: MapPin },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'course', label: 'Course Details', icon: BookOpen }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border ${
                    isActive 
                      ? 'bg-blue-50/50 text-blue-600 border-blue-100 shadow-sm' 
                      : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
                  }`}
                >
                  <IconComp size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Info Alert Box */}
          <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
            <Info size={16} className="text-blue-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-blue-700">
              Please fill all the required details below to proceed
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Application No Search Selection */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Application No *
                    </label>
                    <div className="relative">
                      <select 
                        value={form.applicationNo}
                        onChange={(e) => handleSelectApplication(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-slate-700"
                      >
                        <option value="">Select or search Application No</option>
                        {applications.map(app => (
                          <option key={app.id} value={app.applicationNo}>
                            {app.applicationNo} - {app.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Student Name *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter student name"
                      value={form.studentName}
                      onChange={(e) => setForm(prev => ({ ...prev, studentName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Gender *
                    </label>
                    <select 
                      value={form.gender}
                      onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-slate-700"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Date of Birth *
                    </label>
                    <input 
                      type="date" 
                      value={form.dob}
                      onChange={handleDOBChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Age *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Auto-calculated"
                      value={form.age}
                      disabled
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter email address"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Blood Group
                    </label>
                    <select 
                      value={form.bloodGroup}
                      onChange={(e) => setForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-slate-700"
                    >
                      <option>O+</option>
                      <option>O-</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL DETAILS */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <User size={14} className="text-blue-500" />
                  Family & Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Father Details */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Father's Name</label>
                    <input type="text" placeholder="Enter father's name" value={form.fatherName} onChange={(e) => setForm(prev => ({ ...prev, fatherName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Father Mobile</label>
                    <input type="text" placeholder="10-digit number" value={form.fatherPhone} onChange={(e) => setForm(prev => ({ ...prev, fatherPhone: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Father Occupation</label>
                    <input type="text" placeholder="Enter father's occupation" value={form.fatherOccupation} onChange={(e) => setForm(prev => ({ ...prev, fatherOccupation: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Father Annual Income</label>
                    <input type="text" placeholder="Enter annual income" value={form.fatherIncome} onChange={(e) => setForm(prev => ({ ...prev, fatherIncome: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>

                  {/* Mother Details */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Mother's Name</label>
                    <input type="text" placeholder="Enter mother's name" value={form.motherName} onChange={(e) => setForm(prev => ({ ...prev, motherName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Mother Mobile</label>
                    <input type="text" placeholder="10-digit number" value={form.motherPhone} onChange={(e) => setForm(prev => ({ ...prev, motherPhone: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Mother Occupation</label>
                    <input type="text" placeholder="Enter mother's occupation" value={form.motherOccupation} onChange={(e) => setForm(prev => ({ ...prev, motherOccupation: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Mother Annual Income</label>
                    <input type="text" placeholder="Enter annual income" value={form.motherIncome} onChange={(e) => setForm(prev => ({ ...prev, motherIncome: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>

                  {/* Guardian Details */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block block block block mb-1">Guardian Name</label>
                    <input type="text" placeholder="Enter guardian name" value={form.guardianName} onChange={(e) => setForm(prev => ({ ...prev, guardianName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Guardian Mobile</label>
                    <input type="text" placeholder="10-digit number" value={form.guardianPhone} onChange={(e) => setForm(prev => ({ ...prev, guardianPhone: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Guardian Occupation</label>
                    <input type="text" placeholder="Enter guardian's occupation" value={form.guardianOccupation} onChange={(e) => setForm(prev => ({ ...prev, guardianOccupation: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Guardian Relation</label>
                    <input type="text" placeholder="Enter relation" value={form.guardianRelation} onChange={(e) => setForm(prev => ({ ...prev, guardianRelation: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>

                  {/* Identity and Demographics */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Nationality</label>
                    <input type="text" placeholder="Indian" value={form.nationality} onChange={(e) => setForm(prev => ({ ...prev, nationality: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Religion</label>
                    <input type="text" placeholder="Enter religion" value={form.religion} onChange={(e) => setForm(prev => ({ ...prev, religion: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Community</label>
                    <input type="text" placeholder="Enter community" value={form.community} onChange={(e) => setForm(prev => ({ ...prev, community: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Caste</label>
                    <input type="text" placeholder="Enter caste" value={form.caste} onChange={(e) => setForm(prev => ({ ...prev, caste: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Physically Challenged</label>
                    <select value={form.physicallyChallenged} onChange={(e) => setForm(prev => ({ ...prev, physicallyChallenged: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700">
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Aadhar Number</label>
                    <input type="text" placeholder="12-digit number" value={form.aadharNumber} onChange={(e) => setForm(prev => ({ ...prev, aadharNumber: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Mother Tongue</label>
                    <input type="text" placeholder="Tamil" value={form.motherTongue} onChange={(e) => setForm(prev => ({ ...prev, motherTongue: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">EMIS Number</label>
                    <input type="text" placeholder="Enter EMIS number" value={form.emisNumber} onChange={(e) => setForm(prev => ({ ...prev, emisNumber: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Medium of Instruction</label>
                    <input type="text" placeholder="English" value={form.mediumOfInstruction} onChange={(e) => setForm(prev => ({ ...prev, mediumOfInstruction: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                </div>

                {/* Photo Upload Box */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wide block">Photo Upload</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
                    {form.photoUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={form.photoUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border shadow-sm" />
                        <button type="button" onClick={() => setForm(prev => ({ ...prev, photoUrl: '' }))} className="text-[10px] text-red-600 font-bold hover:underline flex items-center gap-1">
                          <X size={10} /> Remove photo
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <Upload size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500">No photo selected</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-blue-700 inline-block shadow-sm">
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BANK DETAILS */}
            {activeTab === 'bank' && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-blue-500" />
                  Student Bank Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Bank Name</label>
                    <input type="text" placeholder="Enter bank name" value={form.bankName} onChange={(e) => setForm(prev => ({ ...prev, bankName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Account Number</label>
                    <input type="text" placeholder="Enter account number" value={form.accountNumber} onChange={(e) => setForm(prev => ({ ...prev, accountNumber: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">IFSC Code</label>
                    <input type="text" placeholder="Enter IFSC code" value={form.ifscCode} onChange={(e) => setForm(prev => ({ ...prev, ifscCode: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Branch Name</label>
                    <input type="text" placeholder="Enter branch name" value={form.branchName} onChange={(e) => setForm(prev => ({ ...prev, branchName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ADDRESS */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                
                {/* Permanent Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    Permanent Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Permanent District</label>
                      <input type="text" placeholder="Select District" value={form.permanentDistrict} onChange={(e) => setForm(prev => ({ ...prev, permanentDistrict: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Permanent State</label>
                      <input type="text" placeholder="Tamil Nadu" value={form.permanentState} onChange={(e) => setForm(prev => ({ ...prev, permanentState: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Permanent Pincode</label>
                      <input type="text" placeholder="Enter pincode" value={form.permanentPincode} onChange={(e) => setForm(prev => ({ ...prev, permanentPincode: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Permanent Address</label>
                    <textarea rows="3" placeholder="Enter permanent address" value={form.permanentAddress} onChange={(e) => setForm(prev => ({ ...prev, permanentAddress: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                </div>

                {/* Same as Permanent Address Button */}
                <div className="flex">
                  <button 
                    type="button" 
                    onClick={handleCopyAddress} 
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Same as Permanent Address
                  </button>
                </div>

                {/* Current Address */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    Current Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Current District</label>
                      <input type="text" placeholder="Select District" value={form.currentDistrict} onChange={(e) => setForm(prev => ({ ...prev, currentDistrict: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Current State</label>
                      <input type="text" placeholder="Tamil Nadu" value={form.currentState} onChange={(e) => setForm(prev => ({ ...prev, currentState: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Current Pincode</label>
                      <input type="text" placeholder="Enter pincode" value={form.currentPincode} onChange={(e) => setForm(prev => ({ ...prev, currentPincode: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Current Address</label>
                    <textarea rows="3" placeholder="Enter current address" value={form.currentAddress} onChange={(e) => setForm(prev => ({ ...prev, currentAddress: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                
                {/* 10th Standard Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-blue-500" />
                    10th Class Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">10th School Name</label>
                      <input type="text" placeholder="Enter school name" value={form.tenthSchool} onChange={(e) => setForm(prev => ({ ...prev, tenthSchool: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">10th Board</label>
                      <select value={form.tenthBoard} onChange={(e) => setForm(prev => ({ ...prev, tenthBoard: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700">
                        <option>State Board</option>
                        <option>CBSE</option>
                        <option>ICSE</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">10th Score (%)</label>
                      <input type="text" placeholder="e.g. 85%" value={form.tenthScore} onChange={(e) => setForm(prev => ({ ...prev, tenthScore: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">10th Year</label>
                      <input type="text" placeholder="e.g. 2024" value={form.tenthYear} onChange={(e) => setForm(prev => ({ ...prev, tenthYear: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                  </div>
                </div>

                {/* 12th Standard Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-blue-500" />
                    12th Class Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">12th School Name</label>
                      <input type="text" placeholder="Enter school name" value={form.twelfthSchool} onChange={(e) => setForm(prev => ({ ...prev, twelfthSchool: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">12th Board</label>
                      <select value={form.twelfthBoard} onChange={(e) => setForm(prev => ({ ...prev, twelfthBoard: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700">
                        <option>State Board</option>
                        <option>CBSE</option>
                        <option>ICSE</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">12th Score (%)</label>
                      <input type="text" placeholder="e.g. 85%" value={form.twelfthScore} onChange={(e) => setForm(prev => ({ ...prev, twelfthScore: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">12th Year</label>
                      <input type="text" placeholder="e.g. 2026" value={form.twelfthYear} onChange={(e) => setForm(prev => ({ ...prev, twelfthYear: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: COURSE DETAILS */}
            {activeTab === 'course' && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-500" />
                  Academic Details (School Context)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      STANDARD/CLASS *
                    </label>
                    <select 
                      value={form.course} 
                      onChange={(e) => setForm(prev => ({ ...prev, course: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    >
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      SECTION *
                    </label>
                    <select 
                      value={form.section} 
                      onChange={(e) => setForm(prev => ({ ...prev, section: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      SEMESTER *
                    </label>
                    <select 
                      value={form.semester} 
                      onChange={(e) => setForm(prev => ({ ...prev, semester: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    >
                      {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Year 1', 'Year 2', 'Year 3'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      ACADEMIC YEAR *
                    </label>
                    <select 
                      value={form.academicYear} 
                      onChange={(e) => setForm(prev => ({ ...prev, academicYear: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    >
                      <option>2025-2026</option>
                      <option>2024-2025</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      ADMISSION DATE
                    </label>
                    <input 
                      type="date" 
                      value={form.admissionDate} 
                      onChange={(e) => setForm(prev => ({ ...prev, admissionDate: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      ROLL NUMBER *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter Roll Number"
                      value={form.rollNumber} 
                      onChange={(e) => setForm(prev => ({ ...prev, rollNumber: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      REGISTER NUMBER *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter Register Number"
                      value={form.registerNumber} 
                      onChange={(e) => setForm(prev => ({ ...prev, registerNumber: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      REFERENCE
                    </label>
                    <select 
                      value={form.reference} 
                      onChange={(e) => setForm(prev => ({ ...prev, reference: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                    >
                      <option>Direct</option>
                      <option>Alumni</option>
                      <option>Staff</option>
                      <option>Consultant</option>
                      <option>Social Media</option>
                      <option>Newspaper</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      ADMISSION STATUS *
                    </label>
                    <select 
                      value={form.admissionStatus} 
                      onChange={(e) => setForm(prev => ({ ...prev, admissionStatus: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                      required
                    >
                      <option>Pending</option>
                      <option>Verified</option>
                      <option>Approved</option>
                      <option>Admitted</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Admission Type</label>
                    <select value={form.admissionType} onChange={(e) => setForm(prev => ({ ...prev, admissionType: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700">
                      <option>Regular</option>
                      <option>Management</option>
                      <option>Sports Quota</option>
                      <option>Government</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 pt-4">
                  <Info size={14} className="text-blue-500" />
                  Other Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      SCHOLARSHIP REQUIRED?
                    </label>
                    <select 
                      value={form.scholarshipRequired} 
                      onChange={(e) => setForm(prev => ({ ...prev, scholarshipRequired: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      BANK LOAN REQUIRED?
                    </label>
                    <select 
                      value={form.bankLoanRequired} 
                      onChange={(e) => setForm(prev => ({ ...prev, bankLoanRequired: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      HOSTEL REQUIRED?
                    </label>
                    <select 
                      value={form.hostelRequired} 
                      onChange={(e) => setForm(prev => ({ ...prev, hostelRequired: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      TRANSPORT REQUIRED?
                    </label>
                    <select 
                      value={form.transportRequired} 
                      onChange={(e) => setForm(prev => ({ ...prev, transportRequired: e.target.value }))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-700"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={clearForm}
                className="px-5 py-3 border border-orange-200 hover:bg-orange-50 text-orange-600 font-bold rounded-2xl text-xs flex items-center gap-2 transition-colors"
              >
                <RotateCcw size={14} /> Clear Form
              </button>
              <button 
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/10 transition-colors"
              >
                <Save size={14} /> Register Student
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* LIST VIEW OF REGISTERED STUDENTS */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
          
          {/* Search bar block */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search by student name, application no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:bg-white focus:border-violet-500 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>
            
            <div className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              Total Registrations: {registrations.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">App No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Age / DOB</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Academic Year</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredRegistrations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-black text-violet-700 text-xs">
                      {r.applicationNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-800">{r.studentName || `${r.firstName} ${r.lastName}`}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{r.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">{r.gender}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{r.dob}</div>
                      <div className="text-[10px] text-slate-400 font-bold">Age: {r.age || calculateAge(r.dob)}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      <div>{r.course || r.interestedCourse}</div>
                      {r.semester && <div className="text-[10px] text-slate-400 font-bold">{r.semester}</div>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">{r.academicYear || '2025-2026'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        r.status === 'Admitted' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {r.status || 'Pending Review'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this registration?')) {
                            deleteRecord(r.id);
                            toast.success('Registration deleted');
                          }
                        }}
                        className="p-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">
                      No student registrations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="w-full px-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-200/40 pt-6 text-[10px] font-bold text-slate-400 tracking-wider">
        <div>© 2026 SMS. All Rights Reserved.</div>
        <div className="flex items-center gap-1">
          <span>Made by</span>
          <a href="#" className="text-violet-600 hover:underline">Search First Technology</a>
        </div>
      </footer>
    </div>
  );
};

export default StudentRegister;
