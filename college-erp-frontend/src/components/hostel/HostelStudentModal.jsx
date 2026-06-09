import React, { useState, useEffect } from 'react';
import { X, Save, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const HostelStudentModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    studentId: '', roomId: '', bedNumber: '', checkInDate: new Date().toISOString().split('T')[0], expectedCheckoutDate: '',
    guardianName: '', guardianPhone: '', emergencyContact: '', hostelStatus: 'Checked In', feeStatus: 'Pending', monthlyFeePaid: '', pendingAmount: ''
  });
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (initialData) {
        setFormData({
          ...initialData,
          monthlyFeePaid: initialData.monthlyFeePaid || '',
          pendingAmount: initialData.pendingAmount || ''
        });
      } else {
        setFormData({
          studentId: '', roomId: '', bedNumber: '', checkInDate: new Date().toISOString().split('T')[0], expectedCheckoutDate: '',
          guardianName: '', guardianPhone: '', emergencyContact: '', hostelStatus: 'Checked In', feeStatus: 'Pending', monthlyFeePaid: '', pendingAmount: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchData = async () => {
    try {
      // Use the dedicated endpoint: all master students NOT already in hostel
      const [sRes, rData] = await Promise.all([
        api.get('/hostel/available-students'),
        api.get('/hostel/rooms')
      ]);
      let availableStudents = Array.isArray(sRes.data) ? sRes.data : [];

      // When editing, the current student may already be in hostel — add them back if missing
      if (initialData?.studentId) {
        const alreadyIncluded = availableStudents.some(s => String(s.id) === String(initialData.studentId));
        if (!alreadyIncluded) {
          try {
            const { data: existing } = await api.get(`/students/${initialData.studentId}`);
            if (existing) availableStudents = [existing, ...availableStudents];
          } catch (_) { /* ignore */ }
        }
      }

      setStudents(availableStudents);
      setRooms(Array.isArray(rData.data) ? rData.data : []);
    } catch (e) {
      console.error('Failed to load hostel form data:', e);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        roomId: parseInt(formData.roomId, 10),
        monthlyFeePaid: parseFloat(formData.monthlyFeePaid || 0),
        pendingAmount: parseFloat(formData.pendingAmount || 0),
        expectedCheckoutDate: formData.expectedCheckoutDate || null
      };
      if (initialData?.id) await api.put(`/hostel/students/${initialData.id}`, payload);
      else await api.post('/hostel/students', payload);
      toast.success('Resident saved successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save resident');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-indigo-50 p-2 rounded-lg"><Users className="text-indigo-600" size={20} /></div>{initialData ? 'Edit Resident' : 'Add New Resident'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Student *</label>
              <select name="studentId" value={formData.studentId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="">-- Choose Student --</option>
                {students.length === 0 && (
                  <option disabled value="">No students available (all assigned)</option>
                )}
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.registerNumber}){s.department ? ` · ${s.department}` : ''}{s.semester ? ` Sem ${s.semester}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Room *</label>
              <select name="roomId" value={formData.roomId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="">-- Choose Room --</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber} (Block {r.hostelBlock})</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Bed Number</label><input type="text" name="bedNumber" value={formData.bedNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g. B-01" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Check-In Date *</label><input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Expected Check-Out</label><input type="date" name="expectedCheckoutDate" value={formData.expectedCheckoutDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hostel Status</label>
              <select name="hostelStatus" value={formData.hostelStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Checked In">Checked In</option><option value="Checked Out">Checked Out</option><option value="On Leave">On Leave</option><option value="Expelled">Expelled</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Guardian Name</label><input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Guardian Phone</label><input type="text" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fee Status</label>
              <select name="feeStatus" value={formData.feeStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Overdue">Overdue</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Fee Paid (₹)</label><input type="number" name="monthlyFeePaid" value={formData.monthlyFeePaid} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Pending Amount (₹)</label><input type="number" name="pendingAmount" value={formData.pendingAmount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Resident'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostelStudentModal;
