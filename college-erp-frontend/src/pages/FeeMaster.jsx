import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import { confirmDelete } from '../utils/confirmToast';

const SEED = [
  { id: 'fm1', feeType: 'Tuition Fee', year: 'I', dept: 'Computer Science', amount: 85000, dueDate: '2026-06-30', term: 'Annual', active: true },
  { id: 'fm2', feeType: 'Tuition Fee', year: 'II', dept: 'Computer Science', amount: 85000, dueDate: '2026-06-30', term: 'Annual', active: true },
  { id: 'fm3', feeType: 'Transport Fee', year: 'ALL', dept: 'ALL', amount: 18000, dueDate: '2026-06-15', term: 'Annual', active: true },
  { id: 'fm4', feeType: 'Library Deposit', year: 'I', dept: 'ALL', amount: 2000, dueDate: '2026-07-01', term: 'One-time', active: true },
  { id: 'fm5', feeType: 'Hostel Fee', year: 'ALL', dept: 'ALL', amount: 45000, dueDate: '2026-06-30', term: 'Annual', active: true },
];
const FEE_TYPES = ['Tuition Fee', 'Transport Fee', 'Library Deposit', 'Hostel Fee', 'Lab Fee', 'Exam Fee', 'Development Fee', 'Miscellaneous'];
const YEARS = ['I', 'II', 'III', 'IV', 'ALL'];
const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'ALL'];

const FeeMaster = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useMasterData('fee_master', SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ feeType: 'Tuition Fee', year: 'I', dept: 'ALL', amount: 0, dueDate: '', term: 'Annual', active: true });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.dueDate) { toast.error('Amount and due date required'); return; }

    const res = editing
      ? await updateRecord(editing.id, form)
      : await addRecord(form);

    if (res.success) {
      toast.success(editing ? 'Fee structure updated!' : 'Fee structure added!');
      setShowModal(false);
      setEditing(null);
    } else {
      toast.error('Operation failed');
    }
  };
  const del = async (id) => {
    confirmDelete(async () => {
      const res = await deleteRecord(id);
      if (res.success) toast.success('Deleted');
      else toast.error('Failed to delete');
    }, 'Are you sure you want to delete this fee structure record?');
  };
  const openEdit = r => { setEditing(r); setForm({ feeType: r.feeType, year: r.year, dept: r.dept, amount: r.amount, dueDate: r.dueDate, term: r.term, active: r.active }); setShowModal(true); };
  const total = records.filter(r => r.active).reduce((s, r) => s + Number(r.amount), 0);

  if (showModal) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setShowModal(false); setEditing(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm"
          >
            ← Back to List
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-slide-in">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Fee Structure' : 'Add Fee Structure'}</h3>
            <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Fee Type</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.feeType} onChange={e => setForm({ ...form, feeType: e.target.value })}>{FEE_TYPES.map(f => <option key={f}>{f}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Year</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>{YEARS.map(y => <option key={y}>{y}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Department</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Amount (₹)</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Due Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Term</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })}><option>Annual</option><option>Semester</option><option>One-time</option><option>Monthly</option></select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">Others Master</span>
            <h1 className="text-3xl font-black mt-2">Fee Master</h1>
            <p className="text-emerald-300 text-xs font-semibold mt-1">Configure fee structures, due dates and payment terms</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center">
              <p className="text-[10px] font-black uppercase text-emerald-300">Total Fee Load</p>
              <p className="text-2xl font-black">₹{total.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => { setEditing(null); setForm({ feeType: 'Tuition Fee', year: 'I', dept: 'ALL', amount: 0, dueDate: '', term: 'Annual', active: true }); setShowModal(true); }}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2"><Plus size={18} /> Add Fee</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{['Fee Type', 'Year', 'Department', 'Amount', 'Due Date', 'Term', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4 font-bold text-slate-800">{r.feeType}</td>
                  <td className="px-5 py-4"><span className="font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">Year {r.year}</span></td>
                  <td className="px-5 py-4 text-slate-600 text-xs font-semibold">{r.dept}</td>
                  <td className="px-5 py-4"><span className="font-black text-emerald-700 text-base">₹{Number(r.amount).toLocaleString('en-IN')}</span></td>
                  <td className="px-5 py-4 text-slate-600 font-semibold text-xs">{r.dueDate}</td>
                  <td className="px-5 py-4"><span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{r.term}</span></td>
                  <td className="px-5 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{r.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100"><button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 size={14} /></button><button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default FeeMaster;
