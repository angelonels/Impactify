import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleScroll = (e, id) => {
        e.preventDefault();

        if (window.location.pathname !== '/') {
            navigate('/');

            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {

            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>IMPACTIFY</h1>
            <ul className="navbar-links">
                <li><a href="/" onClick={handleHomeClick} className="navbar-link">Home</a></li>
                <li><a href="#features" onClick={(e) => handleScroll(e, 'features')} className="navbar-link">Features</a></li>
                <li><a href="#about" onClick={(e) => handleScroll(e, 'about')} className="navbar-link">About</a></li>
                <li><a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="navbar-link">Contact</a></li>
            </ul>
            {isLoggedIn ? (
                <button className="navbar-cta" onClick={handleLogout}>Logout</button>
            ) : (
                <button className="navbar-cta" onClick={() => navigate('/login')}>Get Started</button>
            )}
        </nav>
    )
}

export default Navbar
