import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarDays, 
  Settings,
  BookOpen,
  Bus,
  Building
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    // Default Admin items
    const items = [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Students', path: '/admin/students', icon: GraduationCap },
      { name: 'Staff', path: '/admin/staff', icon: Users },
      { name: 'Attendance', path: '/admin/attendance', icon: CalendarDays },
      { name: 'Library', path: '/admin/library', icon: BookOpen },
      { name: 'Transport', path: '/admin/transport', icon: Bus },
      { name: 'Hostel', path: '/admin/hostel', icon: Building },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];
    return items;
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-text-main flex flex-col z-10 transition-transform duration-300 border-r border-border-color shadow-sm">
      <div className="flex items-center justify-center h-16 border-b border-border-color/60 bg-sidebar">
        <span className="text-primary-dark text-xl font-bold tracking-wider flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <GraduationCap className="text-primary" size={24} strokeWidth={2.5} />
          </div>
          EduERP
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' 
                    : 'text-text-main hover:bg-white/60 hover:text-primary-dark'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border-color/60 bg-sidebar/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-white border border-border-color flex items-center justify-center text-primary font-bold shadow-sm">
            {user?.name ? user.name.charAt(0) : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-main truncate w-32">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-text-muted font-medium">{user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
