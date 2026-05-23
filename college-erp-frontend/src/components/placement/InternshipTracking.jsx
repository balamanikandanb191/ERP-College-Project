import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Filter, Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import SafeErrorBoundary from '../SafeErrorBoundary';

const InternshipTracking = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await api.get('/placement/internships');
      if (response.data && Array.isArray(response.data)) {
        setInternships(response.data);
      } else {
        setInternships([]);
      }
    } catch (error) {
      console.error('Failed to fetch internships:', error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const safeInternships = Array.isArray(internships) ? internships : [];

  return (
    <SafeErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Briefcase size={20}/></div>
             <div><p className="text-[10px] font-black text-slate-400 uppercase">Active Interns</p><p className="text-xl font-black text-slate-900">{safeInternships.length}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse"></div>)
          ) : safeInternships.length === 0 ? (
            <div className="lg:col-span-2 p-20 bg-white rounded-[40px] border border-slate-100 flex flex-col items-center justify-center text-slate-400">
               <Briefcase size={48} className="mb-4 opacity-20" />
               <p className="font-bold uppercase tracking-wider">No internship records tracked yet</p>
            </div>
          ) : safeInternships.map(intern => (
            <div key={intern?.id || Math.random()} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Briefcase size={24} />
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{intern?.companyName || 'Unknown Company'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{intern?.Student?.fullName || 'Student'} • {intern?.Student?.department || '---'}</p>
                     </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${intern?.completionStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                     {intern?.completionStatus || 'In Progress'}
                  </span>
               </div>

               <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-slate-400" />
                     <span className="text-xs font-bold text-slate-600">{intern?.duration || '3 Mo'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <User size={14} className="text-slate-400" />
                     <span className="text-xs font-bold text-slate-600 truncate">{intern?.guideName || 'Self'}</span>
                  </div>
                  <div className="flex items-center justify-end text-indigo-600">
                     <ChevronRight size={18} />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </SafeErrorBoundary>
  );
};

export default InternshipTracking;
