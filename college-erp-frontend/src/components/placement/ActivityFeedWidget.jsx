import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Award } from 'lucide-react';

const ActivityFeedWidget = () => {
  const [notifications, setNotifications] = useState(() => {
    const cached = localStorage.getItem('edu_erp_placement_notifications');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    const initial = [
      { id: 1, message: 'Arjun Kumar successfully placed at Zoho for ₹8.5 LPA!', timestamp: '2 hours ago', priority: 'high', type: 'placed' },
      { id: 2, message: 'Priya Singh successfully placed at Cognizant for ₹6.0 LPA!', timestamp: '5 hours ago', priority: 'high', type: 'placed' },
      { id: 3, message: 'Infosys scheduled interview shortlist updated for Sneha Reddy.', timestamp: '1 day ago', priority: 'info', type: 'shortlist' },
      { id: 4, message: 'Fee warning issued: Sneha Reddy (IT) fee status is Pending.', timestamp: '2 days ago', priority: 'warning', type: 'fee' }
    ];
    localStorage.setItem('edu_erp_placement_notifications', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const cached = localStorage.getItem('edu_erp_placement_notifications');
        if (cached) {
          setNotifications(JSON.parse(cached));
        }
      } catch (e) {
        console.error('Storage sync error:', e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'placed':
        return <Award size={14} className="text-emerald-500" />;
      case 'shortlist':
        return <CheckCircle size={14} className="text-indigo-500" />;
      case 'fee':
        return <AlertTriangle size={14} className="text-rose-500" />;
      default:
        return <Info size={14} className="text-amber-500" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'placed':
        return 'bg-emerald-50 border-emerald-100';
      case 'fee':
        return 'bg-rose-50 border-rose-100';
      case 'shortlist':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={16} className="text-indigo-600" />
            Live TPO Activity Feed
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Real-time placement alerts and notifications</p>
        </div>
        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
      </div>

      <div className="space-y-4.5 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 border rounded-2xl transition-all flex items-start gap-3 ${getBg(n.type)}`}>
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
              {getIcon(n.type)}
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-800 leading-snug">
                {n.message}
              </p>
              <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">
                {n.timestamp}
              </span>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-8 font-bold text-slate-400 italic text-[10px] bg-slate-50 rounded-2xl border border-slate-100">
            No live activities recorded.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedWidget;
