import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Staff from './pages/Staff';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Attendance from './pages/Attendance';
import Library from './pages/Library';
import Transport from './pages/Transport';
import Hostel from './pages/Hostel';
import Fees from './pages/Fees';
import Timetable from './pages/Timetable';
import Settings from './pages/Settings';
import Placement from './pages/Placement';
import Announcements from './pages/Announcements';
import LeaveRequests from './pages/LeaveRequests';
import ExamManagement from './pages/ExamManagement';
import AcademicCalendar from './pages/AcademicCalendar';
import ClassAllocation from './pages/ClassAllocation';
import FeesManagement from './pages/FeesManagement';

// New ERP Modules Imports
import UserCreation from './pages/UserCreation';
import LogDetails from './pages/LogDetails';
import Standard from './pages/Standard';
import Subject from './pages/Subject';
import SubjectAllocation from './pages/SubjectAllocation';
import ClassMaster from './pages/ClassMaster';
import ExamMaster from './pages/ExamMaster';
import FeeMaster from './pages/FeeMaster';
import AcademicYearMaster from './pages/AcademicYearMaster';
import DesignationMaster from './pages/DesignationMaster';
import EnquiryDashboard from './pages/EnquiryDashboard';
import StudentEnquiry from './pages/StudentEnquiry';
import AssignCall from './pages/AssignCall';
import CallerDetails from './pages/CallerDetails';
import LeadManagement from './pages/LeadManagement';
import EnquiryReport from './pages/EnquiryReport';
import { ApplicationIssue, StudentRegister, AdmittedStudent, AppIssueConsolidate } from './pages/admission';
import GeneralForms from './pages/GeneralForms';
import EditTC from './pages/EditTC';
import TC from './pages/TC';
import FeesEstimation from './pages/FeesEstimation';
import CourseCompletion from './pages/CourseCompletion';
import Conduct from './pages/Conduct';
import Bonafide from './pages/Bonafide';
import IdCardGenerator from './pages/IdCardGenerator';
import AttendanceConfiguration from './pages/AttendanceConfiguration';
import MarkedAttendance from './pages/MarkedAttendance';
import AssessmentConfiguration from './pages/AssessmentConfiguration';
import AssignmentMarkEntry from './pages/AssignmentMarkEntry';

// Library Sub-routes Imports
import AddBook from './pages/library/AddBook';
import AddBorrower from './pages/library/AddBorrower';
import AvailableBooks from './pages/library/AvailableBooks';
import BookIssue from './pages/library/BookIssue';
import BookHistory from './pages/library/BookHistory';
import FineReport from './pages/library/FineReport';
import NoDueCertificate from './pages/library/NoDueCertificate';
import LibraryLayout from './pages/library/LibraryLayout';
import LibraryDashboardIndex from './pages/library/LibraryDashboardIndex';


