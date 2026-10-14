import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Clock, Copy, Github, Instagram, Linkedin, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';

export default function UnderPolishing({ config = {} }) {
  const durationHours = Number(config.durationHours) || 36;
  const startedAt = config.startedAt ? Number(config.startedAt) : 1726500000000;
  const [timeLeft, setTimeLeft] = useState({ hours: durationHours, minutes: 0, seconds: 0, progress: 0 });
  const [copied, setCopied] = useState(false);
  const email = config.email || 'kushalsaialeti98@gmail.com';
  const links = {
    github: config.github || 'https://github.com/kushalsaialeti',
    linkedin: config.linkedin || 'https://www.linkedin.com/in/kushalsaialeti/',
    instagram: config.instagram || 'https://www.instagram.com/_.kushal._.sai._.aleti._/',
  };

  useEffect(() => {
    const cycleMs = durationHours * 60 * 60 * 1000;
    const update = () => {
      const elapsed = Math.max(0, Date.now() - startedAt) % cycleMs;
      const total = Math.max(0, Math.floor((cycleMs - elapsed) / 1000));
      setTimeLeft({
        hours: Math.floor(total / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
        progress: (elapsed / cycleMs) * 100,
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [durationHours, startedAt]);

  const copyEmail = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const socials = [
    { label: 'GitHub', value: '@kushalsaialeti', icon: Github, href: links.github },
    { label: 'LinkedIn', value: 'in/kushalsaialeti', icon: Linkedin, href: links.linkedin },
    { label: 'Instagram', value: '@_.kushal._.sai._.aleti._', icon: Instagram, href: links.instagram },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg-base)] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.09),transparent_36%)]" />
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-white" /><span className="text-xs font-black uppercase tracking-[0.25em]">Kushal Sai Aleti</span></div>
        <span className="rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Under polishing</span>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:px-10 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 sm:p-10">
            <div>
              <div className="mb-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500"><Clock className="h-4 w-4 text-white" /> Design update in progress</div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-zinc-500">{config.subtitle || 'Portfolio Under Polishing'}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-7xl">{config.title || 'Crafting Something Extraordinary'}</h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-zinc-400">{config.message || 'I am currently polishing and elevating the portfolio experience with fresh design systems, refined micro-interactions, and new product case studies.'}</p>
            </div>
            <div className="mt-16 flex flex-wrap gap-3"><a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:bg-zinc-200"><Mail className="h-4 w-4" /> Send email</a><button type="button" onClick={copyEmail} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:border-white/40 hover:text-white">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy email'}</button></div>
          </motion.section>

          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Estimated update timer</span><span className="text-xs font-bold text-white">{durationHours}h cycle</span></div>
            <div className="mt-8 grid grid-cols-3 gap-3">{[['hours', timeLeft.hours], ['minutes', timeLeft.minutes], ['seconds', timeLeft.seconds]].map(([label, value]) => <div key={label}><div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-3xl font-black tracking-[-0.06em] sm:text-5xl">{String(value).padStart(2, '0')}</div><p className="mt-3 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p></div>)}</div>
            <div className="mt-10"><div className="mb-2 flex justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500"><span>Cycle elapsed</span><span>{timeLeft.progress.toFixed(1)}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${timeLeft.progress}%` }} /></div></div>
            <div className="mt-10 space-y-3">{socials.map(({ label, value, icon: Icon, href }) => href && <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/35"><span className="flex items-center gap-3"><Icon className="h-4 w-4 text-white" /><span><span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</span><span className="block text-xs text-zinc-300">{value}</span></span></span><ArrowUpRight className="h-4 w-4 text-zinc-600" /></a>)}</div>
          </GlassCard>
        </div>
        <footer className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600"><span>© 2026 Kushal Sai Aleti</span><Link to="/admin-portal-1622" className="inline-flex items-center gap-2 hover:text-white"><Lock className="h-3 w-3" /> Admin</Link></footer>
      </div>
    </main>
  );
}
