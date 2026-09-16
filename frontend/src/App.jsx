import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';
import LeftControlPanel from './components/LeftControlPanel';
import BrandIdentity from './components/BrandIdentity';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import UnderPolishing from './pages/UnderPolishing';
import { CmsProvider, CmsContext } from './context/CmsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
// import { Analytics } from "@vercel/analytics/react"


const CORE_SECTION_IDS = ['home', 'about', 'projects', 'skills', 'contact'];
const ADMIN_LOGIN_PATH = '/admin-portal-1622';
const ADMIN_DASHBOARD_PATH = '/admin-portal-1622-dashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(CmsContext);
  if (isAuthenticated === undefined) return null; // Wait for hydration
  return isAuthenticated ? children : <Navigate to={ADMIN_LOGIN_PATH} replace />;
};

function LandingPage({ isLoaded }) {
    const { sections, fetchSection } = React.useContext(CmsContext);
    const [activeSection, setActiveSection] = useState('home');

    // HYDRATION: Ensure all core sections are fetched on mount
    useEffect(() => {
        ['home', 'about', 'projects', 'skills', 'contact', 'layout'].forEach(fetchSection);
    }, []);

    const visibleSectionList = (sections.layout?.siteSections || [])
        .filter((section) => CORE_SECTION_IDS.includes(section.id));

    // Combine granular sections into a unified cmsData object for compatibility
    const cmsData = {
        siteProfile: sections.home?.profile || {},
        siteSections: visibleSectionList,
        aboutLines: sections.about?.aboutLines || [],
        gallery: sections.home?.gallery || [],
        skills: sections.skills?.skills || {},
        projects: sections.projects?.projects || [],
        contact: sections.contact || {},
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
                profile={cmsData?.siteProfile}
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

            <div className="fixed inset-0 bg-[var(--accent)]/[0.01] pointer-events-none -z-10" />
        </main>
    );
}

function AppRoutes({ isLoaded }) {
    const { sections, fetchSection } = useContext(CmsContext);

    useEffect(() => {
        fetchSection('polishing');
    }, []);

    // Polishing mode is active by default unless explicitly set to false by admin in CMS
    const isPolishingActive = sections.polishing?.isPolishingMode !== false;

    return (
        <Routes>
            {/* ADMIN ROUTES: ALWAYS ACCESSIBLE */}
            <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin dashboardPath={ADMIN_DASHBOARD_PATH} />} />
            <Route 
                path={`${ADMIN_DASHBOARD_PATH}/*`}
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* CONDITIONAL PUBLIC ACCESS */}
            {isPolishingActive ? (
                <>
                    {/* ONLY Under Polishing is visible to public */}
                    <Route path="/" element={<UnderPolishing config={sections.polishing} />} />
                    {/* All other routes & 404s redirect strictly to polishing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            ) : (
                <>
                    {/* FULL LIVE PORTFOLIO ACTIVE WHEN TOGGLED OFF BY ADMIN */}
                    <Route path="/" element={<LandingPage isLoaded={isLoaded} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
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
                    <AppRoutes isLoaded={isLoaded} />
                </Router>
            </CmsProvider>
        </ThemeProvider>
    );
}

export default App;
