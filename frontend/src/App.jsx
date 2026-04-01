import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import * as StaticContent from './constants/siteContent'; 
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ActivitiesSection from './sections/ActivitiesSection';
import BlogsSection from './sections/BlogsSection';
import ContactSection from './sections/ContactSection';
import LeftControlPanel from './components/LeftControlPanel';
import BrandIdentity from './components/BrandIdentity';
import AdminDashboard from './pages/AdminDashboard';
import SiteFooter from './components/SiteFooter';
import { CmsProvider, CmsContext } from './context/CmsContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function LandingPage({ isLoaded }) {
    const { sections, fetchSection } = React.useContext(CmsContext);
    const [activeSection, setActiveSection] = useState('home');

    // HYDRATION: Ensure all core sections are fetched on mount
    useEffect(() => {
        ['home', 'about', 'skills', 'projects', 'extra', 'layout'].forEach(fetchSection);
    }, []);

    // Combine granular sections into a unified cmsData object for compatibility
    const cmsData = {
        siteProfile: sections.home?.profile || StaticContent.SITE_PROFILE,
        siteSections: sections.layout?.siteSections || StaticContent.SITE_SECTIONS,
        blogs: sections.extra?.blogs || StaticContent.BLOGS,
        aboutLines: sections.about?.aboutLines || StaticContent.ABOUT_LINES,
        skills: sections.skills?.skills || StaticContent.SKILLS,
        projects: sections.projects?.projects || StaticContent.PROJECTS,
        activities: sections.extra?.activities || StaticContent.ACTIVITIES
    };

    // SMOOTH SCROLL ENGINE (Lenis - PRESERVED UNTOUCHED)
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            orientation: 'vertical',
            smoothTouch: true,
        });
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // INTERSECTION OBSERVER (PRESERVED UNTOUCHED)
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        };
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        cmsData.siteSections?.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [cmsData.siteSections]);

    const sectionMap = {
        home: HomeSection,
        about: AboutSection,
        skills: SkillsSection,
        projects: ProjectsSection,
        activities: ActivitiesSection,
        blogs: BlogsSection,
        contact: ContactSection,
    };

    const navigateToSection = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(targetId);
        }
    };

    return (
        <main className="relative bg-black text-white selection:bg-[#27c93f]/20 font-inter antialiased overflow-x-hidden">
            {/* PERSISTENT BRAND IDENTITY */}
            <BrandIdentity 
                profile={cmsData?.siteProfile} 
                onNavigate={navigateToSection} 
            />

            {/* GLOBAL HEADER DOCK */}
            <LeftControlPanel
                show={isLoaded}
                items={cmsData?.siteSections}
                activeId={activeSection}
                setActiveId={navigateToSection}
            />

            {/* SEAMLESS VERTICAL STACKED LANDING PAGE */}
            <div className="flex flex-col w-full">
                {cmsData.siteSections?.map((sectionMeta) => {
                    const SectionComponent = sectionMap[sectionMeta?.id];
                    if (!SectionComponent || sectionMeta?.isVisible === false) return null;

                    return (
                        <div key={sectionMeta?.id} id={sectionMeta?.id} className="w-full relative py-6 md:py-16">
                            <SectionComponent
                                section={sectionMeta}
                                content={cmsData} 
                                onNavigate={navigateToSection}
                            />
                        </div>
                    );
                })}
            </div>

            {/* HIGH-FIDELITY FOOTER */}
            <SiteFooter 
                profile={cmsData?.siteProfile} 
                sections={cmsData?.siteSections}
                onNavigate={navigateToSection}
            />

            {/* AMBIENT OVERLAY */}
            <div className="fixed inset-0 bg-[#27c93f]/[0.02] pointer-events-none -z-10" />
        </main>
    );
}

function App() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <CmsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage isLoaded={isLoaded} />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Router>
        </CmsProvider>
    );
}

export default App;
