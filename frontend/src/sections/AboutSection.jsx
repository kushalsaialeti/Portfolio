import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionShell from '../components/SectionShell';
import { ABOUT_LINES } from '../constants/siteContent';

export default function AboutSection({ section, content }) {
  const [currentImg, setCurrentImg] = useState(0);
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
    if (carouselImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Reset to 5s as per original request
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16 mt-10">
        
        {/* LEFT: Detailed Bio Text (60%) */}
        <div className="flex-[1.5] space-y-6">
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
        <div className="flex-1 min-h-[400px] lg:min-h-auto relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] max-w-[400px] rounded-[40px] overflow-hidden border border-[var(--border)] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentImg}
                    initial={{ opacity: 0, scale: 1.1, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={carouselImages[currentImg]} 
                      className="w-full h-full object-cover" 
                      alt={`Gallery ${currentImg + 1}`} 
                    />
                    
                    {/* Carousel Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                       {carouselImages.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentImg ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[var(--text-secondary)]/20'}`} 
                          />
                       ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Dynamic Frame Glow */}
            <div className="absolute -inset-10 bg-[var(--accent)]/5 blur-3xl rounded-full opacity-50 -z-10" />
        </div>

      </div>
    </SectionShell>
  );
}
