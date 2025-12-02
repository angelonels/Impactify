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
                    <a href="#demo" className="btn-secondary">View Demo</a>
                </div>
            </div>
        </section>
    )
}

export default Hero
