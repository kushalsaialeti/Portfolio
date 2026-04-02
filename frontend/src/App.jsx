import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import * as StaticContent from './constants/siteContent'; 
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ActivitiesSection from './sections/ActivitiesSection';
import BlogsSection from './sections/BlogsSection';
import ExperienceSection from './sections/ExperienceSection';
import ContactSection from './sections/ContactSection';
import LeftControlPanel from './components/LeftControlPanel';
import BrandIdentity from './components/BrandIdentity';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import SiteFooter from './components/SiteFooter';
import ThemeToggle from './components/ThemeToggle';
import { CmsProvider, CmsContext } from './context/CmsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
// import { Analytics } from "@vercel/analytics/react"


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(CmsContext);
  if (isAuthenticated === undefined) return null; // Wait for hydration
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

function LandingPage({ isLoaded }) {
    const { sections, fetchSection } = React.useContext(CmsContext);
    const [activeSection, setActiveSection] = useState('home');

    // HYDRATION: Ensure all core sections are fetched on mount
    useEffect(() => {
        ['home', 'about', 'skills', 'projects', 'extra', 'layout', 'experience'].forEach(fetchSection);
    }, []);

    // Combine granular sections into a unified cmsData object for compatibility
    const cmsData = {
        siteProfile: sections.home?.profile || StaticContent.SITE_PROFILE,
        siteSections: sections.layout?.siteSections || StaticContent.SITE_SECTIONS,
        blogs: sections.extra?.blogs || StaticContent.BLOGS,
        aboutLines: sections.about?.aboutLines || StaticContent.ABOUT_LINES,
        gallery: sections.home?.gallery || [],
        skills: sections.skills?.skills || StaticContent.SKILLS,
        projects: sections.projects?.projects || StaticContent.PROJECTS,
        experience: sections.experience?.experiences || StaticContent.EXPERIENCES,
        activities: sections.extra?.activities || StaticContent.ACTIVITIES
    };

    // SMOOTH SCROLL ENGINE (Lenis)
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

    // INTERSECTION OBSERVER
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
        experience: ExperienceSection,
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
        <main className="relative bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent)]/20 font-inter antialiased overflow-x-hidden">
            <BrandIdentity 
                profile={cmsData?.siteProfile} 
                onNavigate={navigateToSection} 
            />

            <LeftControlPanel
                show={isLoaded}
                items={cmsData?.siteSections}
                activeId={activeSection}
                setActiveId={navigateToSection}
            />

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


            <ThemeToggle />

            <div className="fixed inset-0 bg-[var(--accent)]/[0.01] pointer-events-none -z-10" />
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
        <ThemeProvider>
            <CmsProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage isLoaded={isLoaded} />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route 
                        path="/admin/*" 
                        element={
                            <ProtectedRoute>
                            <AdminDashboard />
                            </ProtectedRoute>
                        } 
                        />
                    </Routes>
                </Router>
            </CmsProvider>
        </ThemeProvider>
  );
}

export default App;
