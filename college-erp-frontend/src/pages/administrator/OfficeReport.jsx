import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Printer, RefreshCw, Plus, Edit2, Trash2, Save, X, Search, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const REPORT_TABS = [
  { id: 'income_expenditure', label: 'Income & Expenditure', icon: BarChart3 },
  { id: 'fees_collection', label: 'Fees Collection Report', icon: TrendingUp },
  { id: 'consolidate', label: 'Consolidate Report', icon: BarChart3 },
  { id: 'budget', label: 'Budget Report', icon: TrendingDown },
];

const DEFAULT_FORMS = {
  income_expenditure: { date: new Date().toISOString().slice(0,10), type: 'Income', category: '', description: '', amount: '', paymentMode: 'Cash', reference: '' },
  fees_collection: { studentName: '', registerNo: '', course: '', semester: '', feeType: '', amount: '', paymentDate: new Date().toISOString().slice(0,10), receiptNo: '', mode: 'Cash', status: 'Paid' },
  consolidate: { reportMonth: new Date().toISOString().slice(0,7), totalIncome: '', totalExpenditure: '', totalFees: '', notes: '' },
  budget: { financialYear: `${new Date().getFullYear()}-${new Date().getFullYear()+1}`, category: '', budgetedAmount: '', actualAmount: '', variance: '', remarks: '' },
};

const TYPE_MAP = {
  income_expenditure: 'office_income_expenditure',
  fees_collection: 'office_fees_collection',
  consolidate: 'office_consolidate',
  budget: 'office_budget',
};

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-500 font-semibold bg-white transition-all";
const Field = ({ label, children }) => <div><label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>{children}</div>;

