import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Instagram, Mail, Sparkles } from 'lucide-react';

const isSafeLink = (value) => {
  if (!value || value === '#') return false;
  if (value.startsWith('mailto:')) return true;
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export default function StatusSlideshow({ profile }) {
  const prefersReducedMotion = useReducedMotion();
  const [currentImg, setCurrentImg] = useState(0);
  const availability = typeof profile.availability === 'string' ? profile.availability.trim() : '';
  const gallery = useMemo(() => {
    const configured = Array.isArray(profile.gallery)
      ? profile.gallery.filter((image) => image?.url)
      : [];
    return configured.length > 0
      ? configured
      : [{ url: profile.portrait?.url || '/images/portrait.png' }];
  }, [profile.gallery, profile.portrait?.url]);

  useEffect(() => {
    if (prefersReducedMotion || gallery.length <= 1) return undefined;
    const timer = setInterval(() => setCurrentImg((previous) => (previous + 1) % gallery.length), 5000);
    return () => clearInterval(timer);
  }, [gallery.length, prefersReducedMotion]);

  const socials = [
    { name: 'GitHub', icon: Github, link: profile.github },
    { name: 'LinkedIn', icon: Linkedin, link: profile.linkedin },
    { name: 'Instagram', icon: Instagram, link: profile.instagram },
    { name: 'Email', icon: Mail, link: profile.email && `mailto:${profile.email}` },
  ].filter((social) => isSafeLink(social.link));

  return (
    <aside className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:p-5">
      <div className="relative aspect-[1.35] overflow-hidden rounded-[1.5rem] bg-[var(--bg-secondary)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg}
            src={gallery[currentImg % gallery.length]?.url}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
            className="absolute inset-0 h-full w-full object-cover grayscale"
            alt="Profile portrait"
            width="480"
            height="360"
            loading="eager"
            decoding="async"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-zinc-300" />
              Portfolio / Selected work
            </p>
            {availability && (
              <p className="mt-2 text-xs text-zinc-300">{availability}</p>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-1.5" aria-label={`${gallery.length} profile images`}>
              {gallery.map((_, index) => (
                <span
                  key={index}
                  className={`h-1 rounded-full transition-all motion-reduce:transition-none ${index === currentImg % gallery.length ? 'w-7 bg-white' : 'w-1.5 bg-white/30'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {socials.length > 0 && (
        <nav aria-label="Profile links" className="mt-5 flex gap-5 px-1">
          {socials.map(({ name, icon: Icon, link }) => (
            <motion.a
              key={name}
              href={link}
              aria-label={name}
              target={link.startsWith('http') ? '_blank' : undefined}
              rel={link.startsWith('http') ? 'noreferrer noopener' : undefined}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              className="text-zinc-500 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
            </motion.a>
          ))}
        </nav>
      )}
    </aside>
  );
}
