import React, { useState, useEffect } from 'react';
import { Calendar, Users, Activity, Clock, FileText, Search, Plus, AlertTriangle } from 'lucide-react';
import api from '../services/api';

import TimetableOverview from '../components/timetable/TimetableOverview';
import DailyTimetableView from '../components/timetable/DailyTimetableView';
import StaffScheduleView from '../components/timetable/StaffScheduleView';
import TimetableAnalytics from '../components/timetable/TimetableAnalytics';
import TimetableModal from '../components/timetable/TimetableModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Timetable UI crashed:", error, errorInfo); }
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

const Timetable = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [timetables, setTimetables] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const [tData, sData] = await Promise.all([
        api.get('/timetable'),
        api.get('/timetable/settings')
      ]);
      setTimetables(Array.isArray(tData.data) ? tData.data : []);
      setSettings(sData.data || {});
    } catch (error) {
      console.error('Timetable API Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
            <div className="bg-indigo-50 p-2.5 rounded-xl">
              <Calendar className="text-indigo-600" size={28} />
            </div>
            Daily Timetable
          </h1>
          <p className="text-gray-500 mt-2.5 font-medium flex items-center gap-2 text-sm sm:text-base">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Smart academic scheduling and workload management
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm" 
              placeholder="Search subjects, staff, rooms..." 
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap">
            <Plus size={18} /> Schedule
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-full lg:w-max hide-scrollbar">
        {['overview', 'daily', 'staff', 'analytics'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap capitalize ${activeTab === tab ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {tab === 'overview' && <Activity size={18} />}
            {tab === 'daily' && <Calendar size={18} />}
            {tab === 'staff' && <Users size={18} />}
            {tab === 'analytics' && <FileText size={18} />}
            {tab === 'daily' ? 'Daily Timetable' : tab === 'staff' ? 'Staff Schedule' : tab}
          </button>
        ))}
      </div>

      <ErrorBoundary>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] transition-all duration-300">
          {activeTab === 'overview' && <TimetableOverview timetables={timetables} loading={loading} />}
          {activeTab === 'daily' && <DailyTimetableView timetables={timetables} loading={loading} settings={settings} searchQuery={searchQuery} onRefresh={fetchTimetables} />}
          {activeTab === 'staff' && <StaffScheduleView timetables={timetables} loading={loading} />}
          {activeTab === 'analytics' && <TimetableAnalytics timetables={timetables} loading={loading} />}
        </div>
      </ErrorBoundary>
      
      <TimetableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTimetables} settings={settings} timetables={timetables} />
    </div>
  );
};

export default Timetable;
