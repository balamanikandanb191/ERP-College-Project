import React, { useState, useEffect, useRef } from 'react';
import { Search, Save, Clipboard, Award, User, Hash, Calendar, AlertCircle, ChevronDown, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DEFAULT_COURSES = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
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

// ─── Searchable Staff Dropdown ──────────────────────────────────────────────
const StaffSearchDropdown = ({ staffList, value, onSelect }) => {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Sync when value changes externally (e.g. edit mode or clear)
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = staffList.filter(s => {
    const nameStr = s.fullName || s.name || '';
    const idStr = s.staffId || s.id || '';
    return nameStr.toLowerCase().includes(query.toLowerCase()) ||
           idStr.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 12);

  const handleSelect = (staff) => {
    const name = staff.fullName || staff.name || '';
    setQuery(name);
    setOpen(false);
    onSelect(staff);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search staff..."
          className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center">
              {staffList.length === 0
                ? 'No staff found in master database'
                : 'No match found'}
            </div>
          ) : (
            filtered.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
              >
                <div className="font-bold text-slate-800 text-sm">{s.fullName || s.name}</div>
                <div className="text-[10px] text-indigo-500 font-mono font-black">{s.staffId || s.id}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const PracticalMark = () => {
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [staffName, setStaffName] = useState('');
  const [practicalType, setPracticalType] = useState('Practical');

  const [subjectList, setSubjectList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [courseList, setCourseList] = useState(DEFAULT_COURSES);
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
  const [markIds, setMarkIds] = useState({}); // student_id -> database ID
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRows, setEditingRows] = useState({}); // student_id -> boolean
  const [originalObs, setOriginalObs] = useState({});
  const [originalRec, setOriginalRec] = useState({});
  const [originalViv, setOriginalViv] = useState({});
  const [originalPrac, setOriginalPrac] = useState({});
  const [originalStatus, setOriginalStatus] = useState({});

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [staffRes, yearRes, configRes, classRes] = await Promise.allSettled([
          api.get('/staff'),
          api.get('/masters/acad_year'),
          api.get('/assessment/config'),
          api.get('/masters/class_master')
        ]);
        if (staffRes.status === 'fulfilled') {
          setStaffList(Array.isArray(staffRes.value.data) ? staffRes.value.data : []);
        }
        if (yearRes.status === 'fulfilled') {
          setAcademicYears(yearRes.value.data.map(r => r.data?.year || r.data?.name).filter(Boolean));
        }
        if (configRes.status === 'fulfilled') {
          setAvailableConfigs(configRes.value.data);
        }
        if (classRes.status === 'fulfilled' && Array.isArray(classRes.value.data)) {
          const set = new Set(DEFAULT_COURSES);
          classRes.value.data.forEach(r => {
            const c = r.data || r;
            if (c.depts) {
              const list = typeof c.depts === 'string' ? c.depts.split(',') : c.depts;
              if (Array.isArray(list)) {
                list.forEach(d => {
                  const trimmed = d.trim();
                  if (trimmed) set.add(trimmed);
                });
              }
            }
          });
          setCourseList(Array.from(set));
        }
      } catch (e) {
        console.error('Error loading master data:', e);
      }
    };
    loadMasters();
  }, []);

  // Dynamic filters based on Assessment Configurations
  const configuredCourses = availableConfigs
    ? [...new Set(availableConfigs.filter(c => c.academic_year === academicYear).map(c => c.course))].filter(Boolean)
    : [];

  const configuredSemesters = (course && availableConfigs)
    ? [...new Set(availableConfigs.filter(c => c.course === course && c.academic_year === academicYear).map(c => c.semester))].filter(Boolean)
    : [];

  const configuredSections = (course && semester && availableConfigs)
    ? [...new Set(availableConfigs.filter(c => c.course === course && c.semester === semester && c.academic_year === academicYear).map(c => c.section))].filter(Boolean)
    : [];

  // Filter subjects based on selection
  useEffect(() => {
    if (course && semester) {
      const matchConfigs = availableConfigs.filter(
        c => c.course === course &&
             c.semester === semester &&
             c.academic_year === academicYear &&
             PRACTICAL_TYPES.includes(c.assessment_type) &&
             (!section || !c.section || c.section === section)
      );
      const uniqueSubjects = [...new Set(matchConfigs.map(c => c.subject_name))];
      setSubjectList(uniqueSubjects);
    } else {
      setSubjectList([]);
    }
  }, [course, semester, section, academicYear, availableConfigs]);

  // Auto-fill configuration fields
  useEffect(() => {
    if (course && semester && subject) {
      const match = availableConfigs.find(
        c => c.course === course &&
             c.semester === semester &&
             (!section || !c.section || c.section === section) &&
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
  }, [course, semester, section, subject, practicalType, academicYear, availableConfigs]);

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
      let studentUrl = `/assessment/students?course=${encodeURIComponent(course)}&semester=${encodeURIComponent(semester)}&academic_year=${academicYear}`;
      if (section) {
        studentUrl += `&section=${encodeURIComponent(section)}`;
      }
      const studentsRes = await api.get(studentUrl);
      const marksRes = await api.get(`/assessment/marks?academic_year=${academicYear}&course=${encodeURIComponent(course)}&semester=${encodeURIComponent(semester)}&subject_name=${encodeURIComponent(subject)}&assessment_type=${encodeURIComponent(practicalType)}`);
      
      const studentsList = studentsRes.data;
      const existingMarks = marksRes.data;

      const obsMap = {};
      const recMap = {};
      const vivMap = {};
      const pracMap = {};
      const statusMap = {};
      const idsMap = {};
      
      studentsList.forEach(stud => {
        const foundMark = existingMarks.find(m => m.student_id === stud.id);
        if (foundMark) {
          obsMap[stud.id] = foundMark.observation_mark !== null ? foundMark.observation_mark : '';
          recMap[stud.id] = foundMark.record_mark !== null ? foundMark.record_mark : '';
          vivMap[stud.id] = foundMark.viva_mark !== null ? foundMark.viva_mark : '';
          pracMap[stud.id] = foundMark.practical_mark !== null ? foundMark.practical_mark : '';
          statusMap[stud.id] = foundMark.status || 'Present';
          idsMap[stud.id] = foundMark.id;
        } else {
          obsMap[stud.id] = '';
          recMap[stud.id] = '';
          vivMap[stud.id] = '';
          pracMap[stud.id] = '';
          statusMap[stud.id] = 'Present';
          idsMap[stud.id] = null;
        }
      });

      setStudents(studentsList);
      setObservationMarks(obsMap);
      setRecordMarks(recMap);
      setVivaMarks(vivMap);
      setPracticalMarks(pracMap);
      setStatusData(statusMap);
      setMarkIds(idsMap);
      setOriginalObs({ ...obsMap });
      setOriginalRec({ ...recMap });
      setOriginalViv({ ...vivMap });
      setOriginalPrac({ ...pracMap });
      setOriginalStatus({ ...statusMap });
      setEditingRows({});

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

      const response = await api.post('/assessment/marks', { marks: marksPayload });
      const savedMarks = response.data?.marks || [];
      const idsMap = {};
      const newObsMap = {};
      const newRecMap = {};
      const newVivMap = {};
      const newPracMap = {};
      const newStatusMap = {};
      savedMarks.forEach(m => {
        idsMap[m.student_id] = m.id;
        newObsMap[m.student_id] = m.observation_mark !== null ? m.observation_mark : '';
        newRecMap[m.student_id] = m.record_mark !== null ? m.record_mark : '';
        newVivMap[m.student_id] = m.viva_mark !== null ? m.viva_mark : '';
        newPracMap[m.student_id] = m.practical_mark !== null ? m.practical_mark : '';
        newStatusMap[m.student_id] = m.status || 'Present';
      });
      setMarkIds(prev => ({ ...prev, ...idsMap }));
      setOriginalObs(prev => ({ ...prev, ...newObsMap }));
      setOriginalRec(prev => ({ ...prev, ...newRecMap }));
      setOriginalViv(prev => ({ ...prev, ...newVivMap }));
      setOriginalPrac(prev => ({ ...prev, ...newPracMap }));
      setOriginalStatus(prev => ({ ...prev, ...newStatusMap }));
      setEditingRows({});
      toast.success('Laboratory/Practical marks saved successfully!');
    } catch (err) {
      toast.error('Failed to save marks: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSingleMark = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    try {
      const obs = observationMarks[studentId] !== '' ? Number(observationMarks[studentId]) : 0;
      const rec = recordMarks[studentId] !== '' ? Number(recordMarks[studentId]) : 0;
      const viv = vivaMarks[studentId] !== '' ? Number(vivaMarks[studentId]) : 0;
      const prac = practicalMarks[studentId] !== '' ? Number(practicalMarks[studentId]) : 0;
      const total = obs + rec + viv + prac;

      const singlePayload = {
        student_id: student.id,
        register_no: student.registerNumber,
        roll_number: student.rollNumber || student.registerNumber,
        student_name: student.fullName,
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
        observation_mark: statusData[studentId] === 'Present' ? obs : null,
        record_mark: statusData[studentId] === 'Present' ? rec : null,
        viva_mark: statusData[studentId] === 'Present' ? viv : null,
        practical_mark: statusData[studentId] === 'Present' ? prac : null,
        marks_obtained: statusData[studentId] === 'Present' ? total : null,
        max_marks: Number(maxMarks),
        status: statusData[studentId] || 'Present'
      };

      const response = await api.post('/assessment/marks', { marks: [singlePayload] });
      const savedMarks = response.data?.marks || [];
      if (savedMarks.length > 0) {
        const m = savedMarks[0];
        setMarkIds(prev => ({ ...prev, [studentId]: m.id }));
        setOriginalObs(prev => ({ ...prev, [studentId]: m.observation_mark !== null ? m.observation_mark : '' }));
        setOriginalRec(prev => ({ ...prev, [studentId]: m.record_mark !== null ? m.record_mark : '' }));
        setOriginalViv(prev => ({ ...prev, [studentId]: m.viva_mark !== null ? m.viva_mark : '' }));
        setOriginalPrac(prev => ({ ...prev, [studentId]: m.practical_mark !== null ? m.practical_mark : '' }));
        setOriginalStatus(prev => ({ ...prev, [studentId]: m.status || 'Present' }));
      }
      setEditingRows(prev => ({ ...prev, [studentId]: false }));
      toast.success(`Marks saved for ${student.fullName}`);
    } catch (err) {
      toast.error('Failed to save mark: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleEditRow = (studentId) => {
    setEditingRows(prev => ({ ...prev, [studentId]: true }));
  };

  const handleCancelEdit = (studentId) => {
    setObservationMarks(prev => ({ ...prev, [studentId]: originalObs[studentId] || '' }));
    setRecordMarks(prev => ({ ...prev, [studentId]: originalRec[studentId] || '' }));
    setVivaMarks(prev => ({ ...prev, [studentId]: originalViv[studentId] || '' }));
    setPracticalMarks(prev => ({ ...prev, [studentId]: originalPrac[studentId] || '' }));
    setStatusData(prev => ({ ...prev, [studentId]: originalStatus[studentId] || 'Present' }));
    setEditingRows(prev => ({ ...prev, [studentId]: false }));
  };

  const handleDeleteMark = async (studentId) => {
    const markId = markIds[studentId];
    if (!markId) {
      setObservationMarks(prev => ({ ...prev, [studentId]: '' }));
      setRecordMarks(prev => ({ ...prev, [studentId]: '' }));
      setVivaMarks(prev => ({ ...prev, [studentId]: '' }));
      setPracticalMarks(prev => ({ ...prev, [studentId]: '' }));
      setStatusData(prev => ({ ...prev, [studentId]: 'Present' }));
      setOriginalObs(prev => ({ ...prev, [studentId]: '' }));
      setOriginalRec(prev => ({ ...prev, [studentId]: '' }));
      setOriginalViv(prev => ({ ...prev, [studentId]: '' }));
      setOriginalPrac(prev => ({ ...prev, [studentId]: '' }));
      setOriginalStatus(prev => ({ ...prev, [studentId]: 'Present' }));
      toast.success('Marks cleared locally');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this mark record from the database?')) {
      return;
    }

    try {
      await api.delete(`/assessment/marks/${markId}`);
      setObservationMarks(prev => ({ ...prev, [studentId]: '' }));
      setRecordMarks(prev => ({ ...prev, [studentId]: '' }));
      setVivaMarks(prev => ({ ...prev, [studentId]: '' }));
      setPracticalMarks(prev => ({ ...prev, [studentId]: '' }));
      setStatusData(prev => ({ ...prev, [studentId]: 'Present' }));
      setOriginalObs(prev => ({ ...prev, [studentId]: '' }));
      setOriginalRec(prev => ({ ...prev, [studentId]: '' }));
      setOriginalViv(prev => ({ ...prev, [studentId]: '' }));
      setOriginalPrac(prev => ({ ...prev, [studentId]: '' }));
      setOriginalStatus(prev => ({ ...prev, [studentId]: 'Present' }));
      setMarkIds(prev => ({ ...prev, [studentId]: null }));
      setEditingRows(prev => ({ ...prev, [studentId]: false }));
      toast.success('Mark record deleted successfully from database');
    } catch (err) {
      toast.error('Failed to delete mark: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setCourse('');
    setSemester('');
    setSection('');
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
    setMarkIds({});
    setEditingRows({});
    setOriginalObs({});
    setOriginalRec({});
    setOriginalViv({});
    setOriginalPrac({});
    setOriginalStatus({});
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
                {configuredCourses.length > 0 ? (
                  configuredCourses.map(c => <option key={c} value={c}>{c}</option>)
                ) : (
                  courseList.map(c => <option key={c} value={c}>{c}</option>)
                )}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Semester / Year *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={semester} onChange={e => setSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {configuredSemesters.length > 0 ? (
                  configuredSemesters.map(s => <option key={s} value={s}>{s}</option>)
                ) : (
                  SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)
                )}
              </select>
            </div>

            {/* Section */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Section</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={section} onChange={e => setSection(e.target.value)}>
                <option value="">Select Section</option>
                {configuredSections.length > 0 ? (
                  configuredSections.map(sec => <option key={sec} value={sec}>{sec}</option>)
                ) : (
                  ['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>{sec}</option>)
                )}
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
              <StaffSearchDropdown
                staffList={staffList}
                value={staffName}
                onSelect={(staff) => {
                  setStaffName(staff.fullName || staff.name || '');
                  setStaffId(staff.staffId || staff.id || '');
                }}
              />
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
                  <th className="px-5 py-4 text-center w-24">Actions</th>
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
                  const isRowEditable = !markIds[s.id] || editingRows[s.id];
                  
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{s.registerNumber}</td>
                      <td className="px-5 py-4 font-black text-slate-800">{s.fullName}</td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600">{s.rollNumber || s.registerNumber}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => isRowEditable && toggleStatus(s.id)}
                          disabled={!isRowEditable}
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border transition-all ${!isRowEditable ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : statusData[s.id] === 'Absent' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {statusData[s.id] || 'Present'}
                        </button>
                      </td>
                      {/* Sub marks inputs */}
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                          disabled={!isRowEditable || statusData[s.id] === 'Absent'} placeholder="-" value={observationMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'obs', e.target.value)} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                          disabled={!isRowEditable || statusData[s.id] === 'Absent'} placeholder="-" value={recordMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'rec', e.target.value)} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                          disabled={!isRowEditable || statusData[s.id] === 'Absent'} placeholder="-" value={vivaMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'viv', e.target.value)} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <input type="number" className="w-20 border rounded-xl px-2 py-1.5 text-sm focus:outline-none text-right font-bold font-mono border-slate-200 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                          disabled={!isRowEditable || statusData[s.id] === 'Absent'} placeholder="-" value={practicalMarks[s.id] || ''} onChange={e => handleSubMarkChange(s.id, 'prac', e.target.value)} />
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
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isRowEditable ? (
                            <>
                              <button onClick={() => handleSaveSingleMark(s.id)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                title="Save mark for this student"
                              >
                                <Check size={16} />
                              </button>
                              {markIds[s.id] && (
                                <button onClick={() => handleCancelEdit(s.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-655 transition-colors"
                                  title="Cancel changes"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditRow(s.id)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                title="Edit mark"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteMark(s.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Delete mark record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
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
