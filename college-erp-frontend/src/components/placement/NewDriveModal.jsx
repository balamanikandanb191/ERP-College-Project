import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Calendar, MapPin, Target, GraduationCap, Users, FileText, Zap, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const NewDriveModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    package: '',
    location: '',
    driveDate: '',
    cgpaCutoff: '6.0',
    openings: '',
    eligibleDepartments: [],
    driveMode: 'On Campus',
    skillsRequired: '',
    bondDetails: 'No Bond'
  });

  const [loading, setLoading] = useState(false);

  // Handle ESC key to close
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

  const handleDeptToggle = (dept) => {
    setFormData(prev => {
      const depts = Array.isArray(prev.eligibleDepartments) ? prev.eligibleDepartments : [];
      if (depts.includes(dept)) {
        return { ...prev, eligibleDepartments: depts.filter(d => d !== dept) };
      }
      return { ...prev, eligibleDepartments: [...depts, dept] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.role) {
      return toast.error('Please fill mandatory fields');
    }

    try {
      setLoading(true);
      // In a real app, we might first find/create the company, 
      // but for this UI demo we'll assume the backend handles the mapping.
      await api.post('/placement/drives/create-full', formData);
      toast.success('Placement Drive scheduled successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create drive:', error);
      toast.error('Failed to schedule drive. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE', 'MBA'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none">New Placement Drive</h2>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mt-1 opacity-80">Schedule campus recruitment</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                <Building2 size={12} /> Company & Role Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Company Name *</label>
                  <input 
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Google India"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Job Role *</label>
                  <input 
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>
            </section>

            {/* Logistics */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                <Calendar size={12} /> Logistics & Compensation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Drive Date</label>
                  <input 
                    type="date"
                    name="driveDate"
                    value={formData.driveDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Package (LPA)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Location</label>
                  <input 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Bangalore / Remote"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Drive Mode</label>
                  <select 
                    name="driveMode"
                    value={formData.driveMode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  >
                    <option>On Campus</option>
                    <option>Virtual</option>
                    <option>Off Campus</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Eligibility */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                <Target size={12} /> Eligibility Criteria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Min CGPA</label>
                  <input 
                    type="number" step="0.1"
                    name="cgpaCutoff"
                    value={formData.cgpaCutoff}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Openings</label>
                  <input 
                    type="number"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-xs font-black text-slate-700">Eligible Departments</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => handleDeptToggle(dept)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        (formData.eligibleDepartments || []).includes(dept)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Requirements */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                <FileText size={12} /> Additional Requirements
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Required Skills</label>
                  <textarea 
                    name="skillsRequired"
                    rows={3}
                    value={formData.skillsRequired}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="e.g. Java, Spring Boot, React, SQL"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">Bond / Other Details</label>
                  <input 
                    name="bondDetails"
                    value={formData.bondDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. 2 Years Bond / No Bond"
                  />
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl text-sm font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} />
                Confirm & Schedule Drive
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDriveModal;
