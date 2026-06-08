import React from 'react';
import { Inbox } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const priorityColor = (p) => ({
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Urgent: 'bg-orange-50 text-orange-700 border-orange-200',
  Normal: 'bg-slate-100 text-slate-600 border-slate-200',
}[p] || 'bg-slate-100 text-slate-600 border-slate-200');

const actionColor = (a) => (
  a === 'No' ? 'bg-slate-100 text-slate-500 border-slate-200'
  : a?.includes('Completed') ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
  : 'bg-amber-50 text-amber-700 border-amber-200'
);

const defaultForm = {
  fromName: '', fromOrganization: '', subject: '', content: '',
  receivedDate: new Date().toISOString().slice(0,10),
  refNo: '', priority: 'Normal', actionRequired: 'No', actionBy: '',
};

const config = {
  apiType: 'office_receive_letter',
  title: 'Receive Letter',
  subtitle: 'Record and track all incoming official letters and communications',
  badge: 'Administrator › Correspondence',
  gradient: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900',
  accentFrom: 'from-indigo-600',
  accentTo: 'to-blue-600',
  defaultForm,
  Icon: Inbox,
  summaryLabel: 'Total Received',
  summaryValue: (records) => records.length.toString(),
  headers: ['From', 'Organization', 'Subject', 'Ref No', 'Date', 'Priority', 'Action'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-bold text-slate-800">{rec.fromName}</td>
    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.fromOrganization}</td>
    <td className="px-6 py-4 font-semibold text-slate-700 max-w-[200px] truncate">{rec.subject}</td>
    <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">{rec.refNo}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.receivedDate}</td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${priorityColor(rec.priority)}`}>{rec.priority}</span>
    </td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${actionColor(rec.actionRequired)}`}>{rec.actionRequired}</span>
    </td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="From (Name)"><input className={inputCls} value={form.fromName||''} onChange={e=>setField('fromName',e.target.value)} required /></Field>
      <Field label="Organization"><input className={inputCls} value={form.fromOrganization||''} onChange={e=>setField('fromOrganization',e.target.value)} /></Field>
      <Field label="Subject"><input className={inputCls} value={form.subject||''} onChange={e=>setField('subject',e.target.value)} required /></Field>
      <Field label="Reference Number"><input className={inputCls} value={form.refNo||''} onChange={e=>setField('refNo',e.target.value)} /></Field>
      <Field label="Received Date"><input type="date" className={inputCls} value={form.receivedDate||''} onChange={e=>setField('receivedDate',e.target.value)} required /></Field>
      <Field label="Priority">
        <select className={selectCls} value={form.priority||'Normal'} onChange={e=>setField('priority',e.target.value)}>
          {['Normal','High','Urgent'].map(p => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Action Required">
        <select className={selectCls} value={form.actionRequired||'No'} onChange={e=>setField('actionRequired',e.target.value)}>
          {['No','Yes - Pending','Yes - Completed'].map(a => <option key={a}>{a}</option>)}
        </select>
      </Field>
      <Field label="Action By"><input className={inputCls} value={form.actionBy||''} onChange={e=>setField('actionBy',e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="Letter Content">
          <textarea className={inputCls} rows={5} value={form.content||''} onChange={e=>setField('content',e.target.value)} />
        </Field>
      </div>
    </div>
  ),
};

const ReceiveLetter = () => <AdminEntryPage config={config} />;
export default ReceiveLetter;
