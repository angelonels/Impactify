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
                <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
                <li><Link to="/upload" className="navbar-link">Upload</Link></li>
                <li><Link to="/login" className="navbar-link">Login</Link></li>
            </ul>
            <Link to="/signup">
                <button className="navbar-cta">Get Started</button>
            </Link>
        </nav>
    )
}

export default Navbar
