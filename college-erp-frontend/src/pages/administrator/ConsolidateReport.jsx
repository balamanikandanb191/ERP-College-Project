import React from 'react';
import { FileText } from 'lucide-react';
import AdminEntryPage, { Field, inputCls } from './AdminEntryPage';

const defaultForm = {
  reportMonth: new Date().toISOString().slice(0,7),
  totalIncome: '', totalExpenditure: '', totalFees: '', notes: '',
};

const config = {
  apiType: 'office_consolidate',
  title: 'Consolidate Report',
  subtitle: 'Monthly summary of all financial transactions and collections',
  badge: 'Administrator › Office Report',
  gradient: 'bg-gradient-to-br from-purple-900 via-violet-900 to-slate-900',
  accentFrom: 'from-purple-600',
  accentTo: 'to-violet-600',
  defaultForm,
  Icon: FileText,
  summaryLabel: 'Months Recorded',
  summaryValue: (records) => records.length.toString(),
  headers: ['Month', 'Total Income', 'Total Expenditure', 'Total Fees', 'Net Balance', 'Notes'],
  renderRow: (rec) => {
    const balance = Number(rec.totalIncome||0) - Number(rec.totalExpenditure||0);
    return (<>
      <td className="px-6 py-4 font-bold text-slate-800">{rec.reportMonth}</td>
      <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.totalIncome||0).toLocaleString()}</td>
      <td className="px-6 py-4 font-black text-rose-700">₹{Number(rec.totalExpenditure||0).toLocaleString()}</td>
      <td className="px-6 py-4 font-black text-blue-700">₹{Number(rec.totalFees||0).toLocaleString()}</td>
      <td className={`px-6 py-4 font-black ${balance>=0?'text-emerald-700':'text-rose-700'}`}>₹{balance.toLocaleString()}</td>
      <td className="px-6 py-4 font-semibold text-slate-500 text-xs max-w-[200px] truncate">{rec.notes}</td>
    </>);
  },
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Report Month"><input type="month" className={inputCls} value={form.reportMonth||''} onChange={e=>setField('reportMonth',e.target.value)} required /></Field>
      <Field label="Total Income (₹)"><input type="number" min="0" className={inputCls} value={form.totalIncome||''} onChange={e=>setField('totalIncome',e.target.value)} /></Field>
      <Field label="Total Expenditure (₹)"><input type="number" min="0" className={inputCls} value={form.totalExpenditure||''} onChange={e=>setField('totalExpenditure',e.target.value)} /></Field>
      <Field label="Total Fees Collected (₹)"><input type="number" min="0" className={inputCls} value={form.totalFees||''} onChange={e=>setField('totalFees',e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="Notes / Remarks"><textarea className={inputCls} rows={3} value={form.notes||''} onChange={e=>setField('notes',e.target.value)} /></Field>
      </div>
    </div>
  ),
};

const ConsolidateReport = () => <AdminEntryPage config={config} />;
export default ConsolidateReport;
