import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, Clock, Layers, Filter, Check, X, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Science & Humanities'];
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const PracticalNameList = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [practicals, setPracticals] = useState([]);

  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [selectedSem, setSelectedSem] = useState('5');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch students
      const resSt = await api.get('/students');
      if (resSt.data) setStudents(resSt.data);

      // Fetch subjects
      const resSub = await api.get('/masters/subject');
      if (resSub.data) setSubjects(resSub.data.map(r => ({ ...r.data, id: r.id })));

      // Fetch practical timetable
      const resPr = await api.get('/masters/practical_timetable');
      if (resPr.data) setPracticals(resPr.data.map(r => ({ ...r.data, id: r.id })));
    } catch (err) {
      console.error(err);
      const cachedSt = localStorage.getItem('erp_students');
      if (cachedSt) setStudents(JSON.parse(cachedSt));

      const cachedSub = localStorage.getItem('erp_subject');
      if (cachedSub) setSubjects(JSON.parse(cachedSub));

      const cachedPr = localStorage.getItem('erp_practical_timetable');
      if (cachedPr) setPracticals(JSON.parse(cachedPr));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter practical subjects for selected department/semester
  const filteredSubjects = subjects.filter(s =>
    s.dept === selectedDept && s.sem.toString() === selectedSem.toString() && s.type !== 'Theory'
  );

  useEffect(() => {
    if (filteredSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(filteredSubjects[0].code);
    }
  }, [filteredSubjects, selectedSubject]);

  // Find batches scheduled for this practical subject
  const scheduledBatches = practicals.filter(p => p.subjectCode === selectedSubject);

  useEffect(() => {
    if (scheduledBatches.length > 0 && !selectedBatch) {
      setSelectedBatch(scheduledBatches[0].id);
    }
  }, [scheduledBatches, selectedBatch]);

  const activeBatchObj = scheduledBatches.find(b => b.id === selectedBatch);

  // Filter students belonging to this department, semester and matching the batch criteria
  const matchingStudents = students.filter(st => {
    const sDept = st.department || '';
    const sSem = st.semester || '';
    const matchesDept = sDept.toLowerCase().trim() === selectedDept.toLowerCase().trim();
    const matchesSem = sSem.toString().trim() === selectedSem.toString().trim();
    const matchesSearch = !search ||
      st.fullName.toLowerCase().includes(search.toLowerCase()) ||
      st.registerNumber.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSem && matchesSearch;
  });

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
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Practical/Model</span>
            <h1 className="text-3xl font-black mt-2">Practical Candidate Name List</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Generate lab registers, verify evaluation panels and export printable batch sheets</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm flex items-center gap-2 border border-white/20 shadow-lg transition-all"
          >
            <Printer size={18} /> Print Batch Register
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-5 gap-4 print:hidden">
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Department</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedDept}
            onChange={e => { setSelectedDept(e.target.value); setSelectedSubject(''); setSelectedBatch(''); }}
          >
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Semester</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedSem}
            onChange={e => { setSelectedSem(e.target.value); setSelectedSubject(''); setSelectedBatch(''); }}
          >
            {SEMESTERS.map(s => <option key={s}>Semester {s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Lab Subject</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedSubject}
            onChange={e => { setSelectedSubject(e.target.value); setSelectedBatch(''); }}
          >
            <option value="">-- Choose Subject --</option>
            {filteredSubjects.map((s, idx) => <option key={s.id || `${s.code}-${idx}`} value={s.code}>{s.code} - {s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Active Batch Slot</label>
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer font-bold"
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
          >
            <option value="">-- Choose Batch --</option>
            {scheduledBatches.map(b => <option key={b.id} value={b.id}>{b.batchName} ({b.date})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase block mb-1.5">Search Batch List</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Reg No or Name..."
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      {activeBatchObj && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4 print:p-4">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Lab Location Venue</span>
            <span className="text-sm font-extrabold text-slate-800 block mt-1">{activeBatchObj.labName}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Batch Description</span>
            <span className="text-sm font-extrabold text-slate-800 block mt-1">{activeBatchObj.batchName}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Exam Date & Timing</span>
            <span className="text-sm font-extrabold text-indigo-700 block mt-1">{activeBatchObj.date} ({activeBatchObj.timeSlot})</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Staff Examiners Panel</span>
            <span className="text-[11px] font-bold text-slate-600 block mt-1">INT: {activeBatchObj.internalStaff || 'TBA'}</span>
            <span className="text-[11px] font-bold text-slate-600 block">EXT: {activeBatchObj.externalStaff || 'TBA'}</span>
          </div>
        </div>
      )}

      {/* Print-only Header */}
      {activeBatchObj && (
        <div className="hidden print:block text-center space-y-2 mb-6">
          <h2 className="text-2xl font-extrabold uppercase">College ERP System</h2>
          <h3 className="text-base font-bold text-slate-600 uppercase">Practical Candidate NameList Register</h3>
          <p className="text-xs text-slate-500">
            Subject: {activeBatchObj.subjectCode} - {activeBatchObj.subjectName} | Lab Venue: {activeBatchObj.labName}
          </p>
          <p className="text-xs text-slate-500">Batch: {activeBatchObj.batchName} | Time Slot: {activeBatchObj.timeSlot}</p>
        </div>
      )}

      {!activeBatchObj ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold print:hidden">
          Select department, semester, lab subject, and scheduled batch above to generate candidate list.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm print:text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest print:bg-slate-100">
                  <th className="px-6 py-4">Register Number</th>
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4 text-center">Marks Awarded</th>
                  <th className="px-6 py-4 text-right">Student Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 print:divide-slate-200">
                {matchingStudents.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-black text-slate-800">{st.registerNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{st.fullName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-black">{st.section || 'A'}</span>
                    </td>
                    <td className="px-6 py-4 text-center print:border-slate-300">
                      <span className="inline-block border border-dashed border-slate-300 rounded px-8 py-2 text-slate-300 print:text-transparent">00</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] text-slate-300 italic">__________________</span>
                    </td>
                  </tr>
                ))}
                {matchingStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">No students found matching batch criteria</td>
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

export default PracticalNameList;
