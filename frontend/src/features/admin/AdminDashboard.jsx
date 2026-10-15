import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { BarChart3, BriefcaseBusiness, CheckCircle2, ChevronRight, Database, FileText, FolderCog, Gauge, LayoutDashboard, LogOut, Mail, Menu, RefreshCw, Settings, Sparkles, UserRound, X } from 'lucide-react';
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
const AnalyticsPanel = lazy(() => import('./AnalyticsPanel'));

const navGroups = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'content', label: 'Content', icon: FileText },
      { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
      { id: 'skills', label: 'Skills', icon: Sparkles },
    ],
  },
  {
    id: 'signals',
    label: 'Signals',
    items: [
      { id: 'inquiries', label: 'Inquiries', icon: Mail },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
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
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-sm text-white/55" role="status">
      <RefreshCw className="h-4 w-4 animate-spin text-[#27c93f]" /> Loading editor…
    </div>
  );
}

function SettingsPanel({ onNavigate, onRestoreBaseline, onSaveBaseline, baselineBusy, baselineMessage }) {
  return (
    <div className="space-y-6 pb-16">
      <header className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27c93f]">Settings</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Workspace controls</h2>
        <p className="mt-2 text-sm text-white/55">Advanced content tools stay available without adding launch switches.</p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-semibold text-white">Advanced editors</h3>
        <p className="mt-1 text-sm text-white/50">Open detailed media, layout, or contact controls only when you need them.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ['profile', 'Profile & media', UserRound],
            ['layout', 'Layout & order', FolderCog],
            ['contact', 'Contact form copy', Mail],
          ].map(([id, label, Icon]) => (
            <button key={id} type="button" onClick={() => onNavigate(id)} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10">
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#27c93f]" /> {label}</span>
              <ChevronRight className="h-4 w-4 text-white/35" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#27c93f]" />
          <div>
            <h3 className="font-semibold text-white">Public portfolio</h3>
            <p className="mt-1 text-sm text-white/50">The public portfolio is always live. Content changes are published through the normal save actions.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 text-amber-300" />
          <div>
            <h3 className="font-semibold text-white">Baseline snapshots</h3>
            <p className="mt-1 text-sm text-white/55">Use these only when you intentionally want a restore point or a copy of the current CMS content.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onSaveBaseline} disabled={baselineBusy} className="rounded-xl border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 disabled:opacity-50">Save current baseline</button>
          <button type="button" onClick={onRestoreBaseline} disabled={baselineBusy} className="rounded-xl border border-amber-300/30 px-3.5 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-300/10 disabled:opacity-50">Restore stored baseline</button>
        </div>
        {baselineMessage.text && <p className={`mt-3 rounded-xl border p-3 text-sm ${baselineMessage.type === 'success' ? 'cms-success-message' : 'border-red-400/30 bg-red-500/10 text-red-200'}`} role="status">{baselineMessage.text}</p>}
      </section>
    </div>
  );
}

