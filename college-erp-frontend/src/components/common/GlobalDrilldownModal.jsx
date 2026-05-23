import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers } from 'lucide-react';
import DrilldownRegistryTable from './DrilldownRegistryTable';

const GlobalDrilldownModal = ({ 
  isOpen, 
  onClose, 
  title, 
  data = [], 
  columns = [], 
  searchKeys = [], 
  onRowClick, 
  onExport 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          
          {/* Backdrop blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          ></motion.div>

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative bg-white w-full max-w-4xl rounded-3xl border border-slate-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10 Outfit-Font"
          >
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{title}</h3>
                    <span className="bg-indigo-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {data.length} Records
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Live Synchronized Single-Source Audit Ledger.</p>
                </div>
              </div>

              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Table Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <DrilldownRegistryTable 
                data={data}
                columns={columns}
                searchKeys={searchKeys}
                onRowClick={onRowClick}
                onExport={onExport}
              />
            </div>

            {/* Footer info banner */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>🛡️ Secured COE Audit Standard</span>
              <span>Click any row to reveal detailed profile dossier drawer</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalDrilldownModal;
