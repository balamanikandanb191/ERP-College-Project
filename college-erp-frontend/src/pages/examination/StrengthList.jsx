import React, { useState, useEffect } from 'react';
import { Search, Printer, BookOpen, Users, GraduationCap, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';

const StrengthList = () => {
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter input states
  const [reportType, setReportType] = useState('Normal Strength List');
  const [searchQuery, setSearchQuery] = useState('');

  // Applied filter states
  const [appliedFilters, setAppliedFilters] = useState({
    reportType: 'Normal Strength List',
    searchQuery: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch students
      const resStudents = await api.get('/students');
      if (resStudents.data) {
        setStudents(resStudents.data);
      }

      // Fetch exam timetables
      const resTimetable = await api.get('/masters/exam_timetable');
      if (resTimetable.data) {
        setTimetable(resTimetable.data.map(r => ({ ...r.data, id: r.id })));
      }

      // Fetch generated exams (for matching examName)
      const resExams = await api.get('/masters/exam_generation');
      if (resExams.data) {
        setExams(resExams.data.map(r => ({ ...r.data, id: r.id })));
      }
    } catch (error) {
      console.error('Failed to fetch data, loading cached states:', error);
      
      const cachedStudents = localStorage.getItem('erp_students');
      if (cachedStudents) setStudents(JSON.parse(cachedStudents));
      
      const cachedTimetable = localStorage.getItem('erp_exam_timetable');
      if (cachedTimetable) setTimetable(JSON.parse(cachedTimetable));

      const cachedExams = localStorage.getItem('erp_generated_exams');
      if (cachedExams) setExams(JSON.parse(cachedExams));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    setAppliedFilters({
      reportType,
      searchQuery
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. Filter timetables based on report type & search query
  const filteredTimetables = timetable.filter(item => {
    // Report Type mapping:
    // "Normal Strength List" -> Theory exams
    // "Practical Strength List" -> Practical exams
    const expectedType = appliedFilters.reportType === 'Normal Strength List' ? 'Theory' : 'Practical';
    const matchesType = (item.type || 'Theory').toLowerCase() === expectedType.toLowerCase();

    const matchesSearch = !appliedFilters.searchQuery || 
      item.subjectName.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase()) ||
      item.subjectCode.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase()) ||
      item.dept.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const normalizeSem = (semVal) => {
    if (!semVal) return '';
    const match = semVal.toString().match(/\d+/);
    return match ? match[0] : semVal.toString().trim();
  };

  // 2. Generate flat rows with student counts per section
  const flatEntries = [];
  filteredTimetables.forEach(item => {
    // Find matching students for this timetable's course, department, and semester
    const matchingStudents = students.filter(student => {
      const sDept = student.department || '';
      const sSem = student.semester || '';
      
      const deptMatch = sDept.toLowerCase().trim() === item.dept.toLowerCase().trim();
      const semMatch = normalizeSem(sSem) === normalizeSem(item.sem);
      
      return deptMatch && semMatch;
    });

    // Group matching students by section
    const sections = {};
    if (matchingStudents.length > 0) {
      matchingStudents.forEach(st => {
        const sec = st.section || 'A';
        sections[sec] = (sections[sec] || 0) + 1;
      });
    } else {
      // Default to section A with 0 count if no students found (so the exam is still visible)
      sections['A'] = 0;
    }

    // Create entry per section
    Object.entries(sections).forEach(([section, count]) => {
      // Find matching exam generation name
      const matchingExam = exams.find(e => 
        e.academicYear === item.academicYear &&
        e.course === item.course &&
        e.dept === item.dept &&
        e.sem.toString() === item.sem.toString()
      );
      const examName = matchingExam ? matchingExam.examName : 'Semester End Theory Examinations';

      flatEntries.push({
        id: `${item.id}-${section}`,
        date: item.date || 'TBD',
        session: item.session || 'FN',
        examName: examName,
        // Standard column formatted beautifully
        standard: `${item.course} ${item.dept} - Sem ${item.sem} (${section})`,
        subjectCode: item.subjectCode,
        subjectName: item.subjectName,
        studentCount: count
      });
    });
  });

  // 3. Group entries by date & session
  const groupedData = {};
  flatEntries.forEach(entry => {
    // Format date as DD-MM-YYYY
    let formattedDate = entry.date;
    try {
      const d = new Date(entry.date);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        formattedDate = `${day}-${month}-${year}`;
      }
    } catch (e) {
      console.error('Date formatting failed:', e);
    }

    const groupKey = `${formattedDate} - ${entry.session}`;
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = [];
    }
    groupedData[groupKey].push(entry);
  });

  const totalRegisteredStudents = students.length;
  const activeExamsCount = timetable.length;
  const totalStudentsInFiltered = flatEntries.reduce((acc, row) => acc + row.studentCount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full print:p-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">Data Submission</span>
            <h1 className="text-3xl font-black mt-2">Exam Strength List</h1>
            <p className="text-blue-200 text-xs font-semibold mt-1">View student counts grouped by date and session slots for exams</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm flex items-center gap-2 border border-white/20 shadow-lg transition-all"
          >
            <Printer size={18} /> Generate Report
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalRegisteredStudents}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Scheduled Exams</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{activeExamsCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtered Candidates</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalStudentsInFiltered}</h3>
          </div>
        </div>
      </div>

      {/* Filters (Report Generation) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 print:hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <h2 className="text-lg font-black text-slate-800">Report Generation</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Report Type</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold cursor-pointer"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="Normal Strength List">Normal Strength List</option>
              <option value="Practical Strength List">Practical Strength List</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Search Subject / Standard</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search code, name, dept..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center space-y-2 mb-6">
        <h2 className="text-2xl font-extrabold uppercase">College ERP System</h2>
        <h3 className="text-base font-bold text-slate-600 uppercase">Registered Student Strength List Statement for Examination</h3>
        <p className="text-xs text-slate-500">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 print:px-0">
          <h3 className="text-base font-extrabold text-slate-800">Strength List Preview</h3>
          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
            Groups: {Object.keys(groupedData).length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm print:text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest print:bg-slate-100">
                <th className="px-6 py-4 w-16">S.No</th>
                <th className="px-6 py-4">Exam Name</th>
                <th className="px-6 py-4">Standard</th>
                <th className="px-6 py-4">Sub Code</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4 text-center w-36">Student Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 print:divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">Loading strength list data...</td>
                </tr>
              ) : Object.keys(groupedData).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">No exam strength data matching criteria</td>
                </tr>
              ) : (
                Object.entries(groupedData).map(([groupKey, groupEntries]) => {
                  const groupTotal = groupEntries.reduce((sum, item) => sum + item.studentCount, 0);
                  
                  return (
                    <React.Fragment key={groupKey}>
                      {/* Date & Session Group Header Row */}
                      <tr className="bg-slate-100/50 font-bold text-slate-800">
                        <td colSpan={6} className="px-6 py-3 font-extrabold text-sm border-y border-slate-200/60 text-slate-900">
                          {groupKey}
                        </td>
                      </tr>
                      {/* Group Rows */}
                      {groupEntries.map((row, index) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-500 font-medium">{index + 1}</td>
                          <td className="px-6 py-4 text-slate-700 font-semibold">{row.examName}</td>
                          <td className="px-6 py-4 text-indigo-700 font-extrabold">{row.standard}</td>
                          <td className="px-6 py-4 font-mono font-bold text-xs text-slate-600">{row.subjectCode}</td>
                          <td className="px-6 py-4 text-slate-800 font-medium">{row.subjectName}</td>
                          <td className="px-6 py-4 text-center font-extrabold text-slate-900 text-base">{row.studentCount}</td>
                        </tr>
                      ))}
                      {/* Group Total Row */}
                      <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200">
                        <td colSpan={5} className="px-6 py-3 text-right text-xs uppercase tracking-wider text-slate-500 font-black">
                          Total Candidates
                        </td>
                        <td className="px-6 py-3 text-center text-base font-black text-slate-900 bg-slate-100/40">
                          {groupTotal}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StrengthList;
