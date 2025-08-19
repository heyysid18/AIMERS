import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AuthButton() {
  const { token, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-profile-container')) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false);
      }
    };

    // Close menu on window resize to prevent layout issues
    const handleResize = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, [showUserMenu]);

  return token ? (
    <div className="user-section">
      <div className="user-profile-container">
        <button 
          className="user-profile"
          onClick={() => setShowUserMenu(!showUserMenu)}
          aria-label="User menu"
          aria-expanded={showUserMenu}
          aria-haspopup="true"
        >
          <div className="user-avatar">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">Student</span>
          </div>
          <div className="user-dropdown">
            <i className={`fas fa-caret-down ${showUserMenu ? 'rotated' : ''}`}></i>
          </div>
        </button>

        {showUserMenu && (
          <div 
            className="user-menu"
            role="menu"
            aria-label="User menu"
          >
            <div className="user-menu-header">
              <div className="user-avatar-large">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="user-details">
                <span className="user-name-large">{user?.name || 'User'}</span>
                <span className="user-email">{user?.email || 'user@example.com'}</span>
              </div>
            </div>
            
            <div className="user-menu-items">
              <Link to="/my-account" className="user-menu-item" onClick={() => setShowUserMenu(false)} role="menuitem">
                <i className="fas fa-user"></i>
                <span>My Account</span>
              </Link>
              <Link to="/upload" className="user-menu-item" onClick={() => setShowUserMenu(false)} role="menuitem">
                <i className="fas fa-upload"></i>
                <span>Upload Content</span>
              </Link>
              <Link to="/settings" className="user-menu-item" onClick={() => setShowUserMenu(false)} role="menuitem">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </Link>
              <Link to="/help" className="user-menu-item" onClick={() => setShowUserMenu(false)} role="menuitem">
                <i className="fas fa-question-circle"></i>
                <span>Help & Support</span>
              </Link>
              <div className="user-menu-divider"></div>
              <button className="user-menu-item logout-btn" onClick={handleLogout} role="menuitem">
                <i className="fas fa-sign-out-alt"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="auth-section">
      <Link to="/auth" className="auth-link">
        <button className="login-button">
          <i className="fas fa-sign-in-alt"></i>
          <span>Sign In</span>
        </button>
      </Link>
      {/* Removed Register button to keep header minimal */}
    </div>
  );
}

function Header() {
  const location = useLocation();
  const { token } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`premium-header ${token ? 'logged-in' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="logo-content">
            <span className="logo-text">AIMERS</span>
            <span className="logo-tagline">Excellence in Education</span>
          </div>
        </Link>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-group">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link to="/courses" className={`nav-link ${isActive("/courses") ? "active" : ""}`}>
              <i className="fas fa-book"></i>
              <span>Courses</span>
            </Link>
            <Link to="/dpps" className={`nav-link ${isActive("/dpps") ? "active" : ""}`}>
              <i className="fas fa-file-alt"></i>
              <span>DPPs</span>
            </Link>
            <Link to="/papers" className={`nav-link ${isActive("/papers") ? "active" : ""}`}>
              <i className="fas fa-file-archive"></i>
              <span>Papers</span>
            </Link>
          </div>
          
          <div className="nav-group">
            <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
              <i className="fas fa-info-circle"></i>
              <span>About</span>
            </Link>
            <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <AuthButton />
          
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