const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'Super Admin':
    case 'Admin':
      return <Navigate to="/admin" replace />;
    case 'Staff':
    case 'Teacher':
      return <Navigate to="/staff" replace />;
    case 'Student':
      return <Navigate to="/student" replace />;
    case 'Parent':
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1E293B', color: '#fff', borderRadius: '12px' } }} />
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Dashboard Redirects */}
          <Route path="/dashboard" element={<RootRedirect />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Super Admin']} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="staff" element={<Staff />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="library" element={<LibraryLayout />}>
                <Route index element={<LibraryDashboardIndex />} />
                <Route path="management/Addbook" element={<AddBook />} />
                <Route path="management/Addborrower" element={<AddBorrower />} />
                <Route path="management/Availablebooks" element={<AvailableBooks />} />
                <Route path="circulation/Bookissue" element={<BookIssue />} />
                <Route path="reports/Bookhistory" element={<BookHistory />} />
                <Route path="reports/Finereport" element={<FineReport />} />
                <Route path="reports/Noduecertificate" element={<NoDueCertificate />} />
              </Route>
              <Route path="transport" element={<Transport />} />
              <Route path="hostel" element={<Hostel />} />
              <Route path="fees" element={<Fees />} />
              <Route path="/admin/fees-management" element={<FeesManagement />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="settings" element={<Settings />} />
              <Route path="placement" element={<Placement />} />
              <Route path="communications" element={<Announcements />} />
              <Route path="/admin/academic-calendar" element={<AcademicCalendar />} />
              <Route path="leaves" element={<LeaveRequests />} />
              <Route path="exams" element={<ExamManagement />} />
              <Route path="/admin/class-allocation" element={<ClassAllocation />} />

              {/* New ERP Module Routes */}
              <Route path="user-creation" element={<UserCreation />} />
              <Route path="log-details" element={<LogDetails />} />
              <Route path="standard" element={<Navigate to="/admin/department" replace />} />
              <Route path="department" element={<Standard />} />
              <Route path="subject" element={<Subject />} />
              <Route path="subject-allocation" element={<SubjectAllocation />} />
              <Route path="class-master" element={<ClassMaster />} />
              <Route path="exam-master" element={<ExamMaster />} />
              <Route path="fee-master" element={<FeeMaster />} />
              <Route path="academic-year-master" element={<AcademicYearMaster />} />
              <Route path="designation-master" element={<DesignationMaster />} />
              <Route path="enquiry-dashboard" element={<EnquiryDashboard />} />
              <Route path="student-enquiry" element={<StudentEnquiry />} />
              <Route path="assign-call" element={<AssignCall />} />
              <Route path="caller-details" element={<CallerDetails />} />
              <Route path="lead-management" element={<LeadManagement />} />
              <Route path="enquiry-report" element={<EnquiryReport />} />
              <Route path="application-issue" element={<ApplicationIssue />} />
              <Route path="student-register" element={<StudentRegister />} />
              <Route path="admitted-student" element={<AdmittedStudent />} />
              <Route path="general-forms" element={<GeneralForms />} />
              <Route path="app-issue-consolidate" element={<AppIssueConsolidate />} />
              <Route path="edit-tc" element={<EditTC />} />
              <Route path="tc" element={<TC />} />
              <Route path="fees-estimation" element={<FeesEstimation />} />
              <Route path="course-completion" element={<CourseCompletion />} />
              <Route path="conduct" element={<Conduct />} />
              <Route path="bonafide" element={<Bonafide />} />
              <Route path="idcard-generator" element={<IdCardGenerator />} />
              <Route path="attendance-configuration" element={<AttendanceConfiguration />} />
              <Route path="marked-attendance" element={<MarkedAttendance />} />
              <Route path="assessment-configuration" element={<AssessmentConfiguration />} />
              <Route path="assignment-mark-entry" element={<AssignmentMarkEntry />} />

              {/* Fallback Sub-routes for Grouped Sidebar */}
              <Route path="dashboard/analytics" element={<AdminDashboard />} />
              <Route path="dashboard/reports" element={<AdminDashboard />} />
              <Route path="finance/scholarships" element={<FeesManagement />} />
              <Route path="finance/fines" element={<FeesManagement />} />
              <Route path="finance/revenue" element={<FeesManagement />} />
              <Route path="staff/payroll" element={<Staff />} />
              <Route path="staff/workload" element={<Staff />} />
              <Route path="campus/inventory" element={<Hostel />} />
              <Route path="campus/rooms" element={<Hostel />} />
              <Route path="communications/notices" element={<Announcements />} />
              <Route path="communications/announcements" element={<Announcements />} />
              <Route path="communications/emergency" element={<Announcements />} />
              <Route path="placement/analytics" element={<Placement />} />
              <Route path="placement/companies" element={<Placement />} />
              <Route path="placement/timeline" element={<Placement />} />
              <Route path="settings/roles" element={<Settings />} />
              <Route path="settings/profile" element={<Settings />} />
              <Route path="settings/security" element={<Settings />} />
            </Route>
          </Route>

          {/* Staff/Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Staff', 'Teacher', 'Admin', 'Super Admin']} />}>
            <Route path="/staff" element={<MainLayout />}>
              <Route index element={<StaffDashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="tasks" element={<div>Tasks Page</div>} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Student', 'Admin', 'Super Admin', 'Parent']} />}>
            <Route path="/student" element={<MainLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="attendance" element={<div>My Attendance</div>} />
              <Route path="grades" element={<div>My Grades</div>} />
              <Route path="library" element={<Library />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
