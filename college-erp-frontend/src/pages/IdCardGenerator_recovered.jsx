import React, { useState } from 'react';
import { CreditCard, Printer, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const IdCardGenerator = () => {
  const [name, setName] = useState('John Doe');
  const [rollNo, setRollNo] = useState('REG20261102');
  const [department, setDepartment] = useState('Computer Science');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('9876543210');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:m-0">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">ID Card Generator</span>
            <h1 className="text-3xl font-black mt-2">Student ID Card Generator</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Configure student badge cards featuring barcodes, blood groups, and registrar seals</p>
          </div>
          <button onClick={() => window.print()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Printer size={18} /> Print ID Badge
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Editor */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4 print:hidden">
          <h3 className="font-black text-slate-800 text-base">Badge Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Roll Number</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={rollNo} onChange={e => setRollNo(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Department</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Blood Group</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Phone Number</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Badge Card preview */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-[320px] h-[500px] bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between items-center text-center overflow-hidden border border-indigo-800">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />

            {/* Header */}
            <div className="space-y-1 z-10">
              <h2 className="text-sm font-black tracking-wide uppercase">NITS UNIVERSITY</h2>
              <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Student Identity Card</p>
            </div>

            {/* Photo Avatar */}
            <div className="relative z-10 w-28 h-28 bg-white/10 rounded-full border-4 border-indigo-500/20 flex items-center justify-center overflow-hidden shadow-inner mt-4">
              <User size={64} className="text-indigo-200" />
            </div>

            {/* Student metadata */}
            <div className="space-y-1.5 z-10 mt-4">
              <h3 className="text-lg font-black tracking-tight uppercase text-white">{name}</h3>
              <p className="text-xs font-black text-indigo-300 uppercase tracking-wider">{department}</p>
              <div className="text-[11px] font-bold text-slate-350 space-y-0.5">
                <div>Roll No: <span className="font-mono text-white font-black">{rollNo}</span></div>
                <div>Blood Group: <span className="text-white font-black">{bloodGroup}</span></div>
                <div>Phone: <span className="font-mono text-white font-black">{phone}</span></div>
              </div>
            </div>

            {/* Mock Barcode */}
            <div className="w-full bg-white px-4 py-2 rounded-xl border border-slate-200/20 z-10 mt-4">
              <div className="h-8 bg-slate-900 flex items-center justify-around overflow-hidden rounded-md opacity-90 px-2">
                {[...Array(24)].map((_, i) => (
                  <span key={i} className="bg-white h-full" style={{ width: `${Math.random() > 0.5 ? 2 : 4}px` }} />
                ))}
              </div>
              <p className="text-[8px] font-mono font-black text-slate-800 tracking-widest mt-1">*{rollNo}*</p>
            </div>

            <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-4">
              Registrar seal & signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCardGenerator;
