import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, Building2, MapPin, Globe, Save, Image as ImageIcon, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddOfficerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    department: 'CSE',
    designation: 'Placement Coordinator',
    yearsOfExperience: '',
    officeRoomNumber: '',
    linkedinProfile: '',
    role: 'Placement Coordinator',
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      return toast.error('Name and Email are mandatory');
    }

    try {
      setLoading(true);
      // Logic for saving placement officer
      await api.post('/placement/officers', formData);
      toast.success('Placement Officer added successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to add officer:', error);
      toast.error('Failed to add officer');
    } finally {
      setLoading(false);
    }
  };

  const roles = ['TPO Head', 'Placement Coordinator', 'Assistant Officer'];
  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE', 'MBA', 'Administration'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none">Add Placement Officer</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Register new TPO staff</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
               <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-300" />
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                     <span className="text-[10px] font-black text-white uppercase tracking-wider">Upload</span>
                     <input type="file" className="hidden" />
                  </label>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Full Name *</label>
                <input name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Employee ID</label>
                <input name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="EMP123" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="john@college.edu" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Phone Number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="+91..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none">
                   {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">TPO Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none">
                   {roles.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Office Room</label>
                <input name="officeRoomNumber" value={formData.officeRoomNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="Block A, 101" />
              </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Social Link</label>
                  <input name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="Social profile URL..." />
                </div>
            </div>
          </div>
        </form>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-sm font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="flex-[2] flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black text-white bg-slate-900 hover:bg-black shadow-xl shadow-slate-200 transition-all">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> Register Officer</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOfficerModal;
