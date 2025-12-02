import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>IMPACTIFY</h1>
            </Link>
            <ul className="navbar-links">
                <li><Link to="/" className="navbar-link">Home</Link></li>
                <li><a href="#features" className="navbar-link">Features</a></li>
                <li><a href="#about" className="navbar-link">About</a></li>
                <li><a href="#contact" className="navbar-link">Contact</a></li>
            </ul>
            <Link to="/signup">
                <button className="navbar-cta">Get Started</button>
            </Link>
        </nav>
    )
}

export default Navbar
