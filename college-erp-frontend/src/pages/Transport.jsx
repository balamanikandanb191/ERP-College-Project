import React, { useState, useEffect } from 'react';
import { Bus, Users, Map, Settings, BarChart, Search, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

import TransportAnalytics from '../components/transport/TransportAnalytics';
import BusTable from '../components/transport/BusTable';
import DriverTable from '../components/transport/DriverTable';
import RouteTable from '../components/transport/RouteTable';
import MaintenanceTable from '../components/transport/MaintenanceTable';
import TransportStudentTable from '../components/transport/TransportStudentTable';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <Bus {...props} />;
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

// Fallback wrapper to catch errors in tabs
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Transport component crashed:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl m-4">
          <AlertTriangle className="mx-auto mb-2" size={32} />
          <h2 className="font-bold">Something went wrong.</h2>
          <p className="text-sm text-red-400">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-4 px-4 py-2 bg-red-100 rounded-lg">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Transport = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transport/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      // Don't toast on error to prevent spam, just set empty object
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
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <Bus className="text-blue-600" size={28} />
            </div>
            Smart Transport System
          </h1>
          <p className="text-gray-500 mt-2.5 font-medium flex items-center gap-2 text-sm sm:text-base">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Monitor live fleet operations and routes
          </p>
        </div>
        
        {/* Smart Search Panel (Simplified Trigger) */}
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full sm:w-72 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
            placeholder="Search buses, drivers, routes..."
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Buses" 
          value={analytics?.activeBuses || 0} 
          icon={Bus} 
          bgColor="bg-blue-50" 
          iconColor="text-blue-600"
          subtitle={`Out of ${analytics?.totalBuses || 0} total fleet`}
        />
        <StatCard 
          title="Delayed Routes" 
          value={analytics?.delayedRoutes || 0} 
          icon={AlertTriangle} 
          bgColor="bg-amber-50" 
          iconColor="text-amber-600"
          subtitle="Requires attention today"
        />
        <StatCard 
          title="Maintenance" 
          value={analytics?.maintenanceBuses || 0} 
          icon={Settings} 
          bgColor="bg-red-50" 
          iconColor="text-red-600"
          subtitle="Buses under repair"
        />
        <StatCard 
          title="Avg. Occupancy" 
          value={`${analytics?.avgOccupancy || 0}%`} 
          icon={Users} 
          bgColor="bg-emerald-50" 
          iconColor="text-emerald-600"
          subtitle="Fleet utilization"
        />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-full lg:w-max hide-scrollbar">
        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
          <BarChart size={18} /> Analytics
        </button>
        <button onClick={() => setActiveTab('students')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'students' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
          <Users size={18} /> Students
        </button>
        <button onClick={() => setActiveTab('buses')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'buses' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
          <Bus size={18} /> Buses
        </button>
        <button onClick={() => setActiveTab('drivers')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'drivers' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
          <Users size={18} /> Drivers
        </button>
        <button onClick={() => setActiveTab('routes')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'routes' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
          <Map size={18} /> Routes
        </button>
        <button onClick={() => setActiveTab('maintenance')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'maintenance' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
          <Settings size={18} /> Maintenance
        </button>
      </div>

      {/* Content Area */}
      <ErrorBoundary>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] transition-all duration-300">
          {activeTab === 'overview' && <TransportAnalytics data={analytics || {}} loading={loading} />}
          {activeTab === 'students' && <TransportStudentTable />}
          {activeTab === 'buses' && <BusTable />}
          {activeTab === 'drivers' && <DriverTable />}
          {activeTab === 'routes' && <RouteTable />}
          {activeTab === 'maintenance' && <MaintenanceTable />}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Transport;
