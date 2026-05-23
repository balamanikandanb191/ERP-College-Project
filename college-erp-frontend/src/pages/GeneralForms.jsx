import React from 'react';
import { FileText, Download, Printer, ShieldAlert, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { id: 'form-1', title: 'Leave Application Form', code: 'SMS-GF-01', desc: 'Standard student leave application request form for short and long-term permissions.' },
  { id: 'form-2', title: 'Course Change request Form', code: 'SMS-GF-02', desc: 'Official request template for changing interested engineering major or section divisions.' },
  { id: 'form-3', title: 'Admission Withdrawal Form', code: 'SMS-GF-03', desc: 'Matriculation cancellation, fees refund options, and original certificates returns ledger request.' },
  { id: 'form-4', title: 'Semester Freezing / Gap Year Form', code: 'SMS-GF-04', desc: 'Academic break request template specifying resume dates and approvals.' }
];

const GeneralForms = () => {
  const downloadForm = (title) => {
    toast.success(`Downloading official ${title} template...`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">General Documents</span>
          <h1 className="text-3xl font-black mt-2">Forms & Templates Registry</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Review official administrative forms, application withdrawal sheets, and major modifications templates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map(t => (
          <div key={t.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-indigo-100 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{t.code}</span>
                <Sparkles size={16} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-900 transition-colors">{t.title}</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{t.desc}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-50">
              <button onClick={() => downloadForm(t.title)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-indigo-550/10 text-slate-700 hover:text-indigo-700 font-bold border border-slate-200 hover:border-indigo-200 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all">
                <Download size={13} /> Download PDF
              </button>
              <button onClick={() => toast.success('Printing template...')}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs flex items-center justify-center transition-colors">
                <Printer size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralForms;
