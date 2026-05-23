import React, { useState } from 'react';
import { Save, User, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const StudentRegister = () => {
  const { addRecord } = useMasterData('student_register');
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: 'Male', dob: '',
    email: '', phone: '', address: '', parentName: '', parentPhone: '',
    prevSchool: '', prevBoard: 'HSC', prevMarks: '', prevYear: '2026',
    interestedCourse: 'Computer Science', bloodGroup: 'O+', quota: 'General'
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) {
      toast.error('First Name, Last Name and Phone Number are required fields.');
      return;
    }

    try {
      const newReg = {
        ...form,
        regDate: new Date().toLocaleDateString('en-IN'),
        status: 'Pending Review'
      };
      
      const res = await addRecord(newReg);
      if (res.success) {
        toast.success('Registration Form Submitted Successfully!');
        setForm({
          firstName: '', lastName: '', gender: 'Male', dob: '',
          email: '', phone: '', address: '', parentName: '', parentPhone: '',
          prevSchool: '', prevBoard: 'HSC', prevMarks: '', prevYear: '2026',
          interestedCourse: 'Computer Science', bloodGroup: 'O+', quota: 'General'
        });
      }
    } catch (err) {
      toast.error('Failed to submit form: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Application Module</span>
          <h1 className="text-3xl font-black mt-2">New Student Registration</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Submit full academic, secondary school matriculation and candidate detail forms</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <User size={16} className="text-indigo-500" /> Personal Particulars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">First Name *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="John" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Last Name *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Doe" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Gender</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Date of Birth</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Blood Group</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="O+" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Quota / Category</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })}><option>General</option><option>Management</option><option>Sports Quota</option><option>Government</option></select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText size={16} className="text-indigo-500" /> Contact Details & Family
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Email Address</label>
              <input type="email" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="john.doe@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Phone Number *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent / Guardian Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="Robert Doe" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent Contact Number</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="9123456789" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Correspondence Address</label>
              <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none h-16"
                placeholder="Street address, city, pin code..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Prior Academic Record */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 size={16} className="text-indigo-500" /> Secondary / Qualifying Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Previous Institution Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="Higher Secondary School" value={form.prevSchool} onChange={e => setForm({ ...form, prevSchool: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Board of Study</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={form.prevBoard} onChange={e => setForm({ ...form, prevBoard: e.target.value })}><option>HSC</option><option>CBSE</option><option>ICSE</option><option>Other</option></select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Qualifying Score (%) *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="85%" value={form.prevMarks} onChange={e => setForm({ ...form, prevMarks: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Interested Engineering Major</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={form.interestedCourse} onChange={e => setForm({ ...form, interestedCourse: e.target.value })}>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics</option>
                <option>Mechanical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit"
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/10 transition-colors">
            <Save size={16} /> Submit Registration Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegister;
