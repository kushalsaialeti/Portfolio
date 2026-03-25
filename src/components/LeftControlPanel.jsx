import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PORTFOLIO_DATA } from '../constants/portfolio';

const ControlItem = ({ id, label, icon: Icon, isActive, onClick }) => {
  return (
    <div className="w-full relative group">
      <motion.button
        onClick={() => onClick(id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-12 h-12 flex items-center justify-center rounded-full transition-all 
          ${isActive ? 'bg-white text-black shadow-xl shadow-white/30' : 'bg-white/10 text-white hover:bg-white/15'}
        `}
      >
        <Icon className="w-5 h-5" />
      </motion.button>
      
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="absolute left-16 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 whitespace-nowrap overflow-hidden"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-white">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LeftControlPanel = ({ activeId, setActiveId, show }) => {
  if (!show) return null;

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[101] hidden lg:block"
    >
      <div className="flex flex-col gap-4 p-3 bg-white/5 backdrop-blur-20 border border-white/10 rounded-full shadow-2xl">
        {PORTFOLIO_DATA.map((item) => (
          <ControlItem 
            key={item.id} 
            {...item} 
            isActive={activeId === item.id}
            onClick={setActiveId}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LeftControlPanel;
