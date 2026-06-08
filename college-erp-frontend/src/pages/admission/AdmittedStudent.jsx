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
      // 1. Resolve active enrolled Register Number
      const regNo = student.registerNumber && student.registerNumber.trim() !== ''
        ? student.registerNumber.trim()
        : `REG2026${Math.floor(1000 + Math.random() * 9000)}`;
      
      // 2. Add to active students list on the backend database mapping all registration details
      const newStudent = {
        fullName: student.studentName || `${student.firstName} ${student.lastName}`,
        registerNumber: regNo,
        email: student.email || `${(student.firstName || 'student').toLowerCase()}-${Date.now().toString().slice(-4)}@college.edu`,
        phone: student.phone || student.fatherPhone || student.motherPhone || '',
        gender: student.gender,
        dob: student.dob,
        bloodGroup: student.bloodGroup,
        department: student.course || student.interestedCourse || 'Computer Science',
        course: student.course || student.interestedCourse || 'Computer Science',
        semester: student.semester || 'Semester 1',
        section: student.section || 'A',
        fatherName: student.fatherName || student.parentName,
        fatherPhone: student.fatherPhone || student.parentPhone,
        fatherOccupation: student.fatherOccupation,
        fatherIncome: student.fatherIncome,
        motherName: student.motherName,
        motherPhone: student.motherPhone,
        motherOccupation: student.motherOccupation,
        guardianName: student.guardianName,
        emergencyContact: student.guardianPhone || student.emergencyContact,
        parentAddress: student.parentAddress || student.permanentAddress || student.address,
        permanentAddress: student.permanentAddress || student.address,
        communicationAddress: student.currentAddress || student.address,
        nationality: student.nationality || 'Indian',
        religion: student.religion,
        community: student.community,
        caste: student.caste,
        aadhaarNumber: student.aadharNumber,
        photoUrl: student.photoUrl,
        previousInstitution: student.tenthSchool || student.prevSchool,
        percentage10th: student.tenthScore ? parseFloat(student.tenthScore) : (student.prevMarks ? parseFloat(student.prevMarks) : null),
        percentage12th: student.twelfthScore ? parseFloat(student.twelfthScore) : null,
        academicYear: student.academicYear,
        admissionType: student.admissionType || 'Regular',
        admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
        hostelRequired: student.hostelRequired === 'Yes' || student.hostelRequired === true ? 1 : 0,
        busRequired: student.transportRequired === 'Yes' || student.transportRequired === true ? 1 : 0,
        busRoute: student.busRoute || '',
        pickupPoint: student.pickupPoint || '',
        admissionStatus: student.admissionStatus || 'Verified'
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

  const filtered = (registered || []).filter(r => 
    (r.studentName || `${r.firstName} ${r.lastName}`).toLowerCase().includes(search.toLowerCase()) || 
    (r.registerNumber && r.registerNumber.includes(search))
  );

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
                  <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{r.applicationNo || r.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-800">{r.studentName || `${r.firstName} ${r.lastName}`}</div>
                    <div className="text-[11px] text-slate-400">{r.phone || r.fatherPhone || r.motherPhone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-600 font-semibold">{r.tenthSchool || r.prevSchool}</div>
                    <div className="text-[11px] text-slate-400 font-bold font-mono">Score: {r.tenthScore || r.prevMarks} ({r.tenthBoard || r.prevBoard})</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700 text-xs">{r.course || r.interestedCourse}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-500">{r.admissionType || r.quota}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${r.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {r.status || 'Pending Review'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {r.status === 'Pending Review' || !r.status ? (
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
