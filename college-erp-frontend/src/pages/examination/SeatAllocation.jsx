import React, { useState, useEffect } from 'react';
import { Layers, Calendar, Clock, Check, X, ShieldAlert, Cpu, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' },
  { code: 'AN', label: 'Afternoon (01:30 PM - 04:30 PM)' }
];

const SeatAllocation = () => {
  const [halls, setHalls] = useState([]);
  const [selectedHalls, setSelectedHalls] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [scheduledExams, setScheduledExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocatedList, setAllocatedList] = useState([]);
  const [existingRecord, setExistingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHalls = async () => {
    try {
      const resHalls = await api.get('/masters/exam_hall');
      if (resHalls.data && resHalls.data.length > 0) {
        setHalls(resHalls.data.map(r => ({ ...r.data, id: r.id })));
      }
    } catch (error) {
      console.error(error);
      const cached = localStorage.getItem('erp_exam_halls');
      if (cached) setHalls(JSON.parse(cached));
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const loadSlotContext = async () => {
    if (!selectedDate) return;
    try {
      setLoading(true);
      // Get Scheduled Exams
      const resTimetables = await api.get('/masters/exam_timetable');
      let times = [];
      if (resTimetables.data) {
        times = resTimetables.data.map(r => ({ ...r.data, id: r.id }));
      } else {
        const cached = localStorage.getItem('erp_exam_timetable');
        if (cached) times = JSON.parse(cached);
      }

      const matchingExams = times.filter(t => t.date === selectedDate && t.session === selectedSession);
      setScheduledExams(matchingExams);

      // Get Students
      const resStudents = await api.get('/students');
      if (resStudents.data) {
        setStudents(resStudents.data);
      } else {
        const cached = localStorage.getItem('erp_students');
        if (cached) setStudents(JSON.parse(cached));
      }

      // Check for existing allocation
      const resAllocations = await api.get('/masters/exam_allocation');
      let allocs = [];
      if (resAllocations.data) {
        allocs = resAllocations.data;
      } else {
        const cached = localStorage.getItem('erp_exam_allocations') || '[]';
        allocs = JSON.parse(cached);
      }

      const match = allocs.find(a => a.data && a.data.date === selectedDate && a.data.session === selectedSession);
      if (match) {
        setExistingRecord(match);
        setAllocatedList(match.data.allocations || []);
      } else {
        setExistingRecord(null);
        setAllocatedList([]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlotContext();
  }, [selectedDate, selectedSession]);

  const toggleHallSelection = (hallId) => {
    if (selectedHalls.includes(hallId)) {
      setSelectedHalls(selectedHalls.filter(id => id !== hallId));
    } else {
      setSelectedHalls([...selectedHalls, hallId]);
    }
  };

  // Automated Allocation Algorithm
  const runAutoAllocation = () => {
    if (selectedHalls.length === 0) {
      toast.error('Please select at least one active hall for allocation.');
      return;
    }
    if (scheduledExams.length === 0) {
      toast.error('No exams are scheduled on this date/session. Schedule them first.');
      return;
    }

    // 1. Gather students eligible to write exams on this slot
    let candidateStudents = [];
    scheduledExams.forEach(exam => {
      // Find students whose department and semester match the exam
      const matches = students.filter(st => {
        const sDept = st.department || '';
        const sSem = st.semester || '';
        const deptMatch = sDept.toLowerCase().trim() === exam.dept.toLowerCase().trim();
        const semMatch = sSem.toString().trim() === exam.sem.toString().trim();
        return deptMatch && semMatch;
      });

      matches.forEach(st => {
        candidateStudents.push({
          studentId: st.id,
          regNo: st.registerNumber,
          studentName: st.fullName,
          dept: st.department,
          course: st.course || 'B.E.',
          sem: st.semester,
          subjectCode: exam.subjectCode,
          subjectName: exam.subjectName
        });
      });
    });

    if (candidateStudents.length === 0) {
      toast.error('No registered students found matching the scheduled subjects.');
      return;
    }

    // 2. Perform Department-based Shuffling/Interleaving
    const grouped = {};
    candidateStudents.forEach(st => {
      if (!grouped[st.dept]) grouped[st.dept] = [];
      grouped[st.dept].push(st);
    });

    const depts = Object.keys(grouped);
    let shuffledCandidates = [];
    let hasMore = true;
    let deptIndexes = depts.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});

    while (hasMore) {
      hasMore = false;
      depts.forEach(d => {
        const idx = deptIndexes[d];
        if (idx < grouped[d].length) {
          shuffledCandidates.push(grouped[d][idx]);
          deptIndexes[d]++;
          hasMore = true;
        }
      });
    }

    // 3. Fill Rooms sequentially
    const selectedHallObjects = halls.filter(h => selectedHalls.includes(h.id));
    let studentIndex = 0;
    const generatedAllocations = [];

    for (let hall of selectedHallObjects) {
      const { roomNo, rows, cols } = hall;
      let deskNoCounter = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (studentIndex >= shuffledCandidates.length) break;

          const currentStudent = shuffledCandidates[studentIndex];
          generatedAllocations.push({
            ...currentStudent,
            roomNo,
            deskNo: deskNoCounter++,
            seatRow: r,
            seatCol: c,
            examDate: selectedDate,
            session: selectedSession
          });

          studentIndex++;
        }
        if (studentIndex >= shuffledCandidates.length) break;
      }
      if (studentIndex >= shuffledCandidates.length) break;
    }

    if (studentIndex < shuffledCandidates.length) {
      toast.error(`Warning: Insufficient capacity! Shuffled ${shuffledCandidates.length} students, but halls can only accommodate ${generatedAllocations.length}. Please select more halls.`);
    } else {
      toast.success(`Allocated all ${shuffledCandidates.length} students successfully across ${selectedHallObjects.length} halls.`);
    }

    setAllocatedList(generatedAllocations);
  };

  const handleSave = async () => {
    if (allocatedList.length === 0) {
      toast.error('Please generate allocations first.');
      return;
    }

    const payload = {
      date: selectedDate,
      session: selectedSession,
      allocations: allocatedList
    };

    try {
      if (existingRecord) {
        // Update existing record
        await api.put(`/masters/exam_allocation/${existingRecord.id}`, { data: payload });
        toast.success('Seating arrangements updated successfully in database!');
      } else {
        // Create new record
        const { data } = await api.post('/masters/exam_allocation', { data: payload });
        setExistingRecord(data);
        toast.success('Seating arrangements saved successfully in database!');
      }
      loadSlotContext();
    } catch (err) {
      console.error(err);
      // Offline fallback
      let mockList = [];
      const cached = localStorage.getItem('erp_exam_allocations');
      if (cached) mockList = JSON.parse(cached);
      
      const newMockId = existingRecord ? existingRecord.id : `alloc-${Date.now()}`;
      const newMockRecord = { id: newMockId, data: payload };
      
      let updatedMock;
      if (existingRecord) {
        updatedMock = mockList.map(a => a.id === existingRecord.id ? newMockRecord : a);
      } else {
        updatedMock = [newMockRecord, ...mockList];
      }
      localStorage.setItem('erp_exam_allocations', JSON.stringify(updatedMock));
      toast.success('Saved locally (Offline Mode)');
    }
  };

  const handleClear = () => {
    if (!existingRecord) {
      setAllocatedList([]);
      toast.success('Allocation grid cleared.');
      return;
    }

    confirmDelete(async () => {
      try {
        if (!existingRecord.id.startsWith('alloc-') && existingRecord.id.length > 5) {
          await api.delete(`/masters/exam_allocation/${existingRecord.id}`);
        }
        setAllocatedList([]);
        setExistingRecord(null);
        toast.success('Allocation deleted from database.');
      } catch (err) {
        console.error(err);
        const cached = localStorage.getItem('erp_exam_allocations');
        if (cached) {
          const parsed = JSON.parse(cached);
          const updated = parsed.filter(a => a.id !== existingRecord.id);
          localStorage.setItem('erp_exam_allocations', JSON.stringify(updated));
        }
        setAllocatedList([]);
        setExistingRecord(null);
        toast.success('Cleared locally.');
      }
    }, 'Are you sure you want to delete all allocations for this date and session?');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Exam Process</span>
            <h1 className="text-3xl font-black mt-2">Seat Allocation Engine</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Run smart vertical shuffling allocations, preview sheets and commit student seat numbers</p>
          </div>
        </div>
      </div>

      {/* Grid Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600" /> Slot Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Exam Date *</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Session Slot</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
              >
                {SESSIONS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {selectedDate && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Available Halls</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {halls.map(h => (
                  <label key={h.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs font-bold transition-all">
                    <input
                      type="checkbox"
                      className="accent-indigo-600 w-4 h-4 cursor-pointer"
                      checked={selectedHalls.includes(h.id)}
                      onChange={() => toggleHallSelection(h.id)}
                    />
                    <div>
                      <span className="text-slate-800 font-extrabold">{h.roomNo}</span>
                      <span className="text-slate-400 font-semibold block text-[10px]">({h.blockName}) - Cap: {h.capacity} seats</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={runAutoAllocation}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 transition-all cursor-pointer"
                >
                  <Cpu size={14} /> Calculate Allocations
                </button>
                {allocatedList.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Check size={14} /> Save to DB
                    </button>
                    <button
                      onClick={handleClear}
                      className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Scheduled exams info card */}
          {selectedDate && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3">
                Scheduled Exams on Selected Date
              </h3>
              {scheduledExams.length === 0 ? (
                <div className="py-6 flex items-center gap-3 text-amber-600 bg-amber-50 rounded-2xl p-4 border border-amber-100 text-xs font-bold">
                  <ShieldAlert size={18} /> No subjects have been scheduled for this date and session slot.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {scheduledExams.map(ex => (
                    <div key={ex.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ex.dept}</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block truncate">{ex.subjectName}</span>
                      <span className="font-mono text-indigo-600 font-black text-[10px] mt-0.5">{ex.subjectCode}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seating Allocation preview list */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-3">
              Allocated Student List preview
            </h3>

            {allocatedList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-bold text-xs">
                Select a slot, choose halls, and click "Calculate Allocations" to generate list.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-4 py-2">Room</th>
                      <th className="px-4 py-2">Desk No</th>
                      <th className="px-4 py-2">Reg Number</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Dept</th>
                      <th className="px-4 py-2">Subject</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allocatedList.map((alloc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-black text-indigo-700">{alloc.roomNo}</td>
                        <td className="px-4 py-2 font-bold text-slate-900">Desk {alloc.deskNo}</td>
                        <td className="px-4 py-2 font-bold text-slate-600">{alloc.regNo}</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">{alloc.studentName}</td>
                        <td className="px-4 py-2 font-bold text-[10px] uppercase text-slate-500">{alloc.dept}</td>
                        <td className="px-4 py-2 text-slate-500 font-semibold">{alloc.subjectCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatAllocation;
