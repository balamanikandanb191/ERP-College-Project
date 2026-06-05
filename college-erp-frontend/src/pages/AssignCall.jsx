import React, { useState, useEffect } from 'react';
import { Search, CheckSquare, Square, UserPlus, Users, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AssignCall = () => {
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch unassigned leads from database (where staffId is null/empty)
      const leadsRes = await api.get('/enquiries', {
        params: { unassigned: 'true', limit: 100 }
      });
      if (leadsRes.data && leadsRes.data.success) {
        setUnassignedLeads(leadsRes.data.data);
      }

      // 2. Fetch staff members
      const staffRes = await api.get('/staff');
      if (staffRes.data) {
        setStaffList(staffRes.data);
        if (staffRes.data.length > 0) {
          setSelectedStaffId(staffRes.data[0].staffId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignment data:', error);
      toast.error('Failed to load unassigned leads or staff members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelect = id => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const filtered = unassignedLeads.filter(l => 
      (l.studentName || '').toLowerCase().includes(search.toLowerCase()) || 
      (l.eqid || '').toLowerCase().includes(search.toLowerCase())
    );
    if (selectedLeads.length === filtered.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filtered.map(l => l.id));
    }
  };

  const handleAssign = async () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one unassigned lead');
      return;
    }
    if (!selectedStaffId) {
      toast.error('Please select an active staff member to allocate');
      return;
    }

    const staffMember = staffList.find(s => s.staffId === selectedStaffId);
    if (!staffMember) {
      toast.error('Selected staff member is invalid');
      return;
    }

    setLoading(true);
    try {
      // Assign selected leads to the staff member
      const promises = selectedLeads.map(id => {
        return api.put(`/enquiries/${id}`, {
          staffId: staffMember.staffId,
          staffName: staffMember.fullName
        });
      });

      await Promise.all(promises);
      toast.success(`Allocated ${selectedLeads.length} leads to ${staffMember.fullName} successfully!`);
      setSelectedLeads([]);
      fetchData(); // reload unassigned leads and callers list
    } catch (error) {
      console.error('Error allocating calls:', error);
      toast.error('Failed to save lead assignments.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = unassignedLeads.filter(l => 
    (l.studentName || '').toLowerCase().includes(search.toLowerCase()) || 
    (l.eqid || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.mobileNo || '').includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
          <h1 className="text-3xl font-black mt-2">Assign Call Management</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Allocate enquiry leads to specific staff members and callers for tele-consultation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Configuration Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 h-fit">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">Allocation Configuration</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Select one or more student leads from the unassigned list, select the target staff caller member, and perform the assignment.
          </p>
          
          <div className="space-y-4 pt-3 border-t border-slate-50">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Target Staff Member</label>
              {staffList.length === 0 ? (
                <div className="text-xs text-rose-500 font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-center gap-1.5">
                  <AlertCircle size={14} /> No staff members registered in database
                </div>
              ) : (
                <select 
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  value={selectedStaffId} 
                  onChange={e => setSelectedStaffId(e.target.value)}
                >
                  {staffList.map(s => (
                    <option key={s.id} value={s.staffId}>
                      {s.fullName} ({s.staffId}) - {s.department || 'Staff'}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <button 
              onClick={handleAssign}
              disabled={loading || selectedLeads.length === 0 || staffList.length === 0}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
            >
              <UserPlus size={16} /> Assign {selectedLeads.length} Selected Leads
            </button>
          </div>
        </div>

        {/* Unassigned Leads List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/20">
            <h3 className="font-black text-slate-800 text-sm tracking-wide">Leads Availability List</h3>
            <div className="flex items-center gap-3">
              <div className="relative w-48">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input 
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Filter available..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
              {filteredLeads.length > 0 && (
                <button 
                  onClick={toggleSelectAll} 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  {selectedLeads.length === filteredLeads.length ? 'Clear Selection' : 'Select All'}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4 w-12 text-center">Select</th>
                  <th className="px-5 py-4">EQID</th>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Course Preference</th>
                  <th className="px-5 py-4">City</th>
                  <th className="px-5 py-4">Reg No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">Loading leads...</td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-400 font-semibold text-xs leading-relaxed">
                      <div className="max-w-md mx-auto space-y-2">
                        <CheckCircle className="mx-auto text-emerald-500" size={32} />
                        <p className="text-slate-700 font-black text-sm">No Available Leads</p>
                        <p className="text-slate-400 font-normal">All enquiry student calls have been assigned or none exist.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-4 text-center">
                        <button 
                          onClick={() => toggleSelect(l.id)} 
                          className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                        >
                          {selectedLeads.includes(l.id) ? (
                            <CheckSquare size={16} className="text-indigo-600 mx-auto" />
                          ) : (
                            <Square size={16} className="mx-auto" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-xs font-black text-indigo-600 font-mono">{l.eqid}</td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{l.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{l.mobileNo}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs font-semibold">{l.neededStandard}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{l.city || l.district}</td>
                      <td className="px-5 py-4 text-slate-400 font-mono text-xs font-semibold">{l.studentRegNo || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignCall;
