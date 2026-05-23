import React from 'react';
import { X, Mail, Phone, Building2, Calendar, MapPin, Globe, Briefcase, Award, TrendingUp, Users, Trash2, Edit } from 'lucide-react';

const OfficerDetailsDrawer = ({ isOpen, onClose, officer }) => {
  if (!isOpen) return null;

  const safeOfficer = officer || {
    fullName: 'Dr. Anand K. Varma',
    designation: 'Head of Training & Placement (TPO)',
    department: 'Administration',
    email: 'anand.varma@college.edu',
    phone: '+91 98765 43210',
    experience: '12+ Years',
    room: 'Admin Block, Room 204',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    stats: {
      companies: 156,
      placed: 1240,
      activeDrives: 12
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
           <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-[12px]">Officer Profile</h2>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20} className="text-slate-400" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
           {/* Profile Card */}
           <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden mb-4">
                 <img src={safeOfficer.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">{safeOfficer.fullName}</h3>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-wider mt-1">{safeOfficer.designation}</p>
              <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-wider">Active Status</span>
              </div>
           </div>

           {/* Stats */}
           <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                 <p className="text-xl font-black text-slate-900">{safeOfficer.stats?.companies}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase">Companies</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                 <p className="text-xl font-black text-slate-900">{safeOfficer.stats?.placed}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase">Placed</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                 <p className="text-xl font-black text-slate-900">{safeOfficer.stats?.activeDrives}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase">Drives</p>
              </div>
           </div>

           {/* Info List */}
           <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Mail size={18}/></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{safeOfficer.email}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Phone size={18}/></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Contact Number</p>
                    <p className="text-sm font-bold text-slate-700">{safeOfficer.phone}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Building2 size={18}/></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Office Location</p>
                    <p className="text-sm font-bold text-slate-700">{safeOfficer.room}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Calendar size={18}/></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total Experience</p>
                    <p className="text-sm font-bold text-slate-700">{safeOfficer.experience}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-3 shrink-0">
           <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
              <Edit size={18} /> Edit
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all">
              <Trash2 size={18} /> Remove
           </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerDetailsDrawer;
