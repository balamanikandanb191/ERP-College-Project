import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Receipt, ShoppingCart, Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

// ── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'student_fees', label: 'Student Fees Entry', icon: Receipt },
  { id: 'purchase_entry', label: 'Purchase Entry', icon: ShoppingCart },
  { id: 'asset_entry', label: 'Asset Entry', icon: Package },
];

const TYPE_MAP = {
  student_fees: 'office_student_fees',
  purchase_entry: 'office_purchase_entry',
  asset_entry: 'office_asset_entry',
};

const DEFAULT_FORMS = {
  student_fees: { studentName: '', registerNo: '', course: '', semester: '', feeType: '', amount: '', paymentMode: 'Cash', date: new Date().toISOString().slice(0,10), remarks: '' },
  purchase_entry: { vendorName: '', item: '', quantity: 1, unitPrice: '', totalAmount: '', invoiceNo: '', purchaseDate: new Date().toISOString().slice(0,10), category: 'Stationery', paidBy: 'Cash', remarks: '' },
  asset_entry: { assetName: '', category: 'Furniture', purchaseDate: new Date().toISOString().slice(0,10), purchasePrice: '', supplier: '', location: '', condition: 'Good', serialNo: '', remarks: '' },
};

const PURCHASE_CATEGORIES = ['Stationery', 'Electronics', 'Furniture', 'Lab Equipment', 'Sports', 'Cleaning', 'Other'];
const ASSET_CATEGORIES = ['Furniture', 'Electronics', 'Laboratory', 'Vehicle', 'Building', 'Computer', 'Sports', 'Other'];
const FEE_TYPES = ['Tuition Fee', 'Exam Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Bus Fee', 'Hostel Fee', 'Late Fine', 'Other'];

// ── Shared Field Component ───────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-500 font-semibold bg-white transition-all";
const selectCls = `${inputCls} cursor-pointer`;

