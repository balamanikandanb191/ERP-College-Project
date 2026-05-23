import React, { useState, useEffect } from 'react';
import { Building, Users, Bed, Activity, Search, Shield, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../services/api';

import HostelAnalytics from '../components/hostel/HostelAnalytics';
import RoomTable from '../components/hostel/RoomTable';
import HostelStudentTable from '../components/hostel/HostelStudentTable';
import WardenTable from '../components/hostel/WardenTable';
import ComplaintTable from '../components/hostel/ComplaintTable';
import ExpenseTable from '../components/hostel/ExpenseTable';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Hostel crashed:", error, errorInfo); }
  render() {
    if (this.state.hasError) return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl m-4">
        <AlertTriangle className="mx-auto mb-2" size={32} />
        <h2 className="font-bold">Module Crash Prevented.</h2>
        <p className="text-sm text-red-400">{this.state.error?.message}</p>
        <button onClick={() => this.setState({ hasError: false })} className="mt-4 px-4 py-2 bg-red-100 rounded-lg">Retry</button>
      </div>
    );
    return this.props.children;
  }
}

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <Building {...props} />;
  return <Icon {...props} />;
};

const StatCard = ({ title, value, icon, bgColor, iconColor, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
      <SafeIcon icon={icon} size={80} />
    </div>
    <div className={`p-3.5 rounded-xl ${bgColor || 'bg-gray-50'} shrink-0`}>
      <SafeIcon icon={icon} size={24} className={iconColor || 'text-gray-500'} />
    </div>
    <div className="flex-1 z-10">
      <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
    </div>
  </div>
);

const Hostel = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hostel/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Hostel API Error:', error.response?.data || error.message);
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeTab]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
            <div className="bg-indigo-50 p-2.5 rounded-xl">
              <Building className="text-indigo-600" size={28} />
            </div>
            Smart Hostel System
          </h1>
          <p className="text-gray-500 mt-2.5 font-medium flex items-center gap-2 text-sm sm:text-base">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Enterprise housing & financial management
          </p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="block w-full sm:w-72 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm" placeholder="Search rooms, students, fees..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value={analytics?.totalStudents || 0} icon={Users} bgColor="bg-indigo-50" iconColor="text-indigo-600" subtitle={`${analytics?.occupiedBeds || 0} checked in currently`} />
        <StatCard title="Available Beds" value={analytics?.availableBeds || 0} icon={Bed} bgColor="bg-emerald-50" iconColor="text-emerald-600" subtitle={`Out of ${analytics?.totalBeds || 0} total capacity`} />
        <StatCard title="Monthly Revenue" value={`₹${(analytics?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} bgColor="bg-blue-50" iconColor="text-blue-600" subtitle="Total fee collections" />
        <StatCard title="Hostel Wardens" value={analytics?.totalWardens || 0} icon={Shield} bgColor="bg-amber-50" iconColor="text-amber-600" subtitle="Active on campus" />
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-full lg:w-max hide-scrollbar">
        {['analytics', 'rooms', 'students', 'wardens', 'complaints', 'expenses'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap capitalize ${activeTab === tab ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {tab === 'analytics' && <Activity size={18} />}
            {tab === 'rooms' && <Bed size={18} />}
            {tab === 'students' && <Users size={18} />}
            {tab === 'wardens' && <Shield size={18} />}
            {tab === 'complaints' && <AlertTriangle size={18} />}
            {tab === 'expenses' && <DollarSign size={18} />}
            {tab === 'analytics' ? 'Dashboard' : tab}
          </button>
        ))}
      </div>

      <ErrorBoundary>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] transition-all duration-300">
          {activeTab === 'analytics' && <HostelAnalytics data={analytics || {}} loading={loading} />}
          {activeTab === 'rooms' && <RoomTable />}
          {activeTab === 'students' && <HostelStudentTable />}
          {activeTab === 'wardens' && <WardenTable />}
          {activeTab === 'complaints' && <ComplaintTable />}
          {activeTab === 'expenses' && <ExpenseTable />}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Hostel;
