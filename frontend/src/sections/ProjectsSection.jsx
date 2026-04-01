import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionShell from '../components/SectionShell';
import { Eye, ExternalLink } from 'lucide-react';

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--cards)] backdrop-blur-3xl transition-all duration-500 cursor-none h-fit shadow-[var(--shadow-md)]"
    >
      <a href={project.live} target="_blank" rel="noreferrer" className="block p-4">
        {/* MEDIA CONTAINER */}
        <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden bg-[var(--bg-secondary)]/40 border border-[var(--border)]">
           {project.preview?.url ? (
             <img 
               src={project.preview.url} 
               alt={project.name} 
               className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]/20 uppercase tracking-widest text-[10px]">
                Asset Initializing
             </div>
           )}
           
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* BOTTOM CONTENT */}
        <div className="mt-8 px-4 pb-4 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)] transition-colors">
                {project.name}
              </h3>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-40 group-hover:opacity-100 animate-pulse" />
           </div>

           <AnimatePresence>
             {isHovered && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                 className="overflow-hidden"
               >
                 <div className="pt-2 flex flex-wrap gap-2">
                   {project.stack?.map((tech) => (
                     <span key={tech} className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                       {tech}
                     </span>
                   ))}
                 </div>
                 <p className="mt-6 text-sm text-[var(--text-secondary)] font-medium leading-relaxed max-w-xl">
                   {project.description}
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </a>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: mousePos.x, y: mousePos.y }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
            className="absolute top-0 left-0 pointer-events-none z-[100] w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg-base)] shadow-[0_0_30px_var(--accent)]/50"
            style={{ translateX: '-50%', translateY: '-50%' }}
          >
            <Eye className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectsSection({ section, content }) {
  const projects = content?.projects || [];
  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title} panelInfo={section?.panelInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 px-4 md:px-0 items-start">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </SectionShell>
  );
}
