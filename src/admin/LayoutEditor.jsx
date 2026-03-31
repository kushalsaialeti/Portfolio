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

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Global Layout</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Control section visibility & stack order</p>
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

      <div className="grid gap-4">
        {localSections.map((section, idx) => (
          <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 group">
            <div className="flex items-center gap-6">
               <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/20">
                 <LayoutPanelTop className="w-4 h-4" />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">{section.navLabel}</h4>
                  <p className="text-[10px] text-white/20 font-medium">#{section.id}</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
                <button 
                  onClick={() => toggleVisibility(idx)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${section.isVisible !== false ? 'bg-[#27c93f]/10 text-[#27c93f] border border-[#27c93f]/30' : 'bg-white/5 text-white/30 border border-white/5'}`}
                >
                  {section.isVisible !== false ? 'Live' : 'Hidden'}
                </button>
                <button 
                  onClick={() => handleDeleteSection(idx)}
                  className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
