import React, { useState, useEffect } from 'react';
import { Award, Printer, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CourseCompletion = () => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [studentName, setStudentName] = useState('Anjali Nair');
  const [course, setCourse] = useState('Bachelor of Engineering in Electronics & Communication');
  const [duration, setDuration] = useState('2022 - 2026');
  const [grade, setGrade] = useState('First Class with Distinction');
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
            <h1 className="text-3xl font-black mt-2">Course Completion Certificate</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Output official completion certificates featuring major stream and final grades</p>
          </div>
          <button onClick={() => window.print()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Printer size={18} /> Print Certificate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Editor */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4 print:hidden">
          <h3 className="font-black text-slate-800 text-base">Certificate Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Select Student (Register No)</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white font-semibold text-slate-700"
                value={registerNumber}
                onChange={e => {
                  const rNum = e.target.value;
                  setRegisterNumber(rNum);
                  const student = students.find(s => s.registerNumber === rNum);
                  if (student) {
                    setStudentName(student.fullName);
                    setCourse(student.course || student.department || '');
                    setDuration(student.academicYear || '2022 - 2026');
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
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={studentName} onChange={e => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Degree Program</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={course} onChange={e => setCourse(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Study Period</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Award Grade</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={grade} onChange={e => setGrade(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border-8 border-double border-indigo-900 shadow-lg p-12 max-w-2xl mx-auto space-y-8 relative overflow-hidden print:border-slate-800 print:shadow-none">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/5 rounded-full" />
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full" />

            <div className="text-center space-y-2 pb-6 border-b border-indigo-100 print:border-slate-800">
              <div className="bg-indigo-100 text-indigo-850 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"><Award size={24} /></div>
              <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">National Institute of Technology & Science</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">State University Board | AICTE Approved</p>
            </div>

            <div className="text-center space-y-6">
              <h3 className="text-xl font-bold italic font-serif text-slate-800">Course Completion Certificate</h3>
              <p className="text-sm font-semibold text-slate-650 leading-loose max-w-lg mx-auto">
                This is to officially certify that <strong className="text-slate-900 block text-lg font-black uppercase underline my-2">{studentName}</strong> 
                {registerNumber && <span>bearing Register Number <strong className="font-mono text-indigo-900">{registerNumber}</strong> </span>}
                has successfully completed the qualifying program for the degree of 
                <strong className="text-slate-900 block my-2 font-black">{course}</strong>
                having pursued studies over the academic period of <strong className="text-slate-900 font-bold">{duration}</strong> and passed with the final classification of 
                <strong className="text-indigo-800 block text-sm font-black mt-2">{grade}</strong>.
              </p>
            </div>

            <div className="flex justify-between pt-12 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <div>Date Issued: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-center w-36 border-t border-slate-350 pt-1 text-slate-700">Dean Academics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCompletion;
