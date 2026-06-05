import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Printer,
  User,
  Building,
  Award,
  Droplet,
  Phone,
  Calendar,
  GraduationCap,
  FileImage,
  Sparkles,
  QrCode,
  Wifi,
  Check,
  Palette
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import api from '../services/api';
import { renderPortraitBack, renderLandscapeBack } from './IdCardBackTemplates';

const renderWatermark = (type, isWhite) => {
  const colorClass = isWhite ? 'text-slate-200/50' : 'text-white/5';

  switch (type) {
    case 'iit':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-50" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="50,15 80,75 20,75" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="53" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M35,65 L65,65" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      );
    case 'nit':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="50" cy="50" r="30" />
            <polygon points="50,25 75,68 25,68" />
            <text x="50" y="85" fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor">NIT</text>
          </svg>
        </div>
      );
    case 'vit':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="20" y="20" width="60" height="60" rx="4" />
            <circle cx="50" cy="50" r="20" />
            <text x="50" y="53" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor">VIT</text>
          </svg>
        </div>
      );
    case 'sathyabama':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <polygon points="50,10 90,35 90,75 50,95 10,75 10,35" />
            <text x="50" y="53" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor">SIST</text>
          </svg>
        </div>
      );
    case 'psg':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="35" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="25" />
            <text x="50" y="53" fontSize="8" fontWeight="black" textAnchor="middle" fill="currentColor">PSG</text>
          </svg>
        </div>
      );
    case 'government':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M50,15 L90,15 L90,85 L50,85 Z" />
            <circle cx="50" cy="50" r="20" />
            <text x="50" y="53" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor">GOVT</text>
          </svg>
        </div>
      );
    case 'polytechnic':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="50" cy="50" r="30" strokeDasharray="4,2" />
            <path d="M35,50 L65,50 M50,35 L50,65" />
            <text x="50" y="82" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor">DOTE</text>
          </svg>
        </div>
      );
    case 'autonomous':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" />
          </svg>
        </div>
      );
    case 'laminated':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${colorClass}`}>
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
      );
    case 'rfid_smart':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-24 h-24 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2a10 10 0 0 1 10 10M12 6a6 6 0 0 1 6 6M12 10a2 2 0 0 1 2 2" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>
      );
    case 'library_access':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-24 h-24 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v16H6.5" />
          </svg>
        </div>
      );
    case 'hostel_id':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-24 h-24 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      );
    case 'placement_id':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-24 h-24 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
      );
    case 'staff_id':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-24 h-24 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      );
    case 'graduation_batch':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-24 h-24 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
      );
    case 'modern_erp':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-25" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="40" strokeDasharray="1,2" />
            <circle cx="50" cy="50" r="25" />
            <path d="M50,10 L50,90 M10,50 L90,50" />
          </svg>
        </div>
      );
    case 'anna':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-60" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M50,10 L50,90 M10,50 L90,50" stroke="currentColor" strokeWidth="1" />
            <text x="50" y="52" fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor">ANNA</text>
          </svg>
        </div>
      );
    case 'srm':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-40" viewBox="0 0 100 100" fill="currentColor">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M25,25 L75,75 M75,25 L25,75" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="50" y="52" fontSize="12" fontWeight="black" textAnchor="middle" fill="currentColor">SRM</text>
          </svg>
        </div>
      );
    case 'corporate':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${colorClass}`}>
          <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M0,10 L100,10 M0,20 L100,20 M0,30 L100,30 M0,40 L100,40 M0,50 L100,50 M0,60 L100,60 M0,70 L100,70 M0,80 L100,80 M0,90 L100,90" />
            <path d="M10,0 L10,100 M20,0 L20,100 M30,0 L30,100 M40,0 L40,100 M50,0 L50,100 M60,0 L60,100 M70,0 L70,100 M80,0 L80,100 M90,0 L90,100" strokeDasharray="1,5" />
          </svg>
        </div>
      );
    case 'apple':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-48 h-48 opacity-25" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,3" />
          </svg>
        </div>
      );
    case 'cyber':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${colorClass}`}>
          <svg className="w-full h-full opacity-40" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="50" cy="75" r="30" stroke="currentColor" strokeDasharray="1,1" />
            <path d="M10,10 L90,10 L90,140 L10,140 Z" stroke="currentColor" />
            <path d="M10,30 L90,30 M10,120 L90,120" stroke="currentColor" strokeDasharray="2,2" />
            <line x1="50" y1="0" x2="50" y2="150" stroke="currentColor" strokeDasharray="4,4" />
          </svg>
        </div>
      );
    case 'glass':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" />
            <circle cx="35" cy="50" r="15" fill="none" stroke="currentColor" />
            <circle cx="65" cy="50" r="15" fill="none" stroke="currentColor" />
          </svg>
        </div>
      );
    case 'nfc':
      return (
        <div className={`absolute right-4 top-16 pointer-events-none ${colorClass} opacity-30`}>
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 8a10 10 0 0 1 10-6M2 14a16 16 0 0 1 16-12" strokeDasharray="1,1" />
            <path d="M6 12a6 6 0 0 1 6-4M6 18a12 12 0 0 1 12-8" />
            <path d="M10 16a2 2 0 0 1 2-2M10 22a8 8 0 0 1 8-6" />
          </svg>
        </div>
      );
    case 'gold':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-60 h-60 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z" />
            <path d="M50,20 L80,35 L80,65 L50,80 L20,65 L20,35 Z" strokeDasharray="1,2" />
            <text x="50" y="53" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor" letterSpacing="2">SECURE</text>
          </svg>
        </div>
      );
    case 'medical':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-48 h-48 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2v20M8 5h8M9 9h6M9 13h6" />
            <path d="M12 5c-2 1-4 3-4 6 0 4 3 6 4 9 1-3 4-5 4-9 0-3-2-5-4-6Z" />
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    case 'military':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-52 h-52 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
      );
    case 'ai':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-56 h-56 opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <circle cx="20" cy="30" r="5" />
            <circle cx="80" cy="30" r="5" />
            <circle cx="25" cy="70" r="5" />
            <circle cx="75" cy="70" r="5" />
            <line x1="50" y1="50" x2="20" y2="30" stroke="currentColor" />
            <line x1="50" y1="50" x2="80" y2="30" stroke="currentColor" />
            <line x1="50" y1="50" x2="25" y2="70" stroke="currentColor" />
            <line x1="50" y1="50" x2="75" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <line x1="20" y1="30" x2="80" y2="30" stroke="currentColor" strokeDasharray="1,1" />
            <line x1="25" y1="70" x2="75" y2="70" stroke="currentColor" strokeDasharray="1,1" />
          </svg>
        </div>
      );
    case 'matte':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${colorClass}`}>
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M-20,120 L120,-20 M-20,100 L100,-20 M0,120 L120,0" stroke="currentColor" strokeWidth="6" />
          </svg>
        </div>
      );
    case 'gradient':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${colorClass}`}>
          <svg className="w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0,50 Q25,20 50,50 T100,50" />
            <path d="M0,60 Q25,30 50,60 T100,60" />
            <path d="M0,40 Q25,10 50,40 T100,40" />
          </svg>
        </div>
      );
    case 'scand':
      return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${colorClass}`}>
          <svg className="w-48 h-48 opacity-25" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M50,90 C50,90 30,70 30,50 C30,30 50,20 50,20 C50,20 70,30 70,50 C70,70 50,90 50,90 Z" />
            <path d="M50,20 L50,90" />
            <path d="M50,40 L65,30 M50,55 L35,45 M50,70 L65,60" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};

const getPhotoShapeClass = (shape) => {
  switch (shape) {
    case 'rounded-full':
      return 'rounded-full';
    case 'rounded-none':
      return 'rounded-none';
    case 'rounded-2xl':
      return 'rounded-2xl';
    case 'rounded-xl':
      return 'rounded-xl';
    case 'rounded-3xl':
      return 'rounded-3xl';
    case 'squircle':
      return 'rounded-[28%]';
    case 'shield':
      return 'clip-shield';
    default:
      return 'rounded-2xl';
  }
};
const templates = {
  modern_indigo: {
    name: 'Modern Indigo',
    category: 'Premium Modern',
    bgClass: 'bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border-indigo-500/40 shadow-2xl',
    borderClass: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
    textAccent: 'text-indigo-400 font-bold',
    logoClass: 'bg-indigo-600/30 text-indigo-150 border border-indigo-500/30',
    badgeClass: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
    chipClass: 'from-yellow-400 to-amber-600',
    photoShape: 'rounded-2xl',
    watermark: 'modern_erp',
    defaultPrimary: '#1e1b4b',
    defaultAccent: '#6366f1'
  },
  emerald_classic: {
    name: 'Emerald Classic',
    category: 'Traditional Academic',
    bgClass: 'bg-gradient-to-br from-emerald-955 via-teal-950 to-slate-955 border-emerald-500/40 shadow-2xl',
    borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    textAccent: 'text-emerald-400 font-black',
    logoClass: 'bg-emerald-600/30 text-emerald-250 border border-emerald-500/30',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
    chipClass: 'from-amber-300 to-yellow-600',
    photoShape: 'squircle',
    watermark: 'psg',
    defaultPrimary: '#064e3b',
    defaultAccent: '#10b981'
  },
  crimson_bold: {
    name: 'Crimson Bold',
    category: 'Elegant Crimson',
    bgClass: 'bg-gradient-to-br from-red-955 via-rose-900 to-slate-955 border-red-500/40 shadow-2xl',
    borderClass: 'border-red-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.2)]',
    textAccent: 'text-rose-455 font-bold',
    logoClass: 'bg-rose-600/30 text-rose-250 border border-rose-500/30',
    badgeClass: 'bg-rose-500/10 border-rose-500/25 text-rose-350',
    chipClass: 'from-zinc-400 to-zinc-650',
    photoShape: 'rounded-xl',
    watermark: 'nit',
    defaultPrimary: '#991b1b',
    defaultAccent: '#f43f5e'
  },
  glass_translucent: {
    name: 'Polished Glassmorphic',
    category: 'Vibrant Glassmorphism',
    bgClass: 'bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/30',
    borderClass: 'border-white/15',
    glowClass: 'shadow-[0_0_40px_rgba(99,102,241,0.15)]',
    textAccent: 'text-indigo-300 font-extrabold',
    logoClass: 'bg-white/20 text-white border border-white/20',
    badgeClass: 'bg-white/10 border border-white/20 text-white',
    chipClass: 'from-slate-300 to-slate-500',
    photoShape: 'rounded-2xl',
    watermark: 'glass',
    defaultPrimary: '#1e1b4b',
    defaultAccent: '#6366f1'
  },
  dark_cyber: {
    name: 'Dark Cyber RFID',
    category: 'High-Tech Smart Card',
    bgClass: 'bg-gradient-to-br from-zinc-955 via-zinc-900 to-black border-cyan-500/35 shadow-2xl',
    borderClass: 'border-cyan-500/35',
    glowClass: 'shadow-[0_0_35px_rgba(6,182,212,0.3)]',
    textAccent: 'text-cyan-400 font-black tracking-widest',
    logoClass: 'bg-cyan-955/40 text-cyan-400 border border-cyan-500/30',
    badgeClass: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
    chipClass: 'from-cyan-400 to-fuchsia-500',
    photoShape: 'rounded-full',
    watermark: 'cyber',
    defaultPrimary: '#18181b',
    defaultAccent: '#06b6d4'
  },
  minimal_light: {
    name: 'Minimalist Light',
    category: 'Plain Laminated Clean',
    bgClass: 'bg-white border-slate-200/90 shadow-xl text-slate-800',
    borderClass: 'border-slate-200',
    glowClass: 'shadow-[0_20px_40px_rgba(0,0,0,0.03)]',
    textAccent: 'text-indigo-600 font-bold',
    logoClass: 'bg-indigo-50 text-indigo-750 border border-indigo-100',
    badgeClass: 'bg-emerald-50 border border-emerald-100 text-emerald-700',
    chipClass: 'from-zinc-355 to-zinc-555',
    photoShape: 'rounded-xl',
    watermark: 'laminated',
    defaultPrimary: '#4f46e5',
    defaultAccent: '#10b981'
  },
  gold_premium: {
    name: 'Elegant Gold Alumni',
    category: 'Alumni & Convocation',
    bgClass: 'bg-gradient-to-br from-neutral-955 via-stone-900 to-neutral-955 border-amber-500/40 shadow-2xl',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
    textAccent: 'text-amber-400 font-black',
    logoClass: 'bg-amber-955/45 text-amber-400 border border-amber-550/30',
    badgeClass: 'bg-amber-500/10 border-amber-550/20 text-amber-300',
    chipClass: 'from-yellow-300 via-yellow-500 to-yellow-700',
    photoShape: 'shield',
    watermark: 'gold',
    defaultPrimary: '#1c1917',
    defaultAccent: '#d97706'
  },
  sky_professional: {
    name: 'Sky Blue Pro',
    category: 'Corporate University',
    bgClass: 'bg-gradient-to-br from-sky-955 via-blue-900 to-slate-950 border-sky-500/40 shadow-2xl',
    borderClass: 'border-sky-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(14,165,233,0.2)]',
    textAccent: 'text-sky-400 font-bold',
    logoClass: 'bg-sky-600/30 text-sky-200 border border-sky-500/30',
    badgeClass: 'bg-sky-500/15 border-sky-500/20 text-sky-300',
    chipClass: 'from-yellow-400 to-amber-600',
    photoShape: 'rounded-3xl',
    watermark: 'iit',
    defaultPrimary: '#0369a1',
    defaultAccent: '#0ea5e9'
  },
  medical_clean: {
    name: 'Medical & Biotech',
    category: 'Healthcare & Science',
    bgClass: 'bg-gradient-to-br from-teal-950 via-cyan-900 to-slate-950 border-teal-500/40 shadow-2xl',
    borderClass: 'border-teal-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(20,184,166,0.2)]',
    textAccent: 'text-teal-400 font-bold',
    logoClass: 'bg-teal-600/30 text-teal-200 border border-teal-500/30',
    badgeClass: 'bg-teal-500/10 border-teal-500/25 text-teal-300',
    chipClass: 'from-yellow-400 to-amber-500',
    photoShape: 'rounded-xl',
    watermark: 'medical',
    defaultPrimary: '#0f766e',
    defaultAccent: '#14b8a6'
  },
  orange_sunset: {
    name: 'Orange Creative',
    category: 'Arts & Media',
    bgClass: 'bg-gradient-to-br from-orange-955 via-amber-900 to-slate-955 border-orange-500/45 shadow-2xl',
    borderClass: 'border-orange-500/45',
    glowClass: 'shadow-[0_0_30px_rgba(249,115,22,0.25)]',
    textAccent: 'text-orange-400 font-bold',
    logoClass: 'bg-orange-600/30 text-orange-250 border border-orange-500/30',
    badgeClass: 'bg-orange-500/15 border-orange-500/20 text-orange-300',
    chipClass: 'from-amber-400 to-yellow-600',
    photoShape: 'rounded-2xl',
    watermark: 'hostel_id',
    defaultPrimary: '#7c2d12',
    defaultAccent: '#f97316'
  },
  custom: {
    name: 'Custom Theme',
    category: 'Interactive DIY',
    bgClass: 'custom-palette-style shadow-2xl',
    borderClass: 'border-white/10',
    glowClass: '',
    textAccent: 'custom-text-accent font-bold',
    logoClass: 'custom-logo',
    badgeClass: 'custom-badge',
    chipClass: 'from-amber-400 to-amber-600',
    photoShape: 'rounded-2xl',
    watermark: 'custom',
    defaultPrimary: '#1e1b4b',
    defaultAccent: '#6366f1'
  }
};

