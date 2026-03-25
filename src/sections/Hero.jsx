import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Menu, X } from 'lucide-react';

const Hero = ({ heroRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resumeLink = "https://drive.google.com/drive/folders/your-resume-id"; 

  const navItems = [
    { label: "Skills", target: ".card-1" },
    { label: "Projects", target: ".card-4" },
    { label: "Experience", target: ".card-2" },
    { label: "Education", target: ".card-3" },
    { label: "Certifications", target: ".card-5" },
    { label: "Achievements", target: ".card-5" }
  ];

  const scrollToSection = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false); // Close menu on mobile after click
    }
  };

  return (
    <section ref={heroRef} className="h-screen w-full flex flex-col items-center justify-center text-center space-y-12 px-10 bg-black z-10 relative overflow-hidden">
       
       {/* RESPONSIVE NAVIGATION: Desktop Sidebar / Mobile Hamburger Header */}
       <div className="absolute left-6 md:left-12 top-6 lg:top-1/2 lg:-translate-y-1/2 z-[100] flex flex-col gap-5">
          {/* Mobile Menu Toggle Button */}
          <motion.div 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             whileTap={{ scale: 0.9 }}
             className="lg:hidden w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl flex items-center justify-center cursor-pointer shadow-2xl"
          >
             {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </motion.div>

          {/* Nav Items Container */}
          <AnimatePresence>
             {(isMenuOpen || (typeof window !== 'undefined' && window.innerWidth > 1024)) && (
                <motion.div 
                   initial={typeof window !== 'undefined' && window.innerWidth <= 1024 ? { opacity: 0, x: -20, scale: 0.95 } : {}}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   exit={{ opacity: 0, x: -20, scale: 0.95 }}
                   className={`flex flex-col gap-4 ${isMenuOpen ? 'mt-4' : 'hidden lg:flex'}`}
                >
                   {navItems.map((item, i) => (
                      <motion.div 
                         key={item.label}
                         initial={{ opacity: 0, x: -40 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1 * i, duration: 0.5 }}
                         whileHover={{ scale: 1.05, x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => scrollToSection(item.target)}
                         className="group flex gap-4 items-center px-5 py-4 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl transition-all cursor-pointer w-max md:w-auto"
                      >
                         <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#27c93f]/40 transition-colors">
                            <Plus className="w-3 h-3 text-white transition-colors group-hover:text-[#27c93f]" />
                         </div>
                         <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white whitespace-nowrap">{item.label}</span>
                      </motion.div>
                   ))}
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* High-Fidelity Circular Frame */}
       <div className="w-40 h-40 md:w-72 md:h-72 rounded-full overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(255,255,255,0.06)] grayscale brightness-110 mb-6 transition-all hover:scale-[1.2] duration-1000">
          <img src="/images/portrait.png" className="w-full h-full object-cover" alt="Kushal Sai" />
       </div>
       
       <div className="space-y-6">
          <h1 className="text-2xl md:text-[5vw] font-black tracking-tighter uppercase leading-none text-white hover:scale-[1.06] drop-shadow-[40px_rgba(255,255,255,0.1)]">
             A.K.S.D.VARAPRASAD
          </h1>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto pt-8">
             {["MERN STACK", "REACT NATIVE", "PROMPT ENGINEER"].map((skill, i) => (
                <motion.div 
                   key={i}
                   whileHover={{ scale: 1.15, y: -12, backgroundColor: 'rgba(255,255,255,0.1)' }}
                   whileTap={{ scale: 0.95 }}
                   className="px-8 md:px-10 py-3 md:py-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl flex items-center justify-center cursor-default transition-all duration-300"
                >
                   <span className="text-[10px] md:text-sm font-black tracking-[0.4em] text-[#A1A1A6] uppercase">{skill}</span>
                </motion.div>
             ))}
          </div>

          {/* TWO PRIMARY CTA BUTTONS: Whitespace Logic */}
          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4 md:pt-0 items-center">
             <motion.button 
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-10 py-6 md:py-7 rounded-full bg-white text-black font-black uppercase text-[11px] md:text-[12px] tracking-[0.4em] md:tracking-[0.5em] transition-all hover:bg-[#27c93f] hover:text-white"
             >
                HIRE ME
             </motion.button>
             
             <motion.a 
                href={resumeLink}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, y: -5, borderColor: 'rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-10 md:px-16 py-6 md:py-7 rounded-full border border-white/20 text-white font-black uppercase text-[11px] md:text-[12px] tracking-[0.4em] md:tracking-[0.5em] transition-all backdrop-blur-sm hover:bg-white/5"
             >
                RESUME
             </motion.a>
          </div>
       </div>

       {/* Scroll Signal */}
       <div className="opacity-10 flex flex-col items-center animate-bounce">
          <div className="w-[1px] h-12 md:h-16 bg-white shrink-0 mb-4" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[1em]">Scroll Down</span>
       </div>
    </section>
  );
};

export default Hero;
