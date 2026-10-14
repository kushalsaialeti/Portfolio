export default function MonoButton({ as: Tag = 'button', variant = 'solid', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';
  const variants = {
    solid: 'bg-white text-black hover:bg-zinc-200 hover:-translate-y-0.5',
    outline: 'border border-white/15 bg-white/[0.03] text-white hover:border-white/40 hover:bg-white/[0.08] hover:-translate-y-0.5',
    ghost: 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
  };
  return <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</Tag>;
}
