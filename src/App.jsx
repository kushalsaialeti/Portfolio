import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { PORTFOLIO_DATA } from './constants/portfolio';

// Modular Sections
import Hero from './sections/Hero';
import VisionSection from './sections/VisionSection';
import PortfolioSection from './sections/PortfolioSection';
import FloatingWindow from './components/FloatingWindow';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [activeId, setActiveId] = useState(null);
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  React.useLayoutEffect(() => {
    const lenis = new Lenis({
       duration: 3.0, // Snappy but smooth Apple-style momentum
       smoothWheel: true,
       wheelMultiplier: 1.1,
       orientation: 'vertical',
       smoothTouch: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.card-hero, .card-vision, [class*="card-"]');
      
      cards.forEach((card, i) => {
        // Optimization: Enable hardware acceleration
        gsap.set(card, { willChange: "transform, opacity, filter" });

        // CROSS-FADE HAND-OFF: Simultaneous reveal and hide
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          gsap.set(nextCard, { willChange: "transform, opacity, filter" });
          
          const tl = gsap.timeline({
            scrollTrigger: {
               trigger: nextCard,
               start: "top bottom", 
               end: "top top", 
               scrub: 1.2, // Faster, snappier scrub for agency feel
               invalidateOnRefresh: true,
            }
          });

          // PREVIOUS CARD EXIT: Fades out only as next card enters the final 50%
          tl.to(card, {
            opacity: 0,
            filter: "blur(20px)", // Cleaner, more subtle blur
            scale: 0.95, // Very subtle scale
            ease: "power1.in"
          }, 0);

          // NEXT CARD ENTRANCE: Smooth fade-in and blur resolve
          tl.fromTo(nextCard, 
            { opacity: 0, filter: "blur(20px)", scale: 1.02 },
            { opacity: 1, filter: "blur(0px)", scale: 1, ease: "power1.out" },
            0
          );

          // STICKY PIN: Ensures card stays in place for cross-fade
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: nextCard,
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
        }
      });

      setIsReady(true);
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="bg-black text-white selection:bg-[#27c93f]/20 font-inter">
      {/* 1. HERO (Centered Circle Portrait) */}
      <div className="card-hero w-full h-screen">
         <Hero heroRef={heroRef} />
      </div>

      {/* 2. VISION (Product Showcase) */}
      <div className="card-vision w-full h-screen">
         <VisionSection />
      </div>

      {/* 3. MODULAR PORTFOLIO (Full-Width Stacking Cards) */}
      <section className="relative z-20">
         {PORTFOLIO_DATA.map((item, i) => (
            <div key={item.id} className={`card-${i} w-full h-screen`}>
               <PortfolioSection 
                  item={item} 
                  i={i} 
                  setActiveId={setActiveId} 
               />
            </div>
         ))}
      </section>

      {/* 4. MODAL VIEW (Immersive Fullscreen) */}
      <AnimatePresence>
         {activeId && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveId(null)}
                  className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
               />
               <motion.div 
                   initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                   animate={{ y: 0, opacity: 1, scale: 1 }}
                   exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                   transition={{ type: "spring", damping: 25, stiffness: 180, mass: 0.6 }}
                   className="relative w-full h-full bg-[#0A0A0A] overflow-hidden flex flex-col z-[1001]"
               >
                  <FloatingWindow activeId={activeId} setActiveId={setActiveId} />
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* 5. LARGE FOOTER */}
      <footer className="py-48 bg-[#050505] flex flex-col items-center justify-center space-y-16 px-6 text-center border-t border-white/5 relative z-[30]">
         <div className="space-y-6">
            <h2 className="text-4xl md:text-[14vw] font-black uppercase tracking-tighter leading-none text-white opacity-80">READY.</h2>
            <div className="h-[2px] w-24 bg-[#27c93f]/40 mx-auto" />
            <p className="text-[#444] text-[10px] font-bold tracking-[0.5em] uppercase">HIRE KUSHAL SAI ALETI</p>
         </div>
         <div className="flex flex-wrap justify-center gap-12 text-[#A1A1A6]">
            {["LinkedIn", "GitHub", "Email"].map(link => (
               <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#27C93F] transition-all">{link}</a>
            ))}
         </div>
         <p className="pt-20 text-[9px] font-black uppercase tracking-[1em] text-[#1a1a1a]">DESIGNED IN 2026</p>
      </footer>
    </main>
  );
}

export default App;
