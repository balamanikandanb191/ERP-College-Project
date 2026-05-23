import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, GraduationCap, Users, MapPin, Briefcase, Activity, 
  Upload, CheckCircle, ChevronRight, ChevronLeft, Save, 
  Camera, Shield, AlertCircle, Info, Calendar, CreditCard,
  DollarSign, Banknote, ShieldCheck, Key, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import IDCardPreview from './idcard/IDCardPreview';

const StaffModal = ({ isOpen, staff, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isAutoId, setIsAutoId] = useState(!staff?.staffId);
  const [showPassword, setShowPassword] = useState(false);
  
  const initialData = {
    // 1. Personal
    fullName: '',
    staffId: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    phone: '',
    alternatePhone: '',
    email: '',
    officialEmail: '',
    maritalStatus: 'Single',
    nationality: 'Indian',
    aadhaarNumber: '',
    panNumber: '',
    religion: '',
    community: '',
    photoUrl: '',
    
    // 2. Professional
    department: '',
    designation: '',
    teachingType: 'Teaching',
    qualification: '',
    specialization: '',
    experienceYears: 0,
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Permanent',
    role: 'Assistant Professor',
    assignedSubjects: '',
    timetableHandling: false,
    employeeStatus: 'Active',
    
    // 3. Salary
    basicSalary: 0,
    allowances: 0,
    salary: 0,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    pfNumber: '',
    salaryType: 'Monthly',
    workingHours: '9:00 AM - 5:00 PM',
    weeklyOff: 'Sunday',
    
    // 4. Address & Emergency
    permanentAddress: '',
    currentAddress: '',
    guardianName: '',
    emergencyPhone: '',
    emergencyAddress: '',
    
    // 5. System Access
    username: '',
    password: '',
    confirmPassword: '',
    allowLogin: true
  };

  const [formData, setFormData] = useState(() => ({
    ...initialData,
    ...(staff || {})
  }));

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const calculateCompletion = () => {
    const fields = Object.keys(initialData);
    const filledFields = fields.filter(f => {
      const val = formData[f];
      return val !== '' && val !== null && val !== undefined && val !== false && val !== 0;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const finalData = { ...formData };
    if (isAutoId && !staff) finalData.staffId = 'AUTO';
    
    onSave(finalData);
  };

  const steps = [
    { id: 'personal', title: 'Personal', icon: <User size={18} /> },
    { id: 'pro', title: 'Professional', icon: <Briefcase size={18} /> },
    { id: 'salary', title: 'Salary', icon: <Banknote size={18} /> },
    { id: 'address', title: 'Address & Emergency', icon: <MapPin size={18} /> },
    { id: 'docs', title: 'Documents', icon: <Upload size={18} /> },
    { id: 'access', title: 'Access & Review', icon: <Key size={18} /> }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div 
                className="w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-all overflow-hidden group relative"
                onClick={() => fileInputRef.current.click()}
              >
                {previewUrl || formData.photoUrl ? (
                  <img 
                    src={previewUrl || `http://localhost:5000/${formData.photoUrl}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <>
                    <Camera size={32} className="text-slate-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">Staff Photo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Official Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Staff Employee ID *</label>
                <div className="flex gap-2">
                  <input type="text" name="staffId" disabled={isAutoId} value={isAutoId ? 'AUTO-GENERATED' : formData.staffId} onChange={handleChange} placeholder="EMP2026XXX" className={`flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm ${isAutoId ? 'text-slate-400 font-bold italic' : ''}`} />
                  {!staff && (
                    <button type="button" onClick={() => setIsAutoId(!isAutoId)} className={`px-3 rounded-xl border transition-all flex items-center justify-center ${isAutoId ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`} title="Toggle Auto ID">
                      <ShieldCheck size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marital Status</label>
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                    <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">DOB</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">PAN Number</label>
                  <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm uppercase" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Personal Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Briefcase size={18} className="text-blue-500"/> Employment Info</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department *</label>
                  <select name="department" required value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                    <option value="">Select Department</option>
                    <option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical</option><option>Civil</option><option>Administration</option><option>Accounts</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teaching Type</label>
                    <select name="teachingType" value={formData.teachingType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                      <option>Teaching</option><option>Non-Teaching</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employment Type</label>
                    <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                      <option>Permanent</option><option>Contract</option><option>Visiting Faculty</option><option>Guest Lecturer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Official Staff Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                    <option>Professor</option><option>Assistant Professor</option><option>HOD</option><option>Lab Assistant</option><option>Office Staff</option><option>Librarian</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><GraduationCap size={18} className="text-emerald-500"/> Qualifications</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Highest Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. PhD, M.Tech" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Specialization</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Artificial Intelligence" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Experience (Years)</label>
                    <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Joining Date</label>
                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><DollarSign size={18} className="text-emerald-500"/> Remuneration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Basic Salary (₹)</label>
                    <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Allowances (₹)</label>
                    <input type="number" name="allowances" value={formData.allowances} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                   <span className="text-xs font-bold text-emerald-700 uppercase">Estimated Monthly Payout</span>
                   <span className="text-xl font-black text-emerald-800">₹{Number(formData.basicSalary || 0) + Number(formData.allowances || 0)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary Type</label>
                    <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                      <option>Monthly</option><option>Hourly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">PF Number</label>
                    <input type="text" name="pfNumber" value={formData.pfNumber} onChange={handleChange} placeholder="UAN Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Banknote size={18} className="text-blue-500"/> Bank Details</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bank Name</label>
                  <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Account Number</label>
                  <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="0000 0000 0000 00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">IFSC Code</label>
                  <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="HDFC0001234" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm uppercase" />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><MapPin size={18} className="text-rose-500"/> Address Details</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Permanent Address</label>
                  <textarea name="permanentAddress" rows="3" value={formData.permanentAddress} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Address</label>
                  <textarea name="currentAddress" rows="3" value={formData.currentAddress} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"></textarea>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><AlertCircle size={18} className="text-amber-500"/> Emergency Contact</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Guardian / Spouse Name</label>
                  <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Emergency Phone</label>
                  <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Emergency Address</label>
                  <textarea name="emergencyAddress" rows="2" value={formData.emergencyAddress} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-wider text-sm"><Upload size={18} className="text-slate-400"/> Documents Checklist</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Aadhaar Card', 'PAN Card', 'Degree Cert', 'Exp Letter', 'Resume', 'Photo'].map(doc => (
                <div key={doc} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-white transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <Upload size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase text-center">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full space-y-6">
                <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">ERP System Access</h3>
                      <p className="text-slate-400 text-sm">Create staff login credentials</p>
                    </div>
                    <Key size={24} className="text-blue-400" />
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="e.g. jd_2026" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-slate-400 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm</label>
                        <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="allowLogin" checked={formData.allowLogin} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm font-bold text-slate-300">Grant ERP Access</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><Info size={20} /></div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm mb-1">Onboarding Checklist</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">Once saved, this staff member will be visible in the payroll system and timetable manager. Official email will be used for all internal communications.</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[350px] shrink-0">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 px-2"><CreditCard size={18} className="text-blue-500" /> Digital ID Preview</h4>
                <div className="scale-90 origin-top">
                  <IDCardPreview type="Staff" data={formData} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-white shrink-0">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <Users size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {staff ? 'Edit Staff Profile' : 'Staff Onboarding'}
                </h2>
              </div>
              <p className="text-slate-500 font-medium ml-1">Establish new employee records for the academic year</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Onboarding</span>
                  <span className="text-sm font-black text-blue-600">{calculateCompletion()}%</span>
                </div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${calculateCompletion()}%` }}></div>
                </div>
              </div>
              <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex items-center gap-2 cursor-pointer transition-all shrink-0 ${currentStep === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  onClick={() => setCurrentStep(idx)}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${currentStep === idx ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' : 'bg-slate-100 text-slate-500'}`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider hidden lg:block ${currentStep === idx ? 'text-blue-600' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && <div className="h-0.5 w-4 md:w-8 bg-slate-100 shrink-0"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {renderStepContent()}
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <button 
            type="button" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all disabled:opacity-0"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          
          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
              >
                Next Section <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                type="submit"
                className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all scale-105 active:scale-100"
              >
                <Save size={18} /> {staff ? 'Update Records' : 'Complete Onboarding'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;
