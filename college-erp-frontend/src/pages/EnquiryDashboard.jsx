import React, { useState, useEffect } from 'react';
import { HelpCircle, PhoneCall, CheckCircle, Flame, UserCheck, TrendingUp, Compass, Globe, Share2, Eye, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';

const EnquiryDashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    confirmedLeads: 0,
    rejectedClosedLeads: 0
  });
  const [callerStats, setCallerStats] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard stats
      const statsRes = await api.get('/enquiries/dashboard-stats');
      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      // 2. Caller/counselor performance stats
      const callerRes = await api.get('/enquiries/caller-stats');
      if (callerRes.data && callerRes.data.success) {
        setCallerStats(callerRes.data.data.slice(0, 5)); // show top 5 callers
      }

      // 3. All enquiries for charts aggregation
      const enqsRes = await api.get('/enquiries', { params: { limit: 500 } });
      if (enqsRes.data && enqsRes.data.success) {
        const allEnqs = enqsRes.data.data;

        // Aggregate by source (Lead Channels)
        const sourceMap = {};
        allEnqs.forEach(e => {
          const src = e.source || 'Other';
          sourceMap[src] = (sourceMap[src] || 0) + 1;
        });
        
        const COLORS = ['#6366F1', '#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];
        const channels = Object.keys(sourceMap).map((key, i) => ({
          name: key,
          value: sourceMap[key],
          color: COLORS[i % COLORS.length]
        }));
        setChannelData(channels);

        // Aggregate by neededStandard/course (Enquiry Trends/Demand)
        const courseMap = {};
        allEnqs.forEach(e => {
          const crs = e.neededStandard || 'Other';
          courseMap[crs] = (courseMap[crs] || 0) + 1;
        });
        const courses = Object.keys(courseMap).map(key => ({
          name: key.length > 15 ? key.substring(0, 15) + '..' : key,
          Enquiries: courseMap[key]
        }));
        setCourseData(courses);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load enquiries analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
            <h1 className="text-3xl font-black mt-2 tracking-tight">Enquiry & Leads Analytics</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Real-time statistics for application pipelines, inquiry sources, and counselor follow-ups</p>
          </div>
          <button 
            onClick={fetchData} 
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enquiries', value: stats.totalLeads, desc: 'All incoming enquiries', icon: HelpCircle, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Active Leads', value: stats.activeLeads, desc: 'New + Follow-up + Interested', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Confirmed Leads', value: stats.confirmedLeads, desc: 'Registered admissions', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Rejected/Closed', value: stats.rejectedClosedLeads, desc: 'Dropped candidates', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-100' }
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{s.value}</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1.5">{s.desc}</p>
                </div>
                <div className={`p-3 rounded-xl border ${s.color}`}><Icon size={18} /></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course-wise Demand Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Enquiry Demand by Course</h3>
              <p className="text-xs text-slate-400 font-semibold">Distribution of interest across department courses</p>
            </div>
            <TrendingUp size={18} className="text-indigo-500" />
          </div>
          <div className="h-72">
            {courseData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-semibold">No data registered to render trend chart.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="Enquiries" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Lead Channels</h3>
              <p className="text-xs text-slate-400 font-semibold">Inquiry sources distribution</p>
            </div>
            <Compass size={18} className="text-indigo-500" />
          </div>
          {channelData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm font-semibold">No channels available.</div>
          ) : (
            <>
              <div className="h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={channelData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                      {channelData.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-50 overflow-y-auto max-h-[120px]">
                {channelData.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-slate-600 font-semibold">{c.name}</span>
                    </div>
                    <span className="font-black text-slate-800">{c.value} leads</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Caller Performance Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Counselor Performance</h3>
            <p className="text-xs text-slate-400 font-semibold">Tele-caller efficiency, leads assigned, and conversion percentage</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Counselor Name</th>
                <th className="px-6 py-4">Counselor ID</th>
                <th className="px-6 py-4">Assigned Leads</th>
                <th className="px-6 py-4">Total Calls Placed</th>
                <th className="px-6 py-4">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {callerStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-semibold text-xs">No active counselor records seeded in database.</td>
                </tr>
              ) : (
                callerStats.map(c => (
                  <tr key={c.staffId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{c.fullName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-400 font-mono text-xs">{c.staffId}</td>
                    <td className="px-6 py-4 font-black text-slate-600">{c.assignedLeads} leads</td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{c.totalCalls} calls</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-black rounded-xl border ${
                        c.conversionRate >= 50 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        c.conversionRate >= 20 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {c.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { RefreshCw } from 'lucide-react';
export default EnquiryDashboard;
