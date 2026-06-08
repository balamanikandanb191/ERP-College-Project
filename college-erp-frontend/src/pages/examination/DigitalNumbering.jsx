import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, Clock, Layers, Grid, Sliders } from 'lucide-react';
import api from '../../services/api';

const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' }
];

const DigitalNumbering = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [selectedHall, setSelectedHall] = useState('');
  const [halls, setHalls] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [prefix, setPrefix] = useState('DSK-');
  const [loading, setLoading] = useState(false);

  const fetchHalls = async () => {
    try {
      const resHalls = await api.get('/masters/exam_hall');
      if (resHalls.data && resHalls.data.length > 0) {
        const hList = resHalls.data.map(r => ({ ...r.data, id: r.id }));
        setHalls(hList);
        if (hList.length > 0) setSelectedHall(hList[0].roomNo);
      }
    } catch (error) {
      console.error(error);
      const cached = localStorage.getItem('erp_exam_halls');
      if (cached) {
        const hList = JSON.parse(cached);
        setHalls(hList);
        if (hList.length > 0) setSelectedHall(hList[0].roomNo);
      }
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const loadNumberingData = async () => {
    if (!selectedDate || !selectedHall) return;
    try {
      setLoading(true);
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

      const filtered = allocs.filter(a =>
        a.examDate === selectedDate &&
        a.session === selectedSession &&
        a.roomNo === selectedHall
      ).sort((a, b) => a.deskNo - b.deskNo);

      setAllocations(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNumberingData();
  }, [selectedDate, selectedSession, selectedHall]);

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
            <h1 className="text-3xl font-black mt-2">Digital Numbering / Desk Stickers</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Configure serial labels and print high-fidelity desk slips for examination halls</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm flex items-center gap-2 border border-white/20 shadow-lg transition-all"
          >
            <Printer size={18} /> Print Slips / Labels
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
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
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Exam Hall</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedHall}
            onChange={e => setSelectedHall(e.target.value)}
          >
            {halls.map(h => <option key={h.id} value={h.roomNo}>{h.roomNo} ({h.blockName})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Sticker Prefix Label</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
          />
        </div>
        <div className="flex items-end justify-start">
          <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 w-full">
            Ready to Print: <span className="text-slate-800 font-extrabold">{allocations.length} labels</span>
          </span>
        </div>
      </div>

      {!selectedDate ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold print:hidden">
          Select exam date and hall above to preview or generate digital numbering slips.
        </div>
      ) : (
        <div className="space-y-6">
          {/* List Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 print:hidden">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
              Desk Numbering Slips Table Preview
            </h3>
            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-2">Desk Code</th>
                    <th className="px-4 py-2">Row / Col</th>
                    <th className="px-4 py-2">Register Number</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Dept</th>
                    <th className="px-4 py-2">Scheduled Subject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allocations.map(a => (
                    <tr key={a.studentId} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 font-black text-indigo-600">{prefix}{a.deskNo}</td>
                      <td className="px-4 py-2 text-slate-500 font-bold">R{a.seatRow+1} - C{a.seatCol+1}</td>
                      <td className="px-4 py-2 font-mono font-bold text-slate-800">{a.regNo}</td>
                      <td className="px-4 py-2 font-semibold text-slate-800">{a.studentName}</td>
                      <td className="px-4 py-2 font-black uppercase text-slate-500 text-[9px]">{a.dept}</td>
                      <td className="px-4 py-2 text-slate-500 font-semibold">{a.subjectCode} - {a.subjectName}</td>
                    </tr>
                  ))}
                  {allocations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">No students allocated on this slot</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Print Slips Grid Layout */}
          <div className="hidden print:grid print:grid-cols-3 print:gap-4 gap-4 grid-cols-1 md:grid-cols-3">
            {allocations.map(a => (
              <div 
                key={a.studentId} 
                className="border-2 border-slate-900 rounded-xl p-4 flex flex-col justify-between text-center min-h-[140px] bg-white text-slate-900 shadow-sm print:shadow-none"
              >
                <div className="flex justify-between items-center text-[10px] font-black border-b border-slate-200 pb-1.5 mb-2">
                  <span>ROOM: {a.roomNo}</span>
                  <span className="text-indigo-700 font-black">SEAT: R{a.seatRow+1}C{a.seatCol+1}</span>
                </div>
                
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">DESK STICKER</span>
                  <h3 className="text-xl font-black tracking-wide my-1">{prefix}{a.deskNo}</h3>
                  <h2 className="text-sm font-black font-mono tracking-wider">{a.regNo}</h2>
                  <p className="text-[10px] font-extrabold truncate max-w-[200px] mx-auto mt-0.5">{a.studentName}</p>
                </div>

                <div className="border-t border-slate-200 pt-1.5 mt-2 flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-500">
                  <span>{a.dept}</span>
                  <span>{a.subjectCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalNumbering;
