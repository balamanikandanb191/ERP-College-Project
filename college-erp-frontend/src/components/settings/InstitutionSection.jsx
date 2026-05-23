import React, { useState, useEffect } from 'react';
import { Save, Info, Building2, Globe, Phone, MapPin } from 'lucide-react';

const InstitutionSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Building2 size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">College Name</label>
              <input 
                name="college_name"
                value={formData.college_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder="Full Name of the Institution"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Short Name</label>
                <input 
                  name="short_name"
                  value={formData.short_name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g. MIT"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Code</label>
                <input 
                  name="institution_code"
                  value={formData.institution_code || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g. EEC001"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Institution Type</label>
              <select 
                name="institution_type"
                value={formData.institution_type || 'Private'}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              >
                <option>Government</option>
                <option>Private</option>
                <option>Autonomous</option>
                <option>Deemed University</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Globe size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Contact Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Official Website</label>
              <div className="relative">
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  name="website_url"
                  value={formData.website_url || ''}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="https://college.edu"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    placeholder="+91..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Official Email</label>
                <input 
                  name="official_email"
                  value={formData.official_email || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="contact@college.edu"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-4 text-slate-400" />
                <textarea 
                  name="full_address"
                  value={formData.full_address || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"
                  placeholder="Complete Address"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><Info size={20}/></div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm mb-1">Impact of Changes</h4>
          <p className="text-xs text-blue-700 leading-relaxed max-w-2xl">
            Institutional information updated here will be reflected on all reports, hall tickets, fee receipts, and official communications generated by the ERP.
          </p>
        </div>
      </div>

      {/* Sticky Save Bar (relative to form container) */}
      <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
        <button 
          type="button" 
          className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save size={18} />
          )}
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default InstitutionSection;
