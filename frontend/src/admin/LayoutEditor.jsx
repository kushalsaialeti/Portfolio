import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, LayoutPanelTop, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CORE_SECTION_IDS = ['home', 'about', 'projects', 'skills', 'contact'];
const SECTION_DRAFTS = [
  { id: 'home', navLabel: 'Home', title: '', eyebrow: 'Welcome', panelInfo: '', isVisible: true },
  { id: 'about', navLabel: 'About', title: 'About', eyebrow: 'Who I Am', panelInfo: '', isVisible: true },
  { id: 'projects', navLabel: 'Projects', title: 'Projects', eyebrow: 'Work', panelInfo: '', isVisible: true },
  { id: 'skills', navLabel: 'Skills', title: 'Skills', eyebrow: 'Stack', panelInfo: '', isVisible: true },
  { id: 'contact', navLabel: 'Contact', title: 'Contact', eyebrow: 'Reach Out', panelInfo: '', isVisible: true },
];

export default function LayoutEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localSections, setLocalSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('layout');
  }, []);

  useEffect(() => {
    if (sections.layout) {
      const currentSections = sections.layout.siteSections || SECTION_DRAFTS;
      const filteredSections = currentSections.filter((section) => CORE_SECTION_IDS.includes(section.id));
      const restoredSections = SECTION_DRAFTS.filter(
        (section) => !filteredSections.some((current) => current.id === section.id)
      );
      setLocalSections([...filteredSections, ...restoredSections]);
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

  const toggleVisibility = (idx) => {
    const updated = [...localSections];
    updated[idx].isVisible = !updated[idx].isVisible;
    setLocalSections(updated);
  };

  const moveSection = (idx, direction) => {
    const updated = [...localSections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    
    // Swap elements
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
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
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Layout Architect</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1 uppercase tracking-widest font-medium">Reorder and toggle visibility of your portfolio sections</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-[var(--accent)] text-black border border-[var(--accent)] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Order
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {localSections.map((section, idx) => (
            <motion.div 
              key={section.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 rounded-[40px] bg-[var(--surface)] border border-[var(--border)] group hover:border-[var(--accent)]/20 transition-all relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                 {/* POSITIONAL CONTROLS */}
                 <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                    <button 
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-10 transition-all shadow-xl"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_var(--accent)]/30">
                       {idx + 1}
                    </div>
                    <button 
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === localSections.length - 1}
                      className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-10 transition-all shadow-xl"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                 </div>

                 {/* SECTION INFO */}
                 <div className="flex-grow flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]/30">Navigation Item</p>
                       <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">#{section.id}</h3>
                    </div>

                    <div className="flex-grow grid grid-cols-2 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-[var(--text-secondary)]/20 tracking-widest pl-1">Nav Label</label>
                          <input 
                             value={section.navLabel}
                             onChange={(e) => handleMetadataChange(idx, 'navLabel', e.target.value)}
                             className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-[var(--text-primary)] transition-all focus:border-[var(--accent)]/40 outline-none text-xs font-bold uppercase tracking-widest"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-[var(--text-secondary)]/20 tracking-widest pl-1">Visibility</label>
                          <button 
                            onClick={() => toggleVisibility(idx)}
                            className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${section.isVisible !== false ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}
                          >
                            {section.isVisible !== false ? 'VISIBLE' : 'HIDDEN'}
                          </button>
                       </div>
                    </div>

                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
