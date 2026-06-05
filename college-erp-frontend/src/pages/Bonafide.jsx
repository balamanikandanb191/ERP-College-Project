import React, { useState, useEffect } from 'react';
import { Printer, FileText, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Bonafide = () => {
  const [studentName, setStudentName] = useState('Rahul Krishnan');
  const [parentName, setParentName] = useState('Krishnan Swamy');
  const [rollNo, setRollNo] = useState('REG20261102');
  const [yearSemester, setYearSemester] = useState('2nd Year / 4th Semester');
  const [purpose, setPurpose] = useState('applying for State Government Scholarship');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/students');
        if (data) {
          setStudents(data);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:m-0">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Certificates Module</span>
            <h1 className="text-3xl font-black mt-2">Bonafide Certificate</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Output official bonafide letters confirming active student status for visas and scholarships</p>
          </div>
          <button onClick={() => window.print()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Printer size={18} /> Print Bonafide
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Editor */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4 print:hidden">
          <h3 className="font-black text-slate-800 text-base">Bonafide Particulars</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-555 uppercase block mb-1">Select Student (Register No)</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white font-semibold text-slate-700"
                value={rollNo}
                onChange={e => {
                  const rNum = e.target.value;
                  setRollNo(rNum);
                  const student = students.find(s => s.registerNumber === rNum);
                  if (student) {
                    setStudentName(student.fullName);
                    setParentName(student.fatherName || student.motherName || '');
                    setYearSemester(`${student.academicYear || ''}${student.semester ? ' / ' + student.semester : ''}`.trim() || '2nd Year / 4th Semester');
                    toast.success(`Autofilled details for ${student.fullName}`);
                  }
                }}
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.registerNumber}>
                    {s.registerNumber} - {s.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-550 uppercase block mb-1">Student Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={studentName} onChange={e => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-550 uppercase block mb-1">Roll / Register Number</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={rollNo} onChange={e => setRollNo(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-550 uppercase block mb-1">Parent Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={parentName} onChange={e => setParentName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-550 uppercase block mb-1">Year / Semester</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={yearSemester} onChange={e => setYearSemester(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-550 uppercase block mb-1">Purpose of Certificate</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={purpose} onChange={e => setPurpose(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Certificate rendering */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border-8 border-double border-indigo-950 shadow-md p-12 max-w-2xl mx-auto space-y-8 relative overflow-hidden print:border-slate-800 print:shadow-none">
            {/* Letterhead */}
            <div className="text-center space-y-2 border-b-2 border-slate-850 pb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">National Institute of Technology & Science</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Affiliated to State University | AICTE Approved</p>
              <h3 className="text-xs font-black text-slate-700 bg-slate-100 inline-block px-4 py-1 rounded-full uppercase tracking-wider mt-2">Bonafide Certificate</h3>
            </div>

            {/* Content body */}
            <div className="space-y-6 text-sm text-slate-750 font-semibold leading-loose text-center">
              <p className="max-w-lg mx-auto">
                This is to officially certify that <strong className="text-slate-950 block text-lg font-black uppercase underline my-2">{studentName}</strong> 
                bearing Roll Number <strong className="text-indigo-700 font-mono font-black">{rollNo}</strong>, Son / Daughter of Shri <strong className="text-slate-900">{parentName}</strong>, 
                is a bonafide student of this college studying in <strong className="text-slate-900 font-bold">{yearSemester}</strong>.
              </p>
              <p className="max-w-lg mx-auto">
                This certificate is issued to him/her for the purpose of <strong className="text-slate-900 font-black italic">{purpose}</strong>.
              </p>
            </div>

            {/* Seal footer */}
            <div className="flex justify-between pt-16 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <div>Date Issued: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-center w-36 border-t border-slate-350 pt-1 text-slate-700 font-bold">Principal Office</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bonafide;