function Overview({ sections, onNavigate }) {
  const sectionIds = ['home', 'about', 'projects', 'skills', 'contact', 'layout'];
  const loadedCount = sectionIds.filter((id) => sections[id]).length;
  const projectCount = sections.projects?.projects?.length;
  const serviceCount = sections.home?.profile?.services?.length;

  return (
    <div className="space-y-6 pb-16">
      <header className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27c93f]">Overview</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Good to see you</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/55">A calm place to keep your permanently live portfolio current.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">CMS sections loaded</p><p className="mt-3 text-2xl font-semibold text-white">{loadedCount}<span className="text-base font-normal text-white/35"> / {sectionIds.length}</span></p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Projects</p><p className="mt-3 text-2xl font-semibold text-white">{projectCount ?? '—'}</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Services</p><p className="mt-3 text-2xl font-semibold text-white">{serviceCount ?? '—'}</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Public state</p><p className="mt-3 text-sm font-semibold text-[#8af59a]">Live</p></div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-white">Quick links</h3><p className="mt-1 text-sm text-white/50">Jump straight to the changes people notice first.</p></div><Gauge className="h-5 w-5 text-[#27c93f]" /></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => onNavigate('content')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10">Update your profile and services <ChevronRight className="h-4 w-4 text-white/35" /></button>
          <button type="button" onClick={() => onNavigate('projects')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10">Curate selected work <ChevronRight className="h-4 w-4 text-white/35" /></button>
          <button type="button" onClick={() => onNavigate('analytics')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10">Review visitor signals <ChevronRight className="h-4 w-4 text-white/35" /></button>
          <button type="button" onClick={() => onNavigate('inquiries')} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm text-white/75 hover:bg-white/10">Open inquiries <ChevronRight className="h-4 w-4 text-white/35" /></button>
        </div>
      </section>
    </div>
  );
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
    ['home', 'about', 'projects', 'skills', 'contact', 'layout'].forEach((slug) => fetchSection(slug));
  }, [fetchSection]);

  useEffect(() => {
    document.body.classList.add('admin-surface');
    return () => document.body.classList.remove('admin-surface');
  }, []);

  useEffect(() => {
    const handler = (event) => setDirty(Boolean(event.detail?.dirty));
    window.addEventListener('admin:dirty', handler);
    return () => window.removeEventListener('admin:dirty', handler);
  }, []);

  const select = (next) => {
    if (next === active) { setMobileOpen(false); return; }
    if (dirty && !window.confirm('You have unsaved changes. Leave this editor?')) return;
    setActive(next);
    setMobileOpen(false);
  };

  const baselineAction = async (action) => {
    const prompt = action === 'restore' ? 'Restore the stored baseline and replace current CMS content?' : 'Save current CMS content as the stored baseline?';
    if (!window.confirm(prompt)) return;
    setBaselineBusy(true);
    setBaselineMessage({ type: '', text: '' });
    try {
      if (action === 'restore') await seedBaseline();
      else await saveBaseline();
      setBaselineMessage({ type: 'success', text: action === 'restore' ? 'Stored baseline restored.' : 'Current content saved as the baseline.' });
    } catch {
      setBaselineMessage({ type: 'error', text: 'Baseline operation failed. Try again.' });
    } finally {
      setBaselineBusy(false);
    }
  };

  const signOut = async () => {
    try { await logout(); } finally { navigate('/admin-portal-1622'); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3 bg-[#0c0d14] text-sm text-white/60"><RefreshCw className="h-4 w-4 animate-spin text-[#27c93f]" /> Connecting to CMS…</div>;

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
    return <SettingsPanel onNavigate={select} onRestoreBaseline={() => baselineAction('restore')} onSaveBaseline={() => baselineAction('save')} baselineBusy={baselineBusy} baselineMessage={baselineMessage} />;
  };

  return (
    <main className="min-h-screen bg-[#0c0d14] font-sans text-white antialiased">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0d14]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3"><button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-xl border border-white/10 p-2 text-white/70 lg:hidden" aria-label="Toggle navigation">{mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#27c93f] text-black"><Sparkles className="h-4 w-4 fill-current" /></div><div><h1 className="text-sm font-semibold tracking-tight text-white">Portfolio workspace</h1><p className="hidden text-[11px] text-white/40 sm:block">Content, projects, and signals</p></div></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-lg border border-[#27c93f]/25 px-2.5 py-1.5 text-[11px] font-semibold text-[#8af59a] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />Live</span><button type="button" onClick={signOut} className="rounded-xl border border-white/10 p-2 text-white/60 hover:bg-red-500/10 hover:text-red-200" aria-label="Sign out"><LogOut className="h-4 w-4" /></button></div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1440px]">
        <aside className={`${mobileOpen ? 'block' : 'hidden'} fixed inset-x-0 top-[61px] z-30 border-b border-white/10 bg-[#0c0d14] p-3 lg:static lg:block lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:bg-transparent lg:p-5`}>
          <nav className="space-y-5" aria-label="Admin navigation">
            {navGroups.map((group) => <div key={group.id}><p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">{group.label}</p><div className="space-y-1">{group.items.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => select(item.id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${active === item.id ? 'bg-[#232731] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}><span className="flex items-center gap-3"><Icon className="h-4 w-4" />{item.label}</span>{active === item.id && <ChevronRight className="h-3.5 w-3.5" />}</button>; })}</div></div>)}
            <div><p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Content shortcuts</p><div className="space-y-1">{contentLinks.map((item) => <button key={item.id} type="button" onClick={() => select(item.id)} className={`w-full rounded-xl px-3 py-2 text-left text-xs transition ${active === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/10 hover:text-white/70'}`}>{item.label}</button>)}</div></div>
          </nav>
        </aside>
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8"><Suspense fallback={<LoadingEditor />}>{renderActive()}</Suspense></section>
      </div>
    </main>
  );
}
