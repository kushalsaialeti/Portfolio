import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, LayoutPanelTop, ArrowUp, ArrowDown, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CORE_SECTION_IDS = ['home', 'about', 'projects', 'skills', 'contact'];
const SECTION_DRAFTS = [
  { id: 'home', navLabel: 'Home', title: '', eyebrow: 'Welcome', panelInfo: '', isVisible: true },
  { id: 'about', navLabel: 'About', title: 'About', eyebrow: 'Who I Am', panelInfo: 'My background, mindset and product approach.', isVisible: true },
  { id: 'projects', navLabel: 'Projects', title: 'Projects', eyebrow: 'Work', panelInfo: 'Selected projects with stack and live links.', isVisible: true },
  { id: 'skills', navLabel: 'Skills', title: 'Skills', eyebrow: 'Stack', panelInfo: 'Frontend, backend and tools I work with.', isVisible: true },
  { id: 'contact', navLabel: 'Contact', title: 'Contact', eyebrow: 'Reach Out', panelInfo: 'Email, phone and social profiles to connect.', isVisible: true },
];

export default function LayoutEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localSections, setLocalSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

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
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('layout', { siteSections: localSections });
      setSaveMessage({ type: 'success', text: 'Section order and visibility saved successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to save layout.' });
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
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    setLocalSections(updated);
  };

  const handleMetadataChange = (idx, field, value) => {
    const updated = [...localSections];
    updated[idx][field] = value;
    setLocalSections(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <LayoutPanelTop className="w-7 h-7 text-[#27c93f]" />
            Layout & Section Manager
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Reorder sections, toggle public visibility, and customize navigation titles and hover cards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-[#27c93f] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(39,201,63,0.3)] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Layout</span>
        </button>
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

      {/* SECTIONS LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {localSections.map((section, idx) => (
            <motion.div
              key={section.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-6 rounded-3xl border transition-all ${
                section.isVisible !== false
                  ? 'bg-[#14151e] border-white/10 hover:border-white/20'
                  : 'bg-[#14151e]/40 border-dashed border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* ORDER CONTROLS */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#27c93f]/20 border border-[#27c93f]/40 text-[#27c93f] flex items-center justify-center font-black text-base">
                    {idx + 1}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-md bg-white/5 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === localSections.length - 1}
                      className="p-1 rounded-md bg-white/5 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* FORM FIELDS */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Section ID</label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-[#1c1d27]/60 border border-white/5 text-[#27c93f] font-black text-xs uppercase tracking-wider">
                      #{section.id}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Nav Label</label>
                    <input
                      type="text"
                      value={section.navLabel || ''}
                      onChange={(e) => handleMetadataChange(idx, 'navLabel', e.target.value)}
                      placeholder="e.g. Projects"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs font-bold focus:border-[#27c93f] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Eyebrow Tag</label>
                    <input
                      type="text"
                      value={section.eyebrow || ''}
                      onChange={(e) => handleMetadataChange(idx, 'eyebrow', e.target.value)}
                      placeholder="e.g. Work"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs font-bold focus:border-[#27c93f] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Status</label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(idx)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        section.isVisible !== false
                          ? 'bg-[#27c93f]/15 border border-[#27c93f]/40 text-[#27c93f]'
                          : 'bg-red-500/15 border border-red-500/40 text-red-400'
                      }`}
                    >
                      {section.isVisible !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hidden
                        </>
                      )}
                    </button>
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
