import React, { useState, useEffect } from 'react';
import { X, Save, Bus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const BusModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    capacity: '',
    occupancy: 0,
    condition: 'Good',
    status: 'Active',
    fuelType: 'Diesel',
    assignedDriverId: ''
  });
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchDrivers();
      if (initialData) {
        setFormData({
          ...initialData,
          capacity: initialData.capacity || '',
          occupancy: initialData.occupancy || 0,
          assignedDriverId: initialData.assignedDriverId || ''
        });
      } else {
        setFormData({
          busNumber: '',
          busName: '',
          capacity: '',
          occupancy: 0,
          condition: 'Good',
          status: 'Active',
          fuelType: 'Diesel',
          assignedDriverId: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get('/transport/drivers');
      setDrivers(Array.isArray(data) ? data : []);
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
        capacity: parseInt(formData.capacity, 10),
        occupancy: parseInt(formData.occupancy, 10),
        assignedDriverId: formData.assignedDriverId ? parseInt(formData.assignedDriverId, 10) : null
      };

      if (initialData?.id) {
        await api.put(`/transport/buses/${initialData.id}`, payload);
        toast.success('Bus updated successfully');
      } else {
        await api.post('/transport/buses', payload);
        toast.success('Bus added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save bus');
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
              <Bus className="text-blue-600" size={20} />
            </div>
            {initialData ? 'Edit Bus' : 'Add New Bus'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Number (Reg No) *</label>
              <input type="text" name="busNumber" value={formData.busNumber} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. TN-33-AB-1234" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Name/Identifier</label>
              <input type="text" name="busName" value={formData.busName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. Campus Express 1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Capacity *</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Occupancy</label>
              <input type="number" name="occupancy" value={formData.occupancy} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Maintenance">Maintenance Required</option>
                <option value="Critical">Critical Issue</option>
                <option value="Not Running">Not Running</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="Active">Active</option>
                <option value="Delayed">Delayed</option>
                <option value="In Service">In Service</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Driver</label>
              <select name="assignedDriverId" value={formData.assignedDriverId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="">-- No Driver --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.fullName} ({d.licenseNumber})</option>
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
              {loading ? 'Saving...' : 'Save Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusModal;
