import React, { useMemo } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StaffAttendancePanel = ({ staff = {} }) => {
  const safeData = staff || {};

  // Memoized dynamics
  const attendanceRate = safeData.attendancePercentage || parseFloat(safeData.attendance) || 94;
  const casualLeavesUsed = safeData.casualLeavesUsed || 4;
  const totalCasualBalance = 12;
  const remainingCasual = totalCasualBalance - casualLeavesUsed;

  const monthlyAttendanceData = useMemo(() => {
    return [
      { month: 'Nov', rate: 96 },
      { month: 'Dec', rate: 92 },
      { month: 'Jan', rate: 95 },
      { month: 'Feb', rate: 98 },
      { month: 'Mar', rate: 94 },
      { month: 'Apr', rate: attendanceRate }
    ];
  }, [attendanceRate]);

  return (
    <div className="space-y-6">
      
      {/* Dynamic counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Attendance Percentage</span>
            <span className="text-sm font-black text-slate-800 uppercase">{attendanceRate}%</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Available Leave Balance</span>
            <span className="text-sm font-black text-slate-800 uppercase">
              {remainingCasual} / {totalCasualBalance} Casual Leaves
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Weekly Workload</span>
            <span className="text-sm font-black text-slate-800 uppercase">18 teaching hours</span>
          </div>
        </div>

      </div>

      {/* Monthly Attendance Chart Curve */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Monthly Attendance Trend</h4>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyAttendanceData}>
              <defs>
                <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
              <YAxis domain={[80, 100]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
              <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
              <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#attendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timetable allocations and Biometrics logs split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject Timetable Allocations */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-indigo-500" /> Timetable Subject Allocations
          </h4>
          
          <div className="space-y-2.5">
            <div className="bg-white border border-slate-200/40 rounded-xl p-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-slate-700 block">Advanced Artificial Intelligence (CS801)</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Year: 4th Year • Semester VIII</span>
              </div>
              <span className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5">
                6 hrs/wk
              </span>
            </div>

            <div className="bg-white border border-slate-200/40 rounded-xl p-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-slate-700 block">Database Management Systems (CS402)</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Year: 2nd Year • Semester IV</span>
              </div>
              <span className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5">
                8 hrs/wk
              </span>
            </div>
          </div>
        </div>

        {/* Biometric Checkins logs */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" /> Recent Biometric Check-ins
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {[
              { date: '17 May 2026', time: '08:54 AM', status: 'On Time' },
              { date: '16 May 2026', time: '08:48 AM', status: 'On Time' },
              { date: '15 May 2026', time: '09:08 AM', status: 'Late Entry' },
              { date: '14 May 2026', time: '08:52 AM', status: 'On Time' }
            ].map((log, idx) => (
              <div key={idx} className="bg-white border border-slate-200/40 rounded-xl p-2.5 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black text-slate-700 block">{log.date}</span>
                  <span className="text-[8px] font-bold text-slate-400">Fingerprint Biometric Verified</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-600 block">{log.time}</span>
                  <span className={`text-[7px] font-black uppercase rounded-full px-2 py-0.5 border ${
                    log.status === 'On Time' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StaffAttendancePanel;
