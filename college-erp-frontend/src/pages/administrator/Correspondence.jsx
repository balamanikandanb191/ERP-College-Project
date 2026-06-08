import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Send, Inbox, RefreshCw, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const TABS = [
  { id: 'send', label: 'Send Letter', icon: Send },
  { id: 'receive', label: 'Receive Letter', icon: Inbox },
];

const DEFAULT_FORMS = {
  send: { toName: '', toDesignation: '', subject: '', content: '', date: new Date().toISOString().slice(0,10), letterNo: '', priority: 'Normal', sentBy: '', mode: 'Physical' },
  receive: { fromName: '', fromOrganization: '', subject: '', content: '', receivedDate: new Date().toISOString().slice(0,10), refNo: '', priority: 'Normal', actionRequired: 'No' },
};

const TYPE_MAP = { send: 'office_send_letter', receive: 'office_receive_letter' };
const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-500 font-semibold bg-white transition-all";
const Field = ({ label, children }) => (
  <div><label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>{children}</div>
);

const Correspondence = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState({ ...DEFAULT_FORMS.send });

  const fetchRecords = useCallback(async (tab) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/masters/${TYPE_MAP[tab]}`);
      const list = data.map(r => ({ id: r.id, ...r.data }));
      setRecords(list);
    } catch {
      const cached = localStorage.getItem(`erp_${TYPE_MAP[tab]}`);
      setRecords(cached ? JSON.parse(cached) : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setRecords([]); setShowForm(false); setEditId(null); setSearch('');
    setForm({ ...DEFAULT_FORMS[activeTab] });
    fetchRecords(activeTab);
  }, [activeTab, fetchRecords]);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const closeForm = () => { setShowForm(false); setEditId(null); setForm({ ...DEFAULT_FORMS[activeTab] }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const type = TYPE_MAP[activeTab];
    try {
      if (editId) await api.put(`/masters/${type}/${editId}`, { data: form });
      else await api.post(`/masters/${type}`, { data: { ...form, createdAt: new Date().toISOString() } });
      toast.success(editId ? 'Updated!' : 'Saved!');
      closeForm(); fetchRecords(activeTab);
    } catch {
      toast('Saved locally', { icon: '⚠️' });
      closeForm();
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try { await api.delete(`/masters/${TYPE_MAP[activeTab]}/${id}`); } catch {}
      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success('Deleted.');
    });
  };

  const openEdit = (rec) => { setEditId(rec.id); const { id, ...rest } = rec; setForm(rest); setShowForm(true); };
  const filtered = records.filter(r => !search || Object.values(r).some(v => v && String(v).toLowerCase().includes(search.toLowerCase())));
  const priorityColor = (p) => ({ High:'bg-rose-50 text-rose-700 border-rose-200', Urgent:'bg-orange-50 text-orange-700 border-orange-200' }[p] || 'bg-slate-100 text-slate-600 border-slate-200');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">Administrator</span>
          <h1 className="text-3xl font-black mt-2">Office Correspondence</h1>
          <p className="text-teal-200 text-xs font-semibold mt-1">Track all sent and received letters, circulars and official communications</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex gap-2">
        {TABS.map(tab => { const Icon = tab.icon; return (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab===tab.id?'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg':'text-slate-600 hover:bg-slate-100'}`}>
            <Icon size={15}/> {tab.label}
          </button>
        );})}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4"/>
          <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" placeholder="Search letters..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button onClick={()=>fetchRecords(activeTab)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer"><RefreshCw size={16} className={loading?'animate-spin':''}/></button>
        <button onClick={()=>{closeForm();setShowForm(true);}} className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg cursor-pointer ml-auto">
          <Plus size={16}/> New Letter
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-800">{editId ? 'Edit Letter' : activeTab==='send' ? 'New Send Letter' : 'New Received Letter'}</h3>
            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit}>
            {activeTab === 'send' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Field label="To (Name)"><input className={inputCls} value={form.toName||''} onChange={e=>setField('toName',e.target.value)} required/></Field>
                <Field label="Designation"><input className={inputCls} value={form.toDesignation||''} onChange={e=>setField('toDesignation',e.target.value)}/></Field>
                <Field label="Letter Number"><input className={inputCls} value={form.letterNo||''} onChange={e=>setField('letterNo',e.target.value)}/></Field>
                <Field label="Date"><input type="date" className={inputCls} value={form.date||''} onChange={e=>setField('date',e.target.value)} required/></Field>
                <Field label="Subject"><input className={inputCls} value={form.subject||''} onChange={e=>setField('subject',e.target.value)} required/></Field>
                <Field label="Sent By"><input className={inputCls} value={form.sentBy||''} onChange={e=>setField('sentBy',e.target.value)}/></Field>
                <Field label="Mode">
                  <select className={inputCls+' cursor-pointer'} value={form.mode||'Physical'} onChange={e=>setField('mode',e.target.value)}>
                    {['Physical','Email','Courier','Registered Post'].map(m=><option key={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Priority">
                  <select className={inputCls+' cursor-pointer'} value={form.priority||'Normal'} onChange={e=>setField('priority',e.target.value)}>
                    {['Normal','High','Urgent'].map(p=><option key={p}>{p}</option>)}
                  </select>
                </Field>
                <div className="md:col-span-2"><Field label="Content"><textarea className={inputCls} rows={5} value={form.content||''} onChange={e=>setField('content',e.target.value)}/></Field></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Field label="From (Name)"><input className={inputCls} value={form.fromName||''} onChange={e=>setField('fromName',e.target.value)} required/></Field>
                <Field label="Organization"><input className={inputCls} value={form.fromOrganization||''} onChange={e=>setField('fromOrganization',e.target.value)}/></Field>
                <Field label="Subject"><input className={inputCls} value={form.subject||''} onChange={e=>setField('subject',e.target.value)} required/></Field>
                <Field label="Ref Number"><input className={inputCls} value={form.refNo||''} onChange={e=>setField('refNo',e.target.value)}/></Field>
                <Field label="Received Date"><input type="date" className={inputCls} value={form.receivedDate||''} onChange={e=>setField('receivedDate',e.target.value)} required/></Field>
                <Field label="Priority">
                  <select className={inputCls+' cursor-pointer'} value={form.priority||'Normal'} onChange={e=>setField('priority',e.target.value)}>
                    {['Normal','High','Urgent'].map(p=><option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Action Required">
                  <select className={inputCls+' cursor-pointer'} value={form.actionRequired||'No'} onChange={e=>setField('actionRequired',e.target.value)}>
                    {['No','Yes - Pending','Yes - Completed'].map(a=><option key={a}>{a}</option>)}
                  </select>
                </Field>
                <div className="md:col-span-2"><Field label="Content"><textarea className={inputCls} rows={4} value={form.content||''} onChange={e=>setField('content',e.target.value)}/></Field></div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={closeForm} className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg cursor-pointer">
                <Save size={15}/> {editId?'Update':'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">{activeTab==='send'?'Sent':'Received'} Letters</h3>
          <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {activeTab==='send'
                ? ['To','Subject','Letter No','Date','Mode','Priority',''].map((h,i)=><th key={i} className="px-6 py-4">{h}</th>)
                : ['From','Organization','Subject','Ref No','Date','Priority','Action',''].map((h,i)=><th key={i} className="px-6 py-4">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? <tr><td colSpan={8} className="py-16 text-center text-slate-400 font-bold"><RefreshCw size={24} className="animate-spin mx-auto mb-2 text-slate-300"/>Loading...</td></tr>
              : filtered.length===0 ? <tr><td colSpan={8} className="py-20 text-center text-slate-400 font-bold"><MailOpen size={40} className="mx-auto mb-3 text-slate-200"/>No letters found.</td></tr>
              : filtered.map(rec=>(
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                  {activeTab==='send' ? (<>
                    <td className="px-6 py-4 font-bold text-slate-800">{rec.toName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 max-w-[180px] truncate">{rec.subject}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{rec.letterNo}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{rec.date}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold text-xs">{rec.mode}</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${priorityColor(rec.priority)}`}>{rec.priority}</span></td>
                  </>) : (<>
                    <td className="px-6 py-4 font-bold text-slate-800">{rec.fromName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.fromOrganization}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 max-w-[160px] truncate">{rec.subject}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{rec.refNo}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{rec.receivedDate}</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${priorityColor(rec.priority)}`}>{rec.priority}</span></td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${rec.actionRequired==='No'?'bg-slate-100 text-slate-500 border-slate-200':rec.actionRequired?.includes('Completed')?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>{rec.actionRequired}</span></td>
                  </>)}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>openEdit(rec)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"><Edit2 size={14}/></button>
                      <button onClick={()=>handleDelete(rec.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Correspondence;
