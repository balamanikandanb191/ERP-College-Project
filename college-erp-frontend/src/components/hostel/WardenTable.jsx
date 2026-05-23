import React, { useState, useEffect } from 'react';
import { Shield, Edit2, Trash2, Plus, PhoneCall, Mail } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import WardenModal from './WardenModal';

const WardenTable = () => {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarden, setSelectedWarden] = useState(null);

  const fetchWardens = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hostel/wardens');
      setWardens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Hostel API Error:', err.response?.data || err.message);
      toast.error('Failed to load wardens', { id: 'wardens-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardens();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this warden?')) {
      try {
        await api.delete(`/hostel/wardens/${id}`);
        toast.success('Warden deleted');
        fetchWardens();
      } catch (error) {
        console.error('Hostel API Error:', error.response?.data || error.message);
        toast.error('Failed to delete warden', { id: 'delete-warden-err' });
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading wardens...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Shield className="text-indigo-600" size={20} /> Hostel Wardens ({wardens.length})</h2>
        <button onClick={() => { setSelectedWarden(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-indigo-200">
          <Plus size={18} /> Add Warden
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Warden Profile</th>
              <th className="px-4 py-4 font-semibold">Contact</th>
              <th className="px-4 py-4 font-semibold">Assigned Block</th>
              <th className="px-4 py-4 font-semibold">Experience</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {wardens.length > 0 ? wardens.map(w => (
              <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {w.fullName?.charAt(0) || 'W'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{w.fullName}</p>
                      <p className="text-xs text-gray-500">ID: {w.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="flex items-center gap-1.5"><PhoneCall size={14} className="text-gray-400" /> {w.phone}</span>
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {w.email || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-gray-800">Block {w.assignedBlock || 'N/A'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{w.experienceYears} Years</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${w.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedWarden(w); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(w.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No wardens found.</td></tr>}
          </tbody>
        </table>
      </div>
      <WardenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchWardens} initialData={selectedWarden} />
    </div>
  );
};

export default WardenTable;
