import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="logo-text">AIMERS</span>
            </div>
            <p className="brand-description">
              Empowering students with premium educational resources, expert guidance, and comprehensive learning solutions for academic excellence.
            </p>
            <div className="social-links">
              <a
                href="https://facebook.com/YourRealPage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com/YourPage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://youtube.com/YourPage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-link"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://twitter.com/YourPage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-link"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="section-title">Quick Links</h3>
            <div className="footer-links">
              <Link to="/courses" className="footer-link">
                <i className="fas fa-book"></i>
                <span>Courses</span>
              </Link>
              <Link to="/dpps" className="footer-link">
                <i className="fas fa-file-alt"></i>
                <span>Daily Practice</span>
              </Link>
              <Link to="/papers" className="footer-link">
                <i className="fas fa-file-archive"></i>
                <span>Previous Papers</span>
              </Link>
              <Link to="/about" className="footer-link">
                <i className="fas fa-info-circle"></i>
                <span>About Us</span>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="section-title">Support</h3>
            <div className="footer-links">
              <Link to="/contact" className="footer-link">
                <i className="fas fa-envelope"></i>
                <span>Contact Us</span>
              </Link>
              <a href="mailto:support@aimers.com" className="footer-link">
                <i className="fas fa-headset"></i>
                <span>Help Center</span>
              </a>
              <a href="/privacy" className="footer-link">
                <i className="fas fa-shield-alt"></i>
                <span>Privacy Policy</span>
              </a>
              <a href="/terms" className="footer-link">
                <i className="fas fa-file-contract"></i>
                <span>Terms of Service</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="section-title">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Education Street, Learning City, LC 12345</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@aimers.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="bottom-content">
            <p className="copyright">
              © 2025 <strong>AIMERS Coaching</strong> – Powered by Passion & Practice
            </p>
            <div className="footer-badges">
              <span className="badge">
                <i className="fas fa-shield-alt"></i>
                Secure Platform
              </span>
              <span className="badge">
                <i className="fas fa-certificate"></i>
                Certified Content
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
