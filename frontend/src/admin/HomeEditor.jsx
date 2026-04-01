import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, User, LayoutTemplate, Image as ImageIcon, Sparkles, Plus, MapPin, Briefcase, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeEditor() {
  const { sections, fetchSection, updateSection, uploadMedia, replaceMedia } = useContext(CmsContext);
  const [localData, setLocalData] = useState({
    profile: { 
      name: '', 
      tagline: '', 
      portrait: { url: '', public_id: '' },
      activelyBuilding: { title: '', text: '', description: '', stack: [] },
      location: { title: '', text: '', description: '', query: '' }
    },
    gallery: [],
    statusWords: [],
    stack: []
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
      console.error(error);
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

  const handleAddGalleryImg = async (file) => {
    setIsUploading(true);
    try {
      const result = await uploadMedia(file);
      const newGallery = [...(localData.gallery || []), { url: result.url, public_id: result.public_id }];
      handleChange('gallery', newGallery);
    } catch (error) {
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveGalleryImg = (idx) => {
    const newGallery = localData.gallery.filter((_, i) => i !== idx);
    handleChange('gallery', newGallery);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Hero Architect</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Coordinate your core identity & availability</p>
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
                     className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none font-medium text-xs uppercase tracking-widest"
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

          <div className="pt-4 space-y-4">
             <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1 flex items-center gap-2">
               <ImageIcon className="w-3.5 h-3.5" /> Slideshow Gallery
             </label>
             <div className="grid grid-cols-4 gap-3">
                {localData.gallery?.map((img, idx) => (
                   <div key={idx} className="relative group aspect-square rounded-xl bg-black/30 border border-white/5 overflow-hidden font-black">
                      <img src={img.url} className="w-full h-full object-cover" alt="Gallery" />
                      <button 
                        onClick={() => handleRemoveGalleryImg(idx)}
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase tracking-widest"
                      >
                        Delete
                      </button>
                   </div>
                ))}
                <label className="aspect-square rounded-xl bg-white/[0.03] border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-all">
                   <input type="file" className="hidden" onChange={(e) => handleAddGalleryImg(e.target.files[0])} />
                   <div className="p-2 rounded-lg bg-white/5 text-white/20">
                      <Plus className="w-4 h-4" />
                   </div>
                </label>
             </div>
          </div>
        </div>

        {/* TECH STACK & STATUS BLOCK */}
        <div className="space-y-8">
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <LayoutTemplate className="w-5 h-5 text-[#27c93f]" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Interactive Navigation</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Active Tech Stack Buttons (Comma Separated)</label>
              <input 
                value={localData.profile?.stackLabels?.join(', ') || ''}
                onChange={(e) => handleChange('profile.stackLabels', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none font-medium text-xs uppercase tracking-widest"
              />
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
              <p className="text-[10px] text-white/40 leading-relaxed font-black uppercase tracking-widest mb-4">Live Preview</p>
              <div className="flex flex-wrap gap-2">
                  {localData.profile?.stackLabels?.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg border border-[#27c93f]/20 bg-[#27c93f]/10 text-[#27c93f] text-[10px] font-black tracking-widest uppercase">
                      {s}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-[#27c93f]" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Status Beacon Phrases</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Availability Words (Comma Separated)</label>
              <input 
                value={localData.profile?.statusWords?.join(', ') || 'WORK, COLLABORATE'}
                onChange={(e) => handleChange('profile.statusWords', e.target.value.split(',').map(s => s.trim().toUpperCase()))}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none font-black tracking-widest text-xs uppercase"
              />
              <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2 px-1">Words that cycle in the 'OPEN TO...' typing animation</p>
            </div>
          </div>
        </div>
      </div>

      {/* HERO METADATA ISLANDS EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* ACTIVELY BUILDING */}
         <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <Briefcase className="w-5 h-5 text-[#27c93f]" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Building Configuration</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Island Eyebrow</label>
                  <input 
                    value={localData.profile?.activelyBuilding?.title || ''}
                    placeholder="Actively Building"
                    onChange={(e) => handleChange('profile.activelyBuilding.title', e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-[10px] uppercase font-black tracking-widest transition-all focus:border-[#27c93f]/40 outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Primary Text (Overrides Project Name)</label>
                  <input 
                    value={localData.profile?.activelyBuilding?.text || ''}
                    onChange={(e) => handleChange('profile.activelyBuilding.text', e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-[10px] uppercase font-black tracking-widest transition-all focus:border-[#27c93f]/40 outline-none"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Description Hint</label>
               <textarea 
                 value={localData.profile?.activelyBuilding?.description || ''}
                 rows={2}
                 onChange={(e) => handleChange('profile.activelyBuilding.description', e.target.value)}
                 className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-xs font-medium transition-all focus:border-[#27c93f]/40 outline-none resize-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Fallback Stack Tags (Comma Separated)</label>
               <input 
                 value={localData.profile?.activelyBuilding?.stack?.join(', ') || ''}
                 onChange={(e) => handleChange('profile.activelyBuilding.stack', e.target.value.split(',').map(s => s.trim()))}
                 className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-[10px] uppercase tracking-widest font-black transition-all focus:border-[#27c93f]/40 outline-none"
               />
            </div>
         </div>

         {/* LOCATION BLOCK */}
         <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <MapPin className="w-5 h-5 text-[#27c93f]" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Location Configuration</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Eyebrow</label>
                  <input 
                    value={localData.profile?.location?.title || ''}
                    placeholder="Current Location"
                    onChange={(e) => handleChange('profile.location.title', e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-[10px] uppercase font-black tracking-widest transition-all focus:border-[#27c93f]/40 outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Location Label</label>
                  <input 
                    value={localData.profile?.location?.text || ''}
                    placeholder="Bhimavaram, SRKR"
                    onChange={(e) => handleChange('profile.location.text', e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-[10px] uppercase font-black tracking-widest transition-all focus:border-[#27c93f]/40 outline-none"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Map Query / Description</label>
               <input 
                 value={localData.profile?.location?.description || ''}
                 onChange={(e) => handleChange('profile.location.description', e.target.value)}
                 className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-xs font-medium transition-all focus:border-[#27c93f]/40 outline-none"
               />
            </div>
            
            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Maps Search Query
               </label>
               <input 
                 value={localData.profile?.location?.query || ''}
                 placeholder="SRKR Engineering College, Bhimavaram"
                 onChange={(e) => handleChange('profile.location.query', e.target.value)}
                 className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white text-[10px] uppercase tracking-widest font-black transition-all focus:border-[#27c93f]/40 outline-none"
               />
            </div>
         </div>
      </div>
    </div>
  );
}
