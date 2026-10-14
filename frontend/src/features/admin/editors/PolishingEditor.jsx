import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../../../cms/CmsContext';
import { 
  Save, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  Power, 
  RotateCcw, 
  Github, 
  Linkedin, 
  Instagram, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useEditorDirty } from '../useEditorForm';

export default function PolishingEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isDirty, setIsDirty] = useState(false);
  useEditorDirty(isDirty, isSaving);

  const [polishingData, setPolishingData] = useState({
    isPolishingMode: true,
    durationHours: 36,
    startedAt: 1726500000000,
    title: "Crafting Something Extraordinary",
    subtitle: "Portfolio Under Polishing",
    message: "I am currently polishing and elevating the portfolio experience with fresh design systems, refined micro-interactions, and new product case studies.",
    github: "https://github.com/kushalsaialeti",
    linkedin: "https://www.linkedin.com/in/kushalsaialeti/",
    instagram: "https://www.instagram.com/_.kushal._.sai._.aleti._/",
    email: "kushalsaialeti98@gmail.com"
  });

  const [previewRemaining, setPreviewRemaining] = useState({ h: 36, m: 0, s: 0 });

  useEffect(() => {
    fetchSection('polishing');
  }, [fetchSection]);

  useEffect(() => {
    if (sections.polishing) {
      setPolishingData(prev => ({
        ...prev,
        ...sections.polishing,
        isPolishingMode: sections.polishing.isPolishingMode !== undefined ? sections.polishing.isPolishingMode : true,
      }));
      setIsDirty(false);
    }
  }, [sections.polishing]);

  // Live preview calculation of the countdown
  useEffect(() => {
    const cycleMs = (Number(polishingData.durationHours) || 36) * 60 * 60 * 1000;
    const updatePreview = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - (Number(polishingData.startedAt) || 1726500000000));
      const currentElapsed = elapsed % cycleMs;
      const remainingMs = cycleMs - currentElapsed;
      const totalSec = Math.floor(remainingMs / 1000);
      setPreviewRemaining({
        h: Math.floor(totalSec / 3600),
        m: Math.floor((totalSec % 3600) / 60),
        s: totalSec % 60
      });
    };
    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [polishingData.durationHours, polishingData.startedAt]);

  const handleToggleMode = () => {
    setIsDirty(true);
    setPolishingData(prev => ({ ...prev, isPolishingMode: !prev.isPolishingMode }));
  };

  const handleResetTimer = () => {
    setIsDirty(true);
    setPolishingData(prev => ({ ...prev, startedAt: Date.now() }));
    setSaveMessage({ type: 'success', text: 'Countdown reset to start from 36 hours now. Remember to click Save!' });
    setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (field, value) => {
    setIsDirty(true);
    setPolishingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('polishing', { ...sections.polishing, ...polishingData });
      setIsDirty(false);
      setSaveMessage({ 
        type: 'success', 
        text: `Polishing settings saved successfully! Status: ${polishingData.isPolishingMode ? 'UNDER POLISHING (LOCKED)' : 'PUBLIC (UNLOCKED)'}` 
      });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error(err);
      setSaveMessage({ type: 'error', text: 'Failed to update polishing settings. Check backend connection.' });
    } finally {
      setIsSaving(false);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#27c93f]" />
            Under Polishing Controller
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Toggle public launch visibility, manage the 36-hour auto-looping countdown, and update public contact links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-[#27c93f] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(39,201,63,0.3)] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {saveMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-[#27c93f]/20 border border-[#27c93f]/40 text-[#27c93f]'
              : 'bg-red-500/20 border border-red-500/40 text-red-400'
          }`}
        >
          {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* MASTER TOGGLE BANNER */}
      <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
        polishingData.isPolishingMode 
          ? 'border-amber-500/30 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)]' 
          : 'border-[#27c93f]/30 bg-[#27c93f]/10 shadow-[0_0_30px_rgba(39,201,63,0.15)]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full animate-ping ${polishingData.isPolishingMode ? 'bg-amber-400' : 'bg-[#27c93f]'}`} />
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                polishingData.isPolishingMode 
                  ? 'border-amber-500/40 bg-amber-500/20 text-amber-300' 
                  : 'border-[#27c93f]/40 bg-[#27c93f]/20 text-[#27c93f]'
              }`}>
                {polishingData.isPolishingMode ? 'Under Polishing: ACTIVE (PUBLIC SITE LOCKED)' : 'Under Polishing: OFF (PORTFOLIO IS LIVE)'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">
              {polishingData.isPolishingMode 
                ? 'Visitors to kushalsaialeti.vercel.app currently only see the Polishing Page' 
                : 'All sections and public routes are active for everyone'}
            </h3>
            
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl">
              {polishingData.isPolishingMode
                ? 'All other public routes and 404 links automatically redirect to the Under Polishing page. Only admin login and dashboard remain accessible.'
                : 'Your full portfolio experience (Hero, About, Projects, Skills, Contact) is unlocked for all public visitors.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleMode}
            className={`cursor-pointer px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shrink-0 active:scale-95 shadow-xl ${
              polishingData.isPolishingMode
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25'
                : 'bg-[#27c93f] hover:brightness-110 text-black shadow-[#27c93f]/25'
            }`}
          >
            <Power className="w-5 h-5" />
            <span>{polishingData.isPolishingMode ? 'Turn OFF Polishing (Go Live)' : 'Turn ON Polishing (Lock Site)'}</span>
          </button>
        </div>
      </div>

      {/* TIMER & COUNTDOWN ENGINE CONTROLLER */}
      <div className="rounded-3xl border border-white/10 bg-[#161724]/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27c93f]/10 text-[#27c93f] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white uppercase tracking-wider">36-Hour Auto-Looping Countdown</h4>
              <p className="text-xs text-white/50">Even after 36 hours, if toggle remains ON, the countdown automatically restarts another 36h cycle.</p>
            </div>
          </div>

          {/* LIVE PREVIEW TICKER */}
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-white/50">Current Cycle Left:</span>
            <span className="font-mono text-sm font-black text-[#27c93f]">
              {pad(previewRemaining.h)}h : {pad(previewRemaining.m)}m : {pad(previewRemaining.s)}s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">
              Cycle Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="720"
              value={polishingData.durationHours || 36}
              onChange={(e) => handleChange('durationHours', Number(e.target.value))}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
            <p className="text-[11px] text-white/40">Default is 36 hours as specified.</p>
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">
              Timer Cycle Controls
            </label>
            <button
              type="button"
              onClick={handleResetTimer}
              className="cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-[#27c93f]" />
              <span>Reset 36h Timer to Start from Now</span>
            </button>
            <p className="text-[11px] text-white/40">Restarts the 36-hour clock from current timestamp.</p>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENT CONTENT SETTINGS */}
      <div className="rounded-3xl border border-white/10 bg-[#161724]/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <h4 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-4">
          Announcement & Copy Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Hero Title</label>
            <input
              type="text"
              value={polishingData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Subtitle / Tag</label>
            <input
              type="text"
              value={polishingData.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Narrative Message</label>
            <textarea
              rows={3}
              value={polishingData.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* SOCIAL PROFILES & CONTACT LINKS */}
      <div className="rounded-3xl border border-white/10 bg-[#161724]/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <h4 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-4">
          Public Social & Connect Links
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Github className="w-3.5 h-3.5 text-white" />
              <span>GitHub URL</span>
            </label>
            <input
              type="url"
              value={polishingData.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
              <span>LinkedIn URL</span>
            </label>
            <input
              type="url"
              value={polishingData.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
              <span>Instagram URL</span>
            </label>
            <input
              type="url"
              value={polishingData.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#27c93f]" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              value={polishingData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-[#0c0d15] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM SAVE BAR */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3.5 rounded-2xl bg-[#27c93f] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(39,201,63,0.35)] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
}
