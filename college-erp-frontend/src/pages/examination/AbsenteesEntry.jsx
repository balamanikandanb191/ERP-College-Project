import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Layers, Save, Check, X, ShieldAlert, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' },
  { code: 'AN', label: 'Afternoon (01:30 PM - 04:30 PM)' }
];

const AbsenteesEntry = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [allocations, setAllocations] = useState([]);
  const [absentRegisterNos, setAbsentRegisterNos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const loadSlotData = async () => {
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

      // Fetch Absentees
      const resAbs = await api.get('/masters/exam_absentees');
      let absList = [];
      if (resAbs.data) {
        const matchingAbs = resAbs.data.filter(r => r.data && r.data.date === selectedDate && r.data.session === selectedSession);
        absList = matchingAbs.map(r => r.data.registerNo);
      } else {
        const cachedAbs = localStorage.getItem('erp_exam_absentees') || '[]';
        const parsedAbs = JSON.parse(cachedAbs);
        absList = parsedAbs
          .filter(a => a.date === selectedDate && a.session === selectedSession)
          .map(a => a.registerNo);
      }
      setAbsentRegisterNos(absList);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlotData();
  }, [selectedDate, selectedSession]);

  const toggleAbsentStatus = (regNo) => {
    if (absentRegisterNos.includes(regNo)) {
      setAbsentRegisterNos(absentRegisterNos.filter(r => r !== regNo));
    } else {
      setAbsentRegisterNos([...absentRegisterNos, regNo]);
    }
  };

  const handleSubmitAbsentees = async () => {
    try {
      setSaving(true);
      // Delete existing records for this date/session to avoid duplicates
      const resAbs = await api.get('/masters/exam_absentees');
      if (resAbs.data) {
        const recordsToDelete = resAbs.data.filter(r => r.data && r.data.date === selectedDate && r.data.session === selectedSession);
        const deletePromises = recordsToDelete.map(r => api.delete(`/masters/exam_absentees/${r.id}`));
        await Promise.all(deletePromises);
      }

      // Save new list
      const savePromises = absentRegisterNos.map(regNo => {
        const stud = allocations.find(a => a.regNo === regNo);
        const payload = {
          date: selectedDate,
          session: selectedSession,
          registerNo: regNo,
          studentName: stud ? stud.studentName : 'Unknown',
          roomNo: stud ? stud.roomNo : 'TBA',
          subjectCode: stud ? stud.subjectCode : 'TBA',
          subjectName: stud ? stud.subjectName : 'TBA',
          dept: stud ? stud.dept : 'TBA',
          status: 'Absent'
        };
        return api.post('/masters/exam_absentees', { data: payload });
      });

      await Promise.all(savePromises);
      toast.success(`Absentees submitted successfully! Registered ${absentRegisterNos.length} absent students.`);
      loadSlotData();
    } catch (err) {
      console.error(err);
      // Cache locally
      const mockAbs = absentRegisterNos.map(regNo => {
        const stud = allocations.find(a => a.regNo === regNo);
        return {
          date: selectedDate,
          session: selectedSession,
          registerNo: regNo,
          studentName: stud ? stud.studentName : 'Unknown',
          roomNo: stud ? stud.roomNo : 'TBA',
          subjectCode: stud ? stud.subjectCode : 'TBA',
          status: 'Absent'
        };
      });

      const cached = localStorage.getItem('erp_exam_absentees') || '[]';
      const parsed = JSON.parse(cached);
      // Remove matching slot records
      const updated = parsed.filter(a => !(a.date === selectedDate && a.session === selectedSession));
      updated.push(...mockAbs);
      localStorage.setItem('erp_exam_absentees', JSON.stringify(updated));
      toast.success('Submitted locally (Offline Mode)');
    } finally {
      setSaving(false);
    }
  };

  const filteredAllocations = allocations.filter(a =>
    a.studentName.toLowerCase().includes(search.toLowerCase()) ||
    a.regNo.toLowerCase().includes(search.toLowerCase()) ||
    a.roomNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalPresent = allocations.length - absentRegisterNos.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Exam Forms</span>
            <h1 className="text-3xl font-black mt-2">Absentees Entry Form</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Audit daily candidate attendance rosters, register absentees and lock attendance lists</p>
          </div>
          {allocations.length > 0 && (
            <button
              onClick={handleSubmitAbsentees}
              disabled={saving}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={18} /> {saving ? 'Submitting...' : 'Submit Absentees'}
            </button>
          )}
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Search Student</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Name, Reg No, Room..."
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Examinees</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{allocations.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present Candidates</p>
              <h3 className="text-xl font-black text-emerald-700 mt-0.5">{totalPresent}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
              <UserX size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent Candidates</p>
              <h3 className="text-xl font-black text-rose-700 mt-0.5">{absentRegisterNos.length}</h3>
            </div>
          </div>
        </div>
      )}

      {!selectedDate ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold">
          Select exam date and session above to display candidate lists for attendance entry.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Room No</th>
                  <th className="px-6 py-4">Register Number</th>
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 text-right">Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAllocations.map(a => {
                  const isAbsent = absentRegisterNos.includes(a.regNo);

                  return (
                    <tr key={a.regNo} className={`transition-colors ${isAbsent ? 'bg-rose-50/20 hover:bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-6 py-4 font-black text-slate-800">{a.roomNo}</td>
                      <td className="px-6 py-4 font-mono font-black text-slate-600">{a.regNo}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{a.studentName}</td>
                      <td className="px-6 py-4 font-semibold text-slate-500">
                        {a.subjectCode} - {a.subjectName}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleAbsentStatus(a.regNo)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                            isAbsent
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isAbsent ? 'ABSENT' : 'PRESENT'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredAllocations.length === 0 && (
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

export default AbsenteesEntry;
