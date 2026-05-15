import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1E293B', color: '#fff', borderRadius: '12px' } }} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<AdminDashboard />} />
              {/* Placeholders for other admin routes */}
              <Route path="students" element={<div>Students Page</div>} />
              <Route path="staff" element={<div>Staff Page</div>} />
              <Route path="attendance" element={<div>Attendance Page</div>} />
              <Route path="library" element={<div>Library Page</div>} />
              <Route path="transport" element={<div>Transport Page</div>} />
              <Route path="hostel" element={<div>Hostel Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
            </Route>
          </Route>

          {/* Catch all / Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
