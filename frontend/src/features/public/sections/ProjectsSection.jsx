import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import SectionShell from '../../../components/SectionShell';
import { trackPublicEvent } from '../analytics';

const isSafeExternalUrl = (value) => {
  if (!value || value === '#') return false;
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const hasCaseStudy = (project) => ['problem', 'solution', 'outcome', 'role']
  .some((field) => typeof project?.[field] === 'string' && project[field].trim());

function CaseStudy({ project, index }) {
  if (!hasCaseStudy(project)) return null;

  return (
    <details
      className="border-t border-white/10 px-6 sm:px-8"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          trackPublicEvent('project_details', { section: 'projects', target: `project-${index}` });
        }
      }}
    >
      <summary className="cursor-pointer list-none py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        <span className="inline-flex items-center gap-2">
          Read case study <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </summary>
      <div className="grid gap-5 pb-7 pt-1 sm:grid-cols-2">
        {[
          ['Problem', project.problem],
          ['Approach', project.solution],
          ['Outcome', project.outcome],
          ['Role', project.role],
        ].filter(([, value]) => typeof value === 'string' && value.trim()).map(([label, value]) => (
          <div key={label}>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-600">{label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{value}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

function ProjectCard({ project, index }) {
  const prefersReducedMotion = useReducedMotion();
  const liveUrl = isSafeExternalUrl(project.live) ? project.live : null;
  const sourceUrl = isSafeExternalUrl(project.github) ? project.github : null;
  const previewUrl = project.preview?.url || null;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-black/20 transition-colors hover:border-white/30 motion-reduce:transform-none"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.9fr)]">
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white">{String(index + 1).padStart(2, '0')}</span>
              Selected work
            </div>
            <h3 className="text-3xl font-black uppercase tracking-[-0.05em] text-white sm:text-4xl">{project.name || 'Untitled project'}</h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400">{project.description || 'Project description from the portfolio.'}</p>
          </div>
          {Array.isArray(project.stack) && project.stack.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2" aria-label="Project capabilities">
              {project.stack.map((tech, techIndex) => <span key={`${tech}-${techIndex}`} className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">{tech}</span>)}
            </div>
          )}
        </div>
        <div className="relative min-h-[230px] border-t border-white/10 bg-white/[0.035] lg:border-l lg:border-t-0">
          {previewUrl ? (
            <img src={previewUrl} alt={project.name ? `${project.name} preview` : 'Project preview'} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 motion-reduce:transition-none" />
          ) : (
            <div className="flex h-full min-h-[230px] items-center justify-center p-10 text-center text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">No preview available</div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-6 py-5 sm:px-8">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackPublicEvent('project_click', { section: 'projects', target: `project-${index}` })}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span>{project.liveLabel || 'View live project'}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackPublicEvent('project_click', { section: 'projects', target: `project-${index}` })}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-300 hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Github aria-hidden="true" className="h-3.5 w-3.5" /> {project.githubLabel || 'View source'}
          </a>
        )}
        {!liveUrl && !sourceUrl && !hasCaseStudy(project) && <span className="text-xs text-zinc-600">Details available on request.</span>}
      </div>
      <CaseStudy project={project} index={index} />
    </motion.article>
  );
}

export default function ProjectsSection({ section, content }) {
  const projects = Array.isArray(content?.projects) ? content.projects : [];
  return <SectionShell id={section?.id || 'projects'} eyebrow={section?.eyebrow} title={section?.title}>
    <div className="space-y-6">{projects.map((project, index) => <ProjectCard key={`${project.name || 'project'}-${index}`} project={project} index={index} />)}{!projects.length && <p className="text-sm text-zinc-500">No projects listed yet.</p>}</div>
  </SectionShell>;
}
