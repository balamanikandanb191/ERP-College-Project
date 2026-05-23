import React, { useState, useEffect } from 'react';
import { Bed, Edit2, Trash2, Plus, Users, Shield } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RoomModal from './RoomModal';

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hostel/rooms');
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Hostel API Error:', err.response?.data || err.message);
      toast.error('Failed to load rooms', { id: 'rooms-err' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this room?')) {
      try {
        await api.delete(`/hostel/rooms/${id}`);
        toast.success('Room deleted');
        fetchRooms();
      } catch (error) {
        console.error('Hostel API Error:', error.response?.data || error.message);
        toast.error('Failed to delete room', { id: 'delete-room-err' });
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Full': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Reserved': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading rooms...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Bed className="text-indigo-600" size={20} /> Hostel Rooms ({rooms.length})</h2>
        <button onClick={() => { setSelectedRoom(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-indigo-200">
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Room Info</th>
              <th className="px-4 py-4 font-semibold">Occupancy</th>
              <th className="px-4 py-4 font-semibold">Warden</th>
              <th className="px-4 py-4 font-semibold">Revenue (M)</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rooms.length > 0 ? rooms.map(room => (
              <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Bed size={20} /></div>
                    <div>
                      <p className="font-bold text-gray-900">{room.roomNumber}</p>
                      <p className="text-xs text-gray-500">Block {room.hostelBlock} • {room.roomType}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{room.occupiedBeds || 0}/{room.totalBeds} Beds</span>
                      <span className="text-gray-500">{Math.round(((room.occupiedBeds || 0) / room.totalBeds) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${(room.occupiedBeds || 0) === room.totalBeds ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${((room.occupiedBeds || 0) / room.totalBeds) * 100}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {room.warden ? (
                    <div className="flex items-center gap-2"><Shield size={14} className="text-amber-500" /><span className="text-sm font-medium">{room.warden.fullName}</span></div>
                  ) : <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Unassigned</span>}
                </td>
                <td className="px-4 py-4 font-medium text-emerald-600">₹{((room.occupiedBeds || 0) * (room.monthlyFee || 0)).toLocaleString()}</td>
                <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(room.roomStatus)}`}>{room.roomStatus}</span></td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No rooms found.</td></tr>}
          </tbody>
        </table>
      </div>
      <RoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchRooms} initialData={selectedRoom} />
    </div>
  );
};

export default RoomTable;
