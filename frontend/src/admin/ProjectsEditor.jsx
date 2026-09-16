import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Plus, Trash2, Save, RefreshCw, Briefcase, ExternalLink, ArrowUp, ArrowDown, Tag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './components/ImageUploader';

export default function ProjectsEditor() {
  const { sections, fetchSection, updateSection, uploadMedia, replaceMedia } = useContext(CmsContext);
  const [projects, setProjects] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [activeTagInputs, setActiveTagInputs] = useState({});

  useEffect(() => {
    fetchSection('projects');
  }, []);

  useEffect(() => {
    if (sections.projects) {
      setProjects(sections.projects.projects || []);
    }
  }, [sections.projects]);

  const handleAddProject = () => {
    setProjects([
      {
        name: '',
        description: '',
        stack: ['React', 'Next.js', 'Tailwind CSS'],
        live: '',
        github: '',
        preview: { url: '', public_id: '' },
      },
      ...projects,
    ]);
  };

  const handleRemoveProject = (index) => {
    if (!window.confirm('Delete this project from your portfolio?')) return;
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleMove = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= projects.length) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setProjects(updated);
  };

  const handleAddTag = (projIndex, e) => {
    e.preventDefault();
    const tag = (activeTagInputs[projIndex] || '').trim();
    if (!tag) return;
    const currentStack = projects[projIndex].stack || [];
    if (!currentStack.includes(tag)) {
      handleChange(projIndex, 'stack', [...currentStack, tag]);
    }
    setActiveTagInputs((prev) => ({ ...prev, [projIndex]: '' }));
  };

  const handleRemoveTag = (projIndex, tagToRemove) => {
    const currentStack = projects[projIndex].stack || [];
    handleChange(projIndex, 'stack', currentStack.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = async (index, file) => {
    const oldPublicId = projects[index].preview?.public_id;
    if (oldPublicId) {
      return await replaceMedia(file, oldPublicId);
    }
    return await uploadMedia(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('projects', { projects });
      setSaveMessage({ type: 'success', text: 'Projects saved and published successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to save projects.' });
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
            <Briefcase className="w-7 h-7 text-[#27c93f]" />
            Projects Showcase Editor
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Add, update, or remove portfolio projects, tech stacks, screenshots, and live demo links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddProject}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#27c93f] font-black text-xs uppercase tracking-wider hover:bg-[#27c93f]/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
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

      {/* PROJECTS LIST */}
      <div className="space-y-6">
        {projects.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#14151e] border border-dashed border-white/15 space-y-3">
            <p className="text-sm font-bold text-white/60 uppercase tracking-wider">No projects in your showcase</p>
            <button
              type="button"
              onClick={handleAddProject}
              className="px-5 py-2.5 rounded-xl bg-[#27c93f] text-black font-bold text-xs uppercase tracking-wider"
            >
              + Create First Project
            </button>
          </div>
        )}

        <AnimatePresence>
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6 group hover:border-white/20 transition-all"
            >
              {/* CARD TOP BAR */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#27c93f]/20 text-[#27c93f] font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-black uppercase tracking-wider text-white">
                    {project.name || 'Untitled Project'}
                  </span>
                </div>

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
                    disabled={idx === projects.length - 1}
                    className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* PROJECT FIELDS & IMAGE UPLOADER */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Fields (2 Cols) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">Project Name</label>
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Navya Sree Embroidery"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-sm focus:border-[#27c93f] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">Description</label>
                    <textarea
                      rows={3}
                      value={project.description || ''}
                      onChange={(e) => handleChange(idx, 'description', e.target.value)}
                      placeholder="Briefly describe the product, problem solved, or engineering highlights..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs leading-relaxed focus:border-[#27c93f] outline-none resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">Live Demo URL</label>
                      <input
                        type="url"
                        value={project.live || ''}
                        onChange={(e) => handleChange(idx, 'live', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">GitHub Repo URL</label>
                      <input
                        type="url"
                        value={project.github || ''}
                        onChange={(e) => handleChange(idx, 'github', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">Tech Stack Tags</label>
                    <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl bg-[#1c1d27] border border-white/10">
                      {(project.stack || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(idx, tag)}
                            className="hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activeTagInputs[idx] || ''}
                        onChange={(e) => setActiveTagInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(idx, e);
                          }
                        }}
                        placeholder="Add tag (e.g. Next.js, Redux, PostgreSQL)..."
                        className="flex-1 px-4 py-2 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleAddTag(idx, e)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#27c93f] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project Image Preview (1 Col) */}
                <div className="space-y-2">
                  <ImageUploader
                    label="Project Screenshot"
                    sublabel="Card preview banner"
                    value={project.preview}
                    onChange={(val) => handleChange(idx, 'preview', typeof val === 'object' ? val : { url: val, public_id: '' })}
                    onUpload={(file) => handleImageUpload(idx, file)}
                    aspectRatio="video"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
