import React from 'react';
import { Calendar, MapPin, Briefcase, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const UpcomingDrivesWidget = ({ companies = [] }) => {
  const upcoming = (companies ?? []).filter(c => c.status === 'Upcoming' || c.status === 'Active');

  const handleRegister = (companyName) => {
    toast.success(`Registered successfully for ${companyName} drive evaluation!`);
  };

  return (
    <div className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={16} className="text-indigo-600" />
            Upcoming Drives & Schedule
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Recruitment drive scheduling calendars</p>
        </div>
        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
          {upcoming.length} Active
        </span>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
        {upcoming.map(c => (
          <div key={c.id} className="p-4 bg-slate-50 hover:bg-indigo-50/20 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                {c.logo}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800">{c.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                  <Briefcase size={10} /> {c.role} • ₹{c.pkg} LPA
                </p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                  <MapPin size={10} /> {c.venue || 'Seminar Hall'} • {c.time || '10:00 AM'}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[8px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                Last date: {new Date(c.deadline || c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
              <button 
                onClick={() => handleRegister(c.name)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider transition-colors shadow-sm"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && (
          <div className="text-center py-8 font-bold text-slate-400 italic text-[10px] bg-slate-50 rounded-2xl border border-slate-100">
            No upcoming company drives registered.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingDrivesWidget;
