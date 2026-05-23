import React, { useState, useEffect } from 'react';
import { IndianRupee, Printer, Download, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentHistoryTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/fees/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fees API Error:', err.response?.data || err.message);
      toast.error('Failed to load payments', { id: 'payments-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePrintReceipt = (payment) => {
    toast.success(`Printing receipt ${payment.receiptNumber}`);
    // Ideally this would open a new window and trigger window.print() on a receipt template
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading payment history...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><IndianRupee className="text-emerald-600" size={20} /> Transaction History ({payments.length})</h2>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Receipt No</th>
              <th className="px-4 py-4 font-semibold">Student / Fee</th>
              <th className="px-4 py-4 font-semibold">Amount Paid</th>
              <th className="px-4 py-4 font-semibold">Payment Details</th>
              <th className="px-4 py-4 font-semibold">Date & Time</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {payments.length > 0 ? payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4"><span className="font-bold text-gray-900">{p.receiptNumber}</span></td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">{p.StudentFee?.Student?.fullName}</div>
                  <div className="text-xs text-gray-500">{p.StudentFee?.FeeStructure?.title} • {p.StudentFee?.Student?.registerNumber}</div>
                </td>
                <td className="px-4 py-4 font-bold text-emerald-600">₹{p.amountPaid.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">{p.paymentMethod}</div>
                  {p.transactionId && <div className="text-xs text-gray-500">Ref: {p.transactionId}</div>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {new Date(p.paymentDate).toLocaleString()}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => handlePrintReceipt(p)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-end w-full gap-1.5 font-medium text-xs">
                    <Printer size={14} /> Print
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No payment transactions found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
