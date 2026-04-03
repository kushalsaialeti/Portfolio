import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Plane, Mail, Calendar, Briefcase, MapPin } from 'lucide-react';
import SectionShell from '../components/SectionShell';

const ExperienceCard = ({ exp, index, scrollYProgress }) => {
  const cardRef = useRef(null);
  
  // Track this specific card's progress within the viewport
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Animation for the card appearing
  const opacity = useTransform(cardProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const x = useTransform(
    cardProgress, 
    [0, 0.2], 
    [index % 2 === 0 ? -50 : 50, 0]
  );

  // Transition color based on scroll progress ("scrolling away up")
  // We want it to turn red/green when it's passed the middle of the screen
  const isCompleted = exp.status === 'completed';
  const targetColor = isCompleted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
  const borderTarget = isCompleted ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)';
  
  const backgroundColor = useTransform(
    cardProgress,
    [0.4, 0.6],
    ['var(--cards)', targetColor]
  );

  const borderColor = useTransform(
    cardProgress,
    [0.4, 0.6],
    ['var(--border)', borderTarget]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, x, backgroundColor, borderColor }}
      className={`relative w-[calc(100%-48px)] md:w-[45%] p-6 md:p-8 rounded-[32px] border backdrop-blur-xl shadow-xl mb-12 flex flex-col ${index % 2 === 0 ? 'md:self-start' : 'md:self-end'} self-end group transition-all duration-700`}
    >
      {/* Date Badge */}
      {/* Date & Status Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
            {exp.startDate} — {exp.endDate || 'Present'}
          </span>
        </div>

        {/* Status Indicator */}
        <div className={`w-fit flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${isCompleted ? 'border-red-500/20 text-red-500' : 'border-green-500/20 text-green-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
            {exp.status}
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {exp.image?.url && (
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0">
                <img src={exp.image.url} alt={exp.company} className="w-full h-full object-cover" />
            </div>
        )}
        <div className="flex-grow">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {exp.role}
            </h3>
            <p className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mt-1">{exp.company}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        {exp.description}
      </p>

      {/* (Status Indicator moved to top row) */}
    </motion.div>
  );
};

export default function ExperienceSection({ section, content }) {
  const containerRef = useRef(null);
  const experiences = content?.experience || [];
  
  // Sort chronically (oldest first as per request)
  const sortedExperiences = [...experiences].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Airplane movement
  const planeY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const planeRotate = useTransform(smoothProgress, [0, 0.05, 0.95, 1], [0, 0, 0, 0]); // Keep it straight for now

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title} panelInfo={section?.panelInfo}>
      <div ref={containerRef} className="relative mt-20 min-h-[600px] px-4 md:px-0">
        
        {/* THE LINE */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--accent)]/10 via-[var(--accent)]/30 to-[var(--accent)]/10 md:-translate-x-1/2 overflow-hidden">
            {/* PROGRESS LINE */}
            <motion.div 
                style={{ height: smoothProgress }}
                className="w-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" 
            />
        </div>

        {/* THE AIRPLANE */}
        <motion.div
            style={{ top: planeY, left: 'calc(50%)', x: '-50%' }}
            className="absolute z-20 hidden md:flex items-center justify-center"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-[var(--accent)] blur-xl opacity-50 scale-150" />
                <div className="relative bg-[var(--surface)] border border-[var(--accent)] p-3 rounded-full shadow-2xl">
                    <Plane className="w-5 h-5 text-[var(--accent)] rotate-90" />
                </div>
                {/* Email Letters decoration */}
                <motion.div 
                    animate={{ y: [-10, 10], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -right-8 -top-4"
                >
                    <Mail className="w-4 h-4 text-[var(--accent)]/40" />
                </motion.div>
            </div>
        </motion.div>

        {/* CARDS CONTAINER */}
        <div className="flex flex-col relative z-10 md:pt-10 md:items-center">
          {sortedExperiences.map((exp, idx) => (
            <ExperienceCard 
                key={idx} 
                exp={exp} 
                index={idx} 
                scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>

      </div>
    </SectionShell>
  );
}
