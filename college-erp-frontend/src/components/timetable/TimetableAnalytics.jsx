import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Activity, LayoutDashboard, BarChart2 } from 'lucide-react';

const COLORS = ['#10B981', '#F43F5E', '#F59E0B', '#3B82F6', '#8B5CF6'];

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500 gap-3">
    <div className="p-4 bg-gray-50 rounded-full">
      {Icon ? <Icon size={32} className="text-gray-400" /> : <Activity size={32} className="text-gray-400" />}
    </div>
    <p className="font-medium text-sm text-gray-500">{message}</p>
  </div>
);

const TimetableAnalytics = ({ timetables, loading }) => {
  if (loading) return <div className="p-8 flex justify-center items-center animate-pulse min-h-[400px]"><Activity size={48} className="text-gray-300" /></div>;

  // Process data for charts locally
  const deptDensity = {};
  const statusDensity = { Scheduled: 0, Cancelled: 0, Substitute: 0 };
  
  timetables.forEach(t => {
    deptDensity[t.department] = (deptDensity[t.department] || 0) + 1;
    if (statusDensity[t.status] !== undefined) statusDensity[t.status]++;
  });

  const densityArray = Object.keys(deptDensity).map(k => ({ name: k, value: deptDensity[k] })).sort((a,b) => b.value - a.value);
  const statusArray = Object.keys(statusDensity).filter(k => statusDensity[k] > 0).map(k => ({ name: k, value: statusDensity[k] }));

  return (
    <div className="p-6 bg-gray-50/30 rounded-b-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Department Density */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-indigo-50 p-1.5 rounded-lg"><BarChart2 className="text-indigo-600" size={18} /></div>
            Department Workload
          </h3>
          <div className="h-[250px] w-full">
            {densityArray.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={densityArray} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState icon={LayoutDashboard} message="No department data available" />}
          </div>
        </div>

        {/* Timetable Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg"><Activity className="text-emerald-600" size={18} /></div>
            Class Status Breakdown
          </h3>
          <div className="h-[250px] w-full">
            {statusArray.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusArray} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
                    {statusArray.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState icon={Activity} message="No status data available" />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimetableAnalytics;
