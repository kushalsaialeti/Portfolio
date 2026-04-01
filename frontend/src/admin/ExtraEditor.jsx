import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, BookOpen, ListPlus, Trash2, Calendar, Link, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExtraEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [localBlogs, setLocalBlogs] = useState([]);
  const [localActivities, setLocalActivities] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('extra');
  }, []);

  useEffect(() => {
    if (sections.extra) {
      setLocalBlogs(sections.extra.blogs || []);
      setLocalActivities(sections.extra.activities || []);
    }
  }, [sections.extra]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSection('extra', { blogs: localBlogs, activities: localActivities });
      alert('Strategic insights & leadership records committed.');
    } catch (error) {
      alert('Commit failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Insight Architect</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Control your technical articles & leadership</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-[#27c93f] text-black border border-[#27c93f] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Changes
        </button>
      </div>

      {/* BLOGS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pl-1">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Strategic Articles</h3>
          </div>
          <button 
            onClick={() => setLocalBlogs([...localBlogs, { title: '', date: '', snippet: '', link: '' }])}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[#27c93f] hover:bg-[#27c93f] hover:text-black transition-all"
          >
            <ListPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-4">
          <AnimatePresence>
            {localBlogs.map((blog, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative group"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Article Title</label>
                       <input 
                         value={blog.title}
                         placeholder="Architecting Scalable Systems..."
                         onChange={(e) => {
                           const updated = [...localBlogs];
                           updated[idx].title = e.target.value;
                           setLocalBlogs(updated);
                         }}
                         className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Publication Date</label>
                          <div className="relative">
                             <input 
                               value={blog.date}
                               placeholder="March 2026"
                               onChange={(e) => {
                                 const updated = [...localBlogs];
                                 updated[idx].date = e.target.value;
                                 setLocalBlogs(updated);
                               }}
                               className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                             />
                             <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Article URI</label>
                          <div className="relative">
                             <input 
                               value={blog.link}
                               placeholder="https://..."
                               onChange={(e) => {
                                 const updated = [...localBlogs];
                                 updated[idx].link = e.target.value;
                                 setLocalBlogs(updated);
                               }}
                               className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                             />
                             <Link className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Content Snippet</label>
                    <textarea 
                      value={blog.snippet}
                      rows={4}
                      placeholder="Enter a brief, engaging summary of the article..."
                      onChange={(e) => {
                          const updated = [...localBlogs];
                          updated[idx].snippet = e.target.value;
                          setLocalBlogs(updated);
                      }}
                      className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none resize-none h-[calc(100%-24px)]"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setLocalBlogs(localBlogs.filter((_, i) => i !== idx))}
                  className="absolute top-8 right-8 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ACTIVITIES SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pl-1">
          <div className="flex items-center gap-3">
            <ListPlus className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Leadership & Legacy</h3>
          </div>
          <button 
            onClick={() => setLocalActivities([...localActivities, ""])}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[#27c93f] hover:bg-[#27c93f] hover:text-black transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-3">
           <AnimatePresence>
             {localActivities.map((act, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="group relative"
                >
                   <input 
                     value={act}
                     placeholder="e.g. Organizer at GDG Dev Challenge 2025"
                     onChange={(e) => {
                       const updated = [...localActivities];
                       updated[idx] = e.target.value;
                       setLocalActivities(updated);
                     }}
                     className="w-full px-8 py-5 rounded-[22px] bg-white/[0.02] border border-white/5 text-white placeholder:text-white/10 transition-all focus:border-[#27c93f]/40 outline-none"
                   />
                   <button 
                     onClick={() => setLocalActivities(localActivities.filter((_, i) => i !== idx))}
                     className="absolute top-1/2 -translate-y-1/2 right-6 p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
