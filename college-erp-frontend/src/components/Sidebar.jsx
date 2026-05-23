import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardCheck,
  Library,
  Wallet,
  Briefcase,
  Megaphone,
  Building2,
  Settings,
  ChevronDown,
  Search,
  FileText,
  HelpCircle,
  Award,
  Clock,
  Layers
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Unified menu sections configuration matching the exact School ERP screenshots and requirements
const menuSections = [
  {
    id: 'dashboard',
    title: 'DASHBOARD',
    icon: LayoutDashboard,
    roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student'],
    items: [
      {
        name: 'Overview',
        path: (role) => {
          if (role === 'Student') return '/student';
          if (role === 'Staff' || role === 'Teacher') return '/staff';
          return '/admin';
        },
        roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student']
      },
      {
        name: 'Analytics',
        path: '/admin/dashboard/analytics',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Reports',
        path: '/admin/dashboard/reports',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'file',
    title: 'FILE',
    icon: FileText,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'User Creation',
        path: '/admin/user-creation',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Log Details',
        path: '/admin/log-details',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'academics_master',
    title: 'ACADEMIC MASTER',
    icon: GraduationCap,
    roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student'],
    items: [
      {
        name: 'Academic Calendar',
        path: '/admin/academic-calendar',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Standard',
        path: '/admin/standard',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Subject',
        path: '/admin/subject',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Class Allocation',
        path: '/admin/class-allocation',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Subject Allocation',
        path: '/admin/subject-allocation',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Time Table',
        path: '/admin/timetable',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Staff Details',
        path: '/admin/staff',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Fee Details',
        path: '/admin/fees',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'others_master',
    title: 'OTHERS MASTER',
    icon: Settings,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Class Master',
        path: '/admin/class-master',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Exam Master',
        path: '/admin/exam-master',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Fee Master',
        path: '/admin/fee-master',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Academic Year Master',
        path: '/admin/academic-year-master',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Designation Master',
        path: '/admin/designation-master',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'enquiry',
    title: 'ENQUIRY',
    icon: HelpCircle,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Enquiry Dashboard',
        path: '/admin/enquiry-dashboard',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Student Enquiry',
        path: '/admin/student-enquiry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Assign Call',
        path: '/admin/assign-call',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Caller Details',
        path: '/admin/caller-details',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Lead Management',
        path: '/admin/lead-management',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Enquiry Report',
        path: '/admin/enquiry-report',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'application',
    title: 'APPLICATION',
    icon: ClipboardCheck,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Application Issue',
        path: '/admin/application-issue',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Student Register',
        path: '/admin/student-register',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Admitted Student',
        path: '/admin/admitted-student',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'admission_report',
    title: 'ADMISSION REPORT',
    icon: FileText,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Student Profile',
        path: '/admin/students', // Maps to the standard students management list
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'General Forms',
        path: '/admin/general-forms',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'App Issue Consolidate',
        path: '/admin/app-issue-consolidate',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'certificates',
    title: 'CERTIFICATES',
    icon: Award,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'EditTC',
        path: '/admin/edit-tc',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'TC',
        path: '/admin/tc',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Fees Estimation',
        path: '/admin/fees-estimation',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Course Completion',
        path: '/admin/course-completion',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Conduct',
        path: '/admin/conduct',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Bonafide',
        path: '/admin/bonafide',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'idcard',
    title: 'ID CARD',
    icon: Wallet,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Id Card Generator',
        path: '/admin/idcard-generator',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'attendance',
    title: 'ATTENDANCE',
    icon: Clock,
    roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student'],
    items: [
      {
        name: 'Attendance Configuration',
        path: '/admin/attendance-configuration',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Daily Attendance',
        path: (role) => {
          if (role === 'Student') return '/student/attendance';
          if (role === 'Staff' || role === 'Teacher') return '/staff/attendance';
          return '/admin/attendance';
        },
        roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student']
      },
      {
        name: 'Marked Attendance',
        path: '/admin/marked-attendance',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'assessment',
    title: 'ASSESSMENT',
    icon: Layers,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Assessment Configuration',
        path: '/admin/assessment-configuration',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Assignment Mark Entry',
        path: '/admin/assignment-mark-entry',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'campus',
    title: 'CAMPUS MANAGEMENT',
    icon: Building2,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Hostel',
        path: '/admin/hostel',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Transport',
        path: '/admin/transport',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Library',
        path: (role) => role === 'Student' ? '/student/library' : '/admin/library',
        roles: ['Admin', 'Super Admin', 'Student']
      }
    ]
  },
  {
    id: 'placements',
    title: 'PLACEMENT & CAREERS',
    icon: Briefcase,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Placement',
        path: '/admin/placement',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Placement Analytics',
        path: '/admin/placement/analytics',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Companies',
        path: '/admin/placement/companies',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Student Timeline',
        path: '/admin/placement/timeline',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'settings',
    title: 'SETTINGS',
    icon: Settings,
    roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student'],
    items: [
      {
        name: 'System Settings',
        path: '/admin/settings',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Roles & Permissions',
        path: '/admin/settings/roles',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Profile Settings',
        path: (role) => {
          if (role === 'Student') return '/student';
          if (role === 'Staff' || role === 'Teacher') return '/staff';
          return '/admin/settings/profile';
        },
        roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student']
      },
      {
        name: 'Backup & Security',
        path: '/admin/settings/security',
        roles: ['Admin', 'Super Admin']
      }
    ]
  }
];

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user?.role || 'Admin';

  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Role-based filtering: filter sections and children that this user is allowed to access
  const roleFilteredSections = useMemo(() => {
    return (menuSections ?? []).map(section => {
      const isSectionAllowed = section.roles?.includes(userRole);
      if (!isSectionAllowed) return null;

      const allowedItems = section.items?.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
      }) ?? [];

      if (allowedItems.length === 0) return null;

      return {
        ...section,
        items: allowedItems
      };
    }).filter(Boolean);
  }, [userRole]);

  // 2. Search filtering: filter items matching the search query
  const searchFilteredSections = useMemo(() => {
    if (!searchQuery.trim()) return roleFilteredSections;
    const query = searchQuery.toLowerCase();

    return roleFilteredSections.map(section => {
      const matchingItems = section.items?.filter(item => 
        item.name.toLowerCase().includes(query)
      ) ?? [];

      if (matchingItems.length > 0) {
        return {
          ...section,
          items: matchingItems
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery, roleFilteredSections]);

  // 3. Separate, sort, and assemble sections
  const { dashboardSection, normalSections, settingsSection } = useMemo(() => {
    const dashboard = searchFilteredSections.find(s => s.id === 'dashboard');
    const settings = searchFilteredSections.find(s => s.id === 'settings');
    const normals = searchFilteredSections.filter(s => s.id !== 'dashboard' && s.id !== 'settings');

    // Sort normal sections alphabetically by their titles
    const sortedNormals = [...normals].sort((a, b) => a.title.localeCompare(b.title));

    // Sort child items alphabetically inside each section
    const sortItems = (items) => {
      return [...items].sort((a, b) => {
        // Overview is always first in dashboard
        if (a.name === 'Overview') return -1;
        if (b.name === 'Overview') return 1;
        return a.name.localeCompare(b.name);
      });
    };

    return {
      dashboardSection: dashboard ? { ...dashboard, items: sortItems(dashboard.items) } : null,
      normalSections: sortedNormals.map(s => ({ ...s, items: sortItems(s.items) })),
      settingsSection: settings ? { ...settings, items: sortItems(settings.items) } : null
    };
  }, [searchFilteredSections]);

  // 4. Auto-expand the active section based on the current URL
  useEffect(() => {
    const currentPath = location.pathname;
    const allSections = [dashboardSection, ...normalSections, settingsSection].filter(Boolean);

    const activeSection = allSections.find(section => 
      section.items?.some(item => {
        const itemPath = typeof item.path === 'function' ? item.path(userRole) : item.path;
        return currentPath === itemPath;
      })
    );

    if (activeSection) {
      setExpandedSections(prev => ({
        ...prev,
        [activeSection.id]: true
      }));
    }
  }, [location.pathname, userRole, dashboardSection, normalSections, settingsSection]);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isSectionActive = (section) => {
    if (!section) return false;
    return section.items?.some(item => {
      const itemPath = typeof item.path === 'function' ? item.path(userRole) : item.path;
      return location.pathname === itemPath;
    });
  };

  // Helper component to render a Section item block
  const renderSection = (section) => {
    if (!section) return null;
    const isExpanded = expandedSections[section.id] || searchQuery.trim().length > 0;
    const active = isSectionActive(section);
    const SectionIcon = section.icon;

    return (
      <div key={section.id} className="mt-4 first:mt-0 space-y-2">
        <motion.button
          onClick={() => toggleSection(section.id)}
          whileHover={{ x: 4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group cursor-pointer ${
            active
              ? 'bg-blue-600/5 text-blue-700 border-l-4 border-blue-500 font-semibold'
              : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${
              active
                ? 'bg-blue-600/15 text-blue-700'
                : 'bg-slate-200/40 text-slate-500 group-hover:bg-slate-200/75 group-hover:text-slate-800'
            }`}>
              {SectionIcon && <SectionIcon className="w-5 h-5 shrink-0" />}
            </div>
            <span className="text-[13px] font-semibold tracking-wide">
              {section.title}
            </span>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 group-hover:text-slate-600"
          >
            <ChevronDown className="w-5 h-5 shrink-0" />
          </motion.div>
        </motion.button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden pl-4 mt-2 flex flex-col gap-2 border-l border-slate-200/40 ml-7"
            >
              {(section.items ?? []).map((item) => {
                const itemPath = typeof item.path === 'function' ? item.path(userRole) : item.path;
                
                return (
                  <NavLink
                    key={item.name}
                    to={itemPath}
                    end={itemPath === '/admin' || itemPath === '/staff' || itemPath === '/student'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 text-white border-l-4 border-cyan-300 font-bold'
                          : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-[280px] h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/20 flex flex-col overflow-hidden">
      
      {/* Sticky Header with Logo and Search Bar */}
      <div className="flex flex-col gap-3.5 p-4 border-b border-slate-200/50 bg-white/20">
        <div className="flex items-center gap-3 px-1">
          <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-500/15">
            <GraduationCap className="text-white w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent leading-none">
              EduERP
            </h1>
            <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block mt-1">
              Enterprise Suite
            </span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4 shrink-0" />
          </span>
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-white/60 border border-slate-200 shadow-sm rounded-2xl py-2 pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500/40 transition-all text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Menu List Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5 scrollbar-thin">
        {dashboardSection && renderSection(dashboardSection)}
        
        {normalSections.map((section) => renderSection(section))}
      </div>

      {/* Sticky Settings Section Pinned at the Bottom */}
      {settingsSection && (
        <div className="mt-auto pt-4 border-t border-slate-200/10 bg-slate-500/[0.03] px-4 pb-4">
          {renderSection(settingsSection)}
        </div>
      )}
    </div>
  );
};

export default Sidebar;