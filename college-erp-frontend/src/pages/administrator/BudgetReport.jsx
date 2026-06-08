import React from 'react';
import { TrendingDown } from 'lucide-react';
import AdminEntryPage, { Field, inputCls } from './AdminEntryPage';

const defaultForm = {
  financialYear: `${new Date().getFullYear()}-${new Date().getFullYear()+1}`,
  category: '', budgetedAmount: '', actualAmount: '', variance: '', remarks: '',
};

const config = {
  apiType: 'office_budget',
  title: 'Budget Report',
  subtitle: 'Track budgeted vs actual expenditure by category and financial year',
  badge: 'Administrator › Office Report',
  gradient: 'bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900',
  accentFrom: 'from-rose-600',
  accentTo: 'to-pink-600',
  defaultForm,
  Icon: TrendingDown,
  summaryLabel: 'Total Budget',
  summaryValue: (records) => `₹${records.reduce((s,r)=>s+Number(r.budgetedAmount||0),0).toLocaleString()}`,
  headers: ['Financial Year', 'Category', 'Budgeted (₹)', 'Actual (₹)', 'Variance (₹)', 'Status'],
  renderRow: (rec) => {
    const variance = Number(rec.variance || 0);
    return (<>
      <td className="px-6 py-4 font-bold text-slate-800">{rec.financialYear}</td>
      <td className="px-6 py-4 font-semibold text-slate-700">{rec.category}</td>
      <td className="px-6 py-4 font-black text-blue-700">₹{Number(rec.budgetedAmount||0).toLocaleString()}</td>
      <td className="px-6 py-4 font-black text-slate-700">₹{Number(rec.actualAmount||0).toLocaleString()}</td>
      <td className={`px-6 py-4 font-black ${variance>=0?'text-emerald-700':'text-rose-700'}`}>₹{variance.toLocaleString()}</td>
      <td className="px-6 py-4">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${variance>=0?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {variance>=0?'Under Budget':'Over Budget'}
        </span>
      </td>
    </>);
  },
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Financial Year"><input className={inputCls} value={form.financialYear||''} onChange={e=>setField('financialYear',e.target.value)} placeholder="2024-2025" required /></Field>
      <Field label="Category"><input className={inputCls} value={form.category||''} onChange={e=>setField('category',e.target.value)} placeholder="e.g. Salary, Lab, Infrastructure..." required /></Field>
      <Field label="Budgeted Amount (₹)">
        <input type="number" min="0" className={inputCls} value={form.budgetedAmount||''}
          onChange={e => {
            const b = Number(e.target.value);
            setField('budgetedAmount', b);
            setField('variance', (b - (form.actualAmount || 0)).toFixed(2));
          }} />
      </Field>
      <Field label="Actual Amount (₹)">
        <input type="number" min="0" className={inputCls} value={form.actualAmount||''}
          onChange={e => {
            const a = Number(e.target.value);
            setField('actualAmount', a);
            setField('variance', ((form.budgetedAmount || 0) - a).toFixed(2));
          }} />
      </Field>
      <Field label="Variance (₹)">
        <input className={`${inputCls} bg-slate-50 text-slate-500`} value={form.variance||''} readOnly />
      </Field>
      <div className="md:col-span-2">
        <Field label="Remarks"><textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} /></Field>
      </div>
    </div>
  ),
};

const BudgetReport = () => <AdminEntryPage config={config} />;
export default BudgetReport;
