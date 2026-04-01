import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Mail, ArrowUpRight, Zap, Target } from 'lucide-react';

export default function SiteFooter({ profile, onNavigate, sections }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-[var(--border)] bg-[var(--bg-base)] overflow-hidden pt-24 pb-16">
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--accent)]/[0.03] blur-[150px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
          {/* CORE IDENTITY BLOCK */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#27c93f] flex items-center justify-center text-black shadow-[0_0_30px_rgba(39,201,63,0.3)]">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                    {profile?.name || 'Architect Console'}
                  </h2>
               </div>
               <p className="text-[#A1A1A6] text-sm leading-relaxed max-w-sm font-medium uppercase tracking-widest text-[10px]">
                 Building digital ecosystems with precision, grit, and high-fidelity aesthetics. Based in India, scaled for the cloud.
               </p>
            </div>

            <div className="flex items-center gap-6 pt-4">
              {[
                { icon: Github, link: profile?.github },
                { icon: Linkedin, link: profile?.linkedin },
                { icon: Instagram, link: profile?.instagram },
                { icon: Mail, link: `mailto:${profile?.email}` }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-[#27c93f] hover:border-[#27c93f]/30 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* DYNAMIC NAVIGATION GRID */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
             <div className="space-y-8">
                <h3 className="text-[#27c93f] text-[10px] font-black uppercase tracking-[0.4em] pl-1 border-l-2 border-[#27c93f]/40">System Map</h3>
                <nav className="flex flex-col gap-5">
                   {sections?.filter(s => s.isVisible !== false).map((sec) => (
                      <button 
                         key={sec.id} 
                         onClick={() => onNavigate(sec.id)}
                         className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-all group"
                      >
                         <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#27c93f] group-hover:scale-125 transition-all" />
                         {sec.navLabel}
                      </button>
                   ))}
                </nav>
             </div>

             <div className="space-y-8">
                <h3 className="text-[#27c93f] text-[10px] font-black uppercase tracking-[0.4em] pl-1 border-l-2 border-[#27c93f]/40">Developer Stack</h3>
                <div className="flex flex-col gap-5">
                   {['GitHub Workflow', 'Cloudinary CDN', 'Vercel Edge', 'MongoDB Atlas'].map((stack) => (
                      <div key={stack} className="text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-all flex items-center gap-2 cursor-crosshair">
                         {stack}
                      </div>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-1 hidden md:block space-y-8">
                <h3 className="text-[#27c93f] text-[10px] font-black uppercase tracking-[0.4em] pl-1 border-l-2 border-[#27c93f]/40">Impact Metrics</h3>
                <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-4">
                       <Target className="w-5 h-5 text-[#27c93f]/40" />
                       <div className="text-[12px] font-black uppercase tracking-tighter">99.9% Production Uptime</div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
              <span>&copy; {currentYear} Kushal Sai Aleti Portfolio Console</span>
              <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/5" />
              <span>Version 1.4.2 [STABLE]</span>
           </div>
           
           <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/10 group hover:border-[#27c93f]/30 transition-all cursor-pointer">
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-all">Environment Check: [SUCCESS]</span>
                 <div className="w-2 h-2 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.5)]" />
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}
