import React, { useState, useEffect } from 'react';
import { IndianRupee, Users, FileText, Activity, Search, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import api from '../services/api';

import FeeAnalytics from '../components/fees/FeeAnalytics';
import FeeStructureTable from '../components/fees/FeeStructureTable';
import StudentFeeTable from '../components/fees/StudentFeeTable';
import PaymentHistoryTable from '../components/fees/PaymentHistoryTable';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Fees UI crashed:", error, errorInfo); }
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

const Fees = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/fees/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Fees Analytics Error:', error.response?.data || error.message);
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <IndianRupee className="text-emerald-600" size={28} />
            </div>
            Student Payments
          </h1>
          <p className="text-gray-500 mt-2.5 font-medium flex items-center gap-2 text-sm sm:text-base">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Enterprise financial tracking and collection
          </p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="block w-full sm:w-72 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm" placeholder="Search students, receipts..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${(analytics?.totalCollected || 0).toLocaleString()}`} icon={IndianRupee} bgColor="bg-emerald-50" iconColor="text-emerald-600" subtitle={`₹${(analytics?.totalCollectedToday || 0).toLocaleString()} collected today`} />
        <StatCard title="Pending Dues" value={`₹${(analytics?.pendingDues || 0).toLocaleString()}`} icon={AlertTriangle} bgColor="bg-rose-50" iconColor="text-rose-600" subtitle={`${analytics?.overdueStudentsCount || 0} students overdue`} />
        <StatCard title="Total Fees Expected" value={`₹${(analytics?.totalRevenue || 0).toLocaleString()}`} icon={TrendingUp} bgColor="bg-blue-50" iconColor="text-blue-600" subtitle="Across all structures" />
        <StatCard title="Fine Collected" value={`₹${(analytics?.fineCollection || 0).toLocaleString()}`} icon={DollarSign} bgColor="bg-amber-50" iconColor="text-amber-600" subtitle="From late payments" />
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-full lg:w-max hide-scrollbar">
        {['analytics', 'structures', 'student_fees', 'payments'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap capitalize ${activeTab === tab ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {tab === 'analytics' && <Activity size={18} />}
            {tab === 'structures' && <FileText size={18} />}
            {tab === 'student_fees' && <Users size={18} />}
            {tab === 'payments' && <IndianRupee size={18} />}
            {tab === 'analytics' ? 'Financial Dashboard' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <ErrorBoundary>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] transition-all duration-300">
          {activeTab === 'analytics' && <FeeAnalytics data={analytics || {}} loading={loading} />}
          {activeTab === 'structures' && <FeeStructureTable />}
          {activeTab === 'student_fees' && <StudentFeeTable />}
          {activeTab === 'payments' && <PaymentHistoryTable />}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Fees;
