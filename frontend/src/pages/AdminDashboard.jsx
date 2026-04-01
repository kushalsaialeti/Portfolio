import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Save, RefreshCw, LayoutPanelTop, FileEdit, 
    Database, Share2, Plus, Trash2, Code2, BookOpen, User, 
    Zap, ListCheck, Layers, Terminal, Server, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CmsContext } from '../context/CmsContext';
import * as StaticContent from '../constants/siteContent';

// Import Section Editors
import HomeEditor from '../admin/HomeEditor';
import LayoutEditor from '../admin/LayoutEditor';
import AboutEditor from '../admin/AboutEditor';
import SkillsEditor from '../admin/SkillsEditor';
import ProjectsEditor from '../admin/ProjectsEditor';
import ExtraEditor from '../admin/ExtraEditor';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { loading, injectBaseline } = useContext(CmsContext);
    const [activeTab, setActiveTab] = useState('profile');

    const handleSeed = () => {
        if (window.confirm('MIGRATE ARCHITECTURE: Are you sure you want to overwrite the current database with the high-fidelity static baseline? All current DB data will be replaced.')) {
            const staticData = {
                home: { profile: StaticContent.SITE_PROFILE, stack: ['React', 'Node.js', 'Vite', 'Cloudinary'] },
                layout: { siteSections: StaticContent.SITE_SECTIONS },
                about: { aboutLines: StaticContent.ABOUT_LINES },
                skills: { skills: StaticContent.SKILLS },
                projects: { projects: StaticContent.PROJECTS },
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
        { id: 'extra', icon: BookOpen, label: 'Insights' }
    ];

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
            <RefreshCw className="w-12 h-12 text-[#27c93f] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40">Synchronizing Distributed Cache</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#27c93f]/20 font-inter antialiased">
            {/* PERSISTENT SYSTEM HEADER */}
            <header className="sticky top-0 z-[100] bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 px-6 md:px-16 py-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-[#27c93f] text-black rounded-3xl shadow-[0_0_40px_rgba(39,201,63,0.3)]">
                            <Terminal className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                               <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#27c93f]">ADMIN CORE V2.0</p>
                               <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">System Architect Console</h1>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleSeed}
                            className="flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-white/60 hover:text-white"
                        >
                            <Database className="w-4 h-4 text-[#27c93f]" /> Sync Baseline
                        </button>

                        <button 
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-white/60 hover:text-white"
                        >
                            <LogOut className="w-4 h-4" /> Exit Console
                        </button>
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
                                    ? 'bg-[#27c93f]/10 border-[#27c93f]/30 text-[#27c93f]' 
                                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
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
                            {activeTab === 'extra' && <ExtraEditor />}
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
