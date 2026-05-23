import React, { useState } from 'react';
import { Shield, Sparkles, Phone, Award, Globe, Heart, Activity } from 'lucide-react';

const StudentSmartID = ({ student = {} }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const safeData = student || {};
  
  const getProfileImage = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';
    const photo = safeData.photoUrl || safeData.profileImage || safeData.photo || '';
    if (!photo) return defaultAvatar;
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    return `http://localhost:5000/${photo}`;
  };
  
  // Dynamic Barcode Simulator
  const barcodeValue = safeData.registerNumber || safeData.reg || 'REG99999';
  const barcodeBars = barcodeValue.split('').map((char, index) => {
    const width = (char.charCodeAt(0) % 4) + 1; // 1px to 4px
    return (
      <div 
        key={index} 
        className="bg-slate-800 h-10" 
        style={{ width: `${width}px`, marginRight: `${(index % 2) + 1}px` }} 
      />
    );
  });

  return (
    <div className="flex items-center justify-center py-4">
      
      {/* 3D Perspective Flip Container */}
      <div 
        className="w-[320px] h-[480px] cursor-pointer perspective-1000 group relative"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`w-full h-full duration-700 transform-style-3d relative transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          
          {/* ================= CARD FRONT ================= */}
          <div className="absolute w-full h-full backface-hidden rounded-[24px] overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between p-6">
            
            {/* Holographic glowing overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/5 to-transparent pointer-events-none mix-blend-overlay opacity-30 animate-pulse" />
            
            {/* Top Bar: College Branding */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <Shield size={18} className="animate-spin-slow text-indigo-300" />
              </div>
              <div>
                <h4 className="text-[10px] font-black tracking-widest text-indigo-300 uppercase leading-none">EduERP University</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Smart ID System</p>
              </div>
              <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>

            {/* RFID Chip & Hologram Overlay */}
            <div className="flex justify-between items-center relative z-10">
              {/* RFID Smart Chip Mock */}
              <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 border border-amber-300 shadow-md flex flex-col justify-between p-1.5 overflow-hidden">
                <div className="grid grid-cols-3 gap-0.5 h-full opacity-60">
                  {[...Array(6)].map((_, i) => <div key={i} className="border-t border-r border-slate-900/40" />)}
                </div>
              </div>
              
              {/* Holographic Seal */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-400 to-yellow-300 opacity-65 flex items-center justify-center border border-white/30 shadow-sm relative">
                <Sparkles size={12} className="text-white animate-spin-slow" />
              </div>
            </div>

            {/* Student Photo & General Profile */}
            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className="relative">
                <img 
                  src={getProfileImage()} 
                  alt={safeData.fullName || safeData.name} 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-400 shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';
                  }}
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-500 text-white rounded-full p-1 border border-white">
                  <Activity size={10} />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-sm font-black tracking-wide text-white leading-tight uppercase">
                  {safeData.fullName || safeData.name || 'John Doe'}
                </h3>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">
                  {safeData.department || 'Computer Science'}
                </p>
                <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase mt-0.5">
                  {safeData.registerNumber || safeData.reg || 'REG99999'}
                </p>
              </div>
            </div>

            {/* Bottom Section: Specific ID properties */}
            <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 text-center relative z-10">
              <div>
                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">Year</span>
                <span className="text-[10px] font-black text-white">{safeData.year || '3rd Year'}</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">Sec</span>
                <span className="text-[10px] font-black text-white">{safeData.section || 'A'}</span>
              </div>
              <div>
                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">Blood</span>
                <span className="text-[10px] font-black text-rose-400 flex items-center justify-center gap-0.5 font-black">
                  <Heart size={8} fill="currentColor" /> {safeData.bloodGroup || 'O+'}
                </span>
              </div>
            </div>

            {/* Bottom Bar: Smart RFID ID value */}
            <div className="flex justify-between items-center text-[7px] font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-white/5 relative z-10">
              <span>RFID: {safeData.rfidCardNumber || 'RFID-9842-83'}</span>
              <span className="text-emerald-400 font-black">VALID IDENTITY</span>
            </div>

          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute w-full h-full rotate-y-180 backface-hidden rounded-[24px] overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between p-6">
            
            {/* Header Back */}
            <div className="border-b border-white/10 pb-3">
              <h4 className="text-[10px] font-black tracking-widest text-indigo-300 uppercase leading-none text-center">Institutional Register</h4>
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest text-center mt-1">Authorized digital profile validation</p>
            </div>

            {/* Detail Blocks */}
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">DOB</span>
                  <span className="text-[9px] font-bold text-white leading-normal">{safeData.dob || '12 Oct 2005'}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">Semester</span>
                  <span className="text-[9px] font-bold text-white leading-normal">{safeData.semester || 'Semester VI'}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-1">
                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">Emergency Contacts</span>
                <p className="text-[9px] font-bold text-white flex items-center gap-1.5">
                  <Phone size={10} className="text-indigo-400" /> Student: {safeData.mobileNumber || safeData.phone || '+91 98452 10943'}
                </p>
                <p className="text-[9px] font-bold text-white flex items-center gap-1.5">
                  <Phone size={10} className="text-rose-400" /> Parent: {safeData.parentPhone || safeData.parentMobile || '+91 98651 23094'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider">Hostel Allocation / Route</span>
                <span className="text-[9px] font-bold text-white">
                  {safeData.hostelBlock ? `Block ${safeData.hostelBlock} • Room ${safeData.roomNumber}` : (safeData.busRoute ? `Route ${safeData.busRoute} • Stop: ${safeData.pickupPoint}` : 'Day Scholar')}
                </span>
              </div>
            </div>

            {/* Simulating Barcode */}
            <div className="flex flex-col items-center space-y-1.5 bg-white border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-center h-10 w-full overflow-hidden">
                {barcodeBars}
              </div>
              <span className="text-[8px] font-black font-mono tracking-widest text-slate-800 leading-none">
                *{barcodeValue}*
              </span>
            </div>

            {/* Terms / Verification */}
            <div className="text-[7px] font-bold text-slate-400 text-center leading-relaxed border-t border-white/10 pt-2 flex items-center justify-center gap-2 uppercase tracking-wide">
              <Globe size={10} /> www.eduerp-univ.edu
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default StudentSmartID;
