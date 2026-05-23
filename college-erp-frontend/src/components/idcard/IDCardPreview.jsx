import React, { useRef, useState } from 'react';
import { Download, Printer, User, Award, Phone, MapPin, Building, Droplets, Calendar, Droplet } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const IDCardPreview = ({ type, data }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Safe Icon Rendering
  const BloodIcon = Droplets || Droplet || User;

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      toast.loading('Generating high-quality PDF...', { id: 'pdf-toast' });
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 4, // High quality
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [54, 86] // Standard CR80 ID Card format (86mm x 54mm)
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 54, 86);
      pdf.save(`${data?.fullName?.replace(/\s+/g, '_')}_${type}_IDCard.pdf`);
      
      toast.success('ID Card downloaded successfully', { id: 'pdf-toast' });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-toast' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print(); // In a real app, you might want to open a new window with just the card.
  };

  if (!data) return null;

  const isStudent = type === 'Student';
  const idNumber = isStudent ? data.registerNumber : data.staffId;
  const photo = data.photoUrl ? `http://localhost:5000/${data.photoUrl}` : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';

  return (
    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
      
      <div className="flex gap-3 w-full max-w-sm mb-6">
        <button 
          onClick={handleDownloadPDF} 
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          <Download size={18} /> {isGenerating ? 'Processing...' : 'Download PDF'}
        </button>
        <button 
          onClick={handlePrint} 
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl font-semibold shadow-sm transition-all text-sm"
        >
          <Printer size={18} /> Print Card
        </button>
      </div>

      {/* ID Card Wrapper - Kept exactly at CR80 proportion (54mm x 86mm ~ ratio 1:1.59) */}
      <div className="relative shadow-2xl rounded-2xl overflow-hidden bg-white w-[300px] h-[475px] transition-transform hover:-translate-y-1 duration-300 ring-1 ring-slate-900/5 print-only-card" ref={cardRef}>
        
        {/* Card Header & Background */}
        <div className="absolute top-0 left-0 w-full h-[140px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 overflow-hidden">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
        </div>

        {/* Institution Header */}
        <div className="relative z-10 pt-5 px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-1">
            <div className="bg-white p-1 rounded-full shadow-sm"><Building size={16} className="text-indigo-600" /></div>
            <h1 className="text-white font-black text-[15px] tracking-wide uppercase shadow-sm">EduERP College</h1>
          </div>
          <p className="text-indigo-100 text-[9px] font-medium tracking-widest uppercase">Excellence in Education</p>
        </div>

        {/* Photo Container */}
        <div className="relative z-10 mt-3 flex justify-center">
          <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 rotate-1">
            <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative -rotate-1">
              <img 
                src={photo} 
                alt={data.fullName} 
                className="w-full h-full object-cover" 
                crossOrigin="anonymous" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';
                }}
              />
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="text-center px-4 mt-3">
          <h2 className="text-[20px] font-black text-slate-900 leading-tight tracking-tight">{data.fullName}</h2>
          <div className="mt-1 flex items-center justify-center">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100 shadow-sm">
              {isStudent ? 'Student' : data.designation || 'Staff'}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 mt-4 space-y-2">
          <div className="grid grid-cols-5 items-center">
            <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID NO</span>
            <span className="col-span-3 text-xs font-bold text-slate-800 flex items-center gap-1"><Award size={12} className="text-indigo-500" /> {idNumber}</span>
          </div>
          <div className="grid grid-cols-5 items-center">
            <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DEPT</span>
            <span className="col-span-3 text-xs font-bold text-slate-800 flex items-center gap-1"><Building size={12} className="text-indigo-500" /> {data.department}</span>
          </div>
          <div className="grid grid-cols-5 items-center">
            <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">BLOOD</span>
            <span className="col-span-3 text-xs font-bold text-red-600 flex items-center gap-1"><BloodIcon size={12} className="text-red-500" /> {data.bloodGroup || 'O+'}</span>
          </div>
          {isStudent && (
            <div className="grid grid-cols-5 items-center">
              <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">YEAR/SEM</span>
              <span className="col-span-3 text-xs font-bold text-slate-800 flex items-center gap-1"><Calendar size={12} className="text-indigo-500" /> {data.year} / {data.semester}</span>
            </div>
          )}
          <div className="grid grid-cols-5 items-center">
            <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">PHONE</span>
            <span className="col-span-3 text-xs font-bold text-slate-800 flex items-center gap-1"><Phone size={12} className="text-indigo-500" /> {data.phone}</span>
          </div>
        </div>

        {/* Footer & Signatures */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="flex justify-between items-end px-6 pb-3 pt-6 bg-gradient-to-t from-slate-50 to-transparent">
            <div className="text-center">
              <div className="w-16 h-6 border-b border-slate-300 mb-1 relative">
                <span className="absolute bottom-1 w-full text-center font-['Brush_Script_MT'] text-sm text-slate-700 opacity-60">signature</span>
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{isStudent ? 'Student' : 'Holder'} Sign</span>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-6 border-b border-slate-300 mb-1 relative">
                <span className="absolute bottom-1 w-full text-center font-['Brush_Script_MT'] text-sm text-slate-800">Prncpl</span>
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Principal</span>
            </div>
          </div>
          <div className="w-full bg-indigo-600 py-1.5 flex justify-center items-center gap-3 shadow-inner">
            <span className="text-indigo-100 text-[8px] font-bold uppercase tracking-widest">Valid Until: {data.academicYear || '2026'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IDCardPreview;
