import React from 'react';
import { ShoppingCart } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const CATEGORIES = ['Stationery', 'Electronics', 'Furniture', 'Lab Equipment', 'Sports', 'Cleaning', 'Other'];

const defaultForm = {
  vendorName: '', item: '', quantity: 1, unitPrice: '', totalAmount: '',
  invoiceNo: '', purchaseDate: new Date().toISOString().slice(0,10),
  category: 'Stationery', paidBy: 'Cash', remarks: '',
};

const config = {
  apiType: 'office_purchase_entry',
  title: 'Purchase Entry',
  subtitle: 'Log all institutional purchases, invoices and vendor payments',
  badge: 'Administrator › Office',
  gradient: 'bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900',
  accentFrom: 'from-amber-600',
  accentTo: 'to-orange-600',
  defaultForm,
  Icon: ShoppingCart,
  summaryLabel: 'Total Spend',
  summaryValue: (records) => `₹${records.reduce((s, r) => s + Number(r.totalAmount || 0), 0).toLocaleString()}`,
  headers: ['Vendor', 'Item', 'Category', 'Qty', 'Unit Price', 'Total', 'Date', 'Invoice'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-bold text-slate-800">{rec.vendorName}</td>
    <td className="px-6 py-4 font-semibold text-slate-700">{rec.item}</td>
    <td className="px-6 py-4">
      <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full">{rec.category}</span>
    </td>
    <td className="px-6 py-4 font-bold text-slate-700">{rec.quantity}</td>
    <td className="px-6 py-4 font-semibold text-slate-600">₹{Number(rec.unitPrice || 0).toLocaleString()}</td>
    <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.totalAmount || 0).toLocaleString()}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.purchaseDate}</td>
    <td className="px-6 py-4 font-mono text-xs text-slate-400">{rec.invoiceNo}</td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Vendor Name"><input className={inputCls} value={form.vendorName||''} onChange={e=>setField('vendorName',e.target.value)} required /></Field>
      <Field label="Item Description"><input className={inputCls} value={form.item||''} onChange={e=>setField('item',e.target.value)} required /></Field>
      <Field label="Invoice Number"><input className={inputCls} value={form.invoiceNo||''} onChange={e=>setField('invoiceNo',e.target.value)} /></Field>
      <Field label="Category">
        <select className={selectCls} value={form.category||'Stationery'} onChange={e=>setField('category',e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Quantity">
        <input type="number" min="1" className={inputCls} value={form.quantity||1}
          onChange={e => {
            const q = Number(e.target.value);
            setField('quantity', q);
            setField('totalAmount', (q * (form.unitPrice || 0)).toFixed(2));
          }} required />
      </Field>
      <Field label="Unit Price (₹)">
        <input type="number" min="0" className={inputCls} value={form.unitPrice||''}
          onChange={e => {
            const u = Number(e.target.value);
            setField('unitPrice', u);
            setField('totalAmount', ((form.quantity || 1) * u).toFixed(2));
          }} required />
      </Field>
      <Field label="Total Amount (₹)">
        <input className={`${inputCls} bg-slate-50 text-slate-500`} value={form.totalAmount||''} readOnly />
      </Field>
      <Field label="Purchase Date"><input type="date" className={inputCls} value={form.purchaseDate||''} onChange={e=>setField('purchaseDate',e.target.value)} required /></Field>
      <Field label="Paid By">
        <select className={selectCls} value={form.paidBy||'Cash'} onChange={e=>setField('paidBy',e.target.value)}>
          {['Cash','Cheque','Bank Transfer','Online'].map(m => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Remarks"><textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} /></Field>
      </div>
    </div>
  ),
};

const PurchaseEntry = () => <AdminEntryPage config={config} />;
export default PurchaseEntry;
