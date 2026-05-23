import React, { useState } from 'react';
import { FileText, Printer, Plus, Trash2, CheckCircle, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_ITEMS = [
  { id: 'item-1', name: 'Tuition Fee (Per Annum)', amount: 85000 },
  { id: 'item-2', name: 'Special Laboratory Fee', amount: 15000 },
  { id: 'item-3', name: 'Library & E-Resources Deposit', amount: 5000 },
  { id: 'item-4', name: 'Sports & Cultural Activities Fee', amount: 3500 }
];

const FeesEstimation = () => {
  const [studentName, setStudentName] = useState('Rahul Krishnan');
  const [course, setCourse] = useState('B.E. Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemAmount) return;
    setItems([...items, { id: `item-${Date.now()}`, name: newItemName, amount: Number(newItemAmount) }]);
    setNewItemName('');
    setNewItemAmount('');
    toast.success('Item added to estimate');
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(x => x.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:m-0">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Certificates Module</span>
            <h1 className="text-3xl font-black mt-2">Fees Estimation Slip</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Generate official bank-ready fee breakdowns and loan verification structures</p>
          </div>
          <button onClick={() => window.print()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Printer size={18} /> Print Fee Estimate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Input Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4 print:hidden">
          <h3 className="font-black text-slate-800 text-base">Estimate Particulars</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Name</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={studentName} onChange={e => setStudentName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Course Stream</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={course} onChange={e => setCourse(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Academic Session</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                value={academicYear} onChange={e => setAcademicYear(e.target.value)} />
            </div>
          </div>

          <form onSubmit={handleAddItem} className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-700 uppercase">Add Fee Ledger Item</h4>
            <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              placeholder="e.g., Hostel Caution Deposit" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
            <div className="flex gap-2">
              <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="Amount (₹)" value={newItemAmount} onChange={e => setNewItemAmount(e.target.value)} />
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">Add</button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 max-w-2xl mx-auto space-y-8 relative print:border-none print:shadow-none">
            {/* Letterhead */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">National Institute of Technology & Science</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Affiliated to State University | Approved by AICTE</p>
              <h3 className="text-xs font-black text-slate-700 bg-slate-100 inline-block px-4 py-1 rounded-full uppercase tracking-wider mt-2">Official Fee Estimate Certificate</h3>
            </div>

            {/* Student metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div>Student Name: <strong className="text-slate-900 block">{studentName}</strong></div>
              <div>Course Program: <strong className="text-slate-900 block">{course}</strong></div>
              <div>Academic Period: <strong className="text-slate-900 block">{academicYear}</strong></div>
              <div>Date Issued: <strong className="text-slate-900 block font-mono">{new Date().toLocaleDateString('en-IN')}</strong></div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="flex justify-between font-black text-[10px] text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-200">
                <span>Fee Particulars</span>
                <span>Amount (INR)</span>
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between py-2.5 font-semibold text-slate-800 group">
                    <span className="flex items-center gap-2">
                      {item.name}
                      <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-rose-500 group-hover:opacity-100 opacity-0 print:hidden transition-all"><Trash2 size={12} /></button>
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-black text-base text-slate-900 pt-4 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Stamp footer */}
            <div className="flex justify-between pt-16 text-[10px] text-slate-500 font-black uppercase tracking-wider">
              <div>* Valid for Bank Educational Loan Applications</div>
              <div className="text-right border-t border-slate-300 w-36 pt-1">Finance Registrar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesEstimation;
