import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Send data to backend API endpoint
    setSubmitted(true);
    // Optionally reset form: setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="compact-contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">📞</span>
            <span className="badge-text">Get in Touch</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">Contact</span>
            <span className="title-highlight">AIMERS</span>
          </h1>
          <p className="hero-subtitle">
            We're here for you! Use the details below, or fill out our query form — our team will respond promptly to help you with any questions or concerns.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="contact-content">
        <div className="content-container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="section-header">
                <h2>Contact Details</h2>
                <div className="section-divider"></div>
              </div>
              
              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Main Office</h3>
                    <a href="tel:+919833312345">+91-98333-12345</a>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Student Support</h3>
                    <a href="tel:+919561234567">+91-95612-34567</a>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h3>General Support</h3>
                    <a href="mailto:support@aimerscoaching.com">support@aimerscoaching.com</a>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <i className="fas fa-envelope-open"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Admissions</h3>
                    <a href="mailto:admissions@aimerscoaching.com">admissions@aimerscoaching.com</a>
                  </div>
                </div>

                <div className="contact-card address-card">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Visit Us</h3>
                    <div className="address">
                      3rd Floor, Universal Plaza,<br />
                      MG Road, Jaipur, Rajasthan, India 302001
                    </div>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="https://facebook.com/aimerscoaching" aria-label="Facebook" className="social-link">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="https://twitter.com/aimerscoaching" aria-label="Twitter" className="social-link">
                    <i className="fab fa-x-twitter"></i>
                  </a>
                  <a href="https://instagram.com/aimerscoaching" aria-label="Instagram" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://youtube.com/AIMERSCoaching" aria-label="YouTube" className="social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="section-header">
                <h2>Send us a Message</h2>
                <div className="section-divider"></div>
              </div>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for your query! Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-user"></i>
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your full name"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-envelope"></i>
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your email"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-phone"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        pattern="[0-9+ ]*"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your phone number (optional)"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-tag"></i>
                        Subject <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="What's this about?"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-comment"></i>
                      Message <span className="required">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      required
                      value={form.message}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-button">
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
