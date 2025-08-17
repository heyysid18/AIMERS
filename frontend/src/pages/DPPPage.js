import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "../Theme.css";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

const dppSubjects = [
  {
    subject: "Mathematics",
    description:
      "Algebra, Geometry, Calculus, and more—daily problem sets for each chapter with solutions.",
    icon: "fas fa-calculator",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  {
    subject: "Physics",
    description:
      "Mechanics, Thermodynamics, Optics—daily practice problems for physics concepts and numericals.",
    icon: "fas fa-atom",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  },
  {
    subject: "Chemistry",
    description:
      "Organic, Inorganic, Physical Chemistry—chapter-wise DPPs for chemical concepts and reactions.",
    icon: "fas fa-flask",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
  {
    subject: "Biology",
    description:
      "Botany, Zoology, Human Physiology—daily practice for biological concepts and diagrams.",
    icon: "fas fa-dna",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

export default function DPPPage() {
  const { token, user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dppProgress, setDppProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [dppAvailability, setDppAvailability] = useState({});
  const navigate = useNavigate();

  // Fetch DPP progress when subject is selected
  useEffect(() => {
    if (user?.grade && selectedSubject && token) {
      fetchDppProgress();
      fetchDppAvailability();
    }
  }, [selectedSubject, token, user?.grade]);

  const fetchDppProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/dpp-progress/${user?.grade}/${selectedSubject.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDppProgress(response.data.progress || {});
    } catch (error) {
      console.error('Error fetching DPP progress:', error);
      setDppProgress({});
    } finally {
      setLoading(false);
    }
  };

  // Check if DPP is available for a specific date
  const isDppAvailable = async (date) => {
    try {
      // First check database DPP
      const response = await axios.get(
        `${API_BASE_URL}/dpps/check/${user?.grade}/${selectedSubject.toLowerCase()}/${date}`
      );
      if (response.data.available) {
        return true;
      }
      
      // If not in database, check if it's a weekday (Monday to Friday)
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday = 1, Friday = 5
    } catch (error) {
      console.error('Error checking DPP availability:', error);
      return false;
    }
  };

  const fetchDppAvailability = async () => {
    try {
      const currentDate = new Date();
      const availability = {};
      
      // Check availability for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        const dateStr = format(date, 'yyyy-MM-dd');
        availability[dateStr] = await isDppAvailable(dateStr);
      }
      
      setDppAvailability(availability);
    } catch (error) {
      console.error('Error fetching DPP availability:', error);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (dppAvailability[dateStr]) {
      navigate(`/dpps/view/${user?.grade}/${selectedSubject.toLowerCase()}/${dateStr}`);
    }
  };

  const handleDppCompletion = async (date, isCompleted) => {
    if (!token) return;

    try {
      await axios.post(
        `${API_BASE_URL}/dashboard/track-dpp`,
        {
          dppId: `${user?.grade}-${selectedSubject.toLowerCase()}-${date}`,
          subject: selectedSubject.toLowerCase(),
          completed: isCompleted,
          grade: user?.grade
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDppProgress(prev => ({
        ...prev,
        [date]: isCompleted
      }));
    } catch (error) {
      console.error('Error updating DPP completion:', error);
    }
  };

  const getCompletionStats = () => {
    const total = Object.keys(dppAvailability).length;
    const completed = Object.values(dppProgress).filter(Boolean).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const resetView = () => {
    setSelectedSubject(null);
    setDppProgress({});
    setDppAvailability({});
  };

  const resetToSubjects = () => {
    setSelectedSubject(null);
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const isAvailable = dppAvailability[dateStr];
    const isCompleted = dppProgress[dateStr];
    
    if (!isAvailable) return null;
    
    return (
      <div className="calendar-tile-content">
        {isCompleted ? (
          <div className="completion-indicator completed">
            <i className="fas fa-check"></i>
          </div>
        ) : (
          <div className="completion-indicator available">
            <i className="fas fa-file-alt"></i>
          </div>
        )}
      </div>
    );
  };

  const stats = getCompletionStats();

  return (
    <div className="compact-dpp">
      {/* Header */}
      <header className="dpp-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Daily Practice Problems</h1>
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
          
          {user?.grade && selectedSubject && (
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
                    stroke="url(#dppProgressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - stats.percentage / 100)}`}
                  />
                  <defs>
                    <linearGradient id="dppProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="progress-text">{stats.percentage}%</span>
              </div>
              <div className="progress-info">
                <span className="progress-label">{selectedSubject} DPPs</span>
                <span className="progress-stats">
                  {stats.completed} of {stats.total} completed
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="dpp-content">
        {user?.grade && !selectedSubject && (
          <section className="subjects-section">
            <div className="section-header">
              <h2>Choose Your Subject</h2>
              <p>Select a subject to access daily practice problems</p>
            </div>
            
            <div className="subjects-grid">
              {dppSubjects.map((subject, index) => (
                <div 
                  key={subject.subject}
                  className="subject-card"
                  onClick={() => setSelectedSubject(subject.subject)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-icon" style={{ background: subject.gradient }}>
                    <i className={subject.icon}></i>
                  </div>
                  <div className="card-content">
                    <h3>{subject.subject}</h3>
                    <p>{subject.description}</p>
                    <div className="card-meta">
                      <span className="availability">
                        <i className="fas fa-calendar-check"></i>
                        Daily DPPs
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

        {user?.grade && selectedSubject && (
          <section className="calendar-section">
            <div className="section-header">
              <button 
                className="back-button"
                onClick={resetToSubjects}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Subjects
              </button>
              <div className="header-content">
                <h2>{selectedSubject} DPPs</h2>
                <p>Click on available dates to access daily practice problems</p>
              </div>
            </div>

            <div className="calendar-container">
              <Calendar
                onChange={handleDateClick}
                tileContent={tileContent}
                className="dpp-calendar"
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
              
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-indicator available">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <span>DPP Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-indicator completed">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
