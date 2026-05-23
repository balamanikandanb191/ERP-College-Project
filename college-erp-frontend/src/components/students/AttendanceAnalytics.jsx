import React, { useMemo } from 'react';
import { 
  Clock, CheckCircle, AlertTriangle, ShieldCheck, 
  TrendingUp, ListOrdered, Calendar, UserCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, CartesianGrid, 
  XAxis, YAxis, Tooltip, Line 
} from 'recharts';

const AttendanceAnalytics = ({ student = {} }) => {
  const safeData = student || {};

  // Single Source of Truth mapping
  const overallRate = Number(safeData.attendancePercentage || 84);
  
  // Set attendance risk rating
  const attendanceRisk = overallRate < 75 ? 'Critical' : 
                         (overallRate < 85 ? 'Warning' : 'Excellent');
  
  const riskColor = attendanceRisk === 'Critical' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                    (attendanceRisk === 'Warning' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                    'text-emerald-600 bg-emerald-50 border-emerald-200');

  // Subject-wise attendance calculation
  const subjectAttendance = useMemo(() => [
    { subject: 'Mathematics', rate: overallRate + 2 },
    { subject: 'Data Structures', rate: overallRate - 4 },
    { subject: 'Compiler Design', rate: overallRate + 5 },
    { subject: 'Web Technologies', rate: overallRate - 2 },
    { subject: 'Mini Project Lab', rate: overallRate + 1 }
  ].map(sub => ({
    ...sub,
    rate: Math.min(100, Math.max(50, sub.rate)) // Bound
  })), [overallRate]);

  // Monthly trends data
  const trendData = useMemo(() => [
    { month: 'Jan', rate: overallRate - 3 },
    { month: 'Feb', rate: overallRate + 1 },
    { month: 'Mar', rate: overallRate + 4 },
    { month: 'Apr', rate: overallRate - 2 },
    { month: 'May', rate: overallRate }
  ], [overallRate]);

  // Absentee Logs
  const absenteeLogs = [
    { date: '14 May 2026', session: 'Afternoon', reason: 'Medical Leave Approved', type: 'Approved' },
    { date: '08 May 2026', session: 'Forenoon', reason: 'Late Entry (>30 mins)', type: 'Late Entry' },
    { date: '28 Apr 2026', session: 'Full Day', reason: 'Absent without permission', type: 'Unapproved' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Attendance Analytics & Biometric Logs</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Real-time attendance progress rates and warning meters</p>
        </div>

        <span className={`px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-wider ${riskColor}`}>
          {attendanceRisk} Rating
        </span>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Overall Attendance</span>
            <span className="text-lg font-black text-slate-800">{overallRate}%</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Working Days Total</span>
            <span className="text-lg font-black text-slate-800">82 Sessions</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Absent Sessions</span>
            <span className="text-lg font-black text-slate-800">{Math.round(82 * (1 - overallRate / 100))} Sessions</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">OD Approvals</span>
            <span className="text-lg font-black text-slate-800">4 Approved</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Indicators grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Monthly Attendance Timeline Trends
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="rate" name="Attendance Rate" stroke="#4f46e5" strokeWidth={3} dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject wise Progress Bars */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <ListOrdered size={16} className="text-indigo-600" />
            Subject-wise Breakdown
          </h4>
          
          <div className="space-y-3">
            {subjectAttendance.map((sub, idx) => {
              const color = sub.rate < 75 ? 'bg-rose-500' : (sub.rate < 85 ? 'bg-amber-500' : 'bg-emerald-500');
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-slate-700 truncate max-w-[150px]">{sub.subject}</span>
                    <span className={sub.rate < 75 ? 'text-rose-600' : 'text-slate-600'}>{sub.rate}%</span>
                  </div>
                  <div className="w-full bg-white border border-slate-200/60 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${sub.rate}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Biometric and Absentee Logs */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={16} className="text-indigo-600" />
          Recent Leave & Late Entry logs
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Academic Session</th>
                <th className="py-2.5">Reason / Incident Particulars</th>
                <th className="py-2.5 text-right">Approval Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[10px] font-semibold text-slate-700">
              {absenteeLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 text-slate-800 font-bold">{log.date}</td>
                  <td className="py-3 text-slate-500">{log.session}</td>
                  <td className="py-3 text-slate-800 font-black uppercase">{log.reason}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                      log.type === 'Approved'
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10'
                        : (log.type === 'Late Entry' ? 'border-amber-500/20 text-amber-500 bg-amber-500/10' : 'border-rose-500/20 text-rose-500 bg-rose-50/10')
                    }`}>
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AttendanceAnalytics;
