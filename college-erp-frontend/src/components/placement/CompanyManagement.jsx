import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, Filter, Globe, 
  Phone, Mail, MapPin, Briefcase, ExternalLink,
  Calendar, CheckCircle, Clock, XCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SafeErrorBoundary from '../SafeErrorBoundary';

const CompanyManagement = ({ dashboardStats, setDashboardStats }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/placement/companies');
      const data = response.data;
      if (data && Array.isArray(data)) {
        setCompanies(data);
        
        // Sync with shared stats
        const activeCompanies = data.filter(c => c.status === 'Active').length;
        const packages = data.map(c => Number(c.packageOffered) || 0).filter(p => p > 0);
        const highest = packages.length > 0 ? Math.max(...packages) : 0;
        const average = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;
        
        if (setDashboardStats) {
           setDashboardStats(prev => ({
              ...prev,
              companiesVisiting: activeCompanies,
              highestPackage: highest,
              averagePackage: average
           }));
        }
      } else {
        setCompanies([]);
        console.error("Invalid company data format:", data);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const safeCompanies = Array.isArray(companies) ? companies : [];
  const filteredCompanies = safeCompanies.filter(c => 
    (c?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  return (
    <SafeErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        {/* Toolbar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by company name..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <select className="flex-1 md:flex-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none">
                <option>All Industries</option>
                <option>IT / Software</option>
                <option>Manufacturing</option>
                <option>Banking / Finance</option>
             </select>
             <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-[40px]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div key={company?.id || Math.random()} className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:bg-white transition-colors">
                      {company?.logoUrl ? (
                        <img src={`http://localhost:5000/${company.logoUrl}`} alt={company.name} className="max-h-full object-contain" />
                      ) : (
                        <Building2 size={32} className="text-slate-300" />
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(company?.status)}`}>
                      {company?.status || 'Unknown'}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      {company?.name || 'Unnamed Company'}
                      {company?.website && <a href={company.website} target="_blank" rel="noreferrer"><ExternalLink size={14} className="text-slate-400 hover:text-indigo-600" /></a>}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{company?.industryType || 'IT / Software'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Package (LPA)</p>
                        <p className="text-lg font-black text-slate-800">₹{company?.packageOffered || '0'}</p>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-emerald-50/50 transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Min CGPA</p>
                        <p className="text-lg font-black text-emerald-700">{company?.minCGPA || '6.0'}</p>
                     </div>
                  </div>

                  <div className="space-y-3 pt-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Briefcase size={14} className="text-slate-400" />
                        <span>{company?.jobRole || 'Software Engineer'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar size={14} className="text-slate-400" />
                        <span>Drive Date: {company?.driveDate ? new Date(company.driveDate).toLocaleDateString() : 'TBA'}</span>
                     </div>
                  </div>
                </div>
                
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <button className="text-xs font-black text-slate-600 uppercase hover:text-indigo-600 transition-colors">View Details</button>
                   <button className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Schedule Drive</button>
                </div>
              </div>
            ))}
            
            {/* Add New Company Card */}
            <div className="bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-white transition-all cursor-pointer group min-h-[300px]">
               <div className="p-4 bg-white rounded-3xl shadow-sm text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all mb-4">
                  <Plus size={32} />
               </div>
               <h4 className="text-lg font-black text-slate-700">Add New Partner</h4>
               <p className="text-sm text-slate-400 font-medium text-center mt-1">Register a new company for placement drives</p>
            </div>
          </div>
        )}
      </div>
    </SafeErrorBoundary>
  );
};

export default CompanyManagement;
