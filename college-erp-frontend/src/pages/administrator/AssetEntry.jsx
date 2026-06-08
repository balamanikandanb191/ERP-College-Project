import React from 'react';
import { Package } from 'lucide-react';
import AdminEntryPage, { Field, inputCls, selectCls } from './AdminEntryPage';

const ASSET_CATEGORIES = ['Furniture', 'Electronics', 'Laboratory', 'Vehicle', 'Building', 'Computer', 'Sports', 'Other'];

const defaultForm = {
  assetName: '', category: 'Furniture', purchaseDate: new Date().toISOString().slice(0,10),
  purchasePrice: '', supplier: '', location: '', condition: 'Good', serialNo: '', remarks: '',
};

const conditionColor = (c) => ({
  Good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Fair: 'bg-amber-50 text-amber-700 border-amber-200',
  Poor: 'bg-rose-50 text-rose-700 border-rose-200',
  'Under Repair': 'bg-orange-50 text-orange-700 border-orange-200',
  Disposed: 'bg-slate-100 text-slate-500 border-slate-200',
}[c] || 'bg-slate-100 text-slate-500 border-slate-200');

const config = {
  apiType: 'office_asset_entry',
  title: 'Asset Entry',
  subtitle: 'Manage institutional assets, equipment and inventory records',
  badge: 'Administrator › Office',
  gradient: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900',
  accentFrom: 'from-emerald-600',
  accentTo: 'to-teal-600',
  defaultForm,
  Icon: Package,
  summaryLabel: 'Total Asset Value',
  summaryValue: (records) => `₹${records.reduce((s, r) => s + Number(r.purchasePrice || 0), 0).toLocaleString()}`,
  headers: ['Asset Name', 'Category', 'Serial No', 'Location', 'Condition', 'Price (₹)', 'Date'],
  renderRow: (rec) => (<>
    <td className="px-6 py-4 font-bold text-slate-800">{rec.assetName}</td>
    <td className="px-6 py-4">
      <span className="bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-black px-2 py-0.5 rounded-full">{rec.category}</span>
    </td>
    <td className="px-6 py-4 font-mono text-xs text-slate-500">{rec.serialNo}</td>
    <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{rec.location}</td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${conditionColor(rec.condition)}`}>{rec.condition}</span>
    </td>
    <td className="px-6 py-4 font-black text-emerald-700">₹{Number(rec.purchasePrice || 0).toLocaleString()}</td>
    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{rec.purchaseDate}</td>
  </>),
  renderForm: (form, setField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Asset Name"><input className={inputCls} value={form.assetName||''} onChange={e=>setField('assetName',e.target.value)} required /></Field>
      <Field label="Serial / ID Number"><input className={inputCls} value={form.serialNo||''} onChange={e=>setField('serialNo',e.target.value)} /></Field>
      <Field label="Supplier Name"><input className={inputCls} value={form.supplier||''} onChange={e=>setField('supplier',e.target.value)} /></Field>
      <Field label="Location / Room"><input className={inputCls} value={form.location||''} onChange={e=>setField('location',e.target.value)} /></Field>
      <Field label="Category">
        <select className={selectCls} value={form.category||'Furniture'} onChange={e=>setField('category',e.target.value)}>
          {ASSET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Condition">
        <select className={selectCls} value={form.condition||'Good'} onChange={e=>setField('condition',e.target.value)}>
          {['Good','Fair','Poor','Under Repair','Disposed'].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Purchase Price (₹)"><input type="number" min="0" className={inputCls} value={form.purchasePrice||''} onChange={e=>setField('purchasePrice',e.target.value)} /></Field>
      <Field label="Purchase Date"><input type="date" className={inputCls} value={form.purchaseDate||''} onChange={e=>setField('purchaseDate',e.target.value)} /></Field>
      <div className="md:col-span-2">
        <Field label="Remarks"><textarea className={inputCls} rows={2} value={form.remarks||''} onChange={e=>setField('remarks',e.target.value)} /></Field>
      </div>
    </div>
  ),
};

const AssetEntry = () => <AdminEntryPage config={config} />;
export default AssetEntry;
