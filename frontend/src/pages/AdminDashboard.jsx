import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileText, Grid3X3, Home, LayoutPanelTop, LogOut, Mail, RefreshCw, Save, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CmsContext } from '../context/CmsContext';

import HomeEditor from '../admin/HomeEditor';
import LayoutEditor from '../admin/LayoutEditor';
import AboutEditor from '../admin/AboutEditor';
import SkillsEditor from '../admin/SkillsEditor';
import ProjectsEditor from '../admin/ProjectsEditor';
import ContactEditor from '../admin/ContactEditor';
import InquiryManager from '../admin/InquiryManager';
import PolishingEditor from '../admin/PolishingEditor';

const tabs = [
  { id: 'polishing', icon: Sparkles, label: 'Polishing Mode' },
  { id: 'profile', icon: Home, label: 'Hero / Profile' },
  { id: 'layout', icon: LayoutPanelTop, label: 'Layout & Order' },
  { id: 'content', icon: FileText, label: 'About Story' },
  { id: 'work', icon: Grid3X3, label: 'Projects' },
  { id: 'stack', icon: Sparkles, label: 'Skills' },
  { id: 'contact', icon: Mail, label: 'Contact Settings' },
  { id: 'inquiries', icon: MessageSquare, label: 'Inquiries Hub' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { sections, fetchSection, loading, seedBaseline, saveBaseline, logout } = useContext(CmsContext);
  const [activeTab, setActiveTab] = useState('polishing');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSavingBaseline, setIsSavingBaseline] = useState(false);

  useEffect(() => {
    fetchSection('polishing');
  }, []);

  const isPolishingActive = sections.polishing?.isPolishingMode !== false;

  const handleSeed = async () => {
    if (!window.confirm('Replace current database content with the stored baseline?')) return;

    setIsSeeding(true);
    try {
      await seedBaseline();
      alert('Stored baseline synced successfully to database.');
    } catch (error) {
      alert('Baseline sync failed.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSaveBaseline = async () => {
    if (!window.confirm('Save current live CMS data into the baseline file?')) return;

    setIsSavingBaseline(true);
    try {
      await saveBaseline();
      alert('Current live CMS data has been saved as the new baseline!');
    } catch (error) {
      alert('Failed to save current data as baseline.');
    } finally {
      setIsSavingBaseline(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d14] flex flex-col items-center justify-center gap-4 text-white">
        <RefreshCw className="w-9 h-9 text-[#27c93f] animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-white/60">Connecting to CMS...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0d14] text-white antialiased font-sans">
      {/* STICKY TOP HEADER */}
      <header className="sticky top-0 z-[100] border-b border-white/10 bg-[#0c0d14]/90 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* BRAND TITLE */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#27c93f] text-black flex items-center justify-center font-black shadow-[0_0_20px_rgba(39,201,63,0.3)]">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Kushal's Portfolio CMS</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#27c93f]/15 border border-[#27c93f]/30 text-[#27c93f] font-bold">
                    v2.0
                  </span>
                </h1>
                <p className="text-xs text-white/50">Full CRUD control over every portfolio section & media</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* POLISHING MODE STATUS INDICATOR */}
              <button
                type="button"
                onClick={() => setActiveTab('polishing')}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  isPolishingActive 
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' 
                    : 'border-[#27c93f]/40 bg-[#27c93f]/15 text-[#27c93f] hover:bg-[#27c93f]/25'
                }`}
                title="Click to view & configure Under Polishing Mode"
              >
                <span className={`w-2 h-2 rounded-full ${isPolishingActive ? 'bg-amber-400 animate-ping' : 'bg-[#27c93f]'}`} />
                <span>{isPolishingActive ? 'Polishing: ACTIVE' : 'Polishing: OFF (Live)'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer"
                title="View live portfolio site"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Live Site
              </button>

              <button
                type="button"
                onClick={handleSaveBaseline}
                disabled={isSavingBaseline || isSeeding}
                title="Save current live database data as the baseline template"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#27c93f] px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_15px_rgba(39,201,63,0.25)] hover:brightness-110 active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                {isSavingBaseline ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save as Baseline
              </button>

              <button
                type="button"
                onClick={handleSeed}
                disabled={isSeeding || isSavingBaseline}
                title="Reset database to the stored baseline"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
              >
                {isSeeding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                Sync Stored Baseline
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/admin-portal-1622');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <nav className="flex gap-2 overflow-x-auto p-1.5 rounded-2xl bg-[#14151e] border border-white/10 custom-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#27c93f] text-black shadow-[0_0_15px_rgba(39,201,63,0.3)]'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ACTIVE TAB CONTENT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'polishing' && <PolishingEditor />}
            {activeTab === 'profile' && <HomeEditor />}
            {activeTab === 'layout' && <LayoutEditor />}
            {activeTab === 'content' && <AboutEditor />}
            {activeTab === 'work' && <ProjectsEditor />}
            {activeTab === 'stack' && <SkillsEditor />}
            {activeTab === 'contact' && <ContactEditor />}
            {activeTab === 'inquiries' && <InquiryManager />}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
