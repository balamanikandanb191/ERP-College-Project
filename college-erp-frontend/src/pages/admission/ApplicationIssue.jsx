import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, DollarSign, X, Check, FileText, Info, Save, Printer, ArrowLeft, Eye, Calendar, User, MapPin, Phone, Users, ShieldAlert, GraduationCap 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../../hooks/useMasterData';

// Helper component for standard structured rows inside the Application Admission Paper
const FormRow = ({ label, value, isMono = false }) => (
  <div className="flex border-b border-slate-150 py-2 text-xs last:border-b-0">
    <span className="w-1/3 font-black text-slate-400 uppercase tracking-wider text-[10px]">{label}</span>
    <span className={`w-2/3 font-bold text-slate-700 ${isMono ? 'font-mono' : ''}`}>{value || '—'}</span>
  </div>
);

const ApplicationIssue = () => {
  // Fetch application issue records from backend database
  const { records: issues, addRecord, loading } = useMasterData('application_issue');
  
  // Fetch master standards and castes to populate standard/community dropdowns
  const { records: classesMaster } = useMasterData('class_master');
  const { records: castesMaster } = useMasterData('caste');

  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [form, setForm] = useState({
    applicationNo: '',
    date: new Date().toISOString().split('T')[0], // default to current date
    standard: '',
    name: '',
    gender: '',
    lastStudied: '',
    parentName: '',
    parentMobile: '',
    reference: '',
    amount: 100, // default amount from screenshot
    community: '',
    address: ''
  });

  // Selected Application Number for "Receive" lookup
  const [selectedReceiveAppNo, setSelectedReceiveAppNo] = useState('');
  
  // State for print receipt report modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // State for Application Admission Paper modal
  const [showApplicationPaperModal, setShowApplicationPaperModal] = useState(false);
  const [applicationPaperData, setApplicationPaperData] = useState(null);

  // Auto-generate sequential application number
  useEffect(() => {
    if (viewMode === 'form' && !form.id) {
      const year = new Date().getFullYear();
      const count = issues.length;
      // Start from 140 like APP2025140 / APP2026140 in screenshot
      const generatedNo = `APP${year}${String(140 + count).padStart(3, '0')}`;
      setForm(prev => ({
        ...prev,
        applicationNo: generatedNo
      }));
    }
  }, [issues, viewMode, form.id]);

  // Handle Save Details
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!form.name.trim()) return toast.error('Student Name is required');
    if (!form.standard) return toast.error('Standard is required');
    if (!form.gender) return toast.error('Gender is required');
    if (!form.lastStudied) return toast.error('Last Studied is required');
    if (!form.parentName.trim()) return toast.error('Parent Name is required');
    if (!form.parentMobile.trim()) return toast.error('Parent Mobile is required');
    if (!/^\d{10}$/.test(form.parentMobile.trim())) return toast.error('Parent Mobile must be a 10-digit number');
    if (!form.community) return toast.error('Community is required');
    if (!form.address.trim()) return toast.error('Address is required');
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Valid Amount is required');

    // Create entry payload
    const payload = {
      ...form,
      amount: Number(form.amount)
    };

    const res = await addRecord(payload);
    if (res.success) {
      toast.success('Application Details Saved Successfully!');
      // Reset form
      setForm({
        applicationNo: '',
        date: new Date().toISOString().split('T')[0],
        standard: '',
        name: '',
        gender: '',
        lastStudied: '',
        parentName: '',
        parentMobile: '',
        reference: '',
        amount: 100,
        community: '',
        address: ''
      });
    } else {
      toast.error('Failed to save application details.');
    }
  };

  // Handle Loading/Viewing details of chosen Application (Receive action)
  const handleReceive = () => {
    if (!selectedReceiveAppNo) {
      toast.error('Please select an Application Number');
      return;
    }
    const match = issues.find(x => x.applicationNo === selectedReceiveAppNo);
    if (match) {
      const data = {
        id: match.id,
        applicationNo: match.applicationNo,
        date: match.date,
        standard: match.standard,
        name: match.name,
        gender: match.gender,
        lastStudied: match.lastStudied,
        parentName: match.parentName,
        parentMobile: match.parentMobile,
        reference: match.reference || '',
        amount: match.amount,
        community: match.community,
        address: match.address
      };
      setForm(data);
      setApplicationPaperData(data);
      setShowApplicationPaperModal(true);
      toast.success(`Application paper generated for ${match.applicationNo}`);
    } else {
      toast.error('Application Number not found');
    }
  };

  // Handle printing receipt / triggering report view
  const handleReport = () => {
    if (!form.name || !form.applicationNo) {
      toast.error('Please fill or load application details first to print report/receipt');
      return;
    }
    setReceiptData({ ...form });
    setShowReceiptModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered issues for the list view search
  const filteredIssues = issues.filter(x => 
    (x.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (x.applicationNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (x.parentMobile || '').includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 flex flex-col justify-between">
      <div className="w-full px-6 py-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FileText className="text-violet-600 w-7 h-7" />
              Application Issue
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              Manage and issue your student applications here
            </p>
          </div>
          
          <button 
            onClick={() => setViewMode(viewMode === 'form' ? 'list' : 'form')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all duration-300 border ${
              viewMode === 'form' 
                ? 'bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {viewMode === 'form' ? (
              <>
                <Eye size={14} /> View Students
              </>
            ) : (
              <>
                <ArrowLeft size={14} /> Back to Form
              </>
            )}
          </button>
        </div>

        {viewMode === 'form' ? (
          /* ==================== FORM VIEW ==================== */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
            
            {/* Info Message */}
            <div className="bg-blue-50/60 border-b border-blue-100/50 px-6 py-4 flex items-center gap-3">
              <Info className="text-blue-500 w-5 h-5 shrink-0 animate-pulse" />
              <p className="text-blue-700 text-xs font-bold">
                Fill all required fields to issue student applications
              </p>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-8">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-6">
                  Application Details
                </h2>
                
                {/* 4-Column Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                  
                  {/* Application No */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Application No <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      disabled
                      value={form.applicationNo}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* Standard */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Standard <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={form.standard}
                      onChange={e => setForm({ ...form, standard: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all bg-white"
                    >
                      <option value="">Select Standard</option>
                      {classesMaster.length > 0 ? (
                        classesMaster.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="I Year">I Year</option>
                          <option value="II Year">II Year</option>
                          <option value="III Year">III Year</option>
                          <option value="IV Year">IV Year</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Student name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Last Studied */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Last Studied <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={form.lastStudied}
                      onChange={e => setForm({ ...form, lastStudied: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all bg-white"
                    >
                      <option value="">Select Class</option>
                      <option value="10th Standard">10th Standard</option>
                      <option value="12th Standard">12th Standard</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Parent Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Parent name"
                      value={form.parentName}
                      onChange={e => setForm({ ...form, parentName: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* Parent Mobile */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Parent Mobile <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      maxLength="10"
                      placeholder="10-digit mobile number"
                      value={form.parentMobile}
                      onChange={e => setForm({ ...form, parentMobile: e.target.value.replace(/\D/g, '') })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* Reference */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Reference <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Reference name/source"
                      value={form.reference}
                      onChange={e => setForm({ ...form, reference: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-xs font-bold text-slate-400">₹</span>
                      <input 
                        type="number" 
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                        className="w-full border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Community */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Community <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={form.community}
                      onChange={e => setForm({ ...form, community: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all bg-white"
                    >
                      <option value="">Select Community</option>
                      {castesMaster.length > 0 ? (
                        castesMaster.map(c => (
                          <option key={c.id} value={c.casteName}>{c.casteName}</option>
                        ))
                      ) : (
                        <>
                          <option value="BC">BC</option>
                          <option value="MBC">MBC</option>
                          <option value="SC/ST">SC/ST</option>
                          <option value="OC">OC</option>
                          <option value="DNC">DNC</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Address (full width span) */}
                  <div className="md:col-span-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wider">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      rows="3"
                      placeholder="Complete residential address"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pt-6 border-t border-slate-100">
                
                {/* Left Side: Select App and Receive */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[240px]">
                    <select
                      value={selectedReceiveAppNo}
                      onChange={e => setSelectedReceiveAppNo(e.target.value)}
                      className="w-full border border-orange-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all bg-white"
                    >
                      <option value="">Select Application No</option>
                      {issues.map(x => (
                        <option key={x.id} value={x.applicationNo}>
                          {x.applicationNo} - {x.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="button"
                    onClick={handleReceive}
                    className="px-5 py-3 border border-orange-500 text-orange-600 hover:bg-orange-50 font-black rounded-2xl text-xs uppercase tracking-wider transition-colors duration-200"
                  >
                    Receive
                  </button>
                </div>

                {/* Right Side: Report and Save Details */}
                <div className="flex items-center gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={handleReport}
                    className="px-5 py-3 border border-orange-500 text-orange-600 hover:bg-orange-50 font-black rounded-2xl text-xs uppercase tracking-wider transition-colors duration-200 flex items-center gap-2"
                  >
                    <Printer size={14} /> Report
                  </button>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 transition-all duration-200 flex items-center gap-2"
                  >
                    <Save size={14} /> Save Details
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ==================== LIST VIEW ==================== */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            
            {/* Search Bar Block */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search by student name, application no, mobile..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:bg-white focus:border-violet-500 transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>
              
              <div className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                Total Issued: {issues.length}
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">App No</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Standard</th>
                    <th className="px-6 py-4">Parent Details</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Community</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredIssues.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-3 py-1.5 rounded-2xl text-[11px]">
                          {row.applicationNo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">
                        {row.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-800 text-xs">{row.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{row.gender}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-violet-50 border border-violet-100 text-violet-700">
                          {row.standard}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-slate-700">{row.parentName}</div>
                        <div className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">{row.parentMobile}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {row.reference || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
                          {row.community}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900 text-xs">
                        ₹{row.amount}
                      </td>
                    </tr>
                  ))}
                  {filteredIssues.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <div className="max-w-xs mx-auto flex flex-col items-center gap-3">
                          <div className="bg-slate-100 p-4 rounded-full">
                            <ShieldAlert className="text-slate-400 w-8 h-8" />
                          </div>
                          <div className="text-slate-800 text-sm font-black">No Applications Found</div>
                          <div className="text-slate-400 text-xs font-semibold">
                            {searchQuery ? 'Try adjusting your search criteria' : 'Issue your first application prospectus using the form'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="w-full px-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-200/40 pt-6 text-[10px] font-bold text-slate-400 tracking-wider">
        <div>© 2026 CMS. All Rights Reserved.</div>
        <div className="flex items-center gap-1">
          <span>Made by</span>
          <a href="#" className="text-indigo-600 hover:underline">Search First Technology</a>
        </div>
      </footer>

      {/* ==================== REPORT / RECEIPT MODAL ==================== */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-scale-in">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Printer size={16} /> Prospectus Receipt
              </h3>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Print Area */}
            <div id="receipt-print-area" className="p-8 space-y-6 text-slate-700">
              
              {/* Institution Header */}
              <div className="text-center border-b-2 border-dashed border-slate-200 pb-5">
                <h4 className="text-lg font-black text-slate-800 tracking-wide">
                  COLLEGE MANAGEMENT SYSTEM
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Prospectus Application Sale Receipt
                </p>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Application No</span>
                  <span className="font-mono font-black text-slate-800 text-sm">{receiptData.applicationNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Date</span>
                  <span className="font-semibold text-slate-800">{receiptData.date}</span>
                </div>
                
                <div className="col-span-2 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Candidate Name</span>
                  <span className="font-black text-slate-800 text-sm">{receiptData.name}</span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Standard</span>
                  <span className="font-semibold text-slate-800">{receiptData.standard}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Last Studied</span>
                  <span className="font-semibold text-slate-800">{receiptData.lastStudied}</span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Parent Name</span>
                  <span className="font-semibold text-slate-800">{receiptData.parentName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Parent Mobile</span>
                  <span className="font-mono font-semibold text-slate-800">{receiptData.parentMobile}</span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Community</span>
                  <span className="font-semibold text-slate-800">{receiptData.community}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Reference</span>
                  <span className="font-semibold text-slate-800">{receiptData.reference || '-'}</span>
                </div>

                <div className="col-span-2 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Residential Address</span>
                  <p className="font-semibold text-slate-600 mt-1 leading-relaxed">{receiptData.address}</p>
                </div>

                {/* Amount Box */}
                <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center mt-3">
                  <span className="text-xs font-black text-slate-700 uppercase">Amount Paid</span>
                  <span className="text-lg font-black text-indigo-700 font-mono">₹{receiptData.amount}.00</span>
                </div>
              </div>

              {/* Signature lines */}
              <div className="flex justify-between items-end pt-12 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-200 mb-2"></div>
                  <span>Issued By</span>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-slate-200 mb-2"></div>
                  <span>Authorized Signature</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              
              <button 
                type="button" 
                onClick={handlePrint}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all duration-200"
              >
                <Printer size={12} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== APPLICATION ADMISSION PAPER MODAL ==================== */}
      {showApplicationPaperModal && applicationPaperData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Print Style Injector to isolate the print area */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              #application-paper-print-area, #application-paper-print-area * {
                visibility: visible !important;
              }
              #application-paper-print-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                background: white !important;
              }
            }
          `}} />
          
          <div className="bg-white max-w-4xl w-full rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-scale-in">
            
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 text-white flex justify-between items-center no-print">
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} /> Application Admission Paper
              </h3>
              <button 
                onClick={() => setShowApplicationPaperModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="max-h-[75vh] overflow-y-auto p-6 bg-slate-50 no-print">
              <div 
                id="application-paper-print-area" 
                className="bg-white mx-auto max-w-[800px] border-4 border-double border-slate-800 p-10 shadow-sm relative text-slate-800 font-sans"
              >
                {/* School Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-6">
                  <div className="flex gap-4 items-center">
                    <div className="bg-slate-800 text-white p-3 rounded-full">
                      <GraduationCap size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-wide">
                        COLLEGE MANAGEMENT SYSTEM
                      </h2>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        Affiliated to State Board of Education • Erode Division
                      </p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">
                        Erode, Tamil Nadu, India • contact@collegeerp.com
                      </p>
                    </div>
                  </div>
                  
                  {/* Photo Frame Box */}
                  <div className="w-28 h-32 border-2 border-dashed border-slate-300 flex items-center justify-center text-center p-2 rounded">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-relaxed">
                      Affix Recent Passport Size Photograph
                    </span>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center my-6">
                  <h3 className="text-md font-black bg-slate-100 text-slate-800 inline-block px-6 py-2 rounded-lg uppercase tracking-widest border border-slate-200">
                    Admission Application Form
                  </h3>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Academic Session 2026 - 2027
                  </div>
                </div>

                {/* Grid Content */}
                <div className="space-y-6">
                  
                  {/* Section 1: Office Info */}
                  <div>
                    <h4 className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 uppercase tracking-wider mb-2">
                      1. For Office Use Only
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                      <FormRow label="Application No" value={applicationPaperData.applicationNo} isMono />
                      <FormRow label="Date of Issue" value={applicationPaperData.date} />
                      <FormRow label="Prospectus Cost" value={`₹${applicationPaperData.amount}.00`} />
                      <FormRow label="Referral / Source" value={applicationPaperData.reference} />
                    </div>
                  </div>

                  {/* Section 2: Candidate Info */}
                  <div>
                    <h4 className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 uppercase tracking-wider mb-2">
                      2. Candidate Information
                    </h4>
                    <div className="grid grid-cols-1 border border-slate-200 rounded-lg p-3 space-y-1 bg-white">
                      <FormRow label="Full Name" value={applicationPaperData.name} />
                      <FormRow label="Gender" value={applicationPaperData.gender} />
                      <FormRow label="Community / Caste" value={applicationPaperData.community} />
                    </div>
                  </div>

                  {/* Section 3: Academic Info */}
                  <div>
                    <h4 className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 uppercase tracking-wider mb-2">
                      3. Admission & Academic History
                    </h4>
                    <div className="grid grid-cols-1 border border-slate-200 rounded-lg p-3 space-y-1 bg-white">
                      <FormRow label="Standard Applied For" value={applicationPaperData.standard} />
                      <FormRow label="Class Last Studied" value={applicationPaperData.lastStudied} />
                    </div>
                  </div>

                  {/* Section 4: Family Info */}
                  <div>
                    <h4 className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 uppercase tracking-wider mb-2">
                      4. Parent / Guardian Contact Details
                    </h4>
                    <div className="grid grid-cols-1 border border-slate-200 rounded-lg p-3 space-y-1 bg-white">
                      <FormRow label="Parent Name" value={applicationPaperData.parentName} />
                      <FormRow label="Mobile Number" value={applicationPaperData.parentMobile} isMono />
                      <div className="flex py-2 text-xs">
                        <span className="w-1/3 font-black text-slate-400 uppercase tracking-wider text-[10px]">Residential Address</span>
                        <span className="w-2/3 font-bold text-slate-700 leading-relaxed">{applicationPaperData.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Declaration Statement */}
                  <div className="border border-slate-200 rounded-lg p-4 text-[10px] text-slate-500 leading-relaxed bg-slate-50/50">
                    <strong className="text-slate-700 uppercase block mb-1">Declaration:</strong>
                    I hereby declare that all information provided in this admission form is true, correct, and complete to the best of my knowledge. I understand that any false or misleading statement may result in the rejection of this application or subsequent cancellation of admission.
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 gap-6 pt-12 text-center text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    <div>
                      <div className="border-t border-slate-300 pt-2.5 mx-2">Signature of Applicant</div>
                    </div>
                    <div>
                      <div className="border-t border-slate-300 pt-2.5 mx-2">Signature of Parent</div>
                    </div>
                    <div>
                      <div className="border-t border-slate-300 pt-2.5 mx-2">Admission Authority</div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3 no-print">
              <button 
                type="button" 
                onClick={() => setShowApplicationPaperModal(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              
              <button 
                type="button" 
                onClick={handlePrint}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all duration-200"
              >
                <Printer size={12} /> Print Application Paper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationIssue;
