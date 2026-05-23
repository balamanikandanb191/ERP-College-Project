import React from 'react';
import { Check, X, Clock, HelpCircle } from 'lucide-react';

const TimelineStepper = ({ stages = [], currentCompany = '' }) => {
  // Safe rendering fallback
  const timelineStages = stages ?? [];

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
      case 'cleared':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-500',
          border: 'border-emerald-500',
          icon: <Check size={14} className="text-white" />,
          lightBg: 'bg-emerald-50',
          accentBorder: 'border-emerald-200'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-500',
          border: 'border-rose-500',
          icon: <X size={14} className="text-white" />,
          lightBg: 'bg-rose-50',
          accentBorder: 'border-rose-200'
        };
      case 'in_progress':
        return {
          bg: 'bg-amber-500 animate-pulse',
          text: 'text-amber-600',
          border: 'border-amber-500',
          icon: <Clock size={14} className="text-white" />,
          lightBg: 'bg-amber-50',
          accentBorder: 'border-amber-200'
        };
      case 'pending':
      default:
        return {
          bg: 'bg-slate-200',
          text: 'text-slate-400',
          border: 'border-slate-200',
          icon: <HelpCircle size={14} className="text-slate-400" />,
          lightBg: 'bg-slate-50',
          accentBorder: 'border-slate-100'
        };
    }
  };

  return (
    <div className="w-full space-y-4">
      {currentCompany && (
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Recruitment Pipeline: {currentCompany}</span>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
            {timelineStages.filter(s => s.status === 'completed' || s.status === 'cleared').length} / {timelineStages.length} Steps
          </span>
        </div>
      )}
      
      {/* Horizontal Scrollable Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 hide-scrollbar">
        {timelineStages.map((stage, index) => {
          const styles = getStepStyles(stage.status);
          const isLast = index === timelineStages.length - 1;

          return (
            <React.Fragment key={stage.id || index}>
              {/* Step bubble */}
              <div className="flex flex-col items-center min-w-[70px] flex-1 group">
                <div 
                  className={`w-8 h-8 rounded-full border-2 ${styles.border} ${styles.lightBg} flex items-center justify-center transition-all duration-300 shadow-sm`}
                  title={`${stage.label}: ${stage.status}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stage.status === 'pending' ? 'bg-transparent' : styles.bg}`}>
                    {styles.icon}
                  </div>
                </div>
                
                <span className={`text-[9px] font-black mt-2 text-center truncate w-full max-w-[80px] uppercase tracking-tight ${styles.text}`}>
                  {stage.label}
                </span>
                
                {stage.date && (
                  <span className="text-[8px] font-medium text-slate-400 mt-0.5">
                    {stage.date}
                  </span>
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className="h-0.5 min-w-[15px] flex-grow bg-slate-100 relative -top-3">
                  <div 
                    className={`absolute inset-0 transition-all duration-500 ${
                      stage.status === 'completed' || stage.status === 'cleared' 
                        ? 'bg-emerald-500' 
                        : stage.status === 'rejected'
                        ? 'bg-rose-300'
                        : 'bg-transparent'
                    }`} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineStepper;
