import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoModal from "../components/VideoModal";
import { useAuth } from "../contexts/AuthContext";
import "../Theme.css";

// Enhanced course data structure
const courseData = {
  10: {
    Mathematics: {
      icon: "fas fa-calculator",
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      topics: [
        {
          id: "math-1",
          topic: "Real Numbers",
          description: "Understanding real numbers, rational and irrational numbers",
          video: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          dpp: "/uploads/dpps/10th/mathematics/real-numbers.pdf",
          duration: "45 min",
          difficulty: "Beginner",
          thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop"
        },
        {
          id: "math-2", 
          topic: "Quadratic Equations",
          description: "Solving quadratic equations using various methods",
          video: "https://www.youtube.com/watch?v=tNkz5A8xi0k",
          dpp: "/uploads/dpps/10th/mathematics/quadratic-equations.pdf",
          duration: "60 min",
          difficulty: "Intermediate",
          thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop"
        }
      ]
    },
    Physics: {
      icon: "fas fa-atom",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      topics: [
        {
          id: "physics-1",
          topic: "Mechanics",
          description: "Understanding motion, forces, and energy",
          video: "https://www.youtube.com/watch?v=VYMdOc_apy0",
          dpp: "/uploads/dpps/10th/physics/mechanics.pdf",
          duration: "75 min",
          difficulty: "Intermediate",
          thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop"
        }
      ]
    },
    Chemistry: {
      icon: "fas fa-flask",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      topics: [
        {
          id: "chem-1",
          topic: "Chemical Bonding",
          description: "Ionic, covalent, and metallic bonding concepts",
          video: "https://www.youtube.com/watch?v=test-chem",
          dpp: "/uploads/dpps/10th/chemistry/chemical-bonding.pdf",
          duration: "50 min",
          difficulty: "Beginner",
          thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop"
        }
      ]
    }
  },
  12: {
    Mathematics: {
      icon: "fas fa-calculator",
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      topics: [
        {
          id: "math-12-1",
          topic: "Differentiation",
          description: "Understanding derivatives and their applications",
          video: "https://youtube.com/watch?v=YNC7W4R5rsU",
          dpp: "/uploads/dpps/12th/mathematics/differentiation.pdf",
          duration: "90 min",
          difficulty: "Advanced",
          thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop"
        }
      ]
    },
    Physics: {
      icon: "fas fa-atom",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      topics: [
        {
          id: "physics-12-1",
          topic: "Electrostatics",
          description: "Electric charges, fields, and potential",
          video: "https://youtu.be/2n1xRhzWl2k",
          dpp: "/uploads/dpps/12th/physics/electrostatics.pdf",
          duration: "80 min",
          difficulty: "Advanced",
          thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop"
        }
      ]
    }
  }
};

export default function CoursesPage() {
  const { token, user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    videoTitle: ''
  });

  // Fetch completion status when subject is selected
  useEffect(() => {
    if (user?.grade && selectedSubject) {
      fetchCompletionStatus();
    }
  }, [user?.grade, selectedSubject, token]);

  const fetchCompletionStatus = async () => {
    if (!token) {
      setCompletionStatus({
        'math-1': true,
        'math-2': false,
        'physics-1': true,
        'chem-1': false
      });
      return;
    }
    
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dashboard/completion-status/${user?.grade}/${selectedSubject.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCompletionStatus(response.data.completionStatus || {});
    } catch (error) {
      console.error('Error fetching completion status:', error);
      setCompletionStatus({
        'math-1': true,
        'math-2': false,
        'physics-1': true,
        'chem-1': false
      });
    }
  };

  const handleCompletionToggle = async (topicId, isCompleted) => {
    setCompletionStatus(prev => ({
      ...prev,
      [topicId]: isCompleted
    }));

    if (!token) return;

    try {
      await axios.post(
        'http://localhost:5000/api/dashboard/track-video',
        {
          videoId: topicId,
          subject: selectedSubject.toLowerCase(),
          watched: isCompleted,
          grade: user?.grade
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const openVideoModal = (videoUrl, videoTitle) => {
    setVideoModal({
      isOpen: true,
      videoUrl,
      videoTitle
    });
  };

  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      videoUrl: '',
      videoTitle: ''
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const calculateProgress = () => {
    if (!selectedSubject || !user?.grade) return 0;
    const topics = courseData[user.grade][selectedSubject]?.topics || [];
    const completed = topics.filter(topic => completionStatus[topic.id]).length;
    return topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className="compact-academy">
      {/* Compact Header */}
      <header className="compact-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Learning Dashboard</h1>
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
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="progress-text">{progress}%</span>
              </div>
              <div className="progress-info">
                <span className="progress-label">{selectedSubject}</span>
                <span className="progress-stats">
                  {courseData[user.grade][selectedSubject]?.topics.filter(topic => completionStatus[topic.id]).length} of {courseData[user.grade][selectedSubject]?.topics.length} completed
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {user?.grade && !selectedSubject && (
          <section className="subjects-section">
            <div className="section-header">
              <h2>Choose Your Subject</h2>
              <p>Select a subject to start learning</p>
            </div>
            
            <div className="subjects-grid">
              {Object.entries(courseData[user.grade]).map(([subject, data], index) => (
                <div 
                  key={subject}
                  className="subject-card"
                  onClick={() => setSelectedSubject(subject)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-icon" style={{ background: data.gradient }}>
                    <i className={data.icon}></i>
                  </div>
                  <div className="card-content">
                    <h3>{subject}</h3>
                    <p>{data.topics.length} lectures</p>
                    <div className="card-meta">
                      <span className="duration">
                        <i className="fas fa-clock"></i>
                        {data.topics.reduce((total, topic) => {
                          const duration = parseInt(topic.duration);
                          return total + (isNaN(duration) ? 0 : duration);
                        }, 0)} min
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
          <section className="topics-section">
            <div className="section-header">
              <button 
                className="back-button"
                onClick={() => setSelectedSubject(null)}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Subjects
              </button>
              <div className="header-content">
                <h2>{selectedSubject}</h2>
                <p>Complete all lectures to master this subject</p>
              </div>
            </div>

            <div className="topics-list">
              {courseData[user.grade][selectedSubject]?.topics.map((topic, index) => (
                <div 
                  key={topic.id}
                  className={`topic-item ${completionStatus[topic.id] ? 'completed' : ''}`}
                >
                  <div className="topic-content">
                    <div className="topic-header">
                      <div className="topic-number">
                        {completionStatus[topic.id] ? (
                          <i className="fas fa-check-circle completed-icon"></i>
                        ) : (
                          <span className="number-badge">{index + 1}</span>
                        )}
                      </div>
                      <div className="topic-info">
                        <h3>{topic.topic}</h3>
                        <p className="topic-description">{topic.description}</p>
                      </div>
                    </div>
                    
                    <div className="topic-actions">
                      <button
                        className="watch-button"
                        onClick={() => openVideoModal(topic.video, topic.topic)}
                      >
                        <i className="fas fa-play"></i>
                        Watch Lecture
                      </button>
                      
                      <label className="completion-toggle">
                        <input
                          type="checkbox"
                          checked={completionStatus[topic.id] || false}
                          onChange={(e) => handleCompletionToggle(topic.id, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">
                          {completionStatus[topic.id] ? 'Completed' : 'Mark complete'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        videoTitle={videoModal.videoTitle}
      />
    </div>
  );
}


