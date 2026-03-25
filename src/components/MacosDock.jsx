import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PORTFOLIO_DATA } from '../constants/portfolio';

const DockIcon = ({ icon: Icon, id, label, onClick, isActive }) => {
  const ref = useRef(null);
  const distance = useMotionValue(Infinity);
  
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => distance.set(e.pageX - ref.current.getBoundingClientRect().x - ref.current.getBoundingClientRect().width / 2)}
      onMouseLeave={() => distance.set(Infinity)}
      onClick={() => onClick(id)}
      style={{ width }}
      className={`
        aspect-square rounded-[18px] flex items-center justify-center 
        transition-colors cursor-pointer relative group
        ${isActive ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}
      `}
    >
      <Icon className="w-1/2 h-1/2 text-white" />
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1d1d1f] border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-md">
        {label}
      </div>

      {isActive && (
        <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />
      )}
    </motion.div>
  );
};

const MacosDock = ({ activeId, setActiveId }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
      <div className="flex items-end gap-3 px-3 py-3 rounded-[24px] bg-[#1d1d1f]/40 backdrop-blur-20 border border-white/10 shadow-2xl">
        {PORTFOLIO_DATA.map((item) => (
          <DockIcon 
            key={item.id} 
            {...item} 
            onClick={setActiveId}
            isActive={activeId === item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MacosDock;
