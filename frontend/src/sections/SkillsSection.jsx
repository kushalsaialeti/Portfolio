import React from 'react';
import { motion } from 'framer-motion';
import SectionShell from '../components/SectionShell';

const labelMap = {
  frontend: 'Frontend UI/UX',
  backend: 'Backend & Server',
  databases: 'Databases & Storage',
  tools: 'Tools & DevOps',
  languages: 'Languages & Core',
};

export default function SkillsSection({ section, content }) {
  const categories = Object.entries(content?.skills || {}).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );

  return (
    <SectionShell id={section?.id || 'skills'} eyebrow={section?.eyebrow || 'Stack'} title={section?.title || 'Skills'}>
      <div className="mt-12 flex flex-col gap-10">
        {categories.length === 0 && (
          <p className="text-white/40 text-sm">No skills configured yet. Add skills from the admin dashboard.</p>
        )}

        {categories.map(([label, items], catIndex) => (
          <div key={`cat-${label}`} className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#27c93f]">
              {labelMap[label] || label.replace(/_/g, ' ').toUpperCase()}
            </h3>

            <div className="flex flex-wrap gap-3">
              {items.map((skill, index) => (
                <motion.div
                  key={`skill-${label}-${skill}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: catIndex * 0.05 + index * 0.02 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="flex items-center justify-center rounded-2xl px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border border-white/10 bg-[#14151e] text-white hover:border-[#27c93f] hover:bg-[#27c93f] hover:text-black shadow-[var(--shadow-sm)] cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
