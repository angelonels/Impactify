import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import DataCleaning from './pages/DataCleaning'
import Workbench from './pages/Workbench'
import AuthSuccess from './pages/AuthSuccess'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import LiquidEther from './components/LiquidEther'
import './App.css'

import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup', '/forgot-password', '/terms', '/privacy'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

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
        {!shouldHideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/dataset/:id/analyze" element={<Workbench />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
