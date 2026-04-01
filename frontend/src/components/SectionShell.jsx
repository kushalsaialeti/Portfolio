import React from 'react';
import { motion } from 'framer-motion';

export default function SectionShell({ id, eyebrow, title, children, accent = '#27c93f', hideHeader = false }) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden border-b border-white/5 px-6 py-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-6xl rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-[4px] md:p-10"
      >
        {!hideHeader && (
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a1a1a6]">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">{title}</h2>
            <div className="mt-4 h-[2px] w-20" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
