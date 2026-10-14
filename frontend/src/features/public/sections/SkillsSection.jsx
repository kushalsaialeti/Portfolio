import { motion } from 'framer-motion';
import SectionShell from '../../../components/SectionShell';

const labelMap = {
  frontend: 'Frontend UI/UX', backend: 'Backend & Server', databases: 'Databases & Storage',
  tools: 'Tools & DevOps', languages: 'Languages & Core',
};

export default function SkillsSection({ section, content }) {
  const categories = Object.entries(content?.skills || {}).filter(([, items]) => Array.isArray(items) && items.length);
  return (
    <SectionShell id={section?.id || 'skills'} eyebrow={section?.eyebrow || 'Capabilities'} title={section?.title || 'Capabilities'}>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-zinc-400">
        A practical set of capabilities I use to shape interfaces, product flows, and dependable web applications. These are areas of contribution, not proficiency ratings.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(([label, items], categoryIndex) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.06 }} className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white">{labelMap[label] || label.replace(/_/g, ' ')}</h3>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-bold text-zinc-500">{items.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, index) => <motion.span key={`${skill}-${index}`} whileHover={{ y: -2 }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/35 hover:bg-white/[0.1] hover:text-white">
                {skill}
              </motion.span>)}
            </div>
          </motion.div>
        ))}
        {!categories.length && <p className="text-sm text-zinc-500">No skills configured yet.</p>}
      </div>
    </SectionShell>
  );
}
