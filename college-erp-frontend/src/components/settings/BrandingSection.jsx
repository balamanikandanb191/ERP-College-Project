import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Palette, Upload, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const BrandingSection = ({ data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('photo', file); // Using existing staff photo endpoint for now or create generic one
      
      const response = await api.post('/uploads/photo/staff/branding', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newUrl = response.data.photoUrl;
      setFormData(prev => ({ ...prev, [type]: newUrl }));
      toast.success(`${type.replace('_', ' ')} uploaded`);
    } catch (error) {
      toast.error('Logo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const colors = [
    { name: 'Blue ERP', value: '#2563eb' },
    { name: 'Indigo Corporate', value: '#4f46e5' },
    { name: 'Emerald Campus', value: '#059669' },
    { name: 'Rose Academy', value: '#e11d48' },
    { name: 'Amber State', value: '#d97706' },
    { name: 'Slate Gray', value: '#475569' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Logos */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-purple-100 rounded-xl text-purple-600"><ImageIcon size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">Visual Identity</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px]">College Logo</label>
              <div className="h-40 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 group relative overflow-hidden transition-all hover:border-blue-300">
                {formData.college_logo ? (
                  <img src={`http://localhost:5000/${formData.college_logo}`} alt="Logo" className="max-h-full object-contain" />
                ) : (
                  <ImageIcon size={32} className="text-slate-300" />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Upload size={24} className="text-white" />
                  <input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, 'college_logo')} />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Official Seal</label>
              <div className="h-40 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 group relative overflow-hidden transition-all hover:border-blue-300">
                {formData.official_seal ? (
                  <img src={`http://localhost:5000/${formData.official_seal}`} alt="Seal" className="max-h-full object-contain" />
                ) : (
                  <ImageIcon size={32} className="text-slate-300" />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Upload size={24} className="text-white" />
                  <input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, 'official_seal')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-pink-100 rounded-xl text-pink-600"><Palette size={20}/></div>
             <h3 className="text-lg font-bold text-slate-800">ERP Theme Color</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setFormData({ ...formData, theme_color: color.value })}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  formData.theme_color === color.value 
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10' 
                  : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-lg shadow-sm" style={{ backgroundColor: color.value }}></div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-800">{color.name}</span>
                </div>
                {formData.theme_color === color.value && <Check size={14} className="ml-auto text-blue-600" />}
              </button>
            ))}
          </div>

          <div className="pt-4">
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">Custom Primary Color</label>
             <div className="flex gap-4">
                <input 
                  type="color" 
                  name="theme_color"
                  value={formData.theme_color || '#2563eb'} 
                  onChange={handleChange}
                  className="w-16 h-12 p-1 rounded-xl bg-white border border-slate-200 cursor-pointer"
                />
                <input 
                  type="text" 
                  name="theme_color"
                  value={formData.theme_color || '#2563eb'} 
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
        <button 
          onClick={() => onSave(formData)}
          disabled={saving || uploading}
          className="flex items-center gap-2 px-10 py-3 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? 'Saving...' : (
            <>
              <Save size={18} />
              Update Branding
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BrandingSection;