const IDCardPreview = ({
  type,
  data,
  cardSide = 'front',
  setCardSide = () => { },
  orientation = 'portrait',
  setOrientation = () => { },
  theme = 'modern_indigo',
  setTheme = () => { },
  primaryColor = '#1e1b4b',
  setPrimaryColor = () => { },
  accentColor = '#6366f1',
  setAccentColor = () => { }
}) => {
  const cardRef = useRef(null);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);

  if (!data) return null;

  const isStudent = type === 'Student';

  // Safe Fallback Metadata extraction
  const fullName = data.fullName || data.name || 'User Profile';
  const department = data.department || 'General';
  const course = data.course || 'B.E. Computer Science';
  const semester = data.semester || 'Semester VII';
  const year = data.year || '2022 - 2026';
  const section = data.section || 'Section A';
  const bloodGroup = data.bloodGroup || 'O-Positive';
  const phone = data.phone || '9876543210';
  const designation = data.designation || 'Faculty Member';
  const employmentType = data.employmentType || 'Teaching';

  const idNumber = isStudent ? (data.registerNumber || data.rollNo || 'REG-2026-0001') : (data.staffId || 'EMP-2026-0001');

  const parentName = data.parentName || data.fatherName || 'Robert Harrison';
  const parentPhone = data.parentPhone || data.fatherPhone || '9840123456';
  const emergencyContact = data.emergencyContact || '9840654321';
  const busRoute = data.busRoute || 'N/A';
  const hostelStatus = data.hostelRequired ? 'Hosteler' : (data.hostelStatus || 'Day Scholar');
  const libraryId = data.libraryId || `LIB-${idNumber}`;
  const validUntil = data.validUntil || 'May 2026';
  const parentAddress = data.parentAddress || data.permanentAddress || '12, Gandhi Nagar, Adyar, Chennai - 600020';
  const autonomousText = data.autonomousText || 'Autonomous Institution - Affiliated to Anna University';
  const collegeAddress = data.collegeAddress || 'O.M.R. Road, Sholinganallur, Chennai - 600119';

  // Safe Image Rendering
  const photo = (data.photoUrl && typeof data.photoUrl === 'string')
    ? (data.photoUrl.startsWith('data:') || data.photoUrl.startsWith('http://') || data.photoUrl.startsWith('https://')
      ? data.photoUrl
      : `http://localhost:5000/${data.photoUrl.startsWith('/') ? data.photoUrl.substring(1) : data.photoUrl}`)
    : '';

  const activeTheme = templates[theme] || templates.modern_indigo;
  const isWhiteTheme = theme === 'minimal_light';
  const template = theme;

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      setIsGeneratingPdf(true);
      toast.loading('Generating high-quality PDF...', { id: 'pdf-toast' });

      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const isLandscape = orientation === 'landscape';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLandscape ? [86, 54] : [54, 86]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, isLandscape ? 86 : 54, isLandscape ? 54 : 86);
      pdf.save(`${fullName.replace(/\s+/g, '_')}_IDCard.pdf`);

      toast.success('ID Card downloaded as PDF successfully', { id: 'pdf-toast' });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-toast' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setIsGeneratingPng(true);
      toast.loading('Generating PNG image...', { id: 'png-toast' });

      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${fullName.replace(/\s+/g, '_')}_ID_Card.png`;
      link.click();

      toast.success('ID Card downloaded as PNG successfully', { id: 'png-toast' });
    } catch (error) {
      console.error('PNG Generation Error:', error);
      toast.error('Failed to generate PNG', { id: 'png-toast' });
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const drawBarcode = (code) => {
    const lines = [];
    let x = 12;
    for (let i = 0; i < 35; i++) {
      const width = (i % 4 === 0 || i % 7 === 0) ? 2 : 1;
      const space = (i % 3 === 0) ? 2 : 1;
      lines.push(
        <rect key={i} x={x} y={4} width={width} height={38} fill="currentColor" />
      );
      x += width + space;
    }
    return (
      <svg width={x + 12} height={46} className="mx-auto" style={{ color: isWhiteTheme ? '#1e293b' : '#f8fafc' }}>
        {lines}
      </svg>
    );
  };

  const drawQRCode = (value) => (
    <svg width={55} height={55} viewBox="0 0 25 25" style={{ color: isWhiteTheme ? '#1e293b' : '#ffffff' }}>
      <rect x={0} y={0} width={7} height={7} fill="currentColor" />
      <rect x={1} y={1} width={5} height={5} fill="none" stroke="white" strokeWidth={0.8} />
      <rect x={2} y={2} width={3} height={3} fill="currentColor" />
      <rect x={18} y={0} width={7} height={7} fill="currentColor" />
      <rect x={19} y={1} width={5} height={5} fill="none" stroke="white" strokeWidth={0.8} />
      <rect x={20} y={2} width={3} height={3} fill="currentColor" />
      <rect x={0} y={18} width={7} height={7} fill="currentColor" />
      <rect x={1} y={18} width={5} height={5} fill="none" stroke="white" strokeWidth={0.8} />
      <rect x={2} y={18} width={3} height={3} fill="currentColor" />
      <rect x={9} y={9} width={2} height={2} fill="currentColor" />
      <rect x={12} y={8} width={3} height={1} fill="currentColor" />
      <rect x={15} y={12} width={2} height={3} fill="currentColor" />
      <rect x={10} y={15} width={4} height={2} fill="currentColor" />
      <rect x={16} y={16} width={3} height={3} fill="currentColor" />
      <rect x={20} y={10} width={2} height={5} fill="currentColor" />
    </svg>
  );

  // Portrait Front Layout Switcher
  const renderPortraitFront = () => {
    switch (theme) {
      case 'minimal_light':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Minimalist Solid Top Header Banner */}
            <div className="bg-indigo-900 text-white rounded-t-[22px] p-3 text-center -mx-6 -mt-6 relative">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={12} />
                  )}
                </div>
                <h2 className="text-[10px] font-black tracking-wider uppercase leading-tight">
                  {data.collegeName || 'EduERP College'}
                </h2>
              </div>
              <p className="text-[6px] font-mono opacity-80 leading-none">
                {autonomousText}
              </p>
            </div>

            {/* Photo & Name */}
            <div className="flex flex-col items-center mt-4">
              <div className="w-18 h-18 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={30} className="text-slate-400" />
                )}
              </div>
              <h3 className="text-xs font-black text-slate-800 mt-2 text-center leading-tight">
                {fullName || 'Student Name'}
              </h3>
              <p className="text-[8px] font-bold tracking-wider uppercase text-indigo-650 mt-0.5 text-center">
                {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
              </p>
            </div>

            {/* Grid details (classic clean) */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 space-y-1 text-[8px] text-slate-700 my-2">
              <div className="flex justify-between"><span className="text-[7px] font-bold text-slate-400">ID NUMBER</span><span className="font-mono font-bold text-slate-900">{idNumber}</span></div>
              <div className="flex justify-between"><span className="text-[7px] font-bold text-slate-400">DEPARTMENT</span><span className="font-bold text-slate-900">{department}</span></div>
              {isStudent && <div className="flex justify-between"><span className="text-[7px] font-bold text-slate-400">BATCH YEAR</span><span className="font-bold text-slate-900">{year}</span></div>}
              <div className="flex justify-between"><span className="text-[7px] font-bold text-slate-400">BLOOD GROUP</span><span className="font-bold text-red-600">{bloodGroup}</span></div>
            </div>

            {/* Footer QR, Signatures & Barcode */}
            <div className="border-t border-slate-100 pt-2 space-y-1 bg-white rounded-b-[22px]">
              <div className="flex justify-between items-center gap-2">
                <div className="bg-white p-0.5 border border-slate-200 rounded">{drawQRCode(idNumber, 24)}</div>
                <div className="text-center">
                  <span className="signature-font text-[10px] text-slate-800">{fullName.split(' ')[0]}</span>
                  <p className="text-[4px] text-slate-400 uppercase font-black tracking-widest scale-90">Student Sig</p>
                </div>
                <div className="text-center">
                  <span className="signature-font text-[10px] text-blue-600">Dr. Vinoth</span>
                  <p className="text-[4px] text-slate-400 uppercase font-black tracking-widest scale-90">Principal</p>
                </div>
              </div>
              <div className="text-center pt-1">
                {drawBarcode(idNumber)}
                <p className="text-[4.5px] font-mono text-slate-400 mt-0.5">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      case 'crimson_bold':
        return (
          <div className="w-full h-full flex justify-between relative pl-8">
            {/* Asymmetric Crimson Left Sidebar */}
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-rose-850 text-white rounded-l-[22px] flex flex-col justify-between py-6 items-center z-20">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {data.collegeLogoUrl ? (
                  <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap size={12} />
                )}
              </div>

              {/* Vertical Title Text */}
              <span className="text-[7px] font-black tracking-widest uppercase -rotate-90 origin-center my-8 whitespace-nowrap opacity-90">
                {isStudent ? 'STUDENT ID' : 'FACULTY PASSPORT'}
              </span>

              <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center p-0.5">
                {drawQRCode(idNumber, 18)}
              </div>
            </div>

            {/* Right side content */}
            <div className="flex-1 flex flex-col justify-between pl-4 py-1.5">
              {/* Header */}
              <div className="border-b border-rose-500/10 pb-1.5">
                <h2 className="text-[10px] font-black text-white leading-tight truncate">
                  {data.collegeName || 'EduERP Engineering College'}
                </h2>
                <p className="text-[5.5px] font-bold text-rose-350 leading-none">
                  {autonomousText}
                </p>
              </div>

              {/* Layout: Left Photo, Right Name and Title */}
              <div className="flex items-center gap-3 my-2">
                <div className="w-16 h-16 rounded-xl border border-white/25 overflow-hidden bg-slate-900 shrink-0">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-slate-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-white leading-tight">
                    {fullName || 'Student Name'}
                  </h3>
                  <p className="text-[8px] font-bold text-rose-350 tracking-wider uppercase mt-0.5">
                    {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                  </p>
                </div>
              </div>

              {/* Details List */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-2 space-y-1 text-[8px] text-slate-350">
                <div className="flex justify-between"><span className="text-slate-500 font-bold">ID NO:</span><span className="font-mono font-bold text-white">{idNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">DEPT:</span><span className="font-bold text-white">{department}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">BLOOD:</span><span className="font-bold text-red-500">{bloodGroup}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">BATCH:</span><span className="font-bold text-white">{year}</span></div>
              </div>

              {/* Signature Area */}
              <div className="flex justify-between items-center pt-1.5 border-t border-white/10 mt-1">
                <div className="text-center">
                  <span className="signature-font text-[9px] text-rose-250">{fullName.split(' ')[0]}</span>
                  <p className="text-[4px] text-slate-400 uppercase scale-90">Student Sig</p>
                </div>
                <div className="text-center">
                  <span className="signature-font text-[9px] text-rose-250">Dr. Vinoth</span>
                  <p className="text-[4px] text-slate-400 uppercase scale-90">Principal</p>
                </div>
              </div>

              <div className="text-center pt-1.5">
                {drawBarcode(idNumber)}
                <p className="text-[4.5px] font-mono text-slate-450">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      case 'dark_cyber':
        return (
          <div className="w-full h-full flex flex-col justify-between font-mono">
            {/* Tech Header */}
            <div className="flex justify-between items-center border-b border-cyan-500/20 pb-1.5">
              <div>
                <span className="text-[5px] text-cyan-500 font-bold tracking-widest uppercase block">SECURE SYSTEM NODE</span>
                <h2 className="text-[9px] font-black text-cyan-400 leading-tight">
                  {data.collegeName || 'EduERP Smart RFID'}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="px-1 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[5px] font-bold border border-cyan-500/20">SYSTEM ID: ONLINE</span>
              </div>
            </div>

            {/* Smart Card Smart Chip & Tech Watermark */}
            <div className="flex justify-between items-center my-1">
              <div className="w-8 h-6 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-md border border-cyan-500/30 flex items-center justify-center p-0.5 shadow-md shadow-cyan-500/10">
                <div className="w-full h-full border border-black/20 rounded flex flex-wrap justify-between p-0.5 opacity-80">
                  <div className="w-[45%] h-[40%] border-r border-b border-black/30" />
                  <div className="w-[45%] h-[40%] border-l border-b border-black/30" />
                </div>
              </div>
              <span className="text-[5.5px] text-cyan-500/50 uppercase tracking-widest">RFID MULTI-PASS</span>
            </div>

            {/* Tech Photo Ring */}
            <div className="flex items-center gap-4 my-1.5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-cyan-500/20 animate-pulse blur-sm" />
                <div className="w-16 h-16 rounded-full border-2 border-cyan-400 flex items-center justify-center overflow-hidden bg-zinc-950 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-cyan-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-[11px] font-black tracking-tight text-white leading-tight">
                  {fullName || 'Student Name'}
                </h3>
                <span className="px-1.5 py-0.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[6.5px] font-black rounded uppercase block w-fit">
                  {isStudent ? (course || 'CS Student') : (designation || 'Faculty')}
                </span>
              </div>
            </div>

            {/* Terminal Details Box */}
            <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-2 space-y-1 text-[7.5px] text-cyan-400 font-mono">
              <div className="flex justify-between"><span>SYS_ID:</span><span className="text-white font-bold">{idNumber}</span></div>
              <div className="flex justify-between"><span>DEPT_NODE:</span><span className="text-white font-bold">{department}</span></div>
              <div className="flex justify-between"><span>BLOOD_TYPE:</span><span className="text-red-400 font-bold">{bloodGroup}</span></div>
              <div className="flex justify-between"><span>CLASS_SEC:</span><span className="text-white font-bold">{section}</span></div>
            </div>

            {/* Tech Footer */}
            <div className="border-t border-cyan-500/20 pt-1.5 flex justify-between items-center gap-2">
              <div className="bg-white p-0.5 rounded border border-cyan-500/30">{drawQRCode(idNumber, 22)}</div>
              <div className="flex-1 text-center shrink-0">
                {drawBarcode(idNumber)}
                <p className="text-[4px] text-cyan-500/70 tracking-widest mt-0.5">AUTH_SIG // PRINCIPAL_VERIFIED</p>
              </div>
            </div>
          </div>
        );

      case 'emerald_classic':
        return (
          <div className="w-full h-full flex flex-col justify-between relative p-1.5">
            {/* Classic Inset Gold Borders */}
            <div className="absolute inset-0 border border-amber-500/30 rounded-[20px] pointer-events-none" />
            <div className="absolute inset-1 border-2 border-amber-500/10 rounded-[18px] pointer-events-none" />

            <div className="w-full h-full flex flex-col justify-between p-2">
              {/* Classical Academic Header */}
              <div className="text-center space-y-0.5 pb-1.5 border-b border-amber-500/20">
                <div className="flex items-center justify-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-amber-400 border border-amber-500/30 flex items-center justify-center overflow-hidden">
                    {data.collegeLogoUrl ? (
                      <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap size={11} />
                    )}
                  </div>
                  <h2 className="text-[10px] font-serif font-black tracking-wider uppercase text-slate-100">
                    {data.collegeName || 'EduERP Classical College'}
                  </h2>
                </div>
                <p className="text-[6px] font-serif font-bold text-amber-400/90 leading-none">
                  {autonomousText}
                </p>
              </div>

              {/* Classical Academic Squircle Photo */}
              <div className="flex flex-col items-center my-1">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[24%] border-2 border-amber-500/35 overflow-hidden bg-slate-900 shadow-md">
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={26} className="text-emerald-500" />
                    )}
                  </div>
                </div>
                <h3 className="text-xs font-serif font-black text-white mt-1.5 tracking-tight text-center leading-tight">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[8px] font-bold text-emerald-400 font-serif tracking-widest uppercase mt-0.5 text-center">
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>

              {/* Classical Grid */}
              <div className="bg-emerald-950/40 border border-amber-500/20 rounded-lg p-2.5 space-y-0.5 text-[8.5px] text-slate-200 font-serif">
                <div className="flex justify-between border-b border-amber-500/10 pb-0.5"><span className="text-amber-500/70 font-bold uppercase tracking-wider">Reg ID:</span><span className="font-mono text-white font-bold">{idNumber}</span></div>
                <div className="flex justify-between border-b border-amber-500/10 pb-0.5"><span className="text-amber-500/70 font-bold uppercase tracking-wider">Dept:</span><span className="text-white font-bold truncate max-w-[140px]">{department}</span></div>
                <div className="flex justify-between"><span className="text-amber-500/70 font-bold uppercase tracking-wider">Blood Group:</span><span className="text-red-400 font-bold">{bloodGroup}</span></div>
              </div>

              {/* Classic Footer */}
              <div className="flex justify-between items-center gap-2 pt-1 border-t border-amber-500/20">
                <div className="bg-white p-0.5 rounded border border-amber-500/40">{drawQRCode(idNumber, 20)}</div>
                <div className="text-center">
                  <span className="signature-font text-[9px] text-amber-350">{fullName.split(' ')[0]}</span>
                  <p className="text-[4px] text-slate-400 uppercase tracking-widest">Sig</p>
                </div>
                <div className="text-center">
                  <span className="signature-font text-[9px] text-amber-350">Dr. Vinoth</span>
                  <p className="text-[4px] text-slate-400 uppercase tracking-widest">Principal</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gold_premium':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            {/* Elegant Luxury Gold Border Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-amber-500/30">
              <div className="w-fit mx-auto px-2 py-0.5 border border-amber-500/40 bg-amber-500/10 rounded-md text-amber-400 text-[6px] font-black tracking-widest uppercase mb-1">
                ALUMNI CONVOCATION MEMBER
              </div>
              <h2 className="text-[10px] font-serif font-black tracking-wider uppercase text-amber-400">
                {data.collegeName || 'EduERP Premium Institute'}
              </h2>
              <p className="text-[5.5px] font-mono text-stone-400 uppercase tracking-widest">
                ESTABLISHED 1984
              </p>
            </div>

            {/* Shield Photo Frame */}
            <div className="flex flex-col items-center my-1 relative">
              <div className="absolute -top-1 right-2 opacity-60">
                <Award size={18} className="text-amber-500" />
              </div>

              <div className="w-18 h-18 clip-shield border-2 border-amber-400 bg-stone-900 flex items-center justify-center overflow-hidden shadow-xl shadow-amber-500/10">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-amber-400" />
                )}
              </div>

              <h3 className="text-[11px] font-serif font-black text-amber-200 mt-2 text-center leading-tight">
                {fullName || 'Student Name'}
              </h3>
              <p className="text-[8px] font-serif font-bold text-amber-500 tracking-wider uppercase mt-0.5 text-center">
                {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
              </p>
            </div>

            {/* Gold Details */}
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-2.5 space-y-0.5 text-[8px] text-stone-300">
              <div className="flex justify-between border-b border-amber-500/10 pb-0.5">
                <span className="text-amber-400/80 font-black">MEMBERSHIP ID:</span>
                <span className="font-mono font-bold text-white">{idNumber}</span>
              </div>
              <div className="flex justify-between border-b border-amber-500/10 pb-0.5">
                <span className="text-amber-400/80 font-black">DEPARTMENT:</span>
                <span className="font-bold text-white truncate max-w-[130px]">{department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400/80 font-black">VALID UNTIL:</span>
                <span className="font-bold text-white">{validUntil}</span>
              </div>
            </div>

            {/* Luxury Seal Footer */}
            <div className="border-t border-amber-500/30 pt-2 flex justify-between items-center gap-2">
              <div className="bg-white p-0.5 rounded border border-amber-500">{drawQRCode(idNumber, 22)}</div>
              <div className="text-right">
                <span className="signature-font text-[10px] text-amber-400">Dr. Vinoth</span>
                <p className="text-[4px] text-stone-500 uppercase tracking-widest">AUTHORIZED SIGNATURE</p>
              </div>
            </div>
          </div>
        );

      case 'medical_clean':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Split layout: solid clinical top header */}
            <div className="bg-teal-700 text-white rounded-t-[22px] p-3 text-center -mx-6 -mt-6 relative flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-white text-teal-700 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  +
                </div>
                <h2 className="text-[10px] font-black tracking-wider uppercase leading-tight">
                  {data.collegeName || 'EduERP Medical University'}
                </h2>
              </div>
              <p className="text-[5.5px] tracking-wide opacity-80 uppercase font-black mt-1 bg-teal-850 px-2 py-0.5 rounded-full">
                {isStudent ? 'MEDICAL STUDENT PASS' : 'CLINICAL FACULTY'}
              </p>
            </div>

            {/* Clinic Layout: Left-Aligned photo, Right aligned info */}
            <div className="flex gap-3 my-2 items-center">
              <div className="w-16 h-20 rounded-xl border border-teal-500/30 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={30} className="text-teal-400" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-[11px] font-black text-slate-800 leading-tight">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[8px] font-bold text-teal-650 uppercase">
                  {isStudent ? (course || 'Biotech Course') : (designation || 'Medical Staff')}
                </p>
                <div className="flex items-center gap-1.5 mt-1 bg-red-50 text-red-700 border border-red-100 rounded px-1.5 py-0.5 w-fit">
                  <span className="w-1 h-1 rounded-full bg-red-600 fill-current" />
                  <span className="text-[7px] font-black">{bloodGroup} BLOOD</span>
                </div>
              </div>
            </div>

            {/* Medical details */}
            <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-2 space-y-0.5 text-[8px] text-slate-650">
              <div className="flex justify-between"><span className="font-bold">HOSPITAL ID:</span><span className="font-mono font-bold text-slate-900">{idNumber}</span></div>
              <div className="flex justify-between"><span className="font-bold">CLINICAL DEPT:</span><span className="font-bold text-slate-900 truncate max-w-[130px]">{department}</span></div>
              <div className="flex justify-between"><span className="font-bold">CONTACT NO:</span><span className="font-bold font-mono text-slate-900">{phone}</span></div>
            </div>

            {/* Footer barcode and QR */}
            <div className="border-t border-slate-100 pt-2 flex justify-between items-center gap-2">
              <div className="bg-white p-0.5 border border-slate-200 rounded">{drawQRCode(idNumber, 20)}</div>
              <div className="flex-1 text-center shrink-0">
                {drawBarcode(idNumber)}
                <p className="text-[4px] font-mono text-slate-400 mt-0.5">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      case 'orange_sunset':
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden">
            {/* Dynamic Diagonal Split background element */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500 rounded-full blur-2xl opacity-40 pointer-events-none" />

            <div className="w-full h-full flex flex-col justify-between">
              {/* Creative Arts Header */}
              <div className="space-y-0.5 border-b border-orange-500/20 pb-1.5">
                <span className="text-[6px] font-black text-orange-500 tracking-widest uppercase block">SCHOOL OF CREATIVE ARTS</span>
                <h2 className="text-[10px] font-black uppercase text-white leading-tight">
                  {data.collegeName || 'EduERP Arts College'}
                </h2>
              </div>

              {/* Offset creative photo placement */}
              <div className="flex items-center gap-3 my-2">
                <div className="relative">
                  <div className="absolute inset-0.5 bg-orange-500 rounded-2xl rotate-3 shadow-md" />
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/20 relative z-10">
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-orange-500" />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-white leading-tight">
                    {fullName || 'Student Name'}
                  </h3>
                  <p className="text-[8px] font-bold text-orange-400 tracking-wider uppercase mt-0.5">
                    {isStudent ? (course || 'Fine Arts') : (designation || 'Instructor')}
                  </p>
                </div>
              </div>

              {/* Details cards */}
              <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/5 rounded-xl p-2 text-[8px] text-slate-350">
                <div>
                  <span className="text-[6px] text-slate-500 block uppercase font-bold">BADGE ID</span>
                  <span className="font-mono font-bold text-white">{idNumber}</span>
                </div>
                <div>
                  <span className="text-[6px] text-slate-500 block uppercase font-bold">DEPARTMENT</span>
                  <span className="font-bold text-white truncate block">{department}</span>
                </div>
                <div>
                  <span className="text-[6px] text-slate-500 block uppercase font-bold">BLOOD GROUP</span>
                  <span className="font-bold text-orange-400">{bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[6px] text-slate-500 block uppercase font-bold">BATCH YEAR</span>
                  <span className="font-bold text-white">{year}</span>
                </div>
              </div>

              {/* Creative Footer */}
              <div className="border-t border-white/10 pt-2 flex justify-between items-center gap-2">
                <div className="bg-white p-0.5 rounded border border-orange-500/30">{drawQRCode(idNumber, 22)}</div>
                <div className="flex-1 text-center shrink-0">
                  {drawBarcode(idNumber)}
                  <p className="text-[4px] font-mono text-slate-500">*{idNumber}*</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'modern_indigo':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-indigo-500/20 relative mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg bg-indigo-650/30 text-indigo-150 border border-indigo-500/30 overflow-hidden">
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>
                <h2 className="text-[10px] font-black tracking-wider uppercase leading-tight text-slate-100">
                  {data.collegeName || 'EduERP Engineering College'}
                </h2>
              </div>
              <p className="text-[6.5px] font-bold opacity-80 leading-none text-indigo-300">
                {autonomousText}
              </p>
            </div>

            {/* Photo, Chip, Active Badge */}
            <div className="flex flex-col items-center my-1.5 relative">
              <div className="absolute left-1.5 top-0 z-20">
                <div className="w-9 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-605 border border-amber-600/30 flex items-center justify-center p-0.5 shadow">
                  <div className="w-full h-full border border-amber-800/20 rounded flex flex-wrap justify-between p-0.5 opacity-80">
                    <div className="w-[45%] h-[40%] border-r border-b border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-l border-b border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-r border-t border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-l border-t border-amber-800/30" />
                  </div>
                </div>
              </div>

              <div className="absolute right-1.5 top-0.5 z-20">
                <span className="px-1.5 py-0.5 text-[7px] font-black uppercase rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" /> ACTIVE
                </span>
              </div>

              <div className="relative mt-1">
                <div className="absolute -inset-1 rounded-full opacity-35 blur-sm bg-gradient-to-r from-indigo-500 to-teal-500" />
                <div className="w-18 h-18 rounded-2xl bg-slate-900 border border-white/20 border-2 flex items-center justify-center overflow-hidden relative z-10 shadow-md">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={30} className="text-slate-500" />
                  )}
                </div>
              </div>

              <div className="text-center mt-2 space-y-0.5">
                <h3 className="text-xs font-black tracking-tight leading-tight text-white">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[8px] font-bold tracking-widest uppercase text-indigo-400">
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-xl p-2 border bg-white/5 border-white/5 text-slate-350 space-y-0.5 text-[8.5px] backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">ID NO</span>
                <span className="font-mono font-bold text-white">{idNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">DEPT</span>
                <span className="font-bold text-white truncate max-w-[150px]">{department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">{isStudent ? 'YEAR / SEM' : 'EMPLOYMENT'}</span>
                <span className="font-bold text-white">{isStudent ? (semester || 'Semester VII') : (employmentType || 'Teaching')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">BLOOD GROUP</span>
                <span className="font-bold text-red-500">{bloodGroup}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/10 gap-2">
              <div className="flex bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[24px]">
                {drawQRCode(idNumber)}
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-indigo-200">
                  {fullName.split(' ')[0] || 'User'}
                </span>
                <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Sig</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-indigo-200">Dr. Vinoth</span>
                <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Principal</span>
              </div>
              <div className="flex flex-col items-center shrink-0">
                {drawBarcode(idNumber)}
                <p className="text-[4px] font-mono tracking-widest text-slate-500 leading-none">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      case 'glass_translucent':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-white/10 relative mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg bg-white/20 text-white border border-white/20 overflow-hidden">
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>
                <h2 className="text-[10px] font-black tracking-wider uppercase leading-tight text-white">
                  {data.collegeName || 'EduERP Glassmorphic'}
                </h2>
              </div>
              <p className="text-[6.5px] font-bold opacity-80 leading-none text-indigo-305">
                {autonomousText}
              </p>
            </div>

            {/* Photo, Chip, Active Badge */}
            <div className="flex flex-col items-center my-1.5 relative">
              <div className="absolute right-1.5 top-0.5 z-20">
                <span className="px-1.5 py-0.5 text-[7px] font-black uppercase rounded bg-white/10 border border-white/20 text-white flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> PASS
                </span>
              </div>

              <div className="relative mt-1">
                <div className="absolute -inset-1 rounded-full opacity-50 blur-md bg-gradient-to-r from-teal-400 via-indigo-500 to-pink-500 animate-pulse" />
                <div className="w-18 h-18 rounded-2xl bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center overflow-hidden relative z-10 shadow-md">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={30} className="text-white/60" />
                  )}
                </div>
              </div>

              <div className="text-center mt-2 space-y-0.5">
                <h3 className="text-xs font-black tracking-tight leading-tight text-white">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[8px] font-bold tracking-widest uppercase text-indigo-350">
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-xl p-2 border bg-white/5 border-white/10 text-white/80 space-y-0.5 text-[8.5px] backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-white/60 uppercase tracking-wider">ID NO</span>
                <span className="font-mono font-bold text-white">{idNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-white/60 uppercase tracking-wider">DEPT</span>
                <span className="font-bold text-white truncate max-w-[150px]">{department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-white/60 uppercase tracking-wider">BLOOD GROUP</span>
                <span className="font-bold text-rose-350">{bloodGroup}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/10 gap-2">
              <div className="flex bg-white p-0.5 rounded border border-white/20 shadow-xs max-w-[24px]">
                {drawQRCode(idNumber)}
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-white/90">
                  {fullName.split(' ')[0] || 'User'}
                </span>
                <span className="text-[4px] text-white/55 uppercase tracking-widest font-bold">Sig</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-white/90">Dr. Vinoth</span>
                <span className="text-[4px] text-white/55 uppercase tracking-widest font-bold">Principal</span>
              </div>
              <div className="flex flex-col items-center shrink-0">
                {drawBarcode(idNumber)}
                <p className="text-[4px] font-mono tracking-widest text-white/40 leading-none">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      case 'sky_professional':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-sky-500/20 relative mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg bg-sky-650/30 text-sky-200 border border-sky-500/30 overflow-hidden">
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>
                <h2 className="text-[10px] font-black tracking-wider uppercase leading-tight text-white">
                  {data.collegeName || 'EduERP Professional Campus'}
                </h2>
              </div>
              <p className="text-[6.5px] font-bold opacity-80 leading-none text-sky-300">
                {autonomousText}
              </p>
            </div>

            {/* Photo, Chip, Active Badge */}
            <div className="flex flex-col items-center my-1.5 relative">
              <div className="absolute right-1.5 top-0.5 z-20">
                <span className="px-1.5 py-0.5 text-[7px] font-black uppercase rounded bg-sky-500/20 border border-sky-500/30 text-sky-300 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-sky-450 animate-pulse" /> STAFF
                </span>
              </div>

              <div className="relative mt-1">
                <div className="absolute -inset-1 rounded-3xl opacity-35 blur-sm bg-gradient-to-r from-sky-400 to-blue-600" />
                <div className="w-18 h-18 rounded-3xl bg-slate-900 border border-white/20 border-2 flex items-center justify-center overflow-hidden relative z-10 shadow-md">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={30} className="text-slate-500" />
                  )}
                </div>
              </div>

              <div className="text-center mt-2 space-y-0.5">
                <h3 className="text-xs font-black tracking-tight leading-tight text-white">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[8px] font-bold tracking-widest uppercase text-sky-400">
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-xl p-2 border bg-white/5 border-white/5 text-slate-350 space-y-0.5 text-[8.5px] backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-sky-500 uppercase tracking-wider">EMPLOYEE ID</span>
                <span className="font-mono font-bold text-white">{idNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-sky-500 uppercase tracking-wider">DEPARTMENT</span>
                <span className="font-bold text-white truncate max-w-[150px]">{department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-sky-500 uppercase tracking-wider">VALID UNTIL</span>
                <span className="font-bold text-white">{validUntil}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/10 gap-2">
              <div className="flex bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[24px]">
                {drawQRCode(idNumber)}
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-sky-200">
                  {fullName.split(' ')[0] || 'User'}
                </span>
                <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Sig</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-sky-200">Dr. Vinoth</span>
                <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Principal</span>
              </div>
              <div className="flex flex-col items-center shrink-0">
                {drawBarcode(idNumber)}
                <p className="text-[4px] font-mono tracking-widest text-slate-500 leading-none">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-white/10 relative mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg bg-white/20 text-white border border-white/20 overflow-hidden" style={{ borderColor: `${accentColor}40`, backgroundColor: `${primaryColor}40` }}>
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>
                <h2 className="text-[10px] font-black tracking-wider uppercase leading-tight text-white">
                  {data.collegeName || 'Custom College Card'}
                </h2>
              </div>
              <p className="text-[6.5px] font-bold opacity-80 leading-none" style={{ color: accentColor }}>
                {autonomousText}
              </p>
            </div>

            {/* Photo, Chip, Active Badge */}
            <div className="flex flex-col items-center my-1.5 relative">
              <div className="absolute right-1.5 top-0.5 z-20">
                <span className="px-1.5 py-0.5 text-[7px] font-black uppercase rounded text-white flex items-center gap-0.5" style={{ backgroundColor: `${accentColor}30`, borderColor: `${accentColor}50`, border: '1px solid' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                </span>
              </div>

              <div className="relative mt-1">
                <div className="absolute -inset-1 rounded-2xl opacity-35 blur-sm" style={{ backgroundColor: accentColor }} />
                <div className="w-18 h-18 rounded-2xl bg-slate-900 border border-white/20 border-2 flex items-center justify-center overflow-hidden relative z-10 shadow-md">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={30} className="text-slate-500" />
                  )}
                </div>
              </div>

              <div className="text-center mt-2 space-y-0.5">
                <h3 className="text-xs font-black tracking-tight leading-tight text-white">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[8px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-xl p-2 border bg-white/5 border-white/5 text-slate-350 space-y-0.5 text-[8.5px] backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>ID NUMBER</span>
                <span className="font-mono font-bold text-white">{idNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>DEPARTMENT</span>
                <span className="font-bold text-white truncate max-w-[150px]">{department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>BLOOD GROUP</span>
                <span className="font-bold text-red-500">{bloodGroup}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/10 gap-2">
              <div className="flex bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[24px]">
                {drawQRCode(idNumber)}
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-white/90">
                  {fullName.split(' ')[0] || 'User'}
                </span>
                <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Sig</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="signature-font text-[9px] leading-none text-white/90">Dr. Vinoth</span>
                <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Principal</span>
              </div>
              <div className="flex flex-col items-center shrink-0">
                {drawBarcode(idNumber)}
                <p className="text-[4px] font-mono tracking-widest text-slate-500 leading-none">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );

      default:
        // 'modern_indigo' or 'custom' or 'glass_translucent' (Standard Clean Layout)
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-white/10 relative mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg ${activeTheme?.logoClass} overflow-hidden`}>
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={14} />
                  )}
                </div>
                <h2 className={`text-[10px] font-black tracking-wider uppercase leading-tight ${isWhiteTheme ? 'text-slate-800' : 'text-slate-100'}`}>
                  {data.collegeName || 'EduERP Engineering College'}
                </h2>
              </div>
              <p className={`text-[6.5px] font-bold opacity-80 leading-none ${isWhiteTheme ? 'text-slate-600' : 'text-slate-350'}`}>
                {autonomousText}
              </p>
              <p className={`text-[5.5px] font-mono opacity-50 leading-none text-center truncate w-full ${isWhiteTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                {collegeAddress}
              </p>
            </div>

            {/* Middle: Photo, Smart Chip, Active badge */}
            <div className="flex flex-col items-center my-1.5 relative">
              <div className="absolute left-1.5 top-0 z-20">
                <div className={`w-9 h-7 rounded-lg bg-gradient-to-br ${activeTheme?.chipClass} border border-amber-600/30 flex items-center justify-center p-0.5 shadow`}>
                  <div className="w-full h-full border border-amber-800/20 rounded flex flex-wrap justify-between p-0.5 opacity-80">
                    <div className="w-[45%] h-[40%] border-r border-b border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-l border-b border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-r border-t border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-l border-t border-amber-800/30" />
                  </div>
                </div>
              </div>

              <div className="absolute right-1.5 top-0.5 z-20">
                <span className="px-1.5 py-0.5 text-[7px] font-black uppercase rounded bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              </div>

              <div className="relative mt-1">
                <div className="absolute -inset-1 rounded-full opacity-35 blur-sm bg-gradient-to-r from-indigo-500 to-teal-500" />
                <div className={`w-18 h-18 ${getPhotoShapeClass(activeTheme?.photoShape)} ${isWhiteTheme ? 'bg-slate-100 border-slate-355' : 'bg-slate-900 border-white/20'} border-2 flex items-center justify-center overflow-hidden relative z-10 shadow-md`}>
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop'; }} />
                  ) : (
                    <User size={30} className={isWhiteTheme ? 'text-slate-455' : 'text-slate-500'} />
                  )}
                </div>
              </div>

              <div className="text-center mt-2 space-y-0.5">
                <h3 className={`text-xs font-black tracking-tight leading-tight card-fullName ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                  {fullName || 'Student Name'}
                </h3>
                <p className={`text-[8px] font-bold tracking-widest uppercase card-course ${activeTheme?.textAccent}`}>
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>
            </div>

            {/* Academic & Details section */}
            <div className={`rounded-xl p-2 border ${isWhiteTheme ? 'bg-slate-100/80 border-slate-250/90 text-slate-800' : 'bg-white/5 border-white/5 text-slate-300'} space-y-0.5 text-[8.5px] backdrop-blur-md`}>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">ID NO</span>
                <span className={`font-mono font-bold card-rollNo ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>{idNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">DEPT</span>
                <span className={`font-bold truncate max-w-[150px] card-dept ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>{department}</span>
              </div>
              {isStudent ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">YEAR / SEM</span>
                    <span className={`font-bold ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>{semester || 'Semester VII'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">SECTION</span>
                    <span className={`font-bold ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>{section || 'Section A'}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">BLOOD GROUP</span>
                <span className="font-bold text-red-500 flex items-center gap-0.5">
                  <Droplet size={8} className="fill-current" /> {bloodGroup}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">MOBILE</span>
                <span className={`font-bold font-mono ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>{phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold text-slate-455 uppercase tracking-wider">{isStudent ? 'BATCH' : 'EMPLOYMENT'}</span>
                <span className={`font-bold ${isWhiteTheme ? 'text-slate-800' : 'text-white'}`}>
                  {isStudent ? (year || '2022 - 2026') : (employmentType || 'Teaching')}
                </span>
              </div>
            </div>

            {/* Dual Signatures, QR and Barcode Bottom Area */}
            <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="flex justify-start bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[28px]">
                  {drawQRCode(idNumber, 28)}
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className={`signature-font text-[11px] leading-none text-center ${isWhiteTheme ? 'text-slate-800' : 'text-indigo-200'}`}>
                    {fullName.split(' ')[0] || 'Alex'}
                  </span>
                  <span className="text-[5px] text-slate-400 uppercase tracking-widest font-bold scale-90 mt-0.5">Student Sig</span>
                </div>
                <div className="flex flex-col items-center text-center relative">
                  <div className="absolute -top-3.5 opacity-90 pointer-events-none">
                    <svg className="w-8 h-8 text-red-500/25" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3,1" />
                      <text x="50" y="52" fontSize="12" fontWeight="black" textAnchor="middle" transform="rotate(-15 50 52)">VERIFIED</text>
                    </svg>
                  </div>
                  <span className="signature-font text-[11px] leading-none text-blue-500">Dr. Vinoth</span>
                  <span className="text-[5px] text-slate-400 uppercase tracking-widest font-bold scale-90 mt-0.5">Principal</span>
                </div>
              </div>
              <div className="text-center space-y-0.5">
                {drawBarcode(idNumber, 12)}
                <p className="text-[5px] font-mono tracking-widest text-slate-450 leading-none">*{idNumber}*</p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Landscape Front Layout Switcher
  const renderLandscapeFront = () => {
    switch (theme) {
      case 'minimal_light':
        return (
          <div className="w-full h-full flex items-center gap-4 pl-28 relative">
            {/* Left Header Sidebar */}
            <div className="absolute top-0 left-0 bottom-0 w-28 bg-indigo-900 text-white rounded-l-[22px] flex flex-col justify-between py-4 px-2 items-center text-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={12} />
                  )}
                </div>
                <h2 className="text-[8px] font-black tracking-wider uppercase leading-tight">
                  {data.collegeName || 'EduERP College'}
                </h2>
              </div>
              <p className="text-[4.5px] font-mono opacity-80 leading-none">
                {autonomousText}
              </p>
              <div className="bg-white p-0.5 rounded border border-slate-200">
                {drawQRCode(idNumber, 18)}
              </div>
            </div>

            {/* Right Photo & Details */}
            <div className="flex-1 flex flex-col justify-between h-full py-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-800 leading-tight">
                    {fullName || 'Student Name'}
                  </h3>
                  <p className="text-[7.5px] font-bold text-indigo-650 uppercase">
                    {isStudent ? (course || 'Course Name') : (designation || 'Faculty')}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-1.5 space-y-0.5 text-[7.5px] text-slate-700">
                <div className="flex justify-between"><span>ID NUMBER:</span><span className="font-mono font-bold text-slate-900">{idNumber}</span></div>
                <div className="flex justify-between"><span>DEPARTMENT:</span><span className="font-bold text-slate-900 truncate max-w-[120px]">{department}</span></div>
                <div className="flex justify-between"><span>BLOOD GROUP:</span><span className="font-bold text-red-600">{bloodGroup}</span></div>
              </div>

              {/* Barcode Footer */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-1 mt-1 gap-2">
                <div className="text-center">
                  <span className="signature-font text-[9px] text-slate-800">{fullName.split(' ')[0]}</span>
                  <p className="text-[3.5px] text-slate-400 uppercase font-black tracking-widest scale-90">Student Sig</p>
                </div>
                <div className="text-center">
                  <span className="signature-font text-[9px] text-blue-600">Dr. Vinoth</span>
                  <p className="text-[3.5px] text-slate-400 uppercase font-black tracking-widest scale-90">Principal</p>
                </div>
                <div className="shrink-0 text-center">
                  {drawBarcode(idNumber)}
                </div>
              </div>
            </div>
          </div>
        );

      case 'crimson_bold':
        return (
          <div className="w-full h-full flex flex-col justify-between relative pt-8">
            {/* Top Crimson Banner */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-rose-850 text-white rounded-t-[22px] flex items-center justify-between px-4 z-20">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={10} />
                  )}
                </div>
                <h2 className="text-[8.5px] font-black tracking-wider uppercase">
                  {data.collegeName || 'EduERP Engineering College'}
                </h2>
              </div>
              <span className="text-[6.5px] font-black tracking-widest uppercase opacity-90">
                {isStudent ? 'STUDENT ID' : 'FACULTY PASS'}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="flex-1 flex gap-3 items-center mt-2 py-0.5">
              {/* Photo & Badge */}
              <div className="w-[30%] flex flex-col items-center text-center space-y-1">
                <div className="w-13 h-13 rounded-xl border border-white/20 overflow-hidden bg-slate-900">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-slate-500" />
                  )}
                </div>
                <div className="bg-white/10 px-1 py-0.5 rounded text-[5px] text-rose-300 border border-white/5 uppercase">
                  {idNumber}
                </div>
              </div>

              {/* Details & Signatures */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[10px] font-black text-white leading-none">
                    {fullName || 'Student Name'}
                  </h3>
                  <p className="text-[7.5px] font-bold text-rose-350 uppercase mt-0.5">
                    {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-lg p-1 space-y-0.5 text-[7.5px] text-slate-350">
                  <div className="flex justify-between"><span>DEPT:</span><span className="font-bold text-white">{department}</span></div>
                  <div className="flex justify-between"><span>BLOOD:</span><span className="font-bold text-red-500">{bloodGroup}</span></div>
                  <div className="flex justify-between"><span>BATCH:</span><span className="font-bold text-white">{year}</span></div>
                </div>

                {/* Signatures & Barcode */}
                <div className="flex justify-between items-center border-t border-white/10 pt-1 mt-1 gap-2">
                  <div className="bg-white p-0.5 rounded border border-rose-500/20">{drawQRCode(idNumber, 18)}</div>
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-rose-250">{fullName.split(' ')[0]}</span>
                    <p className="text-[3.5px] text-slate-400 uppercase scale-90">Sig</p>
                  </div>
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-rose-250">Dr. Vinoth</span>
                    <p className="text-[3.5px] text-slate-400 uppercase scale-90">Principal</p>
                  </div>
                  <div className="shrink-0 text-center">
                    {drawBarcode(idNumber)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dark_cyber':
        return (
          <div className="w-full h-full flex gap-3 font-mono text-cyan-400">
            {/* Left side: circular glowing photo & QR code */}
            <div className="w-[30%] flex flex-col items-center justify-center space-y-2 border-r border-cyan-500/25 pr-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-cyan-500/20 animate-pulse blur-sm" />
                <div className="w-13 h-13 rounded-full border-2 border-cyan-400 flex items-center justify-center overflow-hidden bg-zinc-950 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-cyan-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white p-0.5 rounded border border-cyan-500/20">{drawQRCode(idNumber, 20)}</div>
            </div>

            {/* Right side details & RFID layout */}
            <div className="flex-1 flex flex-col justify-between py-0.5 h-full">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[4.5px] text-cyan-500 block uppercase font-bold tracking-widest leading-none">RFID ACCESS PASS</span>
                  <h3 className="text-[9.5px] font-black text-white leading-tight truncate max-w-[150px]">
                    {fullName || 'Student Name'}
                  </h3>
                  <p className="text-[7px] font-black text-cyan-300 uppercase leading-none">
                    {isStudent ? (course || 'CS Student') : (designation || 'Faculty')}
                  </p>
                </div>
                <span className="px-1 py-0.5 bg-cyan-950 text-cyan-400 text-[5px] font-bold border border-cyan-500/20 uppercase">
                  ACTIVE_NODE
                </span>
              </div>

              {/* Data terminal block */}
              <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-1.5 space-y-0.5 text-[7.5px] text-cyan-400">
                <div className="flex justify-between"><span>SYS_ID:</span><span className="text-white font-bold">{idNumber}</span></div>
                <div className="flex justify-between"><span>DEPT_NODE:</span><span className="text-white font-bold truncate max-w-[100px]">{department}</span></div>
                <div className="flex justify-between"><span>BLOOD_TYPE:</span><span className="text-red-400 font-bold">{bloodGroup}</span></div>
              </div>

              {/* Barcode tech footer */}
              <div className="flex justify-between items-center border-t border-cyan-500/20 pt-1 mt-1 gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-6 h-4 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded border border-cyan-500/30 flex items-center justify-center p-0.5">
                    <div className="w-full h-full border border-black/10 rounded flex flex-wrap justify-between p-0.2 opacity-80" />
                  </div>
                  <span className="text-[5px] text-cyan-500/70 font-bold">RFID CHIP</span>
                </div>
                <div className="shrink-0 text-center">
                  {drawBarcode(idNumber)}
                  <p className="text-[4px] text-cyan-500/50 leading-none">*{idNumber}*</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'emerald_classic':
        return (
          <div className="w-full h-full flex flex-col justify-between relative p-1">
            <div className="absolute inset-0 border border-amber-500/30 rounded-[20px] pointer-events-none" />
            <div className="absolute inset-0.5 border-2 border-amber-500/10 rounded-[18px] pointer-events-none" />

            <div className="w-full h-full flex gap-3 items-center p-2.5">
              {/* Photo Squircle Left */}
              <div className="w-[30%] flex flex-col items-center space-y-1">
                <div className="w-13 h-13 rounded-[24%] border-2 border-amber-500/35 overflow-hidden bg-slate-900 shadow-md">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-emerald-500" />
                  )}
                </div>
                <span className="text-[5.5px] font-serif text-amber-400 tracking-wider font-bold">ESTD 1984</span>
              </div>

              {/* Classical academic details right */}
              <div className="flex-1 flex flex-col justify-between h-full py-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[8.5px] font-serif font-black tracking-wider uppercase text-slate-100">
                      {data.collegeName || 'EduERP Classical College'}
                    </h2>
                    <h3 className="text-[10px] font-serif font-black text-white mt-0.5 leading-tight">
                      {fullName || 'Student Name'}
                    </h3>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/25 px-1 py-0.5 rounded text-[5px] text-emerald-300 font-serif">
                    {isStudent ? 'STUDENT' : 'FACULTY'}
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-amber-500/20 rounded-lg p-1.5 space-y-0.5 text-[7.5px] text-slate-200 font-serif">
                  <div className="flex justify-between"><span>Reg ID:</span><span className="font-mono text-white font-bold">{idNumber}</span></div>
                  <div className="flex justify-between"><span>Dept:</span><span className="text-white font-bold truncate max-w-[110px]">{department}</span></div>
                  <div className="flex justify-between"><span>Blood Group:</span><span className="text-red-400 font-bold">{bloodGroup}</span></div>
                </div>

                {/* Footer seal & signatures */}
                <div className="flex justify-between items-center border-t border-amber-500/20 pt-1.5 gap-2 mt-1">
                  <div className="bg-white p-0.5 rounded border border-amber-500/40">{drawQRCode(idNumber, 18)}</div>
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-amber-350">{fullName.split(' ')[0]}</span>
                    <p className="text-[3.5px] text-slate-400 uppercase tracking-widest scale-90">Sig</p>
                  </div>
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-amber-350">Dr. Vinoth</span>
                    <p className="text-[3.5px] text-slate-400 uppercase tracking-widest scale-90">Principal</p>
                  </div>
                  <div className="shrink-0 text-center">
                    {drawBarcode(idNumber)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gold_premium':
        return (
          <div className="w-full h-full flex gap-4 items-center p-2 relative">
            <div className="absolute top-1 right-2 opacity-60">
              <Award size={16} className="text-amber-500" />
            </div>

            {/* Shield Photo Left */}
            <div className="w-[30%] flex flex-col items-center space-y-1.5">
              <div className="w-13 h-13 clip-shield border border-amber-400 bg-stone-900 flex items-center justify-center overflow-hidden shadow-xl shadow-amber-500/10">
                {photo ? (
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-amber-400" />
                )}
              </div>
              <span className="text-[5px] font-serif text-amber-400 tracking-widest uppercase font-black">MEMBER</span>
            </div>

            {/* Luxury right half */}
            <div className="flex-1 flex flex-col justify-between h-full py-0.5">
              <div>
                <h2 className="text-[8.5px] font-serif font-black tracking-wider uppercase text-amber-400 leading-none">
                  {data.collegeName || 'EduERP Institute'}
                </h2>
                <h3 className="text-[10px] font-serif font-black text-amber-200 mt-1 leading-none">
                  {fullName || 'Student Name'}
                </h3>
                <p className="text-[7px] font-serif font-bold text-amber-500 uppercase mt-0.5">
                  {isStudent ? (course || 'Alumni') : (designation || 'Faculty')}
                </p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-1.5 space-y-0.5 text-[7.5px] text-stone-300">
                <div className="flex justify-between"><span>MEMBERSHIP ID:</span><span className="font-mono font-bold text-white">{idNumber}</span></div>
                <div className="flex justify-between"><span>DEPARTMENT:</span><span className="font-bold text-white truncate max-w-[110px]">{department}</span></div>
                <div className="flex justify-between"><span>VALID UNTIL:</span><span className="font-bold text-white">{validUntil}</span></div>
              </div>

              {/* Footer seal & signatures */}
              <div className="border-t border-amber-500/30 pt-1 flex justify-between items-center gap-2 mt-1">
                <div className="bg-white p-0.5 rounded border border-amber-50">{drawQRCode(idNumber, 18)}</div>
                <div className="text-right">
                  <span className="signature-font text-[9px] text-amber-400">Dr. Vinoth</span>
                  <p className="text-[3.5px] text-stone-500 uppercase tracking-widest scale-90 leading-none">Authorized Sig</p>
                </div>
                <div className="shrink-0 text-center">
                  {drawBarcode(idNumber)}
                </div>
              </div>
            </div>
          </div>
        );

      case 'medical_clean':
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Solid top clinical bar */}
            <div className="bg-teal-700 text-white rounded-t-[22px] p-2 text-center -mx-6 -mt-6 relative flex justify-between items-center px-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-white text-teal-700 flex items-center justify-center font-black text-[10px] shadow-sm">
                  +
                </div>
                <h2 className="text-[8.5px] font-black tracking-wider uppercase">
                  {data.collegeName || 'EduERP Medical'}
                </h2>
              </div>
              <span className="text-[5.5px] tracking-wide opacity-90 uppercase font-black bg-teal-850 px-2 py-0.5 rounded-full">
                {isStudent ? 'STUDENT PASS' : 'FACULTY PASS'}
              </span>
            </div>

            {/* Split body: left photo, right details */}
            <div className="flex-1 flex gap-4 items-center mt-2.5 py-0.5">
              <div className="w-[30%] flex flex-col items-center space-y-1">
                <div className="w-13 h-15 rounded-xl border border-teal-500/30 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-teal-400" />
                  )}
                </div>
                <span className="text-[6px] font-black text-red-650 bg-red-50 border border-red-100 rounded px-1">{bloodGroup}</span>
              </div>

              {/* Details & Signatures */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[9.5px] font-black text-slate-800 leading-tight">
                    {fullName || 'Student Name'}
                  </h3>
                  <p className="text-[7.5px] font-bold text-teal-650 uppercase">
                    {isStudent ? (course || 'Biotech Course') : (designation || 'Medical Staff')}
                  </p>
                </div>

                <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-1.5 space-y-0.5 text-[7px] text-slate-650">
                  <div className="flex justify-between"><span>HOSPITAL ID:</span><span className="font-mono font-bold text-slate-900">{idNumber}</span></div>
                  <div className="flex justify-between"><span>CLINICAL DEPT:</span><span className="font-bold text-slate-900 truncate max-w-[100px]">{department}</span></div>
                </div>

                {/* Footer signatures & barcode */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-1 mt-1 gap-2">
                  <div className="bg-white p-0.5 border border-slate-200 rounded">{drawQRCode(idNumber, 18)}</div>
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-slate-700">Dr. Vinoth</span>
                    <p className="text-[3px] text-slate-400 uppercase scale-90">Principal</p>
                  </div>
                  <div className="shrink-0 text-center">
                    {drawBarcode(idNumber)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'orange_sunset':
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500 rounded-full blur-2xl opacity-30 pointer-events-none" />

            <div className="w-full h-full flex gap-4 items-center">
              {/* Photo & QR code left */}
              <div className="w-[30%] flex flex-col items-center space-y-2">
                <div className="relative">
                  <div className="absolute inset-0.5 bg-orange-500 rounded-2xl rotate-3 shadow-md" />
                  <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-900 border border-white/20 relative z-10">
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-orange-500" />
                    )}
                  </div>
                </div>
                <div className="bg-white p-0.5 rounded border border-orange-500/30">{drawQRCode(idNumber, 20)}</div>
              </div>

              {/* Details right */}
              <div className="flex-1 flex flex-col justify-between h-full py-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[5px] font-black text-orange-400 uppercase tracking-widest">CREATIVE ARTS PASS</span>
                    <h3 className="text-[9.5px] font-black uppercase text-white leading-tight mt-0.5">
                      {fullName || 'Student Name'}
                    </h3>
                  </div>
                  <span className="text-[5.5px] text-slate-400 uppercase font-mono">ESTD 1984</span>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-lg p-1.5 space-y-0.5 text-[7px] text-slate-350">
                  <div className="flex justify-between"><span>DEPT:</span><span className="font-bold text-white truncate max-w-[110px]">{department}</span></div>
                  <div className="flex justify-between"><span>BATCH:</span><span className="font-bold text-white">{year}</span></div>
                  <div className="flex justify-between"><span>BLOOD:</span><span className="font-bold text-orange-400">{bloodGroup}</span></div>
                </div>

                {/* Footer signatures & barcode */}
                <div className="flex justify-between items-center border-t border-white/10 pt-1 mt-1 gap-2">
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-orange-200">{fullName.split(' ')[0]}</span>
                    <p className="text-[3px] text-slate-500 uppercase tracking-widest scale-90">Sig</p>
                  </div>
                  <div className="text-center">
                    <span className="signature-font text-[9px] text-orange-200">Dr. Vinoth</span>
                    <p className="text-[3px] text-slate-500 uppercase tracking-widest scale-90">Principal</p>
                  </div>
                  <div className="shrink-0 text-center">
                    {drawBarcode(idNumber)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // 'modern_indigo' or 'custom' or 'glass_translucent' (Standard Landscape Layout)
        return (
          <div className="w-full h-full flex gap-4 items-center">
            {/* Left Half: Logo, Photo, Name */}
            <div className="w-[42%] flex flex-col items-center justify-center text-center space-y-1.5 border-r border-white/10 pr-2">
              <div className="flex flex-col items-center gap-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${activeTheme?.logoClass} overflow-hidden`}>
                  {data.collegeLogoUrl ? (
                    <img src={data.collegeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={12} />
                  )}
                </div>
                <h2 className={`text-[8.5px] font-black tracking-wider uppercase leading-tight ${isWhiteTheme ? 'text-slate-800' : 'text-slate-100'}`}>
                  {data.collegeName || 'EduERP College'}
                </h2>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-full opacity-35 blur-sm bg-gradient-to-r from-indigo-500 to-teal-500" />
                <div className={`w-15 h-15 ${getPhotoShapeClass(activeTheme?.photoShape)} ${isWhiteTheme ? 'bg-slate-100 border-slate-355' : 'bg-slate-900 border-white/20'} border flex items-center justify-center overflow-hidden relative z-10 shadow-md`}>
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop'; }} />
                  ) : (
                    <User size={22} className="text-slate-500" />
                  )}
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className={`text-[10px] font-black tracking-tight leading-none truncate max-w-[125px] card-fullName ${isWhiteTheme ? 'text-slate-900' : 'text-white'}`}>
                  {fullName || 'Student Name'}
                </h3>
                <p className={`text-[7.5px] font-bold tracking-wider truncate max-w-[125px] card-course ${activeTheme?.textAccent}`}>
                  {isStudent ? (course || 'Course Name') : (designation || 'Faculty Member')}
                </p>
              </div>
            </div>

            {/* Right Half: Details & Signatures */}
            <div className="flex-1 flex flex-col justify-between h-full py-0.5">
              <div className="flex justify-between items-center">
                <div className={`w-8 h-5 rounded bg-gradient-to-br ${activeTheme?.chipClass} border border-amber-600/30 flex items-center justify-center p-0.5 shadow-xs`}>
                  <div className="w-full h-full border border-amber-800/10 rounded flex flex-wrap justify-between p-0.5 opacity-80">
                    <div className="w-[45%] h-[40%] border-r border-b border-amber-800/30" />
                    <div className="w-[45%] h-[40%] border-l border-b border-amber-800/30" />
                  </div>
                </div>

                <span className={`text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${activeTheme?.badgeClass}`}>
                  {isStudent ? 'STUDENT ID' : 'FACULTY ID'}
                </span>
              </div>

              {/* Details grid */}
              <div className={`rounded-lg p-1.5 border ${isWhiteTheme ? 'bg-slate-100 border-slate-200/80 text-slate-800' : 'bg-white/5 border-white/5 text-slate-350'} space-y-0.5 mt-1 text-[8px] leading-tight backdrop-blur-md`}>
                <div className="flex justify-between">
                  <span className="text-slate-455 uppercase tracking-widest text-[6px]">ID NO</span>
                  <span className="font-bold font-mono card-rollNo">{idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-455 uppercase tracking-widest text-[6px]">DEPT</span>
                  <span className="font-bold card-dept truncate max-w-[120px]">{department}</span>
                </div>
                {isStudent ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-455 uppercase tracking-widest text-[6px]">YEAR / SEM</span>
                      <span className="font-bold">{semester || 'Semester VII'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455 uppercase tracking-widest text-[6px]">BLOOD GROUP</span>
                      <span className="font-bold text-red-500">{bloodGroup}</span>
                    </div>
                  </>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-slate-455 uppercase tracking-widest text-[6px]">{isStudent ? 'BATCH' : 'EMPLOYMENT'}</span>
                  <span className="font-bold">{isStudent ? (year || '2022 - 2026') : (employmentType || 'Teaching')}</span>
                </div>
              </div>

              {/* Footer with Signatures, QR and Barcode */}
              <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/10 gap-2">
                <div className="flex bg-white p-0.5 rounded border border-slate-200 shadow-xs max-w-[24px]">
                  {drawQRCode(idNumber)}
                </div>
                <div className="flex flex-col items-center">
                  <span className={`signature-font text-[9px] leading-none ${isWhiteTheme ? 'text-slate-800' : 'text-indigo-200'}`}>
                    {fullName.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Sig</span>
                </div>
                <div className="flex flex-col items-center relative">
                  <span className="signature-font text-[9px] leading-none text-blue-500">Dr. Vinoth</span>
                  <span className="text-[4px] text-slate-400 uppercase tracking-widest font-bold">Principal</span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  {drawBarcode(idNumber)}
                  <p className="text-[4px] font-mono tracking-widest text-slate-450 leading-none">*{idNumber}*</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6">

      {/* Control Actions Panel */}
      <div className="w-full max-w-md flex flex-wrap gap-2 justify-between items-center bg-white p-3.5 border border-slate-100 rounded-2xl shadow-sm print:hidden">

        {/* Front / Back Switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setCardSide('front')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${cardSide === 'front' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Front
          </button>
          <button
            onClick={() => setCardSide('back')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${cardSide === 'back' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Back
          </button>
        </div>

        {/* Portrait / Landscape Switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setOrientation('portrait')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${orientation === 'portrait' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Portrait
          </button>
          <button
            onClick={() => setOrientation('landscape')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${orientation === 'landscape' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Landscape
          </button>
        </div>

        {/* Theme select dropdown */}
        <select
          value={theme}
          onChange={e => {
            const val = e.target.value;
            setTheme(val);
            if (templates[val]) {
              setPrimaryColor(templates[val].defaultPrimary);
              setAccentColor(templates[val].defaultAccent);
            }
          }}
          className="px-2 py-1 bg-slate-50 text-[10px] font-bold border border-slate-200 rounded-lg outline-none text-slate-700 cursor-pointer"
        >
          {Object.keys(templates).map(t => (
            <option key={t} value={t}>{templates[t].name}</option>
          ))}
        </select>

        {/* Export buttons */}
        <div className="flex gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] shadow-sm disabled:opacity-75"
          >
            <Download size={10} /> {isGeneratingPdf ? 'PDF...' : 'PDF'}
          </button>
          <button
            onClick={handleDownloadPNG}
            disabled={isGeneratingPng}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-slate-850 hover:bg-slate-750 text-slate-200 px-2.5 py-1.5 rounded-lg font-bold text-[10px] shadow-sm disabled:opacity-75 border border-slate-750"
          >
            <FileImage size={10} /> {isGeneratingPng ? 'PNG...' : 'PNG'}
          </button>
          <button
            onClick={handlePrint}
            className="flex-none px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-1.5 rounded-lg font-bold text-[10px] shadow-sm"
          >
            <Printer size={10} />
          </button>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        .signature-font {
          font-family: 'Caveat', cursive;
        }
        .clip-shield {
          clip-path: polygon(50% 0%, 100% 15%, 100% 80%, 50% 100%, 0% 80%, 0% 15%);
        }
        @keyframes holographic-shine {
          0% { background-position: -200% 0%; }
          100% { background-position: 200% 0%; }
        }
        .holo-overlay {
          background-size: 200% 200%;
        }
        .holo-overlay:hover {
          animation: holographic-shine 2s linear infinite;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .preview-card-area, .preview-card-area * {
            visibility: visible;
          }
          .preview-card-area {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%) scale(1.4);
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Card Preview Frame */}
      <div className="w-full flex items-center justify-center p-6 bg-slate-100 rounded-[28px] border border-slate-200/50 min-h-[510px] relative overflow-hidden">

        {theme === 'glass_translucent' && (
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 opacity-20 blur-xl pointer-events-none scale-95" />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -8, rotateY: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="preview-card-area relative group cursor-grab"
        >
          <div
            ref={cardRef}
            id="preview-id-card"
            className={`relative rounded-[24px] p-6 border flex flex-col justify-between items-center transition-all duration-500 shadow-2xl select-none ${isWhiteTheme ? 'text-slate-900' : 'text-white'
              } ${activeTheme?.bgClass} ${activeTheme?.borderClass} ${activeTheme?.glowClass} ${orientation === 'portrait' ? 'w-[310px] h-[490px]' : 'w-[490px] h-[310px]'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-700 bg-[length:200%_200%] holo-overlay -z-1" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Watermark Rendering */}
            {renderWatermark(activeTheme?.watermark, isWhiteTheme)}

            {theme === 'custom' && (
              <style>{`
                .custom-palette-style {
                  background: linear-gradient(135deg, ${primaryColor}, ${accentColor} 80%, ${primaryColor}) !important;
                  border-color: ${accentColor}40 !important;
                  box-shadow: 0 0 35px ${accentColor}25 !important;
                }
                .custom-text-accent {
                  color: ${accentColor} !important;
                }
                .custom-logo {
                  background-color: ${primaryColor}30 !important;
                  border-color: ${primaryColor}50 !important;
                  color: ${primaryColor} !important;
                }
                .custom-badge {
                  background-color: ${accentColor}20 !important;
                  border-color: ${accentColor}30 !important;
                  color: ${accentColor} !important;
                }
              `}</style>
            )}

            <div className="w-full h-full flex flex-col justify-between relative z-10">

              {/* Slot Punch Hanger Hole */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-950/20 dark:bg-black/30 rounded-full border border-white/10 flex items-center justify-center z-20">
                <div className="w-8 h-1 bg-slate-900 dark:bg-black/60 rounded-full" />
              </div>

              <AnimatePresence mode="wait">
                {cardSide === 'front' ? (
                  <motion.div
                    key={`${template}-front-${orientation}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex flex-col justify-between relative z-10"
                  >
                    {orientation === 'portrait' ? (
                      /* ================== PORTRAIT FRONT ================== */
                      renderPortraitFront()
                    ) : (
                      /* ================== LANDSCAPE FRONT ================== */
                      renderLandscapeFront()
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${template}-back-${orientation}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex flex-col justify-between relative z-10"
                  >
                    {orientation === 'portrait' ? (
                      renderPortraitBack({
                        theme,
                        isWhiteTheme,
                        parentName,
                        parentPhone,
                        emergencyContact,
                        parentAddress,
                        isStudent,
                        busRoute,
                        hostelStatus,
                        libraryId,
                        accentColor,
                        drawQRCode
                      })
                    ) : (
                      renderLandscapeBack({
                        theme,
                        isWhiteTheme,
                        parentName,
                        parentPhone,
                        emergencyContact,
                        parentAddress,
                        isStudent,
                        busRoute,
                        hostelStatus,
                        libraryId,
                        accentColor,
                        drawQRCode
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const IdCardGenerator = () => {
  const [activeTab, setActiveTab] = useState('Student'); // Student or Staff
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Lifted Preview State
  const [cardSide, setCardSide] = useState('front');
  const [orientation, setOrientation] = useState('portrait');
  const [theme, setTheme] = useState('modern_indigo');
  const [primaryColor, setPrimaryColor] = useState('#1e1b4b');
  const [accentColor, setAccentColor] = useState('#6366f1');

  // Form State
  const [formData, setFormData] = useState({
    collegeName: 'EduERP Engineering College',
    subHeader: 'Guindy Campus, Chennai',
    autonomousText: 'Autonomous Institution - Affiliated to Anna University',
    collegeAddress: 'Sardar Patel Road, Guindy, Chennai - 600025',
    collegeLogoUrl: '',
    fullName: '',
    department: 'Computer Science',
    course: 'B.E. Computer Science',
    semester: 'Semester VII',
    section: 'Section A',
    registerNumber: '',
    bloodGroup: 'O+ Positive',
    phone: '',
    year: '2022 - 2026',
    designation: 'Assistant Professor',
    employmentType: 'Teaching',
    staffId: '',
    parentName: 'Robert Harrison',
    parentPhone: '9840123456',
    emergencyContact: '9840654321',
    busRoute: 'N/A',
    hostelRequired: false,
    hostelStatus: 'Day Scholar',
    libraryId: '',
    validUntil: 'May 2026',
    parentAddress: '12, Gandhi Nagar, Adyar, Chennai - 600020',
    photoUrl: ''
  });

  // Fetch lists on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentRes, staffRes] = await Promise.all([
          api.get('/id-cards/students').catch(() => ({ data: [] })),
          api.get('/id-cards/staff').catch(() => ({ data: [] }))
        ]);

        const studentData = Array.isArray(studentRes.data) ? studentRes.data :
          (studentRes.data?.students ? studentRes.data.students : []);
        const staffData = Array.isArray(staffRes.data) ? staffRes.data :
          (staffRes.data?.staff ? staffRes.data.staff : []);

        setStudents(studentData);
        setStaffList(staffData);
      } catch (error) {
        console.error('Error fetching erp records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync selected record to form data
  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    if (!record) return;

    if (activeTab === 'Student') {
      setFormData(prev => ({
        ...prev,
        fullName: record.fullName || record.name || '',
        department: record.department || 'Computer Science',
        course: record.course || 'B.E. Computer Science',
        semester: record.semester || 'Semester VII',
        section: record.section || 'Section A',
        registerNumber: record.registerNumber || record.rollNo || '',
        bloodGroup: record.bloodGroup || 'O+ Positive',
        phone: record.phone || '',
        year: record.year || '2022 - 2026',
        designation: '',
        employmentType: '',
        staffId: '',
        parentName: record.parentName || record.fatherName || 'Robert Harrison',
        parentPhone: record.parentPhone || record.fatherPhone || '9840123456',
        emergencyContact: record.emergencyContact || '9840654321',
        busRoute: record.busRoute || 'N/A',
        hostelRequired: !!record.hostelRequired,
        hostelStatus: record.hostelRequired ? 'Hosteler' : 'Day Scholar',
        libraryId: record.libraryId || `LIB-${record.registerNumber || record.rollNo || 'REG-0001'}`,
        validUntil: record.validUntil || 'May 2026',
        parentAddress: record.parentAddress || record.permanentAddress || '12, Gandhi Nagar, Adyar, Chennai - 600020',
        photoUrl: record.photoUrl || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fullName: record.fullName || record.name || '',
        department: record.department || 'Computer Science',
        course: '',
        semester: '',
        section: '',
        registerNumber: '',
        bloodGroup: record.bloodGroup || 'O+ Positive',
        phone: record.phone || '',
        year: '',
        designation: record.designation || 'Assistant Professor',
        employmentType: record.employmentType || 'Teaching',
        staffId: record.staffId || '',
        parentName: 'Robert Harrison',
        parentPhone: '9840123456',
        emergencyContact: record.emergencyContact || '9840654321',
        busRoute: 'N/A',
        hostelRequired: false,
        hostelStatus: 'N/A',
        libraryId: record.libraryId || `LIB-${record.staffId || 'EMP-0001'}`,
        validUntil: record.validUntil || 'May 2028',
        parentAddress: record.parentAddress || record.permanentAddress || '12, Gandhi Nagar, Adyar, Chennai - 600020',
        photoUrl: record.photoUrl || ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Image uploader handler (converting file to base64 for html2canvas support)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
        toast.success('Photo uploaded successfully for preview');
      };
      reader.readAsDataURL(file);
    }
  };

  // College Logo uploader handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, collegeLogoUrl: reader.result }));
        toast.success('College Logo updated successfully for preview');
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter records based on search term
  const filteredRecords = activeTab === 'Student'
    ? students.filter(s =>
      (s.fullName || s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.registerNumber || s.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    : staffList.filter(s =>
      (s.fullName || s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.staffId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6 w-full pb-12 px-4 sm:px-6 print:p-0 print:m-0">

      {/* Title Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              ERP Module
            </span>
            <h1 className="text-3xl font-black mt-2 tracking-tight flex items-center gap-2">
              <Sparkles className="text-amber-400" size={28} /> Premium ID Card Generator
            </h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">
              Select records or type manually to construct and download secure identity badges.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
          >
            <Printer size={18} /> Print Badges Page
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">

        {/* Editor Config Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 print:hidden">

          {/* Active Tab Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('Student');
                setSelectedRecord(null);
                setSearchTerm('');
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'Student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Student ID Card
            </button>
            <button
              onClick={() => {
                setActiveTab('Staff');
                setSelectedRecord(null);
                setSearchTerm('');
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'Staff' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Staff / Employee ID Card
            </button>
          </div>

          {/* Search Dropdown / Record Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
              Search & Select {activeTab} from ERP Database
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab} by name or ID...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchTerm && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map(rec => (
                      <button
                        key={rec.id || rec._id}
                        onClick={() => {
                          handleSelectRecord(rec);
                          setSearchTerm('');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-0 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{rec.fullName || rec.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {activeTab === 'Student' ? (rec.registerNumber || rec.rollNo) : rec.staffId}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {rec.department}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">No matching records found</div>
                  )}
                </div>
              )}
            </div>
            {selectedRecord && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 rounded-xl text-xs flex justify-between items-center">
                <span>Loaded ERP Profile: <strong>{selectedRecord.fullName || selectedRecord.name}</strong></span>
                <button
                  onClick={() => handleSelectRecord(null)}
                  className="font-bold text-emerald-600 hover:text-emerald-800"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* College Brand Info */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="font-black text-slate-800 text-sm border-b border-slate-150 pb-2 flex items-center gap-1.5">
              <Building size={16} className="text-indigo-500" /> College Brand Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">College Name</label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. EduERP Engineering College"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Campus Sub-Header</label>
                <input
                  type="text"
                  name="subHeader"
                  value={formData.subHeader || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Guindy Campus, Chennai"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Accreditation Info</label>
                <input
                  type="text"
                  name="autonomousText"
                  value={formData.autonomousText || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Autonomous Institution | Affiliated to Anna University"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">College Address</label>
                <input
                  type="text"
                  name="collegeAddress"
                  value={formData.collegeAddress || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Sardar Patel Road, Chennai"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">College Logo Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="college-logo-upload"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="college-logo-upload"
                    className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all animate-pulse hover:animate-none"
                  >
                    <Building size={14} /> Upload Custom Logo
                  </label>
                  {formData.collegeLogoUrl && (
                    <div className="flex items-center gap-2">
                      <img src={formData.collegeLogoUrl} alt="Logo preview" className="w-8 h-8 object-contain border rounded p-0.5 bg-slate-50" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, collegeLogoUrl: '' }))}
                        className="text-[10px] text-red-500 hover:underline font-bold"
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form details editor */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 text-sm border-b border-slate-150 pb-2">
              Badge Fields Configurator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Johnathan Doe"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  {activeTab === 'Student' ? 'Roll / Register No' : 'Staff Employee ID'}
                </label>
                <input
                  type="text"
                  name={activeTab === 'Student' ? 'registerNumber' : 'staffId'}
                  value={activeTab === 'Student' ? formData.registerNumber : formData.staffId}
                  onChange={handleInputChange}
                  placeholder={activeTab === 'Student' ? 'e.g. REG20261102' : 'e.g. EMP-2026-04'}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {activeTab === 'Student' ? (
                <>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Course Degree</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Semester</label>
                    <input
                      type="text"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Section</label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Batch Year Range</label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Employment Type</label>
                    <input
                      type="text"
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Blood Group</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Contact Mobile</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Valid Until</label>
                <input
                  type="text"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Library ID</label>
                <input
                  type="text"
                  name="libraryId"
                  value={formData.libraryId}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700">Residential, Parent & Emergency Info (Back of Badge)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent Contact</label>
                  <input
                    type="text"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Emergency contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {activeTab === 'Student' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Bus Route</label>
                      <input
                        type="text"
                        name="busRoute"
                        value={formData.busRoute}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Hostel Status</label>
                      <input
                        type="text"
                        name="hostelStatus"
                        value={formData.hostelStatus}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Permanent Address</label>
                <textarea
                  name="parentAddress"
                  value={formData.parentAddress}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Photo Upload</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="id-badge-photo-upload"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="id-badge-photo-upload"
                    className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <FileImage size={15} /> Choose Photo
                  </label>
                  {formData.photoUrl && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                      Custom Photo Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Template Selector */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <Palette size={16} className="text-indigo-500" /> Choose ID Badge Template
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(templates).map(key => {
                const isSelected = theme === key;
                const temp = templates[key];

                // Construct mini preview background
                let previewStyle = {};
                if (key === 'custom') {
                  previewStyle = {
                    background: `linear-gradient(135deg, ${primaryColor}, ${accentColor} 80%, ${primaryColor})`
                  };
                }

                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme(key);
                      setPrimaryColor(temp.defaultPrimary);
                      setAccentColor(temp.defaultAccent);
                    }}
                    className={`relative flex flex-col items-stretch text-left rounded-xl border p-2 transition-all cursor-pointer overflow-hidden ${isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md bg-indigo-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                  >
                    {/* Mini Preview Bar */}
                    <div
                      style={previewStyle}
                      className={`h-12 w-full rounded-lg mb-2 relative flex items-center justify-between px-2 overflow-hidden ${key !== 'custom' ? temp.bgClass : ''
                        }`}
                    >
                      {/* Logo and photo shape skeleton */}
                      <div className="w-4 h-4 rounded-full bg-white/20" />
                      <div className="w-6 h-6 rounded-md bg-white/30" />
                    </div>

                    <div className="px-0.5">
                      <p className="text-[10px] font-black text-slate-800 truncate leading-tight">
                        {temp.name}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 mt-0.5 leading-none">
                        {temp.category}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Check size={8} strokeWidth={4} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Theme Color Customization */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <Sparkles size={16} className="text-indigo-500" /> Color Customization
              </h3>
              {theme !== 'custom' && (
                <button
                  onClick={() => {
                    setTheme('custom');
                  }}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Switch to Custom Theme to Edit Colors
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Color Picker */}
              <div className="bg-slate-50/50 p-3.5 border border-slate-150 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Primary Theme Color</span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{primaryColor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      if (theme !== 'custom') setTheme('custom');
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-sm shrink-0"
                  />

                  {/* Swatches */}
                  <div className="flex flex-wrap gap-1.5">
                    {['#1e1b4b', '#064e3b', '#991b1b', '#18181b', '#1c1917', '#0369a1', '#0f766e', '#7c2d12'].map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setPrimaryColor(c);
                          if (theme !== 'custom') setTheme('custom');
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border border-white shadow-sm transition-transform hover:scale-110 active:scale-95 ${primaryColor === c ? 'ring-2 ring-indigo-500' : ''
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="bg-slate-50/50 p-3.5 border border-slate-150 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Accent Highlight Color</span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{accentColor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      if (theme !== 'custom') setTheme('custom');
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-sm shrink-0"
                  />

                  {/* Swatches */}
                  <div className="flex flex-wrap gap-1.5">
                    {['#6366f1', '#10b981', '#f43f5e', '#06b6d4', '#d97706', '#0ea5e9', '#14b8a6', '#f97316'].map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setAccentColor(c);
                          if (theme !== 'custom') setTheme('custom');
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border border-white shadow-sm transition-transform hover:scale-110 active:scale-95 ${accentColor === c ? 'ring-2 ring-indigo-500' : ''
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="sticky top-6">
            <IDCardPreview
              type={activeTab}
              data={formData}
              cardSide={cardSide}
              setCardSide={setCardSide}
              orientation={orientation}
              setOrientation={setOrientation}
              theme={theme}
              setTheme={setTheme}
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default IdCardGenerator;