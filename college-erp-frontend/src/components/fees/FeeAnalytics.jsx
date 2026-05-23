import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, CartesianGrid, LineChart, Line, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, IndianRupee, PieChart as PieIcon, AlertTriangle } from 'lucide-react';

const COLORS = ['#10B981', '#F43F5E', '#F59E0B', '#3B82F6', '#8B5CF6'];

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500 gap-3">
    <div className="p-4 bg-gray-50 rounded-full">
      {Icon ? <Icon size={32} className="text-gray-400" /> : <Activity size={32} className="text-gray-400" />}
    </div>
    <p className="font-medium text-sm text-gray-500">{message}</p>
  </div>
);

const FeeAnalytics = ({ data, loading }) => {
  if (loading) return <div className="p-8 flex justify-center min-h-[400px] items-center animate-pulse"><Activity size={48} className="text-gray-300" /></div>;

  const revenueTrend = Array.isArray(data?.monthlyRevenue) && data.monthlyRevenue.length > 0 ? data.monthlyRevenue : [];
  const deptData = Array.isArray(data?.deptCollection) && data.deptCollection.length > 0 ? data.deptCollection : [];
  const paidUnpaidData = Array.isArray(data?.paidVsUnpaid) && data.paidVsUnpaid.length > 0 ? data.paidVsUnpaid : [];

  return (
    <div className="p-6 bg-gray-50/30 rounded-b-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg"><TrendingUp className="text-emerald-600" size={18} /></div>
            Collection Trend
          </h3>
          <div className="h-[250px] w-full">
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState icon={TrendingUp} message="No revenue data available" />}
          </div>
        </div>

        {/* Paid vs Unpaid */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg"><PieIcon className="text-blue-600" size={18} /></div>
            Collection Status
          </h3>
          <div className="h-[250px] w-full">
            {paidUnpaidData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paidUnpaidData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
                    {paidUnpaidData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState icon={PieIcon} message="No collection data available" />}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="bg-amber-50 p-1.5 rounded-lg"><Activity className="text-amber-600" size={18} /></div>
            Smart Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-3 items-start group">
              <IndianRupee size={20} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Recovery Rate: {(data?.totalRevenue > 0 ? (data.totalCollected / data.totalRevenue) * 100 : 0).toFixed(1)}%</p>
                <p className="text-xs text-gray-600 mt-1">Total revenue collected relative to expected amount.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 items-start group">
              <AlertTriangle size={20} className="text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Overdue Alert</p>
                <p className="text-xs text-gray-600 mt-1">{data?.overdueStudentsCount || 0} students have missed their fee deadlines.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-indigo-50 p-1.5 rounded-lg"><Activity className="text-indigo-600" size={18} /></div>
            Department Collection
          </h3>
          <div className="h-[200px] w-full">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState icon={Activity} message="No department data available" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeAnalytics;
