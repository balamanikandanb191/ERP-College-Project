import React from 'react';
import { Award, Wifi } from 'lucide-react';

// Portrait Back Layout Switcher
export const renderPortraitBack = ({
  theme,
  isWhiteTheme,
  parentName,
  parentPhone,
  emergencyContact,
  parentAddress,
  isStudent,
  busRoute,
  hostelStatus,
  libraryId,
  accentColor,
  drawQRCode
}) => {
  switch (theme) {
    case 'minimal_light':
      return (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="text-center space-y-0.5 mt-2 pb-2 border-b border-slate-200">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800">
              CAMPUS INSTRUCTIONS
            </h3>
            <p className="text-[6px] text-slate-450 uppercase font-mono">Minimalist Series</p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-1 text-[7.5px] text-slate-650 leading-normal my-2">
            <p>• Wear this card visibly at all times within the campus premises.</p>
            <p>• Show this card to security/library authorities when requested.</p>
            <p>• In case of loss, immediate notification should be given to Registrar.</p>
            <div className="pt-2 border-t border-slate-200 mt-2 space-y-0.5 text-[7.5px] text-slate-700">
              <div><strong>Parent/Guardian:</strong> {parentName} ({parentPhone})</div>
              <div><strong>Emergency:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              {isStudent && <div><strong>Transport:</strong> {busRoute} | <strong>Hostel:</strong> {hostelStatus}</div>}
            </div>
          </div>

          <div className="text-center space-y-0.5 pb-1 border-t border-slate-100 pt-2">
            <p className="text-[5.5px] font-bold text-slate-500">
              Return to: College Registrar Office, Guindy
            </p>
            <p className="text-[5px] font-mono text-slate-400">
              RFID UID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'crimson_bold':
      return (
        <div className="w-full h-full flex justify-between relative pl-8">
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-rose-850 text-white rounded-l-[22px] flex flex-col justify-between py-6 items-center z-20">
            <span className="text-[7px] font-black tracking-widest uppercase -rotate-90 origin-center my-8 whitespace-nowrap opacity-90">
              TERMS & CONDITIONS
            </span>
            <Award size={14} className="text-rose-350" />
          </div>

          <div className="flex-1 flex flex-col justify-between pl-4 py-3">
            <div className="border-b border-rose-500/10 pb-1.5">
              <h3 className="text-[9.5px] font-black text-white uppercase tracking-wider">REGULATIONS</h3>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 space-y-1 text-[7px] text-slate-350 leading-relaxed my-1">
              <p>1. Must be produced on demand by campus authorities.</p>
              <p>2. Misuse of this card is a punishable academic offense.</p>
              <p>3. Replacement charges of ₹500 apply for lost cards.</p>
              <div className="pt-1.5 border-t border-white/10 mt-1.5 space-y-0.5 text-[6.5px]">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div><strong>Emergency Contact:</strong> {emergencyContact}</div>
                <div className="truncate"><strong>Residence Address:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="text-center pt-1 border-t border-white/10">
              <p className="text-[5.5px] font-bold text-rose-350">
                If found, mail to: info@eduerp.com
              </p>
              <p className="text-[5px] font-mono text-slate-450">
                SYS BAR: {libraryId}
              </p>
            </div>
          </div>
        </div>
      );
    case 'dark_cyber':
      return (
        <div className="w-full h-full flex flex-col justify-between font-mono text-cyan-400">
          <div className="flex justify-between items-center border-b border-cyan-500/20 pb-1.5">
            <span className="text-[5.5px] text-cyan-505 font-bold tracking-widest uppercase block">CARD SECURITY SYSTEM</span>
            <Wifi size={10} className="text-cyan-500 animate-pulse" />
          </div>

          <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-2.5 space-y-1 text-[7px] text-cyan-305 leading-relaxed my-2">
            <p className="text-white font-bold">&gt; READ_RULES_CMD:</p>
            <p>1. ACCESS GRANTED TO HOLDER ONLY. DO NOT SHARE CARD.</p>
            <p>2. REPORT LOSS TO NODE ADMINISTRATOR IMMEDIATELY.</p>
            <p>3. CARD CONTAINS SENSITIVE RFID MICRO-CHIP COILS.</p>
            <div className="pt-1.5 border-t border-cyan-500/20 mt-1.5 space-y-0.5 text-[6.5px] text-cyan-400">
              <div>SYS_GUARDIAN: {parentName} // {parentPhone}</div>
              <div>SYS_EMERGENCY: {emergencyContact}</div>
              <div className="truncate">SYS_LOC: {parentAddress}</div>
            </div>
          </div>

          <div className="border-t border-cyan-500/20 pt-1 text-center">
            <p className="text-[5px] text-cyan-500/70 tracking-widest">
              VERIFIED BY SMART_GATEWAY_V2.0
            </p>
            <p className="text-[4.5px] text-slate-500 font-mono mt-0.5">
              RFID ID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'emerald_classic':
      return (
        <div className="w-full h-full flex flex-col justify-between relative p-1.5 font-serif text-slate-200">
          <div className="absolute inset-0 border border-amber-500/30 rounded-[20px] pointer-events-none" />
          <div className="absolute inset-1 border-2 border-amber-500/10 rounded-[18px] pointer-events-none" />

          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="text-center pb-1.5 border-b border-amber-500/20">
              <h3 className="text-[9.5px] font-serif font-black tracking-wider uppercase text-amber-400">
                Academic Rules & Covenants
              </h3>
            </div>

            <div className="bg-emerald-950/40 border border-amber-500/20 rounded-lg p-2.5 space-y-1 text-[7.5px] text-slate-200 leading-relaxed">
              <p>1. The student must display this card on campus.</p>
              <p>2. Property of the college; must be returned upon graduation.</p>
              <p>3. Subject to regulations of the Academic Council.</p>
              <div className="pt-1.5 border-t border-amber-500/20 mt-1.5 space-y-0.5 text-[7px] text-amber-300">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div><strong>Emergency:</strong> {emergencyContact}</div>
                <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="text-center pt-1 border-t border-amber-500/20">
              <p className="text-[5.5px] text-amber-400 font-serif uppercase tracking-widest">
                Dean of Students Affair, Guindy
              </p>
            </div>
          </div>
        </div>
      );
    case 'gold_premium':
      return (
        <div className="w-full h-full flex flex-col justify-between p-2 font-serif text-amber-200">
          <div className="text-center pb-2 border-b border-amber-500/30">
            <h3 className="text-[10px] tracking-wider uppercase text-amber-400 font-black">
              PRIVILEGES & POLICY
            </h3>
          </div>

          <div className="bg-amber-955/20 border border-amber-500/20 rounded-xl p-3 space-y-1 text-[7.5px] text-stone-300 leading-relaxed my-2">
            <p>• Holders are granted access to Convocation & Alumni Lounges.</p>
            <p>• Must be presented to claim institutional benefits.</p>
            <p>• Misconduct may lead to revocation of convocation membership.</p>
            <div className="pt-1.5 border-t border-amber-500/20 mt-1.5 space-y-0.5 text-[7px] text-amber-400">
              <div><strong>Guardian Contact:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Contact:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Registered Residence:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="border-t border-amber-500/30 pt-2 flex justify-between items-center text-[5.5px] text-stone-500 uppercase tracking-widest">
            <span>ESTD 1984</span>
            <span>ALUMNI ASSOC</span>
          </div>
        </div>
      );
    case 'medical_clean':
      return (
        <div className="w-full h-full flex flex-col justify-between text-slate-700">
          <div className="bg-teal-700 text-white rounded-t-[22px] p-2 text-center -mx-6 -mt-6 relative">
            <h3 className="text-[9.5px] font-black uppercase tracking-wider">
              CLINICAL CARD RULES
            </h3>
          </div>

          <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3 space-y-1 text-[7.5px] text-slate-650 leading-relaxed my-2">
            <p className="font-bold text-teal-800">CLINICAL REGULATIONS:</p>
            <p>1. Must be worn visibly on lab coats inside hospital areas.</p>
            <p>2. Report immediate loss to hospital security control desk.</p>
            <p>3. Return this card to administration upon service completion.</p>
            <div className="pt-1.5 border-t border-teal-200 mt-1.5 space-y-0.5 text-[7px] text-slate-700">
              <div><strong>Emergency Contact:</strong> {parentName} ({parentPhone})</div>
              <div><strong>Primary Hospital:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Residential:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-1 text-center">
            <p className="text-[5.5px] font-bold text-teal-700">
              Medical Superintendent Signature Verified
            </p>
            <p className="text-[5px] font-mono text-slate-400">
              SYS ID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'orange_sunset':
      return (
        <div className="w-full h-full flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-0.5 border-b border-orange-500/20 pb-1.5">
            <h3 className="text-[9.5px] font-black uppercase tracking-wider text-orange-400">
              CAMPUS PROTOCOL
            </h3>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1 text-[7.5px] text-slate-300 leading-relaxed my-2">
            <p>1. Essential for entry to workshops, labs, and studios.</p>
            <p>2. Subject to campus safety regulations and checks.</p>
            <p>3. If found, please drop in the nearest campus dropbox.</p>
            <div className="pt-1.5 border-t border-white/10 mt-1.5 space-y-0.5 text-[6.5px]">
              <div><strong>Parent/Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Desk:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-1 text-center">
            <p className="text-[5.5px] text-orange-300">
              Creative Director, School of Arts
            </p>
            <p className="text-[5px] font-mono text-slate-500">
              LIB ID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'modern_indigo':
      return (
        <div className="w-full h-full flex flex-col justify-between text-slate-200">
          <div className="text-center space-y-0.5 mt-2 pb-2 border-b border-indigo-500/20">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              TERMS & DISCLOSURES
            </h3>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 text-[7.5px] text-slate-355 leading-relaxed my-2">
            <p>• Wear this card at all times within university gates.</p>
            <p>• Do not alter, deface, or copy this identity badge.</p>
            <p>• Report loss to System Support node for deactivated RFID.</p>
            <div className="pt-1.5 border-t border-indigo-500/20 mt-1.5 space-y-0.5 text-[7px]">
              <div><strong>Parent/Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Contact:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              {isStudent && <div><strong>Bus Route:</strong> {busRoute} | <strong>Hostel:</strong> {hostelStatus}</div>}
            </div>
          </div>

          <div className="text-center pt-1 border-t border-white/10 space-y-0.5">
            <p className="text-[5.5px] font-bold text-indigo-300">
              Admin Office, EduERP Academy
            </p>
            <p className="text-[5px] font-mono text-slate-500">
              SYS ID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'glass_translucent':
      return (
        <div className="w-full h-full flex flex-col justify-between text-white/90">
          <div className="text-center pb-2 border-b border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
              SAFETY & CONDITIONS
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1 text-[7.5px] text-white/70 leading-relaxed my-2 backdrop-blur-md">
            <p>• Show this card upon entrance to the secure laboratory zones.</p>
            <p>• Card is non-transferable and remains property of the registrar.</p>
            <p>• If lost, a replacement fine is applicable via admin desk.</p>
            <div className="pt-1.5 border-t border-white/10 mt-1.5 space-y-0.5 text-[7px] text-white/80">
              <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Contact:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="text-center pt-1 border-t border-white/10">
            <p className="text-[5.5px] text-indigo-300">
              Registrar Office, Anna University Guindy
            </p>
            <p className="text-[5px] font-mono text-white/40">
              SYS ID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'sky_professional':
      return (
        <div className="w-full h-full flex flex-col justify-between text-slate-200">
          <div className="text-center pb-2 border-b border-sky-500/20">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-sky-400">
              CAMPUS INSTRUCTIONS
            </h3>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 text-[7.5px] text-slate-350 leading-relaxed my-2">
            <p>• Wear this card visibly at all times in the professional campus.</p>
            <p>• Show this card for attendance logging and library checkouts.</p>
            <p>• Inform registrar of any changes in residency immediately.</p>
            <div className="pt-1.5 border-t border-sky-500/20 mt-1.5 space-y-0.5 text-[7px]">
              <div><strong>Parent/Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Desk:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Home Address:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="text-center pt-1 border-t border-white/10">
            <p className="text-[5.5px] text-sky-400">
              EduERP Professional Campus Registrar
            </p>
            <p className="text-[5px] font-mono text-slate-500">
              SYS ID: {libraryId}
            </p>
          </div>
        </div>
      );
    case 'custom':
      return (
        <div className="w-full h-full flex flex-col justify-between text-white/90">
          <div className="text-center pb-2 border-b border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-wider font-bold" style={{ color: accentColor }}>
              CAMPUS CARD DISCLOSURE
            </h3>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 text-[7.5px] text-slate-300 leading-relaxed my-2">
            <p>• Wear this card at all times inside campus buildings.</p>
            <p>• Access permission is granted according to roles.</p>
            <p>• Return this card upon departure from the institute.</p>
            <div className="pt-1.5 border-t border-white/10 mt-1.5 space-y-0.5 text-[7px]">
              <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency:</strong> {emergencyContact}</div>
              <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="text-center pt-1 border-t border-white/10">
            <p className="text-[5.5px]" style={{ color: accentColor }}>
              Custom Configured ERP Card
            </p>
            <p className="text-[5px] font-mono text-slate-500">
              SYS ID: {libraryId}
            </p>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex flex-col justify-between relative z-10 text-left">
          <div className="text-center space-y-0.5 mt-2">
            <h3 className={`text-[9px] font-black uppercase tracking-wider ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>
              INSTRUCTIONS & CAMPUS RULES
            </h3>
            <div className="w-10 h-0.5 bg-indigo-500 mx-auto rounded" />
          </div>

          <div className={`rounded-xl p-2.5 border text-left ${isWhiteTheme ? 'bg-slate-100/90 border-slate-250 text-slate-700' : 'bg-white/5 border-white/5 text-slate-300'} space-y-1 text-[7.5px] leading-relaxed my-2`}>
            <p>1. This card must be worn at all times inside the campus premises.</p>
            <p>2. In case of loss, report immediately to the library/registrar.</p>
            <div className="pt-1.5 border-t border-white/10 mt-1.5 space-y-0.5 text-[7px]">
              <div><strong>Parent/Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Contact:</strong> {emergencyContact}</div>
              <div><strong>Address:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="text-center space-y-0.5 pb-1">
            <p className={`text-[5.5px] font-bold opacity-75 ${isWhiteTheme ? 'text-slate-600' : 'text-slate-400'}`}>
              If found, please return to the College Office.
            </p>
          </div>
        </div>
      );
  }
};

// Landscape Back Layout Switcher
export const renderLandscapeBack = ({
  theme,
  isWhiteTheme,
  parentName,
  parentPhone,
  emergencyContact,
  parentAddress,
  isStudent,
  busRoute,
  hostelStatus,
  libraryId,
  accentColor,
  drawQRCode
}) => {
  switch (theme) {
    case 'minimal_light':
      return (
        <div className="w-full h-full flex items-center gap-4 pl-28 relative">
          <div className="absolute top-0 left-0 bottom-0 w-28 bg-indigo-900 text-white rounded-l-[22px] flex flex-col justify-between py-4 px-2 items-center text-center">
            <h3 className="text-[8px] font-black tracking-wider uppercase leading-tight">
              CAMPUS RULES
            </h3>
            <p className="text-[4.5px] font-mono opacity-80 leading-none">
              Minimalist Series
            </p>
            <div className="bg-white p-0.5 rounded border border-slate-200">
              {drawQRCode(libraryId, 18)}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between h-full py-2.5">
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 space-y-1 text-[7.5px] text-slate-600 leading-normal">
              <p>1. Must be worn visibly at all times within campus premises.</p>
              <p>2. Subject to inspection by campus safety officers.</p>
              <div className="pt-1.5 border-t border-slate-200 mt-1 space-y-0.5 text-[7px] text-slate-700">
                <div><strong>Parent:</strong> {parentName} | {parentPhone}</div>
                <div><strong>Emergency:</strong> {emergencyContact}</div>
                <div className="truncate"><strong>Addr:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="text-center border-t border-slate-100 pt-1 text-[5px] text-slate-500">
              Registrar Office, Sardar Patel Road
            </div>
          </div>
        </div>
      );
    case 'crimson_bold':
      return (
        <div className="w-full h-full flex flex-col justify-between relative pt-8">
          <div className="absolute top-0 left-0 right-0 h-8 bg-rose-850 text-white rounded-t-[22px] flex items-center justify-between px-4 z-20">
            <h3 className="text-[8.5px] font-black uppercase tracking-wider">REGULATIONS</h3>
            <span className="text-[6.5px] font-black tracking-widest uppercase opacity-90">CAMPUS PROTCOL</span>
          </div>

          <div className="flex-1 flex gap-4 items-center mt-2 py-1">
            <div className="bg-white/5 border border-white/5 rounded-lg p-2 space-y-1 text-[7px] text-slate-355 leading-relaxed flex-1">
              <p>• Wear card at all times. Subject to verification by campus safety.</p>
              <p>• Replacement fine is applicable for damaged or lost cards.</p>
              <div className="pt-1 border-t border-white/10 mt-1 space-y-0.5 text-[6.5px] text-rose-300">
                <div><strong>Guardian:</strong> {parentName} ({parentPhone}) | <strong>Emergency:</strong> {emergencyContact}</div>
                <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="w-16 h-16 bg-white/10 rounded-md flex items-center justify-center p-0.5 shrink-0">
              {drawQRCode(libraryId, 22)}
            </div>
          </div>
        </div>
      );
    case 'dark_cyber':
      return (
        <div className="w-full h-full flex gap-3 font-mono text-cyan-400">
          <div className="w-[30%] flex flex-col items-center justify-center space-y-2 border-r border-cyan-500/25 pr-2 text-center">
            <span className="text-[6px] text-cyan-500 font-black tracking-widest">DECRYPT NODE</span>
            <div className="bg-white p-0.5 rounded border border-cyan-500/20">{drawQRCode(libraryId, 20)}</div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-1.5 h-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[4.5px] text-cyan-500 block uppercase font-bold tracking-widest leading-none">RFID RULES CONFIG</span>
                <h3 className="text-[9px] font-black text-white leading-tight uppercase">SECURE PASS TERMINAL</h3>
              </div>
            </div>

            <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-2 space-y-1 text-[7px] text-cyan-300">
              <p>&gt; Wear visibly inside gateway node.</p>
              <p>&gt; Replacement fine of ₹500 applies for damage.</p>
              <div className="pt-1.5 border-t border-cyan-500/20 mt-1.5 space-y-0.5 text-[6.5px] text-cyan-400">
                <div>SYS_GUARDIAN: {parentName} | {parentPhone}</div>
                <div className="truncate">SYS_LOC: {parentAddress}</div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'emerald_classic':
      return (
        <div className="w-full h-full flex flex-col justify-between relative p-1 font-serif text-slate-200">
          <div className="absolute inset-0 border border-amber-500/30 rounded-[20px] pointer-events-none" />
          <div className="absolute inset-0.5 border-2 border-amber-500/10 rounded-[18px] pointer-events-none" />

          <div className="w-full h-full flex gap-3 items-center p-2.5">
            <div className="bg-emerald-950/40 border border-amber-500/20 rounded-lg p-2.5 space-y-1 text-[7.5px] text-slate-200 font-serif flex-1">
              <h2 className="text-[8.5px] font-serif font-black tracking-wider uppercase text-amber-400 pb-1 border-b border-amber-500/20">
                Academic Conduct Regulations
              </h2>
              <p>1. Must be displayed to access libraries and classrooms.</p>
              <p>2. Subject to university conduct standards.</p>
              <div className="pt-1.5 border-t border-amber-500/20 mt-1.5 space-y-0.5 text-[7px] text-amber-305">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Addr:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center shrink-0">
              <div className="bg-white p-0.5 rounded border border-amber-500/40">{drawQRCode(libraryId, 18)}</div>
              <span className="text-[5px] text-amber-400 tracking-wider">ESTD 1984</span>
            </div>
          </div>
        </div>
      );
    case 'gold_premium':
      return (
        <div className="w-full h-full flex gap-4 items-center p-2 font-serif text-amber-200">
          <div className="flex-1 flex flex-col justify-between h-full py-1.5">
            <div>
              <h2 className="text-[8.5px] font-serif font-black tracking-wider uppercase text-amber-400 leading-none pb-1 border-b border-amber-500/20">
                MEMBERSHIP RULES
              </h2>
            </div>

            <div className="bg-amber-955/20 border border-amber-500/20 rounded-lg p-2 space-y-1 text-[7.5px] text-stone-300">
              <p>• Nontransferable card granting premium campus access.</p>
              <p>• Immediate notification of loss is requested.</p>
              <div className="pt-1 border-t border-amber-500/20 mt-1 space-y-0.5 text-[7px] text-amber-400">
                <div><strong>Parent/Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center shrink-0">
            <div className="bg-white p-0.5 rounded border border-amber-50">{drawQRCode(libraryId, 18)}</div>
            <span className="text-[5px] text-stone-500 uppercase tracking-widest">ALUMNI SEALS</span>
          </div>
        </div>
      );
    case 'medical_clean':
      return (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="bg-teal-700 text-white rounded-t-[22px] p-2 text-center -mx-6 -mt-6 relative flex justify-between items-center px-4">
            <h2 className="text-[8.5px] font-black tracking-wider uppercase">
              CLINICAL CARD COMPLIANCE
            </h2>
          </div>

          <div className="flex-1 flex gap-3 items-center mt-2.5 py-0.5">
            <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-2 space-y-1 text-[7px] text-slate-655 flex-1">
              <p className="font-bold text-teal-800">COMPLIANCE RULES:</p>
              <p>1. Must be worn on clinical scrubs at all times.</p>
              <p>2. Subject to verification by hospital security team.</p>
              <div className="pt-1 border-t border-teal-200 mt-1 space-y-0.5 text-[7px] text-slate-700">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Residential:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="bg-white p-0.5 border border-slate-200 rounded shrink-0">
              {drawQRCode(libraryId, 20)}
            </div>
          </div>
        </div>
      );
    case 'orange_sunset':
      return (
        <div className="w-full h-full flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex gap-4 items-center h-full">
            <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 space-y-1 text-[7.5px] text-slate-300 leading-relaxed flex-1">
              <h3 className="text-[9px] font-black uppercase tracking-wider text-orange-400 pb-1 border-b border-orange-500/20">
                CAMPUS REGULATIONS
              </h3>
              <p>1. Show card for access to labs and studios.</p>
              <p>2. Report loss instantly for database block.</p>
              <div className="pt-1.5 border-t border-white/10 mt-1 space-y-0.5 text-[6.5px]">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Addr:</strong> {parentAddress}</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="bg-white p-0.5 rounded border border-orange-500/30">{drawQRCode(libraryId, 20)}</div>
              <span className="text-[5px] text-slate-500 font-mono">{libraryId}</span>
            </div>
          </div>
        </div>
      );
    case 'modern_indigo':
      return (
        <div className="w-full h-full flex gap-4 items-center text-slate-200">
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div>
              <h2 className="text-[8.5px] font-black tracking-wider uppercase text-indigo-400 leading-none pb-1 border-b border-indigo-500/20">
                CAMPUS CARD REGULATIONS
              </h2>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-2 space-y-1 text-[7.5px] text-slate-350">
              <p>• Carry card at all times. Required for secure access logs.</p>
              <p>• Contact node administrator in case card is misplaced.</p>
              <div className="pt-1 border-t border-white/10 mt-1 space-y-0.5 text-[7px] text-indigo-305">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Residence Address:</strong> {parentAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[28px]">
              {drawQRCode(libraryId, 22)}
            </div>
            <span className="text-[5px] text-slate-500 font-mono">{libraryId}</span>
          </div>
        </div>
      );
    case 'glass_translucent':
      return (
        <div className="w-full h-full flex gap-4 items-center text-white/95">
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div>
              <h2 className="text-[8.5px] font-black tracking-wider uppercase text-indigo-300 leading-none pb-1 border-b border-white/10">
                TRANS-PASS CLAUSES
              </h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-2 space-y-1 text-[7.5px] text-white/70 backdrop-blur-md">
              <p>• Access granted to credentialed areas only.</p>
              <p>• Report card loss immediately to register office.</p>
              <div className="pt-1 border-t border-white/10 mt-1 space-y-0.5 text-[7px] text-indigo-200">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="bg-white p-0.5 rounded border border-white/20 shadow-xs max-w-[28px]">
              {drawQRCode(libraryId, 22)}
            </div>
            <span className="text-[5px] text-white/40 font-mono">{libraryId}</span>
          </div>
        </div>
      );
    case 'sky_professional':
      return (
        <div className="w-full h-full flex gap-4 items-center text-slate-200">
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div>
              <h2 className="text-[8.5px] font-black tracking-wider uppercase text-sky-400 leading-none pb-1 border-b border-sky-500/20">
                REGULATORY NOTICES
              </h2>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-2 space-y-1 text-[7.5px] text-slate-355">
              <p>• This card remains the property of university administration.</p>
              <p>• Replacement fees apply in case of card damage or theft.</p>
              <div className="pt-1 border-t border-white/10 mt-1 space-y-0.5 text-[7px] text-sky-400">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[28px]">
              {drawQRCode(libraryId, 22)}
            </div>
            <span className="text-[5px] text-slate-500 font-mono">{libraryId}</span>
          </div>
        </div>
      );
    case 'custom':
      return (
        <div className="w-full h-full flex gap-4 items-center text-white/95">
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div>
              <h2 className="text-[8.5px] font-black tracking-wider uppercase leading-none pb-1 border-b border-white/10" style={{ color: accentColor }}>
                CAMPUS NOTICES
              </h2>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-2 space-y-1 text-[7.5px] text-slate-355">
              <p>• Nontransferable campus identification pass.</p>
              <p>• Access logs synced in real-time with central database.</p>
              <div className="pt-1 border-t border-white/10 mt-1 space-y-0.5 text-[7px]">
                <div><strong>Guardian:</strong> {parentName} | {parentPhone}</div>
                <div className="truncate"><strong>Address:</strong> {parentAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[28px]">
              {drawQRCode(libraryId, 22)}
            </div>
            <span className="text-[5px] text-slate-500 font-mono">{libraryId}</span>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex flex-col justify-between relative z-10 text-left">
          <div className="text-center space-y-0.5 mt-2">
            <h3 className={`text-[9px] font-black uppercase tracking-wider ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>
              INSTRUCTIONS & CAMPUS RULES
            </h3>
            <div className="w-10 h-0.5 bg-indigo-500 mx-auto rounded" />
          </div>

          <div className={`rounded-xl p-2.5 border text-left ${isWhiteTheme ? 'bg-slate-100/90 border-slate-250 text-slate-700' : 'bg-white/5 border-white/5 text-slate-300'} space-y-1 text-[7.5px] leading-relaxed my-2`}>
            <p>1. This card must be worn at all times inside the campus premises.</p>
            <p>2. In case of loss, report immediately to the library/registrar.</p>
            <div className="pt-1.5 border-t border-white/10 mt-1.5 space-y-0.5 text-[7px]">
              <div><strong>Parent/Guardian:</strong> {parentName} | {parentPhone}</div>
              <div><strong>Emergency Contact:</strong> {emergencyContact}</div>
              <div><strong>Address:</strong> {parentAddress}</div>
            </div>
          </div>

          <div className="text-center space-y-0.5 pb-1">
            <p className={`text-[5.5px] font-bold opacity-75 ${isWhiteTheme ? 'text-slate-600' : 'text-slate-400'}`}>
              If found, please return to the College Office.
            </p>
          </div>
        </div>
      );
  }
};
