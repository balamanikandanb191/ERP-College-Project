import React from 'react';
import { Send } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const priorityColor = (p) => ({
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Urgent: 'bg-orange-50 text-orange-700 border-orange-200',
  Normal: 'bg-slate-100 text-slate-600 border-slate-200',
}[p] || 'bg-slate-100 text-slate-600 border-slate-200');

const defaultForm = {
  toName: '', toDesignation: '', toAddress: '', letterNo: '',
  subject: '', content: '', date: new Date().toISOString().slice(0,10),
  sentBy: '', mode: 'Physical', priority: 'Normal',
};

const config = {
  apiType: 'office_send_letter',
  title: 'Send Letter',
  subtitle: 'Record and track all official outgoing letters and communications',
  badge: 'Administrator › Correspondence',
  gradient: 'bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900',
  accentFrom: 'from-teal-600',
  accentTo: 'to-cyan-600',
  defaultForm,
  Icon: Send,
  summaryLabel: 'Total Sent',
  summaryValue: (records) => records.length.toString(),
  headers: ['To', 'Designation', 'Subject', 'Letter No', 'Date', 'Mode', 'Priority'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-bold text-slate-800">{rec.toName}</td>
    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.toDesignation}</td>
    <td className="px-6 py-4 font-semibold text-slate-700 max-w-[200px] truncate">{rec.subject}</td>
    <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">{rec.letterNo}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.date}</td>
    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.mode}</td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${priorityColor(rec.priority)}`}>{rec.priority}</span>
    </td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="To (Name)"><input className={inputCls} value={form.toName||''} onChange={e=>setField('toName',e.target.value)} required /></Field>
      <Field label="Designation"><input className={inputCls} value={form.toDesignation||''} onChange={e=>setField('toDesignation',e.target.value)} /></Field>
      <Field label="Address"><input className={inputCls} value={form.toAddress||''} onChange={e=>setField('toAddress',e.target.value)} /></Field>
      <Field label="Letter Number"><input className={inputCls} value={form.letterNo||''} onChange={e=>setField('letterNo',e.target.value)} /></Field>
      <Field label="Subject"><input className={inputCls} value={form.subject||''} onChange={e=>setField('subject',e.target.value)} required /></Field>
      <Field label="Date"><input type="date" className={inputCls} value={form.date||''} onChange={e=>setField('date',e.target.value)} required /></Field>
      <Field label="Sent By"><input className={inputCls} value={form.sentBy||''} onChange={e=>setField('sentBy',e.target.value)} /></Field>
      <Field label="Mode">
        <select className={selectCls} value={form.mode||'Physical'} onChange={e=>setField('mode',e.target.value)}>
          {['Physical','Email','Courier','Registered Post','Fax'].map(m => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Priority">
        <select className={selectCls} value={form.priority||'Normal'} onChange={e=>setField('priority',e.target.value)}>
          {['Normal','High','Urgent'].map(p => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Letter Content / Body">
          <textarea className={inputCls} rows={6} value={form.content||''} onChange={e=>setField('content',e.target.value)} placeholder="Type the letter body here..." />
        </Field>
      </div>
    </div>
  ),
};

const SendLetter = () => <AdminEntryPage config={config} />;
export default SendLetter;
