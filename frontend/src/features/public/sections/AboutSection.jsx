import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SectionShell from '../../../components/SectionShell';

export default function AboutSection({ section, content }) {
  const [currentImg, setCurrentImg] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const aboutLines = content?.aboutLines || [];
  
  // 1. Combine IDENTITY PORTRAIT + GALLERY for a complete slideshow
  const portraitUrl = content?.siteProfile?.portrait?.url;
  const galleryData = content?.gallery || [];
  
  // Build unique image sequence
  const carouselImages = [
    ...(portraitUrl ? [portraitUrl] : ["/images/portrait.png"]),
    ...galleryData.map(img => img.url)
  ].filter((url, index, self) => self.indexOf(url) === index); // Unique URLs

  useEffect(() => {
    if (prefersReducedMotion || carouselImages.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Reset to 5s as per original request
    return () => clearInterval(timer);
  }, [carouselImages.length, prefersReducedMotion]);

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        
        {/* LEFT: Detailed Bio Text (60%) */}
        <div className="space-y-6">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <span className="h-px w-10 bg-white/30" /> Profile / Approach
          </div>
          {aboutLines.map((line, idx) => (
            <motion.p 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-base md:text-lg leading-relaxed text-[var(--text-secondary)] font-medium"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* RIGHT: 5-Second Carousel (40%) */}
        <div className="relative flex min-h-[360px] items-center justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentImg}
                     initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.1, x: 20 }}
                     animate={{ opacity: 1, scale: 1, x: 0 }}
                     exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={carouselImages[currentImg]} 
                      className="w-full h-full object-cover" 
                      alt={`Gallery ${currentImg + 1}`} 
                      loading={currentImg === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    
                    {/* Carousel Counter */}
                     <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                        {carouselImages.map((_, i) => (
                           <button
                             key={i} 
                            type="button"
                            aria-label={`Show gallery image ${i + 1}`}
                            aria-current={i === currentImg ? 'true' : undefined}
                            onClick={() => setCurrentImg(i)}
                            className={`h-2 rounded-full transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${i === currentImg ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                           />
                       ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Dynamic Frame Glow */}
             <div className="absolute -inset-10 rounded-full bg-white/[0.04] blur-3xl -z-10" />
        </div>

      </div>
    </SectionShell>
  );
}
