import React from 'react';
import { Receipt } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const FEE_TYPES = ['Tuition Fee', 'Exam Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Bus Fee', 'Hostel Fee', 'Late Fine', 'Other'];

const defaultForm = {
  studentName: '', registerNo: '', course: '', semester: '', section: '',
  feeType: '', amount: '', paymentMode: 'Cash',
  date: new Date().toISOString().slice(0,10), receiptNo: '', remarks: '',
};

const config = {
  apiType: 'office_student_fees',
  title: 'Student Fees Entry',
  subtitle: 'Record and track all student fee payments',
  badge: 'Administrator › Office',
  gradient: 'bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900',
  accentFrom: 'from-violet-600',
  accentTo: 'to-indigo-600',
  defaultForm,
  Icon: Receipt,
  summaryLabel: 'Total Collected',
  summaryValue: (records) => `₹${records.reduce((s, r) => s + Number(r.amount || 0), 0).toLocaleString()}`,
  headers: ['Student Name', 'Reg No', 'Course/Sem', 'Fee Type', 'Amount', 'Mode', 'Date', 'Receipt No'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-bold text-slate-800">{rec.studentName}</td>
    <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">{rec.registerNo}</td>
    <td className="px-6 py-4 text-slate-600 font-semibold text-xs">{rec.course} {rec.semester && `· Sem ${rec.semester}`}</td>
    <td className="px-6 py-4">
      <span className="bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-black px-2 py-0.5 rounded-full">{rec.feeType}</span>
    </td>
    <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.amount || 0).toLocaleString()}</td>
    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.paymentMode}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.date}</td>
    <td className="px-6 py-4 font-mono text-xs text-slate-400">{rec.receiptNo}</td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Student Name"><input className={inputCls} value={form.studentName||''} onChange={e=>setField('studentName',e.target.value)} required /></Field>
      <Field label="Register Number"><input className={inputCls} value={form.registerNo||''} onChange={e=>setField('registerNo',e.target.value)} required /></Field>
      <Field label="Course"><input className={inputCls} value={form.course||''} onChange={e=>setField('course',e.target.value)} placeholder="e.g. B.E. Computer Science" /></Field>
      <Field label="Semester"><input className={inputCls} value={form.semester||''} onChange={e=>setField('semester',e.target.value)} placeholder="e.g. 5" /></Field>
      <Field label="Section"><input className={inputCls} value={form.section||''} onChange={e=>setField('section',e.target.value)} placeholder="e.g. A" /></Field>
      <Field label="Fee Type">
        <select className={selectCls} value={form.feeType||''} onChange={e=>setField('feeType',e.target.value)} required>
          <option value="">-- Select --</option>
          {FEE_TYPES.map(f => <option key={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Amount (₹)"><input type="number" min="0" className={inputCls} value={form.amount||''} onChange={e=>setField('amount',e.target.value)} required /></Field>
      <Field label="Payment Mode">
        <select className={selectCls} value={form.paymentMode||'Cash'} onChange={e=>setField('paymentMode',e.target.value)}>
          {['Cash','UPI','DD','Cheque','Online'].map(m => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Date"><input type="date" className={inputCls} value={form.date||''} onChange={e=>setField('date',e.target.value)} required /></Field>
      <Field label="Receipt Number"><input className={inputCls} value={form.receiptNo||''} onChange={e=>setField('receiptNo',e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="Remarks"><textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} /></Field>
      </div>
    </div>
  ),
};

const StudentFeesEntry = () => <AdminEntryPage config={config} />;
export default StudentFeesEntry;
