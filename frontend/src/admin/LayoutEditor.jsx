import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, LayoutPanelTop, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LayoutEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localSections, setLocalSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('layout');
  }, []);

  useEffect(() => {
    if (sections.layout) {
      setLocalSections(sections.layout.siteSections || []);
    }
  }, [sections.layout]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('layout', { siteSections: localSections });
      alert('Global layout configuration committed.');
    } catch (error) {
      alert('Commit failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = () => {
    const id = prompt("Enter section ID (e.g. 'new-works'):").toLowerCase().replace(/\s/g, '-');
    const navLabel = prompt("Enter Navigation Label (e.g. 'Expertise'):");
    if (id && navLabel) {
      setLocalSections([...localSections, { id, navLabel, isVisible: true, title: navLabel, eyebrow: 'System Node' }]);
    }
  };

  const handleDeleteSection = (index) => {
    if (window.confirm("CRITICAL: This will remove the section from navigation and the landing stack. Proceed?")) {
      setLocalSections(localSections.filter((_, i) => i !== index));
    }
  };

  const toggleVisibility = (idx) => {
    const updated = [...localSections];
    updated[idx].isVisible = !updated[idx].isVisible;
    setLocalSections(updated);
  };

  const handleMetadataChange = (idx, field, value) => {
    const updated = [...localSections];
    updated[idx][field] = value;
    setLocalSections(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Visual Architect</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Coordinate your structural narrative & visibility</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAddSection}
            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[#27c93f] flex items-center gap-2 hover:bg-[#27c93f]/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Add Node
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-[#27c93f] text-black border border-[#27c93f] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Changes
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {localSections.map((section, idx) => (
          <div key={idx} className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all relative overflow-hidden">
            {/* BACKGROUND DECOR */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#27c93f]/[0.02] blur-[100px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row gap-12">
               {/* STATUS & ID */}
               <div className="lg:w-48 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-white/[0.03] rounded-3xl border border-white/5 text-[#27c93f]">
                        <LayoutPanelTop className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Node ID</p>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#27c93f]">#{section.id}</h4>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-4">
                     <button 
                        onClick={() => toggleVisibility(idx)}
                        className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${section.isVisible !== false ? 'bg-[#27c93f]/10 text-[#27c93f] border-[#27c93f]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}
                     >
                        {section.isVisible !== false ? 'LIVE ON SITE' : 'OFFLINE / HIDDEN'}
                     </button>
                     <button 
                        onClick={() => handleDeleteSection(idx)}
                        className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                     >
                        <Trash2 className="w-3.5 h-3.5" /> Decommission
                     </button>
                  </div>
               </div>

               {/* CONTENT EDITORS */}
               <div className="flex-grow grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/20 tracking-widest pl-1">Section Eyebrow</label>
                        <input 
                           value={section.eyebrow}
                           onChange={(e) => handleMetadataChange(idx, 'eyebrow', e.target.value)}
                           className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none text-sm font-medium"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/20 tracking-widest pl-1">Primary Title</label>
                        <input 
                           value={section.title}
                           onChange={(e) => handleMetadataChange(idx, 'title', e.target.value)}
                           className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none text-sm font-medium"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase text-white/20 tracking-widest pl-1">Panel Intelligence / Description</label>
                     <textarea 
                        value={section.panelInfo}
                        rows={4}
                        onChange={(e) => handleMetadataChange(idx, 'panelInfo', e.target.value)}
                        className="w-full h-[calc(100%-24px)] px-5 py-4 rounded-xl bg-black/40 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none text-sm font-medium resize-none leading-relaxed"
                        placeholder="Contextual information displayed in the side panel..."
                     />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
