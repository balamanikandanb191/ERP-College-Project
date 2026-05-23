import React, { useState, useEffect } from 'react';
import { X, Save, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const PaymentModal = ({ isOpen, onClose, onSuccess, feeData }) => {
  const [formData, setFormData] = useState({ amountPaid: '', paymentMethod: 'Bank Transfer', transactionId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && feeData) {
      const payableAmount = (feeData.dueAmount || 0) + (feeData.calculatedFine || 0);
      setFormData({ amountPaid: payableAmount.toString(), paymentMethod: 'Bank Transfer', transactionId: '' });
    }
  }, [isOpen, feeData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        studentFeeId: feeData.id,
        amountPaid: parseFloat(formData.amountPaid),
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId
      };
      await api.post('/fees/payments', payload);
      toast.success('Payment recorded successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !feeData) return null;

  const payableAmount = (feeData.dueAmount || 0) + (feeData.calculatedFine || 0);

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-indigo-50 p-2 rounded-lg"><IndianRupee className="text-indigo-600" size={20} /></div>Record Payment</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Student: <strong className="text-gray-900">{feeData.Student?.fullName}</strong></p>
            <p className="text-sm text-gray-500 mb-1">Fee: <strong className="text-gray-900">{feeData.FeeStructure?.title}</strong></p>
            <div className="flex justify-between mt-3 text-sm font-semibold">
              <span className="text-gray-600">Total Payable:</span>
              <span className="text-rose-600">₹{payableAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Amount to Pay (₹) *</label><input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} required min="1" max={payableAmount} step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method *</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Cash">Cash</option><option value="Bank Transfer">Bank Transfer</option><option value="UPI">UPI</option><option value="Cheque">Cheque</option><option value="Demand Draft">Demand Draft</option>
              </select>
            </div>
            {formData.paymentMethod !== 'Cash' && (
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Transaction/Reference ID *</label><input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g. UPI Ref Number" /></div>
            )}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Processing...' : 'Confirm Payment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
