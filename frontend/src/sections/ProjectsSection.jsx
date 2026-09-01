import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import SectionShell from '../components/SectionShell';

function ProjectCard({ project, index }) {
  const variants = [
    'bg-[#F3F3F3] text-[#191A23]',
    'bg-[#B9FF66] text-[#191A23]',
    'bg-[#191A23] text-white',
  ];
  const isDark = index % 3 === 2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6 }}
      className={`group overflow-hidden rounded-[28px] border border-[#191A23] p-5 shadow-[0_5px_0_#191A23] transition ${variants[index % variants.length]}`}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_220px] lg:items-stretch">
        <div className="flex min-h-[220px] flex-col justify-between gap-8">
          <div className="space-y-5">
            <div className={`flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold ${isDark ? 'bg-[#B9FF66] text-[#191A23]' : 'bg-white text-[#191A23]'}`}>
              <ExternalLink className="h-4 w-4" />
              Project
            </div>
            <div>
              <h3 className="max-w-xl text-3xl font-semibold leading-tight md:text-4xl">{project.name || 'Untitled Project'}</h3>
              <p className={`mt-4 max-w-2xl text-base leading-7 ${isDark ? 'text-white/75' : 'text-[#191A23]/75'}`}>
                {project.description || 'Add a project description from the admin dashboard.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(project.stack || []).map((tech) => (
              <span
                key={tech}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${isDark ? 'border-white/20 text-white/80' : 'border-[#191A23]/20 text-[#191A23]/75'}`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={`relative min-h-[200px] overflow-hidden rounded-[22px] border ${isDark ? 'border-white/15 bg-white/5' : 'border-[#191A23]/15 bg-white/70'}`}>
          {project.preview?.url ? (
            <img
              src={project.preview.url}
              alt={project.name || 'Project preview'}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm font-medium opacity-50">
              Add preview in CMS
            </div>
          )}
        </div>
      </div>

      <a
        href={project.live || '#'}
        target="_blank"
        rel="noreferrer"
        className={`mt-6 inline-flex items-center gap-3 rounded-full text-sm font-semibold ${isDark ? 'text-[#B9FF66]' : 'text-[#191A23]'}`}
      >
        View Project
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isDark ? 'bg-[#B9FF66] text-[#191A23]' : 'bg-[#191A23] text-[#B9FF66]'}`}>
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </a>
    </motion.article>
  );
}

export default function ProjectsSection({ section, content }) {
  const projects = content?.projects || [];

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title} panelInfo={section?.panelInfo}>
      <div className="mt-10 flex gap-8 overflow-x-auto pb-8 custom-scrollbar snap-x snap-mandatory">
        {projects.map((project, idx) => (
          <div key={`${project.name}-${idx}`} className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[50vw] snap-center shrink-0">
            <ProjectCard project={project} index={idx} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
