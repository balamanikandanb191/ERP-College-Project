import React, { useState } from 'react';
import { Trash2, Edit2, AlertTriangle, Users } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DailyTimetableView = ({ timetables, loading, settings, searchQuery, onRefresh }) => {
  const [filterDept, setFilterDept] = useState('CSE');
  const [filterSem, setFilterSem] = useState('1');
  const [filterSec, setFilterSec] = useState('A');

  const handleDelete = async (id) => {
    if (window.confirm('Delete this scheduled class?')) {
      try {
        await api.delete(`/timetable/${id}`);
        toast.success('Deleted successfully');
        onRefresh();
      } catch (e) {
        toast.error('Failed to delete class');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading daily timetable...</div>;

  const days = settings?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const totalPeriods = settings?.totalPeriods || 8;
  const breakPeriod = settings?.breakAfterPeriod || 4;
  const periods = Array.from({ length: totalPeriods }, (_, i) => i + 1);

  // Filter the timetable based on UI dropdowns and search query
  const filteredData = timetables.filter(t => {
    const matchDept = t.department === filterDept;
    const matchSem = t.semester === filterSem;
    const matchSec = t.section === filterSec;
    
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      return t.subject?.toLowerCase().includes(sq) || 
             t.staff?.fullName?.toLowerCase().includes(sq) || 
             t.roomNumber?.toLowerCase().includes(sq);
    }
    return matchDept && matchSem && matchSec;
  });

  const getCellData = (day, period) => {
    return filteredData.find(t => t.day === day && t.periodNumber === period);
  };

  const getStatusColor = (status, type) => {
    if (status === 'Cancelled') return 'bg-red-50 border-red-200 text-red-800';
    if (status === 'Substitute') return 'bg-amber-50 border-amber-200 text-amber-800';
    if (type?.toLowerCase().includes('lab')) return 'bg-purple-50 border-purple-200 text-purple-800';
    return 'bg-blue-50 border-blue-200 text-blue-800'; // Scheduled normal class
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 items-center justify-between">
        <div className="flex gap-4">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 outline-none text-sm font-semibold">
            {['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 outline-none text-sm font-semibold">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s.toString()}>Sem {s}</option>)}
          </select>
          <select value={filterSec} onChange={e => setFilterSec(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 outline-none text-sm font-semibold">
            {['A', 'B', 'C'].map(s => <option key={s} value={s}>Sec {s}</option>)}
          </select>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Showing timetable for: <strong className="text-gray-900">{filterDept} - Sem {filterSem} - Sec {filterSec}</strong>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-bold border-r border-gray-200 w-32 text-center bg-gray-200">Day / Period</th>
              {periods.map(p => (
                <th key={p} className={`px-4 py-3 font-bold text-center border-r border-gray-200 ${p === breakPeriod ? 'bg-amber-100 text-amber-800' : ''}`}>
                  {p === breakPeriod ? 'Break' : `Period ${p}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {days.map(day => (
              <tr key={day} className="border-b border-gray-200 last:border-b-0">
                <td className="px-4 py-4 font-bold text-gray-900 text-center border-r border-gray-200 bg-gray-50">{day}</td>
                {periods.map(period => {
                  const cell = getCellData(day, period);
                  
                  if (period === breakPeriod) {
                    return <td key={period} className="px-2 py-4 text-center border-r border-gray-200 bg-gray-50"><span className="text-xs font-semibold text-gray-400 rotate-90 block">LUNCH</span></td>;
                  }

                  if (!cell) {
                    return <td key={period} className="px-2 py-4 border-r border-gray-200 bg-gray-50/30 text-center"><span className="text-xs text-gray-400">Free</span></td>;
                  }

                  return (
                    <td key={period} className="p-2 border-r border-gray-200 align-top group">
                      <div className={`p-3 rounded-lg border h-full flex flex-col justify-between relative transition-all ${getStatusColor(cell.status, cell.subject)}`}>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button onClick={() => handleDelete(cell.id)} className="p-1 text-gray-500 hover:text-red-600 bg-white/80 rounded shadow-sm"><Trash2 size={12} /></button>
                        </div>
                        <div>
                          <div className="font-bold text-sm mb-1 line-clamp-2 leading-tight">{cell.subject}</div>
                          <div className="text-xs font-medium opacity-80 flex items-center gap-1"><Users size={10} /> {cell.staff?.fullName?.split(' ')[0]}</div>
                        </div>
                        <div className="flex justify-between items-end mt-3 text-[10px] font-bold opacity-70 uppercase tracking-wider">
                          <span>{cell.roomNumber}</span>
                          <span>{cell.startTime?.substring(0, 5)}</span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyTimetableView;
