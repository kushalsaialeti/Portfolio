import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import SectionShell from '../components/SectionShell';

export default function SkillsSection({ section, content }) {
  const categories = Object.entries(content?.skills || {}).filter(([, items]) => Array.isArray(items) && items.length > 0);
  
  // Flatten all skills for a generic grid
  const allSkills = categories.reduce((acc, [label, items]) => {
    return [...acc, ...items];
  }, []);

  return (
    <SectionShell id={section?.id || 'skills'} eyebrow={section?.eyebrow || 'Stack'} title={section?.title || 'Skills'}>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {allSkills.map((skill, index) => (
          <motion.div
            key={`${skill}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-center justify-center rounded-[20px] border border-[#191A23] bg-[#F3F3F3] p-4 text-center font-medium shadow-[0_4px_0_#191A23] transition-all hover:-translate-y-1 hover:bg-[#B9FF66] hover:shadow-[0_6px_0_#191A23]"
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
