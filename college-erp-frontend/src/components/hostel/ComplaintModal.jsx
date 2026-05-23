import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ComplaintModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    studentId: '', roomId: '', complaintTitle: '', description: '', priority: 'Low', status: 'Open'
  });
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (initialData) setFormData({ ...initialData });
      else setFormData({ studentId: '', roomId: '', complaintTitle: '', description: '', priority: 'Low', status: 'Open' });
    }
  }, [isOpen, initialData]);

  const fetchData = async () => {
    try {
      const [sData, rData] = await Promise.all([api.get('/students'), api.get('/hostel/rooms')]);
      setStudents(Array.isArray(sData.data) ? sData.data : []);
      setRooms(Array.isArray(rData.data) ? rData.data : []);
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        studentId: formData.studentId || null,
        roomId: formData.roomId ? parseInt(formData.roomId, 10) : null
      };
      if (initialData?.id) await api.put(`/hostel/complaints/${initialData.id}`, payload);
      else await api.post('/hostel/complaints', payload);
      toast.success('Complaint saved successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save complaint');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-rose-50 p-2 rounded-lg"><AlertTriangle className="text-rose-600" size={20} /></div>{initialData ? 'Update Complaint' : 'Log New Complaint'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Issue Title *</label><input type="text" name="complaintTitle" value={formData.complaintTitle} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g. Broken Fan" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Describe the issue..."></textarea></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Reporting Student (Optional)</label>
              <select name="studentId" value={formData.studentId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="">-- General Issue --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Room (Optional)</label>
              <select name="roomId" value={formData.roomId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="">-- General Issue --</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option><option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Complaint'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
