import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Check, Mail } from 'lucide-react';
import StatusSlideshow from '../components/StatusSlideshow';
import { trackPublicEvent } from '../analytics';
import MonoButton from '../../../components/ui/MonoButton';

const isSafeExternalUrl = (value) => {
  if (!value || value === '#') return false;
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const processSteps = [
  { number: '01', title: 'Inquiry', text: 'Share the context, goals, and constraints behind the work.' },
  { number: '02', title: 'Scoping', text: 'Align on the right scope, priorities, and a practical plan.' },
  { number: '03', title: 'Build', text: 'Turn the plan into a considered, testable digital experience.' },
  { number: '04', title: 'Handoff', text: 'Review the work together and leave you with a clear next step.' },
];

function ServiceCard({ service, index, onNavigate }) {
  const deliverables = Array.isArray(service?.deliverables) ? service.deliverables.filter(Boolean) : [];

  const discussService = () => {
    trackPublicEvent('service_click', { section: 'services', target: `service-${index}` });
    onNavigate?.('contact');
  };

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 transition-colors hover:border-white/30 focus-within:border-white/35 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[10px] font-black text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-zinc-600" />
      </div>
      <h3 className="mt-8 text-xl font-black uppercase tracking-[-0.03em] text-white">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{service.description}</p>
      {deliverables.length > 0 && (
        <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
          {deliverables.map((deliverable, deliverableIndex) => (
            <li key={`${deliverable}-${deliverableIndex}`} className="flex items-start gap-2 text-xs text-zinc-300">
              <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span>{deliverable}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={discussService}
        className="mt-auto pt-7 text-left text-[10px] font-black uppercase tracking-[0.22em] text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Discuss this service
      </button>
    </article>
  );
}

export default function HomeSection({ section, content, onNavigate }) {
  const prefersReducedMotion = useReducedMotion();
  const profile = {
    ...(content?.siteProfile || {}),
    gallery: content?.gallery || [],
  };
  const projects = Array.isArray(content?.projects) ? content.projects : [];
  const selectedProject = projects[0];
  const services = Array.isArray(profile.services)
    ? profile.services.filter((service) => service?.title && service?.description)
    : [];
  const availability = typeof profile.availability === 'string' ? profile.availability.trim() : '';
  const labels = Array.isArray(profile.stackLabels) && profile.stackLabels.length
    ? profile.stackLabels
    : ['UI/UX', 'Web applications', 'Custom solutions'];
  const name = profile.name || 'Kushal Sai Aleti';
  const nameParts = name.trim().split(/\s+/);
  const firstLine = nameParts.slice(0, Math.max(1, Math.ceil(nameParts.length / 2))).join(' ');
  const secondLine = nameParts.slice(Math.max(1, Math.ceil(nameParts.length / 2))).join(' ');
  const ctaLabel = typeof profile.ctaLabel === 'string' && profile.ctaLabel.trim()
    ? profile.ctaLabel.trim()
    : 'Discuss a project';

  const goToContact = () => {
    trackPublicEvent('contact_click', { section: 'home', target: 'contact' });
    onNavigate?.('contact');
  };

  const goToSelectedWork = () => {
    if (selectedProject) {
      trackPublicEvent('project_click', { section: 'home', target: 'project-0' });
    }
    onNavigate?.('projects');
  };

  return (
    <section id={section?.id || 'home'} className="relative w-full overflow-hidden px-6 pb-20 pt-28 md:px-16 md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 text-[35vw] font-black tracking-tighter">BUILD</div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:gap-20">
        <div className="max-w-3xl">
          <p className="mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-px w-8 bg-white/30" />
            {section?.eyebrow || 'Independent digital product partner'}
          </p>
          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
            className="text-[14vw] font-black uppercase leading-[0.82] tracking-[-0.075em] text-[var(--text-primary)] sm:text-[12vw] md:text-[8vw]"
          >
            {firstLine}
            {secondLine && <><br />{secondLine}</>}
          </motion.h1>
          <p className="mt-8 max-w-2xl text-base font-medium leading-7 text-[var(--text-secondary)] md:mt-10 md:text-xl md:leading-8">
            {profile.tagline || 'I design and build clear, dependable digital products for people and teams with something meaningful to ship.'}
          </p>
          {profile.subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">{profile.subtitle}</p>
          )}
          <div className="mt-9 flex flex-wrap gap-2.5">
            {labels.map((label, index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                onClick={() => onNavigate?.('skills')}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-zinc-300 transition hover:border-white/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 md:mt-12">
            <MonoButton onClick={goToContact}>{ctaLabel}</MonoButton>
            <button
              type="button"
              onClick={goToSelectedWork}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Selected work <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
            </button>
            {profile.resume && isSafeExternalUrl(profile.resume) && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => trackPublicEvent('resume_click', { section: 'home', target: 'resume' })}
                className="inline-flex items-center gap-2 px-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Resume <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="flex w-full justify-start lg:justify-end">
          <StatusSlideshow profile={profile} />
        </div>
      </div>

      {selectedProject && (
        <div className="relative z-10 mx-auto mt-20 w-full max-w-6xl border-t border-white/10 pt-8 md:mt-28 md:pt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Selected work</p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-white sm:text-3xl">{selectedProject.name || 'Featured project'}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">{selectedProject.description || 'A project shaped around a clear user need and a considered digital experience.'}</p>
            </div>
            <button
              type="button"
              onClick={goToSelectedWork}
              className="inline-flex shrink-0 items-center gap-2 self-start text-[10px] font-black uppercase tracking-[0.2em] text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:self-auto"
            >
              Explore projects <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <section id="services" className="relative z-10 mx-auto mt-24 w-full max-w-6xl scroll-mt-10 border-t border-white/10 pt-16 md:mt-32 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Services / Process</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-white sm:text-5xl">Useful work, clearly delivered.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              A focused way to move from an early idea to a polished, maintainable product experience.
            </p>
            {availability && (
              <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300">
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                {availability}
              </p>
            )}
          </div>
          <div className="space-y-10">
            {services.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service, index) => (
                  <ServiceCard key={`${service.title}-${index}`} service={service} index={index} onNavigate={onNavigate} />
                ))}
              </div>
            )}
            <div className="grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <div key={step.number} className="space-y-3">
                  <span className="text-[10px] font-black tracking-[0.25em] text-zinc-600">{step.number}</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">{step.title}</h3>
                  <p className="text-xs leading-5 text-zinc-500">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
