import React, { useState } from 'react';
import StudentAttendanceTable from '../components/StudentAttendanceTable';
import StaffAttendanceTable from '../components/StaffAttendanceTable';
import AttendanceModal from '../components/AttendanceModal';
import { CalendarDays, Users, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceToEdit, setAttendanceToEdit] = useState(null);

  // Mock data for analytics
  const studentStats = [
    { name: 'Present', value: 850, color: '#10B981' },
    { name: 'Absent', value: 120, color: '#EF4444' },
    { name: 'Late', value: 30, color: '#F59E0B' },
  ];

  const staffStats = [
    { name: 'Present', value: 140, color: '#10B981' },
    { name: 'Absent', value: 5, color: '#EF4444' },
    { name: 'On Leave', value: 10, color: '#6366F1' },
  ];

  const currentStats = activeTab === 'student' ? studentStats : staffStats;

  const handleOpenModal = (attendance = null) => {
    setAttendanceToEdit(attendance);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setAttendanceToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <CalendarDays className="text-primary" size={28} />
            Attendance Management
          </h1>
          <p className="text-text-muted mt-1">Manage and track attendance for students and staff</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors font-medium shadow-sm"
        >
          Mark Attendance
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-border-color w-max">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'student'
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-text-muted hover:text-text-main hover:bg-gray-50'
          }`}
        >
          <BookOpen size={18} />
          Student Attendance
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'staff'
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-text-muted hover:text-text-main hover:bg-gray-50'
          }`}
        >
          <Users size={18} />
          Staff Attendance
        </button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border-color shadow-sm">
            <p className="text-sm font-medium text-text-muted">Total Present Today</p>
            <h3 className="text-3xl font-bold text-text-main mt-1 text-success">
              {currentStats[0].value}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border-color shadow-sm">
            <p className="text-sm font-medium text-text-muted">Total Absent Today</p>
            <h3 className="text-3xl font-bold text-text-main mt-1 text-danger">
              {currentStats[1].value}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border-color shadow-sm">
            <h3 className="text-3xl font-bold text-text-main mt-1 text-primary">
              {currentStats && currentStats.length > 0 && currentStats.reduce((a, b) => a + b.value, 0) > 0
                ? Math.round((currentStats[0].value / currentStats.reduce((a, b) => a + b.value, 0)) * 100)
                : 0}%
            </h3>
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-border-color shadow-sm flex items-center justify-center min-h-[250px]">
          <div className="w-full h-full flex flex-col items-center">
            <h3 className="text-lg font-semibold text-text-main mb-4 w-full text-left">Today's Overview</h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                {currentStats && currentStats.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={currentStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {currentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-text-muted">No data available</div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden">
        {activeTab === 'student' ? (
          <StudentAttendanceTable onEdit={handleOpenModal} />
        ) : (
          <StaffAttendanceTable onEdit={handleOpenModal} />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AttendanceModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          attendanceData={attendanceToEdit}
          type={activeTab}
        />
      )}
    </div>
  );
};

export default Attendance;
