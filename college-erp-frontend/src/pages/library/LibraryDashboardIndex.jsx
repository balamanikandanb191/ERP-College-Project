import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import BookTable from '../../components/BookTable';
import BorrowTable from '../../components/BorrowTable';
import LibraryAnalytics from '../../components/LibraryAnalytics';

const LibraryDashboardIndex = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const { analytics, loading } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-full sm:w-max hide-scrollbar">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BookOpen size={18} />
          Books Inventory
        </button>
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'borrowed'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <ClipboardList size={18} />
          Borrowed Books
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <TrendingUp size={18} />
          Analytics
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] transition-all duration-300">
        {activeTab === 'inventory' && <BookTable />}
        {activeTab === 'borrowed' && <BorrowTable />}
        {activeTab === 'analytics' && <LibraryAnalytics data={analytics} loading={loading} />}
      </div>
    </div>
  );
};

export default LibraryDashboardIndex;
