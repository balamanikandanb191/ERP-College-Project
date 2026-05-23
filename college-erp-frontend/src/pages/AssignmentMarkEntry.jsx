import React, { useState } from 'react';
import { Search, Save, Award, ChevronDown, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED_STUDENTS = [
  { id: 'stud-1', registerNumber: 'REG20261102', studentName: 'Vikas Krishnan', marks: '18', status: 'Present' },
  { id: 'stud-2', registerNumber: 'REG20268841', studentName: 'Shreya Roy', marks: '15', status: 'Present' },
  { id: 'stud-3', registerNumber: 'REG20265201', studentName: 'Ravi Kumar', marks: '8', status: 'Present' },
  { id: 'stud-4', registerNumber: 'REG20269931', studentName: 'Preethi S', marks: '19', status: 'Present' },
  { id: 'stud-5', registerNumber: 'REG20267744', studentName: 'Aditya Sen', marks: '', status: 'Absent' }
];

const SUBJECTS = [
  'CS304 - Software Engineering',
  'CS302 - Database Management Systems',
  'CS306 - Computer Networks',
  'CS308 - Theory of Computation'
];

const AssignmentMarkEntry = () => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [maxMarks, setMaxMarks] = useState(20);
  const { records: students, updateRecord } = useMasterData('assignment_marks', SEED_STUDENTS);

  const handleMarkChange = async (id, val) => {
    if (Number(val) > maxMarks) {
      toast.error(`Marks cannot exceed maximum mark of ${maxMarks}`);
      return;
    }
    const student = students.find(s => s.id === id);
    if (student) {
      const entry = { ...student, marks: val, status: val === '' ? 'Absent' : 'Present' };
      await updateRecord(id, entry);
    }
  };

  const toggleStatus = async (id) => {
    const student = students.find(s => s.id === id);
    if (student) {
      const entry = { ...student, status: student.status === 'Present' ? 'Absent' : 'Present', marks: student.status === 'Present' ? '' : '0' };
      await updateRecord(id, entry);
    }
  };

  const handleSaveAll = () => {
    toast.success('Assignment marks saved and published to student portals!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Assessment Scoring</span>
            <h1 className="text-3xl font-black mt-2">Assignment Mark Entry</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Register marks, continuous evaluation scores, and log candidate attendance logs</p>
          </div>
          <button onClick={handleSaveAll}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Save size={18} /> Publish Marks
          </button>
        </div>
      </div>

      {/* Selectors Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Select Subject</label>
          <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECTS.map(sub => <option key={sub}>{sub}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Maximum Marks</label>
          <input type="number" className="w-24 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none font-bold text-center"
            value={maxMarks} onChange={e => setMaxMarks(Number(e.target.value))} />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">Roll Number</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right w-40">Obtained Marks / {maxMarks}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => {
                const markVal = Number(s.marks);
                const isFail = s.status === 'Present' && s.marks !== '' && markVal < (maxMarks * 0.4);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{s.registerNumber}</td>
                    <td className="px-5 py-4 font-black text-slate-800">{s.studentName}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleStatus(s.id)}
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${s.status === 'Absent' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {s.status}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isFail && <span className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} /> Fail Alert</span>}
                        <input type="number" className={`w-20 border rounded-xl px-3 py-1.5 text-sm focus:outline-none text-right font-bold font-mono ${s.status === 'Absent' ? 'bg-slate-100 border-slate-200 text-slate-400' : isFail ? 'border-rose-350 text-rose-700 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}
                          disabled={s.status === 'Absent'} placeholder="-" value={s.marks} onChange={e => handleMarkChange(s.id, e.target.value)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentMarkEntry;
