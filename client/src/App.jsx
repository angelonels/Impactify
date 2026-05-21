import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'
import LiquidEther from './components/LiquidEther'
import './App.css'

// Eagerly load only the landing page; lazy-load everything else
import Home from './pages/Home'

const Login            = lazy(() => import('./pages/Login'))
const Signup           = lazy(() => import('./pages/Signup'))
const ForgotPassword   = lazy(() => import('./pages/ForgotPassword'))
const TermsOfService   = lazy(() => import('./pages/TermsOfService'))
const PrivacyPolicy    = lazy(() => import('./pages/PrivacyPolicy'))
const Dashboard        = lazy(() => import('./pages/Dashboard'))
const Upload           = lazy(() => import('./pages/Upload'))
const DataCleaning     = lazy(() => import('./pages/DataCleaning'))
const Workbench        = lazy(() => import('./pages/Workbench'))
const AuthSuccess      = lazy(() => import('./pages/AuthSuccess'))
const Contact          = lazy(() => import('./pages/Contact'))
const AboutUs          = lazy(() => import('./pages/AboutUs'))
const DemoGallery      = lazy(() => import('./pages/DemoGallery'))
const Insights         = lazy(() => import('./pages/Insights'))
const Dashboards       = lazy(() => import('./pages/Dashboards'))
const DashboardView    = lazy(() => import('./pages/DashboardView'))

const PageFallback = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(128,128,128,0.7)' }}>
    Loading…
  </div>
);

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup', '/forgot-password', '/terms', '/privacy'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app-container">
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <LiquidEther
          colors={['#222222', '#888888', '#FFFFFF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {!shouldHideNavbar && <Navbar onOpenPalette={() => setPaletteOpen(true)} />}
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/gallery" element={<DemoGallery />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dataset/:id/clean" element={<DataCleaning />} />
            <Route path="/dataset/:id/analyze" element={<Workbench />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/dashboards/:id" element={<DashboardView />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
