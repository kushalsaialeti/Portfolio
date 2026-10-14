import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../../../cms/CmsContext';
import { Save, RefreshCw, FileText, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorDirty } from '../useEditorForm';

export default function AboutEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [aboutLines, setAboutLines] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isDirty, setIsDirty] = useState(false);
  useEditorDirty(isDirty, isSaving);

  useEffect(() => {
    fetchSection('about');
  }, [fetchSection]);

  useEffect(() => {
    if (sections.about) {
      setAboutLines(sections.about.aboutLines || []);
      setIsDirty(false);
    }
  }, [sections.about]);

  const handleAddLine = () => {
    setIsDirty(true);
    setAboutLines([...aboutLines, '']);
  };

  const handleRemoveLine = (index) => {
    setIsDirty(true);
    setAboutLines(aboutLines.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    setIsDirty(true);
    const updated = [...aboutLines];
    updated[index] = value;
    setAboutLines(updated);
  };

  const handleMove = (index, direction) => {
    setIsDirty(true);
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= aboutLines.length) return;
    const updated = [...aboutLines];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setAboutLines(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('about', { ...sections.about, aboutLines });
      setIsDirty(false);
      setSaveMessage({ type: 'success', text: 'About section narrative saved successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-[#27c93f]" />
            About Section Editor
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Edit your story paragraphs, background, and mindset displayed in the About section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddLine}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#27c93f] font-black text-xs uppercase tracking-wider hover:bg-[#27c93f]/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Paragraph</span>
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

      {/* PARAGRAPHS LIST */}
      <div className="space-y-4">
        {aboutLines.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#14151e] border border-dashed border-white/15 space-y-3">
            <p className="text-sm font-bold text-white/60 uppercase tracking-wider">No paragraphs added yet</p>
            <button
              type="button"
              onClick={handleAddLine}
              className="px-5 py-2.5 rounded-xl bg-[#27c93f] text-black font-bold text-xs uppercase tracking-wider"
            >
              + Add First Paragraph
            </button>
          </div>
        )}

        <AnimatePresence>
          {aboutLines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 sm:p-6 rounded-2xl bg-[#14151e] border border-white/10 space-y-3 group hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-[#27c93f]">
                  Paragraph {idx + 1}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === aboutLines.length - 1}
                    className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
                    title="Delete Paragraph"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={line}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder="Write this paragraph of your professional story..."
                className="w-full px-4 py-3 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-sm focus:border-[#27c93f] outline-none leading-relaxed resize-y"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
