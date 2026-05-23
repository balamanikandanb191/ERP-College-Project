import React, { useState, useEffect } from 'react';
import { DollarSign, Edit2, Trash2, Plus, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ExpenseModal from './ExpenseModal';

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hostel/expenses');
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Hostel API Error:', err.response?.data || err.message);
      toast.error('Failed to load expenses', { id: 'expenses-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense record?')) {
      try {
        await api.delete(`/hostel/expenses/${id}`);
        toast.success('Expense deleted');
        fetchExpenses();
      } catch (error) {
        console.error('Hostel API Error:', error.response?.data || error.message);
        toast.error('Failed to delete expense', { id: 'delete-expense-err' });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading expenses...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><DollarSign className="text-indigo-600" size={20} /> Hostel Expenses ({expenses.length})</h2>
        <button onClick={() => { setSelectedExpense(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-indigo-200">
          <Plus size={18} /> Record Expense
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Expense Detail</th>
              <th className="px-4 py-4 font-semibold">Category</th>
              <th className="px-4 py-4 font-semibold">Amount</th>
              <th className="px-4 py-4 font-semibold">Date</th>
              <th className="px-4 py-4 font-semibold">Paid To / Method</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {expenses.length > 0 ? expenses.map(e => (
              <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-gray-900">{e.expenseTitle}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{e.notes || 'No notes'}</p>
                </td>
                <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">{e.category}</span></td>
                <td className="px-4 py-4 font-bold text-rose-600">₹{e.amount?.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {new Date(e.expenseDate).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <p className="font-medium text-sm text-gray-800">{e.paidTo || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{e.paymentMethod}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedExpense(e); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(e.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No expenses recorded.</td></tr>}
          </tbody>
        </table>
      </div>
      <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchExpenses} initialData={selectedExpense} />
    </div>
  );
};

export default ExpenseTable;
