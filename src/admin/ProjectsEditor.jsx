import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Plus, Trash2, Save, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsEditor() {
  const { sections, fetchSection, updateSection, uploadMedia, replaceMedia } = useContext(CmsContext);
  const [localProjects, setLocalProjects] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('projects');
  }, []);

  useEffect(() => {
    if (sections.projects) {
      setLocalProjects(sections.projects.projects || []);
    }
  }, [sections.projects]);

  const handleAddProject = () => {
    setLocalProjects([...localProjects, {
      name: '',
      description: '',
      stack: ['React'],
      live: '',
      preview: { url: '', public_id: '' }
    }]);
  };

  const handleRemoveProject = (index) => {
    const updated = localProjects.filter((_, i) => i !== index);
    setLocalProjects(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...localProjects];
    updated[index][field] = value;
    setLocalProjects(updated);
  };

  const handleImageChange = async (index, file) => {
    const oldPublicId = localProjects[index].preview?.public_id;
    try {
      let result;
      if (oldPublicId) {
        result = await replaceMedia(file, oldPublicId);
      } else {
        result = await uploadMedia(file);
      }
      handleChange(index, 'preview', { url: result.url, public_id: result.public_id });
    } catch (error) {
      alert('Upload failed. Please check network/Cloudinary config.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('projects', { projects: localProjects });
      alert('Portfolio ledger updated successfully.');
    } catch (error) {
      alert('Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Portfolio Ledger</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Manage your engineering projects</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAddProject}
            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[#27c93f] flex items-center gap-2 hover:bg-[#27c93f]/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Add Asset
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
        <AnimatePresence>
          {localProjects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl group relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* MEDIA BLOCK */}
                <div className="space-y-4">
                   <div className="relative aspect-video rounded-[24px] bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-[#27c93f]/20 transition-all">
                      {project.preview?.url ? (
                        <img src={project.preview.url} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700" alt="Preview" />
                      ) : (
                        <div className="text-center space-y-2 opacity-20">
                          <ImageIcon className="w-10 h-10 mx-auto" />
                          <p className="text-[10px] uppercase tracking-tighter">No Media Injected</p>
                        </div>
                      )}
                      
                      <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-black/60 flex items-center justify-center transition-all">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleImageChange(idx, e.target.files[0])}
                        />
                        <span className="px-5 py-2 rounded-xl bg-white text-black font-black text-[10px] uppercase">Replace Aspect</span>
                      </label>
                   </div>
                   <div className="flex items-center gap-3 px-2">
                      <div className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#27c93f]">Cloudinary Sync Active</span>
                   </div>
                </div>

                {/* CONTENT BLOCK */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Project Identifier</label>
                      <input 
                        value={project.name}
                        placeholder="e.g. Civic Pulse"
                        onChange={(e) => handleChange(idx, 'name', e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Deployment Node</label>
                       <input 
                         value={project.live}
                         placeholder="https://..."
                         onChange={(e) => handleChange(idx, 'live', e.target.value)}
                         className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Technical Narrative</label>
                    <textarea 
                      value={project.description}
                      placeholder="Describe the architectural challenge and purpose..."
                      rows={3}
                      onChange={(e) => handleChange(idx, 'description', e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Stack (Comma Separated)</label>
                    <input 
                      value={project.stack.join(', ')}
                      placeholder="React, AWS, Node.js..."
                      onChange={(e) => handleChange(idx, 'stack', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                    />
                  </div>

                  <button 
                    onClick={() => handleRemoveProject(idx)}
                    className="absolute top-8 right-8 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
