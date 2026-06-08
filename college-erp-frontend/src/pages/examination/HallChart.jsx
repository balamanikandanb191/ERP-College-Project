import React, { useState, useEffect } from 'react';
import { Search, Grid, Calendar, Clock, Layers, User, UserX } from 'lucide-react';
import api from '../../services/api';

const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' },
  { code: 'AN', label: 'Afternoon (01:30 PM - 04:30 PM)' }
];

const DEPT_COLORS = {
  'Computer Science': 'bg-blue-100 text-blue-800 border-blue-300',
  'Information Technology': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Electronics': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Mechanical': 'bg-amber-100 text-amber-800 border-amber-300',
  'Civil': 'bg-rose-100 text-rose-800 border-rose-300',
  'Science & Humanities': 'bg-slate-100 text-slate-800 border-slate-300',
  'default': 'bg-slate-50 text-slate-700 border-slate-200'
};

const HallChart = () => {
  const [halls, setHalls] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [selectedHallId, setSelectedHallId] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedSeat, setFocusedSeat] = useState(null);

  const fetchHalls = async () => {
    try {
      const resHalls = await api.get('/masters/exam_hall');
      if (resHalls.data && resHalls.data.length > 0) {
        const hList = resHalls.data.map(r => ({ ...r.data, id: r.id }));
        setHalls(hList);
        if (hList.length > 0) setSelectedHallId(hList[0].id);
      }
    } catch (error) {
      console.error(error);
      const cached = localStorage.getItem('erp_exam_halls');
      if (cached) {
        const hList = JSON.parse(cached);
        setHalls(hList);
        if (hList.length > 0) setSelectedHallId(hList[0].id);
      }
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const loadChartData = async () => {
    if (!selectedDate || !selectedHallId) return;
    try {
      setLoading(true);
      // Load allocations
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
            if (item.allocations) {
              allocs.push(...item.allocations);
            } else {
              allocs.push(item);
            }
          });
        }
      }
      
      // Filter allocations for selected date, session, and room
      const currentHall = halls.find(h => h.id === selectedHallId);
      const roomNo = currentHall ? currentHall.roomNo : '';
      
      const filteredAllocs = allocs.filter(a =>
        a.examDate === selectedDate &&
        a.session === selectedSession &&
        a.roomNo === roomNo
      );
      setAllocations(filteredAllocs);

      // Load absentees
      const resAbs = await api.get('/masters/exam_absentees');
      let abs = [];
      if (resAbs.data) {
        abs = resAbs.data.map(r => ({ ...r.data, id: r.id }));
      } else {
        const cachedAbs = localStorage.getItem('erp_exam_absentees');
        if (cachedAbs) abs = JSON.parse(cachedAbs);
      }
      
      const filteredAbs = abs.filter(ab =>
        ab.date === selectedDate &&
        ab.session === selectedSession
      ).map(ab => ab.registerNo);
      setAbsentees(filteredAbs);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [selectedDate, selectedSession, selectedHallId, halls]);

  const currentHall = halls.find(h => h.id === selectedHallId);

  // Map allocations into a 2D grid
  const gridLayout = {};
  if (currentHall) {
    allocations.forEach(alloc => {
      gridLayout[`${alloc.seatRow}-${alloc.seatCol}`] = alloc;
    });
  }

  const getDeptBadgeClass = (dept) => {
    return DEPT_COLORS[dept] || DEPT_COLORS['default'];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Exam Process</span>
            <h1 className="text-3xl font-black mt-2">Visual Hall Seating Chart</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Review student locations, department distributions and attendance flags in a visual room grid</p>
          </div>
        </div>
      </div>

      {/* Selector controls */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Exam Hall</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedHallId}
            onChange={e => setSelectedHallId(e.target.value)}
          >
            {halls.map(h => <option key={h.id} value={h.id}>{h.roomNo} ({h.blockName})</option>)}
          </select>
        </div>
        <div className="flex items-end justify-start">
          {currentHall && (
            <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 w-full">
              Hall Dimensions: <span className="text-slate-800">{currentHall.rows}R x {currentHall.cols}C ({currentHall.capacity} Seats)</span>
            </div>
          )}
        </div>
      </div>

      {!selectedDate ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold">
          <Calendar size={48} className="mx-auto text-slate-300 animate-bounce mb-3" />
          Select a date and hall from the options above to view the seating grid
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grid Layout Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Grid size={18} className="text-indigo-500" /> Room Seating Layout
            </h3>

            {allocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <UserX size={48} className="text-slate-300 mb-3" />
                <span className="text-sm text-slate-400 font-bold">No students allocated to this hall for the selected exam session</span>
                <p className="text-slate-400 text-xs mt-1">Configure seating allocations in the "Seat Allocation" module first</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-900 text-slate-200 text-center py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm mb-6">
                  FRONT / INVIgilator desk
                </div>

                <div 
                  className="grid gap-3 border border-dashed border-slate-200 rounded-xl p-4 overflow-x-auto" 
                  style={{ gridTemplateColumns: `repeat(${currentHall?.cols || 5}, minmax(100px, 1fr))` }}
                >
                  {Array.from({ length: currentHall?.rows || 6 }).map((_, rIndex) => (
                    Array.from({ length: currentHall?.cols || 5 }).map((_, cIndex) => {
                      const studentAlloc = gridLayout[`${rIndex}-${cIndex}`];
                      const isAbsent = studentAlloc && absentees.includes(studentAlloc.regNo);
                      const key = `seat-${rIndex}-${cIndex}`;

                      if (!studentAlloc) {
                        return (
                          <div 
                            key={key} 
                            className="bg-slate-50 border border-dashed border-slate-200 rounded-xl py-6 text-center text-[10px] font-bold text-slate-300"
                          >
                            Empty Desk
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={key}
                          onClick={() => setFocusedSeat(studentAlloc)}
                          className={`border rounded-xl p-2 cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[90px] ${
                            isAbsent 
                              ? 'bg-rose-50 border-rose-300 hover:bg-rose-100/75 text-rose-800' 
                              : `${getDeptBadgeClass(studentAlloc.dept)} hover:scale-102 hover:shadow-md`
                          }`}
                        >
                          <div className="flex justify-between items-center text-[9px] font-black opacity-85">
                            <span>Desk {studentAlloc.deskNo}</span>
                            <span>R{rIndex+1}C{cIndex+1}</span>
                          </div>
                          
                          <div className="my-2 text-center">
                            <span className="font-extrabold text-[11px] block truncate">{studentAlloc.regNo}</span>
                            <span className="font-semibold text-[9px] block truncate opacity-75">{studentAlloc.studentName}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[7px] font-black uppercase tracking-wider bg-white/60 px-1 py-0.5 rounded block truncate max-w-[50px]">{studentAlloc.dept}</span>
                            {isAbsent && (
                              <span className="text-[7px] font-black uppercase tracking-wider bg-rose-200 text-rose-800 px-1 py-0.5 rounded">ABSENT</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Focused Student info side card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
                <User size={18} className="text-indigo-500" /> Student Verification details
              </h3>

              {focusedSeat ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
                      {focusedSeat.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 leading-tight">{focusedSeat.studentName}</h4>
                      <span className="text-xs text-indigo-600 font-bold">{focusedSeat.regNo}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Department</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{focusedSeat.dept}</span>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Semester</span>
                      <span className="text-slate-800 font-bold block mt-0.5">Semester {focusedSeat.sem || '5'}</span>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Hall Location</span>
                      <span className="text-indigo-600 font-black block mt-0.5">{focusedSeat.roomNo}</span>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Desk Number</span>
                      <span className="text-indigo-600 font-black block mt-0.5">Desk {focusedSeat.deskNo}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Scheduled Examination Subject</span>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-800">
                        {focusedSeat.subjectName || 'N/A'}
                        <span className="font-mono text-indigo-500 font-black ml-2 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded">{focusedSeat.subjectCode}</span>
                      </div>
                    </div>
                  </div>

                  {absentees.includes(focusedSeat.regNo) && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
                      <UserX size={16} /> Student has been flagged as ABSENT for this examination
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 font-bold">
                  <User size={36} className="text-slate-300 animate-pulse mb-3" />
                  Select a student desk in the grid to display credentials
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallChart;
