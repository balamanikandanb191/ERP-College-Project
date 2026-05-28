import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PATH_TO_MODULE_NAME = {
  '/admin/user-creation': 'User Creation',
  '/admin/log-details': 'Log Details',
  '/admin/academic-calendar': 'Academic Calendar',
  '/admin/standard': 'Standard',
  '/admin/subject': 'Subject',
  '/admin/class-allocation': 'Class Allocation',
  '/admin/subject-allocation': 'Subject Allocation',
  '/admin/timetable': 'Time Table',
  '/admin/staff': 'Staff Details',
  '/admin/fees': 'Fee Details',
  '/admin/class-master': 'Class Master',
  '/admin/exam-master': 'Exam Master',
  '/admin/fee-master': 'Fee Master',
  '/admin/academic-year-master': 'Academic Year Master',
  '/admin/designation-master': 'Designation Master',
  '/admin/enquiry-dashboard': 'Enquiry Dashboard',
  '/admin/student-enquiry': 'Student Enquiry',
  '/admin/assign-call': 'Assign Call',
  '/admin/caller-details': 'Caller Details',
  '/admin/lead-management': 'Lead Management',
  '/admin/enquiry-report': 'Enquiry Report',
  '/admin/application-issue': 'Application Issue',
  '/admin/student-register': 'Student Register',
  '/admin/admitted-student': 'Admitted Student',
  '/admin/student-profile': 'Student Profile',
  '/admin/general-forms': 'General Forms',
  '/admin/app-issue-consolidate': 'App Issue Consolidate',
  '/admin/edit-tc': 'EditTC',
  '/admin/tc': 'TC',
  '/admin/fees-estimation': 'Fees Estimation',
  '/admin/course-completion': 'Course Completion',
  '/admin/conduct': 'Conduct',
  '/admin/bonafide': 'Bonafide',
  '/admin/idcard-generator': 'Id Card Generator',
  '/admin/attendance-configuration': 'Attendance Configuration',
  '/admin/marked-attendance': 'Marked Attendance',
  '/admin/assessment-configuration': 'Assessment Configuration',
  '/admin/assignment-mark-entry': 'Assignment Mark Entry',
  '/admin/hostel': 'Hostel',
  '/admin/transport': 'Transport',
  '/admin/library': 'Library',
  '/admin/placement': 'Placement',
  '/admin/placement-analytics': 'Placement Analytics',
  '/admin/companies': 'Companies',
  '/admin/student-timeline': 'Student Timeline',
  '/admin/system-settings': 'System Settings',
  '/admin/roles-permissions': 'Roles & Permissions',
  '/admin/profile-settings': 'Profile Settings',
  '/admin/backup-security': 'Backup & Security'
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const pathname = location.pathname.replace(/\/$/, '');

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Check if the user has custom permissions to bypass strict role guards
    let customHasAccess = false;
    let allowedModules = [];
    try {
      const localUsersStr = localStorage.getItem('erp_user_creation');
      if (localUsersStr) {
        const localUsers = JSON.parse(localUsersStr);
        const match = localUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
        if (match && match.allowedModules && match.allowedModules.length > 0) {
          customHasAccess = true;
          allowedModules = match.allowedModules;
        }
      }
    } catch (e) {
      console.error('Error reading custom permissions in ProtectedRoute:', e);
    }

    if (!customHasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Since they have custom permissions, verify if the specific path they are requesting is allowed
    if (pathname && pathname !== '/admin') {
      const moduleName = PATH_TO_MODULE_NAME[pathname];
      if (moduleName && !allowedModules.includes(moduleName)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
