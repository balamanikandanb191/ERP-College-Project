import React, { useState, useEffect } from 'react';
import { X, Save, Bed } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const RoomModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    hostelBlock: '',
    floor: '',
    roomType: 'Double',
    totalBeds: '',
    roomStatus: 'Available',
    monthlyFee: '',
    assignedWardenId: ''
  });
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWardens();
      if (initialData) {
        setFormData({
          ...initialData,
          floor: initialData.floor || '',
          totalBeds: initialData.totalBeds || '',
          monthlyFee: initialData.monthlyFee || '',
          assignedWardenId: initialData.assignedWardenId || ''
        });
      } else {
        setFormData({
          roomNumber: '', hostelBlock: '', floor: '', roomType: 'Double', totalBeds: '', roomStatus: 'Available', monthlyFee: '', assignedWardenId: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchWardens = async () => {
    try {
      const { data } = await api.get('/hostel/wardens');
      setWardens(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        floor: parseInt(formData.floor, 10),
        totalBeds: parseInt(formData.totalBeds, 10),
        monthlyFee: parseFloat(formData.monthlyFee),
        assignedWardenId: formData.assignedWardenId ? parseInt(formData.assignedWardenId, 10) : null
      };
      if (initialData?.id) await api.put(`/hostel/rooms/${initialData.id}`, payload);
      else await api.post('/hostel/rooms', payload);
      toast.success('Room saved successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-indigo-50 p-2 rounded-lg"><Bed className="text-indigo-600" size={20} /></div>{initialData ? 'Edit Room' : 'Add New Room'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Room Number *</label><input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Hostel Block *</label><input type="text" name="hostelBlock" value={formData.hostelBlock} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Floor</label><input type="number" name="floor" value={formData.floor} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Room Type</label>
              <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Single">Single</option><option value="Double">Double</option><option value="Triple">Triple</option><option value="Quad">Quad</option><option value="Dormitory">Dormitory</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Total Beds *</label><input type="number" name="totalBeds" value={formData.totalBeds} onChange={handleChange} required min="1" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Fee (₹) *</label><input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="roomStatus" value={formData.roomStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="Available">Available</option><option value="Full">Full</option><option value="Maintenance">Maintenance</option><option value="Reserved">Reserved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Warden</label>
              <select name="assignedWardenId" value={formData.assignedWardenId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="">-- No Warden --</option>
                {wardens.map(w => <option key={w.id} value={w.id}>{w.fullName}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Room'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
