import { useContext, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Plus, Save, Trash2, UserRound } from 'lucide-react';
import { CmsContext } from '../../../cms/CmsContext';
import { useEditorDirty } from '../useEditorForm';

const emptyService = () => ({ title: '', description: '', deliverables: [] });

function Field({ label, value, onChange, multiline = false, placeholder }) {
  const Component = multiline ? 'textarea' : 'input';
  return <label className="space-y-1.5"><span className="text-xs font-semibold text-white/65">{label}</span><Component value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={multiline ? 3 : undefined} className="w-full rounded-xl border border-white/10 bg-[#171923] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#27c93f]" /></label>;
}

export default function EssentialContentEditor({ onNavigate }) {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [home, setHome] = useState({ profile: { services: [] } });
  const [aboutLines, setAboutLines] = useState([]);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSection('home');
    fetchSection('about');
  }, [fetchSection]);

  useEffect(() => {
    if (sections.home) setHome({ ...sections.home, profile: { ...sections.home.profile, services: sections.home.profile?.services || [] } });
  }, [sections.home]);

  useEffect(() => {
    if (sections.about) setAboutLines(sections.about.aboutLines || []);
  }, [sections.about]);

  const baseline = useMemo(() => JSON.stringify({ home, aboutLines }), [aboutLines, home]);
  const [savedBaseline, setSavedBaseline] = useState(baseline);
  useEffect(() => {
    if (sections.home || sections.about) {
      const nextHome = sections.home ? { ...sections.home, profile: { ...sections.home.profile, services: sections.home.profile?.services || [] } } : home;
      const nextAboutLines = sections.about ? (sections.about.aboutLines || []) : aboutLines;
      setSavedBaseline(JSON.stringify({ home: nextHome, aboutLines: nextAboutLines }));
    }
    // The CMS response should establish the initial clean state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.home, sections.about]);
  const dirty = baseline !== savedBaseline;
  useEditorDirty(dirty, Boolean(saving));

  const setProfile = (field, value) => setHome((current) => ({ ...current, profile: { ...current.profile, [field]: value } }));
  const setService = (index, field, value) => setProfile('services', (home.profile.services || []).map((service, serviceIndex) => serviceIndex === index ? { ...service, [field]: value } : service));

  const save = async (kind) => {
    setSaving(kind);
    setMessage({ type: '', text: '' });
    try {
      if (kind === 'home') await updateSection('home', home);
      if (kind === 'about') await updateSection('about', { ...sections.about, aboutLines });
      setSavedBaseline(JSON.stringify({ home, aboutLines }));
      setMessage({ type: 'success', text: `${kind === 'home' ? 'Profile' : 'About story'} saved.` });
    } catch {
      setMessage({ type: 'error', text: 'Could not save these changes. Try again.' });
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27c93f]">Content</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Keep the essentials current</h2><p className="mt-2 text-sm text-white/55">The public-facing profile, services, and story in one focused workspace.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onNavigate?.('profile')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10">Advanced profile <ArrowRight className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onNavigate?.('layout')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10">Layout & media <ArrowRight className="h-3.5 w-3.5" /></button></div></header>
      {message.text && <div className={`cms-status-message flex items-center gap-2 rounded-xl border p-3 text-sm ${message.type === 'success' ? 'cms-success-message' : 'border-red-400/30 bg-red-500/10 text-red-200'}`} role="status">{message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}{message.text}</div>}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="flex items-center gap-2 font-semibold text-white"><UserRound className="h-4 w-4 text-[#27c93f]" />Profile essentials</h3><p className="mt-1 text-xs text-white/45">These fields power the first impression on the public site.</p></div><button type="button" onClick={() => save('home')} disabled={saving === 'home'} className="inline-flex items-center gap-2 rounded-xl bg-[#27c93f] px-3.5 py-2 text-xs font-bold text-black disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving === 'home' ? 'Saving…' : 'Save profile'}</button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Name" value={home.profile?.name} onChange={(value) => setProfile('name', value)} placeholder="Your name" /><Field label="Headline" value={home.profile?.tagline} onChange={(value) => setProfile('tagline', value)} placeholder="What you do" /><Field label="Short introduction" value={home.profile?.subtitle} onChange={(value) => setProfile('subtitle', value)} multiline placeholder="A concise introduction" /><Field label="Availability" value={home.profile?.availability} onChange={(value) => setProfile('availability', value)} placeholder="Available for select projects" /><Field label="Primary CTA label" value={home.profile?.ctaLabel} onChange={(value) => setProfile('ctaLabel', value)} placeholder="Start a conversation" /></div></section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="font-semibold text-white">Services</h3><p className="mt-1 text-xs text-white/45">Optional cards shown on the public home page. Deliverables are one item per line.</p></div><button type="button" onClick={() => setProfile('services', [...(home.profile?.services || []), emptyService()])} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/75 hover:bg-white/10"><Plus className="h-3.5 w-3.5" /> Add service</button></div><div className="space-y-3">{(home.profile?.services || []).map((service, index) => <div key={index} className="rounded-xl border border-white/10 bg-black/10 p-4"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-white/40">Service {index + 1}</span><button type="button" onClick={() => setProfile('services', home.profile.services.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-300" aria-label={`Remove service ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /></button></div><div className="grid gap-3 sm:grid-cols-2"><Field label="Title" value={service.title} onChange={(value) => setService(index, 'title', value)} placeholder="Product design" /><Field label="Description" value={service.description} onChange={(value) => setService(index, 'description', value)} multiline placeholder="What this service includes" /><label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-semibold text-white/65">Deliverables</span><textarea rows={3} value={(service.deliverables || []).join('\n')} onChange={(event) => setService(index, 'deliverables', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} placeholder="Discovery\nResponsive UI\nHandoff" className="w-full rounded-xl border border-white/10 bg-[#171923] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#27c93f]" /></label></div></div>)}{!home.profile?.services?.length && <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-white/45">No services yet. Add one when you are ready.</p>}</div></section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="font-semibold text-white">About story</h3><p className="mt-1 text-xs text-white/45">Short paragraphs work best. Reorder and advanced layout options remain available below.</p></div><button type="button" onClick={() => save('about')} disabled={saving === 'about'} className="inline-flex items-center gap-2 rounded-xl bg-[#27c93f] px-3.5 py-2 text-xs font-bold text-black disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving === 'about' ? 'Saving…' : 'Save story'}</button></div><div className="space-y-3">{aboutLines.map((line, index) => <div key={index} className="flex gap-2"><textarea rows={3} value={line} onChange={(event) => setAboutLines((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#171923] px-3.5 py-3 text-sm text-white outline-none focus:border-[#27c93f]" /><button type="button" onClick={() => setAboutLines((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="h-10 rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-300" aria-label={`Remove paragraph ${index + 1}`}><Trash2 className="h-4 w-4" /></button></div>)}<button type="button" onClick={() => setAboutLines((current) => [...current, ''])} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-3.5 py-2 text-xs font-semibold text-white/60 hover:border-[#27c93f]/50 hover:text-white"><Plus className="h-3.5 w-3.5" /> Add paragraph</button></div></section>
    </div>
  );
}
