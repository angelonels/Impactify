import React from 'react'
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'
import '../styles/Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-brand">
                        <h2>IMPACTIFY</h2>
                        <p>Turn raw data into insights, instantly. No SQL required.</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email" />
                            <button>Subscribe</button>
                        </div>
                    </div>

                    <div className="footer-links-container">
                        <div className="footer-column">
                            <h3>Product</h3>
                            <a href="#">Features</a>
                            <a href="#">Integrations</a>
                            <a href="#">Pricing</a>
                            <a href="#">Changelog</a>
                        </div>
                        <div className="footer-column">
                            <h3>Company</h3>
                            <a href="#">About</a>
                            <a href="#">Careers</a>
                            <a href="#">Blog</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="footer-column">
                            <h3>Legal</h3>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Security</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Impactify. All rights reserved.</p>
                    <div className="footer-socials">
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="#" aria-label="GitHub"><FaGithub /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
