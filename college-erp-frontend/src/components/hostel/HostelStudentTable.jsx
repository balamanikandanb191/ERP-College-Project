import React, { useState, useEffect } from 'react';
import { Users, Edit2, Trash2, Plus, PhoneCall, Info } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import HostelStudentModal from './HostelStudentModal';

const HostelStudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hostel/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Hostel API Error:', err.response?.data || err.message);
      toast.error('Failed to load students', { id: 'students-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Remove student from hostel?')) {
      try {
        await api.delete(`/hostel/students/${id}`);
        toast.success('Student removed');
        fetchStudents();
      } catch (error) {
        console.error('Hostel API Error:', error.response?.data || error.message);
        toast.error('Failed to remove student', { id: 'delete-student-err' });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading students...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Users className="text-indigo-600" size={20} /> Hostel Residents ({students.length})</h2>
        <button onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-indigo-200">
          <Plus size={18} /> Add Resident
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Student Info</th>
              <th className="px-4 py-4 font-semibold">Room Assignment</th>
              <th className="px-4 py-4 font-semibold">Contact</th>
              <th className="px-4 py-4 font-semibold">Fee Status</th>
              <th className="px-4 py-4 font-semibold">Resident Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {students.length > 0 ? students.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {s.studentDetails?.fullName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{s.studentDetails?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{s.studentDetails?.registerNumber} • {s.studentDetails?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">Room {s.room?.roomNumber}</div>
                  <div className="text-xs text-gray-500">Block {s.room?.hostelBlock} • Bed {s.bedNumber}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="flex items-center gap-1.5"><PhoneCall size={14} className="text-gray-400" /> {s.studentDetails?.phone || s.guardianPhone}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : s.feeStatus === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{s.feeStatus}</span>
                    {s.pendingAmount > 0 && <span className="text-xs font-bold text-rose-600">₹{s.pendingAmount.toLocaleString()}</span>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.hostelStatus === 'Checked In' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : s.hostelStatus === 'On Leave' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {s.hostelStatus}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedStudent(s); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No students assigned to hostel.</td></tr>}
          </tbody>
        </table>
      </div>
      <HostelStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchStudents} initialData={selectedStudent} />
    </div>
  );
};

export default HostelStudentTable;
