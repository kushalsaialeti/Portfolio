import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';

export default function SectionShell({ id, eyebrow, title, children, hideHeader = false }) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden border-b border-white/5 px-4 py-20 sm:px-6 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-6xl"
      >
        <GlassCard className="overflow-hidden p-6 md:p-10">
          {!hideHeader && (
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/10 pb-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">{eyebrow}</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl">{title}</h2>
              </div>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 sm:block">Scroll / Explore</span>
            </div>
          )}
          {children}
        </GlassCard>
      </motion.div>
    </section>
  );
}
