import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionShell from '../components/SectionShell';
import { CircularRadar, BattleJet, BattlefieldHUD } from './BattlefieldComponents';

export default function SkillsSection({ section, content }) {
  const skillsData = content?.skills || {};
  const categories = Object.entries(skillsData);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  
  const [phase, setPhase] = useState('IDLE'); // IDLE -> SCANNING -> COMBAT

  useEffect(() => {
    if (isInView && phase === 'IDLE') {
      setPhase('SCANNING');
    }
  }, [isInView, phase]);

  useEffect(() => {
    if (phase === 'SCANNING') {
      const timer = setTimeout(() => {
        setPhase('COMBAT');
      }, 3000); // 3 seconds scan time looks good
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <SectionShell 
      id={section?.id || 'skills'} 
      eyebrow={section?.eyebrow || 'Arsenal'} 
      title={section?.title || 'Tactical Skillsets'}
    >
      <div 
        ref={containerRef}
        className="battle-simulation relative w-full h-[600px] md:h-[750px] bg-[#050505] rounded-[48px] border-2 border-[var(--border)] overflow-hidden mt-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] group"
      >
        {/* Background HUD Layers */}
        <BattlefieldHUD />
        
        {/* Air Defense Radar System */}
        <CircularRadar isScanning={phase !== 'IDLE'} />

        {/* Combat Phase: Interceptor Squadrons */}
        <div className="absolute inset-0 z-40">
          {(phase === 'COMBAT') && categories.map(([label, items], idx) => (
            <BattleJet 
              key={label}
              index={idx}
              category={label}
              skills={items}
            />
          ))}
        </div>

        {/* HUD Data Overlays */}
        <div className="absolute top-8 left-10 pointer-events-none select-none">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)] mb-2"></div>
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${phase === 'COMBAT' ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
             <div className="text-[9px] uppercase font-mono text-[var(--text-secondary)]">
                {phase === 'SCANNING' ? 'Establishing Perimeter Scan...' : 'Combat Zone Active - Interceptors Deployed'}
             </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-10 text-right pointer-events-none select-none max-w-[200px]">
           {/* <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] mb-2">Warning System</div> */}
           {/* <p className="text-[8px] uppercase font-mono text-[var(--text-secondary)]/50 leading-relaxed">
              Automated defense protocols engaged. Skill interceptors are operating on horizontal patrol vectors. Radar scanning frequency calibrated for high-speed skill metrics.
           </p> */}
        </div>

        {/* Loading Overlay for Scanning Phase */}
        {phase === 'SCANNING' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
               <div className="text-[12px] font-black uppercase tracking-[0.8em] text-[var(--accent)] animate-pulse">Scanning Targets</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Responsive Grid fallback for mobile accessibility */}
      <div className="mt-12 md:hidden grid gap-6 grid-cols-1">
        {categories.map(([label, items]) => (
          <div key={label} className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--cards)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full border border-[var(--accent)]" />
             </div>
             <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--accent)] mb-3">{label}</h4>
             <div className="flex flex-wrap gap-2">
                {items.map(skill => (
                  <span key={skill} className="text-[9px] uppercase tracking-wider bg-black/20 px-2 py-1 rounded border border-white/5">{skill}</span>
                ))}
             </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
