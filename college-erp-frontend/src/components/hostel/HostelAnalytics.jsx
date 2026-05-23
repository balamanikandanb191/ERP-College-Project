import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, CartesianGrid, LineChart, Line, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertTriangle, Activity, DollarSign, Users, Building, AlertCircle } from 'lucide-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500 gap-3">
    <div className="p-4 bg-gray-50 rounded-full">
      {Icon ? <Icon size={32} className="text-gray-400" /> : <Activity size={32} className="text-gray-400" />}
    </div>
    <p className="font-medium text-sm text-gray-500">{message}</p>
  </div>
);

const HostelAnalytics = ({ data, loading }) => {
  if (loading) return <div className="p-8 flex justify-center min-h-[400px] items-center animate-pulse"><Activity size={48} className="text-gray-300" /></div>;

  const expenseData = Array.isArray(data?.expenseDistribution) && data.expenseDistribution.length > 0 ? data.expenseDistribution : [];
  const revenueTrend = Array.isArray(data?.monthlyRevenueTrend) && data.monthlyRevenueTrend.length > 0 ? data.monthlyRevenueTrend : [];

  return (
    <div className="p-6 bg-gray-50/30 rounded-b-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-rose-50 p-1.5 rounded-lg"><DollarSign className="text-rose-600" size={18} /></div>
            Expense Category Breakdown
          </h3>
          <div className="h-[250px] w-full">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
                    {expenseData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState icon={DollarSign} message="No expense data available" />}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg"><TrendingUp className="text-emerald-600" size={18} /></div>
            Monthly Revenue Trend
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="bg-amber-50 p-1.5 rounded-lg"><Activity className="text-amber-600" size={18} /></div>
            Smart Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-3 items-start group">
              <Building size={20} className="text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Occupancy is currently {(data?.totalBeds > 0 ? (data.occupiedBeds / data.totalBeds) * 100 : 0).toFixed(1)}%</p>
                <p className="text-xs text-gray-600 mt-1">There are {data?.availableBeds || 0} beds available for allocation.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 items-start group">
              <AlertCircle size={20} className="text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Pending Fees Alert</p>
                <p className="text-xs text-gray-600 mt-1">₹{(data?.pendingFees || 0).toLocaleString()} is overdue from students.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-3 items-start group">
              <TrendingUp size={20} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Profit Margin: {data?.profitMargin || 0}%</p>
                <p className="text-xs text-gray-600 mt-1">Hostel operations are maintaining a net profit.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg"><DollarSign className="text-blue-600" size={18} /></div>
            Financial Overview
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-gray-700">Total Revenue</span><span className="font-bold text-emerald-600">₹{(data?.totalRevenue || 0).toLocaleString()}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-gray-700">Total Expenses</span><span className="font-bold text-rose-600">₹{(data?.totalExpenses || 0).toLocaleString()}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${Math.min(((data?.totalExpenses || 0) / (data?.totalRevenue || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-gray-700">Net Profit</span><span className="font-bold text-indigo-600">₹{(data?.netProfit || 0).toLocaleString()}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${data?.profitMargin || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelAnalytics;
