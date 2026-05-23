import React from 'react';
import { HelpCircle, PhoneCall, CheckCircle, Flame, UserCheck, TrendingUp, Compass, Globe, Share2, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const channelData = [
  { name: 'Website', value: 245, color: '#6366F1' },
  { name: 'Referral', value: 112, color: '#3B82F6' },
  { name: 'Social Media', value: 189, color: '#EC4899' },
  { name: 'Walk-in', value: 98, color: '#F59E0B' },
  { name: 'Other', value: 45, color: '#10B981' }
];

const monthlyData = [
  { name: 'Jan', Enquiries: 65, Conversions: 12 },
  { name: 'Feb', Enquiries: 85, Conversions: 18 },
  { name: 'Mar', Enquiries: 120, Conversions: 32 },
  { name: 'Apr', Enquiries: 190, Conversions: 48 },
  { name: 'May', Enquiries: 228, Conversions: 65 }
];

const callerData = [
  { name: 'Priya Sharma', calls: 340, hot: 45, rate: '22%' },
  { name: 'Rohan Verma', calls: 290, hot: 31, rate: '18%' },
  { name: 'Neha Gupta', calls: 410, hot: 55, rate: '25%' },
  { name: 'Amit Singh', calls: 250, hot: 20, rate: '15%' }
];

const EnquiryDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
          <h1 className="text-3xl font-black mt-2 tracking-tight">Enquiry & Leads Analytics</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Real-time statistics for application pipelines, inquiry sources, and follow-ups</p>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enquiries', value: 689, desc: '+15% from last month', icon: HelpCircle, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Assigned Leads', value: 580, desc: '84.1% assign rate', icon: UserCheck, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Hot Leads', value: 151, desc: 'Highly interested candidates', icon: Flame, color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { label: 'Conversions', value: 175, desc: 'Registered admissions', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Enquiry Trends</h3>
              <p className="text-xs text-slate-400 font-semibold">Monthly inquiry intake vs final conversions</p>
            </div>
            <TrendingUp size={18} className="text-indigo-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="Enquiries" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Lead Channels</h3>
              <p className="text-xs text-slate-400 font-semibold">Inquiry sources distribution</p>
            </div>
            <Compass size={18} className="text-indigo-500" />
          </div>
          <div className="h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {channelData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-50">
            {channelData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 font-semibold">{c.name}</span>
                </div>
                <span className="font-black text-slate-800">{c.value} ({Math.round(c.value / 6.89)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caller Performance */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-lg">Counselor Performance</h3>
          <p className="text-xs text-slate-400 font-semibold">Tele-caller efficiency, leads assigned, and conversion percentage</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Counselor Name</th>
                <th className="px-6 py-4">Total Calls Placed</th>
                <th className="px-6 py-4">Hot Leads Logged</th>
                <th className="px-6 py-4">Conversion Rate</th>
                <th className="px-6 py-4 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {callerData.map(c => (
                <tr key={c.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{c.calls}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 text-[11px] font-black rounded-full border border-rose-200">{c.hot} hot leads</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-xl border border-emerald-200">{c.rate}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-slate-400 font-semibold">Active follow-ups</span>
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

export default EnquiryDashboard;
