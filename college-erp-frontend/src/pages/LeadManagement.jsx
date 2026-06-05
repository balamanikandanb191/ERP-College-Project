import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ArrowRight, Star, AlertCircle, Phone, UserCheck, CheckCircle, Flame, ShieldAlert, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { confirmDelete } from '../utils/confirmToast';

const STATUSES = ['New', 'Follow-up', 'Interested', 'Confirmed', 'Rejected', 'Closed'];

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Top Dashboard stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    confirmedLeads: 0,
    rejectedClosedLeads: 0
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/enquiries/dashboard-stats');
      if (res.data && res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard statistics:', error);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries', {
        params: {
          page,
          limit,
          search,
          status: statusFilter === 'All Status' || statusFilter === 'All' ? undefined : statusFilter
        }
      });
      if (res.data && res.data.success) {
        setLeads(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.total);
      }
    } catch (error) {
      console.error('Failed to load lead management records:', error);
      toast.error('Failed to load leads from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [page, limit, search, statusFilter]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await api.put(`/enquiries/${leadId}`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Lead status updated to ${newStatus}`);
        fetchLeads();
        fetchStats(); // refresh top statistics automatically after updates
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
      toast.error('Failed to save status change.');
    }
  };

  const deleteLead = async id => {
    confirmDelete(async () => {
      try {
        const res = await api.delete(`/enquiries/${id}`);
        if (res.data && res.data.success) {
          toast.success('Lead deleted successfully');
          fetchLeads();
          fetchStats();
        }
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }, 'Are you sure you want to delete this lead?');
  };

  const getStatusStyle = s => {
    if (s === 'Confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'Rejected') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (s === 'Follow-up') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s === 'Interested') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (s === 'Closed') return 'bg-slate-100 text-slate-600 border-slate-300';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
          <h1 className="text-3xl font-black mt-2">Lead Pipeline Management</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Track, qualify, and promote prospective leads through the admissions pipeline stages</p>
        </div>
      </div>

      {/* Dashboard KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.totalLeads, desc: 'Total history leads logged', icon: UserCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Active Leads', value: stats.activeLeads, desc: 'Follow-up / Interested active', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Confirmed Leads', value: stats.confirmedLeads, desc: 'Conversion success: Verified', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Rejected/Closed', value: stats.rejectedClosedLeads, desc: 'Dropped leads / Requires review', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-100' }
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{s.value}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">{s.desc}</p>
                </div>
                <div className={`p-3 rounded-xl border ${s.color}`}><Icon size={16} /></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
          <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Filter by student name, phone, or EQID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-3">
          <select 
            className="border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
            value={statusFilter} 
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="All Status">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>Status: {s}</option>)}
          </select>
          <select 
            className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
            value={limit} 
            onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
          >
            <option value={10}>10 Entries</option>
            <option value={25}>25 Entries</option>
            <option value={50}>50 Entries</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">EQID</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Student Reg No</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">City</th>
                <th className="px-5 py-4">Tenant ID</th>
                <th className="px-5 py-4">Staff ID</th>
                <th className="px-5 py-4">Staff Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Calls</th>
                <th className="px-5 py-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-slate-400 font-bold">Loading pipeline records...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-slate-400 font-bold">No leads found matching criteria</td>
                </tr>
              ) : (
                leads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4 text-xs font-black text-indigo-600 font-mono">{l.eqid}</td>
                    <td className="px-5 py-4 font-black text-slate-800">{l.studentName}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600 font-mono">{l.mobileNo}</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-500 font-bold">{l.studentRegNo || '-'}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">{l.source}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">{l.city || l.district}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-400">{l.tenantId || 'Tenant'}</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-400 font-semibold">{l.staffId || '-'}</td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-600">{l.staffName || 'Unassigned'}</td>
                    <td className="px-5 py-4">
                      <select 
                        value={l.status}
                        onChange={e => handleStatusChange(l.id, e.target.value)}
                        className={`text-[10px] font-black px-2 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusStyle(l.status)}`}
                      >
                        {STATUSES.map(st => (
                          <option key={st} value={st} className="bg-white text-slate-700 font-semibold">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-black text-slate-900">{l.calls || 0}</td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => deleteLead(l.id)} 
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20 text-xs font-bold text-slate-500">
            <div>
              Showing page {page} of {totalPages} ({totalRecords} total records)
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
