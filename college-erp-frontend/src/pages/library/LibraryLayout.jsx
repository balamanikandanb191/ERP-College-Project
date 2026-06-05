import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen, RefreshCcw, DollarSign, AlertCircle, LibraryBig } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, bgColor, iconColor, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
      <Icon size={80} />
    </div>
    <div className={`p-3.5 rounded-xl ${bgColor} shrink-0`}>
      {Icon ? <Icon size={24} className={iconColor} /> : <div className="w-6 h-6" />}
    </div>
    <div className="flex-1 z-10">
      <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
    </div>
  </div>
);

const LibraryLayout = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/library-analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load library analytics', { id: 'lib-layout-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
            <div className="bg-indigo-50 p-2.5 rounded-xl">
              <LibraryBig className="text-indigo-600" size={28} />
            </div>
            Smart Library System
          </h1>
          <p className="text-gray-500 mt-2.5 font-medium flex items-center gap-2 text-sm sm:text-base">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Manage books, track borrowers, and monitor library assets
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Books" 
          value={loading ? '...' : (analytics?.totalBooks || 0)} 
          icon={BookOpen} 
          bgColor="bg-blue-50" 
          iconColor="text-blue-600"
          subtitle="Physical Copies"
        />
        <StatCard 
          title="Borrowed Books" 
          value={loading ? '...' : (analytics?.borrowedBooks || 0)} 
          icon={RefreshCcw} 
          bgColor="bg-indigo-50" 
          iconColor="text-indigo-600"
          subtitle="Currently Issued"
        />
        <StatCard 
          title="Overdue Books" 
          value={loading ? '...' : (analytics?.overdueCount || 0)} 
          icon={AlertCircle} 
          bgColor="bg-red-50" 
          iconColor="text-red-600"
          subtitle="Needs Attention"
        />
        <StatCard 
          title="Total Investment" 
          value={loading ? '...' : `₹${(analytics?.totalInvestment || 0).toLocaleString()}`} 
          icon={DollarSign} 
          bgColor="bg-emerald-50" 
          iconColor="text-emerald-600"
          subtitle="Asset Value"
        />
      </div>

      {/* Subpage Content Outlet */}
      <div>
        <Outlet context={{ analytics, loading, refetchAnalytics: fetchAnalytics }} />
      </div>
    </div>
  );
};

export default LibraryLayout;
