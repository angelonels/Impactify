import { Link } from 'react-router-dom';
import { MessageSquare, BarChart3, LayoutDashboard, Languages } from 'lucide-react';
import '../styles/Hero.css';

const FEATURE_CHIPS = [
    { icon: MessageSquare, label: 'Conversational' },
    { icon: BarChart3,     label: '22 chart types' },
    { icon: LayoutDashboard, label: 'Dashboards' },
    { icon: Languages,     label: 'English + Hindi' },
];

const Hero = () => {
    return (
        <section className="hero-container">
            <div className="hero-content">
                <div className="hero-badge">
                    Chat with your data — no SQL, no setup
                </div>

                <h1 className="hero-title">
                    Ask anything. <br />
                    Get the chart back.
                </h1>

                <p className="hero-subtitle">
                    Upload a CSV or Excel file. Ask in plain English (or Hindi). Impactify writes
                    safe SQL, picks from 22 chart types, and remembers context across follow-ups.
                    Pin charts. Compose dashboards. Done.
                </p>

                <div className="hero-actions">
                    <Link to="/upload" className="btn-primary">Start Analyzing</Link>
                    <Link to="/gallery" className="btn-secondary-hero">View Demo</Link>
                </div>

                <ul className="hero-chips">
                    {FEATURE_CHIPS.map(({ icon: Icon, label }) => (
                        <li key={label} className="hero-chip">
                            <Icon size={14} /> {label}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Hero;
