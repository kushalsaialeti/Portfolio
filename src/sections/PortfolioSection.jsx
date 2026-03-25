import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// Magnified Box Component (Vertical MacBook Dock Style with Expansion)
const MagnifiedBox = ({ sub, itemTitle, mouseY, sectionIcon: SectionIcon }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - (bounds.y + bounds.height / 2);
  });

  const scale = useSpring(useTransform(distance, [-150, 0, 150], [1, 1.05, 1]), {
    stiffness: 400,
    damping: 30,
  });

  // Extract info for the card
  const titleText = typeof sub.value === 'object' 
    ? (sub.value?.company || sub.value?.degree || sub.value?.name || sub.value?.label || "Entry") 
    : (sub.value || sub.key || "System Segment");

  const detailText = typeof sub.value === 'object'
    ? (sub.value?.role || sub.value?.institution || sub.value?.description || sub.value?.value || "")
    : "";

  return (
    <motion.div 
       ref={ref}
       style={{ scale }}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       className="w-full max-w-[500px] rounded-[30px] bg-white/[0.03] border border-white/5 backdrop-blur-3xl flex items-stretch transition-all duration-500 cursor-default shadow-2xl overflow-hidden hover:bg-white/[0.08] hover:border-[#27c93f]/20"
    >
       {/* LEFT PORTION: Icon/Logo Placeholder */}
       <div className="w-[80px] md:w-[100px] flex-shrink-0 bg-white/[0.02] flex items-center justify-center border-r border-white/5 p-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-[#27c93f]/40 transition-colors">
             <SectionIcon className="w-6 h-6 md:w-8 md:h-8 text-[#27c93f]/60" />
          </div>
       </div>

       {/* RIGHT PORTION: Content */}
       <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-2">
          <div className="flex justify-between items-center w-full mb-1">
             <span className="text-[9px] font-black tracking-[0.3em] text-[#444] uppercase">{itemTitle}</span>
             <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isHovered ? 'bg-[#27c93f] shadow-[0_0_8px_#27c93f]' : 'bg-[#222]'}`} />
          </div>
          
          <h4 className="text-sm md:text-lg font-black text-white/90 uppercase tracking-tight leading-snug line-clamp-2">
             {titleText}
          </h4>

          <AnimatePresence>
             {isHovered && detailText && (
                <motion.p 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 0.6 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="text-[11px] md:text-[13px] font-medium text-[#A1A1A6] leading-relaxed mt-2 overflow-hidden"
                >
                   {detailText}
                </motion.p>
             )}
          </AnimatePresence>
       </div>
    </motion.div>
  );
};

const PortfolioSection = ({ item, i, setActiveId }) => {
  const Icon = item.icon;
  const mouseY = useMotionValue(Infinity);

  const subItems = Array.isArray(item.content) 
     ? item.content.map(v => ({ value: v }))
     : typeof item.content === 'object' 
        ? Object.entries(item.content).map(([k, v]) => ({ key: k, value: v })) 
        : [{ label: "Explore", value: item.content }];

  return (
     <article 
        className="relative w-full h-full flex items-center justify-center py-6 bg-black overflow-hidden"
     >
        <style>{`
          .custom-scrollbar-black::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar-black::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar-black::-webkit-scrollbar-thumb {
            background: #111;
            border-radius: 10px;
          }
          .custom-scrollbar-black::-webkit-scrollbar-thumb:hover {
            background: #222;
          }
        `}</style>
        
        <div 
           className="relative w-[96vw] h-[88vh] rounded-[70px] overflow-hidden bg-[#070708] border border-white/5 flex flex-col lg:flex-row shadow-[0_45px_130px_rgba(0,0,0,1)] transition-all duration-1000 group/card hover:bg-[#09090A]"
        >
           {/* LEFT SIDE: Identity Area (Compact on Mobile Only) */}
           <div className="w-full lg:w-[42%] h-auto lg:h-full p-8 lg:p-24 flex flex-col justify-center lg:justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent z-10">
              <div className="space-y-6 lg:space-y-12 mb-8 lg:mb-0">
                 <div className="flex gap-4 lg:gap-6 items-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-[#27c93f]/5 flex items-center justify-center border border-[#27c93f]/10 shadow-inner">
                       <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-[#27c93f]/80" />
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase text-white leading-none">
                       {item.id === 'about' ? 'BIO' : item.title}
                    </h3>
                 </div>
                 
                 <div className="space-y-3 lg:space-y-6">
                    <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.5em] lg:tracking-[0.8em] text-[#222]">Section Index 0{i+1}</span>
                    <p className="text-base lg:text-xl text-[#666] font-medium leading-relaxed tracking-tight max-w-sm group-hover/card:text-[#888] transition-colors">
                       {item.description || `Engineering professional standards in ${item.title.toLowerCase()} development.`}
                    </p>
                 </div>
              </div>

              <div className="space-y-6 lg:space-y-10 pb-2 lg:pb-4">
                 <div className="hidden lg:block h-[1px] w-20 bg-[#27c93f]/20" />
                 <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveId(item.id)}
                    className="w-full lg:w-auto px-10 lg:px-16 py-4 lg:py-6 rounded-full bg-white text-black font-black uppercase text-[10px] lg:text-[11px] tracking-[0.4em] lg:tracking-[0.5em] transition-all"
                 >
                    Full Experience
                 </motion.button>
              </div>
           </div>

           {/* RIGHT SIDE: Vertical Stack Content (Independent Scroll only on Desktop) */}
           <div 
             onMouseMove={(e) => mouseY.set(e.pageY)}
             onMouseLeave={() => mouseY.set(Infinity)}
             className="flex-1 h-full p-6 lg:p-20 lg:overflow-y-auto overflow-y-hidden custom-scrollbar-black z-0 flex flex-col gap-6" 
             data-lenis-prevent={typeof window !== 'undefined' && window.innerWidth > 768 ? true : undefined}
           >
              <div className="flex flex-col gap-6 items-center md:items-start pl-0 md:pl-10">
                 {subItems.map((sub, j) => (
                    <MagnifiedBox 
                       key={j} 
                       sub={sub} 
                       itemTitle={item.title} 
                       mouseY={mouseY} 
                       sectionIcon={Icon}
                    />
                 ))}
                 
                 <div className="w-full max-w-[500px] mt-10 p-16 opacity-10 border border-dashed border-white/20 rounded-[40px] flex items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-black tracking-[1em] text-white/50">End of View</span>
                 </div>
              </div>
           </div>
        </div>
     </article>
  );
};

export default PortfolioSection;
