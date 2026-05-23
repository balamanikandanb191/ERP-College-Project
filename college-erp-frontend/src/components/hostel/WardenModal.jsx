import React, { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const WardenModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    fullName: '', employeeId: '', phone: '', email: '', assignedBlock: '', experienceYears: '', address: '', joiningDate: new Date().toISOString().split('T')[0], status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData, experienceYears: initialData.experienceYears || '' });
      } else {
        setFormData({
          fullName: '', employeeId: '', phone: '', email: '', assignedBlock: '', experienceYears: '', address: '', joiningDate: new Date().toISOString().split('T')[0], status: 'Active'
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData, experienceYears: formData.experienceYears ? parseInt(formData.experienceYears, 10) : 0 };
      if (initialData?.id) await api.put(`/hostel/wardens/${initialData.id}`, payload);
      else await api.post('/hostel/wardens', payload);
      toast.success('Warden saved successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save warden');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-indigo-50 p-2 rounded-lg"><Shield className="text-indigo-600" size={20} /></div>{initialData ? 'Edit Warden' : 'Add New Warden'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID *</label><input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Block</label><input type="text" name="assignedBlock" value={formData.assignedBlock} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years)</label><input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Joining Date</label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"></textarea></div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Warden'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WardenModal;
