import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

const ControlItem = ({ item, isSelected, isExpanded, onClick, onHoverStart, onHoverEnd }) => {

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => onHoverStart(item.id)}
      onMouseLeave={onHoverEnd}
    >
      <motion.button
        type="button"
        onFocus={() => onHoverStart(item.id)}
        onBlur={onHoverEnd}
        onClick={(event) => onClick(item.id, event)}
        whileTap={{ scale: 0.98 }}
        className={`group inline-flex w-auto items-center gap-3 rounded-full border px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
          isSelected
            ? 'border-white/30 bg-white/[0.16] text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
            : 'border-white/10 bg-white/[0.04] text-[#dbdbe1] hover:border-white/25 hover:bg-white/[0.1]'
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full border transition-all duration-500 ${
            isSelected
              ? 'border-white/60 bg-[#27c93f] shadow-[0_0_12px_#27c93f]'
              : 'border-white/20 bg-white/[0.04] group-hover:border-[#27c93f]/40'
          }`}
        />
        <span className="leading-none">{item.navLabel}</span>
      </motion.button>

      {/* RE-IMAGINED HOVER BOX: Clickable info card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 20 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => onClick(item.id, event)}
            className="absolute top-full left-1/2 -translate-x-1/2 z-[200] cursor-pointer"
          >
            <div className="w-[260px] rounded-[24px] border border-white/15 bg-[#0a0a0a]/90 px-6 py-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] group/card hover:border-[#27c93f]/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#27c93f] opacity-80">{item.eyebrow}</p>
                <div className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight group-hover/card:text-[#27c93f] transition-colors">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#9ca0ab] font-medium">{item.panelInfo}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Click to Explore</span>
                <MoreHorizontal className="w-4 h-4 text-white/20 group-hover/card:text-white transition-colors" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LeftControlPanel = ({ activeId, setActiveId, show, items = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  if (!show) return null;

  // Filter out Home from the shared dock per user request
  const navItems = items.filter(item => item.id !== 'home');

  const handleSelect = (id, event) => {
    setActiveId(id, event);
    setMobileOpen(false);
  };

  return (
    <>
      {/* STATIC GLOBAL HEADER: Always Visible and Constant */}
      <div
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] hidden lg:block"
      >
        <div className="flex flex-row items-center gap-3 p-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-2xl">
          {navItems.map((item) => (
            <ControlItem
              key={item.id}
              item={item}
              isSelected={activeId === item.id}
              isExpanded={hoveredId === item.id}
              onClick={handleSelect}
              onHoverStart={setHoveredId}
              onHoverEnd={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>

      {/* MOBILE TRIGGER & DRAWER */}
      <div className="fixed right-6 top-6 z-[160] lg:hidden">
        <motion.button
          type="button"
          aria-label="Open navigation"
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-xl"
        >
          <MoreHorizontal className="h-5 w-5" />
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="mt-4 flex min-w-[240px] flex-col gap-2 rounded-[32px] border border-white/10 bg-[#0a0a0a]/95 p-4 backdrop-blur-2xl shadow-3xl"
            >
              {navItems.map((item) => (
                <ControlItem
                  key={item.id}
                  item={item}
                  isSelected={activeId === item.id}
                  isExpanded={false}
                  onClick={handleSelect}
                  onHoverStart={() => {}}
                  onHoverEnd={() => {}}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LeftControlPanel;
