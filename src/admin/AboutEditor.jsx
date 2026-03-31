import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, Layers, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localLines, setLocalLines] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('about');
  }, []);

  useEffect(() => {
    if (sections.about) {
      setLocalLines(sections.about.aboutLines || []);
    }
  }, [sections.about]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('about', { aboutLines: localLines });
      alert('Professional narrative updated.');
    } catch (error) {
      alert('Commit failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLine = () => {
    setLocalLines([...localLines, ""]);
  };

  const handleRemoveLine = (index) => {
    setLocalLines(localLines.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    const updated = [...localLines];
    updated[index] = value;
    setLocalLines(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Narrative Architect</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Control your professional story & story-telling</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAddLine}
            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[#27c93f] flex items-center gap-2 hover:bg-[#27c93f]/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Add Narrative
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

      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6 pl-1">
          <Layers className="w-5 h-5 text-[#27c93f]" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Content Layers</h3>
        </div>

        <AnimatePresence>
          {localLines.map((line, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group relative"
            >
              <textarea 
                value={line}
                rows={2}
                placeholder="Enter a paragraph of your journey..."
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-full px-8 py-6 rounded-[28px] bg-white/[0.02] border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none resize-none leading-relaxed"
              />
              <button 
                onClick={() => handleRemoveLine(idx)}
                className="absolute top-1/2 -translate-y-1/2 -right-12 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
