import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileText, Grid3X3, Home, LayoutPanelTop, LogOut, Mail, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CmsContext } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';

import HomeEditor from '../admin/HomeEditor';
import LayoutEditor from '../admin/LayoutEditor';
import AboutEditor from '../admin/AboutEditor';
import SkillsEditor from '../admin/SkillsEditor';
import ProjectsEditor from '../admin/ProjectsEditor';
import ContactEditor from '../admin/ContactEditor';
import InquiryManager from '../admin/InquiryManager';

const tabs = [
  { id: 'profile', icon: Home, label: 'Hero' },
  { id: 'layout', icon: LayoutPanelTop, label: 'Sections' },
  { id: 'content', icon: FileText, label: 'About' },
  { id: 'work', icon: Grid3X3, label: 'Projects' },
  { id: 'stack', icon: Sparkles, label: 'Skills' },
  { id: 'contact', icon: Mail, label: 'Contact' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { loading, seedBaseline, logout } = useContext(CmsContext);
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  const handleSeed = async () => {
    if (!window.confirm('Replace current CMS content with the backend five-section baseline?')) return;

    setIsSeeding(true);
    try {
      await seedBaseline();
      alert('Backend baseline synced successfully.');
    } catch (error) {
      alert('Baseline sync failed.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 text-[#191A23]">
        <RefreshCw className="w-10 h-10 text-[#191A23] animate-spin" />
        <p className="text-sm font-semibold">Loading CMS</p>
      </div>
    );
  }

  return (
    <main className="admin-surface min-h-screen bg-white text-[#191A23] antialiased">
      <header className="sticky top-0 z-[100] border-b border-[#191A23] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#191A23] text-[#B9FF66]">
                <Sparkles className="h-5 w-5" />
              </span>
              <span>
                <span className="block w-fit rounded-md bg-[#B9FF66] px-2 text-lg font-semibold leading-tight">Portfolio CMS</span>
                <span className="mt-1 block text-sm text-[#191A23]/70">Edit every public section from one place.</span>
              </span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 rounded-xl border border-[#191A23] bg-[#F3F3F3] px-5 py-3 text-sm font-medium shadow-[0_4px_0_#191A23] transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isSeeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                Sync Baseline
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#191A23] bg-[#191A23] px-5 py-3 text-sm font-medium text-white shadow-[0_4px_0_#B9FF66] transition hover:-translate-y-0.5"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-[#191A23] bg-[#F3F3F3] p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-[#B9FF66] text-[#191A23] shadow-[0_3px_0_#191A23]'
                    : 'text-[#191A23]/70 hover:bg-white hover:text-[#191A23]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'profile' && <HomeEditor />}
            {activeTab === 'layout' && <LayoutEditor />}
            {activeTab === 'content' && <AboutEditor />}
            {activeTab === 'work' && <ProjectsEditor />}
            {activeTab === 'stack' && <SkillsEditor />}
            {activeTab === 'contact' && (
              <div className="space-y-10">
                <ContactEditor />
                <InquiryManager />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
