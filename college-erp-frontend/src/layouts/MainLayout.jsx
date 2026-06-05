import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-20 md:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - sliding in on mobile */}
      <div className={`fixed inset-y-0 left-0 z-30 transform ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}>
        <Sidebar />
      </div>

      <TopNavbar onMenuClick={toggleSidebar} />
      
      {/* Main Content Area */}
      <main className="md:pl-[280px] min-h-screen transition-all duration-300 relative" style={{ paddingTop: '80px' }}>
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
