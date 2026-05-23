import React, { useState, useEffect } from 'react';
import { Bus, Edit2, Trash2, Plus, Info } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import BusModal from './BusModal';

const BusTable = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transport/buses');
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await api.delete(`/transport/buses/${id}`);
        toast.success('Bus deleted successfully');
        fetchBuses();
      } catch (error) {
        toast.error('Failed to delete bus');
      }
    }
  };

  const openAddModal = () => {
    setSelectedBus(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Not Running': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading fleet...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bus className="text-blue-600" size={20} />
          Active Fleet ({buses.length})
        </h2>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Add Bus
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Bus Details</th>
              <th className="px-4 py-4 font-semibold">Occupancy</th>
              <th className="px-4 py-4 font-semibold">Driver</th>
              <th className="px-4 py-4 font-semibold">Route</th>
              <th className="px-4 py-4 font-semibold">Condition</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Array.isArray(buses) && buses.length > 0 ? buses.map(bus => (
              <tr key={bus.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Bus size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{bus.busNumber}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Info size={12} /> {bus.fuelType || 'Diesel'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{bus.occupancy || 0}/{bus.capacity || 0}</span>
                      <span className="text-gray-500">{bus.capacity > 0 ? Math.round(((bus.occupancy || 0)/bus.capacity)*100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${(bus.occupancy || 0) > (bus.capacity || 0) * 0.9 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                           style={{ width: `${Math.min(((bus.occupancy || 0)/(bus.capacity || 1))*100, 100)}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {bus.driver ? (
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{bus.driver.fullName}</p>
                      <p className="text-xs text-gray-500">{bus.driver.phone}</p>
                    </div>
                  ) : <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Unassigned</span>}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-sm text-gray-800">{bus.route ? bus.route.routeName : 'No Route'}</p>
                  <p className="text-xs text-gray-500">{bus.status}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getConditionColor(bus.condition)}`}>
                    {bus.condition}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(bus)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(bus.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No buses found. Add your first bus to the fleet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <BusModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchBuses}
        initialData={selectedBus}
      />
    </div>
  );
};

export default BusTable;
