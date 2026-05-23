import React, { useState, useEffect } from 'react';
import { X, Save, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const DriverModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    licenseNumber: '',
    experience: '',
    emergencyContact: '',
    status: 'Active',
    performanceScore: 100
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          experience: initialData.experience || '',
          performanceScore: initialData.performanceScore || 100
        });
      } else {
        setFormData({
          fullName: '',
          phone: '',
          licenseNumber: '',
          experience: '',
          emergencyContact: '',
          status: 'Active',
          performanceScore: 100
        });
      }
    }
  }, [isOpen, initialData]);

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
        experience: parseInt(formData.experience, 10),
        performanceScore: parseInt(formData.performanceScore, 10)
      };

      if (initialData?.id) {
        await api.put(`/transport/drivers/${initialData.id}`, payload);
        toast.success('Driver updated successfully');
      } else {
        await api.post('/transport/drivers', payload);
        toast.success('Driver added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save driver');
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
              <Users className="text-blue-600" size={20} />
            </div>
            {initialData ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Driver Name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Mobile Number" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">License Number *</label>
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Driving License" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years) *</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. 5" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Emergency Phone" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-blue-200">
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverModal;
