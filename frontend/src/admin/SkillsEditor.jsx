import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, Cpu, Plus, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultCategoryLabels = {
  frontend: 'Frontend UI/UX',
  backend: 'Backend & Server',
  databases: 'Databases & Storage',
  tools: 'Tools & DevOps',
  languages: 'Languages & Core',
};

export default function SkillsEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [skillsData, setSkillsData] = useState({
    frontend: [],
    backend: [],
    databases: [],
    tools: [],
    languages: [],
  });
  const [newSkillInputs, setNewSkillInputs] = useState({});
  const [newCategoryKey, setNewCategoryKey] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSection('skills');
  }, []);

  useEffect(() => {
    if (sections.skills?.skills) {
      setSkillsData(sections.skills.skills);
    }
  }, [sections.skills]);

  const handleAddSkill = (categoryKey, e) => {
    if (e) e.preventDefault();
    const val = (newSkillInputs[categoryKey] || '').trim();
    if (!val) return;
    const currentList = skillsData[categoryKey] || [];
    if (!currentList.includes(val)) {
      setSkillsData((prev) => ({
        ...prev,
        [categoryKey]: [...(prev[categoryKey] || []), val],
      }));
    }
    setNewSkillInputs((prev) => ({ ...prev, [categoryKey]: '' }));
  };

  const handleRemoveSkill = (categoryKey, skillToRemove) => {
    setSkillsData((prev) => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const key = newCategoryKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (!key) return;
    if (!skillsData[key]) {
      setSkillsData((prev) => ({
        ...prev,
        [key]: [],
      }));
    }
    setNewCategoryKey('');
    setShowAddCategory(false);
  };

  const handleRemoveCategory = (categoryKey) => {
    if (!window.confirm(`Delete the entire "${categoryKey}" skill category?`)) return;
    const updated = { ...skillsData };
    delete updated[categoryKey];
    setSkillsData(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('skills', { skills: skillsData });
      setSaveMessage({ type: 'success', text: 'Skills matrix saved successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to save skills.' });
    } finally {
      setIsSaving(false);
    }
  };

  const categoriesList = Object.keys(skillsData);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Cpu className="w-7 h-7 text-[#27c93f]" />
            Technical Skills Matrix
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Organize and update technologies, frameworks, databases, and programming languages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#27c93f] font-black text-xs uppercase tracking-wider hover:bg-[#27c93f]/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#27c93f] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(39,201,63,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {saveMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-[#27c93f]/15 border border-[#27c93f]/40 text-[#27c93f]'
              : 'bg-red-500/15 border border-red-500/40 text-red-400'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* ADD CUSTOM CATEGORY MODAL / INLINE FORM */}
      {showAddCategory && (
        <form onSubmit={handleAddCategory} className="p-6 rounded-2xl bg-[#14151e] border border-[#27c93f]/30 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            value={newCategoryKey}
            onChange={(e) => setNewCategoryKey(e.target.value)}
            placeholder="Enter category name (e.g. Mobile Development, Cloud & Hosting)..."
            className="flex-1 w-full px-4 py-3 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#27c93f] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer"
            >
              Add Category
            </button>
            <button
              type="button"
              onClick={() => setShowAddCategory(false)}
              className="px-4 py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesList.map((catKey) => {
          const catLabel = defaultCategoryLabels[catKey] || catKey.replace(/_/g, ' ').toUpperCase();
          const items = skillsData[catKey] || [];

          return (
            <div
              key={catKey}
              className="p-6 rounded-3xl bg-[#14151e] border border-white/10 space-y-4 group hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-[#27c93f]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">
                    {catLabel}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-bold">
                    {items.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCategory(catKey)}
                  className="p-1 rounded-md text-white/30 hover:text-red-400 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2 min-h-[50px] p-3 rounded-xl bg-[#1c1d27] border border-white/5">
                {items.length === 0 && (
                  <span className="text-[11px] text-white/30 italic">No skills in this category yet.</span>
                )}
                <AnimatePresence>
                  {items.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-semibold hover:border-[#27c93f]/40 transition-colors"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(catKey, skill)}
                        className="text-white/40 hover:text-red-400 ml-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Skill Input Form */}
              <form onSubmit={(e) => handleAddSkill(catKey, e)} className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInputs[catKey] || ''}
                  onChange={(e) => setNewSkillInputs((prev) => ({ ...prev, [catKey]: e.target.value }))}
                  placeholder={`Add to ${catLabel}...`}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#27c93f] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
