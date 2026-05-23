import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, GraduationCap, Users, MapPin, Bus, Activity, 
  Upload, CheckCircle, ChevronRight, ChevronLeft, Save, 
  Camera, Shield, AlertCircle, Info, Calendar, CreditCard,
  Droplet, Award, Building, Phone, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import IDCardPreview from './idcard/IDCardPreview';

const StudentModal = ({ isOpen, student, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const initialData = {
    // 1. Personal
    fullName: '',
    registerNumber: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    nationality: 'Indian',
    religion: '',
    community: '',
    aadhaarNumber: '',
    idMark1: '',
    idMark2: '',
    photoUrl: '',
    
    // 2. Academic
    department: '',
    course: '',
    degree: 'B.E.',
    academicYear: '2023-2027',
    semester: 'Semester 1',
    section: 'A',
    admissionType: 'Government Quota',
    previousInstitution: '',
    percentage10th: '',
    percentage12th: '',
    cutoffMark: '',
    entranceScore: '',
    tcNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    
    // 3. Parent
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    fatherIncome: '',
    motherName: '',
    motherPhone: '',
    motherOccupation: '',
    guardianName: '',
    emergencyContact: '',
    parentAddress: '',
    
    // 4. Address
    permanentAddress: '',
    communicationAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // 5. Hostel & Transport
    hostelRequired: false,
    roomPreference: '4-Sharing',
    busRequired: false,
    busRoute: '',
    pickupPoint: '',
    
    // 6. Medical & Status
    disabilityDetails: '',
    allergies: '',
    medicalConditions: '',
    medicalNotes: '',
    admissionStatus: 'Pending',
    feesPaid: 'Pending',
    attendancePercentage: 0
  };

  const [formData, setFormData] = useState(() => ({ 
    ...initialData, 
    ...(student || {}) 
  }));
  const [isAutoReg, setIsAutoReg] = useState(!student?.registerNumber);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Auto-save to localStorage for drafts
  useEffect(() => {
    if (!student) {
      const draft = localStorage.getItem('student_admission_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to load draft", e);
        }
      }
    }
  }, [student]);

  useEffect(() => {
    if (!student && currentStep > 0) {
      localStorage.setItem('student_admission_draft', JSON.stringify(formData));
    }
  }, [formData, currentStep, student]);

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
    const fields = Object.keys(initialData || {});
    if (fields.length === 0) return 0;
    const filledFields = fields.filter(f => {
      const val = formData?.[f];
      return val !== '' && val !== null && val !== undefined && val !== false;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isAutoReg && !student) {
      const finalData = { ...formData, registerNumber: 'AUTO' };
      onSave(finalData);
    } else {
      onSave(formData);
    }
    
    if (!student) localStorage.removeItem('student_admission_draft');
  };

  const steps = [
    { id: 'personal', title: 'Personal', icon: <User size={18} /> },
    { id: 'academic', title: 'Academic', icon: <GraduationCap size={18} /> },
    { id: 'family', title: 'Family & Address', icon: <Users size={18} /> },
    { id: 'campus', title: 'Campus Life', icon: <Bus size={18} /> },
    { id: 'medical', title: 'Medical', icon: <Activity size={18} /> },
    { id: 'review', title: 'Review', icon: <CheckCircle size={18} /> }
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
                    <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">Upload Photo</span>
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
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="As per 10th Marksheet" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Register Number *</label>
                <div className="flex gap-2">
                  <input type="text" name="registerNumber" disabled={isAutoReg} value={isAutoReg ? 'AUTO-GENERATED' : formData.registerNumber} onChange={handleChange} placeholder="e.g. REG2023001" className={`flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm ${isAutoReg ? 'text-slate-400 font-bold italic' : ''}`} />
                  {!student && (
                    <button type="button" onClick={() => setIsAutoReg(!isAutoReg)} className={`px-3 rounded-xl border transition-all flex items-center justify-center ${isAutoReg ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`} title={isAutoReg ? "Click to enter manually" : "Click to auto-generate"}>
                      <Shield size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Aadhaar Number</label>
                  <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="0000 0000 0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Personal Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><GraduationCap size={18} className="text-indigo-500"/> Current Course</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department *</label>
                  <select name="department" required value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm">
                    <option value="">Select Department</option>
                    <option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical</option><option>Civil</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Degree</label>
                    <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Academic Year</label>
                    <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Admission Type</label>
                  <select name="admissionType" value={formData.admissionType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm">
                    <option>Government Quota</option><option>Management</option><option>Scholarship</option><option>Lateral Entry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Shield size={18} className="text-emerald-500"/> Previous Academics</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Previous School/College</label>
                  <input type="text" name="previousInstitution" value={formData.previousInstitution} onChange={handleChange} placeholder="Name of institution" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">10th Percentage (%)</label>
                    <input type="number" name="percentage10th" value={formData.percentage10th} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">12th Percentage (%)</label>
                    <input type="number" name="percentage12th" value={formData.percentage12th} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cutoff Mark</label>
                    <input type="number" name="cutoffMark" value={formData.cutoffMark} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">TC Number</label>
                    <input type="text" name="tcNumber" value={formData.tcNumber} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
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
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Users size={18} className="text-amber-500"/> Parent Details</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Father's Name</label>
                  <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Father's Phone</label>
                    <input type="tel" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Annual Income</label>
                    <input type="text" name="fatherIncome" value={formData.fatherIncome} onChange={handleChange} placeholder="₹ 0.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mother's Name</label>
                  <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Emergency Contact Number</label>
                  <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><MapPin size={18} className="text-rose-500"/> Address Information</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Permanent Address</label>
                  <textarea name="permanentAddress" rows="3" value={formData.permanentAddress} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-3xl border-2 transition-all ${formData.hostelRequired ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${formData.hostelRequired ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Hostel Service</h3>
                      <p className="text-xs text-slate-500">Accommodation & Mess</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="hostelRequired" checked={formData.hostelRequired} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                {formData.hostelRequired && (
                  <div className="space-y-4 animate-scale-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Room Preference</label>
                      <select name="roomPreference" value={formData.roomPreference} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
                        <option>Single AC</option><option>Single Non-AC</option><option>2-Sharing</option><option>4-Sharing</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-6 rounded-3xl border-2 transition-all ${formData.busRequired ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${formData.busRequired ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Bus size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Transport Service</h3>
                      <p className="text-xs text-slate-500">College Bus facility</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="busRequired" checked={formData.busRequired} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {formData.busRequired && (
                  <div className="space-y-4 animate-scale-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bus Route</label>
                      <select name="busRoute" value={formData.busRoute} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm">
                        <option value="">Select Route...</option>
                        <option>Route 1 - City Center</option><option>Route 2 - North Suburbs</option><option>Route 3 - South Gate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pickup Point</label>
                      <input type="text" name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} placeholder="Near Landmark" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Activity size={18} className="text-indigo-500"/> Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Medical Conditions</label>
                  <textarea name="medicalConditions" rows="3" value={formData.medicalConditions} onChange={handleChange} placeholder="List any existing conditions" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Allergies</label>
                  <textarea name="allergies" rows="3" value={formData.allergies} onChange={handleChange} placeholder="Food, Medicine, or other allergies" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm resize-none"></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-wider text-sm"><Upload size={18} className="text-slate-400"/> Required Documents</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['Aadhaar', '10th Mark', '12th Mark', 'Transfer Cert'].map(doc => (
                  <div key={doc} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-white transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Upload size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase text-center">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full space-y-6">
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Admission Review</h3>
                      <p className="text-indigo-100 text-sm opacity-80">Verify all details before final submission</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                      <CreditCard size={24} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-sm opacity-70">Student Name</span>
                      <span className="font-bold">{formData.fullName || '---'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-sm opacity-70">Department</span>
                      <span className="font-bold">{formData.department || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm opacity-70">Admission Status</span>
                      <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-black uppercase">{formData.admissionStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><Info size={16} className="text-indigo-500" /> Final Step Instructions</h4>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                    <li>Ensure the <strong>Aadhaar Number</strong> is correct for government verification.</li>
                    <li>Digital ID Card will be generated automatically upon approval.</li>
                    <li>Parent login credentials will be sent to the registered mobile number.</li>
                  </ul>
                  <div className="pt-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Admission Status</label>
                    <select name="admissionStatus" value={formData.admissionStatus} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
                      <option>Pending</option><option>Verified</option><option>Approved</option><option>Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[350px] shrink-0">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 px-2"><CreditCard size={18} className="text-indigo-500" /> ID Card Preview</h4>
                <div className="scale-90 origin-top">
                  <IDCardPreview type="Student" data={formData} />
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-white shrink-0">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                  <GraduationCap size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {student ? 'Edit Profile' : 'Student Admission'}
                </h2>
              </div>
              <p className="text-slate-500 font-medium ml-1">Complete the enrollment process with ease</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Progress</span>
                  <span className="text-sm font-black text-indigo-600">{calculateCompletion()}%</span>
                </div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-700 ease-out"
                    style={{ width: `${calculateCompletion()}%` }}
                  ></div>
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
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${currentStep === idx ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' : 'bg-slate-100 text-slate-500'}`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider hidden lg:block ${currentStep === idx ? 'text-indigo-600' : 'text-slate-500'}`}>
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
                className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                type="submit"
                className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all scale-105 active:scale-100"
              >
                <Save size={18} /> {student ? 'Update Profile' : 'Finalize Admission'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
