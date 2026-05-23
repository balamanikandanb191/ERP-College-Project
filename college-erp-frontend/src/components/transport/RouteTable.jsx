import React, { useState, useEffect } from 'react';
import { Map, Edit2, Trash2, Plus, Clock, MapPin, Bus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RouteModal from './RouteModal';

const RouteTable = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transport/routes');
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await api.delete(`/transport/routes/${id}`);
        toast.success('Route deleted successfully');
        fetchRoutes();
      } catch (error) {
        toast.error('Failed to delete route');
      }
    }
  };

  const openAddModal = () => {
    setSelectedRoute(null);
    setIsModalOpen(true);
  };

  const openEditModal = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading routes...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Map className="text-blue-600" size={20} />
          Active Routes ({routes.length})
        </h2>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Add Route
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Route Info</th>
              <th className="px-4 py-4 font-semibold">Path</th>
              <th className="px-4 py-4 font-semibold">Assigned Bus</th>
              <th className="px-4 py-4 font-semibold">Duration/Dist</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Array.isArray(routes) && routes.length > 0 ? routes.map(route => (
              <tr key={route.id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-gray-900">{route.routeName}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{route.startPoint}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">{route.endPoint}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {route.bus ? (
                    <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                      <Bus size={14} className="text-blue-500" />
                      {route.bus.busNumber}
                    </div>
                  ) : <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Unassigned</span>}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Clock size={14} className="text-amber-500" /> {route.estimatedTime || 0} mins</span>
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-blue-500" /> {route.distance || 0} km</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {route.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(route)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(route.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No routes found. Create a new transport route.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RouteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRoutes}
        initialData={selectedRoute}
      />
    </div>
  );
};

export default RouteTable;
