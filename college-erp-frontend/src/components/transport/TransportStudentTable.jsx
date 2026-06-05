import React, { useState, useEffect } from 'react';
import { Users, Bus, Trash2, Check, X, MapPin, Phone, Edit } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TransportStudentTable = () => {
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editing state
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editRoute, setEditRoute] = useState('');
  const [editPickup, setEditPickup] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sData, rData] = await Promise.all([
        api.get('/students'),
        api.get('/transport/routes')
      ]);
      
      const allStudents = Array.isArray(sData.data) ? sData.data : [];
      // Filter students who require transport
      const transportRequiredStudents = allStudents.filter(
        s => s.busRequired === true || s.busRequired === 1 || s.busRequired === 'Yes'
      );
      
      setStudents(transportRequiredStudents);
      setRoutes(Array.isArray(rData.data) ? rData.data : []);
    } catch (err) {
      console.error('Transport students fetch error:', err);
      toast.error('Failed to load transport details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartEdit = (student) => {
    setEditingStudentId(student.id);
    setEditRoute(student.busRoute || '');
    setEditPickup(student.pickupPoint || '');
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
  };

  const handleSaveEdit = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const payload = {
        ...student,
        busRoute: editRoute,
        pickupPoint: editPickup
      };

      await api.put(`/students/${studentId}`, payload);
      toast.success('Transport details updated successfully');
      setEditingStudentId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update transport allocation');
    }
  };

  const handleRemoveFromTransport = async (student) => {
    if (window.confirm(`Remove ${student.fullName} from Transport list?`)) {
      try {
        const payload = {
          ...student,
          busRequired: false,
          busRoute: '',
          pickupPoint: ''
        };
        await api.put(`/students/${student.id}`, payload);
        toast.success('Student removed from transport');
        fetchData();
      } catch (err) {
        toast.error('Failed to remove student from transport');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading transport students...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bus className="text-blue-600" size={20} />
          Transport Students ({students.length})
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Student Info</th>
              <th className="px-4 py-4 font-semibold">Course / Standard</th>
              <th className="px-4 py-4 font-semibold">Assigned Route</th>
              <th className="px-4 py-4 font-semibold">Pickup Point</th>
              <th className="px-4 py-4 font-semibold">Contact</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {students.length > 0 ? (
              students.map(s => {
                const isEditing = editingStudentId === s.id;
                return (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {s.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{s.fullName}</p>
                          <p className="text-xs text-gray-500 font-mono">{s.registerNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800 text-sm">{s.course || s.department || 'N/A'}</p>
                      <p className="text-xs text-gray-500">Section: {s.section || 'A'}</p>
                    </td>
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <select 
                          value={editRoute} 
                          onChange={(e) => setEditRoute(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- No Route Assigned --</option>
                          {routes.map(r => (
                            <option key={r.id} value={r.routeName}>{r.routeName}</option>
                          ))}
                        </select>
                      ) : (
                        <div>
                          {s.busRoute ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              <Bus size={12} /> {s.busRoute}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
                              Not Assigned
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editPickup} 
                          onChange={(e) => setEditPickup(e.target.value)}
                          placeholder="e.g. Main Gate"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-gray-700 font-medium">
                          {s.pickupPoint ? (
                            <>
                              <MapPin size={14} className="text-gray-400" />
                              {s.pickupPoint}
                            </>
                          ) : (
                            <span className="text-gray-400 italic">None</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                        <span className="flex items-center gap-1 font-medium"><Phone size={12} className="text-gray-400" /> {s.phone || 'N/A'}</span>
                        {s.fatherPhone && <span className="text-gray-400">Parent: {s.fatherPhone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleSaveEdit(s.id)} 
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg border border-emerald-100 transition-colors"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={handleCancelEdit} 
                            className="p-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleStartEdit(s)} 
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Transport Info"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleRemoveFromTransport(s)} 
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from transport list"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No students require transport. You can enable transport during student registration.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransportStudentTable;
