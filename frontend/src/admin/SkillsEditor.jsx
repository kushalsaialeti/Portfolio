import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, Cpu, Plus, Trash2, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillsEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localSkills, setLocalSkills] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('skills');
  }, []);

  useEffect(() => {
    if (sections.skills) {
      setLocalSkills(sections.skills.skills || {
        frontend: [],
        backend: [],
        databases: [],
        tools: [],
        languages: []
      });
    }
  }, [sections.skills]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('skills', { skills: localSkills });
      alert('Technical toolkit committed.');
    } catch (error) {
      alert('Commit failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (category, value) => {
    if (!value.trim()) return;
    const updated = { ...localSkills };
    updated[category] = [...(updated[category] || []), value.trim()];
    setLocalSkills(updated);
  };

  const handleRemoveSkill = (category, index) => {
    const updated = { ...localSkills };
    updated[category] = updated[category].filter((_, i) => i !== index);
    setLocalSkills(updated);
  };

  const categories = [
    { id: 'frontend', label: 'Frontend UI/UX' },
    { id: 'backend', label: 'Server & Logic' },
    { id: 'databases', label: 'Persistence Layers' },
    { id: 'tools', label: 'DevOps & Tools' },
    { id: 'languages', label: 'Syntaxes & Logic' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Technical Matrix</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Orchestrate your engineering toolkit</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-[#27c93f] text-black border border-[#27c93f] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-4 group">
            <div className="flex items-center gap-3 mb-6 pl-1">
              <Cpu className="w-5 h-5 text-[#27c93f]" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">{cat.label}</h3>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[60px] pb-4 border-b border-white/5">
              <AnimatePresence>
                {(localSkills[cat.id] || []).map((skill, idx) => (
                  <motion.span 
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] font-black tracking-widest uppercase text-white/60 flex items-center gap-2 hover:border-[#27c93f]/20 hover:text-white transition-all cursor-default"
                  >
                    {skill}
                    <button onClick={() => handleRemoveSkill(cat.id, idx)} className="text-red-500/40 hover:text-red-500">
                       <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="pt-2 relative">
               <input 
                 placeholder="Add skill node (Press Enter)..."
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                      handleAddSkill(cat.id, e.target.value);
                      e.target.value = '';
                   }
                 }}
                 className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/5 text-white placeholder:text-white/20 text-[11px] font-medium outline-none focus:border-[#27c93f]/30 transition-all uppercase tracking-widest"
               />
               <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
