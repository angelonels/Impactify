import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import AuthSuccess from './pages/AuthSuccess'
import Footer from './components/Footer'
import LiquidEther from './components/LiquidEther'
import './App.css'

function App() {
  return (
    <Router>
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
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
