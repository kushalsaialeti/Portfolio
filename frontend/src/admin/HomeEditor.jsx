import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, User, LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeEditor() {
  const { sections, fetchSection, updateSection, uploadMedia, replaceMedia } = useContext(CmsContext);
  const [localData, setLocalData] = useState({
    profile: { name: '', tagline: '', portrait: { url: '', public_id: '' } },
    stack: [],
    metaIslands: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSection('home');
  }, []);

  useEffect(() => {
    if (sections.home) {
      setLocalData(sections.home);
    }
  }, [sections.home]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('home', localData);
      alert('Landing Page configuration committed.');
    } catch (error) {
      alert('Commit failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updated = { ...localData };
    let curr = updated;
    for (let i = 0; i < keys.length - 1; i++) {
        curr = (curr[keys[i]] = { ...curr[keys[i]] });
    }
    curr[keys[keys.length - 1]] = value;
    setLocalData(updated);
  };

  const handlePortraitChange = async (file) => {
    setIsUploading(true);
    const oldPublicId = localData.profile?.portrait?.public_id;
    try {
      let result;
      if (oldPublicId) {
        result = await replaceMedia(file, oldPublicId);
      } else {
        result = await uploadMedia(file);
      }
      handleChange('profile.portrait', { url: result.url, public_id: result.public_id });
    } catch (error) {
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Hero Architect</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Control your core identity & first impression</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-[#27c93f] text-black border border-[#27c93f] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* IDENTITY BLOCK */}
        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Identity Configuration</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
             {/* PORTRAIT PREVIEW & UPLOAD */}
             <div className="relative group">
                <div className="w-32 h-32 rounded-[28px] bg-black/40 border border-white/5 overflow-hidden relative">
                   <img 
                      src={localData.profile?.portrait?.url || "/images/portrait.png"} 
                      className={`w-full h-full object-cover transition-all duration-700 ${isUploading ? 'opacity-20 blur-sm' : 'grayscale group-hover:grayscale-0'}`}
                      alt="Identity Portrait" 
                   />
                   {isUploading && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-[#27c93f] animate-spin" />
                     </div>
                   )}
                   <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/60 flex items-center justify-center transition-all">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handlePortraitChange(e.target.files[0])}
                      />
                      <ImageIcon className="w-6 h-6 text-white" />
                   </label>
                </div>
                <div className="absolute -inset-4 bg-[#27c93f]/[0.03] blur-2xl -z-10 rounded-full" />
             </div>

             <div className="flex-grow space-y-4 w-full">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Primary Display Name</label>
                  <input 
                    value={localData.profile?.name || ''}
                    onChange={(e) => handleChange('profile.name', e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none font-medium"
                  />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Impact Tagline</label>
            <textarea 
              value={localData.profile?.tagline || ''}
              rows={3}
              onChange={(e) => handleChange('profile.tagline', e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none resize-none font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* TECH STACK BLOCK */}
        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutTemplate className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Interactive Navigation</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Active Tech Stack Buttons (Comma Separated)</label>
            <input 
              value={localData.stack?.join(', ') || ''}
              onChange={(e) => handleChange('stack', e.target.value.split(',').map(s => s.trim()))}
              className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
            />
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
             <p className="text-[10px] text-white/40 leading-relaxed font-black uppercase tracking-widest mb-4">Live Preview</p>
             <div className="flex flex-wrap gap-2">
                {localData.stack?.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg border border-[#27c93f]/20 bg-[#27c93f]/10 text-[#27c93f] text-[10px] font-black tracking-widest uppercase">
                    {s}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
