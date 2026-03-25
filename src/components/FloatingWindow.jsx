import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2, Terminal as TerminalIcon, Search, Layout } from 'lucide-react';
import { PORTFOLIO_DATA } from '../constants/portfolio';

const WindowLayout = ({ id, activeId, setActiveId, children, title, icon: Icon }) => {
  if (activeId !== id) return null;

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-50 overflow-hidden bg-black flex flex-col"
    >
      {/* Traffic Lights & Title Bar */}
      <div className="h-12 flex items-center px-4 bg-black/20 border-b border-white/5 select-none">
        <div className="flex gap-2 mr-6">
          <div onClick={() => setActiveId(null)} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all cursor-pointer" />
          <div onClick={() => setActiveId(null)} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all" />
        </div>
        <div className="flex items-center gap-2 text-white/40 text-[13px] font-medium">
          <Icon className="w-3.5 h-3.5" />
          <span>{title}</span>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {children}
      </div>
    </motion.div>
  );
};

const Terminal = ({ data }) => (
  <div className="font-mono text-sm">
    <div className="flex gap-2 items-center mb-4 text-[#A1A1A6]">
      <span className="text-green-400">➜</span>
      <span className="text-blue-400">~</span>
      <span className="text-white">neofetch</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(data).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-white font-bold uppercase mb-2 text-xs tracking-widest text-[#A1A1A6]">{category}</h3>
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-white/80 flex items-center gap-2">
                <span className="text-green-500/50">◪</span> {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const AboutContent = ({ data }) => (
  <div className="max-w-2xl">
    <h2 className="text-3xl font-bold mb-6 text-white leading-tight">I design systems that scale with precision.</h2>
    <p className="text-[#A1A1A6] text-lg leading-relaxed">{data}</p>
  </div>
);

const Timeline = ({ data }) => (
  <div className="space-y-8">
    {data.map((item, i) => (
      <div key={i} className="relative pl-8 border-l border-white/10">
        <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        <h4 className="text-white font-bold text-lg">{item.role || item.degree}</h4>
        <p className="text-white/60 mb-2">{item.company || item.institution}</p>
        <p className="text-[#A1A1A6] text-sm">{item.description || item.grade}</p>
      </div>
    ))}
  </div>
);

const ProjectsPanel = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map((project, i) => (
      <div key={i} className="group aspect-video rounded-xl bg-white/5 border border-white/5 p-8 flex flex-col justify-between hover:bg-white/8 transition-all hover:scale-[1.02] cursor-pointer">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
          <p className="text-[#A1A1A6] text-sm leading-relaxed">{project.description || project.tech}</p>
        </div>
        {project.url && (
          <a href={project.url} target="_blank" className="text-white font-medium text-xs underline underline-offset-4 opacity-40 group-hover:opacity-100 transition-all">View Project</a>
        )}
      </div>
    ))}
  </div>
);

const ContactPanel = ({ data }) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-[#A1A1A6] mb-4">Channels</h3>
        <p className="text-2xl font-bold text-white mb-2">{data.email}</p>
        <p className="text-2xl font-bold text-white mb-8">{data.phone}</p>
      </div>
    </div>
    <div className="flex gap-6">
        {data.links.map((link, i) => (
          <a key={i} href={link.href} target="_blank" className="text-white/60 hover:text-white transition-colors">{link.name}</a>
        ))}
    </div>
  </div>
);

const FloatingWindow = ({ activeId, setActiveId }) => {
  const activeItem = PORTFOLIO_DATA.find(item => item.id === activeId);

  return (
    <AnimatePresence mode="wait">
      {activeItem && (
        <WindowLayout 
          key={activeItem.id} 
          id={activeItem.id} 
          activeId={activeId} 
          setActiveId={setActiveId}
          title={activeItem.label}
          icon={activeItem.icon}
        >
          {activeItem.type === 'terminal' && <Terminal data={activeItem.content} />}
          {activeItem.type === 'finder' && <AboutContent data={activeItem.content} />}
          {(activeItem.type === 'monitor' || activeItem.type === 'notes') && <Timeline data={activeItem.content} />}
          {activeItem.type === 'safari' && <ProjectsPanel data={activeItem.content} />}
          {activeItem.type === 'photos' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {activeItem.content.map((act, i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-lg p-6 flex items-center justify-center text-center text-sm font-medium text-white/80 border border-white/5">
                  {act}
                </div>
              ))}
            </div>
          )}
          {activeItem.type === 'mail' && <ContactPanel data={activeItem.content} />}
        </WindowLayout>
      )}
    </AnimatePresence>
  );
};

export default FloatingWindow;