// ── Main Component ────────────────────────────────────────────────────────────
const AdminOffice = () => {
  const [activeTab, setActiveTab] = useState('student_fees');
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [search, setSearch]       = useState('');
  const [form, setForm]           = useState({ ...DEFAULT_FORMS.student_fees });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchRecords = useCallback(async (tab) => {
    const type = TYPE_MAP[tab];
    try {
      setLoading(true);
      const { data } = await api.get(`/masters/${type}`);
      const list = data.map(r => ({ id: r.id, ...r.data }));
      setRecords(list);
      localStorage.setItem(`erp_${type}`, JSON.stringify(list));
    } catch {
      const cached = localStorage.getItem(`erp_${type}`);
      setRecords(cached ? JSON.parse(cached) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setRecords([]);
    setShowForm(false);
    setEditId(null);
    setSearch('');
    setForm({ ...DEFAULT_FORMS[activeTab] });
    fetchRecords(activeTab);
  }, [activeTab, fetchRecords]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const type = TYPE_MAP[activeTab];
    try {
      if (editId) {
        await api.put(`/masters/${type}/${editId}`, { data: form });
        toast.success('Record updated successfully!');
      } else {
        await api.post(`/masters/${type}`, { data: { ...form, createdAt: new Date().toISOString() } });
        toast.success('Record saved successfully!');
      }
      closeForm();
      fetchRecords(activeTab);
    } catch {
      // Offline fallback
      const id = editId || `local-${Date.now()}`;
      const updated = editId
        ? records.map(r => r.id === editId ? { ...form, id } : r)
        : [{ ...form, id, createdAt: new Date().toISOString() }, ...records];
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      toast('Saved locally (offline mode)', { icon: '⚠️' });
      closeForm();
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    confirmDelete(async () => {
      const type = TYPE_MAP[activeTab];
      try { await api.delete(`/masters/${type}/${id}`); } catch { /* ignore */ }
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      toast.success('Record deleted.');
    });
  };

  const openEdit = (rec) => {
    setEditId(rec.id);
    const { id, ...rest } = rec;
    setForm(rest);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => { setShowForm(false); setEditId(null); setForm({ ...DEFAULT_FORMS[activeTab] }); };

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = records.filter(r =>
    !search || Object.values(r).some(v => v && String(v).toLowerCase().includes(search.toLowerCase()))
  );

  // ── Tab-specific form ──────────────────────────────────────────────────────
  const renderForm = () => {
    if (activeTab === 'student_fees') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Student Name"><input className={inputCls} value={form.studentName||''} onChange={e=>setField('studentName',e.target.value)} required /></Field>
        <Field label="Register Number"><input className={inputCls} value={form.registerNo||''} onChange={e=>setField('registerNo',e.target.value)} required /></Field>
        <Field label="Course"><input className={inputCls} value={form.course||''} onChange={e=>setField('course',e.target.value)} /></Field>
        <Field label="Semester"><input className={inputCls} value={form.semester||''} onChange={e=>setField('semester',e.target.value)} /></Field>
        <Field label="Fee Type">
          <select className={selectCls} value={form.feeType||''} onChange={e=>setField('feeType',e.target.value)} required>
            <option value="">-- Select --</option>{FEE_TYPES.map(f=><option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Amount (₹)"><input type="number" min="0" className={inputCls} value={form.amount||''} onChange={e=>setField('amount',e.target.value)} required /></Field>
        <Field label="Payment Mode">
          <select className={selectCls} value={form.paymentMode||'Cash'} onChange={e=>setField('paymentMode',e.target.value)}>
            {['Cash','UPI','DD','Cheque','Online'].map(m=><option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Date"><input type="date" className={inputCls} value={form.date||''} onChange={e=>setField('date',e.target.value)} required /></Field>
        <div className="md:col-span-2"><Field label="Remarks">
          <textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} />
        </Field></div>
      </div>
    );

    if (activeTab === 'purchase_entry') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Vendor Name"><input className={inputCls} value={form.vendorName||''} onChange={e=>setField('vendorName',e.target.value)} required /></Field>
        <Field label="Item Description"><input className={inputCls} value={form.item||''} onChange={e=>setField('item',e.target.value)} required /></Field>
        <Field label="Invoice Number"><input className={inputCls} value={form.invoiceNo||''} onChange={e=>setField('invoiceNo',e.target.value)} /></Field>
        <Field label="Category">
          <select className={selectCls} value={form.category||'Stationery'} onChange={e=>setField('category',e.target.value)}>
            {PURCHASE_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Quantity">
          <input type="number" min="1" className={inputCls} value={form.quantity||1}
            onChange={e=>{ const q=Number(e.target.value); setForm(p=>({...p,quantity:q,totalAmount:(q*(p.unitPrice||0)).toFixed(2)})); }} required />
        </Field>
        <Field label="Unit Price (₹)">
          <input type="number" min="0" className={inputCls} value={form.unitPrice||''}
            onChange={e=>{ const u=Number(e.target.value); setForm(p=>({...p,unitPrice:u,totalAmount:((p.quantity||1)*u).toFixed(2)})); }} required />
        </Field>
        <Field label="Total Amount (₹)">
          <input className={`${inputCls} bg-slate-50 text-slate-500`} value={form.totalAmount||''} readOnly />
        </Field>
        <Field label="Purchase Date"><input type="date" className={inputCls} value={form.purchaseDate||''} onChange={e=>setField('purchaseDate',e.target.value)} required /></Field>
        <Field label="Paid By">
          <select className={selectCls} value={form.paidBy||'Cash'} onChange={e=>setField('paidBy',e.target.value)}>
            {['Cash','Cheque','Bank Transfer','Online'].map(m=><option key={m}>{m}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2"><Field label="Remarks">
          <textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} />
        </Field></div>
      </div>
    );

    if (activeTab === 'asset_entry') return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Asset Name"><input className={inputCls} value={form.assetName||''} onChange={e=>setField('assetName',e.target.value)} required /></Field>
        <Field label="Serial / ID Number"><input className={inputCls} value={form.serialNo||''} onChange={e=>setField('serialNo',e.target.value)} /></Field>
        <Field label="Supplier Name"><input className={inputCls} value={form.supplier||''} onChange={e=>setField('supplier',e.target.value)} /></Field>
        <Field label="Location / Room"><input className={inputCls} value={form.location||''} onChange={e=>setField('location',e.target.value)} /></Field>
        <Field label="Category">
          <select className={selectCls} value={form.category||'Furniture'} onChange={e=>setField('category',e.target.value)}>
            {ASSET_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Condition">
          <select className={selectCls} value={form.condition||'Good'} onChange={e=>setField('condition',e.target.value)}>
            {['Good','Fair','Poor','Under Repair','Disposed'].map(c=><option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Purchase Price (₹)"><input type="number" min="0" className={inputCls} value={form.purchasePrice||''} onChange={e=>setField('purchasePrice',e.target.value)} /></Field>
        <Field label="Purchase Date"><input type="date" className={inputCls} value={form.purchaseDate||''} onChange={e=>setField('purchaseDate',e.target.value)} /></Field>
        <div className="md:col-span-2"><Field label="Remarks">
          <textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} />
        </Field></div>
      </div>
    );
  };

  // ── Table columns per tab ──────────────────────────────────────────────────
  const renderHeaders = () => {
    if (activeTab === 'student_fees')  return ['Student','Reg No','Fee Type','Amount','Mode','Date',''];
    if (activeTab === 'purchase_entry') return ['Vendor','Item','Category','Qty','Total (₹)','Date',''];
    if (activeTab === 'asset_entry')   return ['Asset','Category','Location','Condition','Price (₹)','Date',''];
    return [];
  };

  const conditionColor = (c) => ({
    Good:'bg-emerald-50 text-emerald-700 border-emerald-200',
    Fair:'bg-amber-50 text-amber-700 border-amber-200',
    Poor:'bg-rose-50 text-rose-700 border-rose-200',
    'Under Repair':'bg-orange-50 text-orange-700 border-orange-200',
    Disposed:'bg-slate-100 text-slate-500 border-slate-200',
  }[c] || 'bg-slate-100 text-slate-500 border-slate-200');

  const renderRow = (rec) => {
    if (activeTab === 'student_fees') return (<>
      <td className="px-6 py-4 font-bold text-slate-800">{rec.studentName}</td>
      <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">{rec.registerNo}</td>
      <td className="px-6 py-4"><span className="bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-black px-2 py-0.5 rounded-full">{rec.feeType}</span></td>
      <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.amount||0).toLocaleString()}</td>
      <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.paymentMode}</td>
      <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.date}</td>
    </>);
    if (activeTab === 'purchase_entry') return (<>
      <td className="px-6 py-4 font-bold text-slate-800">{rec.vendorName}</td>
      <td className="px-6 py-4 font-semibold text-slate-700">{rec.item}</td>
      <td className="px-6 py-4"><span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full">{rec.category}</span></td>
      <td className="px-6 py-4 font-bold text-slate-700">{rec.quantity}</td>
      <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.totalAmount||0).toLocaleString()}</td>
      <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.purchaseDate}</td>
    </>);
    if (activeTab === 'asset_entry') return (<>
      <td className="px-6 py-4 font-bold text-slate-800">{rec.assetName}</td>
      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black px-2 py-0.5 rounded-full">{rec.category}</span></td>
      <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.location}</td>
      <td className="px-6 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${conditionColor(rec.condition)}`}>{rec.condition}</span></td>
      <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.purchasePrice||0).toLocaleString()}</td>
      <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.purchaseDate}</td>
    </>);
  };

  // ── Total summary ──────────────────────────────────────────────────────────
  const totalAmount = records.reduce((s,r)=>s+Number(r.amount||r.totalAmount||r.purchasePrice||0),0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">Administrator</span>
            <h1 className="text-3xl font-black mt-2">Office Management</h1>
            <p className="text-violet-200 text-xs font-semibold mt-1">Manage student fees, purchases &amp; institutional assets</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-violet-300 uppercase tracking-wider">Total ({TABS.find(t=>t.id===activeTab)?.label})</span>
            <p className="text-2xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex gap-2 flex-wrap">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
          <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="text-xs font-bold text-slate-400">{filtered.length} of {records.length}</span>
        <button onClick={() => fetchRecords(activeTab)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer" title="Refresh">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
        <button onClick={() => { closeForm(); setShowForm(true); }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-800">{editId ? 'Edit Record' : `New ${TABS.find(t=>t.id===activeTab)?.label}`}</h3>
            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={closeForm} className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl cursor-pointer">
                <Save size={15} /> {editId ? 'Update Record' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">{TABS.find(t=>t.id===activeTab)?.label} — Records</h3>
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">{filtered.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {renderHeaders().map((h,i)=>(
                  <th key={i} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center text-slate-400 font-bold">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-slate-300" />
                  Loading records...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-slate-400 font-bold">
                  <Package size={40} className="mx-auto mb-3 text-slate-200" />
                  No records found. Click "Add New" to get started.
                </td></tr>
              ) : filtered.map(rec => (
                <tr key={rec.id} className="hover:bg-indigo-50/30 transition-colors group">
                  {renderRow(rec)}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(rec)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(rec.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer" title="Delete"><Trash2 size={14} /></button>
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
export default AdminOffice;
