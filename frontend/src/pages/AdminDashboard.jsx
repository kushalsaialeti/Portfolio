import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Save, RefreshCw, LayoutPanelTop, FileEdit, 
    Database, Share2, Plus, Trash2, Code2, BookOpen, User, 
    Zap, ListCheck, Layers, Terminal, Server, LogOut, Sun, Moon, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CmsContext } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import * as StaticContent from '../constants/siteContent';

// Import Section Editors
import HomeEditor from '../admin/HomeEditor';
import LayoutEditor from '../admin/LayoutEditor';
import AboutEditor from '../admin/AboutEditor';
import SkillsEditor from '../admin/SkillsEditor';
import ProjectsEditor from '../admin/ProjectsEditor';
import ExperienceEditor from '../admin/ExperienceEditor';
import ExtraEditor from '../admin/ExtraEditor';
import InquiryManager from '../admin/InquiryManager';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { loading, injectBaseline, logout } = useContext(CmsContext);
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');

    const handleSeed = () => {
        if (window.confirm('MIGRATE ARCHITECTURE: Are you sure you want to overwrite the current database with the high-fidelity static baseline? All current DB data will be replaced.')) {
            const staticData = {
                home: { profile: StaticContent.SITE_PROFILE, stack: ['React', 'Node.js', 'Vite', 'Cloudinary'] },
                layout: { siteSections: StaticContent.SITE_SECTIONS },
                about: { aboutLines: StaticContent.ABOUT_LINES },
                skills: { skills: StaticContent.SKILLS },
                projects: { projects: StaticContent.PROJECTS },
                experience: { experiences: StaticContent.EXPERIENCES },
                extra: { blogs: StaticContent.BLOGS, activities: StaticContent.ACTIVITIES }
            };
            injectBaseline(staticData);
        }
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Identity' },
        { id: 'layout', icon: LayoutPanelTop, label: 'Layout' },
        { id: 'content', icon: FileEdit, label: 'Narrative' },
        { id: 'stack', icon: Code2, label: 'Stack' },
        { id: 'work', icon: Database, label: 'Portfolio' },
        { id: 'journey', icon: Briefcase, label: 'Journey' },
        { id: 'extra', icon: BookOpen, label: 'Insights' },
        { id: 'signals', icon: Zap, label: 'Signals' }
    ];

    if (loading) return (
        <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center gap-8">
            <RefreshCw className="w-12 h-12 text-[var(--accent)] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[var(--text-secondary)]/40">Synchronizing Distributed Cache</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)]/20 font-inter antialiased transition-colors duration-500">
            {/* PERSISTENT SYSTEM HEADER */}
            <header className="sticky top-0 z-[100] bg-[var(--bg-base)]/80 backdrop-blur-2xl border-b border-[var(--border)] px-6 md:px-16 py-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-[var(--accent)] text-black rounded-3xl shadow-[0_0_40px_rgba(39,201,63,0.3)]">
                            <Terminal className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                               <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--accent)]">ADMIN CORE V2.0</p>
                               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">System Architect Console</h1>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleSeed}
                            className="flex items-center gap-3 px-8 py-3 rounded-full border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--surface)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            <Database className="w-4 h-4 text-[var(--accent)]" /> Sync Baseline
                        </button>

                        <button 
                            onClick={async () => {
                                await logout();
                                navigate('/');
                            }}
                            className="flex items-center gap-3 px-8 py-3 rounded-full border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--surface)] transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            <LogOut className="w-4 h-4" /> Exit Console
                        </button>

                        <div className="h-10 w-[1px] bg-[var(--border)]" />
                        
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 p-6 md:p-16">
                {/* GLOBAL NAVIGATION SIDEBAR */}
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="sticky top-40 flex flex-col gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer group ${activeTab === tab.id 
                                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' 
                                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]/20 hover:text-[var(--text-primary)]'}`}
                            >
                                <tab.icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* DYNAMIC COMPONENT STACK */}
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {activeTab === 'profile' && <HomeEditor />}
                            {activeTab === 'layout' && <LayoutEditor />}
                            {activeTab === 'content' && <AboutEditor />}
                            {activeTab === 'stack' && <SkillsEditor />}
                            {activeTab === 'work' && <ProjectsEditor />}
                            {activeTab === 'journey' && <ExperienceEditor />}
                            {activeTab === 'extra' && <ExtraEditor />}
                            {activeTab === 'signals' && <InquiryManager />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* SHARED SYSTEM FOOTER */}
            <footer className="mt-20 py-20 border-t border-white/5 text-center bg-black/40">
                <div className="flex items-center justify-center gap-10 mb-8 opacity-20 hover:opacity-100 transition-opacity">
                    <Zap className="w-5 h-5 text-[#27c93f]" />
                    <ListCheck className="w-5 h-5 text-[#27c93f]" />
                    <Layers className="w-5 h-5 text-[#27c93f]" />
                    <Terminal className="w-5 h-5 text-[#27c93f]" />
                    <Server className="w-5 h-5 text-[#27c93f]" />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[1em] text-white/10">Architecture Committed to Main Cluster &copy; 2026</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/5">Distributed Media Storage via Cloudinary Integration</p>
                </div>
            </footer>
        </main>
    );
}
