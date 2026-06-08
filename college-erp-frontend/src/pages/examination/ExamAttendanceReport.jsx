import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, Clock, Layers, Users, UserX, CheckSquare } from 'lucide-react';
import api from '../../services/api';

const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' },
  { code: 'AN', label: 'Afternoon (01:30 PM - 04:30 PM)' }
];

const ExamAttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [allocations, setAllocations] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    if (!selectedDate) return;
    try {
      setLoading(true);
      // Fetch allocations
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

      // Fetch absentees
      const resAbs = await api.get('/masters/exam_absentees');
      let abs = [];
      if (resAbs.data) {
        abs = resAbs.data.map(r => ({ ...r.data, id: r.id }));
      } else {
        const cachedAbs = localStorage.getItem('erp_exam_absentees') || '[]';
        abs = JSON.parse(cachedAbs);
      }

      const filteredAbs = abs.filter(ab =>
        ab.date === selectedDate &&
        ab.session === selectedSession
      );
      setAbsentees(filteredAbs);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedDate, selectedSession]);

  const totalAllocated = allocations.length;
  const totalAbsent = absentees.length;
  const totalPresent = totalAllocated - totalAbsent;
  const attendanceRate = totalAllocated > 0 ? ((totalPresent / totalAllocated) * 100).toFixed(1) : '0.0';

  // Room wise distribution statistics
  const roomStats = {};
  allocations.forEach(a => {
    const rm = a.roomNo;
    if (!roomStats[rm]) {
      roomStats[rm] = { roomNo: rm, allocated: 0, absent: 0, present: 0 };
    }
    roomStats[rm].allocated++;
    if (absentees.some(ab => ab.registerNo === a.regNo)) {
      roomStats[rm].absent++;
    } else {
      roomStats[rm].present++;
    }
  });

  const roomList = Object.values(roomStats);

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
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Exam Forms</span>
            <h1 className="text-3xl font-black mt-2">Exam Attendance Audit Report</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Generate final signature rosters, print summaries, and list absentee registers</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm flex items-center gap-2 border border-white/20 shadow-lg transition-all"
          >
            <Printer size={18} /> Print Audit Report
          </button>
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
          <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 w-full">
            Attendance Rate: <span className="text-indigo-600 font-extrabold">{attendanceRate}%</span>
          </span>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center space-y-2 mb-6">
        <h2 className="text-2xl font-extrabold uppercase">College ERP System</h2>
        <h3 className="text-base font-bold text-slate-600 uppercase">Official Examination Attendance Audit Report Statement</h3>
        <p className="text-xs text-slate-500">Date: {selectedDate} | Session: {selectedSession === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)'}</p>
        <p className="text-xs text-slate-500">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {!selectedDate ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold print:hidden">
          Select exam date and session above to generate the attendance summary report.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Scheduled</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalAllocated}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckSquare size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Present</p>
                <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{totalPresent}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <UserX size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Absent</p>
                <h3 className="text-2xl font-black text-rose-700 mt-0.5">{totalAbsent}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <Layers size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance %</p>
                <h3 className="text-2xl font-black text-indigo-700 mt-0.5">{attendanceRate}%</h3>
              </div>
            </div>
          </div>

          {/* Grid: Room Summary & Absentee Nominal Roll */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
            {/* Room Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 print:border-none print:shadow-none">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                Room-wise Attendance Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-4 py-3">Hall No</th>
                      <th className="px-4 py-3 text-center">Allocated</th>
                      <th className="px-4 py-3 text-center">Present</th>
                      <th className="px-4 py-3 text-center">Absent</th>
                      <th className="px-4 py-3 text-right">Room Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {roomList.map(r => {
                      const rate = r.allocated > 0 ? ((r.present / r.allocated) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={r.roomNo} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-black text-slate-800">{r.roomNo}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-600">{r.allocated}</td>
                          <td className="px-4 py-3 text-center font-bold text-emerald-700">{r.present}</td>
                          <td className="px-4 py-3 text-center font-bold text-rose-700">{r.absent}</td>
                          <td className="px-4 py-3 text-right font-black text-indigo-700">{rate}%</td>
                        </tr>
                      );
                    })}
                    {roomList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">No room breakdown statistics</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Absentee Details */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 print:border-none print:shadow-none">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 text-rose-600">
                Official Absentee Nominal Roll Register
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-4 py-3">Hall</th>
                      <th className="px-4 py-3">Reg Number</th>
                      <th className="px-4 py-3">Candidate Name</th>
                      <th className="px-4 py-3">Subject</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {absentees.map(ab => (
                      <tr key={ab.registerNo} className="hover:bg-rose-50/10">
                        <td className="px-4 py-3 font-black text-slate-800">{ab.roomNo}</td>
                        <td className="px-4 py-3 font-mono font-black text-rose-700">{ab.registerNo}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{ab.studentName}</td>
                        <td className="px-4 py-3 font-semibold text-slate-500">{ab.subjectCode}</td>
                      </tr>
                    ))}
                    {absentees.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">No absentee entries recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttendanceReport;
