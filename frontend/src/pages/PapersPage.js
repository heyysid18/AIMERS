// src/pages/PapersPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function PapersPage() {
  return (
    <div className="compact-papers">
      {/* Hero Section */}
      <section className="papers-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">📚</span>
            <span className="badge-text">Practice Papers</span>
          </div>
          <h1 className="hero-title">
            Previous Year <span className="gradient-text">Papers</span>
          </h1>
          <p className="hero-subtitle">
            Practice with actual previous year papers from AIMERS Coaching and major boards.
            Download papers, test yourself, and access solutions for comprehensive self-evaluation.
          </p>
        </div>
      </section>
      
      {/* Papers Section */}
      <section className="papers-section">
        <div className="content-container">
          <div className="section-header">
            <h2>Available Papers</h2>
            <p>Choose from our comprehensive collection of previous year papers and practice materials.</p>
          </div>
          
          <div className="papers-grid">
            <div className="paper-card">
              <div className="card-icon">
                <i className="fas fa-file-archive"></i>
              </div>
              <div className="card-content">
                <h3>AIMERS Institute Papers</h3>
                <p>Access the actual previous year papers used at AIMERS for classes 9–12.</p>
                <div className="card-meta">
                  <span className="feature">
                    <i className="fas fa-download"></i>
                    Download Available
                  </span>
                  <span className="feature">
                    <i className="fas fa-check-circle"></i>
                    Solutions Included
                  </span>
                </div>
              </div>
              <div className="card-actions">
                <a href="/papers/aimers" className="card-button">
                  <i className="fas fa-eye"></i>
                  View & Download
                </a>
              </div>
            </div>
            
            <Link to="/papers/explore" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="paper-card">
                <div className="card-icon">
                  <i className="fas fa-university"></i>
                </div>
                <div className="card-content">
                  <h3>Board Exam Papers</h3>
                  <p>Find solved and unsolved sets from CBSE/State Board exams (last 5 years), organized by class and subject.</p>
                  <div className="card-meta">
                    <span className="feature">
                      <i className="fas fa-calendar-alt"></i>
                      Last 5 Years
                    </span>
                    <span className="feature">
                      <i className="fas fa-layer-group"></i>
                      Multiple Boards
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <span className="card-button">
                    <i className="fas fa-search"></i>
                    Explore Board Papers
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
