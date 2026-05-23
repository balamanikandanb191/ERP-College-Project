import React, { useState, useEffect } from 'react';
import { FileText, Edit2, Trash2, Plus, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import FeeStructureModal from './FeeStructureModal';

const FeeStructureTable = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/fees/structures');
      setStructures(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fees API Error:', err.response?.data || err.message);
      toast.error('Failed to load fee structures', { id: 'structures-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this fee structure? This may affect student fees.')) {
      try {
        await api.delete(`/fees/structures/${id}`);
        toast.success('Fee structure deleted');
        fetchStructures();
      } catch (error) {
        console.error('Fees API Error:', error.response?.data || error.message);
        toast.error('Failed to delete structure', { id: 'delete-struct-err' });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading fee structures...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FileText className="text-emerald-600" size={20} /> Fee Structures ({structures.length})</h2>
        <button onClick={() => { setSelectedStructure(null); setIsModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-emerald-200">
          <Plus size={18} /> New Structure
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Title / Desc</th>
              <th className="px-4 py-4 font-semibold">Department / Year</th>
              <th className="px-4 py-4 font-semibold">Amount</th>
              <th className="px-4 py-4 font-semibold">Due Date</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {structures.length > 0 ? structures.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{s.description || 'No description'}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-800">{s.department}</div>
                  <div className="text-xs text-gray-500">Year {s.year} • Sem {s.semester || 'N/A'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-bold text-emerald-600">₹{s.amount?.toLocaleString()}</div>
                  <div className="text-xs text-rose-500">Fine: ₹{s.finePerDay}/day</div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {new Date(s.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{s.status}</span></td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedStructure(s); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No fee structures defined.</td></tr>}
          </tbody>
        </table>
      </div>
      <FeeStructureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchStructures} initialData={selectedStructure} />
    </div>
  );
};

export default FeeStructureTable;
