import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, Edit3, ShieldAlert, Award } from 'lucide-react';
import OfferLetterManager from './OfferLetterManager';
import toast from 'react-hot-toast';

const PlacementStatusModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  student = null,
  onSave = () => {}
}) => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyDetails, setCompanyDetails] = useState(null);
  
  // Safe extraction of student properties
  const studentData = student ?? {
    id: null,
    name: '',
    reg: '',
    dept: '',
    applications: []
  };

  useEffect(() => {
    if (studentData.applications && studentData.applications.length > 0) {
      // Default to the first application
      const firstApp = studentData.applications[0];
      setSelectedCompany(firstApp.company);
      setCompanyDetails({
        timeline: firstApp.timeline ?? [],
        hrRemarks: firstApp.hrRemarks ?? '',
        interviewDate: firstApp.interviewDate ?? '',
        packageOffered: firstApp.packageOffered ?? '',
        offerLetter: firstApp.offerLetter ?? null,
        status: firstApp.status ?? 'Pending'
      });
    }
  }, [student]);

  const handleCompanyChange = (companyName) => {
    setSelectedCompany(companyName);
    const app = studentData.applications.find(a => a.company === companyName);
    if (app) {
      setCompanyDetails({
        timeline: app.timeline ?? [],
        hrRemarks: app.hrRemarks ?? '',
        interviewDate: app.interviewDate ?? '',
        packageOffered: app.packageOffered ?? '',
        offerLetter: app.offerLetter ?? null,
        status: app.status ?? 'Pending'
      });
    }
  };

  const handleStageStatusChange = (stageId, newStatus) => {
    if (!companyDetails) return;
    
    // Create new timeline with updated stage status
    let newTimeline = companyDetails.timeline.map(stage => {
      if (stage.id === stageId) {
        return { 
          ...stage, 
          status: newStatus,
          date: newStatus === 'completed' || newStatus === 'cleared' || newStatus === 'rejected'
            ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : ''
        };
      }
      return stage;
    });

    // Automatically determine general placement status based on latest stages
    let overallStatus = companyDetails.status;
    
    // If any stage is rejected, set overall to Rejected
    const hasRejected = newTimeline.some(s => s.status === 'rejected');
    const isSelected = newTimeline.find(s => s.id === 'selected')?.status === 'cleared';
    
    if (hasRejected) {
      overallStatus = 'Rejected';
    } else if (isSelected) {
      overallStatus = 'Placed';
    } else if (newTimeline.some(s => s.status === 'in_progress')) {
      overallStatus = 'In Progress';
    } else if (newTimeline.some(s => s.status === 'completed' || s.status === 'cleared')) {
      overallStatus = 'Applied';
    }

    setCompanyDetails({
      ...companyDetails,
      timeline: newTimeline,
      status: overallStatus
    });
  };

  const handleSave = () => {
    if (!selectedCompany || !companyDetails) {
      toast.error("No active application details to save!");
      return;
    }
    
    onSave(studentData.id, selectedCompany, companyDetails);
    toast.success(`Successfully saved recruitment status for ${studentData.name}`);
    onClose();
  };

  if (!isOpen) return null;

  const applications = studentData.applications ?? [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header - Navy Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Edit3 size={18} className="text-indigo-400" />
              Recruitment Status Manager
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {studentData.name} ({studentData.reg}) • {studentData.dept}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          
          {/* Company Selection Tab bar */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Registered Company</label>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {applications.map(app => (
                <button
                  key={app.company}
                  onClick={() => handleCompanyChange(app.company)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shrink-0 ${
                    selectedCompany === app.company 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {app.company}
                </button>
              ))}
              {applications.length === 0 && (
                <div className="text-xs font-bold text-slate-400 p-2 italic bg-slate-50 rounded-xl w-full border border-dashed border-slate-200">
                  No active company drives registered.
                </div>
              )}
            </div>
          </div>

          {companyDetails && (
            <div className="space-y-6">
              {/* Stepper Pipeline Adjustments */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Configure Recruitment Stages</h4>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    companyDetails.status === 'Placed' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : companyDetails.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : companyDetails.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {companyDetails.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(companyDetails.timeline ?? []).map((stage) => (
                    <div 
                      key={stage.id} 
                      className="bg-white border border-slate-200/80 rounded-xl p-3 flex justify-between items-center hover:shadow-sm transition-shadow"
                    >
                      <div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{stage.label}</p>
                        {stage.date && <p className="text-[8px] font-bold text-slate-400 mt-0.5">Cleared on {stage.date}</p>}
                      </div>
                      
                      <select
                        value={stage.status ?? 'pending'}
                        onChange={(e) => handleStageStatusChange(stage.id, e.target.value)}
                        className={`text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg border bg-slate-50 focus:bg-white outline-none cursor-pointer ${
                          stage.status === 'completed' || stage.status === 'cleared'
                            ? 'border-emerald-200 text-emerald-600'
                            : stage.status === 'rejected'
                            ? 'border-rose-200 text-rose-600'
                            : stage.status === 'in_progress'
                            ? 'border-amber-200 text-amber-600 font-black'
                            : 'border-slate-200 text-slate-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="cleared">Cleared</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Offered & Interview Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={12} className="text-slate-400" />
                    Package Offered (LPA)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 8.5"
                    value={companyDetails.packageOffered ?? ''}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, packageOffered: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    Next Interview / Action Date
                  </label>
                  <input
                    type="date"
                    value={companyDetails.interviewDate ?? ''}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, interviewDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* HR Remarks */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TPO / HR Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Enter evaluation remarks or next steps..."
                  value={companyDetails.hrRemarks ?? ''}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, hrRemarks: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              {/* Offer Letter Manager Sub-section */}
              <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-5">
                <OfferLetterManager 
                  offerLetter={companyDetails.offerLetter}
                  onUpdateOffer={(letter) => setCompanyDetails({ ...companyDetails, offerLetter: letter })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50 rounded-b-[40px]">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!selectedCompany}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10 text-xs"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacementStatusModal;
