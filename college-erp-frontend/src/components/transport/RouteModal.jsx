import React, { useState, useEffect } from 'react';
import { X, Save, Map } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const RouteModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    estimatedTime: '',
    status: 'Active',
    busId: ''
  });
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchBuses();
      if (initialData) {
        setFormData({
          ...initialData,
          distance: initialData.distance || '',
          estimatedTime: initialData.estimatedTime || '',
          busId: initialData.busId || ''
        });
      } else {
        setFormData({
          routeName: '',
          startPoint: '',
          endPoint: '',
          distance: '',
          estimatedTime: '',
          status: 'Active',
          busId: ''
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
        distance: formData.distance ? parseFloat(formData.distance) : null,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime, 10) : null,
        busId: formData.busId ? parseInt(formData.busId, 10) : null
      };

      if (initialData?.id) {
        await api.put(`/transport/routes/${initialData.id}`, payload);
        toast.success('Route updated successfully');
      } else {
        await api.post('/transport/routes', payload);
        toast.success('Route added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save route');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Map className="text-blue-600" size={20} />
            </div>
            {initialData ? 'Edit Route' : 'Add New Route'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Route Name *</label>
              <input type="text" name="routeName" value={formData.routeName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. North Campus Route A" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Location *</label>
              <input type="text" name="startPoint" value={formData.startPoint} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Start Point" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Location *</label>
              <input type="text" name="endPoint" value={formData.endPoint} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="End Point" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Distance (km)</label>
              <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. 15.5" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Duration (mins)</label>
              <input type="number" name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. 45" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Bus</label>
              <select name="busId" value={formData.busId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="">-- No Bus --</option>
                {buses.map(b => (
                  <option key={b.id} value={b.id}>{b.busNumber} ({b.capacity} seats)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-blue-200">
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteModal;
