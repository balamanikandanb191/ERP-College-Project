import React, { useState, useEffect } from 'react';
import { Search, Phone, MessageSquare, AlertCircle, Plus, Flame, Clock, Check, RefreshCw, UserCheck, ShieldAlert, Award, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CallerDetails = () => {
  const [callerStats, setCallerStats] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    enquiryId: '',
    callStatus: 'Follow-up',
    notes: ''
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch caller stats
      const statsRes = await api.get('/enquiries/caller-stats');
      if (statsRes.data && statsRes.data.success) {
        setCallerStats(statsRes.data.data);
      }

      // Fetch all enquiries (to choose one in the logging modal)
      const enquiriesRes = await api.get('/enquiries', { params: { limit: 100 } });
      if (enquiriesRes.data && enquiriesRes.data.success) {
        setEnquiries(enquiriesRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load caller stats:', error);
      toast.error('Failed to load caller team performance stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    const { enquiryId, callStatus, notes } = logForm;

    if (!enquiryId) {
      toast.error('Please select a student lead');
      return;
    }
    if (!notes || notes.trim() === '') {
      toast.error('Please enter dialing remarks');
      return;
    }

    // Find the current enquiry
    const selectedEnq = enquiries.find(e => e.id === enquiryId);
    if (!selectedEnq) {
      toast.error('Selected lead is invalid');
      return;
    }

    try {
      // Increment calls counter and update status & notes
      const updatedCalls = (selectedEnq.calls || 0) + 1;
      const response = await api.put(`/enquiries/${enquiryId}`, {
        status: callStatus,
        calls: updatedCalls,
        notes: notes
      });

      if (response.data && response.data.success) {
        toast.success(`Logged call activity! Calls count updated to ${updatedCalls}.`);
        setShowLogModal(false);
        setLogForm({ enquiryId: '', callStatus: 'Follow-up', notes: '' });
        fetchStats(); // refresh stats
      }
    } catch (error) {
      console.error('Failed to log call details:', error);
      toast.error('Failed to save call details.');
    }
  };

  const filteredCallers = callerStats.filter(c =>
    (c.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.staffId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
            <h1 className="text-3xl font-black mt-2">Caller Team Management</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Manage, monitor, and review calling team statistics and individual performance metrics</p>
          </div>
          <button 
            onClick={() => setShowLogModal(true)}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-colors"
          >
            <Phone size={18} /> Log Call Activity
          </button>
        </div>
      </div>

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden animate-slide-in">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Log Call Response & Remarks</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Increments lead dial counter and saves latest follow-up notes</p>
              </div>
              <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Select Student Lead *</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  value={logForm.enquiryId}
                  onChange={e => setLogForm({ ...logForm, enquiryId: e.target.value })}
                >
                  <option value="">-- Choose student lead --</option>
                  {enquiries.map(enq => (
                    <option key={enq.id} value={enq.id}>
                      {enq.studentName} ({enq.eqid}) - Assigned to: {enq.staffName || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Response status *</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none"
                  value={logForm.callStatus}
                  onChange={e => setLogForm({ ...logForm, callStatus: e.target.value })}
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Interested">Interested</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Dialing Notes / Call Summary *</label>
                <textarea 
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Summarize the applicant's response..."
                  value={logForm.notes}
                  onChange={e => setLogForm({ ...logForm, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
                <button 
                  type="button" 
                  onClick={() => setShowLogModal(false)} 
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg transition-colors"
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and stats banner */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
          <input 
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="Search by name or phone..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
          Showing {filteredCallers.length} of {callerStats.length} callers
        </div>
      </div>

      {/* Counselor Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">Loading calling team statistics...</div>
        ) : filteredCallers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
            No active callers found matching search criteria.
          </div>
        ) : (
          filteredCallers.map(c => (
            <div key={c.staffId} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-5">
              <div>
                {/* Caller Identity */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 text-base">{c.fullName}</h3>
                    <p className="text-xs text-indigo-600 font-bold mt-0.5">{c.designation}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.staffId}</p>
                  </div>
                  <span className="p-2.5 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100"><Users size={16} /></span>
                </div>
                
                {/* Contact phone */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold font-mono mt-3">
                  <Phone size={12} className="text-slate-400" /> {c.phone || 'No phone registered'}
                </div>
              </div>

              {/* Call Statistics Grid */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl text-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Assigned Leads</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{c.assignedLeads}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Conversion</p>
                  <p className="text-lg font-black text-indigo-600 mt-0.5">{c.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Calls</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{c.totalCalls}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const firstAssigned = enquiries.find(e => e.staffId === c.staffId);
                    if (firstAssigned) {
                      setLogForm({ enquiryId: firstAssigned.id, callStatus: 'Follow-up', notes: '' });
                      setShowLogModal(true);
                    } else {
                      toast.error('No leads assigned to this caller to log activity.');
                    }
                  }}
                  className="flex-1 py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Phone size={12} /> Log Dial
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallerDetails;
