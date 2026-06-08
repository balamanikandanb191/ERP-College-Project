import React from 'react';
import { TrendingUp } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const defaultForm = {
  studentName: '', registerNo: '', course: '', semester: '',
  feeType: '', amount: '', paymentDate: new Date().toISOString().slice(0,10),
  receiptNo: '', mode: 'Cash', status: 'Paid',
};

const statusColor = (s) => ({
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Partial: 'bg-amber-50 text-amber-700 border-amber-200',
  Pending: 'bg-rose-50 text-rose-700 border-rose-200',
  Waived: 'bg-slate-100 text-slate-500 border-slate-200',
}[s] || 'bg-slate-100 text-slate-500 border-slate-200');

const config = {
  apiType: 'office_fees_collection',
  title: 'Fees Collection Report',
  subtitle: 'View and manage all fee collection records by student and date',
  badge: 'Administrator › Office Report',
  gradient: 'bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900',
  accentFrom: 'from-green-600',
  accentTo: 'to-emerald-600',
  defaultForm,
  Icon: TrendingUp,
  summaryLabel: 'Total Fees Collected',
  summaryValue: (records) => `₹${records.filter(r=>r.status==='Paid').reduce((s,r)=>s+Number(r.amount||0),0).toLocaleString()}`,
  headers: ['Student', 'Reg No', 'Fee Type', 'Amount', 'Receipt No', 'Date', 'Mode', 'Status'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-bold text-slate-800">{rec.studentName}</td>
    <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">{rec.registerNo}</td>
    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{rec.feeType}</td>
    <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.amount||0).toLocaleString()}</td>
    <td className="px-6 py-4 font-mono text-xs text-slate-400">{rec.receiptNo}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.paymentDate}</td>
    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.mode}</td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusColor(rec.status)}`}>{rec.status}</span>
    </td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Student Name"><input className={inputCls} value={form.studentName||''} onChange={e=>setField('studentName',e.target.value)} required /></Field>
      <Field label="Register Number"><input className={inputCls} value={form.registerNo||''} onChange={e=>setField('registerNo',e.target.value)} required /></Field>
      <Field label="Course"><input className={inputCls} value={form.course||''} onChange={e=>setField('course',e.target.value)} /></Field>
      <Field label="Semester"><input className={inputCls} value={form.semester||''} onChange={e=>setField('semester',e.target.value)} /></Field>
      <Field label="Fee Type"><input className={inputCls} value={form.feeType||''} onChange={e=>setField('feeType',e.target.value)} placeholder="Tuition, Exam, Lab..." required /></Field>
      <Field label="Amount (₹)"><input type="number" min="0" className={inputCls} value={form.amount||''} onChange={e=>setField('amount',e.target.value)} required /></Field>
      <Field label="Receipt Number"><input className={inputCls} value={form.receiptNo||''} onChange={e=>setField('receiptNo',e.target.value)} /></Field>
      <Field label="Payment Date"><input type="date" className={inputCls} value={form.paymentDate||''} onChange={e=>setField('paymentDate',e.target.value)} required /></Field>
      <Field label="Mode">
        <select className={selectCls} value={form.mode||'Cash'} onChange={e=>setField('mode',e.target.value)}>
          {['Cash','UPI','DD','Cheque','Online'].map(m => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select className={selectCls} value={form.status||'Paid'} onChange={e=>setField('status',e.target.value)}>
          {['Paid','Partial','Pending','Waived'].map(s => <option key={s}>{s}</option>)}
        </select>
      </Field>
    </div>
  ),
};

const FeesCollectionReport = () => <AdminEntryPage config={config} />;
export default FeesCollectionReport;
