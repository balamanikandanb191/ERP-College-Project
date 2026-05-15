import React from 'react';
import { Users, GraduationCap, DollarSign, CalendarDays, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Jan', students: 400, revenue: 2400 },
  { name: 'Feb', students: 300, revenue: 1398 },
  { name: 'Mar', students: 200, revenue: 9800 },
  { name: 'Apr', students: 278, revenue: 3908 },
  { name: 'May', students: 189, revenue: 4800 },
  { name: 'Jun', students: 239, revenue: 3800 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
  <div className="card p-6 flex items-start justify-between relative overflow-hidden group">
    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-white/0 to-current opacity-5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110" style={{ color: 'inherit' }}></div>
    <div>
      <p className="text-sm font-medium text-text-muted mb-1.5">{title}</p>
      <h3 className="text-3xl font-bold text-text-main tracking-tight">{value}</h3>
      <div className="mt-3 flex items-center text-sm">
        <span className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trendValue}
        </span>
        <span className="text-text-muted ml-2 font-medium">vs last month</span>
      </div>
    </div>
    <div className={`p-4 rounded-2xl shadow-sm ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Dashboard Overview</h1>
          <p className="text-text-muted mt-1 font-medium text-sm">Welcome back, here's what's happening today.</p>
        </div>
        <button className="btn-primary">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="2,845" 
          icon={GraduationCap} 
          trend="up" 
          trendValue="+12.5%" 
          colorClass="bg-primary"
        />
        <StatCard 
          title="Total Staff" 
          value="142" 
          icon={Users} 
          trend="up" 
          trendValue="+2.1%" 
          colorClass="bg-warning"
        />
        <StatCard 
          title="Revenue" 
          value="$124,500" 
          icon={DollarSign} 
          trend="up" 
          trendValue="+8.4%" 
          colorClass="bg-success"
        />
        <StatCard 
          title="Events" 
          value="12" 
          icon={CalendarDays} 
          trend="down" 
          trendValue="-2" 
          colorClass="bg-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-main">Admissions Overview</h3>
            <select className="bg-slate-50 border border-border-color text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="students" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-main">Revenue Trends</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1">
              View Details <ArrowRight size={16} />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6, fill: '#10B981'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-border-color/60 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-text-main">Recent Enrollments</h3>
          <button className="text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-slate-50/80 border-b border-border-color/60">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Student Name</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Enrollment ID</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Department</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/40">
              {[1,2,3,4,5].map((item) => (
                <tr key={item} className="bg-white hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-sm">
                        S{item}
                      </div>
                      <span className="font-semibold text-text-main">Student Name {item}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-muted font-medium">CS-2023-{item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-muted font-medium">Computer Science</td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-muted font-medium">Oct {item + 10}, 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full border border-success/20">
                      Active
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

export default AdminDashboard;
