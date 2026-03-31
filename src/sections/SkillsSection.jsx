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
  if (n.includes('react') || n.includes('next')) return <Zap className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('node') || n.includes('express')) return <Server className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('mongo') || n.includes('postgre') || n.includes('supabase')) return <Database className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('tail') || n.includes('css') || n.includes('framer') || n.includes('gsap')) return <Layers className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('git')) return <GitBranch className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('python') || n.includes('js') || n.includes('java') || n.includes('c')) return <Code2 className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('docker')) return <Box className="w-3.5 h-3.5 text-[#27c93f]" />;
  if (n.includes('vercel') || n.includes('n8n')) return <Globe className="w-3.5 h-3.5 text-[#27c93f]" />;
  return <Terminal className="w-3.5 h-3.5 text-[#27c93f]" />;
};

function SkillCategory({ label, items }) {
  return (
    <article className="rounded-[32px] border border-white/10 bg-[#0c0c0e] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#27c93f]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white/40 mb-8 border-l-2 border-[#27c93f] pl-4">
        {label}
      </h3>
      
      <div className="flex flex-wrap gap-3 justify-start">
        {items.map((skill) => (
          <motion.div
            key={skill}
            whileHover={{ 
              scale: 1.15, 
              y: -8, 
              backgroundColor: 'rgba(255,255,255,0.06)', 
              borderColor: 'rgba(39, 201, 63, 0.4)' 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3 cursor-pointer group/skill"
          >
            <div className="transition-transform group-hover/skill:rotate-12">
               {getSkillIcon(skill)}
            </div>
            <span className="text-[12px] font-bold tracking-wider text-white/70 group-hover/skill:text-white uppercase transition-colors">
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
