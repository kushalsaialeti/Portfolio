import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DockButton = ({ children, onClick, className = "" }) => {
  const mouseX = useMotionValue(Infinity);
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scale = useSpring(useTransform(distance, [-150, 0, 150], [1, 1.4, 1]), {
    stiffness: 400,
    damping: 30,
  });

  return (
    <motion.button
      ref={ref}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      onClick={onClick}
      style={{ scale }}
      className={`px-8 py-4 rounded-full bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-black hover:text-white border border-white transition-colors duration-300 origin-center ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default DockButton;
