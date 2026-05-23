import React from 'react';
import { X, Bell, Info, AlertTriangle, CheckCircle, Search, Trash2 } from 'lucide-react';

const NotificationDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, title: 'Exam Timetable Published', time: '10 mins ago', type: 'info', message: 'The Model Exam timetable for Final Year CSE has been released.', isRead: false },
    { id: 2, title: 'Emergency Rain Alert', time: '2 hours ago', type: 'warning', message: 'Heavy rain expected. College is closed for tomorrow.', isRead: false },
    { id: 3, title: 'Placement Drive: Amazon', time: '5 hours ago', type: 'success', message: 'Amazon placement results for 2026 batch are out.', isRead: true },
    { id: 4, title: 'Hostel Mess Update', time: '1 day ago', type: 'info', message: 'Mess menu for June month has been updated.', isRead: true },
  ];

  return (
    <div className="fixed inset-0 z-[200] animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-900 text-white">
           <div className="flex items-center gap-3">
              <Bell size={24} className="text-rose-400" />
              <div>
                 <h2 className="text-xl font-black tracking-tight leading-none">Notifications</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Alerts</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <X size={24} />
           </button>
        </div>

        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search pings..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
           </div>
           <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Clear all">
              <Trash2 size={18} />
           </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
           {(notifications ?? []).map((n) => {
             if (!n) return null;
             return (
               <div key={n.id || Math.random()} className={`p-4 rounded-3xl border transition-all cursor-pointer group relative ${
                 n.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-rose-50/30 border-rose-100 shadow-sm'
               }`}>
                  {!n.isRead && <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                  
                  <div className="flex gap-4">
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                       n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                       n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                       'bg-blue-100 text-blue-600'
                     }`}>
                        {n.type === 'warning' ? <AlertTriangle size={20} /> :
                         n.type === 'success' ? <CheckCircle size={20} /> :
                         <Info size={20} />}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="text-sm font-black text-slate-800 leading-tight pr-4">{n.title || 'Notification'}</h4>
                           <span className="text-[10px] font-black text-slate-400 uppercase shrink-0">{n.time || 'Just now'}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 line-clamp-2">{n.message || ''}</p>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-4 shrink-0">
           <button onClick={onClose} className="flex-1 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200">Mark All as Read</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
