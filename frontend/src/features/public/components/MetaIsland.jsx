import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function MetaIsland({ island }) {
  const [expanded, setExpanded] = useState(false);
  const isLocation = island.id === 'location';
  const link = isLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(island.locationQuery || 'SRKR Engineering College, Bhimavaram')}`
    : island.link;
  const Icon = island.icon;
  return (
    <div className="relative z-20 mb-6 group" onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded((previous) => !previous)}
        onFocus={() => setExpanded(true)} className="flex flex-col items-start gap-4 text-left">
        <span className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20"><Icon className="w-5 h-5" /></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">{island.title}</span>
        </span>
        <span className="text-sm text-[var(--text-secondary)] max-w-[200px] border-l border-[var(--accent)]/20 pl-5">{island.text}</span>
      </button>
      <AnimatePresence>
        {expanded && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 rounded-[32px] bg-[var(--glass-bg)] border border-[var(--accent)]/30 w-[280px] overflow-hidden">
          {!isLocation && <img src={island.previewImg || '/images/portrait.png'} alt={`${island.text} preview`}
            className="w-full aspect-video rounded-2xl object-cover" loading="lazy" decoding="async" />}
          <h3 className="mt-4 text-sm font-black uppercase">{island.text}</h3>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">{island.description}</p>
          {island.stack && <div className="mt-3 flex flex-wrap gap-2">{island.stack.map((tag) =>
            <span key={tag} className="text-[9px] rounded-full bg-[var(--accent)]/10 px-3 py-1 text-[var(--accent)]">{tag}</span>)}</div>}
          {link && link !== '#' && <a href={link} target="_blank" rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--accent)]">
            {isLocation ? 'Open Google Maps' : 'Visit project'} <ExternalLink className="w-4 h-4" />
          </a>}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
