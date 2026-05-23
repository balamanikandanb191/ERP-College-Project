import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ExpenseModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    expenseTitle: '', category: 'Maintenance', amount: '', expenseDate: new Date().toISOString().split('T')[0], paidTo: '', paymentMethod: 'Cash', notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData({ ...initialData });
      else setFormData({ expenseTitle: '', category: 'Maintenance', amount: '', expenseDate: new Date().toISOString().split('T')[0], paidTo: '', paymentMethod: 'Cash', notes: '' });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (initialData?.id) await api.put(`/hostel/expenses/${initialData.id}`, payload);
      else await api.post('/hostel/expenses', payload);
      toast.success('Expense saved successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-indigo-50 p-2 rounded-lg"><DollarSign className="text-indigo-600" size={20} /></div>{initialData ? 'Edit Expense' : 'Record Expense'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Expense Title *</label><input type="text" name="expenseTitle" value={formData.expenseTitle} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g. Monthly Electricity Bill" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Electricity">Electricity</option><option value="Water">Water</option><option value="Internet">Internet</option>
                <option value="Food">Food</option><option value="Cleaning">Cleaning</option><option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option><option value="Salaries">Salaries</option><option value="Furniture">Furniture</option>
                <option value="Repairs">Repairs</option><option value="Other">Other</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹) *</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Expense Date *</label><input type="date" name="expenseDate" value={formData.expenseDate} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Paid To</label><input type="text" name="paidTo" value={formData.paidTo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Vendor / Person name" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Cash">Cash</option><option value="Bank Transfer">Bank Transfer</option><option value="Cheque">Cheque</option><option value="UPI">UPI</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Additional details..."></textarea></div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Expense'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
