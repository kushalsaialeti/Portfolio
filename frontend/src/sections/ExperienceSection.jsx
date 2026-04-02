import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Plane, Mail, Calendar, Briefcase, MapPin } from 'lucide-react';
import SectionShell from '../components/SectionShell';

const ExperienceCard = ({ exp, index, scrollYProgress, isMobile }) => {
  const cardRef = useRef(null);
  
  // Track this specific card's progress within the viewport
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Animation for the card appearing
  const opacity = useTransform(cardProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Side determination
  const isLeftSide = !isMobile && index % 2 === 0;
  
  const x = useTransform(
    cardProgress, 
    [0, 0.2], 
    [isLeftSide ? -60 : 60, 0]
  );

  // Transition color based on scroll progress ("scrolling away up")
  const isCompleted = exp.status === 'completed';
  const targetColor = isCompleted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
  const borderTarget = isCompleted ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)';
  
  const backgroundColor = useTransform(cardProgress, [0.4, 0.6], ['var(--cards)', targetColor]);
  const borderColor = useTransform(cardProgress, [0.4, 0.6], ['var(--border)', borderTarget]);

  return (
    <div className={`w-full flex ${isMobile ? 'justify-end pl-14' : (isLeftSide ? 'justify-start' : 'justify-end')} mb-10 md:mb-16`}>
        <motion.div
            ref={cardRef}
            style={{ opacity, x, backgroundColor, borderColor }}
            className={`relative w-full md:w-[46%] p-5 md:p-8 rounded-[24px] md:rounded-[32px] border backdrop-blur-xl shadow-xl group transition-all duration-700`}
        >
            {/* Date Badge */}
            <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5 text-[var(--accent)]" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                {exp.startDate} — {exp.endDate || 'Present'}
                </span>
            </div>

            <div className="flex gap-4 md:gap-6 items-start">
                {exp.image?.url && (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0">
                        <img src={exp.image.url} alt={exp.company} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="flex-grow">
                    <h3 className="text-base md:text-xl font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {exp.role}
                    </h3>
                    <p className="text-[10px] md:text-sm font-bold text-[var(--accent)] uppercase tracking-wider mt-0.5 md:mt-1">{exp.company}</p>
                </div>
            </div>

            <p className="mt-4 md:mt-6 text-[11px] md:text-sm text-[var(--text-secondary)] leading-relaxed">
                {exp.description}
            </p>

            {/* Status Indicator */}
            <div className="absolute top-4 md:top-6 right-4 md:right-6">
                <div className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest border ${isCompleted ? 'border-red-500/20 text-red-500' : 'border-green-500/20 text-green-500'}`}>
                    <span className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${isCompleted ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    {exp.status}
                </div>
            </div>
        </motion.div>
    </div>
  );
};

export default function ExperienceSection({ section, content }) {
  const containerRef = useRef(null);
  const experiences = content?.experience || [];
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024); // Use 1024 as safer 'Bigger Screen' threshold

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const sortedExperiences = [...experiences].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const planeY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title} panelInfo={section?.panelInfo}>
      <div ref={containerRef} className="relative mt-20 min-h-[600px] px-4 md:px-0">
        
        {/* THE LINE */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--accent)]/5 via-[var(--accent)]/20 to-[var(--accent)]/5 md:-translate-x-1/2">
            <motion.div 
                style={{ height: smoothProgress }}
                className="w-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" 
            />
        </div>

        {/* THE AIRPLANE */}
        <motion.div
            style={{ 
              top: planeY, 
              left: isMobile ? '1.5rem' : '50%', // Aligned with the 1.5rem left (left-6)
              x: '-50%' 
            }}
            className="absolute z-[20] pointer-events-none"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-[var(--accent)] blur-xl opacity-30 md:opacity-50 scale-150" />
                <div className="relative bg-[var(--surface)] border border-[var(--accent)] p-2 md:p-3 rounded-full shadow-[0_0_20px_var(--accent)]">
                    <Plane className="w-4 md:w-5 h-4 md:h-5 text-[var(--accent)] rotate-90" />
                </div>
                <motion.div 
                    animate={{ y: [-10, 10], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -right-6 md:-right-8 -top-3 md:-top-4"
                >
                    <Mail className="w-3 md:w-4 h-3 md:h-4 text-[var(--accent)]/40" />
                </motion.div>
            </div>
        </motion.div>

        {/* CARDS CONTAINER */}
        <div className="flex flex-col w-full relative z-[10] md:pt-10 max-w-6xl mx-auto">
          {sortedExperiences.map((exp, idx) => (
            <ExperienceCard 
                key={idx} 
                exp={exp} 
                index={idx} 
                scrollYProgress={scrollYProgress} 
                isMobile={isMobile}
            />
          ))}
        </div>

      </div>
    </SectionShell>
  );
}
