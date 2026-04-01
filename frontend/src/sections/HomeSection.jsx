import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, ExternalLink, Eye, LayoutTemplate, Sparkles, Github, Linkedin, Mail, Instagram } from 'lucide-react';

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
            <text className="text-[10px] font-black uppercase tracking-[0.2em] fill-[var(--accent)]">
               <textPath href="#circlePath">
                  Visit Project • Visit Project • 
               </textPath>
            </text>
         </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-[0_0_20px_var(--accent)]/50">
            <ExternalLink className="w-4 h-4 text-[var(--bg-base)]" />
         </div>
      </div>
   </motion.div>
);

const MetaIsland = ({ island, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const showPopup = isHovered;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (island.id === 'location') {
      const wantsToVisit = window.confirm("Redirect to Google Maps?");
      if (wantsToVisit) {
        const query = encodeURIComponent(island.locationQuery || "SRKR Engineering College, Bhimavaram");
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, "_blank");
      }
    } else if (island.link) {
      window.open(island.link, "_blank");
    }
  };

  return (
    <motion.div
      layout
      className={`relative z-20 group h-auto w-full md:w-auto transition-all mb-4 md:mb-6`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={`relative flex flex-col items-center md:items-start gap-4 cursor-pointer`}>
        {/* BASE CONTENT */}
        <div className={`flex items-center gap-3`}>
          <div className="p-3 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-base)] transition-all duration-500 shadow-xl shadow-[var(--accent)]/5">
            <island.icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent)]/30 whitespace-nowrap">
            {island.title}
          </span>
        </div>
        
        <p className={`text-[12px] md:text-[14px] font-medium text-center md:text-left text-[var(--text-secondary)] max-w-[200px] leading-relaxed border-[var(--accent)]/20 group-hover:text-[var(--text-primary)] transition-colors border-l pl-5`}>
          {island.text}
        </p>

        {/* SPATIAL POPUP (REMOVED md:absolute to prevent overlapping) */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.95, y: 10 }}
              onMouseMove={handleMouseMove}
              className="relative mt-6 md:mt-4 z-50 p-4 rounded-[32px] bg-[var(--glass-bg)] border border-[var(--accent)]/30 backdrop-blur-2xl shadow-[var(--shadow-lg)] w-[280px] md:w-[300px] flex flex-col gap-4 overflow-hidden mx-auto md:mx-0"
            >
              <div className="w-full aspect-video rounded-2xl bg-[var(--bg-secondary)] overflow-hidden relative border border-[var(--border)]">
                 {island.id === 'location' ? (
                    <iframe 
                       title="Location Map"
                       src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(island.locationQuery || "SRKR Engineering College, Bhimavaram")}`} // Placeholder, generic iframe below
                       className="w-full h-full border-0 grayscale invert contrast-[1.2] opacity-60"
                       srcDoc={`<style>body{margin:0;overflow:hidden;background:#000;}</style><iframe width="100%" height="100%" frameborder="0" style="border:0;filter:grayscale(1) invert(1) contrast(1.2) opacity(0.6);" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.8674996964893!2d81.52044397514467!3d16.53282468421376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37d2f9748ec0e1%3A0xe2128bca612e52b!2sS.R.K.R.%20Engineering%20College!5e0!3m2!1sen!2sin!4v1711822000000!5m2!1sen!2sin" allowfullscreen></iframe>`}
                       allowFullScreen=""
                       loading="lazy"
                    />
                 ) : (
                    <>
                       <img src={island.previewImg || "/images/portrait.png"} className="w-full h-full object-cover grayscale brightness-50 contrast-125 transition-transform duration-700 group-hover:scale-110" alt="Preview"/>
                       <motion.div
                         animate={{ x: mousePos.x, y: mousePos.y }}
                         transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
                         className="absolute top-0 left-0 pointer-events-none z-50 w-12 h-12 rounded-full bg-[#27c93f] flex items-center justify-center text-black shadow-[0_0_30px_rgba(39,201,63,0.5)]"
                         style={{ translateX: '-50%', translateY: '-50%' }}
                       >
                         <Eye className="w-6 h-6" />
                       </motion.div>
                    </>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              </div>

              <div className="space-y-3 px-1">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">{island.id === 'location' ? 'LIVE RADAR' : 'ACTIVE BUILD'}</span>
                    <button className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-[var(--bg-base)] transition-all">
                       <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                 </div>
                 
                 <div className="space-y-2 text-left">
                    <h4 className="text-[var(--text-primary)] font-black text-sm uppercase tracking-widest">{island.text}</h4>
                    {island.stack && (
                       <div className="flex flex-wrap gap-1.5 pt-1">
                          {island.stack.map(tag => (
                             <span key={tag} className="text-[9px] font-black uppercase text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
                                {tag}
                             </span>
                          ))}
                       </div>
                    )}
                 </div>

                 <p className="text-[11px] text-white/40 font-medium leading-relaxed mt-1 line-clamp-3 text-left">
                    {island.description}
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StatusSlideshow = ({ profile }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [currentImg, setCurrentImg] = useState(0);

  const words = profile?.statusWords || ['WORK', 'COLLABORATE'];
  const gallery = profile?.gallery?.length > 0 ? profile.gallery : [{ url: "/images/portrait.png" }];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopIndex % words.length;
      const fullText = words[i];
      
      setDisplayText(isDeleting 
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1)
      );

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2500);
        return;
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopIndex(loopIndex + 1);
        setTypingSpeed(500);
        return;
      }
      setTypingSpeed(isDeleting ? 60 : 120);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopIndex, typingSpeed, words]);

  const socials = [
    { icon: Github, link: profile?.github || "https://github.com/kushalsaialeti" },
    { icon: Linkedin, link: profile?.linkedin || "https://linkedin.com/in/kushalsaialeti" },
    { icon: Instagram, link: profile?.instagram || "https://instagram.com/kushal_sai_aleti" },
    { icon: Mail, link: `mailto:${profile?.email || 'kushalsaialeti@gmail.com'}` }
  ];

  return (
    <div className="relative md:absolute top-0 md:top-32 right-0 md:right-16 z-20 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        className="w-48 h-48 md:w-64 md:h-64"
      >
        <div className="relative w-full h-full rounded-[48px] overflow-hidden border border-[var(--border)] group shadow-[var(--shadow-lg)] bg-[var(--bg-secondary)]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImg}
                src={gallery[currentImg]?.url || "/images/portrait.png"} 
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                alt="Portrait"
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
            
            {/* CAROUSEL PROGRESS INDICATORS */}
            <div className="absolute bottom-16 left-8 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700">
              {gallery.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i === currentImg ? 'w-8 bg-[var(--accent)]' : 'w-1.5 bg-[var(--text-secondary)]/30'}`} />
              ))}
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_12px_var(--accent)]" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]/90">
                  OPEN TO <span className="text-[var(--accent)]">{displayText}</span>
                  <span className="inline-block w-1.5 h-3 bg-[var(--accent)] ml-1 animate-pulse" />
              </p>
            </div>
        </div>
        {/* AMBIENT DIMENSIONAL GLOW */}
        <div className="absolute -inset-20 bg-[var(--accent)]/[0.03] blur-[120px] -z-10 rounded-full group-hover:bg-[var(--accent)]/[0.07] transition-all duration-1000" />
      </motion.div>

      {/* SOCIAL LINKS - BELLOW IMAGE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-8 flex gap-6"
      >
         {socials.map((social, idx) => (
           <motion.a
             key={idx}
             href={social.link}
             target="_blank"
             rel="noreferrer"
             whileHover={{ scale: 1.2, color: 'var(--accent)' }}
             className="text-[var(--text-secondary)]/50 transition-colors"
           >
              <social.icon className="w-5 h-5" />
           </motion.a>
         ))}
      </motion.div>
    </div>
  );
};

export default function HomeSection({ section, content, onNavigate }) {
  const profile = content?.siteProfile;
  const projects = content?.projects || [];

  const metaIslands = [
    {
      id: 'project',
      icon: Briefcase,
      title: profile?.activelyBuilding?.title || 'Actively Building',
      text: projects[0] ? projects[0].name : (profile?.activelyBuilding?.text || 'Stealth System'),
      description: projects[0] ? projects[0].description : (profile?.activelyBuilding?.description || 'Developing deep-purpose systems in real-time.'),
      stack: projects[0]?.stack || (profile?.activelyBuilding?.stack || ['React', 'Node', 'System']),
      delay: 0.6,
      link: projects[0]?.live,
      previewImg: projects[0]?.preview?.url || "/images/portrait.png"
    },
    {
      id: 'location',
      icon: MapPin,
      title: profile?.location?.title || 'Current Location',
      text: profile?.location?.text || 'Bhimavaram, SRKR campus',
      description: profile?.location?.description || 'Engineering at SRKR Campus, Bhimavaram.',
      locationQuery: profile?.location?.query,
      delay: 0.4
    }
  ];

  const techStackLabels = profile?.stackLabels || ['MERN', 'REACT NATIVE', 'VIBE CODING'];

  return (
    <section 
      id={section?.id} 
      className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-[var(--bg-base)] relative overflow-hidden pt-32 px-6 md:px-24"
    >
       {/* MOBILE PORTRAIT FIRST */}
       <div className="order-1 md:hidden w-full flex justify-center mb-12">
          <StatusSlideshow profile={profile} />
       </div>

       {/* LEFT COLUMN METADATA STACK (Fixed Overlap) */}
       <div className="hidden md:flex absolute left-8 lg:left-16 top-32 flex-col items-start w-64 z-50 pointer-events-auto">
          {metaIslands.map((island) => (
             <MetaIsland key={island.id} island={island} onNavigate={onNavigate} />
          ))}
       </div>

       {/* CENTRAL CONTENT */}
       <div className="order-2 relative z-10 flex flex-col items-center w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
             <h1 className="text-[14vw] md:text-[7vw] font-black tracking-[-0.05em] uppercase leading-[0.85] text-[var(--text-primary)]">
                {(profile?.name || 'KUSHAL SAI').split(' ').slice(0,2).join(' ')}<br/>{(profile?.name || 'ALETI').split(' ').slice(2).join(' ') || 'ALETI'}
             </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
             {techStackLabels.map((label, idx) => (
                <React.Fragment key={label}>
                   <motion.button
                      whileHover={{ scale: 1.08, backgroundColor: '#27c93f', color: '#000000', borderColor: '#27c93f' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate?.('blogs')}
                      className="px-8 py-3 rounded-[20px] border border-black/5 dark:border-white/10 bg-white dark:bg-white/[0.03] text-[10px] md:text-[13px] font-black uppercase tracking-[0.4em] text-black dark:text-white transition-all shadow-sm"
                   >
                      {label}
                   </motion.button>
                   {idx < techStackLabels.length - 1 && (
                      <div className="self-center w-1 h-1 rounded-full bg-[var(--text-primary)]/10 hidden md:block" />
                   )}
                </React.Fragment>
             ))}
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8 text-sm md:text-base font-serif italic text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed opacity-80"
          >
            "{profile?.tagline || 'Building crisp, scalable web experiences.'}"
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-16 flex flex-row gap-6 items-center"
          >
             <motion.button 
                whileHover={{ scale: 1.05, filter: 'brightness(0.9)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('projects')}
                className="px-12 py-5 rounded-[24px] bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
             >
                VIEW PROJECTS
             </motion.button>
             
             <motion.a 
                href={profile?.resume}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: '#27c93f', color: '#000000', borderColor: '#27c93f' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-[24px] border border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all"
             >
                RESUME
             </motion.a>
          </motion.div>

          {/* MOBILE ISLANDS */}
          <div className="order-3 mt-16 flex flex-col items-center md:hidden w-full">
             {metaIslands.map((island) => (
                <MetaIsland key={island.id} island={island} onNavigate={onNavigate} />
             ))}
          </div>
       </div>

       {/* DESKTOP RIGHT OVERLAY */}
       <div className="hidden md:block">
          <StatusSlideshow profile={profile} />
       </div>

       {/* AMBIENT BACKGROUND TEXT */}
       <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black text-[var(--text-primary)] whitespace-nowrap overflow-hidden tracking-tighter">
             VIBE
          </div>
       </div>
    </section>
  );
}
