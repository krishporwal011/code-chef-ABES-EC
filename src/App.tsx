import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CustomCursor } from './components/motion/CustomCursor';
import { ScrollTrackProgress } from './components/motion/ScrollTrackProgress';
import { CinematicIntro } from './components/intro/CinematicIntro';

// Lazy-loaded Pages for Optimal Performance & Zero Bundle Bloat
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Lazy-loaded Admin Section
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage').then((m) => ({ default: m.AdminEventsPage })));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/AdminRegistrationsPage').then((m) => ({ default: m.AdminRegistrationsPage })));

const RouteLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 rounded-full border-4 border-tomato/30 border-t-tomato animate-spin" />
    <span className="font-mono text-xs uppercase tracking-widest text-stone-500">
      Switching Tracks...
    </span>
  </div>
);

const AppContent: React.FC = () => {
  const [introActive, setIntroActive] = useState<boolean>(() => {
    // Only show if not seen before in this browser session
    const seen = sessionStorage.getItem('codechef_intro_seen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !seen && !prefersReducedMotion;
  });

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Lenis Smooth Scrolling initialization
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative selection:bg-tomato selection:text-white">
      {/* Cinematic Intro Animation */}
      {introActive && (
        <CinematicIntro
          onComplete={() => setIntroActive(false)}
        />
      )}

      {/* Smooth Scroll Progress Track */}
      {!isAdminRoute && <ScrollTrackProgress />}

      {/* Custom Desktop Chef-Hat Cursor */}
      <CustomCursor />

      {/* Scroll Position Reset */}
      <ScrollToTop />

      {/* Public Navbar (Hidden inside Admin Layout) */}
      {!isAdminRoute && <Navbar />}

      {/* Route Views */}
      <div className="flex-1">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="registrations" element={<AdminRegistrationsPage />} />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      {/* Public Footer (Hidden inside Admin Layout) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
