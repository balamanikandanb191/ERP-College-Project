import React, { useState, useEffect } from 'react';
import { Calendar, Users, Activity, Clock, FileText, LayoutDashboard, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, bgColor, iconColor, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
      {Icon && <Icon size={80} />}
    </div>
    <div className={`p-3.5 rounded-xl ${bgColor || 'bg-gray-50'} shrink-0`}>
      {Icon && <Icon size={24} className={iconColor || 'text-gray-500'} />}
    </div>
    <div className="flex-1 z-10">
      <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
    </div>
  </div>
);

const TimetableOverview = ({ timetables, loading }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/timetable/analytics');
        setAnalytics(data);
      } catch (err) {
        console.error('Timetable analytics error', err);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 flex justify-center items-center animate-pulse min-h-[400px]"><Activity size={48} className="text-gray-300" /></div>;

  return (
    <div className="p-6 bg-gray-50/30 rounded-b-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Classes" value={analytics?.totalScheduled || timetables.length} icon={Calendar} bgColor="bg-indigo-50" iconColor="text-indigo-600" subtitle="Scheduled for the week" />
        <StatCard title="Active Staff" value={analytics?.activeStaffToday || 0} icon={Users} bgColor="bg-emerald-50" iconColor="text-emerald-600" subtitle="Teaching this week" />
        <StatCard title="Substitute Classes" value={analytics?.substituteClasses || 0} icon={AlertTriangle} bgColor="bg-amber-50" iconColor="text-amber-600" subtitle="Requires attention" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg"><LayoutDashboard className="text-blue-600" size={18} /></div>
            Smart Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-3 items-start group">
              <Clock size={20} className="text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">High Workload Alert</p>
                <p className="text-xs text-gray-600 mt-1">Check staff schedules to ensure balanced workloads across departments.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 items-start group">
              <FileText size={20} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Room Utilization: {analytics?.classroomUsage || 0}%</p>
                <p className="text-xs text-gray-600 mt-1">Classrooms are actively managed. No immediate conflicts detected.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg"><Activity className="text-emerald-600" size={18} /></div>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 font-medium transition-colors text-sm flex items-center justify-between">
              <span>View Department Schedules</span>
              <Calendar size={16} className="text-gray-400" />
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 font-medium transition-colors text-sm flex items-center justify-between">
              <span>Assign Substitute Staff</span>
              <Users size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableOverview;
