import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import SectionShell from '../components/SectionShell';

function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#14151e] p-6 sm:p-8 backdrop-blur-2xl shadow-[var(--shadow-lg)] hover:border-[#27c93f]/40 transition-all duration-300 h-full"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* LEFT: INFO */}
        <div className="flex flex-col justify-between h-full space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#27c93f]/20 text-[#27c93f] font-black text-xs flex items-center justify-center">
                0{index + 1}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#27c93f]">
                Featured Project
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white group-hover:text-[#27c93f] transition-colors">
              {project.name || 'Untitled Project'}
            </h3>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
              {project.description || 'Project description from CMS.'}
            </p>
          </div>

          {/* TECH STACK TAGS */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {(project.stack || []).map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: PREVIEW IMAGE */}
        <div className="relative aspect-video sm:aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {project.preview?.url ? (
            <img
              src={project.preview.url}
              alt={project.name || 'Project preview'}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-white/30">
              No Preview
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS: LIVE & GITHUB */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#27c93f] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_15px_rgba(39,201,63,0.25)] hover:brightness-110 active:scale-95 transition-all"
            >
              <span>View Live</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#27c93f]/40 hover:text-[#27c93f] transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection({ section, content }) {
  const projects = content?.projects || [];

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title} panelInfo={section?.panelInfo}>
      <div className="mt-12 flex flex-col gap-8">
        {projects.length === 0 && (
          <p className="text-white/40 text-sm">No projects listed yet. Add projects from the admin dashboard.</p>
        )}

        {projects.map((project, idx) => (
          <ProjectCard key={`${project.name}-${idx}`} project={project} index={idx} />
        ))}
      </div>
    </SectionShell>
  );
}
