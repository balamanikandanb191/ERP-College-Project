import React from 'react';
import { X, Calendar, MapPin, User, Clock, Shield, Users, Info } from 'lucide-react';

const CATEGORY_COLORS = {
  'Exams': { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-200', bgLight: 'bg-rose-50', hex: '#EF4444' },
  'Holidays': { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-200', bgLight: 'bg-amber-50', hex: '#F59E0B' },
  'Internal Assessments': { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-200', bgLight: 'bg-orange-50', hex: '#F97316' },
  'Semester Start': { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50', hex: '#059669' },
  'Semester End': { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-200', bgLight: 'bg-teal-50', hex: '#0D9488' },
  'Symposiums': { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-200', bgLight: 'bg-purple-50', hex: '#A855F7' },
  'Placement Drives': { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200', bgLight: 'bg-indigo-50', hex: '#4F46E5' },
  'Cultural Events': { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-200', bgLight: 'bg-pink-50', hex: '#EC4899' },
  'Sports Events': { bg: 'bg-lime-600', text: 'text-lime-600', border: 'border-lime-200', bgLight: 'bg-lime-50', hex: '#65A30D' },
  'Staff Meetings': { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200', bgLight: 'bg-slate-50', hex: '#475569' },
  'Fee Deadlines': { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-200', bgLight: 'bg-sky-50', hex: '#0EA5E9' },
  'Leave Days': { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-200', bgLight: 'bg-violet-50', hex: '#8B5CF6' },
  'Workshops': { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200', bgLight: 'bg-cyan-50', hex: '#0891B2' },
  'Industrial Visits': { bg: 'bg-yellow-600', text: 'text-yellow-600', border: 'border-yellow-200', bgLight: 'bg-yellow-50', hex: '#CA8A04' }
};

const CalendarDrilldownModal = ({ isOpen, onClose, title, events, filterFn }) => {
  if (!isOpen) return null;

  const filtered = (events ?? []).filter(filterFn || (() => true));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      ></div>
      
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 border border-slate-100 animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">{title}</h3>
            <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider mt-0.5">
              Registry Results ({filtered.length} matched records)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
              No matching records found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(filtered ?? []).map((item, idx) => {
                if (!item) return null;
                const colors = CATEGORY_COLORS[item.category] || { bg: 'bg-slate-500', hex: '#64748B', bgLight: 'bg-slate-50', text: 'text-slate-600' };
                
                return (
                  <div key={idx} className="bg-slate-50/40 border border-slate-100 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      {/* Badge / Header Row */}
                      <div className="flex justify-between items-start gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase text-white ${colors.bg}`}>
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-500">
                          Priority: {item.priority}
                        </span>
                      </div>
                      
                      {/* Event Title */}
                      <h4 className="font-extrabold text-slate-900 text-sm mt-3 leading-snug">{item.title}</h4>
                      
                      {/* Description */}
                      <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                        {item.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-[10px] text-slate-600 font-bold">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>Date: <span className="text-slate-800">{item.startDate}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>Time: <span className="text-slate-800">{item.startTime} - {item.endTime}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">Venue: <span className="text-slate-800">{item.venue}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">Faculty: <span className="text-slate-800">{item.organizer}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">Dept: <span className="text-slate-800">{item.department}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={13} className="text-slate-400 shrink-0" />
                        <span>Participants: <span className="text-indigo-600 font-black">{item.participants}</span></span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Shield size={13} className="text-slate-400 shrink-0" />
                        <span>Status: <span className={`font-black ${item.status === 'Completed' ? 'text-emerald-600' : 'text-indigo-600'}`}>{item.status}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarDrilldownModal;
