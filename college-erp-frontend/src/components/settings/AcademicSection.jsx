import React, { useState, useEffect } from 'react';
import { Save, Calendar, Clock, Info } from 'lucide-react';

const AcademicSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Academic Year */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Calendar size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Academic Session</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Current Academic Year</label>
              <select 
                name="academic_year"
                value={formData.academic_year || '2023-2024'}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              >
                <option>2022-2023</option>
                <option>2023-2024</option>
                <option>2024-2025</option>
                <option>2025-2026</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Semester Pattern</label>
                  <select 
                    name="semester_pattern"
                    value={formData.semester_pattern || 'Semester'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>Semester</option>
                    <option>Trimester</option>
                    <option>Annual</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">Current Semester</label>
                  <select 
                    name="current_semester"
                    value={formData.current_semester || 'Odd'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>Odd (1, 3, 5, 7)</option>
                    <option>Even (2, 4, 6, 8)</option>
                  </select>
               </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><Clock size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Working Hours</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">College Start</label>
                  <input 
                    type="time"
                    name="college_start_time"
                    value={formData.college_start_time || '09:00'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1.5">College End</label>
                  <input 
                    type="time"
                    name="college_end_time"
                    value={formData.college_end_time || '16:00'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">Weekly Working Days</label>
               <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button 
                      key={day}
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        (formData.working_days || 'Mon,Tue,Wed,Thu,Fri').includes(day)
                        ? 'bg-amber-100 border-amber-200 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm"><Info size={20}/></div>
        <div>
          <h4 className="font-bold text-emerald-900 text-sm mb-1">Academic Rollover</h4>
          <p className="text-xs text-emerald-700 leading-relaxed max-w-2xl">
            Changing the academic year will affect student promotions, course enrollments, and timetable schedules. Use caution before shifting to a new session.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-end">
        <button 
          onClick={() => onSave(formData)}
          disabled={saving}
          className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
        >
          {saving ? 'Updating...' : 'Update Calendar'}
        </button>
      </div>
    </div>
  );
};

export default AcademicSection;
