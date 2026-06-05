import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MaintenanceModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    busId: '',
    issueType: '',
    description: '',
    repairCost: '',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchBuses();
      if (initialData) {
        setFormData({
          ...initialData,
          repairCost: initialData.repairCost || '',
          busId: initialData.busId || ''
        });
      } else {
        setFormData({
          busId: '',
          issueType: '',
          description: '',
          repairCost: '',
          serviceDate: new Date().toISOString().split('T')[0],
          nextServiceDate: '',
          status: 'Pending'
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchBuses = async () => {
    try {
      const { data } = await api.get('/transport/buses');
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        repairCost: formData.repairCost ? parseFloat(formData.repairCost) : 0,
        busId: parseInt(formData.busId, 10),
        nextServiceDate: formData.nextServiceDate || null
      };

      if (initialData?.id) {
        await api.put(`/transport/maintenance/${initialData.id}`, payload);
        toast.success('Maintenance record updated successfully');
      } else {
        await api.post('/transport/maintenance', payload);
        toast.success('Maintenance record added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save maintenance record');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end items-start p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl max-h-[calc(100vh-6rem)] mt-16 mr-2 rounded-3xl shadow-2xl flex flex-col overflow-y-auto animate-slide-in"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <Settings className="text-red-600" size={20} />
            </div>
            {initialData ? 'Edit Maintenance Record' : 'Log Maintenance Service'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Bus *</label>
              <select name="busId" value={formData.busId} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white">
                <option value="">-- Choose Bus --</option>
                {buses.map(b => (
                  <option key={b.id} value={b.id}>{b.busNumber}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Issue / Service Type *</label>
              <input type="text" name="issueType" value={formData.issueType} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="e.g. Engine Oil Change" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="Details of the issue or service performed..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated / Total Cost (₹)</label>
              <input type="number" name="repairCost" value={formData.repairCost} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="e.g. 5000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Date *</label>
              <input type="date" name="serviceDate" value={formData.serviceDate} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Next Scheduled Service</label>
              <input type="date" name="nextServiceDate" value={formData.nextServiceDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-red-200">
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;
