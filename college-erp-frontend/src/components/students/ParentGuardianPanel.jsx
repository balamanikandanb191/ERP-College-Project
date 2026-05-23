import React from 'react';
import { Users, Phone, MapPin, Briefcase, Mail } from 'lucide-react';

const ParentGuardianPanel = ({ student = {} }) => {
  const safeData = student || {};

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Household & Parent Profile</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Parent contact registrations, addresses, and emergency records</p>
        </div>
      </div>

      {/* Main Parent Details Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Father's Profile */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Users size={16} className="text-indigo-600" />
            Father's Details
          </h4>

          <div className="space-y-2 text-[10px] font-semibold text-slate-700">
            <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center gap-3">
              <Users size={14} className="text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[7px] font-black uppercase">Father's Name</span>
                <span className="text-slate-800 font-black uppercase">{safeData.fatherName || 'Ramanathan Kumar'}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center gap-3">
              <Briefcase size={14} className="text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[7px] font-black uppercase">Occupation</span>
                <span className="text-slate-800 font-black uppercase">{safeData.fatherOccupation || 'Senior Software Consultant'}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center gap-3">
              <Phone size={14} className="text-indigo-500" />
              <div>
                <span className="text-slate-400 block text-[7px] font-black uppercase">Contact phone</span>
                <span className="text-slate-800 font-black">{safeData.parentPhone || safeData.parentMobile || '+91 98452 10943'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mother's Profile */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Users size={16} className="text-indigo-600" />
            Mother's Details
          </h4>

          <div className="space-y-2 text-[10px] font-semibold text-slate-700">
            <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center gap-3">
              <Users size={14} className="text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[7px] font-black uppercase">Mother's Name</span>
                <span className="text-slate-800 font-black uppercase">{safeData.motherName || 'Lakshmi Ramanathan'}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center gap-3">
              <Briefcase size={14} className="text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[7px] font-black uppercase">Occupation</span>
                <span className="text-slate-800 font-black uppercase">{safeData.motherOccupation || 'Homemaker'}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center gap-3">
              <Mail size={14} className="text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[7px] font-black uppercase">Email Address</span>
                <span className="text-slate-800 font-black">lakshmi@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Address & Residence Details */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <MapPin size={16} className="text-indigo-600" />
          Primary Residence Address
        </h4>
        
        <p className="text-[10px] font-bold text-slate-600 bg-slate-50 p-4 border border-slate-200/60 rounded-xl leading-relaxed uppercase">
          {safeData.address || 'Plot 42, Green Gardens, Phase III, Near Central Water Tank, Coimbatore - 641014, Tamil Nadu, India.'}
        </p>
      </div>

    </div>
  );
};

export default ParentGuardianPanel;
