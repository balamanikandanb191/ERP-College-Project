import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const OfferLetterManager = ({ 
  offerLetter = null, 
  onUpdateOffer = () => {} 
}) => {
  const [dragActive, setDragActive] = useState(false);
  
  // Safe structure extraction
  const letterData = offerLetter ?? {
    fileName: '',
    fileSize: '',
    uploadedAt: '',
    verificationStatus: 'Pending', // Pending, Verified, Rejected
    acceptanceStatus: 'Pending' // Pending, Accepted, Declined
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported for offer letters!");
      return;
    }
    
    // Simulate successful file upload
    const updatedLetter = {
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      verificationStatus: 'Pending',
      acceptanceStatus: 'Pending'
    };
    
    onUpdateOffer(updatedLetter);
    toast.success("Offer letter uploaded successfully!");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    toast.success(`Downloading offer letter: ${letterData.fileName || 'offer_letter.pdf'}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Offer Letter Management</h3>
      
      {!letterData.fileName ? (
        // Upload Drag & Drop Box
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' 
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'
          }`}
        >
          <input 
            type="file" 
            id="offer-letter-upload" 
            className="hidden" 
            accept=".pdf"
            onChange={handleFileChange}
          />
          <label htmlFor="offer-letter-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <p className="text-xs font-black text-slate-700">Drag & Drop offer letter here</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Supported Format: PDF only (Max 5MB)</p>
            <span className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-[10px] hover:bg-indigo-100 transition-colors">
              Browse Files
            </span>
          </label>
        </div>
      ) : (
        // File Display & Verification Box
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
                <p className="text-xs font-black text-slate-800 truncate" title={letterData.fileName}>
                  {letterData.fileName}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                  {letterData.fileSize} • Uploaded on {letterData.uploadedAt}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <button 
                onClick={handleDownload}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Download Offer PDF"
              >
                <Download size={14} />
              </button>
              <button 
                onClick={() => onUpdateOffer(null)}
                className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-400 rounded-lg transition-colors"
                title="Remove Offer Letter"
              >
                <XCircle size={14} />
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-200/60 my-2" />

          {/* Verification & Acceptance States */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">TPO Verification</label>
              <div className="flex items-center gap-1.5 mt-1">
                <select
                  value={letterData.verificationStatus ?? 'Pending'}
                  onChange={(e) => onUpdateOffer({ ...letterData, verificationStatus: e.target.value })}
                  className={`w-full px-2 py-1 rounded-lg border font-bold text-[10px] bg-white outline-none cursor-pointer ${
                    letterData.verificationStatus === 'Verified' 
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50/30' 
                      : letterData.verificationStatus === 'Rejected'
                      ? 'border-rose-200 text-rose-700 bg-rose-50/30'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Student Acceptance</label>
              <div className="flex items-center gap-1.5 mt-1">
                <select
                  value={letterData.acceptanceStatus ?? 'Pending'}
                  onChange={(e) => onUpdateOffer({ ...letterData, acceptanceStatus: e.target.value })}
                  className={`w-full px-2 py-1 rounded-lg border font-bold text-[10px] bg-white outline-none cursor-pointer ${
                    letterData.acceptanceStatus === 'Accepted' 
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50/30' 
                      : letterData.acceptanceStatus === 'Declined'
                      ? 'border-rose-200 text-rose-700 bg-rose-50/30'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterManager;
