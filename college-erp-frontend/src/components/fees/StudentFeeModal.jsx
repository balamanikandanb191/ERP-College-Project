import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const StudentFeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ studentId: '', feeStructureId: '', customAmount: '', remarks: '' });
  const [students, setStudents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setFormData({ studentId: '', feeStructureId: '', customAmount: '', remarks: '' });
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [sData, rData] = await Promise.all([api.get('/students'), api.get('/fees/structures')]);
      setStudents(Array.isArray(sData.data) ? sData.data : []);
      setStructures(Array.isArray(rData.data) ? rData.data.filter(s => s.status === 'Active') : []);
    } catch (e) { console.error('Error fetching data:', e); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData, customAmount: formData.customAmount ? parseFloat(formData.customAmount) : null };
      await api.post('/fees/students', payload);
      toast.success('Fee assigned successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign fee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-emerald-50 p-2 rounded-lg"><FileText className="text-emerald-600" size={20} /></div>Assign Fee to Student</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Student *</label>
              <select name="studentId" value={formData.studentId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none bg-white">
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.registerNumber})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Fee Structure *</label>
              <select name="feeStructureId" value={formData.feeStructureId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none bg-white">
                <option value="">-- Choose Fee Structure --</option>
                {structures.map(s => <option key={s.id} value={s.id}>{s.title} (₹{s.amount})</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Custom Amount (Optional)</label><input type="number" name="customAmount" value={formData.customAmount} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="Leave blank to use default structure amount" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label><textarea name="remarks" value={formData.remarks} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="Add note..."></textarea></div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Assign Fee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFeeModal;
