import React, { useState, useEffect } from 'react';
import { Settings, Edit2, Trash2, Plus, Calendar, IndianRupee } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import MaintenanceModal from './MaintenanceModal';

const MaintenanceTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transport/maintenance');
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await api.delete(`/transport/maintenance/${id}`);
        toast.success('Maintenance record deleted successfully');
        fetchRecords();
      } catch (error) {
        toast.error('Failed to delete maintenance record');
      }
    }
  };

  const openAddModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading records...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-blue-600" size={20} />
          Maintenance Log ({records.length})
        </h2>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Log Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Bus</th>
              <th className="px-4 py-4 font-semibold">Issue/Service</th>
              <th className="px-4 py-4 font-semibold">Date</th>
              <th className="px-4 py-4 font-semibold">Cost</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Array.isArray(records) && records.length > 0 ? records.map(record => (
              <tr key={record.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 font-bold text-gray-900">{record.bus ? record.bus.busNumber : 'Unknown'}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-gray-800">{record.issueType}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{record.description}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {record.serviceDate ? new Date(record.serviceDate).toLocaleDateString() : 'N/A'}</div>
                    {record.nextServiceDate && <div className="text-xs text-gray-500 pl-5">Next: {new Date(record.nextServiceDate).toLocaleDateString()}</div>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                    <IndianRupee size={14} className="text-gray-400" />
                    {record.repairCost ? record.repairCost.toLocaleString() : '0'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${record.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : record.status === 'In Progress' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(record)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(record.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No maintenance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MaintenanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRecords}
        initialData={selectedRecord}
      />
    </div>
  );
};

export default MaintenanceTable;
