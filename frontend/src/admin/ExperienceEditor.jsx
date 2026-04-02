import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, Briefcase, Plus, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localExp, setLocalExp] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('experience');
  }, []);

  useEffect(() => {
    if (sections.experience) {
      setLocalExp(sections.experience.experiences || []);
    }
  }, [sections.experience]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('experience', { experiences: localExp });
      alert('Career timeline committed to memory.');
    } catch (error) {
      alert('Commit failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    setLocalExp([
      ...localExp, 
      { 
        company: 'New Company', 
        role: 'Internal Developer', 
        startDate: new Date().toISOString().split('T')[0], 
        endDate: null, 
        status: 'ongoing', 
        description: 'Detailing professional impact and technical contributions here...' 
      }
    ]);
  };

  const handleUpdate = (idx, field, value) => {
    const updated = [...localExp];
    updated[idx][field] = value;
    setLocalExp(updated);
  };

  const handleDelete = (idx) => {
    if (window.confirm("CRITICAL: This will remove this professional record from your public journey. Proceed?")) {
        setLocalExp(localExp.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Career Architect</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1 uppercase tracking-widest font-medium">Manage your professional milestones & internships</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAdd}
            className="px-6 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] flex items-center gap-2 hover:bg-[var(--accent)]/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-[var(--accent)] text-black border border-[var(--accent)] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50 shadow-[0_0_20px_var(--accent)]/20"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Timeline
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {localExp.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-10 rounded-[40px] bg-[var(--surface)] border border-[var(--border)] group hover:border-[var(--accent)]/20 transition-all relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent)]/[0.02] blur-[100px] pointer-events-none" />

              <div className="flex flex-col lg:flex-row gap-12">
                 {/* LEFT: STATUS & DATES */}
                 <div className="lg:w-48 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className={`p-4 rounded-3xl border transition-all ${exp.status === 'completed' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>
                          <Briefcase className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]/20">Status</p>
                          <select 
                             value={exp.status}
                             onChange={(e) => handleUpdate(idx, 'status', e.target.value)}
                             className="text-xs font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer"
                          >
                             <option value="ongoing">Ongoing</option>
                             <option value="completed">Completed</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-[var(--text-secondary)]/30 tracking-[0.3em] pl-1">Start Point</label>
                            <input 
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => handleUpdate(idx, 'startDate', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-xs font-black uppercase tracking-widest outline-none transition-all focus:border-[var(--accent)]/40"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-[var(--text-secondary)]/30 tracking-[0.3em] pl-1">End Point (Optional)</label>
                            <input 
                                type="date"
                                value={exp.endDate || ''}
                                onChange={(e) => handleUpdate(idx, 'endDate', e.target.value || null)}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-xs font-black uppercase tracking-widest outline-none transition-all focus:border-[var(--accent)]/40"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => handleDelete(idx)}
                        className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]/40 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Decommission Record
                    </button>
                 </div>

                 {/* RIGHT: CONTENT EDITORS */}
                 <div className="flex-grow space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]/20 tracking-widest pl-1">Corporate Entity / Company</label>
                          <input 
                             value={exp.company}
                             onChange={(e) => handleUpdate(idx, 'company', e.target.value)}
                             className="w-full px-6 py-5 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-[var(--text-primary)] transition-all focus:border-[var(--accent)]/40 outline-none text-base font-black uppercase tracking-tight"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]/20 tracking-widest pl-1">Operational Role</label>
                          <input 
                             value={exp.role}
                             onChange={(e) => handleUpdate(idx, 'role', e.target.value)}
                             className="w-full px-6 py-5 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-[var(--text-primary)] transition-all focus:border-[var(--accent)]/40 outline-none text-base font-black uppercase tracking-tight"
                          />
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]/20 tracking-widest pl-1">Professional Impact / Contribution</label>
                       <textarea 
                          value={exp.description}
                          rows={4}
                          onChange={(e) => handleUpdate(idx, 'description', e.target.value)}
                          className="w-full px-6 py-5 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-[var(--text-primary)] transition-all focus:border-[var(--accent)]/40 outline-none text-sm font-medium leading-relaxed resize-none"
                          placeholder="Detail your contributions and technical growth..."
                       />
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
