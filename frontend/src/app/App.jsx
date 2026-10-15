import React, { lazy, Suspense, useEffect, useMemo, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import HomeSection from '../features/public/sections/HomeSection';
import AboutSection from '../features/public/sections/AboutSection';
import SkillsSection from '../features/public/sections/SkillsSection';
import ProjectsSection from '../features/public/sections/ProjectsSection';
import ContactSection from '../features/public/sections/ContactSection';
import LeftControlPanel from '../components/LeftControlPanel';
import BrandIdentity from '../components/BrandIdentity';
import { CmsProvider } from '../cms/CmsProvider';
import { CmsContext } from '../cms/CmsContext';
import { ADMIN_LOGIN_PATH, ADMIN_DASHBOARD_PATH } from './routes';
import { SECTION_SLUGS, buildCmsData } from '../cms/content';
import {
    getAnalyticsPreference,
    setAnalyticsPreference,
    startPublicAnalytics,
    subscribeAnalyticsPreference,
} from '../features/public/analytics';

const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('../features/admin/AdminLogin'));


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(CmsContext);
  if (loading) return <p role="status" className="p-8">Checking session...</p>;
  return isAuthenticated ? children : <Navigate to={ADMIN_LOGIN_PATH} replace />;
};

function LandingPage({ isLoaded }) {
    const { sections, fetchSection } = React.useContext(CmsContext);
    const [activeSection, setActiveSection] = useState('home');

    // HYDRATION: Ensure all core sections are fetched on mount
    useEffect(() => {
        SECTION_SLUGS.forEach((slug) => fetchSection(slug));
    }, [fetchSection]);

    const cmsData = useMemo(() => buildCmsData(sections), [sections]);

    // First-party analytics is opt-in and runs only on the public portfolio.
    useEffect(() => {
        let stop = startPublicAnalytics();
        const unsubscribe = subscribeAnalyticsPreference(() => {
            stop();
            stop = startPublicAnalytics();
        });
        return () => {
            unsubscribe();
            stop();
        };
    }, []);

    // SMOOTH SCROLL ENGINE (Lenis)
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const lenis = new Lenis({
            duration: 1.4,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            orientation: 'vertical',
            smoothTouch: true,
        });
        let frameId;
        const raf = (time) => {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        };
        frameId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
        };
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
                        <div key={sectionMeta?.id} className="w-full relative py-6 md:py-16">
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
            <AnalyticsConsent />
        </main>
    );
}

function AnalyticsConsent() {
    const [preference, setPreference] = useState(getAnalyticsPreference);

    useEffect(() => subscribeAnalyticsPreference(() => setPreference(getAnalyticsPreference())), []);

    if (preference !== 'unset') return null;

    return (
        <aside
            aria-label="Analytics preference"
            className="fixed bottom-4 left-4 right-4 z-[200] mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#151518]/95 p-4 text-white shadow-2xl backdrop-blur-xl"
        >
            <p className="text-sm font-semibold">Help improve this portfolio?</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
                Optional anonymous analytics show which sections people explore and how long they stay. No names, emails, message text, IPs, or fingerprinting are stored.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setAnalyticsPreference(true)}
                    className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-black transition hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    Allow anonymous analytics
                </button>
                <button
                    type="button"
                    onClick={() => setAnalyticsPreference(false)}
                    className="rounded-xl border border-white/15 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    No thanks
                </button>
            </div>
        </aside>
    );
}

function AppRoutes({ isLoaded }) {
    const { fetchSection, error } = useContext(CmsContext);

    return (
        <>
        {error && <div role="alert" className="fixed bottom-4 left-4 right-4 z-[300] rounded-xl bg-red-950 p-4 text-white">
            {error} <button onClick={() => {
                SECTION_SLUGS.forEach((slug) => fetchSection(slug, true));
            }} className="ml-4 underline">Retry</button>
        </div>}
        <Routes>
            {/* ADMIN ROUTES: ALWAYS ACCESSIBLE */}
            <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin dashboardPath={ADMIN_DASHBOARD_PATH} />} />
            <Route path="/admin" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
            <Route path="/login" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
            <Route path="/admin/login" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
            <Route path="/cms" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
            <Route path="/dashboard" element={<Navigate to={ADMIN_DASHBOARD_PATH} replace />} />
            <Route 
                path={`${ADMIN_DASHBOARD_PATH}/*`}
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* The public portfolio is permanently live. */}
            <Route path="/" element={<LandingPage isLoaded={isLoaded} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </>
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
                <Suspense fallback={<p role="status" className="p-8">Loading...</p>}>
                <AppRoutes isLoaded={isLoaded} />
                </Suspense>
            </Router>
        </CmsProvider>
    );
}

export default App;
