import React, { useState, useEffect } from 'react';
import { Users, Plus, AlertTriangle, CheckCircle, IndianRupee, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StudentFeeModal from './StudentFeeModal';
import PaymentModal from './PaymentModal';

const StudentFeeTable = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/fees/students');
      setFees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fees API Error:', err.response?.data || err.message);
      toast.error('Failed to load student fees', { id: 'student-fees-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const getStatusColor = (status, isOverdue) => {
    if (status === 'Paid') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (isOverdue) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (status === 'Partial') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading student fees...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Users className="text-emerald-600" size={20} /> Student Fees ({fees.length})</h2>
        <button onClick={() => setIsAssignModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-emerald-200">
          <Plus size={18} /> Assign Fee
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Student Info</th>
              <th className="px-4 py-4 font-semibold">Fee Details</th>
              <th className="px-4 py-4 font-semibold">Financials</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {fees.length > 0 ? fees.map(f => (
              <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      {f.Student?.fullName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{f.Student?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{f.Student?.registerNumber} • {f.Student?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">{f.FeeStructure?.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> Due: {new Date(f.FeeStructure?.dueDate).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-gray-700">Total: ₹{f.totalAmount.toLocaleString()}</span>
                    {f.dueAmount > 0 && <span className="font-bold text-rose-600">Due: ₹{f.dueAmount.toLocaleString()}</span>}
                    {f.calculatedFine > 0 && <span className="text-xs font-semibold text-amber-600">+ ₹{f.calculatedFine.toLocaleString()} Fine</span>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(f.paymentStatus, f.isOverdue)}`}>
                      {f.isOverdue ? 'Overdue' : f.paymentStatus}
                    </span>
                    {f.isOverdue && <AlertTriangle size={14} className="text-rose-500" />}
                    {f.paymentStatus === 'Paid' && <CheckCircle size={14} className="text-emerald-500" />}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  {f.paymentStatus !== 'Paid' && (
                    <button onClick={() => { setSelectedFee(f); setIsPaymentModalOpen(true); }} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-lg text-xs transition-colors">
                      Pay Now
                    </button>
                  )}
                  {f.paymentStatus === 'Paid' && (
                    <button className="px-3 py-1.5 bg-gray-50 text-gray-400 font-semibold rounded-lg text-xs cursor-not-allowed">
                      Settled
                    </button>
                  )}
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No student fees assigned.</td></tr>}
          </tbody>
        </table>
      </div>
      <StudentFeeModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSuccess={fetchFees} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSuccess={fetchFees} feeData={selectedFee} />
    </div>
  );
};

export default StudentFeeTable;
