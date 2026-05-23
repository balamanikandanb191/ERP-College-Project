import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const FeeStructureModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '', department: 'All', year: 'All', semester: '', amount: '', dueDate: new Date().toISOString().split('T')[0], finePerDay: '0', description: '', status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...initialData });
      else setFormData({ title: '', department: 'All', year: 'All', semester: '', amount: '', dueDate: new Date().toISOString().split('T')[0], finePerDay: '0', description: '', status: 'Active' });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData, amount: parseFloat(formData.amount), finePerDay: parseFloat(formData.finePerDay || 0) };
      if (initialData?.id) await api.put(`/fees/structures/${initialData.id}`, payload);
      else await api.post('/fees/structures', payload);
      toast.success('Fee structure saved successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save structure');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-emerald-50 p-2 rounded-lg"><FileText className="text-emerald-600" size={20} /></div>{initialData ? 'Edit Structure' : 'New Fee Structure'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Fee Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="e.g. Tuition Fee 2026" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none bg-white">
                <option value="All">All Departments</option><option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
              <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none bg-white">
                <option value="All">All Years</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label><input type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" placeholder="e.g. 1" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹) *</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Due Date *</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Fine Per Day (₹)</label><input type="number" name="finePerDay" value={formData.finePerDay} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none bg-white">
                <option value="Active">Active</option><option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 outline-none"></textarea></div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Structure'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeStructureModal;
