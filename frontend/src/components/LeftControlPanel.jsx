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
            ? 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-md)]'
            : 'border-[var(--border)] bg-[var(--bg-secondary)]/40 text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/30 hover:bg-[var(--surface)]'
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full border transition-all duration-500 ${
            isSelected
              ? 'border-[var(--text-primary)]/20 bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]'
              : 'border-[var(--border)] bg-[var(--bg-secondary)] group-hover:border-[var(--accent)]/40'
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
            <div className="w-[260px] rounded-[24px] border border-[var(--border)] bg-[var(--glass-bg)] px-6 py-5 backdrop-blur-2xl shadow-[var(--shadow-lg)] group/card hover:border-[var(--accent)]/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[var(--accent)] opacity-80">{item.eyebrow}</p>
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              </div>
              <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight group-hover/card:text-[var(--accent)] transition-colors">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] font-medium">{item.panelInfo}</p>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]/30">Click to Explore</span>
                <MoreHorizontal className="w-4 h-4 text-[var(--text-secondary)]/30 group-hover/card:text-[var(--text-primary)] transition-colors" />
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

  // Filter out Home and any hidden sections from the shared dock
  const navItems = items.filter(item => item.id !== 'home' && item.isVisible !== false);

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
        <div className="flex flex-row items-center gap-3 p-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--border)] backdrop-blur-3xl shadow-[var(--shadow-lg)]">
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
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text-primary)] backdrop-blur-xl shadow-[var(--shadow-md)]"
        >
          <MoreHorizontal className="h-5 w-5" />
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="mt-4 flex min-w-[240px] flex-col gap-2 rounded-[32px] border border-[var(--border)] bg-[var(--glass-bg)] p-4 backdrop-blur-2xl shadow-[var(--shadow-lg)]"
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
