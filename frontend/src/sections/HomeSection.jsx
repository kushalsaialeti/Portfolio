import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Code, Sparkles, Briefcase, ExternalLink, Image as ImageIcon } from 'lucide-react';

const CircularBadge = () => (
   <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute -top-12 -right-12 z-[100] w-24 h-24"
   >
      <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
         className="relative w-full h-full"
      >
         <svg viewBox="0 0 100 100" className="w-full h-full">
            <path 
               id="circlePath" 
               d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" 
               fill="none"
            />
            <text className="text-[10px] font-black uppercase tracking-[0.2em] fill-[#27c93f]">
               <textPath href="#circlePath">
                  Visit Project • Visit Project • 
               </textPath>
            </text>
         </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-8 h-8 rounded-full bg-[#27c93f] flex items-center justify-center shadow-[0_0_20px_rgba(39,201,63,0.5)]">
            <ExternalLink className="w-4 h-4 text-black" />
         </div>
      </div>
   </motion.div>
);

const MetaIsland = ({ island, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPermanent = island.id === 'project';
  const showPopup = isHovered || isPermanent;

  const handleClick = (e) => {
    e.stopPropagation();
    if (island.id === 'location') {
      const wantsToVisit = window.confirm("Redirect to Google Maps?");
      if (wantsToVisit) {
        const query = encodeURIComponent("SRKR Engineering College, Bhimavaram");
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const url = isMobile 
          ? `https://www.google.com/maps/search/?api=1&query=${query}`
          : `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, "_blank");
      }
    } else if (island.link) {
      window.open(island.link, "_blank");
    }
  };

  return (
    <div
      className={`absolute ${island.pos} z-20 group h-20 w-auto transition-all`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={`relative flex flex-col ${island.pos.includes('right') ? 'items-end text-right' : 'items-start'} gap-4 cursor-pointer`}>
        {/* BASE CONTENT */}
        <div className={`flex items-center gap-3 ${island.pos.includes('right') ? 'flex-row-reverse' : ''}`}>
          <div className="p-3 rounded-2xl bg-[#27c93f]/5 border border-[#27c93f]/20 group-hover:bg-[#27c93f] group-hover:text-black transition-all duration-500 shadow-xl shadow-[#27c93f]/5">
            <island.icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#27c93f] drop-shadow-[0_0_8px_rgba(39,201,63,0.3)] whitespace-nowrap">
            {island.title}
          </span>
        </div>
        
        <p className={`text-[12px] md:text-[14px] font-medium text-white/50 max-w-[200px] leading-relaxed border-[#27c93f]/20 group-hover:text-white transition-colors 
           ${island.pos.includes('right') ? 'border-r pr-5' : 'border-l pl-5'}`}>
          {island.text}
        </p>

        {/* SPATIAL POPUP */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={isPermanent ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="absolute top-10 left-0 md:left-auto md:right-[-40px] z-50 p-4 rounded-[32px] bg-[#0c0c0e]/95 border border-[#27c93f]/30 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] w-[300px] flex flex-col gap-4 overflow-visible"
            >
              <div className="w-full aspect-video rounded-2xl bg-black overflow-hidden relative border border-white/5">
                 {island.id === 'location' ? (
                    <iframe 
                       title="Location Map"
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.8674996964893!2d81.52044397514467!3d16.53282468421376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37d2f9748ec0e1%3A0xe2128bca612e52b!2sS.R.K.R.%20Engineering%20College!5e0!3m2!1sen!2sin!4v1711822000000!5m2!1sen!2sin"
                       className="w-full h-full border-0 grayscale invert contrast-[1.2] opacity-60"
                       allowFullScreen=""
                       loading="lazy"
                    />
                 ) : (
                    <>
                       <img src={island.previewImg || "/images/portrait.png"} className="w-full h-full object-cover grayscale brightness-50 contrast-125" alt="Preview"/>
                       {isHovered && <CircularBadge />}
                    </>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="space-y-2 px-1">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#27c93f]">{island.id === 'location' ? 'LIVE RADAR' : 'ACTIVE BUILD'}</span>
                    <button className="p-2 rounded-xl bg-white/5 hover:bg-[#27c93f] hover:text-black transition-all">
                       <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                 </div>
                 <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                    {island.id === 'location' ? 'Engineering at SRKR Campus, Bhimavaram.' : 'Developing deep-purpose systems in real-time.'}
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HomeSection({ section, content, onNavigate }) {
  const profile = content?.siteProfile;
  const projects = content?.projects || [];

  const metaIslands = [
    {
      id: 'project',
      icon: Briefcase,
      title: 'Actively Building',
      text: projects[0] ? projects[0].name : 'Stealth System',
      pos: 'top-12 left-6 md:top-32 md:left-24',
      delay: 0.6,
      link: projects[0]?.live,
      previewImg: projects[0]?.preview?.url || "/images/portrait.png"
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Current Location',
      text: 'Bhimavaram, SRKR campus',
      pos: 'top-[340px] left-6 md:top-[540px] md:left-24',
      delay: 0.4
    }
  ];

  const techStackLabels = ['MERN', 'REACT NATIVE', 'VIBE CODING'];

  return (
    <section 
      id={section?.id} 
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden pt-20"
    >
       {/* CENTRAL TYPOGRAPHIC CLUSTER */}
       <div className="relative z-10 flex flex-col items-center w-full px-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
             <h1 className="text-[14vw] md:text-[7vw] font-black tracking-[-0.05em] uppercase leading-[0.85] text-white">
                {(profile?.name || 'KUSHAL SAI').split(' ').slice(0,2).join(' ')}<br/>{(profile?.name || 'ALETI').split(' ').slice(2).join(' ') || 'ALETI'}
             </h1>
          </motion.div>

          {/* TECH STACK NAVIGATION BUTTONS */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
             {techStackLabels.map((label, idx) => (
                <React.Fragment key={label}>
                   <motion.button
                      whileHover={{ scale: 1.08, color: '#27c93f', borderColor: 'rgba(39, 201, 63, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate?.('blogs')}
                      className="px-6 py-3 rounded-2xl border border-white/10 bg-white/[0.02] text-[10px] md:text-[13px] font-black uppercase tracking-[0.6em] text-white/60 transition-all backdrop-blur-md"
                   >
                      {label}
                   </motion.button>
                   {idx < techStackLabels.length - 1 && (
                      <div className="self-center w-1 h-1 rounded-full bg-white/10 hidden md:block" />
                   )}
                </React.Fragment>
             ))}
          </motion.div>

          {/* PERSONAL TAGLINE */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8 text-sm md:text-base font-serif italic text-[#A1A1A6] max-w-2xl mx-auto leading-relaxed opacity-80"
          >
            "{profile?.tagline || 'Building crisp, scalable web experiences.'}"
          </motion.p>
          {/* SHARED CTA BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-16 flex flex-row gap-6 items-center"
          >
             <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#27c93f', color: '#000' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('contact')}
                className="px-10 py-5 rounded-full bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] transition-all"
             >
                HIRE ME
             </motion.button>
             
             <motion.a 
                href={profile?.resume}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, borderColor: '#fff' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-full border border-white/20 text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all backdrop-blur-sm"
             >
                RESUME
             </motion.a>
          </motion.div>
       </div>

       {/* SCATTERED METADATA ISLANDS (OVERLAY REFACTORED) */}
       {metaIslands.map((island) => (
          <MetaIsland key={island.id} island={island} onNavigate={onNavigate} />
       ))}

       {/* AMBIENT BACKGROUND TEXT */}
       <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black text-white whitespace-nowrap overflow-hidden tracking-tighter">
             VIBE
          </div>
       </div>
    </section>
  );
}
