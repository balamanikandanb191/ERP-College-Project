import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, CheckCircle2, AlertTriangle, Edit2, Filter, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const SEMESTERS = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];
const STATUS_OPTIONS = ['All', 'Present', 'Absent', 'Late'];

const MarkedAttendance = () => {
  // Filter state
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Data
  const [courses, setCourses] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Load courses
  useEffect(() => {
    api.get('/masters/class_master')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setCourses(data.map(r => r.data?.name || r.name).filter(Boolean));
        }
      })
      .catch(() => {
        setCourses(['B.Pharm', 'M.Pharm', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'BA', 'MA', 'BCA', 'MCA']);
      });
  }, []);

  // Load subjects when course+semester change
  useEffect(() => {
    if (!course || !semester) { setSubjectOptions([]); setSubject(''); return; }
    api.get('/masters/attendance_subject_config')
      .then(({ data }) => {
        const filtered = (data || [])
          .map(r => r.data || r)
          .filter(r => r.course === course && r.yearSemester === semester);
        setSubjectOptions(filtered);
        setSubject('');
      })
      .catch(() => setSubjectOptions([]));
  }, [course, semester]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setHasFetched(true);
    try {
      const params = new URLSearchParams();
      if (course) params.append('course_id', course);
      if (semester) params.append('semester_id', semester);
      if (subject) params.append('subject_id', subject);
      if (fromDate) params.append('date', fromDate);
      if (search) params.append('search', search);

      const { data } = await api.get(`/student-attendance?${params}`);
      let list = Array.isArray(data) ? data : [];

      // Client-side extra filters
      if (statusFilter !== 'All') {
        list = list.filter(r => r.status === statusFilter);
      }
      if (toDate && fromDate) {
        list = list.filter(r => r.date >= fromDate && r.date <= toDate);
      } else if (fromDate) {
        list = list.filter(r => r.date === fromDate);
      }

      setRecords(list);
      if (list.length === 0) toast('No records found for selected filters', { icon: 'ℹ️' });
    } catch {
      toast.error('Failed to fetch attendance records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [course, semester, subject, fromDate, toDate, statusFilter, search]);

  // Aggregate by student for summary view
  const studentSummary = React.useMemo(() => {
    const map = {};
    records.forEach(r => {
      const sid = r.student_id || r.Student?.id;
      const name = r.Student?.fullName || 'Unknown';
      const reg = r.Student?.registerNumber || '—';
      if (!map[sid]) map[sid] = { sid, name, reg, present: 0, absent: 0, late: 0, total: 0 };
      map[sid].total++;
      if (r.status === 'Present') map[sid].present++;
      else if (r.status === 'Absent') map[sid].absent++;
      else if (r.status === 'Late') map[sid].late++;
    });
    return Object.values(map).map(s => ({
      ...s,
      percentage: s.total > 0 ? Number(((s.present / s.total) * 100).toFixed(1)) : 0,
      shortfall: s.percentage < 75,
    }));
  }, [records]);

  const getStatusBadge = (pct) => {
    if (pct >= 75) return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={10} /> Regular
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle size={10} /> Shortage
      </span>
    );
  };

  const totalPresent = records.filter(r => r.status === 'Present').length;
  const totalAbsent = records.filter(r => r.status === 'Absent').length;
  const totalLate = records.filter(r => r.status === 'Late').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Attendance Logs
          </span>
          <h1 className="text-3xl font-black mt-3">Marked Attendance</h1>
          <p className="text-indigo-200 text-sm font-medium mt-1">
            View, filter and review subject-wise attendance records across courses
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
        <h3 className="font-black text-slate-800 text-sm mb-5 flex items-center gap-2">
          <Filter size={16} className="text-indigo-600" />
          Filter Attendance Records
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Course */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Course</label>
            <div className="relative">
              <select
                value={course}
                onChange={e => { setCourse(e.target.value); setSemester(''); }}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                <option value="">All Courses</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Semester */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Year / Semester</label>
            <div className="relative">
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</label>
            <div className="relative">
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                disabled={subjectOptions.length === 0}
              >
                <option value="">All Subjects</option>
                {subjectOptions.map(s => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* From Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* To Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Search */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Search Student / Register Number</label>
            <div className="relative">
              <Search size={15} className="absolute left-4 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or register number..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={e => e.key === 'Enter' && fetchRecords()}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors disabled:opacity-60"
          >
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Search size={15} />}
            {loading ? 'Searching…' : 'Search Records'}
          </button>
          <button
            onClick={() => {
              setCourse(''); setSemester(''); setSubject('');
              setFromDate(''); setToDate(''); setStatusFilter('All'); setSearch('');
              setRecords([]); setHasFetched(false);
            }}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {hasFetched && records.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Records', value: records.length, color: 'text-slate-800', bg: 'bg-white' },
            { label: 'Present', value: totalPresent, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Absent', value: totalAbsent, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Late', value: totalLate, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl border border-slate-100 shadow-sm p-5`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Results Table */}
      {hasFetched && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-base">
              Attendance Summary
              <span className="ml-2 text-slate-400 font-semibold text-sm">({studentSummary.length} students)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">S.No</th>
                  <th className="px-6 py-4">University Register No.</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Present</th>
                  <th className="px-6 py-4">Absent</th>
                  <th className="px-6 py-4">Late</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center text-slate-400 text-sm">
                      Loading records…
                    </td>
                  </tr>
                ) : studentSummary.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-slate-200" />
                        <p className="text-slate-400 font-semibold text-sm">No attendance records found</p>
                        <p className="text-slate-300 text-xs">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  studentSummary.map((row, idx) => (
                    <tr key={row.sid} className={`hover:bg-slate-50/60 transition-colors ${row.percentage < 75 ? 'bg-rose-50/30' : ''}`}>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                      <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">{row.reg}</td>
                      <td className="px-6 py-4 font-black text-slate-800">{row.name}</td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-600">{row.present}</td>
                      <td className="px-6 py-4 font-mono font-bold text-red-600">{row.absent}</td>
                      <td className="px-6 py-4 font-mono font-bold text-amber-600">{row.late}</td>
                      <td className="px-6 py-4 font-mono font-black text-slate-700">{row.total}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[60px] bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${row.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(row.percentage, 100)}%` }}
                            />
                          </div>
                          <span className={`font-mono font-black text-xs ${row.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {row.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(row.percentage)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw Records Table - Detail View */}
      {hasFetched && records.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800 text-base">
              Detailed Records
              <span className="ml-2 text-slate-400 font-semibold text-sm">({records.length} entries)</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Register No.</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Period</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.slice(0, 50).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{r.date}</td>
                    <td className="px-5 py-3 font-mono font-bold text-indigo-600 text-xs">{r.Student?.registerNumber || '—'}</td>
                    <td className="px-5 py-3 font-bold text-slate-800">{r.Student?.fullName || '—'}</td>
                    <td className="px-5 py-3 text-slate-600 text-xs font-semibold">{r.subject_id || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{r.period_hour || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        r.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        r.status === 'Absent' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length > 50 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-3 text-center text-xs text-slate-400 font-semibold">
                      Showing 50 of {records.length} records. Refine filters to narrow results.
                    </td>
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

export default MarkedAttendance;
