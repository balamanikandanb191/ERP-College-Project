import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Search, Filter, Download, 
  CheckCircle, Clock, AlertCircle, User,
  Mail, Phone, FileText, Send
} from 'lucide-react';
import api from '../../services/api';
import SafeErrorBoundary from '../SafeErrorBoundary';

const PlacementFees = ({ dashboardStats, setDashboardStats }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/placement/fees');
      const data = response.data;
      if (data && Array.isArray(data)) {
        setFees(data);
        
        // Sync with shared stats
        const paidCount = data.filter(f => f.status === 'Paid').length;
        const pendingCount = data.filter(f => f.status !== 'Paid').length;
        const totalFees = data.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
        
        if (setDashboardStats) {
           setDashboardStats(prev => ({
              ...prev,
              feesPaidStudents: paidCount,
              feesPendingStudents: pendingCount,
              totalFeesCollected: totalFees
           }));
        }
      } else {
        setFees([]);
      }
    } catch (error) {
      console.error('Failed to fetch fees:', error);
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const safeFees = Array.isArray(fees) ? fees : [];
  const filteredFees = safeFees.filter(f => 
    (f?.Student?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f?.Student?.registerNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by student name or register no..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 flex items-center justify-center gap-2 transition-all text-xs">
               <Filter size={16} /> Filter
            </button>
            <button className="flex-1 md:flex-none px-4 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 text-xs">
               <Send size={16} /> Remind All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Receipt Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan="5" className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <AlertCircle size={48} className="text-slate-200 mb-2" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">No placement fee records found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredFees.map((fee) => (
                <tr key={fee?.id || Math.random()} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                         {fee?.Student?.fullName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-tight">{fee?.Student?.fullName || 'Unknown Student'}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{fee?.Student?.registerNumber || '---'} • {fee?.Student?.department || '---'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="font-black text-slate-900 tracking-tight">₹{(fee?.amount || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      fee?.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                      fee?.status === 'Partial' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                      'bg-rose-100 text-rose-700 border-rose-200'
                    }`}>
                      {fee?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {fee?.receiptNumber ? (
                      <div>
                        <p className="text-xs font-black text-slate-700">{fee.receiptNumber}</p>
                        <p className="text-[10px] font-bold text-slate-400">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : ''}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">No receipt</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                       <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SafeErrorBoundary>
  );
};

export default PlacementFees;
