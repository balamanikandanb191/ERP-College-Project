import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Printer, TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';
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

const ASSESSMENT_TYPES = [
  'Assignment',
  'Internal Test 1',
  'Internal Test 2',
  'Internal Test 3',
  'Model Exam',
  'Seminar',
  'Presentation',
  'Practical',
  'Record Work',
  'Viva Voce',
  'Project Review'
];

const AssessmentReport = () => {
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  
  const [academicYears, setAcademicYears] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [availableConfigs, setAvailableConfigs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('Subject-wise'); // Subject-wise, Grade Analysis

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [yearRes, configRes] = await Promise.allSettled([
          api.get('/masters/acad_year'),
          api.get('/assessment/config')
        ]);
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

  // Filter subjects based on selected course and semester
  useEffect(() => {
    if (course && semester) {
      const matchConfigs = availableConfigs.filter(
        c => c.course === course &&
             c.semester === semester &&
             c.academic_year === academicYear
      );
      const uniqueSubjects = [...new Set(matchConfigs.map(c => c.subject_name))];
      setSubjectList(uniqueSubjects);
    } else {
      setSubjectList([]);
    }
  }, [course, semester, academicYear, availableConfigs]);

  const handleGenerateReport = async () => {
    if (!academicYear || !course || !semester) {
      toast.error('Academic Year, Course, and Semester are required filters');
      return;
    }
    setLoading(true);
    try {
      let url = `/assessment/report?academic_year=${academicYear}&course=${encodeURIComponent(course)}&semester=${encodeURIComponent(semester)}`;
      if (subject) url += `&subject_name=${encodeURIComponent(subject)}`;
      if (assessmentType) url += `&assessment_type=${encodeURIComponent(assessmentType)}`;
      url += `&reportType=${reportType}`;

      const { data } = await api.get(url);
      setReportData(data);
      toast.success('Report generated successfully!');
    } catch (err) {
      toast.error('Failed to generate report: ' + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    if (!reportData || !reportData.marks) return;
    const headers = ['Register Number', 'Student Name', 'Roll Number', 'Subject', 'Assessment Type', 'Max Marks', 'Obtained Marks', 'Status'];
    const rows = reportData.marks.map(m => [
      m.register_no, m.student_name, m.roll_number || m.register_no, m.subject_name,
      m.assessment_type, m.max_marks, m.marks_obtained !== null ? m.marks_obtained : 'Ab', m.status
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `assessment_report_${course}_${semester}.csv`; a.click();
  };

  // Process data for grade analysis
  const getGradeAnalysis = () => {
    if (!reportData || !reportData.marks) return { passed: [], failed: [], topper: null };
    const marks = reportData.marks;
    const passed = marks.filter(m => m.status === 'Present' && m.marks_obtained !== null && m.max_marks > 0 && m.marks_obtained >= m.max_marks * 0.4);
    const failed = marks.filter(m => m.status === 'Absent' || (m.marks_obtained !== null && m.max_marks > 0 && m.marks_obtained < m.max_marks * 0.4));
    
    let topper = null;
    if (passed.length > 0) {
      topper = passed.reduce((prev, current) => (prev.marks_obtained > current.marks_obtained) ? prev : current);
    }

    return { passed, failed, topper };
  };

  const gradeAnalysis = getGradeAnalysis();

  return (
    <div className="space-y-6 pb-12 print:p-0 print:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              Academic Intelligence
            </span>
            <h1 className="text-3xl font-black mt-2">Assessment Reports &amp; Analytics</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">
              Consolidated course-wise, semester-wise, and subject-wise reports. Perform pass/fail analysis and identity batch toppers.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Selection Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden print:hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <FileText size={16} />
          </div>
          <div>
            <p className="font-black text-sm text-slate-800">Filter Selection</p>
            <p className="text-xs text-slate-500 font-medium">Select target filters and report parameters.</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Semester *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={semester} onChange={e => setSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject (Optional)</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">All Subjects</option>
                {subjectList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Assessment Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assessment Type (Optional)</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={assessmentType} onChange={e => setAssessmentType(e.target.value)}>
                <option value="">All Assessment Types</option>
                {ASSESSMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Report type tab selection */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
            <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-50">
              {['Subject-wise', 'Grade Analysis'].map(tab => (
                <button key={tab} onClick={() => setReportType(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${reportType === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <button onClick={handleGenerateReport} disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-colors disabled:opacity-60">
              <Search size={16} /> {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Students */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
              <p className="text-2xl font-black text-slate-800">{reportData.summary.totalStudents}</p>
            </div>
          </div>

          {/* Card 2: Pass Percentage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass Percentage</p>
              <p className="text-2xl font-black text-emerald-700">
                {reportData.summary.totalStudents > 0 
                  ? ((reportData.summary.passed / reportData.summary.totalStudents) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Card 3: Class Topper */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Award size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Topper</p>
              <p className="text-sm font-black text-slate-800 truncate max-w-[150px]">
                {gradeAnalysis.topper ? gradeAnalysis.topper.student_name : 'N/A'}
              </p>
              {gradeAnalysis.topper && (
                <p className="text-[10px] font-bold text-orange-600 font-mono">
                  Score: {gradeAnalysis.topper.marks_obtained} / {gradeAnalysis.topper.max_marks}
                </p>
              )}
            </div>
          </div>

          {/* Card 4: Arrears / Fails */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrears / Re-appear</p>
              <p className="text-2xl font-black text-rose-700">{reportData.summary.failed}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Table / Output */}
      {reportData && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center print:hidden">
            <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              Generated Report: {reportType}
            </h2>
            <div className="flex gap-2">
              <button onClick={exportCSV}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
                <Download size={14} /> Export CSV
              </button>
              <button onClick={handlePrint}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm">
                <Printer size={14} /> Print Report
              </button>
            </div>
          </div>

          {/* Header detail segment visible during print */}
          <div className="hidden print:block p-6 border-b border-slate-200">
            <h1 className="text-2xl font-black text-slate-900 text-center">COLLEGE ERP ASSESSMENT REPORT</h1>
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-semibold text-slate-700">
              <div><span className="text-slate-400">Academic Year:</span> {academicYear}</div>
              <div><span className="text-slate-400">Course / Programme:</span> {course}</div>
              <div><span className="text-slate-400">Semester:</span> {semester}</div>
              {subject && <div><span className="text-slate-400">Subject:</span> {subject}</div>}
              {assessmentType && <div><span className="text-slate-400">Assessment:</span> {assessmentType}</div>}
            </div>
          </div>

          {reportType === 'Subject-wise' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-5 py-4">Register Number</th>
                    <th className="px-5 py-4">Student Name</th>
                    <th className="px-5 py-4">Roll Number</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Assessment</th>
                    <th className="px-5 py-4 text-right">Max</th>
                    <th className="px-5 py-4 text-right">Score</th>
                    <th className="px-5 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reportData.marks.length === 0 ? (
                    <tr><td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-xs font-bold">No evaluation scores matching the criteria.</td></tr>
                  ) : reportData.marks.map((m, i) => {
                    const isFail = m.status === 'Absent' || (m.marks_obtained !== null && m.max_marks > 0 && m.marks_obtained < m.max_marks * 0.4);
                    return (
                      <tr key={m.id || i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{m.register_no}</td>
                        <td className="px-5 py-4 font-black text-slate-800">{m.student_name}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-600">{m.roll_number || m.register_no}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-700">{m.subject_name}</td>
                        <td className="px-5 py-4 text-xs font-bold text-slate-500">{m.assessment_type}</td>
                        <td className="px-5 py-4 text-right font-bold font-mono text-xs text-slate-500">{m.max_marks}</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`font-black font-mono text-xs ${isFail ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {m.marks_obtained !== null ? m.marks_obtained : 'Ab'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${isFail ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                            {isFail ? 'Fail' : 'Pass'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Passed Section */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-3">
                    <h3 className="font-black text-xs text-emerald-800 uppercase tracking-wider">Pass Roll List ({gradeAnalysis.passed.length})</h3>
                  </div>
                  <div className="p-4 divide-y divide-slate-50 max-h-96 overflow-y-auto">
                    {gradeAnalysis.passed.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold text-center py-4">No passing records found.</p>
                    ) : gradeAnalysis.passed.map(p => (
                      <div key={p.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-black text-slate-800">{p.student_name}</p>
                          <p className="font-mono text-[10px] text-slate-500">{p.register_no} · {p.subject_name}</p>
                        </div>
                        <span className="font-black font-mono text-emerald-600 text-sm">{p.marks_obtained}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failed / Reappear Section */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-rose-50 border-b border-rose-100 px-4 py-3">
                    <h3 className="font-black text-xs text-rose-800 uppercase tracking-wider">Arrears / Re-appear Roll List ({gradeAnalysis.failed.length})</h3>
                  </div>
                  <div className="p-4 divide-y divide-slate-50 max-h-96 overflow-y-auto">
                    {gradeAnalysis.failed.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold text-center py-4">No failure records found.</p>
                    ) : gradeAnalysis.failed.map(f => (
                      <div key={f.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-black text-slate-800">{f.student_name}</p>
                          <p className="font-mono text-[10px] text-slate-500">{f.register_no} · {f.subject_name}</p>
                        </div>
                        <span className="font-black font-mono text-rose-600 text-sm">
                          {f.marks_obtained !== null ? f.marks_obtained : 'Absent'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentReport;