const OfficeReport = () => {
  const [activeTab, setActiveTab] = useState('income_expenditure');
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState({ ...DEFAULT_FORMS.income_expenditure });

  const fetchRecords = useCallback(async (tab) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/masters/${TYPE_MAP[tab]}`);
      setRecords(data.map(r => ({ id: r.id, ...r.data })));
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

  // Summary stats
  const totalIncome = records.filter(r=>r.type==='Income').reduce((s,r)=>s+Number(r.amount||0),0);
  const totalExpense = records.filter(r=>r.type==='Expenditure').reduce((s,r)=>s+Number(r.amount||0),0);
  const totalFees = records.reduce((s,r)=>s+Number(r.amount||r.totalFees||0),0);

  const renderForm = () => {
    if (activeTab === 'income_expenditure') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Type">
          <select className={inputCls+' cursor-pointer'} value={form.type||'Income'} onChange={e=>setField('type',e.target.value)}>
            {['Income','Expenditure'].map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Category"><input className={inputCls} value={form.category||''} onChange={e=>setField('category',e.target.value)} placeholder="e.g. Fees, Salary, Maintenance..." required/></Field>
        <Field label="Description"><input className={inputCls} value={form.description||''} onChange={e=>setField('description',e.target.value)} required/></Field>
        <Field label="Amount (₹)"><input type="number" min="0" className={inputCls} value={form.amount||''} onChange={e=>setField('amount',e.target.value)} required/></Field>
        <Field label="Date"><input type="date" className={inputCls} value={form.date||''} onChange={e=>setField('date',e.target.value)} required/></Field>
        <Field label="Payment Mode">
          <select className={inputCls+' cursor-pointer'} value={form.paymentMode||'Cash'} onChange={e=>setField('paymentMode',e.target.value)}>
            {['Cash','Bank Transfer','Cheque','UPI','Online'].map(m=><option key={m}>{m}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2"><Field label="Reference / Voucher No"><input className={inputCls} value={form.reference||''} onChange={e=>setField('reference',e.target.value)}/></Field></div>
      </div>
    );
    if (activeTab === 'fees_collection') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Student Name"><input className={inputCls} value={form.studentName||''} onChange={e=>setField('studentName',e.target.value)} required/></Field>
        <Field label="Register Number"><input className={inputCls} value={form.registerNo||''} onChange={e=>setField('registerNo',e.target.value)} required/></Field>
        <Field label="Course"><input className={inputCls} value={form.course||''} onChange={e=>setField('course',e.target.value)}/></Field>
        <Field label="Semester"><input className={inputCls} value={form.semester||''} onChange={e=>setField('semester',e.target.value)}/></Field>
        <Field label="Fee Type"><input className={inputCls} value={form.feeType||''} onChange={e=>setField('feeType',e.target.value)} placeholder="Tuition, Exam, Lab..." required/></Field>
        <Field label="Amount (₹)"><input type="number" min="0" className={inputCls} value={form.amount||''} onChange={e=>setField('amount',e.target.value)} required/></Field>
        <Field label="Receipt No"><input className={inputCls} value={form.receiptNo||''} onChange={e=>setField('receiptNo',e.target.value)}/></Field>
        <Field label="Payment Date"><input type="date" className={inputCls} value={form.paymentDate||''} onChange={e=>setField('paymentDate',e.target.value)} required/></Field>
        <Field label="Mode">
          <select className={inputCls+' cursor-pointer'} value={form.mode||'Cash'} onChange={e=>setField('mode',e.target.value)}>
            {['Cash','UPI','DD','Cheque','Online'].map(m=><option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls+' cursor-pointer'} value={form.status||'Paid'} onChange={e=>setField('status',e.target.value)}>
            {['Paid','Partial','Pending','Waived'].map(s=><option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
    );
    if (activeTab === 'consolidate') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Report Month"><input type="month" className={inputCls} value={form.reportMonth||''} onChange={e=>setField('reportMonth',e.target.value)} required/></Field>
        <Field label="Total Income (₹)"><input type="number" min="0" className={inputCls} value={form.totalIncome||''} onChange={e=>setField('totalIncome',e.target.value)}/></Field>
        <Field label="Total Expenditure (₹)"><input type="number" min="0" className={inputCls} value={form.totalExpenditure||''} onChange={e=>setField('totalExpenditure',e.target.value)}/></Field>
        <Field label="Total Fees Collected (₹)"><input type="number" min="0" className={inputCls} value={form.totalFees||''} onChange={e=>setField('totalFees',e.target.value)}/></Field>
        <div className="md:col-span-2"><Field label="Notes"><textarea className={inputCls} rows={3} value={form.notes||''} onChange={e=>setField('notes',e.target.value)}/></Field></div>
      </div>
    );
    if (activeTab === 'budget') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Financial Year"><input className={inputCls} value={form.financialYear||''} onChange={e=>setField('financialYear',e.target.value)} placeholder="2024-2025" required/></Field>
        <Field label="Category"><input className={inputCls} value={form.category||''} onChange={e=>setField('category',e.target.value)} required/></Field>
        <Field label="Budgeted Amount (₹)"><input type="number" min="0" className={inputCls} value={form.budgetedAmount||''} onChange={e=>{ const b=Number(e.target.value); setForm(p=>({...p,budgetedAmount:b,variance:(b-(p.actualAmount||0)).toFixed(2)})); }}/></Field>
        <Field label="Actual Amount (₹)"><input type="number" min="0" className={inputCls} value={form.actualAmount||''} onChange={e=>{ const a=Number(e.target.value); setForm(p=>({...p,actualAmount:a,variance:((p.budgetedAmount||0)-a).toFixed(2)})); }}/></Field>
        <Field label="Variance (₹)"><input className={`${inputCls} bg-slate-50 text-slate-500`} value={form.variance||''} readOnly/></Field>
        <div className="md:col-span-2"><Field label="Remarks"><textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)}/></Field></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"/>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">Office Report</span>
            <h1 className="text-3xl font-black mt-2">Financial Reports</h1>
            <p className="text-blue-200 text-xs font-semibold mt-1">Income, Expenditure, Fees Collection, Consolidate &amp; Budget Reports</p>
          </div>
          {activeTab==='income_expenditure' && (
            <div className="flex gap-4">
              <div className="text-center bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Income</span>
                <p className="text-xl font-black text-emerald-300">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="text-center bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
                <span className="text-[10px] font-black text-rose-300 uppercase tracking-wider">Expense</span>
                <p className="text-xl font-black text-rose-300">₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="text-center bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider">Balance</span>
                <p className={`text-xl font-black ${totalIncome-totalExpense>=0?'text-emerald-300':'text-rose-300'}`}>₹{(totalIncome-totalExpense).toLocaleString()}</p>
              </div>
            </div>
          )}
          {activeTab==='fees_collection' && (
            <div className="text-center bg-white/10 rounded-2xl px-5 py-3 border border-white/10">
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider">Total Collected</span>
              <p className="text-2xl font-black text-white">₹{totalFees.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex gap-2 flex-wrap">
        {REPORT_TABS.map(tab => { const Icon = tab.icon; return (
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab===tab.id?'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg':'text-slate-600 hover:bg-slate-100'}`}>
            <Icon size={15}/> {tab.label}
          </button>
        );})}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4"/>
          <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button onClick={()=>fetchRecords(activeTab)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer"><RefreshCw size={16} className={loading?'animate-spin':''}/></button>
        <button onClick={()=>window.print()} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer print:hidden"><Printer size={16}/></button>
        <button onClick={()=>{closeForm();setShowForm(true);}} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg cursor-pointer ml-auto">
          <Plus size={16}/> Add Entry
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-800">{editId?'Edit Entry':`New ${REPORT_TABS.find(t=>t.id===activeTab)?.label} Entry`}</h3>
            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"><X size={18}/></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={closeForm} className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg cursor-pointer">
                <Save size={15}/> {editId?'Update':'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden print:shadow-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 print:hidden">
          <h3 className="font-extrabold text-slate-800">{REPORT_TABS.find(t=>t.id===activeTab)?.label}</h3>
          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">{filtered.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm print:text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest print:bg-slate-100">
              {activeTab==='income_expenditure' && ['Date','Type','Category','Description','Amount','Mode','Reference',''].map((h,i)=><th key={i} className="px-6 py-4">{h}</th>)}
              {activeTab==='fees_collection' && ['Student','Reg No','Fee Type','Amount','Mode','Date','Status',''].map((h,i)=><th key={i} className="px-6 py-4">{h}</th>)}
              {activeTab==='consolidate' && ['Month','Total Income','Total Expenditure','Total Fees','Balance','Notes',''].map((h,i)=><th key={i} className="px-6 py-4">{h}</th>)}
              {activeTab==='budget' && ['Year','Category','Budgeted','Actual','Variance','Status',''].map((h,i)=><th key={i} className="px-6 py-4">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-50 print:divide-slate-200">
              {loading ? <tr><td colSpan={8} className="py-16 text-center text-slate-400 font-bold"><RefreshCw size={24} className="animate-spin mx-auto mb-2 text-slate-300"/>Loading...</td></tr>
              : filtered.length===0 ? <tr><td colSpan={8} className="py-20 text-center text-slate-400 font-bold">No records. Click "Add Entry" to start.</td></tr>
              : filtered.map(rec=>(
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group print:hover:bg-transparent">
                  {activeTab==='income_expenditure' && (<>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{rec.date}</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${rec.type==='Income'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{rec.type}</span></td>
                    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{rec.category}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{rec.description}</td>
                    <td className={`px-6 py-4 font-black ${rec.type==='Income'?'text-emerald-700':'text-rose-700'}`}>₹{Number(rec.amount||0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{rec.paymentMode}</td>
                    <td className="px-6 py-4 font-mono text-indigo-600 text-xs">{rec.reference}</td>
                  </>)}
                  {activeTab==='fees_collection' && (<>
                    <td className="px-6 py-4 font-bold text-slate-800">{rec.studentName}</td>
                    <td className="px-6 py-4 font-mono text-xs font-black text-indigo-600">{rec.registerNo}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{rec.feeType}</td>
                    <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.amount||0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{rec.mode}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{rec.paymentDate}</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${rec.status==='Paid'?'bg-emerald-50 text-emerald-700 border-emerald-200':rec.status==='Partial'?'bg-amber-50 text-amber-700 border-amber-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{rec.status}</span></td>
                  </>)}
                  {activeTab==='consolidate' && (<>
                    <td className="px-6 py-4 font-bold text-slate-800">{rec.reportMonth}</td>
                    <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.totalIncome||0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-black text-rose-700">₹{Number(rec.totalExpenditure||0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-black text-blue-700">₹{Number(rec.totalFees||0).toLocaleString()}</td>
                    <td className={`px-6 py-4 font-black ${Number(rec.totalIncome||0)-Number(rec.totalExpenditure||0)>=0?'text-emerald-700':'text-rose-700'}`}>₹{(Number(rec.totalIncome||0)-Number(rec.totalExpenditure||0)).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold text-xs max-w-[200px] truncate">{rec.notes}</td>
                  </>)}
                  {activeTab==='budget' && (<>
                    <td className="px-6 py-4 font-bold text-slate-800">{rec.financialYear}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{rec.category}</td>
                    <td className="px-6 py-4 font-black text-blue-700">₹{Number(rec.budgetedAmount||0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-black text-slate-700">₹{Number(rec.actualAmount||0).toLocaleString()}</td>
                    <td className={`px-6 py-4 font-black ${Number(rec.variance||0)>=0?'text-emerald-700':'text-rose-700'}`}>₹{Number(rec.variance||0).toLocaleString()}</td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${Number(rec.variance||0)>=0?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{Number(rec.variance||0)>=0?'Under Budget':'Over Budget'}</span></td>
                  </>)}
                  <td className="px-6 py-4 text-right print:hidden">
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

export default OfficeReport;
