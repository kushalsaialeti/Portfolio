import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionShell from '../components/SectionShell';
import { PROJECTS } from '../constants/siteContent';

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[3px] overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main content */}
      <h3 className="text-xl font-bold text-white">{project.name}</h3>
      <p className="mt-3 text-sm leading-7 text-[#b5b5ba]">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#d9d9de]"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full border border-[#27c93f] text-[#27c93f] hover:bg-[#27c93f] hover:text-black transition-colors font-black uppercase text-xs tracking-[0.18em]"
            >
              View Project
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function ProjectsSection({ section, content }) {
  const projects = content?.projects || [];
  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="grid gap-12 mt-10">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </SectionShell>
  );
}
