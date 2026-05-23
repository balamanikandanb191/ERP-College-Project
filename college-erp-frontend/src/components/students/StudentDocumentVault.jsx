import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Download, Eye, 
  Sparkles, Lock, X, FileCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDocumentVault = ({ student = {} }) => {
  const safeData = student || {};

  const documents = [
    { id: 'aadhaar', title: 'Aadhaar Card Copy', size: '1.24 MB', uploadedAt: '12 Sep 2024', status: 'Verified', hash: 'SHA256: 8aef...49c0' },
    { id: '10th', title: '10th Grade Marksheet', size: '2.40 MB', uploadedAt: '12 Sep 2024', status: 'Verified', hash: 'SHA256: 7d42...1298' },
    { id: '12th', title: '12th Grade Marksheet', size: '2.10 MB', uploadedAt: '12 Sep 2024', status: 'Verified', hash: 'SHA256: 9b84...8943' },
    { id: 'sem_marks', title: 'Consolidated Marksheet', size: '4.80 MB', uploadedAt: '14 May 2026', status: 'Verified', hash: 'SHA256: 0ca4...9842' },
    { id: 'tc', title: 'Transfer Certificate (TC)', size: '890 KB', uploadedAt: '12 Sep 2024', status: 'Verified', hash: 'SHA256: 3de4...0294' },
    { id: 'offer', title: 'Placement Offer Letter', size: '1.42 MB', uploadedAt: '13 May 2026', status: 'Verified', hash: 'SHA256: 8f42...0924' }
  ];

  // Active Preview State
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  const handleDownload = (title) => {
    toast.success(`Secure download initiated for: ${title}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Secure Document Vault</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Encrypted institutional records store and SHA256 verified logs</p>
        </div>

        <span className="px-3 py-1 rounded-full border border-indigo-500/20 text-indigo-500 bg-indigo-500/10 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
          <Lock size={10} /> ISO-27001 Secured
        </span>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, idx) => (
          <div key={idx} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 hover:border-slate-300 p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 bg-white border border-slate-200/80 text-indigo-600 rounded-xl shadow-2xs shrink-0">
                <FileText size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-800 uppercase truncate">{doc.title}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  {doc.size} • Uploaded {doc.uploadedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setActivePreviewDoc(doc)}
                className="p-2 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider shadow-2xs"
              >
                <Eye size={12} /> Preview
              </button>
              <button 
                onClick={() => handleDownload(doc.title)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition-all flex items-center justify-center shadow-md shadow-indigo-500/10"
              >
                <Download size={12} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Interactive Floating Preview Modal Overlay */}
      {activePreviewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] border border-slate-100 max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setActivePreviewDoc(null)}
              className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Header Details */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <FileCheck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{activePreviewDoc.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Verify Registry File details and checksums
                </p>
              </div>
            </div>

            {/* Simulator Document preview container */}
            <div className="bg-slate-950 text-white rounded-2xl p-8 h-80 flex flex-col items-center justify-center border border-slate-900 relative overflow-hidden shadow-inner text-center space-y-4">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-radial-gradient from-transparent via-white/5 to-transparent mix-blend-overlay opacity-30" />
              
              <Lock size={36} className="text-indigo-400 animate-pulse" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 leading-none">Security Encryption Overlay</h4>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authorized ERP Audit Sandbox Preview Mode</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-md font-mono text-[9px] text-slate-400 text-left space-y-1.5">
                <p><span className="text-indigo-400 font-bold uppercase">FILE NAME:</span> {activePreviewDoc.title.replace(' ', '_')}.pdf</p>
                <p><span className="text-indigo-400 font-bold uppercase">FILE SIZE:</span> {activePreviewDoc.size}</p>
                <p><span className="text-indigo-400 font-bold uppercase">TIMESTAMP:</span> {activePreviewDoc.uploadedAt} • 10:24 AM GMT</p>
                <p><span className="text-indigo-400 font-bold uppercase">CHECKSUM:</span> {activePreviewDoc.hash}</p>
                <p><span className="text-emerald-400 font-bold uppercase">VERIFICATION:</span> SHA-256 SECURE HANDSHAKE VERIFIED</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" /> SECURED FILE AUDIT TRAIL LOGGED
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActivePreviewDoc(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Close Sandbox
                </button>
                <button 
                  onClick={() => {
                    handleDownload(activePreviewDoc.title);
                    setActivePreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/10 flex items-center gap-1.5"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDocumentVault;
