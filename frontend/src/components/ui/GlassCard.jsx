export default function GlassCard({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[var(--shadow-md)] backdrop-blur-xl ${className}`}>
      {children}
    </Tag>
  );
}
