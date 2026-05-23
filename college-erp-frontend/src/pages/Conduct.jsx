import React, { useState } from 'react';
import { Printer, ShieldAlert, BadgeCheck } from 'lucide-react';

const Conduct = () => {
  const [studentName, setStudentName] = useState('Rahul Krishnan');
  const [parentName, setParentName] = useState('Krishnan Swamy');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [conductRating, setConductRating] = useState('Excellent');
  const [period, setPeriod] = useState('2022 - 2026');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:m-0">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Certificates Module</span>
            <h1 className="text-3xl font-black mt-2">Conduct & Character Certificate</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Render official character testimonials certifying excellent and good behavior records</p>
          </div>
          <button onClick={() => window.print()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Printer size={18} /> Print Conduct Slip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Input parameters */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4 print:hidden">
          <h3 className="font-black text-slate-800 text-base">Certificate Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={studentName} onChange={e => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={parentName} onChange={e => setParentName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Course Department</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Study Period</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={period} onChange={e => setPeriod(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Conduct Character</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={conductRating} onChange={e => setConductRating(e.target.value)}><option>Excellent</option><option>Good</option><option>Satisfactory</option></select>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border-8 border-double border-slate-800 shadow-md p-12 max-w-2xl mx-auto space-y-8 relative overflow-hidden print:border-slate-800 print:shadow-none">
            {/* Logo and Head */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">National Institute of Technology & Science</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Affiliated to State Board | AICTE Approved</p>
              <h3 className="text-xs font-black text-slate-700 bg-slate-100 inline-block px-4 py-1 rounded-full uppercase tracking-wider mt-2">Conduct & Character Certificate</h3>
            </div>

            {/* Testimonial body */}
            <div className="text-center space-y-6">
              <p className="text-sm font-semibold text-slate-750 leading-loose max-w-lg mx-auto">
                This is to certify that <strong className="text-slate-900 block text-lg font-black uppercase underline my-1">{studentName}</strong> 
                Son / Daughter of Shri <strong className="text-slate-900">{parentName}</strong>, 
                was a student of this institution in the department of <strong className="text-slate-900 block my-1 font-black">{department}</strong> 
                during the academic session <strong className="text-slate-900 font-bold">{period}</strong>.
              </p>
              <p className="text-sm font-semibold text-slate-750 leading-loose max-w-lg mx-auto">
                To the best of our knowledge, his/her character and conduct during the residency period in this college was 
                <strong className="text-emerald-700 block text-lg font-black uppercase tracking-wide mt-2"><BadgeCheck size={20} className="inline-block mr-1 align-middle" />{conductRating}</strong>.
              </p>
            </div>

            {/* Date and seal signature */}
            <div className="flex justify-between pt-16 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <div>Date Issued: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-center w-36 border-t border-slate-350 pt-1 text-slate-700">Principal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conduct;
