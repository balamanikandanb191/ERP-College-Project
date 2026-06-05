import React from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export const confirmDelete = (onConfirm, message = 'Are you sure you want to delete this record? This action cannot be undone.') => {
  toast((t) => (
    <div className="flex flex-col gap-2.5 p-1 text-slate-100 max-w-sm">
      <div className="flex items-start gap-2.5">
        <Trash2 className="text-rose-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-extrabold text-sm tracking-tight text-white">Confirm Deletion</h4>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700/50 my-1"></div>
      <div className="flex gap-2 justify-end mt-1">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/10 cursor-pointer"
        >
          Yes, Remove
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors border border-slate-700/60 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      background: '#0F172A',
      color: '#fff',
      borderRadius: '20px',
      padding: '16px',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
    }
  });
};

export const confirmWarning = (onConfirm, message, title = 'Clash Engine Warning', confirmText = 'Save Anyway') => {
  toast((t) => (
    <div className="flex flex-col gap-2.5 p-1 text-slate-100 max-w-sm">
      <div className="flex items-start gap-2.5">
        <span className="text-amber-500 shrink-0 mt-0.5 text-lg">⚠️</span>
        <div>
          <h4 className="font-extrabold text-sm tracking-tight text-white">{title}</h4>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700/50 my-1"></div>
      <div className="flex gap-2 justify-end mt-1">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-colors shadow-lg shadow-amber-600/10 cursor-pointer"
        >
          {confirmText}
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors border border-slate-700/60 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      background: '#0F172A',
      color: '#fff',
      borderRadius: '20px',
      padding: '16px',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
    }
  });
};

export const confirmReturn = (onConfirm, bookName) => {
  toast((t) => (
    <div className="flex flex-col gap-2.5 p-1 text-slate-100 max-w-sm">
      <div className="flex items-start gap-2.5">
        <span className="text-indigo-400 shrink-0 mt-0.5 text-lg">🔄</span>
        <div>
          <h4 className="font-extrabold text-sm tracking-tight text-white">Confirm Return</h4>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Are you sure you want to mark <strong className="text-white">"{bookName}"</strong> as returned? This will restore the book copy to the library inventory.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700/50 my-1"></div>
      <div className="flex gap-2 justify-end mt-1">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
        >
          Yes, Return
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors border border-slate-700/60 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      background: '#0F172A',
      color: '#fff',
      borderRadius: '20px',
      padding: '16px',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
    }
  });
};
