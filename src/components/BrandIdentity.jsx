import React from 'react';
import { motion } from 'framer-motion';

export default function BrandIdentity({ profile, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-8 left-8 z-[200] flex items-center gap-4 cursor-pointer group"
      onClick={() => onNavigate?.('home')}
    >
      <div className="relative h-10 w-10 flex-shrink-0">
         <div className="absolute inset-0 rounded-full bg-[#27c93f]/20 blur-md group-hover:bg-[#27c93f]/40 transition-colors" />
         <img 
            src="/images/portrait.png" 
            alt={profile?.name || "Kushal Sai Aleti"} 
            className="relative h-full w-full rounded-full object-cover border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-500"
         />
      </div>
      
      <div className="flex flex-col">
         <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white group-hover:text-[#27c93f] transition-colors">
            {profile?.name || "Kushal Sai Aleti"}
         </span>
      </div>
    </motion.div>
  );
}
