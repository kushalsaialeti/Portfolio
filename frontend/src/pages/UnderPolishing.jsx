import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Mail, 
  Copy, 
  Check, 
  Clock, 
  ArrowUpRight,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnderPolishing({ config = {} }) {
  const durationHours = config.durationHours || 36;
  const startedAt = config.startedAt ? Number(config.startedAt) : 1726500000000;
  const title = config.title || "Crafting Something Extraordinary";
  const subtitle = config.subtitle || "Portfolio Under Polishing";
  const message = config.message || "I am currently polishing and elevating the portfolio experience with fresh design systems, refined micro-interactions, and new product case studies.";
  
  const githubUrl = config.github || "https://github.com/kushalsaialeti";
  const linkedinUrl = config.linkedin || "https://www.linkedin.com/in/kushalsaialeti/";
  const instagramUrl = config.instagram || "https://www.instagram.com/_.kushal._.sai._.aleti._/";
  const email = config.email || "kushalsaialeti98@gmail.com";

  // Auto-looping 36h countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 36,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cycleMs = durationHours * 60 * 60 * 1000;

    const calculateTime = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startedAt);
      // Auto-restart cycle once cycleMs passes:
      const currentCycleElapsed = elapsed % cycleMs;
      const remainingMs = cycleMs - currentCycleElapsed;

      const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      const progress = Math.min(100, Math.max(0, (currentCycleElapsed / cycleMs) * 100));

      setTimeLeft({ hours, minutes, seconds, progress });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [durationHours, startedAt]);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const pad = (num) => String(num).padStart(2, '0');

  const socialLinks = [
    {
      name: "GitHub",
      handle: "@kushalsaialeti",
      label: "Source Code & Repositories",
      url: githubUrl,
      icon: Github,
    },
    {
      name: "LinkedIn",
      handle: "in/kushalsaialeti",
      label: "Professional Profile",
      url: linkedinUrl,
      icon: Linkedin,
    },
    {
      name: "Instagram",
      handle: "@_.kushal._.sai._.aleti._",
      label: "Design Iterations & Updates",
      url: instagramUrl,
      icon: Instagram,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#101119] text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      
      {/* MONOCHROME SUBTLE GRID BACKGROUND */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* TOP BAR / BRAND HEADER */}
      <header className="w-full border-b border-white/10 bg-[#101119]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-white">
              Kushal Sai Aleti
            </span>
          </div>

          <div className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/80 text-[10px] font-mono tracking-widest uppercase">
            Under Polishing
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center justify-center w-full">
        
        {/* STATUS PILL */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 mb-6 text-[11px] font-mono tracking-wider uppercase text-white/70"
        >
          <Clock className="w-3.5 h-3.5 text-white" />
          <span>Polishing In Progress • 36h Estimated Cycle</span>
        </motion.div>

        {/* HERO TITLE & MESSAGE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3 max-w-2xl"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-white/60 font-mono tracking-wide uppercase">
            {subtitle}
          </p>

          <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-xl mx-auto pt-2">
            {message}
          </p>
        </motion.div>

        {/* SOCIAL LINKS (BROUGHT UP PROMINENTLY) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full mt-10 mb-12 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              Connect & Explore
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
              Direct Social Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded-2xl border border-white/12 bg-white/[0.03] hover:bg-white hover:text-black p-5 transition-all duration-200 text-left flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 group-hover:border-black/20 group-hover:bg-black/5 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 group-hover:text-black/60 transition-colors">
                      {item.name}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-black transition-colors truncate">
                      {item.handle}
                    </h3>
                    <p className="text-[11px] text-white/50 group-hover:text-black/70 transition-colors mt-0.5">
                      {item.label}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* EMAIL ROW */}
          <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Direct Inquiries</p>
                <a 
                  href={`mailto:${email}`} 
                  className="text-xs sm:text-sm font-mono text-white/90 hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white hover:text-black text-xs font-mono tracking-wider transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${email}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all"
              >
                Send Email
              </a>
            </div>
          </div>
        </motion.div>

        {/* 36-HOUR COUNTDOWN ENGINE (CLEAN BLACK & WHITE) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl"
        >
          <div className="rounded-3xl border border-white/15 bg-[#14151e] p-6 sm:p-8">
            
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Estimated Design Update Timer
              </div>
              <span className="text-[10px] font-mono text-white/60 border border-white/15 px-2.5 py-0.5 rounded-full uppercase">
                {durationHours}h Cycle
              </span>
            </div>

            {/* DIGIT CARDS */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* HOURS */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-2xl bg-[#0b0c12] border border-white/15 flex items-center justify-center">
                  <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter">
                    {pad(timeLeft.hours)}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mt-2.5">
                  Hours
                </span>
              </div>

              {/* MINUTES */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-2xl bg-[#0b0c12] border border-white/15 flex items-center justify-center">
                  <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter">
                    {pad(timeLeft.minutes)}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mt-2.5">
                  Minutes
                </span>
              </div>

              {/* SECONDS */}
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-2xl bg-[#0b0c12] border border-white/25 flex items-center justify-center">
                  <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter">
                    {pad(timeLeft.seconds)}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white mt-2.5 font-bold">
                  Seconds
                </span>
              </div>
            </div>

            {/* MONOCHROME PROGRESS BAR */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-white/40">
                <span>Cycle Elapsed</span>
                <span className="text-white font-mono">{timeLeft.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${timeLeft.progress}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] font-mono text-white/40 mt-4 text-center">
              Timer automatically restarts in 36-hour increments until public launch.
            </p>
          </div>
        </motion.div>

        {/* MINIMALIST TAGS */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["Design System Overhaul", "Micro-Interactions", "Performance Tuning", "Case Studies"].map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-lg border border-white/10 bg-white/[0.02] text-white/50"
            >
              [ {tag} ]
            </span>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 bg-[#101119] py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] font-mono text-white/40">
            © 2026 Kushal Sai Aleti • All rights reserved
          </p>

          <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
            <span>Portfolio Status: Polishing</span>
            <span>•</span>
            <Link 
              to="/admin-portal-1622" 
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
