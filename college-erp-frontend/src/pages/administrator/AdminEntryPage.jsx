/**
 * Shared CRUD base used by all Administrator sub-pages.
 * Pass in `config` to customize the page for any data type.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

export const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-500 font-semibold bg-white transition-all";
export const selectCls = `${inputCls} cursor-pointer`;

export const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
    {children}
  </div>
);

/**
 * config = {
 *   apiType:    string   // master record type key
 *   title:      string   // page heading
 *   subtitle:   string   // page sub-heading
 *   badge:      string   // small badge label
 *   gradient:   string   // tailwind gradient classes for header
 *   accentFrom: string   // button gradient from color
 *   accentTo:   string   // button gradient to color
 *   defaultForm: object  // blank form shape
 *   renderForm: (form, setField) => JSX   // form body renderer
 *   headers:    string[] // table column headers
 *   renderRow:  (rec)  => JSX             // table row cells renderer
 *   Icon:       component                 // lucide icon for empty state
 *   summaryLabel?: string                 // optional summary label
 *   summaryValue?: (records) => string    // optional computed summary
 * }
 */
const AdminEntryPage = ({ config }) => {
  const {
    apiType, title, subtitle, badge, gradient,
    accentFrom, accentTo,
    defaultForm, renderForm, headers, renderRow,
    Icon, summaryLabel, summaryValue,
  } = config;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [search, setSearch]   = useState('');
  const [form, setForm]       = useState({ ...defaultForm });

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/masters/${apiType}`);
      const list = data.map(r => ({ id: r.id, ...r.data }));
      setRecords(list);
      localStorage.setItem(`erp_${apiType}`, JSON.stringify(list));
    } catch {
      const cached = localStorage.getItem(`erp_${apiType}`);
      setRecords(cached ? JSON.parse(cached) : []);
    } finally { setLoading(false); }
  }, [apiType]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ ...defaultForm });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/masters/${apiType}/${editId}`, { data: form });
        toast.success('Record updated!');
      } else {
        await api.post(`/masters/${apiType}`, { data: { ...form, createdAt: new Date().toISOString() } });
        toast.success('Record saved!');
      }
      closeForm();
      fetchRecords();
    } catch {
      // Offline fallback
      const id = editId || `local-${Date.now()}`;
      const updated = editId
        ? records.map(r => r.id === editId ? { ...form, id } : r)
        : [{ ...form, id, createdAt: new Date().toISOString() }, ...records];
      setRecords(updated);
      localStorage.setItem(`erp_${apiType}`, JSON.stringify(updated));
      toast('Saved locally (offline)', { icon: '⚠️' });
      closeForm();
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try { await api.delete(`/masters/${apiType}/${id}`); } catch {}
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem(`erp_${apiType}`, JSON.stringify(updated));
      toast.success('Deleted.');
    });
  };

  const openEdit = (rec) => {
    setEditId(rec.id);
    const { id, ...rest } = rec;
    setForm(rest);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = records.filter(r =>
    !search || Object.values(r).some(v => v && String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={`${gradient} text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/20">{badge}</span>
            <h1 className="text-3xl font-black mt-2">{title}</h1>
            <p className="text-white/70 text-xs font-semibold mt-1">{subtitle}</p>
          </div>
          {summaryLabel && summaryValue && (
            <div className="text-right bg-white/10 rounded-2xl px-6 py-3 border border-white/10">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-wider block">{summaryLabel}</span>
              <p className="text-2xl font-black text-white">{summaryValue(records)}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="Search records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs font-bold text-slate-400">{filtered.length} of {records.length}</span>
        <button
          onClick={fetchRecords}
          className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
        <button
          onClick={() => { closeForm(); setShowForm(true); }}
          className={`px-5 py-2.5 bg-gradient-to-r ${accentFrom} ${accentTo} text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:shadow-xl ml-auto`}
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-800">{editId ? 'Edit Record' : `New ${title}`}</h3>
            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer transition-colors">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm(form, setField)}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 bg-gradient-to-r ${accentFrom} ${accentTo} text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg cursor-pointer`}
              >
                <Save size={15} /> {editId ? 'Update' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">{title} — Records</h3>
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
            {filtered.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {headers.map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={headers.length + 1} className="py-16 text-center text-slate-400 font-bold">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-slate-300" />
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="py-20 text-center text-slate-400 font-bold">
                    {Icon && <Icon size={40} className="mx-auto mb-3 text-slate-200" />}
                    No records found. Click "Add New" to get started.
                  </td>
                </tr>
              ) : filtered.map(rec => (
                <tr key={rec.id} className="hover:bg-indigo-50/20 transition-colors group">
                  {renderRow(rec)}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(rec)}
                        className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
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

export default AdminEntryPage;
