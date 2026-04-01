import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Database, Layout, Settings, Terminal, 
  Cpu, Layers, Cloud, Flame, Globe, Zap, 
  Box, Smartphone, MousePointer2, GitBranch, Github, Server 
} from 'lucide-react';
import SectionShell from '../components/SectionShell';
import { SKILLS } from '../constants/siteContent';

// Helper to provide relevant icons for tech names
const getSkillIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('react') || n.includes('next')) return <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('node') || n.includes('express')) return <Server className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('mongo') || n.includes('postgre') || n.includes('supabase')) return <Database className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('tail') || n.includes('css') || n.includes('framer') || n.includes('gsap')) return <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('git')) return <GitBranch className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('python') || n.includes('js') || n.includes('java') || n.includes('c')) return <Code2 className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('docker')) return <Box className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (n.includes('vercel') || n.includes('n8n')) return <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />;
  return <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />;
};

function SkillCategory({ label, items }) {
  return (
    <article className="rounded-[32px] border border-[var(--border)] bg-[var(--cards)] p-8 backdrop-blur-xl shadow-[var(--shadow-lg)] relative overflow-hidden group">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="text-sm font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] mb-8 border-l-2 border-[var(--accent)] pl-4">
        {label}
      </h3>
      
      <div className="flex flex-wrap gap-3 justify-start">
        {items.map((skill) => (
          <motion.div
            key={skill}
            whileHover={{ 
              scale: 1.15, 
              y: -8, 
              backgroundColor: 'var(--accent)', 
              borderColor: 'var(--accent)',
              color: 'var(--bg-base)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-3 cursor-pointer group/skill"
          >
            <div className="transition-transform group-hover/skill:rotate-12 group-hover/skill:text-[var(--bg-base)]">
               {getSkillIcon(skill)}
            </div>
            <span className="text-[12px] font-bold tracking-wider text-[var(--text-secondary)] group-hover/skill:text-[var(--bg-base)] uppercase transition-colors">
              {skill}
            </span>
          </motion.div>
        ))}
      </div>
    </article>
  );
}

export default function SkillsSection({ section, content }) {
  const skills = content?.skills || {};
  const entries = Object.entries(skills);

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8">
        {entries.map(([key, value]) => (
          <SkillCategory key={key} label={key} items={value} />
        ))}
      </div>
    </SectionShell>
  );
}
