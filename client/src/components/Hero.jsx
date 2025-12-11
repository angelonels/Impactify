import { Link } from 'react-router-dom'
import '../styles/Hero.css'

const Hero = () => {
    return (
        <section className="hero-container">
            <div className="hero-content">
                <div className="hero-badge">
                    AI-Powered Data Analytics
                </div>

                <h1 className="hero-title">
                    Turn Raw Data into <br />
                    Insights, Instantly.
                </h1>

                <p className="hero-subtitle">
                    Upload your datasets, ask questions in plain English, and let our AI
                    generate interactive visualizations. No SQL required.
                </p>

                <div className="hero-actions">
                    <Link to="/upload" className="btn-primary">Start Analyzing</Link>
                    <Link to="/gallery" className="btn-secondary" style={{ marginLeft: '1rem', padding: '0.8rem 2rem', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', background: 'rgba(255, 255, 255, 0.05)' }} onMouseOver={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }} onMouseOut={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}>View Demo</Link>
                </div>
            </div>
        </section>
    )
}

export default Hero
