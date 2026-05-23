import React from 'react';
import { Bell, Search, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import NotificationDrawer from './communication/NotificationDrawer';

const TopNavbar = ({ onMenuClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-navbar border-b border-border-color/60 fixed top-0 right-0 left-[280px] z-10 flex items-center justify-between px-6 transition-all duration-300 max-md:left-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="text-text-muted hover:text-primary-dark md:hidden focus:outline-none transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative hidden md:block w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search students, staff, or settings..." 
            className="w-full bg-white/70 border border-white/40 shadow-sm rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/30 transition-all text-text-main placeholder:text-text-muted outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => setShowNotifications(true)}
          className="relative p-2 text-text-muted hover:text-primary transition-colors hover:bg-white/50 rounded-full"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-navbar animate-pulse"></span>
        </button>
        
        <div className="h-8 w-px bg-border-color mx-1"></div>
        
        <div className="flex items-center gap-3 bg-white/50 px-3 py-1.5 rounded-full border border-white/60 shadow-sm hover:bg-white/80 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0) : user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-sm font-semibold text-text-main hidden sm:block pr-2">
            {user?.name || user?.email || 'Admin'}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <NotificationDrawer 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
};

export default TopNavbar;
