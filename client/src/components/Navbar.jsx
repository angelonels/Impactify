import React from 'react'
import '../styles/Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>IMPACTIFY</h1>
            <ul className="navbar-links">
                <li><a href="/home" className="navbar-link">Home</a></li>
                <li><a href="#features" className="navbar-link">Features</a></li>
                <li><a href="#about" className="navbar-link">About</a></li>
                <li><a href="#contact" className="navbar-link">Contact</a></li>
            </ul>
            <button className="navbar-cta">Get Started</button>
        </nav>
    )
}

export default Navbar
