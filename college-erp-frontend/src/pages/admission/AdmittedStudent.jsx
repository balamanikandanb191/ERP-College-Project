import React, { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, GraduationCap, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useMasterData } from '../../hooks/useMasterData';
import { confirmDelete } from '../../utils/confirmToast';

const AdmittedStudent = () => {
  const { records: registered, updateRecord, deleteRecord } = useMasterData('student_register');
  const [search, setSearch] = useState('');

  const handleApprove = async (student) => {
    try {
      // 1. Generate active enrolled Register Number
      const regNo = `REG2026${Math.floor(1000 + Math.random() * 9000)}`;
      
      // 2. Add to active students list on the backend database
      const newStudent = {
        fullName: `${student.firstName} ${student.lastName}`,
        registerNumber: regNo,
        email: student.email || `${student.firstName.toLowerCase()}-${Date.now().toString().slice(-4)}@college.edu`,
        phone: student.phone,
        gender: student.gender,
        dob: student.dob,
        bloodGroup: student.bloodGroup,
        department: student.interestedCourse || 'Computer Science',
        semester: 'Semester 1',
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        address: student.address
      };
      
      await api.post('/students', newStudent);

      // 3. Update the registration status to "Admitted"
      const entry = { ...student, status: 'Admitted', registerNumber: regNo };
      const res = await updateRecord(student.id, entry);

      if (res.success) {
        toast.success(`Student admitted! Roll Number: ${regNo}`);
      }
    } catch (err) {
      toast.error('Admit error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    confirmDelete(async () => {
      const res = await deleteRecord(id);
      if (res.success) {
        toast.success('Registration rejected and removed.');
      }
    }, 'Are you sure you want to reject this registration form?');
  };

  const filtered = (registered || []).filter(r => (r.firstName || '').toLowerCase().includes(search.toLowerCase()) || (r.registerNumber && r.registerNumber.includes(search)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Application Module</span>
          <h1 className="text-3xl font-black mt-2">Admitted Student Queue</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Review pending matriculations and promote candidates to enrolled student lists</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 text-slate-400" size={15} />
            <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search registration queue..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-xs text-slate-400 font-bold">Pending Review: {registered.filter(r => r.status === 'Pending Review').length}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">App/Reg No</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Qualifying Education</th>
                <th className="px-5 py-4">Course Applied</th>
                <th className="px-5 py-4">Quota</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Approve / Enroll</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{r.registerNumber || r.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-800">{r.firstName} {r.lastName}</div>
                    <div className="text-[11px] text-slate-400">{r.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-600 font-semibold">{r.prevSchool}</div>
                    <div className="text-[11px] text-slate-400 font-bold font-mono">Score: {r.prevMarks} ({r.prevBoard})</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700 text-xs">{r.interestedCourse}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-500">{r.quota}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${r.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {r.status === 'Pending Review' ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleReject(r.id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors" title="Reject"><X size={15} /></button>
                        <button onClick={() => handleApprove(r)} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/10 transition-colors">
                          <Check size={14} /> Approve & Enroll
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold flex items-center justify-end gap-1"><GraduationCap size={15} /> Fully Enrolled</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-slate-400 font-bold">No admitted student logs or registrations found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmittedStudent;
