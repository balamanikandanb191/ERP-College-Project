import React, { useState, useEffect } from 'react';
import { Search, Save, Clipboard, Award, User, Hash, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const COURSES = [
  'B.Sc Computer Science',
  'B.Sc Mathematics',
  'B.Com',
  'BCA',
  'BBA',
  'B.Pharm',
  'MBA',
  'MCA',
  'M.Sc Computer Science',
  'M.Sc Mathematics',
  'Diploma in Computer Science',
  'B.E Computer Science',
  'B.E Electronics',
  'B.Tech IT',
  'M.Tech'
];

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Year 1', 'Year 2', 'Year 3'];

const PRACTICAL_TYPES = ['Practical', 'Record Work', 'Viva Voce'];

const PracticalMark = () => {
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [staffName, setStaffName] = useState('');
  const [practicalType, setPracticalType] = useState('Practical');

  const [subjectList, setSubjectList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [availableConfigs, setAvailableConfigs] = useState([]);

  const [subCode, setSubCode] = useState('');
  const [practicalDate, setPracticalDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [experimentCount, setExperimentCount] = useState('');
  const [staffId, setStaffId] = useState('');
  const [configId, setConfigId] = useState('');

  const [students, setStudents] = useState([]);
  // Sub-components of mark: Observation (20%), Record (20%), Viva (20%), Practical (40%)
  const [observationMarks, setObservationMarks] = useState({});
  const [recordMarks, setRecordMarks] = useState({});
  const [vivaMarks, setVivaMarks] = useState({});
  const [practicalMarks, setPracticalMarks] = useState({});
  const [statusData, setStatusData] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [staffRes, yearRes, configRes] = await Promise.allSettled([
          api.get('/masters/staff_master'),
          api.get('/masters/acad_year'),
          api.get('/assessment/config')
        ]);
        if (staffRes.status === 'fulfilled') {
          setStaffList(staffRes.value.data.map(r => ({ id: r.id, ...r.data })));
        }
        if (yearRes.status === 'fulfilled') {
          setAcademicYears(yearRes.value.data.map(r => r.data?.year || r.data?.name).filter(Boolean));
        }
        if (configRes.status === 'fulfilled') {
          setAvailableConfigs(configRes.value.data);
        }
      } catch (e) {
        console.error('Error loading master data:', e);
      }
    };
    loadMasters();
  }, []);

  // Filter subjects based on selection
  useEffect(() => {
    if (course && semester) {
      const matchConfigs = availableConfigs.filter(
        c => c.course === course &&
             c.semester === semester &&
             c.academic_year === academicYear &&
             PRACTICAL_TYPES.includes(c.assessment_type)
      );
      const uniqueSubjects = [...new Set(matchConfigs.map(c => c.subject_name))];
      setSubjectList(uniqueSubjects);
    } else {
      setSubjectList([]);
    }
  }, [course, semester, academicYear, availableConfigs]);

  // Auto-fill configuration fields
  useEffect(() => {
    if (course && semester && subject) {
      const match = availableConfigs.find(
        c => c.course === course &&
             c.semester === semester &&
             c.academic_year === academicYear &&
             c.subject_name === subject &&
             c.assessment_type === practicalType
      );

      if (match) {
        setSubCode(match.subject_code || '');
        setPracticalDate(match.assessment_date || '');
        setMaxMarks(match.max_marks || 100);
        setExperimentCount(match.experiment_count || '');
        setConfigId(match.id);
        
        if (match.staff_name) {
          setStaffName(match.staff_name);
          setStaffId(match.staff_id || '');
        }
      } else {
        setSubCode('');
        setPracticalDate('');
        setMaxMarks(100);
        setExperimentCount('');
        setConfigId('');
      }
    }
  }, [course, semester, subject, practicalType, academicYear, availableConfigs]);

  useEffect(() => {
    if (staffName) {
      const foundStaff = staffList.find(s => s.fullName === staffName || s.name === staffName);
      if (foundStaff) {
        setStaffId(foundStaff.staffId || foundStaff.id || '');
      }
    }
  }, [staffName, staffList]);

  // Load students
  const handleViewStudents = async () => {
    if (!academicYear || !course || !semester || !subject) {
      toast.error('Please select Academic Year, Course, Semester, and Subject');
      return;
    }
    setLoading(true);
    try {
      const studentsRes = await api.get(`/assessment/students?course=${encodeURIComponent(course)}&semester=${encodeURIComponent(semester)}&academic_year=${academicYear}`);
      const marksRes = await api.get(`/assessment/marks?academic_year=${academicYear}&course=${encodeURIComponent(course)}&semester=${encodeURIComponent(semester)}&subject_name=${encodeURIComponent(subject)}&assessment_type=${encodeURIComponent(practicalType)}`);
      
      const studentsList = studentsRes.data;
      const existingMarks = marksRes.data;

      const obsMap = {};
      const recMap = {};
      const vivMap = {};
      const pracMap = {};
      const statusMap = {};
      
      studentsList.forEach(stud => {
        const foundMark = existingMarks.find(m => m.student_id === stud.id);
        if (foundMark) {
          obsMap[stud.id] = foundMark.observation_mark !== null ? foundMark.observation_mark : '';
          recMap[stud.id] = foundMark.record_mark !== null ? foundMark.record_mark : '';
          vivMap[stud.id] = foundMark.viva_mark !== null ? foundMark.viva_mark : '';
          pracMap[stud.id] = foundMark.practical_mark !== null ? foundMark.practical_mark : '';
          statusMap[stud.id] = foundMark.status || 'Present';
        } else {
          obsMap[stud.id] = '';
          recMap[stud.id] = '';
          vivMap[stud.id] = '';
          pracMap[stud.id] = '';
          statusMap[stud.id] = 'Present';
        }
      });

      setStudents(studentsList);
      setObservationMarks(obsMap);
      setRecordMarks(recMap);
      setVivaMarks(vivMap);
      setPracticalMarks(pracMap);
      setStatusData(statusMap);

      if (studentsList.length === 0) {
        toast.error('No students found registered for the selected Course and Semester');
      } else {
        toast.success(`Loaded ${studentsList.length} students successfully`);
      }
    } catch (err) {
      toast.error('Failed to load students: ' + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubMarkChange = (studentId, type, value) => {
    if (value !== '') {
      const val = Number(value);
      if (val < 0) {
        toast.error('Marks cannot be negative');
        return;
      }
      
      // Let's check constraints based on 20/20/20/40 rule or simple max marks constraint
      // Sum of observation, record, viva, practical cannot exceed maxMarks
      const obs = type === 'obs' ? val : Number(observationMarks[studentId] || 0);
      const rec = type === 'rec' ? val : Number(recordMarks[studentId] || 0);
      const viv = type === 'viv' ? val : Number(vivaMarks[studentId] || 0);
      const prac = type === 'prac' ? val : Number(practicalMarks[studentId] || 0);

      if (obs + rec + viv + prac > maxMarks) {
        toast.error(`Total marks cannot exceed Maximum Marks: ${maxMarks}`);
        return;
      }
    }

    if (type === 'obs') setObservationMarks(prev => ({ ...prev, [studentId]: value }));
    if (type === 'rec') setRecordMarks(prev => ({ ...prev, [studentId]: value }));
    if (type === 'viv') setVivaMarks(prev => ({ ...prev, [studentId]: value }));
    if (type === 'prac') setPracticalMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const toggleStatus = (studentId) => {
    setStatusData(prev => {
      const current = prev[studentId] || 'Present';
      const next = current === 'Present' ? 'Absent' : 'Present';
      if (next === 'Absent') {
        setObservationMarks(prev => ({ ...prev, [studentId]: '' }));
        setRecordMarks(prev => ({ ...prev, [studentId]: '' }));
        setVivaMarks(prev => ({ ...prev, [studentId]: '' }));
        setPracticalMarks(prev => ({ ...prev, [studentId]: '' }));
      } else {
        setObservationMarks(prev => ({ ...prev, [studentId]: '0' }));
        setRecordMarks(prev => ({ ...prev, [studentId]: '0' }));
        setVivaMarks(prev => ({ ...prev, [studentId]: '0' }));
        setPracticalMarks(prev => ({ ...prev, [studentId]: '0' }));
      }
      return { ...prev, [studentId]: next };
    });
  };

  // Save marks to database
  const handleSaveMarks = async () => {
    if (students.length === 0) {
      toast.error('No student records to save. Please click "Search Students" first.');
      return;
    }
    setSaving(true);
    try {
      const marksPayload = students.map(stud => {
        const obs = observationMarks[stud.id] !== '' ? Number(observationMarks[stud.id]) : 0;
        const rec = recordMarks[stud.id] !== '' ? Number(recordMarks[stud.id]) : 0;
        const viv = vivaMarks[stud.id] !== '' ? Number(vivaMarks[stud.id]) : 0;
        const prac = practicalMarks[stud.id] !== '' ? Number(practicalMarks[stud.id]) : 0;
        const total = obs + rec + viv + prac;

        return {
          student_id: stud.id,
          register_no: stud.registerNumber,
          roll_number: stud.rollNumber || stud.registerNumber,
          student_name: stud.fullName,
          course: course,
          semester: semester,
          subject_name: subject,
          subject_code: subCode,
          assessment_type: practicalType,
          assessment_number: 1,
          assessment_id: configId || null,
          academic_year: academicYear,
          staff_id: staffId,
          staff_name: staffName,
          observation_mark: statusData[stud.id] === 'Present' ? obs : null,
          record_mark: statusData[stud.id] === 'Present' ? rec : null,
          viva_mark: statusData[stud.id] === 'Present' ? viv : null,
          practical_mark: statusData[stud.id] === 'Present' ? prac : null,
          marks_obtained: statusData[stud.id] === 'Present' ? total : null,
          max_marks: Number(maxMarks),
          status: statusData[stud.id] || 'Present'
        };
      });

      await api.post('/assessment/marks', { marks: marksPayload });
      toast.success('Laboratory/Practical marks saved successfully!');
    } catch (err) {
      toast.error('Failed to save marks: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setCourse('');
    setSemester('');
    setSubject('');
    setStaffName('');
    setStaffId('');
    setSubCode('');
    setPracticalDate('');
    setMaxMarks(100);
    setExperimentCount('');
    setConfigId('');
    setStudents([]);
    setObservationMarks({});
    setRecordMarks({});
    setVivaMarks({});
    setPracticalMarks({});
    setStatusData({});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              Laboratory Scoring
            </span>
            <h1 className="text-3xl font-black mt-2">Laboratory Assessment Entry</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">
              Log observation, records, viva-voce, and final laboratory marks for experimental courses
            </p>
          </div>
          {students.length > 0 && (
            <button onClick={handleSaveMarks} disabled={saving}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-colors disabled:opacity-60">
              <Save size={18} /> {saving ? 'Saving...' : 'Publish Marks'}
            </button>
          )}
        </div>
      </div>

      {/* Selection Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Clipboard size={16} />
          </div>
          <div>
            <p className="font-black text-sm text-slate-800">Selection Panel</p>
            <p className="text-xs text-slate-500 font-medium">Please select the criteria below to load the student list for Practical marks entry.</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Academic Year</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
                {(academicYears.length > 0 ? academicYears : ['2024-2025', '2025-2026', '2026-2027']).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Course / Programme *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={course} onChange={e => setCourse(e.target.value)}>
                <option value="">Select Course</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Semester / Year / Section *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={semester} onChange={e => setSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Name *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">Select Subject</option>
                {subjectList.length > 0 ? (
                  subjectList.map(s => <option key={s} value={s}>{s}</option>)
                ) : (
                  ['Physics Lab', 'Chemistry Lab', 'Data Structures Lab', 'OOP Lab'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))
                )}
              </select>
            </div>

            {/* Staff Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff Name *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={staffName} onChange={e => setStaffName(e.target.value)}>
                <option value="">Select Staff</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.fullName || s.name}>{s.fullName || s.name}</option>
                ))}
              </select>
            </div>

            {/* Staff ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff ID</label>
              <input type="text" readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-500 font-semibold"
                placeholder="Staff ID" value={staffId} />
            </div>

            {/* Subject Code */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Code</label>
              <input type="text" readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-500 font-semibold"
                placeholder="Auto-fetched" value={subCode} />
            </div>

            {/* Practical No */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Practical No *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={practicalType} onChange={e => setPracticalType(e.target.value)}>
                {PRACTICAL_TYPES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Practical Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Practical Date</label>
              <input type="text" readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-500 font-semibold"
                placeholder="Auto-fetched" value={practicalDate} />
            </div>

            {/* Max Marks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Maximum Marks</label>
              <input type="text" readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-500 font-semibold font-mono font-bold"
                placeholder="Auto-fetched" value={maxMarks} />
            </div>

            {/* Experiment Count */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Experiment Count</label>
              <input type="text" readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-500 font-semibold font-mono"
                placeholder="Auto-fetched" value={experimentCount} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleViewStudents} disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-colors disabled:opacity-60">
              <Search size={16} /> {loading ? 'Searching...' : 'Search Students'}
            </button>
            <button onClick={handleClear}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      {students.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4">Register Number</th>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Roll Number</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 w-28 text-right">Obs Mark</th>
                  <th className="px-5 py-4 w-28 text-right">Rec Mark</th>
                  <th className="px-5 py-4 w-28 text-right">Viva Mark</th>
                  <th className="px-5 py-4 w-28 text-right">Prac Mark</th>
                  <th className="px-5 py-4 text-right w-32">Total / {maxMarks}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(s => {
                  const obs = Number(observationMarks[s.id] || 0);
                  const rec = Number(recordMarks[s.id] || 0);
                  const viv = Number(vivaMarks[s.id] || 0);
                  const prac = Number(practicalMarks[s.id] || 0);
                  const total = obs + rec + viv + prac;
                  const isFail = statusData[s.id] === 'Present' && total < (maxMarks * 0.4);
                  
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{s.registerNumber}</td>
                      <td className="px-5 py-4 font-black text-slate-800">{s.fullName}</td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600">{s.rollNumber || s.registerNumber}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleStatus(s.id)}
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border transition-all ${statusData[s.id] === 'Absent' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {statusData[s.id] || 'Present'}
                        </button>
                      </td>
                      {/* Sub marks inputs */}
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-550 disabled:bg-slate-100 disabled:text-slate-400"
                          disabled={statusData[s.id] === 'Absent'} placeholder="-" value={observationMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'obs', e.target.value)} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-550 disabled:bg-slate-100 disabled:text-slate-400"
                          disabled={statusData[s.id] === 'Absent'} placeholder="-" value={recordMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'rec', e.target.value)} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-550 disabled:bg-slate-100 disabled:text-slate-400"
                          disabled={statusData[s.id] === 'Absent'} placeholder="-" value={vivaMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'viv', e.target.value)} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-550 disabled:bg-slate-100 disabled:text-slate-400"
                          disabled={statusData[s.id] === 'Absent'} placeholder="-" value={practicalMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'prac', e.target.value)} />
                      </td>
                      {/* Total */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isFail && <span className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} /> Fail</span>}
                          <span className={`text-base font-black font-mono ${statusData[s.id] === 'Absent' ? 'text-slate-400' : isFail ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {statusData[s.id] === 'Absent' ? 'Ab' : total}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticalMark;
