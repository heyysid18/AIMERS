// src/pages/AboutPage.js

import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="compact-about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎓</span>
            <span className="badge-text">About AIMERS</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">Next-Generation</span>
            <span className="title-highlight">Learning Platform</span>
          </h1>
          <p className="hero-subtitle">
            Combining trusted coaching with an intuitive online platform. Discover our mission, our team, and what makes AIMERS unique in the educational landscape.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="about-content">
        <div className="content-container">
          {/* Who We Are Section */}
          <section className="about-section">
            <div className="section-header">
              <h2>Who We Are</h2>
              <div className="section-divider"></div>
            </div>
            <div className="section-content">
              <p className="section-text">
                <strong>AIMERS Coaching</strong> is a modern platform dedicated to bringing high-quality, mentor-guided learning to Grades 9–12 in Mathematics, Science, and Social Science. We blend proven teaching experience with new digital tools, giving students flexibility, support, and deep understanding from anywhere.
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="about-section">
            <div className="section-header">
              <h2>Our Mission</h2>
              <div className="section-divider"></div>
            </div>
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3>Inspire & Empower</h3>
                <p>To inspire and empower every student to reach their true academic potential.</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Joyful Learning</h3>
                <p>To create a joyful, stress-free preparation environment, from basics through board exams.</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3>Premium Resources</h3>
                <p>To provide top-notch resources, live mentorship, and organized practice in a clean, tech-forward interface.</p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="about-section">
            <div className="section-header">
              <h2>Why Choose AIMERS?</h2>
              <div className="section-divider"></div>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-play-circle"></i>
                </div>
                <div className="feature-content">
                  <h3>Replayable Lectures</h3>
                  <p>Study at your own pace with clear, recorded lessons you can revisit anytime.</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="feature-content">
                  <h3>Daily Practice</h3>
                  <p>Consistent DPPs and regular self-assessment tools for Math, Science, and Social Science.</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-file-archive"></i>
                </div>
                <div className="feature-content">
                  <h3>Board & AIMERS Papers</h3>
                  <p>Instantly access actual exam sets for focused, exam-ready revision.</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <div className="feature-content">
                  <h3>Doubt Forum</h3>
                  <p>Post queries, get help from mentors and peers, and build confidence collaboratively.</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="feature-content">
                  <h3>Progress Dashboard</h3>
                  <p>Stay organized with personalized study stats and reminders.</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="feature-content">
                  <h3>Supportive Community</h3>
                  <p>Friendly interface, clear navigation, and quick contact with our team.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="about-section">
            <div className="section-header">
              <h2>Meet Our Team</h2>
              <div className="section-divider"></div>
            </div>
            <div className="team-content">
              <div className="team-grid">
                <div className="team-card">
                  <div className="team-icon">
                    <i className="fas fa-chalkboard-teacher"></i>
                  </div>
                  <h3>Expert Educators</h3>
                  <p>Board examiners, IIT/NIT graduates, and experienced school educators who care about each student's journey.</p>
                </div>
                <div className="team-card">
                  <div className="team-icon">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <h3>Tech Team</h3>
                  <p>Behind the scenes, AIMERS tech and support staff keep the platform robust, secure, fast, and accessible to all.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-content">
              <div className="cta-badge">
                <span className="badge-icon">🚀</span>
                <span className="badge-text">Ready to Start?</span>
              </div>
              <h2>Join the AIMERS Community</h2>
              <p>Whether you aim to top your board exams or simply want to build steady confidence, AIMERS Coaching is with you every step. Join thousands of students who have already transformed their academic performance.</p>
              <div className="cta-actions">
                <Link to="/courses" className="cta-button primary">
                  <i className="fas fa-play"></i>
                  Start Learning
                </Link>
                <Link to="/contact" className="cta-button secondary">
                  <i className="fas fa-envelope"></i>
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
