import React, { useState, useEffect, useLayoutEffect } from "react";
import VideoModal from "../components/VideoModal";
import { useAuth } from "../contexts/AuthContext";
import { fetchCompletionStatus, trackVideoProgress, fetchVideoTopics } from "../api/api";
import "../Theme.css";

export default function CoursesPage() {
  const { token, user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  
  // New state for dynamic course data
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch video topics from backend
  const fetchVideoTopicsForGrade = async (grade) => {
    try {
      setLoading(true);
      const subjects = ['mathematics', 'physics', 'chemistry', 'biology'];
      const gradeData = {};
      
      for (const subject of subjects) {
        try {
          const response = await fetchVideoTopics(grade, subject);
          if (response.data && response.data.videoTopics) {
            gradeData[subject.charAt(0).toUpperCase() + subject.slice(1)] = {
              icon: getSubjectIcon(subject),
              color: getSubjectColor(subject),
              gradient: getSubjectGradient(subject),
              topics: response.data.videoTopics.map((video, index) => ({
                id: `${subject}-${grade}-${index + 1}`,
                topic: video.topic,
                video: video.url,
                thumbnail: getDefaultThumbnail(subject)
              }))
            };
          }
        } catch (error) {
          console.error(`Error fetching ${subject} videos:`, error);
          // Use default structure if API fails
          gradeData[subject.charAt(0).toUpperCase() + subject.slice(1)] = {
            icon: getSubjectIcon(subject),
            color: getSubjectColor(subject),
            gradient: getSubjectGradient(subject),
            topics: []
          };
        }
      }
      
      setCourseData(prev => ({ ...prev, [grade]: gradeData }));
    } catch (error) {
      console.error('Error fetching video topics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for subject styling
  const getSubjectIcon = (subject) => {
    const icons = {
      mathematics: "fas fa-calculator",
      physics: "fas fa-atom",
      chemistry: "fas fa-flask",
      biology: "fas fa-dna"
    };
    return icons[subject] || "fas fa-book";
  };

  const getSubjectColor = (subject) => {
    const colors = {
      mathematics: "#6366f1",
      physics: "#06b6d4",
      chemistry: "#f59e0b",
      biology: "#10b981"
    };
    return colors[subject] || "#6b7280";
  };

  const getSubjectGradient = (subject) => {
    const gradients = {
      mathematics: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      physics: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      chemistry: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      biology: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    };
    return gradients[subject] || "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
  };

  const getDefaultThumbnail = (subject) => {
    return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop";
  };

  // Fetch completion status when subject is selected
  useEffect(() => {
    if (user?.grade && selectedSubject) {
      // Add a small delay to prevent lag on rapid subject changes
      const timeoutId = setTimeout(() => {
        fetchCompletionStatus();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedSubject]); // Removed user?.grade and token from dependencies

  // Fetch video topics when component mounts
  useEffect(() => {
    fetchVideoTopicsForGrade(10);
    fetchVideoTopicsForGrade(12);
  }, []);

  // Scroll to top when user changes or component mounts
  useEffect(() => {
    if (user?.grade) {
      scrollToTop();
    }
  }, [user?.grade]);

  // Instant scroll to top when subject changes (no smooth behavior to reduce lag)
  useLayoutEffect(() => {
    if (selectedSubject) {
      window.scrollTo({
        top: 0,
        behavior: 'auto' // Changed from 'smooth' to 'auto' for instant scroll
      });
    }
  }, [selectedSubject]);

  const fetchCompletionStatus = async () => {
    if (!token || !selectedSubject) {
      console.log('No token or subject, using fallback completion status');
      setCompletionStatus({
        'math-1': true,
        'math-2': false,
        'physics-1': true,
        'chem-1': false
      });
      return;
    }
    
    try {
      console.log('Fetching completion status for:', user?.grade, selectedSubject);
      const response = await fetchCompletionStatus(user?.grade, selectedSubject.toLowerCase());
      console.log('Completion status response:', response);
      setCompletionStatus(response.data.completionStatus || {});
    } catch (error) {
      console.error('Error fetching completion status:', error);
      console.log('Using fallback completion status');
      setCompletionStatus({
        'math-1': true,
        'math-2': false,
        'physics-1': true,
        'chem-1': false
      });
    }
  };

  const handleCompletionToggle = async (topicId, isCompleted) => {
    console.log('Toggling completion for topic:', topicId, 'to:', isCompleted);
    
    setCompletionStatus(prev => ({
      ...prev,
      [topicId]: isCompleted
    }));

    if (!token) {
      console.log('No token, skipping API call');
      return;
    }

    try {
      console.log('Sending completion update to API:', {
        videoId: topicId,
        subject: selectedSubject.toLowerCase(),
        watched: isCompleted,
        grade: user?.grade
      });
      
      const response = await trackVideoProgress({
        videoId: topicId,
        subject: selectedSubject.toLowerCase(),
        watched: isCompleted,
        grade: user?.grade
      });
      
      console.log('API response:', response);
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    // Instant scroll to top when subject is selected (no smooth behavior)
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    // Instant scroll to top when going back to subjects
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  const openVideoModal = (videoUrl, videoTitle) => {
    console.log('Opening video modal with URL:', videoUrl, 'and title:', videoTitle);
    if (!videoUrl) {
      console.error('No video URL provided');
      return;
    }
    setSelectedVideo(videoUrl);
    setSelectedVideoTitle(videoTitle);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
    setSelectedVideoTitle(null);
  };



  const calculateProgress = () => {
    if (!selectedSubject || !user?.grade) return 0;
    const topics = courseData[user.grade][selectedSubject]?.topics || [];
    const completed = topics.filter(topic => completionStatus[topic.id]).length;
    return topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className="compact-papers">
      {/* Hero Section - Only show when no subject is selected */}
      {!selectedSubject && (
        <section className="papers-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🎓</span>
              <span className="badge-text">Learning Dashboard</span>
            </div>
            <h1 className="hero-title">
              Interactive <span className="gradient-text">Learning</span>
            </h1>
            <p className="hero-subtitle">
              Master concepts through comprehensive video lessons, practice problems, and interactive exercises. 
              Choose your subject and start your learning journey with AIMERS.
            </p>
          </div>
        </section>
      )}
      
      {/* Main Content */}
      <section className="papers-section">
        <div className="content-container">
          {user?.grade && !selectedSubject && (
            <div className="fade-in">
              <div className="section-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <h2>Choose Your Subject</h2>
                    <p>Select a subject to start learning</p>
                  </div>
                  <button 
                    onClick={() => {
                      fetchVideoTopicsForGrade(10);
                      fetchVideoTopicsForGrade(12);
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    disabled={loading}
                  >
                    {loading ? '🔄 Loading...' : '🔄 Refresh Videos'}
                  </button>
                </div>
              </div>
              
              {loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Loading video topics from database...
                </div>
              )}
              
              <div className="courses-subjects-grid">
                {Object.entries(courseData[user.grade] || {}).map(([subject, data], index) => (
                  <div 
                    key={subject}
                    className="courses-subject-card"
                    onClick={() => handleSubjectSelect(subject)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="courses-subject-header">
                      <div className="courses-subject-icon" style={{ background: data.gradient }}>
                        <i className={data.icon}></i>
                      </div>
                      <div>
                        <h3 className="courses-subject-title">{subject}</h3>
                        <p className="courses-subject-description">
                          {data.topics && data.topics.length > 0 
                            ? `${data.topics.length} video lesson${data.topics.length !== 1 ? 's' : ''} available`
                            : 'No video lessons yet - upload some videos!'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="courses-subject-meta">
                      <span className="courses-subject-feature">
                        📹 Video Lessons
                      </span>
                      <span className="courses-subject-feature">
                        📝 Practice Problems
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {!loading && Object.keys(courseData[user.grade] || {}).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>No video topics found. Upload some videos using the Upload page!</p>
                  <button 
                    onClick={() => window.location.href = '/upload'}
                    style={{
                      padding: '12px 24px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      marginTop: '16px'
                    }}
                  >
                    📤 Go to Upload Page
                  </button>
                </div>
              )}
            </div>
          )}

          {user?.grade && selectedSubject && (
            <div className="fade-in">
              <div className="section-header">
                <button className="back-btn" onClick={handleBackToSubjects}>
                  ← Back to Subjects
                </button>
                <h2>{selectedSubject} Learning Path</h2>
                <p>Master {selectedSubject.toLowerCase()} through structured lessons and practice</p>
              </div>
              
              {/* Progress summary */}
              <div className="course-progress">
                <div className="course-progress-bar">
                  <div className="course-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="course-progress-text">{progress}% complete</div>
              </div>

              {/* Modern topic list */}
              <ul className="course-topic-list">
                {courseData[user.grade]?.[selectedSubject]?.topics?.length > 0 ? (
                  courseData[user.grade][selectedSubject].topics.map((topic) => (
                    <li key={topic.id} className={`course-topic-item ${completionStatus[topic.id] ? 'completed' : ''}`}>
                      <div className="topic-left">
                        <div className="topic-icon" style={{ background: courseData[user.grade][selectedSubject].gradient }}>
                          <i className="fas fa-play"></i>
                        </div>
                        <div className="topic-main">
                          <h3 className="topic-title">{topic.topic}</h3>
                        </div>
                      </div>

                      <div className="topic-actions">
                        <button className="watch-button" onClick={() => openVideoModal(topic.video, topic.topic)}>
                          <span>▶️</span>
                          Watch
                        </button>
                        <label className={`complete-toggle ${completionStatus[topic.id] ? 'completed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={!!completionStatus[topic.id]}
                            onChange={(e) => handleCompletionToggle(topic.id, e.target.checked)}
                          />
                          <span>Completed</span>
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p>No video topics found for {selectedSubject} in Grade {user.grade}.</p>
                    <p>Upload some videos using the Upload page!</p>
                    <button 
                      onClick={() => window.location.href = '/upload'}
                      style={{
                        padding: '12px 24px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginTop: '16px'
                      }}
                    >
                      📤 Go to Upload Page
                    </button>
                  </div>
                )}
              </ul>
            </div>
          )}

          {!user?.grade && (
            <div className="fade-in">
              <div className="section-header">
                <h2>Welcome to AIMERS Learning</h2>
                <p>Please log in to access your personalized learning dashboard</p>
              </div>
              
              <div className="papers-grid">
                <div className="paper-card">
                  <div className="card-icon">
                    <i className="fas fa-sign-in-alt"></i>
                  </div>
                  <div className="card-content">
                    <h3>Get Started</h3>
                    <p>Log in to access comprehensive video lessons, practice problems, and daily practice materials.</p>
                    <div className="card-meta">
                      <span className="feature">
                        📹 Video Lessons
                      </span>
                      <span className="feature">
                        📝 Practice Problems
                      </span>

                    </div>
                  </div>
                  <div className="card-actions">
                    <span className="card-button">
                      <span>🔐</span>
                      Login Required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo}
          videoTitle={selectedVideoTitle}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
            setSelectedVideoTitle(null);
          }}
        />
      )}
    </div>
  );
}


