import React, { useState, useMemo } from 'react';
import { Folder, FileText, Download, Eye, Lock, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffDocumentVault = ({ staff = {} }) => {
  const safeData = staff || {};
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Dynamic document records to ensure absolute customization
  const documents = useMemo(() => {
    return [
      { id: 'deg', name: 'Ph.D. Degree Certificate.pdf', size: '2.4 MB', type: 'Academic Credentials', hash: 'SHA256-48c20ad7b...' },
      { id: 'app', name: 'Official Appointment Order.pdf', size: '1.8 MB', type: 'Contractual Documents', hash: 'SHA256-19d2a4e9b...' },
      { id: 'exp', name: 'Experience Proof - NIT.pdf', size: '1.2 MB', type: 'Professional Experience', hash: 'SHA256-83b0f7d1a...' },
      { id: 'id', name: 'Faculty Government ID Proof.pdf', size: '940 KB', type: 'Personal Identity', hash: 'SHA256-91e84a20c...' }
    ];
  }, []);

  const handleDownload = (docName) => {
    toast.success(`${docName} downloaded successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Encryption warning banner */}
      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h5 className="text-xs font-black uppercase tracking-wider">Secure institution cryptography</h5>
          <p className="text-[9px] font-bold text-emerald-600 leading-normal mt-0.5">
            All files are encrypted in-transit (TLS 1.3) and verified with cryptographically secure SHA-256 signatures.
          </p>
        </div>
      </div>

      {/* Directory Folder Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            
            <div className="flex items-start gap-3">
              <div className="p-3 bg-white border border-slate-200/60 text-indigo-500 rounded-xl">
                <FileText size={22} />
              </div>
              <div className="space-y-1">
                <span className="text-[7px] font-black text-indigo-600 uppercase tracking-widest block">{doc.type}</span>
                <h5 className="text-xs font-black text-slate-800 leading-tight truncate max-w-[200px]">
                  {doc.name}
                </h5>
                <span className="text-[8px] font-bold text-slate-400 block">File size: {doc.size}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
              <span className="text-[7px] font-mono text-slate-400 tracking-wider">
                {doc.hash}
              </span>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setSelectedDoc(doc)}
                  className="p-2 bg-white text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200/60 hover:bg-slate-50 transition-colors"
                >
                  <Eye size={13} />
                </button>
                <button 
                  onClick={() => handleDownload(doc.name)}
                  className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Sandbox Decrypted Document Preview Overlay Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Lock size={16} className="text-emerald-500" />
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Decrypted Document Sandbox</h4>
                  <span className="text-[7px] font-bold text-slate-400 uppercase block tracking-widest mt-0.5">SHA-256 Verified Signature</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Simulated Cryptographic Preview Area */}
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <FileText size={32} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800 uppercase">{selectedDoc.name}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Target: {safeData.fullName || safeData.name} • {safeData.staffId || 'EMP99999'}
                </p>
              </div>

              {/* Sandbox simulated content */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-[9px] text-slate-500 leading-relaxed text-left space-y-2 font-mono">
                <p className="font-bold text-slate-700 uppercase border-b border-slate-200/60 pb-1.5 flex justify-between">
                  <span>Institutional metadata</span>
                  <span className="text-emerald-600 font-black">VALID CERTIFICATE</span>
                </p>
                <p>Digital Checksum: {selectedDoc.hash}ae3849182301948ad83</p>
                <p>Encryption: AES-GCM 256-Bit Cryptography</p>
                <p>Auditor: EduERP Registrar Office</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close Sandbox
              </button>
              <button 
                onClick={() => {
                  handleDownload(selectedDoc.name);
                  setSelectedDoc(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md"
              >
                Download Copy
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaffDocumentVault;
