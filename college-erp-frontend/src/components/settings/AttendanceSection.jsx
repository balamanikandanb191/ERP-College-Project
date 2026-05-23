import React, { useState, useEffect } from 'react';
import { Save, UserCheck, AlertTriangle, Bell, Smartphone } from 'lucide-react';

const AttendanceSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rules */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><UserCheck size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Attendance Policies</h3>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Minimum Required Attendance (%)</label>
                <div className="relative">
                   <AlertTriangle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                   <input 
                     type="number" 
                     name="min_attendance"
                     value={formData.min_attendance || 75}
                     onChange={handleChange}
                     className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm"
                   />
                </div>
             </div>

             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Late Entry Tolerance (Mins)</label>
                <input 
                  type="number" 
                  name="late_tolerance"
                  value={formData.late_tolerance || 10}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
             </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Bell size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Automated Alerts</h3>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                   <Smartphone size={18} className="text-slate-400" />
                   <div>
                      <p className="text-sm font-bold text-slate-800">SMS to Parents</p>
                      <p className="text-xs text-slate-500">Send instant SMS for absent students</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                   <AlertTriangle size={18} className="text-slate-400" />
                   <div>
                      <p className="text-sm font-bold text-slate-800">Shortage Warning</p>
                      <p className="text-xs text-slate-500">Alert students when below min %</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-end">
        <button 
          onClick={() => onSave(formData)}
          disabled={saving}
          className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Attendance Rules'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceSection;
