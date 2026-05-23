import React from 'react';
import { Award, Briefcase, BookOpen, GraduationCap } from 'lucide-react';

const CareerExperiencePanel = ({ staff = {} }) => {
  const safeData = staff || {};

  const experienceYears = safeData.yearsOfExperience || safeData.experience || '8 Years';
  const qualification = safeData.qualification || 'Ph.D. in Computer Science';
  const specialization = safeData.specialization || 'Artificial Intelligence & Neural Networks';

  return (
    <div className="space-y-6">
      
      {/* Upper summary blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
            <Briefcase size={20} />
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Total Practice</span>
            <span className="text-sm font-black text-slate-800 uppercase">{experienceYears}</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Degree Credentials</span>
            <span className="text-sm font-black text-slate-800 uppercase">{qualification}</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Main Specialization</span>
            <span className="text-[10px] font-black text-slate-800 uppercase leading-snug">{specialization}</span>
          </div>
        </div>

      </div>

      {/* Corporate Career Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-indigo-500" /> Professional institutional history
        </h4>
        
        <div className="relative border-l border-slate-200 ml-3 pl-5 space-y-5">
          <div className="relative">
            <div className="absolute -left-7.5 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white shadow-xs" />
            <div>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">2018 - Present</span>
              <h5 className="text-xs font-black text-slate-800 uppercase mt-0.5">Associate Professor</h5>
              <p className="text-[9px] font-bold text-slate-500 uppercase">EduERP University • Regular Tenure</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-7.5 w-4 h-4 bg-slate-300 rounded-full border-4 border-white shadow-xs" />
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">2015 - 2018</span>
              <h5 className="text-xs font-black text-slate-800 uppercase mt-0.5">Assistant Professor</h5>
              <p className="text-[9px] font-bold text-slate-500 uppercase">National Institute of Technology (NIT) • Teaching Faculty</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-7.5 w-4 h-4 bg-slate-300 rounded-full border-4 border-white shadow-xs" />
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">2012 - 2015</span>
              <h5 className="text-xs font-black text-slate-800 uppercase mt-0.5">Senior Research Analyst</h5>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Center for Advanced Computing • AI Labs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Publications, Conferences & Awards split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Research & Publications */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500" /> Research papers & publications
          </h4>
          
          <div className="space-y-3">
            <div className="bg-white border border-slate-200/40 rounded-xl p-3">
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-wider block">IEEE journal 2025</span>
              <p className="text-[10px] font-bold text-slate-700 leading-relaxed mt-0.5">
                "Hyperparameter Optimization on Feed-Forward Neural Architectures"
              </p>
            </div>
            <div className="bg-white border border-slate-200/40 rounded-xl p-3">
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-wider block">Springer-Nature 2024</span>
              <p className="text-[10px] font-bold text-slate-700 leading-relaxed mt-0.5">
                "Scalability Challenges in Distributed Institution Database Architectures"
              </p>
            </div>
          </div>
        </div>

        {/* Certifications and Awards */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-indigo-500" /> Certifications & Institutional Laurels
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white border border-slate-200/40 rounded-xl p-3">
              <Award className="text-amber-500 mx-auto mb-1.5" size={24} />
              <span className="text-[9px] font-black text-slate-700 uppercase block">Best Academic Mentor</span>
              <span className="text-[7px] font-bold text-slate-400 block mt-0.5">EduERP University 2024</span>
            </div>

            <div className="bg-white border border-slate-200/40 rounded-xl p-3">
              <Award className="text-blue-500 mx-auto mb-1.5" size={24} />
              <span className="text-[9px] font-black text-slate-700 uppercase block">AWS Cloud Architect</span>
              <span className="text-[7px] font-bold text-slate-400 block mt-0.5">AWS Certified Professional</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CareerExperiencePanel;
