import React, { useState } from 'react';
import { Plus, Search, DollarSign, X, Check, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../../hooks/useMasterData';

const SEED = [
  { id: 'app-5001', name: 'Naveen Kumar', parentName: 'Gopal K', phone: '9888123456', amount: 500, payMode: 'Cash', date: '23 May 2026', issuedBy: 'admin' },
  { id: 'app-5002', name: 'Divya S', parentName: 'Sundar R', phone: '9777123456', amount: 500, payMode: 'UPI', date: '22 May 2026', issuedBy: 'admin' }
];

const ApplicationIssue = () => {
  const { records: issues, addRecord } = useMasterData('application_issue', SEED);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', parentName: '', phone: '', amount: 500, payMode: 'Cash' });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.parentName) { toast.error('Candidate details are required'); return; }
    const entry = { ...form, date: '23 May 2026', issuedBy: 'admin' };
    const res = await addRecord(entry);
    if (res.success) {
      toast.success('Prospectus Application Issued!');
      setShowModal(false);
      setForm({ name: '', parentName: '', phone: '', amount: 500, payMode: 'Cash' });
    }
  };

  const filtered = issues.filter(x => (x.name || '').toLowerCase().includes(search.toLowerCase()) || (x.phone || '').includes(search));

  if (showModal) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setShowModal(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm"
          >
            ← Back to List
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-slide-in">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between animate-fade-in">
            <h3 className="text-lg font-black text-slate-800">Issue Application Form</h3>
            <button onClick={() => { setShowModal(false); }} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Candidate Full Name *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Candidate name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Father / Guardian Name *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  placeholder="Father's name" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Phone Number *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  placeholder="Mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Prospectus Price (₹)</label>
                  <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Payment Mode</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    value={form.payMode} onChange={e => setForm({ ...form, payMode: e.target.value })}><option>Cash</option><option>UPI</option><option>Card</option></select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setShowModal(false); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm shadow-md">Issue Prospectus</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">Application Module</span>
            <h1 className="text-3xl font-black mt-2">Application Prospectus Sale</h1>
            <p className="text-violet-200 text-xs font-semibold mt-1">Record fee sales and assign official prospectus application numbers</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Plus size={18} /> Issue Application
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 text-slate-400" size={15} />
            <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Search issued prospectus..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {['App No', 'Date', 'Candidate Name', 'Parent Name', 'Phone', 'Amount Paid', 'Mode'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(x => (
                <tr key={x.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4"><span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl text-xs">{x.id}</span></td>
                  <td className="px-5 py-4 text-xs font-bold text-slate-400 font-mono">{x.date}</td>
                  <td className="px-5 py-4 font-black text-slate-800">{x.name}</td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">{x.parentName}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 font-bold font-mono">{x.phone}</td>
                  <td className="px-5 py-4 font-black text-slate-900">₹{x.amount}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">{x.payMode}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-slate-400 font-bold">No applications issued</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationIssue;
