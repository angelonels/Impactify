import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Command } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = ({ onOpenPalette }) => {
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();

    const handleScroll = (e, id) => {
        e.preventDefault();
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.pageYOffset - 150;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }, 100);
        } else {
            const el = document.getElementById(id);
            if (el) {
                const offset = el.getBoundingClientRect().top + window.pageYOffset - 150;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="navbar">
            <h1 onClick={() => { navigate('/'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                IMPACTIFY
            </h1>
            <ul className="navbar-links">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo(0,0); }} className="navbar-link">Home</a></li>
                <li><a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="navbar-link">Datasets</a></li>
                <li><a href="/insights" onClick={(e) => { e.preventDefault(); navigate('/insights'); }} className="navbar-link">Insights</a></li>
                <li><a href="/dashboards" onClick={(e) => { e.preventDefault(); navigate('/dashboards'); }} className="navbar-link">Dashboards</a></li>
                <li><a href="/gallery" onClick={(e) => { e.preventDefault(); navigate('/gallery'); }} className="navbar-link">Demo</a></li>
                <li><a href="#capabilities" onClick={(e) => handleScroll(e, 'capabilities')} className="navbar-link">Features</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="navbar-link">About</a></li>
            </ul>
            <div className="navbar-actions">
                {onOpenPalette && (
                    <button className="navbar-icon-btn" title="Command palette (⌘K)" onClick={onOpenPalette}>
                        <Command size={16} />
                    </button>
                )}
                <button className="navbar-icon-btn" title="Toggle theme" onClick={toggle}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
