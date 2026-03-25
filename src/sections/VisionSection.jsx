import React from 'react';

const VisionSection = () => {
  return (
    <section className="vision-area h-screen w-full flex items-center justify-center relative overflow-hidden bg-black py-40">
       <div className="vision-view absolute inset-0 flex items-center justify-center pointer-events-none p-10 z-0 opacity-40 brightness-75 transition-all duration-1000 scale-80">
          <img 
            src="/images/macbook_open.png" 
            className="max-w-[120vw] w-full h-auto object-contain" 
            alt="Product Vision" 
          />
       </div>
       <div className="relative z-10 text-center px-6 max-w-6xl space-y-12 animate-in fade-in duration-3000">
          <span className="text-[12px] font-black uppercase tracking-[1em] text-[#444] block mb-6 animate-pulse">Design Architecture</span>
          <h2 className="text-6xl md:text-[5vw] font-black tracking-tighter leading-[0.85] uppercase text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.12)]">
             Engineered <br/> with Precision.
          </h2>
          <div className="h-[2px] w-24 bg-white/20 mx-auto mt-12" />
          <p className="text-[#A1A1A6] text-[10px] md:text-sm font-black tracking-[0.6em] uppercase opacity-60">High-fidelity interactive experiences.</p>
       </div>
       
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[80vh] bg-white/[0.04] blur-[220px] pointer-events-none" />
    </section>
  );
};

export default VisionSection;
