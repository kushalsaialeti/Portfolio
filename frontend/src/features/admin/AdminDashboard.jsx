import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { ArrowUpRight, BarChart3, BriefcaseBusiness, ChevronRight, FileText, FolderCog, Gauge, LayoutDashboard, LogOut, Mail, Menu, RefreshCw, Settings, Sparkles, UserRound, X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CmsContext } from '../../cms/CmsContext';

const EssentialContentEditor = lazy(() => import('./editors/EssentialContentEditor'));
const HomeEditor = lazy(() => import('./editors/HomeEditor'));
const AboutEditor = lazy(() => import('./editors/AboutEditor'));
const LayoutEditor = lazy(() => import('./editors/LayoutEditor'));
const ContactEditor = lazy(() => import('./editors/ContactEditor'));
const ProjectsEditor = lazy(() => import('./editors/ProjectsEditor'));
const SkillsEditor = lazy(() => import('./editors/SkillsEditor'));
const InquiryManager = lazy(() => import('./editors/InquiryManager'));
const PolishingEditor = lazy(() => import('./editors/PolishingEditor'));
const AnalyticsPanel = lazy(() => import('./AnalyticsPanel'));

const navGroups = [
  { id: 'workspace', label: 'Workspace', items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'content', label: 'Content', icon: FileText }, { id: 'projects', label: 'Projects', icon: BriefcaseBusiness }, { id: 'skills', label: 'Skills', icon: Sparkles }] },
  { id: 'signals', label: 'Signals', items: [{ id: 'inquiries', label: 'Inquiries', icon: Mail }, { id: 'analytics', label: 'Analytics', icon: BarChart3 }] },
  { id: 'system', label: 'System', items: [{ id: 'settings', label: 'Settings', icon: Settings }] },
];

const contentLinks = [
  { id: 'content', label: 'Essentials' },
  { id: 'profile', label: 'Profile & media' },
  { id: 'story', label: 'About story' },
  { id: 'layout', label: 'Layout & order' },
  { id: 'contact', label: 'Contact form' },
];

