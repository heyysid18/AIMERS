import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Available subjects (matching backend folder structure)
const subjectsByClass = {
  "10th": ["Mathematics", "Physics", "Chemistry"],
  "12th": ["Physics", "Chemistry", "Biology", "Mathematics"],
};

// Generate last 20 years
const last20Years = Array.from({ length: 20 }, (_, i) => (2025 - i).toString());

export default function ExploreBoardPapers() {
  const { token, user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [paperProgress, setPaperProgress] = useState({});
  const [paperAvailability, setPaperAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set the user's grade as the default selected class
  useEffect(() => {
    if (user && user.grade) {
      setSelectedClass(`${user.grade}th`);
    }
  }, [user]);

  // Fetch paper progress when subject is selected
  useEffect(() => {
    if (selectedClass && selectedSubject && token) {
      fetchPaperProgress();
      fetchPaperAvailability();
    }
  }, [selectedClass, selectedSubject, token]);

  const fetchPaperProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/paper-progress/${selectedClass}/${selectedSubject.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPaperProgress(response.data.progress || {});
    } catch (error) {
      console.error('Error fetching paper progress:', error);
      setPaperProgress({});
    } finally {
      setLoading(false);
    }
  };

  const handlePaperCompletion = async (year, isCompleted) => {
    if (!token) return;

    try {
      await axios.post(
        `${API_BASE_URL}/dashboard/track-paper`,
        {
          paperId: `${selectedClass}-${selectedSubject}-${year}`,
          subject: selectedSubject.toLowerCase(),
          completed: isCompleted,
          grade: selectedClass,
          year: year
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPaperProgress(prev => ({
        ...prev,
        [year]: isCompleted
      }));
    } catch (error) {
      console.error('Error updating paper completion:', error);
    }
  };

  const getCompletionPercentage = () => {
    if (!paperProgress || Object.keys(paperProgress).length === 0) return 0;
    const completedCount = Object.values(paperProgress).filter(Boolean).length;
    const totalCount = Object.keys(paperProgress).length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  // Check if paper is available for a specific year
  const isPaperAvailable = async (year) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/papers/check/${selectedClass}/${selectedSubject.toLowerCase()}/${year}`
      );
      return response.data.available;
    } catch (error) {
      console.error('Error checking paper availability:', error);
      return false;
    }
  };

  const fetchPaperAvailability = async () => {
    try {
      const availability = {};
      for (const year of last20Years) {
        availability[year] = await isPaperAvailable(year);
      }
      setPaperAvailability(availability);
    } catch (error) {
      console.error('Error fetching paper availability:', error);
    }
  };

  const handleReset = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setPaperProgress({});
    setPaperAvailability({});
  };

  const handleYearClick = (year) => {
    if (paperAvailability[year]) {
      navigate(`/papers/board/${selectedClass}/${selectedSubject.toLowerCase()}/${year}`);
    }
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      "Mathematics": "fas fa-calculator",
      "Physics": "fas fa-atom",
      "Chemistry": "fas fa-flask",
      "Biology": "fas fa-dna"
    };
    return icons[subject] || "fas fa-book";
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Mathematics": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      "Physics": "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      "Chemistry": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      "Biology": "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    };
    return colors[subject] || "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="compact-explore">
      {/* Header */}
      <header className="explore-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Board Papers Explorer</h1>
            {user?.grade && (
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-grade">Grade {user.grade}</span>
                </div>
              </div>
            )}
          </div>


          {selectedClass && selectedSubject && (
            <div className="progress-summary">
              <div className="progress-circle">
                <svg viewBox="0 0 60 60">
                  <circle
                    className="progress-bg"
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    className="progress-fill"
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke="url(#exploreProgressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - completionPercentage / 100)}`}
                  />
                  <defs>
                    <linearGradient id="exploreProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="progress-text">{completionPercentage}%</span>
              </div>
              <div className="progress-info">
                <span className="progress-label">{selectedSubject} Papers</span>
                <span className="progress-stats">
                  {Object.values(paperProgress).filter(Boolean).length} of {Object.keys(paperProgress).length} completed
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="explore-content">
        {!selectedClass && (
          <section className="class-selection">
            <div className="section-header">
              <h2>Select Your Class</h2>
              <p>Choose your class to explore board papers</p>
            </div>
            
            <div className="class-grid">
              {Object.keys(subjectsByClass).map((className, index) => (
                <div 
                  key={className}
                  className="class-card"
                  onClick={() => setSelectedClass(className)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="class-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="class-content">
                    <h3>Class {className.replace('th', '')}</h3>
                    <p>{subjectsByClass[className].length} subjects available</p>
                    <div className="class-subjects">
                      {subjectsByClass[className].map(subject => (
                        <span key={subject} className="subject-tag">{subject}</span>
                      ))}
                    </div>
                  </div>
                  <div className="class-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedClass && !selectedSubject && (
          <section className="subject-selection">
            <div className="section-header">
              <button 
                className="back-button"
                onClick={handleReset}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Classes
              </button>
              <div className="header-content">
                <h2>Class {selectedClass.replace('th', '')} Subjects</h2>
                <p>Select a subject to explore board papers</p>
              </div>
            </div>
            
            <div className="subjects-grid">
              {subjectsByClass[selectedClass].map((subject, index) => (
                <div 
                  key={subject}
                  className="subject-card"
                  onClick={() => setSelectedSubject(subject)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-icon" style={{ background: getSubjectColor(subject) }}>
                    <i className={getSubjectIcon(subject)}></i>
                  </div>
                  <div className="card-content">
                    <h3>{subject}</h3>
                    <p>Board papers from 2005 to 2025</p>
                    <div className="card-meta">
                      <span className="availability">
                        <i className="fas fa-file-archive"></i>
                        {last20Years.length} Papers
                      </span>
                    </div>
                  </div>
                  <div className="card-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedClass && selectedSubject && (
          <section className="papers-section">
            <div className="section-header">
              <button 
                className="back-button"
                onClick={() => setSelectedSubject(null)}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Subjects
              </button>
              <div className="header-content">
                <h2>{selectedSubject} Board Papers</h2>
                <p>Click on available years to access board papers</p>
              </div>
            </div>

            <div className="papers-grid">
              {last20Years.map((year, index) => {
                const isAvailable = paperAvailability[year];
                const isCompleted = paperProgress[year];
                
                return (
                  <div 
                    key={year}
                    className={`paper-card ${isAvailable ? 'available' : 'unavailable'} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => isAvailable && handleYearClick(year)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="paper-icon">
                      <i className={isCompleted ? "fas fa-check-circle" : "fas fa-file-archive"}></i>
                    </div>
                    <div className="paper-content">
                      <h3>{year}</h3>
                      <p>{selectedSubject} Board Paper</p>
                      <div className="paper-meta">
                        {isAvailable ? (
                          <span className="status available">
                            <i className="fas fa-download"></i>
                            Available
                          </span>
                        ) : (
                          <span className="status unavailable">
                            <i className="fas fa-clock"></i>
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="completion-badge">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
