import React, { useState } from 'react';
import { 
  Home, Bus, Key, User, Phone, 
  Clock, ShieldAlert, Navigation, Calendar 
} from 'lucide-react';

const StudentTransportPanel = ({ student = {} }) => {
  const safeData = student || {};

  // Infer initial category dynamically from Single Source of Truth
  const defaultCategory = safeData.hostelBlock ? 'hostel' : 
                         (safeData.busRoute ? 'bus' : 'vehicle');

  const [category, setCategory] = useState(defaultCategory);

  return (
    <div className="space-y-6">
      
      {/* Title & Toggle Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Hostel & Campus Logistics</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Warden listings, route timetables, and parking clearances</p>
        </div>

        {/* Dynamic Category Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
          <button 
            onClick={() => setCategory('hostel')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
              category === 'hostel' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Hostel Room
          </button>
          <button 
            onClick={() => setCategory('bus')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
              category === 'bus' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Bus Route
          </button>
          <button 
            onClick={() => setCategory('vehicle')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
              category === 'vehicle' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Own Vehicle
          </button>
        </div>
      </div>

      {/* ================= CATEGORY 1: HOSTEL ================= */}
      {category === 'hostel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Allocation Room</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Home size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">Block {safeData.hostelBlock || 'C'}</h4>
                  <p className="text-[10px] font-bold text-slate-500">Room Number: {safeData.roomNumber || '304'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Warden In-charge</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">Dr. M. Sathyasundaram</h4>
                  <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Phone size={8} /> Ext: 8493
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Mess Plan Type</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">South Veg Special</h4>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-black">Active</p>
                </div>
              </div>
            </div>

          </div>

          {/* Visitor Log Simulation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              Recent Room Visitor Clearance Logs
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5">Visitor Name</th>
                    <th className="py-2.5">Relationship</th>
                    <th className="py-2.5">Clearance Date</th>
                    <th className="py-2.5 text-right">Timing Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[10px] font-semibold text-slate-700">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-slate-800 font-bold">Ramanathan K.</td>
                    <td className="py-3 text-slate-500">Father</td>
                    <td className="py-3 text-slate-800 font-bold">12 May 2026</td>
                    <td className="py-3 text-right text-slate-500">09:00 AM - 05:00 PM</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-slate-800 font-bold">Suresh Ramanathan</td>
                    <td className="py-3 text-slate-500">Local Guardian</td>
                    <td className="py-3 text-slate-800 font-bold">22 Apr 2026</td>
                    <td className="py-3 text-right text-slate-500">02:00 PM - 06:00 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= CATEGORY 2: BUS ================= */}
      {category === 'bus' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Pickup & Route</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Bus size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">Route {safeData.busRoute || '24'}</h4>
                  <p className="text-[10px] font-bold text-slate-500">Point: {safeData.pickupPoint || 'Central Station'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Route Timetable</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">07:45 AM Arrival</h4>
                  <p className="text-[10px] font-bold text-slate-500">Return Departure: 04:45 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Driver Details</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">Mr. Gurumoorthy K.</h4>
                  <p className="text-[10px] font-bold text-slate-500">+91 97845 09243</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= CATEGORY 3: VEHICLE ================= */}
      {category === 'vehicle' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Vehicle Plate & Type</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Navigation size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">{safeData.vehicleNumber || 'TN-37-BY-8492'}</h4>
                  <p className="text-[10px] font-bold text-slate-500">Type: {safeData.vehicleType || 'Two Wheeler'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Parking pass clearance</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">PASS: #{safeData.parkingPassId || 'PRK-38491'}</h4>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-black">VALID CLEARANCE</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Campus Parking Zone</span>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Home size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">Zone - B (East Yard)</h4>
                  <p className="text-[10px] font-bold text-slate-500">Strictly helmet mandatory</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentTransportPanel;
