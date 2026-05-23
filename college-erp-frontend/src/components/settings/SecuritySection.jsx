import React, { useState } from 'react';
import { Shield, Key, Lock, Eye, EyeOff, Save } from 'lucide-react';

const SecuritySection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  const roles = [
    { name: 'Super Admin', permissions: 'Full Access', color: 'bg-rose-100 text-rose-700' },
    { name: 'Admin', permissions: 'Manage Staff/Students, Settings', color: 'bg-blue-100 text-blue-700' },
    { name: 'Teacher', permissions: 'Mark Attendance, View Grades', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Student', permissions: 'View Attendance, Profile', color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Password Policy */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-slate-900 rounded-xl text-white"><Shield size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Security Policy</h3>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-800">Two-Factor Auth</p>
                   <p className="text-xs text-slate-500">Enforce 2FA for administrative accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                </label>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-800">Session Timeout (Mins)</p>
                   <p className="text-xs text-slate-500">Auto logout after inactivity</p>
                </div>
                <input type="number" defaultValue={30} className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-center" />
             </div>
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Lock size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">RBAC Configuration</h3>
          </div>

          <div className="space-y-3">
             {roles.map(role => (
               <div key={role.name} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${role.color}`}>{role.name}</div>
                     <span className="text-xs font-medium text-slate-500">{role.permissions}</span>
                  </div>
                  <Key size={14} className="text-slate-300" />
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-start gap-4 shadow-xl shadow-slate-200">
        <div className="p-2 bg-white/10 rounded-xl text-white"><Shield size={20}/></div>
        <div>
          <h4 className="font-bold text-white text-sm mb-1">Global Security Audit</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            All administrative actions, settings changes, and sensitive data access are logged with IP addresses and timestamps for institutional auditing.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-end">
        <button 
          onClick={() => onSave(formData)}
          className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-slate-900 hover:bg-black shadow-xl shadow-slate-200 transition-all"
        >
          <Save size={18} /> Update Security Profile
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;
