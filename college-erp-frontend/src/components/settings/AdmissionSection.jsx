import React, { useState, useEffect } from 'react';
import { Save, GraduationCap, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

const AdmissionSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Automation */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><GraduationCap size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Admission Rules</h3>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-800">Auto Registration ID</p>
                   <p className="text-xs text-slate-500">Automatically generate REG-2023-XXXX format</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="auto_reg_number"
                    checked={formData.auto_reg_number === 'true' || formData.auto_reg_number === true}
                    onChange={(e) => setFormData({...formData, auto_reg_number: e.target.checked ? 'true' : 'false'})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-800">Mandatory Documents</p>
                   <p className="text-xs text-slate-500">Enforce document upload before admission save</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="enforce_docs"
                    checked={formData.enforce_docs === 'true' || formData.enforce_docs === true}
                    onChange={(e) => setFormData({...formData, enforce_docs: e.target.checked ? 'true' : 'false'})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
             </div>
          </div>
        </div>

        {/* Validation */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-rose-100 rounded-xl text-rose-600"><ShieldCheck size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Strict Validations</h3>
          </div>

          <div className="space-y-3">
             {['Prevent Duplicate Aadhaar', 'Prevent Duplicate Mobile', 'Prevent Duplicate Email'].map(rule => (
               <div key={rule} className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-xl">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
                     <ShieldCheck size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{rule}</span>
                  <span className="ml-auto text-[10px] font-black text-emerald-600 uppercase tracking-wider">Enabled</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-end">
        <button 
          onClick={() => onSave(formData)}
          disabled={saving}
          className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Admission Policy'}
        </button>
      </div>
    </div>
  );
};

export default AdmissionSection;
