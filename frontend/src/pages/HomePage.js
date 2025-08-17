import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  
  // Array of images for the carousel
  const heroImages = [
    {
      src: `${process.env.PUBLIC_URL}/1.png`,
      alt: "AIMERS Logo",
      title: "Welcome to AIMERS"
    },
    {
      src: `${process.env.PUBLIC_URL}/2.png`,
      alt: "AIMERS Logo",
      title: "Welcome to AIMERS"
    },
    {
      src: `${process.env.PUBLIC_URL}/3.png`,
      alt: "AIMERS Logo",
      title: "Welcome to AIMERS"
    },
    {
      src: `${process.env.PUBLIC_URL}/4.png`,
      alt: "AIMERS Logo",
      title: "Welcome to AIMERS"
    }
  ];

  // Debug: Log the image path
  console.log('Image path:', heroImages[0].src);
  console.log('Public URL:', process.env.PUBLIC_URL);

  // Testimonials data
  const testimonials = [
    {
      quote: "AIMERS gave me full control — lectures, doubt posting, DPPs — all in one smooth place.",
      name: "Aarav B.",
      role: "Grade 10",
      type: "left"
    },
    {
      quote: "My child's scores improved and doubts got answered quickly. The site's clarity helps a lot.",
      name: "Mrs. Iqbal",
      role: "Parent",
      type: "center"
    },
    {
      quote: "Easy access to old papers, stats, and doubts. A site that keeps me on track!",
      name: "Priya T.",
      role: "Grade 12",
      type: "right"
    },
    {
      quote: "The video lectures are crystal clear and the DPPs are perfectly aligned with our syllabus.",
      name: "Rahul K.",
      role: "Grade 11",
      type: "left"
    },
    {
      quote: "As a parent, I love how transparent and organized everything is. Great platform!",
      name: "Mr. Sharma",
      role: "Parent",
      type: "center"
    },
    {
      quote: "Best coaching platform I've used. The community support is amazing!",
      name: "Ananya S.",
      role: "Grade 12",
      type: "right"
    },
    {
      quote: "Best coaching platform I've used. The community support is amazing!",
      name: "Ananya S.",
      role: "Grade 12",
      type: "right"
    }
  ];

  // Auto-scroll effect for hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto-scroll effect for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Manual navigation for hero images
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  // Manual navigation for testimonials
  const goToTestimonial = (index) => {
    setCurrentTestimonialIndex(index);
  };

  const goToNextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Simple function to get visible testimonials
  const getVisibleTestimonials = () => {
    const total = testimonials.length;
    const prevIndex = currentTestimonialIndex === 0 ? total - 1 : currentTestimonialIndex - 1;
    const nextIndex = currentTestimonialIndex === total - 1 ? 0 : currentTestimonialIndex + 1;
    
    return [
      { index: prevIndex, position: 'prev' },
      { index: currentTestimonialIndex, position: 'current' },
      { index: nextIndex, position: 'next' }
    ];
  };

  return (
    <div className="compact-homepage">
      {/* Compact Hero Section */}
      <section className="compact-hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">🎓</span>
              <span className="badge-text">Premium Learning Platform</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line">Unlock Your</span>
              <span className="title-highlight">Academic Potential</span>
            </h1>
            <p className="hero-subtitle">
              Experience the future of education with expert-led video lectures, comprehensive DPPs, and a supportive learning community
            </p>
            <div className="hero-actions">
              <Link to="/courses" className="cta-button primary">
                <i className="fas fa-play"></i>
                Start Learning
              </Link>
              <Link to="/about" className="cta-button secondary">
                <i className="fas fa-info-circle"></i>
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="image-carousel">
              <div className="carousel-container">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
                    style={{
                      transform: `translateX(${(index - currentImageIndex) * 100}%)`
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="carousel-image"
                      onError={(e) => {
                        console.error('Image failed to load:', image.src);
                        console.error('Error event:', e);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', image.src);
                      }}
                    />
                    <div className="image-overlay">
                      <h3 className="image-title">{image.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation arrows */}
              <button className="carousel-nav prev" onClick={goToPrevious}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="carousel-nav next" onClick={goToNext}>
                <i className="fas fa-chevron-right"></i>
              </button>
              
              {/* Dots indicator */}
              <div className="carousel-dots">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <h2>Why Choose AIMERS?</h2>
            <p>Everything you need for academic excellence in one platform</p>
          </div>
          
          <div className="features-grid">
            <Link to="/courses" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">
                <i className="fas fa-video"></i>
              </div>
              <div className="feature-content">
                <h3>On-Demand Lectures</h3>
                <p>Watch and revisit every key lesson whenever inspiration or revision strikes.</p>
                <div className="feature-meta">
                  <span className="feature-tag">Premium</span>
                  <span className="feature-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
            
            <Link to="/dpps" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="feature-content">
                <h3>Daily Practice Problems</h3>
                <p>Consistent, syllabus-aligned DPPs that help you track and improve day by day.</p>
                <div className="feature-meta">
                  <span className="feature-tag">Comprehensive</span>
                  <span className="feature-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
            
            <Link to="/my-account" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">
                <i className="fas fa-comments"></i>
              </div>
              <div className="feature-content">
                <h3>Community Support</h3>
                <p>Ask doubts, share tips, receive guidance, and celebrate your progress with peers.</p>
                <div className="feature-meta">
                  <span className="feature-tag">Interactive</span>
                  <span className="feature-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section className="papers-section" id="papers">
        <div className="section-container">
          <div className="section-header">
            <h2>Previous Year Papers</h2>
            <p>Download authentic AIMERS and Board papers instantly—organized by class and subject with clear solutions.</p>
          </div>
          
          <div className="papers-grid">
            <Link to="/papers" className="paper-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="paper-icon">
                <i className="fas fa-file-archive"></i>
              </div>
              <div className="paper-content">
                <h3>AIMERS Institute Papers</h3>
                <p>Past AIMERS test sets perfect for targeted revision and classroom practice.</p>
                <div className="paper-meta">
                  <span className="paper-tag">Institute</span>
                  <span className="paper-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
            
            <Link to="/papers/explore" className="paper-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="paper-icon">
                <i className="fas fa-university"></i>
              </div>
              <div className="paper-content">
                <h3>Board Exam Papers</h3>
                <p>CBSE and State board papers with official solutions, sorted by year and subject.</p>
                <div className="paper-meta">
                  <span className="paper-tag">Official</span>
                  <span className="paper-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2>What Our Students & Parents Say</h2>
            <p>Real feedback from our community</p>
          </div>
          
          <div className="testimonial-carousel">
            <div className="testimonial-container">
              {getVisibleTestimonials().map(({ index, position }) => (
                <div
                  key={`${index}-${position}`}
                  className={`testimonial-slide ${position === 'current' ? 'active' : ''}`}
                >
                  <div className="testimonial-card">
                    <div className="quote-icon">
                      <i className="fas fa-quote-left"></i>
                    </div>
                    <blockquote>{testimonials[index].quote}</blockquote>
                    <div className="testimonial-author">
                      <strong>{testimonials[index].name}</strong>
                      <span>{testimonials[index].role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="nav-btn prev" onClick={goToPreviousTestimonial}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="nav-btn next" onClick={goToNextTestimonial}>
              <i className="fas fa-chevron-right"></i>
            </button>
            
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonialIndex ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
