import React from 'react';
import { BarChart3 } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const defaultForm = {
  date: new Date().toISOString().slice(0,10), type: 'Income',
  category: '', description: '', amount: '', paymentMode: 'Cash', reference: '',
};

const config = {
  apiType: 'office_income_expenditure',
  title: 'Income & Expenditure',
  subtitle: 'Track all institutional income sources and expenditure entries',
  badge: 'Administrator › Office Report',
  gradient: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900',
  accentFrom: 'from-blue-600',
  accentTo: 'to-indigo-600',
  defaultForm,
  Icon: BarChart3,
  summaryLabel: 'Net Balance',
  summaryValue: (records) => {
    const income = records.filter(r=>r.type==='Income').reduce((s,r)=>s+Number(r.amount||0),0);
    const expense = records.filter(r=>r.type==='Expenditure').reduce((s,r)=>s+Number(r.amount||0),0);
    return `₹${(income-expense).toLocaleString()}`;
  },
  headers: ['Date', 'Type', 'Category', 'Description', 'Amount', 'Mode', 'Reference'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.date}</td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${rec.type==='Income'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{rec.type}</span>
    </td>
    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{rec.category}</td>
    <td className="px-6 py-4 font-semibold text-slate-700">{rec.description}</td>
    <td className={`px-6 py-4 font-black ${rec.type==='Income'?'text-emerald-700':'text-rose-700'}`}>₹{Number(rec.amount||0).toLocaleString()}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.paymentMode}</td>
    <td className="px-6 py-4 font-mono text-xs text-indigo-600">{rec.reference}</td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Type">
        <select className={selectCls} value={form.type||'Income'} onChange={e=>setField('type',e.target.value)}>
          {['Income','Expenditure'].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Category"><input className={inputCls} value={form.category||''} onChange={e=>setField('category',e.target.value)} placeholder="e.g. Fees, Salary, Maintenance..." required /></Field>
      <Field label="Description"><input className={inputCls} value={form.description||''} onChange={e=>setField('description',e.target.value)} required /></Field>
      <Field label="Amount (₹)"><input type="number" min="0" className={inputCls} value={form.amount||''} onChange={e=>setField('amount',e.target.value)} required /></Field>
      <Field label="Date"><input type="date" className={inputCls} value={form.date||''} onChange={e=>setField('date',e.target.value)} required /></Field>
      <Field label="Payment Mode">
        <select className={selectCls} value={form.paymentMode||'Cash'} onChange={e=>setField('paymentMode',e.target.value)}>
          {['Cash','Bank Transfer','Cheque','UPI','Online'].map(m => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Reference / Voucher No"><input className={inputCls} value={form.reference||''} onChange={e=>setField('reference',e.target.value)} /></Field>
      </div>
    </div>
  ),
};

const IncomeExpenditure = () => <AdminEntryPage config={config} />;
export default IncomeExpenditure;
