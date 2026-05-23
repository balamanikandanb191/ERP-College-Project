import React, { useState, useEffect } from 'react';
import { AlertTriangle, Edit2, Trash2, Plus, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ComplaintModal from './ComplaintModal';

const ComplaintTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hostel/complaints');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Hostel API Error:', err.response?.data || err.message);
      toast.error('Failed to load complaints', { id: 'complaints-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this complaint?')) {
      try {
        await api.delete(`/hostel/complaints/${id}`);
        toast.success('Complaint deleted');
        fetchComplaints();
      } catch (error) {
        console.error('Hostel API Error:', error.response?.data || error.message);
        toast.error('Failed to delete complaint', { id: 'delete-complaint-err' });
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Low': return 'bg-gray-100 text-gray-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Critical': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Closed': return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading complaints...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><AlertTriangle className="text-indigo-600" size={20} /> Complaint Register ({complaints.length})</h2>
        <button onClick={() => { setSelectedComplaint(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-indigo-200">
          <Plus size={18} /> Log Complaint
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Issue</th>
              <th className="px-4 py-4 font-semibold">Reporter/Room</th>
              <th className="px-4 py-4 font-semibold">Priority</th>
              <th className="px-4 py-4 font-semibold">Date Logged</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {complaints.length > 0 ? complaints.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-gray-900">{c.complaintTitle}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.description}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-800">{c.complainingStudent ? c.complainingStudent.fullName : 'General'}</p>
                  {c.complaintRoom && <p className="text-xs text-gray-500">Room {c.complaintRoom.roomNumber} (Block {c.complaintRoom.hostelBlock})</p>}
                </td>
                <td className="px-4 py-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(c.priority)}`}>{c.priority}</span></td>
                <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(c.status)}`}>{c.status}</span></td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedComplaint(c); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No complaints logged.</td></tr>}
          </tbody>
        </table>
      </div>
      <ComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchComplaints} initialData={selectedComplaint} />
    </div>
  );
};

export default ComplaintTable;
