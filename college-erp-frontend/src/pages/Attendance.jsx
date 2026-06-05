import React, { useState, useEffect } from 'react';
import { CalendarDays, Search, UserCheck, UserX, Clock, ChevronDown, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useMasterData } from '../hooks/useMasterData';

const PERIODS = ['1st Hour', '2nd Hour', '3rd Hour', '4th Hour', '5th Hour', '6th Hour', '7th Hour', '8th Hour'];
const SEMESTERS = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];

const STATUS_COLORS = {
  Present: 'bg-emerald-500',
  Absent: 'bg-red-500',
  Late: 'bg-amber-500',
};

const Attendance = () => {
  const today = new Date().toISOString().split('T')[0];

  // Filters
  const [date, setDate] = useState(today);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [period, setPeriod] = useState('');
  const [staffName, setStaffName] = useState('');

  // Data
  const [courses, setCourses] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'Present'|'Absent'|'Late' }
  const [staffList, setStaffList] = useState([]);

  // UI State
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studentsLoaded, setStudentsLoaded] = useState(false);

  // Load class master for courses
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

    api.get('/staff')
      .then(({ data }) => setStaffList(Array.isArray(data) ? data : []))
      .catch(() => setStaffList([]));
  }, []);

  // Load subjects from attendance_subject_config when course+semester change
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

  const handleFetchStudents = async () => {
    if (!course || !semester) {
      toast.error('Please select Course and Semester');
      return;
    }
    setFetchingStudents(true);
    setStudentsLoaded(false);
    try {
      const params = new URLSearchParams();
      params.append('course', course);
      params.append('semester', semester);

      const { data } = await api.get(`/students?${params}`);
      const list = Array.isArray(data) ? data : [];
      setStudents(list);

      // Pre-populate attendance state: default to Present for all
      const initAtt = {};
      list.forEach(s => { initAtt[s.id] = 'Present'; });
      setAttendance(initAtt);
      setStudentsLoaded(true);

      if (list.length === 0) {
        toast('No students found for selected course & semester', { icon: 'ℹ️' });
      } else {
        toast.success(`${list.length} student(s) loaded`);
      }
    } catch {
      toast.error('Failed to fetch students');
    } finally {
      setFetchingStudents(false);
    }
  };

  const toggleStatus = (studentId) => {
    const order = ['Present', 'Absent', 'Late'];
    const current = attendance[studentId] || 'Present';
    const next = order[(order.indexOf(current) + 1) % order.length];
    setAttendance(prev => ({ ...prev, [studentId]: next }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (!studentsLoaded || students.length === 0) {
      toast.error('Load students first');
      return;
    }
    if (!subject) {
      toast.error('Please select a subject');
      return;
    }
    if (!period) {
      toast.error('Please select a period/hour');
      return;
    }
    setSaving(true);
    try {
      const selectedSubject = subjectOptions.find(s => s.subjectCode === subject);
      const payload = students.map(s => ({
        student_id: s.id,
        date,
        status: attendance[s.id] || 'Present',
        course_id: course,
        semester_id: semester,
        subject_id: subject,
        period_hour: period,
        staff_id: staffList.find(st => st.fullName === staffName)?.id || null,
        remarks: '',
      }));

      await api.post('/student-attendance', payload);
      toast.success(`Attendance saved for ${students.length} students!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'Absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'Late').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Daily Attendance
          </span>
          <h1 className="text-3xl font-black mt-3">Mark Student Attendance</h1>
          <p className="text-indigo-200 text-sm font-medium mt-1">
            Select course, semester, subject, and period then mark attendance for each student
          </p>
        </div>
      </div>

      {/* Selection Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
        <h3 className="font-black text-slate-800 text-base mb-5 flex items-center gap-2">
          <CalendarDays size={18} className="text-indigo-600" />
          Attendance Selection
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Staff Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff Name</label>
            <div className="relative">
              <select
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                <option value="">-- Select Staff --</option>
                {staffList.map(st => (
                  <option key={st.id} value={st.fullName}>{st.fullName}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Course */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Course / Programme</label>
            <div className="relative">
              <select
                value={course}
                onChange={e => { setCourse(e.target.value); setSemester(''); setStudentsLoaded(false); setStudents([]); }}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Semester */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Year / Semester</label>
            <div className="relative">
              <select
                value={semester}
                onChange={e => { setSemester(e.target.value); setStudentsLoaded(false); setStudents([]); }}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                <option value="">-- Select Semester --</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
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
                <option value="">-- Select Subject --</option>
                {subjectOptions.map(s => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
            {course && semester && subjectOptions.length === 0 && (
              <p className="text-[10px] text-amber-600 font-semibold">
                No subjects configured. Go to Attendance Configuration first.
              </p>
            )}
          </div>

          {/* Period / Hour */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Period / Hour</label>
            <div className="relative">
              <select
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              >
                <option value="">-- Select Period --</option>
                {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleFetchStudents}
            disabled={fetchingStudents || !course || !semester}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Search size={15} />
            {fetchingStudents ? 'Loading…' : 'View Students'}
          </button>
        </div>
      </div>

      {/* Attendance Marking */}
      {studentsLoaded && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Stats Bar */}
          <div className="px-7 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-black text-slate-700">Present: {presentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-black text-slate-700">Absent: {absentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-black text-slate-700">Late: {lateCount}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => markAll('Present')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-lg transition-colors"
              >
                <CheckSquare size={13} /> Mark All Present
              </button>
              <button
                onClick={() => markAll('Absent')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-lg transition-colors"
              >
                <Square size={13} /> Mark All Absent
              </button>
            </div>
          </div>

          {/* Context Info */}
          <div className="px-7 py-3 bg-indigo-50 border-b border-indigo-100 text-xs font-semibold text-indigo-600 flex flex-wrap gap-4">
            <span>📅 {date}</span>
            {staffName && <span>👤 {staffName}</span>}
            <span>🎓 {course} — {semester}</span>
            {subject && <span>📚 {subject}</span>}
            {period && <span>🕐 {period}</span>}
          </div>

          {/* Student List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">S.No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Register Number</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student, idx) => {
                  const status = attendance[student.id] || 'Present';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-800">{student.fullName}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600 text-xs">
                        {student.registerNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-semibold">
                        {student.section || '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleStatus(student.id)}
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95 ${STATUS_COLORS[status]}`}
                        >
                          {status === 'Present' && <UserCheck size={12} />}
                          {status === 'Absent' && <UserX size={12} />}
                          {status === 'Late' && <Clock size={12} />}
                          {status}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          <div className="px-7 py-5 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : `Save Attendance (${students.length} Students)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
