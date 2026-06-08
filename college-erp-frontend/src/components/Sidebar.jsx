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
import api from '../services/api';

// Unified menu sections configuration matching the exact School ERP screenshots and requirements
const menuSections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    isDirectLink: true,
    path: (role) => {
      if (role === 'Student' || role === 'Parent') return '/student';
      if (role === 'Staff' || role === 'Teacher') return '/staff';
      return '/admin';
    },
    roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student']
  },
  {
    id: 'file',
    title: 'File',
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
    title: 'Academic',
    icon: GraduationCap,
    roles: ['Admin', 'Super Admin', 'Staff', 'Teacher', 'Student'],
    items: [
      {
        name: 'Academic Calendar',
        path: '/admin/academic-calendar',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Department',
        path: '/admin/department',
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
    title: 'Others',
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
    title: 'Enquiry',
    icon: HelpCircle,
    noSort: true,
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
    title: 'Application',
    icon: ClipboardCheck,
    roles: ['Admin', 'Super Admin'],
    noSort: true,
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
    title: 'Admission report',
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
    title: 'Certificates',
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
    title: 'Idcard',
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
    title: 'Attendance',
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
    title: 'Assessment',
    icon: Layers,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Assessment Configuration',
        path: '/admin/academic/assessment/AssessmentConfiguration',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Assignment Mark Entry',
        path: '/admin/academic/assessment/AssignmentMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Internal Test 1 Mark Entry',
        path: '/admin/academic/assessment/InternalTest1MarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Internal Test 2 Mark Entry',
        path: '/admin/academic/assessment/InternalTest2MarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Internal Test 3 Mark Entry',
        path: '/admin/academic/assessment/InternalTest3MarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Model Exam Mark Entry',
        path: '/admin/academic/assessment/ModelExamMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Seminar Mark Entry',
        path: '/admin/academic/assessment/SeminarMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Presentation Mark Entry',
        path: '/admin/academic/assessment/PresentationMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Practical Mark Entry',
        path: '/admin/academic/assessment/PracticalMark',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Record Work Mark Entry',
        path: '/admin/academic/assessment/RecordWorkMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Viva Voce Mark Entry',
        path: '/admin/academic/assessment/VivaVoceMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Project Review Mark Entry',
        path: '/admin/academic/assessment/ProjectReviewMarkEntry',
        roles: ['Admin', 'Super Admin']
      },
      {
        name: 'Assessment Reports',
        path: '/admin/academic/assessment/AssessmentReport',
        roles: ['Admin', 'Super Admin']
      }
    ]
  },
  {
    id: 'campus',
    title: 'Campus',
    icon: Building2,
    roles: ['Admin', 'Super Admin', 'Student'],
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
        path: '/student/library',
        roles: ['Student']
      }
    ]
  },
  {
    id: 'library',
    title: 'Library',
    icon: Library,
    noSort: true,
    roles: ['Admin', 'Super Admin'],
    items: [
      {
        name: 'Management',
        isSubGroup: true,
        subItems: [
          { name: 'Add Book', path: '/admin/library/management/Addbook' },
          { name: 'Add Borrower', path: '/admin/library/management/Addborrower' },
          { name: 'Available Books', path: '/admin/library/management/Availablebooks' }
        ]
      },
      {
        name: 'Circulation',
        isSubGroup: true,
        subItems: [
          { name: 'Book Issue', path: '/admin/library/circulation/Bookissue' }
        ]
      },
      {
        name: 'Reports',
        isSubGroup: true,
        subItems: [
          { name: 'Book History', path: '/admin/library/reports/Bookhistory' },
          { name: 'Fine Report', path: '/admin/library/reports/Finereport' },
          { name: 'No Due Certificate', path: '/admin/library/reports/Noduecertificate' }
        ]
      }
    ]
  },
  {
    id: 'placements',
    title: 'Placements',
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
    title: 'Settings',
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

  const [expandedSections, setExpandedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_expanded_sections');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [expandedSubgroups, setExpandedSubgroups] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_expanded_subgroups');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('sidebar_expanded_sections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  useEffect(() => {
    localStorage.setItem('sidebar_expanded_subgroups', JSON.stringify(expandedSubgroups));
  }, [expandedSubgroups]);

  const sidebarScrollRef = React.useRef(null);

  // Restore scroll position
  useEffect(() => {
    try {
      const savedScroll = sessionStorage.getItem('sidebar_scroll_position');
      if (savedScroll && sidebarScrollRef.current) {
        sidebarScrollRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleScroll = (e) => {
    sessionStorage.setItem('sidebar_scroll_position', e.target.scrollTop);
  };

  // Auto-scroll to active item on page refresh or navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sidebarScrollRef.current) {
        const activeElement = sidebarScrollRef.current.querySelector('[data-sidebar-active="true"]');
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [allowedModules, setAllowedModules] = useState(null);

  // Sync custom permissions from localStorage or API
  useEffect(() => {
    if (!user?.email) return;

    const checkPermissions = async () => {
      // 1. Check local storage first
      try {
        const localUsers = localStorage.getItem('erp_user_creation');
        if (localUsers) {
          const parsed = JSON.parse(localUsers);
          const match = parsed.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
          if (match && match.allowedModules) {
            setAllowedModules(match.allowedModules);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }

      // 2. Fallback to API if not in local storage or for fresh sync
      try {
        const { data } = await api.get('/masters/user_creation');
        if (data && data.length > 0) {
          const parsedUsers = data.map(r => ({ id: r.id, ...r.data }));
          const match = parsedUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
          if (match && match.allowedModules) {
            setAllowedModules(match.allowedModules);
            // Save to localStorage for subsequent loads
            localStorage.setItem('erp_user_creation', JSON.stringify(parsedUsers));
          }
        }
      } catch (err) {
        console.error('Failed to sync custom permissions:', err);
      }
    };

    checkPermissions();
  }, [user]);

  // 1. Role-based and custom-permissions-based filtering
  const roleFilteredSections = useMemo(() => {
    return (menuSections ?? []).map(section => {
      if (section.isDirectLink) {
        const isSectionAllowed = section.roles?.includes(userRole);
        return isSectionAllowed ? section : null;
      }

      const allowedItems = section.items?.filter(item => {
        if (item.isSubGroup) return true;
        // If they have custom permissions configured, use them to decide access
        if (allowedModules !== null) {
          return allowedModules.includes(item.name) || (item.name === 'Department' && allowedModules.includes('Standard'));
        }
        // Fallback to default role checks
        if (!item.roles) return true;
        return item.roles.includes(userRole);
      }) ?? [];

      if (allowedItems.length === 0) return null;

      return {
        ...section,
        items: allowedItems
      };
    }).filter(Boolean);
  }, [userRole, allowedModules]);

  // 2. Search filtering: filter items matching the search query
  const searchFilteredSections = useMemo(() => {
    if (!searchQuery.trim()) return roleFilteredSections;
    const query = searchQuery.toLowerCase();

    return roleFilteredSections.map(section => {
      if (section.isDirectLink) {
        if (section.title.toLowerCase().includes(query)) {
          return section;
        }
        return null;
      }

      const matchingItems = section.items?.map(item => {
        if (item.isSubGroup) {
          const matchingSubItems = item.subItems?.filter(sub =>
            sub.name.toLowerCase().includes(query)
          );
          if (matchingSubItems && matchingSubItems.length > 0) {
            return {
              ...item,
              subItems: matchingSubItems
            };
          }
          return null;
        }
        if (item.name.toLowerCase().includes(query)) {
          return item;
        }
        return null;
      }).filter(Boolean) ?? [];

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
    const fileSec = searchFilteredSections.find(s => s.id === 'file');
    const normals = searchFilteredSections.filter(s => s.id !== 'dashboard' && s.id !== 'settings' && s.id !== 'file');

    const sectionOrder = [
      'academics_master',
      'others_master',
      'enquiry',
      'application',
      'admission_report',
      'certificates',
      'idcard',
      'attendance',
      'assessment',
      'campus',
      'library',
      'placements'
    ];

    // Sort normal sections by defined sequence
    const sortedNormals = [...normals].sort((a, b) => {
      const indexA = sectionOrder.indexOf(a.id);
      const indexB = sectionOrder.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.title.localeCompare(b.title);
    });

    // Sort child items alphabetically inside each section
    const sortItems = (items) => {
      if (!items) return [];
      return [...items].sort((a, b) => {
        // Overview is always first in dashboard
        if (a.name === 'Overview') return -1;
        if (b.name === 'Overview') return 1;
        return a.name.localeCompare(b.name);
      });
    };

    // Combine file section at the top of normal sections so it appears right after Dashboard
    const finalNormals = fileSec ? [fileSec, ...sortedNormals] : sortedNormals;

    return {
      dashboardSection: dashboard ? (dashboard.isDirectLink ? dashboard : { ...dashboard, items: sortItems(dashboard.items) }) : null,
      normalSections: finalNormals.map(s => ({ ...s, items: s.noSort ? s.items : sortItems(s.items) })),
      settingsSection: settings ? { ...settings, items: sortItems(settings.items) } : null
    };
  }, [searchFilteredSections]);

  // 4. Auto-expand the active section based on the current URL
  useEffect(() => {
    const currentPath = location.pathname;
    const allSections = [dashboardSection, ...normalSections, settingsSection].filter(Boolean);

    const activeSection = allSections.find(section => {
      if (section.isDirectLink) {
        const targetPath = typeof section.path === 'function' ? section.path(userRole) : section.path;
        return currentPath === targetPath;
      }
      return section.items?.some(item => {
        if (item.isSubGroup) {
          return item.subItems?.some(sub => {
            const subPath = typeof sub.path === 'function' ? sub.path(userRole) : sub.path;
            return currentPath === subPath;
          });
        }
        const itemPath = typeof item.path === 'function' ? item.path(userRole) : item.path;
        return currentPath === itemPath;
      });
    });

    if (activeSection && !activeSection.isDirectLink) {
      setExpandedSections(prev => ({
        ...prev,
        [activeSection.id]: true
      }));
    }
  }, [location.pathname, userRole, dashboardSection, normalSections, settingsSection]);

  // Auto-expand active subgroups
  useEffect(() => {
    const currentPath = location.pathname;
    const allSections = [dashboardSection, ...normalSections, settingsSection].filter(Boolean);
    
    allSections.forEach(section => {
      section.items?.forEach(item => {
        if (item.isSubGroup) {
          const hasActiveSubItem = item.subItems?.some(sub => {
            const subPath = typeof sub.path === 'function' ? sub.path(userRole) : sub.path;
            return currentPath === subPath;
          });
          if (hasActiveSubItem) {
            setExpandedSubgroups(prev => ({
              ...prev,
              [item.name]: true
            }));
          }
        }
      });
    });
  }, [location.pathname, dashboardSection, normalSections, settingsSection, userRole]);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isSectionActive = (section) => {
    if (!section) return false;
    if (section.isDirectLink) {
      const targetPath = typeof section.path === 'function' ? section.path(userRole) : section.path;
      return location.pathname === targetPath || (targetPath !== '/' && location.pathname.startsWith(targetPath + '/dashboard'));
    }
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

    if (section.isDirectLink) {
      const targetPath = typeof section.path === 'function' ? section.path(userRole) : section.path;
      return (
        <div key={section.id} className="mt-4 first:mt-0 space-y-2">
          <NavLink
            to={targetPath}
            end={targetPath === '/admin' || targetPath === '/staff' || targetPath === '/student'}
            data-sidebar-active={active}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer ${active
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white font-bold'
              : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg transition-colors ${active
                ? 'bg-white/20 text-white'
                : 'bg-slate-200/40 text-slate-500 group-hover:bg-slate-200/75 group-hover:text-slate-800'
                }`}>
                {SectionIcon && <SectionIcon className="w-5 h-5 shrink-0" />}
              </div>
              <span className="text-[13px] font-semibold tracking-wide">
                {section.title}
              </span>
            </div>
          </NavLink>
        </div>
      );
    }

    return (
      <div key={section.id} className="mt-4 first:mt-0 space-y-2">
        <motion.button
          onClick={() => toggleSection(section.id)}
          whileHover={{ x: 4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group cursor-pointer ${active
            ? 'bg-blue-600/5 text-blue-700 border-l-4 border-blue-500 font-semibold'
            : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${active
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
                if (item.isSubGroup) {
                  const isSubExpanded = expandedSubgroups[item.name];
                  const hasActiveChild = item.subItems?.some(sub => {
                    const subPath = typeof sub.path === 'function' ? sub.path(userRole) : sub.path;
                    return location.pathname === subPath;
                  });

                  return (
                    <div key={item.name} className="flex flex-col gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedSubgroups(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          hasActiveChild
                            ? 'bg-slate-100/80 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-200/45 hover:text-slate-800'
                        }`}
                      >
                        <span className="tracking-wide">{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isSubExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-3 flex flex-col gap-1 border-l border-slate-200/50 ml-4 mt-1"
                          >
                            {item.subItems.map(sub => {
                              const subPath = typeof sub.path === 'function' ? sub.path(userRole) : sub.path;
                              return (
                                <NavLink
                                  key={sub.name}
                                  to={subPath}
                                  data-sidebar-active={location.pathname === subPath}
                                  className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${isActive
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow shadow-blue-500/10 text-white font-bold'
                                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/30'
                                    }`
                                  }
                                >
                                  {sub.name}
                                </NavLink>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const itemPath = typeof item.path === 'function' ? item.path(userRole) : item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={itemPath}
                    end={itemPath === '/admin' || itemPath === '/staff' || itemPath === '/student'}
                    data-sidebar-active={location.pathname === itemPath}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
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
          <div className="bg-pink-500 p-2 rounded-full shadow-md shadow-pink-500/15">
            <GraduationCap className="text-white w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-[11px] font-black text-violet-700 tracking-wider uppercase leading-tight">
              COLLEGE MANAGEMENT SYSTEM
            </h1>
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
      <div 
        ref={sidebarScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5 scrollbar-thin"
      >
        {dashboardSection && renderSection(dashboardSection)}

        {normalSections.map((section) => {
          const elements = [];
          if (section.id === 'file') {
            elements.push(
              <div key="category-file" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">
                File
              </div>
            );
          } else if (section.id === 'enquiry') {
            elements.push(
              <div key="category-admission" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">
                Admission
              </div>
            );
          } else if (section.id === 'idcard') {
            elements.push(
              <div key="category-idcard" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">
                ID Card
              </div>
            );
          } else if (section.id === 'attendance') {
            elements.push(
              <div key="category-campus" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">
                Academic
              </div>
            );
          }
          elements.push(renderSection(section));
          return elements;
        })}
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