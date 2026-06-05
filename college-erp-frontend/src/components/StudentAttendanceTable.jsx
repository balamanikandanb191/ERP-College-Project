import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Pencil, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../utils/confirmToast';

const StudentAttendanceTable = ({ onEdit }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/student-attendance');
      setAttendance(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load student attendance', { id: 'student-attendance-error' });
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await api.delete(`/student-attendance/${id}`);
        toast.success('Attendance record deleted');
        fetchAttendance();
      } catch (error) {
        toast.error('Failed to delete record');
      }
    }, 'Are you sure you want to delete this attendance record?');
  };

  const filteredData = Array.isArray(attendance) ? attendance.filter(record => {
    if (!record?.Student) return false;
    const name = (record.Student.fullName || '').toLowerCase();
    const reg = (record.Student.registerNumber || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || reg.includes(search);
  }) : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return <span className="px-2.5 py-1 text-xs font-medium bg-success/10 text-success rounded-lg">Present</span>;
      case 'Absent': return <span className="px-2.5 py-1 text-xs font-medium bg-danger/10 text-danger rounded-lg">Absent</span>;
      case 'Late': return <span className="px-2.5 py-1 text-xs font-medium bg-warning/10 text-warning-dark rounded-lg">Late</span>;
      default: return <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search student or register no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border-color rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-medium px-4 py-2 border border-border-color bg-white rounded-xl shadow-sm">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/80 text-text-muted border-b border-border-color">
            <tr>
              <th className="px-6 py-4 font-semibold">Student Details</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Marked By</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-text-muted">Loading attendance data...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-text-muted">No attendance records found.</td>
              </tr>
            ) : (
              filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-main">{record.Student?.fullName}</span>
                      <span className="text-xs text-text-muted">{record.Student?.registerNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-text-main">{record.Student?.department}</span>
                      <span className="text-xs text-text-muted">Sem: {record.Student?.semester}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-main">{record.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                  <td className="px-6 py-4 text-text-muted text-xs">{record.Marker?.email || 'System'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(record)}
                        className="p-1.5 text-text-muted hover:text-primary bg-white hover:bg-primary/10 rounded-md transition-colors border border-transparent hover:border-primary/20 shadow-sm"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 text-text-muted hover:text-danger bg-white hover:bg-danger/10 rounded-md transition-colors border border-transparent hover:border-danger/20 shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendanceTable;
