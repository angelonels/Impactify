const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content-minimal">
                <p>&copy; {new Date().getFullYear()} Impactify. All rights reserved.</p>
                <a
                    href="https://github.com/angelonels/Impactify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                >
                    GitHub
                </a>
            </div>
        </footer>
    );
};

export default Footer;
