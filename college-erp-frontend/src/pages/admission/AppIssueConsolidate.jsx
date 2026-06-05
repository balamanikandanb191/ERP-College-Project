import React from 'react';
import { DollarSign, FileText, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesHistory = [
  { date: '19 May', sales: 12, revenue: 6000 },
  { date: '20 May', sales: 18, revenue: 9000 },
  { date: '21 May', sales: 25, revenue: 12500 },
  { date: '22 May', sales: 30, revenue: 15000 },
  { date: '23 May', sales: 42, revenue: 21000 }
];

const AppIssueConsolidate = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Consolidated Sales</span>
          <h1 className="text-3xl font-black mt-2">App Issue Consolidate</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Review prospectus registration reports, total collections, and enrollment queues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Prospectus Sold', value: '127 Units', desc: '₹500 / unit pricing', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Gross Collection', value: '₹63,500', desc: '100% realized amount', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Enrolled Students', value: '82 Admits', desc: '64.5% conversion rate', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending Reviews', value: '45 Forms', desc: 'Awaiting seat allocation', icon: Users, color: 'text-amber-600 bg-amber-50' }
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{s.value}</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{s.desc}</p>
                </div>
                <div className={`p-3 rounded-xl ${s.color}`}><Icon size={16} /></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sale Trend Chart */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Sales Revenue Trend</h3>
            <p className="text-xs text-slate-400 font-semibold">Daily registration forms sales count and gross cash tally</p>
          </div>
          <TrendingUp size={18} className="text-indigo-500" />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AppIssueConsolidate;