function LoadingEditor() {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-sm text-white/55" role="status"><RefreshCw className="h-4 w-4 animate-spin text-[#27c93f]" /> Loading editor…</div>;
}

function SettingsPanel({ onNavigate, polishingActive, onRestoreBaseline, onSaveBaseline, baselineBusy, baselineMessage }) {
  const launchLabel = polishingActive === null ? 'checking' : polishingActive ? 'under polishing' : 'live';
  const launchTone = polishingActive === null ? 'text-white/45' : polishingActive ? 'text-amber-300' : 'text-[#8af59a]';
  return <div className="space-y-6 pb-16"><header className="border-b border-white/10 pb-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27c93f]">Settings</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Workspace controls</h2><p className="mt-2 text-sm text-white/55">Advanced controls stay available without crowding everyday content work.</p></header><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h3 className="font-semibold text-white">Advanced editors</h3><p className="mt-1 text-sm text-white/50">Open the full editors only when you need detailed media, layout, contact, or launch controls.</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => onNavigate('profile')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#27c93f]" /> Profile & media</span><ChevronRight className="h-4 w-4 text-white/35" /></button><button type="button" onClick={() => onNavigate('layout')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span className="flex items-center gap-2"><FolderCog className="h-4 w-4 text-[#27c93f]" /> Layout & order</span><ChevronRight className="h-4 w-4 text-white/35" /></button><button type="button" onClick={() => onNavigate('contact')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#27c93f]" /> Contact form copy</span><ChevronRight className="h-4 w-4 text-white/35" /></button><button type="button" onClick={() => onNavigate('polishing')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#27c93f]" /> Launch & polishing</span><ChevronRight className="h-4 w-4 text-white/35" /></button></div></section><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h3 className="font-semibold text-white">Launch state</h3><p className="mt-1 text-sm text-white/50">The public site is currently <span className={launchTone}>{launchLabel}</span>.</p></div><button type="button" onClick={() => onNavigate('polishing')} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10">Open launch settings</button></div></section><section className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-5"><h3 className="font-semibold text-white">Baseline tools</h3><p className="mt-1 max-w-2xl text-sm text-white/55">Baseline operations can replace or snapshot CMS content. They are intentionally kept behind this confirmed settings area.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onSaveBaseline} disabled={baselineBusy} className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 disabled:opacity-50">{baselineBusy ? 'Working…' : 'Save current as baseline'}</button><button type="button" onClick={onRestoreBaseline} disabled={baselineBusy} className="rounded-xl border border-amber-400/30 px-3.5 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-400/10 disabled:opacity-50">{baselineBusy ? 'Working…' : 'Restore stored baseline'}</button></div>{baselineMessage.text && <p className={`mt-3 rounded-xl border p-3 text-sm ${baselineMessage.type === 'success' ? 'border-[#27c93f]/30 bg-[#27c93f]/10 text-[#8af59a]' : 'border-red-400/30 bg-red-500/10 text-red-200'}`} role="status">{baselineMessage.text}</p>}</section></div>;
}

function Overview({ sections, onNavigate }) {
  const sectionIds = ['home', 'about', 'projects', 'skills', 'contact', 'layout'];
  const loadedCount = sectionIds.filter((id) => sections[id]).length;
  const projectCount = sections.projects?.projects?.length;
  const serviceCount = sections.home?.profile?.services?.length;
  const polishingActive = sections.polishing ? sections.polishing.isPolishingMode !== false : null;
  const publicState = polishingActive === null ? 'Checking…' : polishingActive ? 'Under polishing' : 'Live';
  return <div className="space-y-6 pb-16"><header className="border-b border-white/10 pb-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27c93f]">Overview</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Good to see you</h2><p className="mt-2 max-w-2xl text-sm text-white/55">A calm place to keep your public portfolio current.</p></header><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">CMS sections loaded</p><p className="mt-3 text-2xl font-semibold text-white">{loadedCount}<span className="text-base font-normal text-white/35"> / {sectionIds.length}</span></p></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Projects</p><p className="mt-3 text-2xl font-semibold text-white">{projectCount ?? '—'}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Services</p><p className="mt-3 text-2xl font-semibold text-white">{serviceCount ?? '—'}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Public state</p><p className={`mt-3 text-sm font-semibold ${polishingActive === null ? 'text-white/45' : polishingActive ? 'text-amber-300' : 'text-[#8af59a]'}`}>{publicState}</p></div></section><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-white">Quick links</h3><p className="mt-1 text-sm text-white/50">Jump straight to the changes people notice first.</p></div><Gauge className="h-5 w-5 text-[#27c93f]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => onNavigate('content')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span>Edit profile and services</span><ChevronRight className="h-4 w-4 text-white/35" /></button><button type="button" onClick={() => onNavigate('projects')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span>Update selected work</span><ChevronRight className="h-4 w-4 text-white/35" /></button><button type="button" onClick={() => onNavigate('skills')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span>Refresh your skills</span><ChevronRight className="h-4 w-4 text-white/35" /></button><button type="button" onClick={() => onNavigate('analytics')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10"><span>Review real activity</span><ChevronRight className="h-4 w-4 text-white/35" /></button></div></section><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h3 className="font-semibold text-white">Section status</h3><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{sectionIds.map((id) => <div key={id} className="flex items-center justify-between rounded-xl bg-black/10 px-3 py-2.5 text-sm"><span className="capitalize text-white/70">{id}</span><span className={`text-xs font-semibold ${sections[id] ? 'text-[#8af59a]' : 'text-white/35'}`}>{sections[id] ? 'Ready' : 'Not loaded'}</span></div>)}</div></section></div>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { sections, fetchSection, loading, seedBaseline, saveBaseline, logout } = useContext(CmsContext);
  const [active, setActive] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [baselineBusy, setBaselineBusy] = useState(false);
  const [baselineMessage, setBaselineMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    ['home', 'about', 'projects', 'skills', 'contact', 'layout', 'polishing'].forEach((slug) => fetchSection(slug));
  }, [fetchSection]);
  useEffect(() => { const handler = (event) => setDirty(Boolean(event.detail?.dirty)); window.addEventListener('admin:dirty', handler); return () => window.removeEventListener('admin:dirty', handler); }, []);

  const select = (next) => {
    if (next === active) { setMobileOpen(false); return; }
    if (dirty && !window.confirm('You have unsaved changes. Leave this editor?')) return;
    setActive(next); setMobileOpen(false);
  };
  const openLiveSite = () => window.open(`${window.location.origin}/`, '_blank', 'noopener,noreferrer');
  const baselineAction = async (action) => {
    const prompt = action === 'restore' ? 'Restore the stored baseline and replace current CMS content?' : 'Save current CMS content as the stored baseline?';
    if (!window.confirm(prompt)) return;
    setBaselineBusy(true);
    setBaselineMessage({ type: '', text: '' });
    try { if (action === 'restore') await seedBaseline(); else await saveBaseline(); setBaselineMessage({ type: 'success', text: action === 'restore' ? 'Stored baseline restored.' : 'Current content saved as the baseline.' }); } catch { setBaselineMessage({ type: 'error', text: 'Baseline operation failed. Try again.' }); } finally { setBaselineBusy(false); }
  };
  const signOut = async () => { try { await logout(); } finally { navigate('/admin-portal-1622'); } };

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3 bg-[#0c0d14] text-sm text-white/60"><RefreshCw className="h-4 w-4 animate-spin text-[#27c93f]" /> Connecting to CMS…</div>;

  const polishingActive = sections.polishing ? sections.polishing.isPolishingMode !== false : null;
  const renderActive = () => {
    if (active === 'overview') return <Overview sections={sections} onNavigate={select} />;
    if (active === 'content') return <EssentialContentEditor onNavigate={select} />;
    if (active === 'profile') return <HomeEditor />;
    if (active === 'story') return <AboutEditor />;
    if (active === 'layout') return <LayoutEditor />;
    if (active === 'contact') return <ContactEditor />;
    if (active === 'projects') return <ProjectsEditor />;
    if (active === 'skills') return <SkillsEditor />;
    if (active === 'inquiries') return <InquiryManager />;
    if (active === 'analytics') return <AnalyticsPanel />;
    if (active === 'polishing') return <PolishingEditor />;
    return <SettingsPanel onNavigate={select} polishingActive={polishingActive} onRestoreBaseline={() => baselineAction('restore')} onSaveBaseline={() => baselineAction('save')} baselineBusy={baselineBusy} baselineMessage={baselineMessage} />;
  };
  const launchHeaderLabel = polishingActive === null ? 'Checking' : polishingActive ? 'Under polishing' : 'Live';
  const launchHeaderTone = polishingActive === null ? 'border-white/15 text-white/45' : polishingActive ? 'border-amber-400/20 text-amber-200' : 'border-[#27c93f]/25 text-[#8af59a]';
  const launchDotTone = polishingActive === null ? 'bg-white/35' : polishingActive ? 'bg-amber-300' : 'bg-[#27c93f]';

  return <main className="min-h-screen bg-[#0c0d14] font-sans text-white antialiased"><header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0d14]/95 backdrop-blur-xl"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6"><div className="flex items-center gap-3"><button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-xl border border-white/10 p-2 text-white/70 lg:hidden" aria-label="Toggle navigation">{mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#27c93f] text-black"><Sparkles className="h-4 w-4 fill-current" /></div><div><h1 className="text-sm font-semibold tracking-tight text-white">Portfolio workspace</h1><p className="hidden text-[11px] text-white/40 sm:block">Content, projects, and signals</p></div></div><div className="flex items-center gap-2"><span className={`hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold sm:flex ${launchHeaderTone}`}><span className={`h-1.5 w-1.5 rounded-full ${launchDotTone}`} />{launchHeaderLabel}</span><button type="button" onClick={openLiveSite} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"><ArrowUpRight className="h-3.5 w-3.5" /> Live site</button><button type="button" onClick={signOut} className="rounded-xl border border-white/10 p-2 text-white/60 hover:bg-red-500/10 hover:text-red-200" aria-label="Sign out"><LogOut className="h-4 w-4" /></button></div></div></header><div className="mx-auto flex max-w-[1440px]"><aside className={`${mobileOpen ? 'block' : 'hidden'} fixed inset-x-0 top-[61px] z-30 border-b border-white/10 bg-[#0c0d14] p-3 lg:static lg:block lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:bg-transparent lg:p-5`}><nav className="space-y-5" aria-label="Admin navigation">{navGroups.map((group) => <div key={group.id}><p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">{group.label}</p><div className="mt-2 space-y-1">{group.items.map((item) => { const Icon = item.icon; const selected = active === item.id || (item.id === 'content' && ['profile', 'story', 'layout', 'contact'].includes(active)); return <button key={item.id} type="button" onClick={() => select(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${selected ? 'bg-[#27c93f]/12 text-[#8af59a]' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon className="h-4 w-4" />{item.label}{item.id === 'content' && <ChevronRight className={`ml-auto h-3.5 w-3.5 transition ${selected ? 'rotate-90' : ''}`} />}</button>})}</div>{group.id === 'workspace' && (active === 'content' || ['profile', 'story', 'layout', 'contact'].includes(active)) && <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">{contentLinks.slice(1).map((link) => <button key={link.id} type="button" onClick={() => select(link.id)} className={`w-full rounded-lg px-2.5 py-2 text-left text-xs ${active === link.id ? 'text-[#8af59a]' : 'text-white/40 hover:text-white/75'}`}>{link.label}</button>)}</div>}</div>)}</nav></aside><section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-5xl"><Suspense fallback={<LoadingEditor />}>{renderActive()}</Suspense></div></section></div></main>;
}
