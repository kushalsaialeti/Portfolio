import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

// --- SVGs ---

// Detailed Fighter Jet (Inspired by reference image)
export const FighterJetSVG = ({ color = "var(--accent)", direction = "right" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`w-full h-full drop-shadow-[0_0_15px_rgba(34,255,102,0.4)] ${direction === 'left' ? 'scale-x-[-1]' : ''}`}
  >
    {/* Body / Fuselage */}
    <path 
      d="M20 50 L40 45 L80 45 L85 50 L80 55 L40 55 Z" 
      fill="#334155" 
    />
    <path 
      d="M45 47 L75 47 L78 50 L75 53 L45 53 Z" 
      fill={color} 
      opacity="0.6"
    />
    
    {/* Wings */}
    <path 
      d="M45 45 L25 20 L45 35 L65 45 Z" 
      fill="#475569" 
    />
    <path 
      d="M45 55 L25 80 L45 65 L65 55 Z" 
      fill="#475569" 
    />
    
    {/* Engines (Side mounted like the picture) */}
    <rect x="35" y="30" width="20" height="8" rx="2" fill="#1e293b" />
    <rect x="35" y="62" width="20" height="8" rx="2" fill="#1e293b" />
    <path d="M35 30 L30 34 L35 38" fill={color} opacity="0.8" />
    <path d="M35 62 L30 66 L35 70" fill={color} opacity="0.8" />
    
    {/* Cockpit */}
    <ellipse cx="70" cy="50" rx="6" ry="3" fill="#94a3b8" opacity="0.9" />
    
    {/* Afterburner / Engine Glow */}
    <motion.rect 
      animate={{ opacity: [0.4, 1, 0.4], width: [5, 10, 5] }}
      transition={{ repeat: Infinity, duration: 0.2 }}
      x="18" y="47" width="8" height="6" fill="#f59e0b" blur="2px"
    />
  </svg>
);

// --- Sub-components ---

export const SkillBullet = ({ skill, direction, onComplete }) => {
  const bulletRef = useRef(null);

  useEffect(() => {
    const bullet = bulletRef.current;
    const distance = window.innerWidth;
    const duration = 3.5;
    const xMove = direction === "right" ? distance : -distance;

    gsap.to(bullet, {
       x: xMove,
       opacity: 0,
       duration: duration,
       ease: "none",
       onComplete: onComplete
    });
  }, []);

  return (
    <div 
      ref={bulletRef} 
      className={`absolute flex items-center gap-2 pointer-events-none z-50 ${direction === 'left' ? 'flex-row-reverse' : ''}`}
    >
      {/* Muzzle Flash Effect */}
      <div className="w-1.5 h-1.5 bg-white rounded-full blur-[1px] absolute -left-1" />
      
      {/* Bullet Line */}
      <div className="w-24 h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent shadow-[0_0_10px_var(--accent)]" />
      
      {/* Skill Name HUD */}
      <div className="flex flex-col">
        <span className="text-[10px] md:text-[12px] whitespace-nowrap font-black text-[var(--accent)] uppercase tracking-[0.2em] bg-black/90 px-3 py-1.5 rounded-sm border-l-2 border-[var(--accent)] shadow-[0_0_20px_rgba(34,255,102,0.3)] backdrop-blur-xl">
          {skill}
        </span>
      </div>
    </div>
  );
};

export const BattleJet = ({ category, skills, index }) => {
  const [bullets, setBullets] = useState([]);
  const direction = index % 2 === 0 ? "right" : "left";
  const startX = direction === "right" ? -15 : 115;
  const targetX = direction === "right" ? 115 : -15;
  const yPos = 15 + (index * 15); // Staggered rows

  const jetRef = useRef(null);

  // Flight Path Loop
  useEffect(() => {
    const jet = jetRef.current;
    const duration = 12 + Math.random() * 5;
    
    const fly = () => {
      gsap.fromTo(jet, 
        { left: `${startX}%` },
        { 
          left: `${targetX}%`, 
          duration: duration, 
          ease: "none",
          onComplete: fly
        }
      );
    };
    fly();
  }, []);

  // Firing Logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (skills.length === 0) return;
      const skill = skills[Math.floor(Math.random() * skills.length)];
      setBullets(prev => [...prev, { id: Date.now(), skill }]);
    }, 2000 + (index * 500));

    return () => clearInterval(interval);
  }, [skills, index]);

  const removeBullet = (id) => {
    setBullets(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div 
      ref={jetRef}
      className="absolute w-24 h-24 z-40"
      style={{ top: `${yPos}%`, left: `${startX}%` }}
    >
      {/* Category Tag */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.4em] text-[var(--accent)] opacity-40">
        SQN-{index + 1} // {category}
      </div>

      <FighterJetSVG direction={direction} />

      {/* Bullets Container */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2">
        {bullets.map(b => (
          <SkillBullet 
            key={b.id} 
            skill={b.skill} 
            direction={direction}
            onComplete={() => removeBullet(b.id)}
          />
        ))}
      </div>
    </div>
  );
};

export const CircularRadar = ({ isScanning }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
    {/* Radar Rings */}
    <div className="absolute inset-0 border border-[var(--accent)]/30 rounded-full" />
    <div className="absolute inset-[15%] border border-[var(--accent)]/20 rounded-full" />
    <div className="absolute inset-[30%] border border-[var(--accent)]/10 rounded-full" />
    <div className="absolute inset-[45%] border border-[var(--accent)]/5 rounded-full" />
    
    {/* Axis Lines */}
    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[var(--accent)]/10" />
    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[var(--accent)]/10" />
    
    {/* Sweeper Line */}
    <motion.div 
      animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 w-full h-[1px] origin-left bg-gradient-to-r from-[var(--accent)]/40 to-transparent z-10" 
      style={{ top: '50%', left: '50%' }}
    />

    {/* HUD Elements */}
    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[var(--accent)] uppercase tracking-widest bg-black/60 px-4 py-1 rounded-full border border-[var(--accent)]/20">
        Air Defense Radar (ADRS-X)
    </div>
  </div>
);

export const BattlefieldHUD = () => (
  <div className="absolute inset-0 pointer-events-none">
     {/* Grid background */}
     <div className="absolute inset-0 bg-[linear-gradient(rgba(34,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,255,102,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
     
     {/* HUD Scanline */}
     <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,255,102,0.01)_3px)]"
     />
  </div>
);
