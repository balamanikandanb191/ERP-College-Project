import React, { useState, useEffect } from 'react';
import { Users, Edit2, Trash2, Plus, PhoneCall, Star, Bus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import DriverModal from './DriverModal';

const DriverTable = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transport/drivers');
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/transport/drivers/${id}`);
        toast.success('Driver deleted successfully');
        fetchDrivers();
      } catch (error) {
        toast.error('Failed to delete driver');
      }
    }
  };

  const openAddModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On Leave': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Suspended': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading drivers...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Users className="text-blue-600" size={20} />
          Driver Roster ({drivers.length})
        </h2>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Add Driver
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Driver Profile</th>
              <th className="px-4 py-4 font-semibold">Contact Info</th>
              <th className="px-4 py-4 font-semibold">Assigned Bus</th>
              <th className="px-4 py-4 font-semibold">Performance</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Array.isArray(drivers) && drivers.length > 0 ? drivers.map(driver => (
              <tr key={driver.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {driver?.fullName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{driver.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Exp: {driver.experience} yrs • Lic: {driver.licenseNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <PhoneCall size={14} className="text-gray-400" />
                    {driver.phone}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {driver.assignedBus ? (
                    <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                      <Bus size={14} className="text-blue-500" />
                      {driver.assignedBus.busNumber}
                    </div>
                  ) : <span className="text-xs text-gray-500">Unassigned</span>}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold text-sm text-gray-900">{driver.performanceScore || 100}</span>
                    <span className="text-xs text-gray-500">/100</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(driver)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(driver.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No drivers found. Add your first driver.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DriverModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDrivers}
        initialData={selectedDriver}
      />
    </div>
  );
};

export default DriverTable;
