import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, Clock, Layers, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' },
  { code: 'AN', label: 'Afternoon (01:30 PM - 04:30 PM)' }
];

const DaywarStatement = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [allocations, setAllocations] = useState([]);
  const [invigilators, setInvigilators] = useState({});
  const [existingInvRecords, setExistingInvRecords] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDaywarData = async () => {
    if (!selectedDate) return;
    try {
      setLoading(true);
      // Fetch Allocations
      const resAllocations = await api.get('/masters/exam_allocation');
      let allocs = [];
      if (resAllocations.data) {
        resAllocations.data.forEach(item => {
          if (item.data && item.data.allocations) {
            allocs.push(...item.data.allocations);
          } else if (item.data) {
            allocs.push({ ...item.data, id: item.id });
          }
        });
      } else {
        const cached = localStorage.getItem('erp_exam_allocations');
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.forEach(item => {
            if (item.allocations) allocs.push(...item.allocations);
            else allocs.push(item);
          });
        }
      }

      const filteredAllocs = allocs.filter(a =>
        a.examDate === selectedDate &&
        a.session === selectedSession
      );
      setAllocations(filteredAllocs);

      // Fetch Invigilators
      const resInv = await api.get('/masters/daywar_invigilator');
      let invMap = {};
      let matchingRec = null;

      if (resInv.data) {
        const match = resInv.data.find(r => r.data && r.data.date === selectedDate && r.data.session === selectedSession);
        if (match) {
          matchingRec = match;
          invMap = match.data.invigilators || {};
        }
      } else {
        const cached = localStorage.getItem('erp_daywar_invigilators');
        if (cached) {
          const parsed = JSON.parse(cached);
          const match = parsed.find(r => r.date === selectedDate && r.session === selectedSession);
          if (match) {
            invMap = match.invigilators || {};
          }
        }
      }

      setExistingInvRecords(matchingRec);
      setInvigilators(invMap);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaywarData();
  }, [selectedDate, selectedSession]);

  // Group allocations by Room
  const roomSummaries = {};
  allocations.forEach(alloc => {
    const rm = alloc.roomNo;
    if (!roomSummaries[rm]) {
      roomSummaries[rm] = {
        roomNo: rm,
        studentCount: 0,
        subjects: new Set(),
        depts: new Set()
      };
    }
    roomSummaries[rm].studentCount++;
    roomSummaries[rm].subjects.add(`${alloc.subjectCode} - ${alloc.subjectName}`);
    roomSummaries[rm].depts.add(alloc.dept);
  });

  const roomList = Object.values(roomSummaries);

  const handleInvigilatorChange = (roomNo, value) => {
    setInvigilators(prev => ({
      ...prev,
      [roomNo]: value
    }));
  };

  const handleSaveInvigilators = async () => {
    const payload = {
      date: selectedDate,
      session: selectedSession,
      invigilators
    };

    try {
      if (existingInvRecords) {
        await api.put(`/masters/daywar_invigilator/${existingInvRecords.id}`, { data: payload });
      } else {
        await api.post('/masters/daywar_invigilator', { data: payload });
      }
      toast.success('Invigilator assignments saved successfully!');
      fetchDaywarData();
    } catch (err) {
      console.error(err);
      let mockList = [];
      const cached = localStorage.getItem('erp_daywar_invigilators');
      if (cached) mockList = JSON.parse(cached);

      const matchIdx = mockList.findIndex(r => r.date === selectedDate && r.session === selectedSession);
      if (matchIdx !== -1) {
        mockList[matchIdx] = payload;
      } else {
        mockList.push(payload);
      }
      localStorage.setItem('erp_daywar_invigilators', JSON.stringify(mockList));
      toast.success('Saved locally (Offline Mode)');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full print:p-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Exam Process</span>
            <h1 className="text-3xl font-black mt-2">Daywar Seating & Invigilation Statement</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Review room assignments, examinee densities and allocate staff invigilation duties</p>
          </div>
          <div className="flex gap-2">
            {roomList.length > 0 && (
              <button
                onClick={handleSaveInvigilators}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Save size={18} /> Save Staffing
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm flex items-center gap-2 border border-white/20 shadow-lg transition-all"
            >
              <Printer size={18} /> Print Statement
            </button>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Exam Date</label>
          <input
            type="date"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Exam Session</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedSession}
            onChange={e => setSelectedSession(e.target.value)}
          >
            {SESSIONS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex items-end justify-start">
          <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 w-full">
            Total Allocated Rooms: <span className="text-slate-800 font-extrabold">{roomList.length}</span>
          </span>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center space-y-2 mb-6">
        <h2 className="text-2xl font-extrabold uppercase">College ERP System</h2>
        <h3 className="text-base font-bold text-slate-600 uppercase">Daywar Seating and Invigilation Duties Statement</h3>
        <p className="text-xs text-slate-500">Date: {selectedDate} | Session: {selectedSession === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)'}</p>
      </div>

      {!selectedDate ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold print:hidden">
          Select an exam date and session above to load the daywise room allocations statement.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm print:text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest print:bg-slate-100">
                  <th className="px-6 py-4">Hall Number</th>
                  <th className="px-6 py-4">Subjects Writing</th>
                  <th className="px-6 py-4">Departments</th>
                  <th className="px-6 py-4 text-center">Examinees Count</th>
                  <th className="px-6 py-4 print:pl-6 pl-2">Assigned Invigilator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 print:divide-slate-200">
                {roomList.map(row => (
                  <tr key={row.roomNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-800 text-base">
                      <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-800 font-black border border-slate-200">{row.roomNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {Array.from(row.subjects).map(sub => (
                          <span key={sub} className="font-semibold text-slate-700 text-xs block">{sub}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.from(row.depts).map(dept => (
                          <span key={dept} className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-[9px] px-2 py-0.5 rounded-full">{dept}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-slate-900 text-lg">{row.studentCount}</td>
                    <td className="px-6 py-4 pl-2 print:pl-6">
                      <input
                        className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold min-w-[180px] print:border-none print:bg-transparent print:p-0 print:text-sm"
                        placeholder="Enter Invigilator Name..."
                        value={invigilators[row.roomNo] || ''}
                        onChange={e => handleInvigilatorChange(row.roomNo, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {roomList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">No students allocated on this slot</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaywarStatement;
