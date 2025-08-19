import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../Theme.css";

// API base URL - Use localhost for local testing, Render URL for production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://aimers-backend-clv3.onrender.com/api';

// Subject data with proper mapping
const subjects = [
  {
    name: "Mathematics",
    key: "mathematics",
    description: "Algebra, Geometry, Calculus, and more—daily problem sets for each chapter with solutions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
  },
  {
    name: "Physics",
    key: "physics",
    description: "Mechanics, Thermodynamics, Optics—daily practice problems for physics concepts and numericals.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    ),
    color: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  },
  {
    name: "Chemistry",
    key: "chemistry",
    description: "Organic, Inorganic, Physical Chemistry—chapter-wise DPPs for chemical concepts and reactions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3H15L17 5H21V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5H7L9 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
  {
    name: "Biology",
    key: "biology",
    description: "Botany, Zoology, Human Physiology—daily practice for biological concepts and diagrams.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C14.5013 22 16.8911 21.2098 18.6685 19.7557C20.4459 18.3016 21.5 16.2413 21.5 14C21.5 11.7587 20.4459 9.6984 18.6685 8.2443C16.8911 6.7902 14.5013 6 12 6C9.49872 6 7.10891 6.7902 5.33147 8.2443C3.55403 9.6984 2.5 11.7587 2.5 14C2.5 16.2413 3.55403 18.3016 5.33147 19.7557C7.10891 21.2098 9.49872 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

export default function DPPPage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('subjects'); // 'subjects', 'topics', 'dpps'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [dpps, setDpps] = useState([]);
  const [selectedDPP, setSelectedDPP] = useState(null);
  const [error, setError] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});

  // Memoize numeric grade to prevent recalculation
  const numericGrade = useMemo(() => {
    if (!user?.grade) {
      console.log('No user grade found, using fallback grade 10 for testing');
      return 10; // Fallback for testing
    }
    if (typeof user.grade === 'string') {
      const match = user.grade.match(/(\d+)/);
      const result = match ? parseInt(match[1]) : null;
      console.log('Parsed grade from string:', user.grade, '->', result);
      return result;
    }
    const result = parseInt(user.grade);
    console.log('Parsed grade from number:', user.grade, '->', result);
    return result;
  }, [user?.grade]);

  // Debug logging
  useEffect(() => {
    console.log('DPPPage state:', {
      currentView,
      selectedSubject,
      selectedTopic,
      topics: topics.length,
      dpps: dpps.length,
      user: user ? { grade: user.grade, name: user.name } : null,
      numericGrade
    });
    
    // Log DPPs when they change
    if (dpps.length > 0) {
      console.log('Current DPPs loaded:', dpps);
    }
  }, [currentView, selectedSubject, selectedTopic, topics.length, dpps.length, user, numericGrade, dpps]);

  const handleSubjectSelect = (subject) => {
    try {
      console.log('Subject selected:', subject);
      console.log('Subject object:', JSON.stringify(subject, null, 2));
      console.log('Current numericGrade:', numericGrade);
      
      if (!subject || !subject.key) {
        console.error('Invalid subject object:', subject);
        alert('Error: Invalid subject selected');
        return;
      }
      
      setSelectedSubject(subject);
      setTopics([]);
      setSelectedTopic(null);
      setDpps([]);
      setSelectedDPP(null);
      setError(null);
      
      // Show topics view first
      setCurrentView('topics');
      
      // Scroll to top instantly
      window.scrollTo({ top: 0, behavior: 'auto' });
      
      // Fetch topics for this subject
      if (numericGrade) {
        console.log('About to fetch topics for grade:', numericGrade, 'subject:', subject.key);
        setTimeout(() => {
          fetchTopicsForSubject(subject);
        }, 100);
      } else {
        console.error('No numeric grade available for fetching topics');
      }
    } catch (error) {
      console.error('Error in handleSubjectSelect:', error);
      alert(`Error selecting subject: ${error.message}`);
    }
  };

  const handleTopicSelect = (topic) => {
    try {
      console.log('Topic selected:', topic);
      setSelectedTopic(topic);
      setDpps([]);
      setSelectedDPP(null);
      setError(null);
      
      // Show DPPs view
      setCurrentView('dpps');
      
      // Scroll to top instantly
      window.scrollTo({ top: 0, behavior: 'auto' });
      
      // Fetch DPPs for this topic
      if (numericGrade && selectedSubject) {
        console.log('About to fetch DPPs for topic:', topic.title);
        setTimeout(() => {
          fetchDPPsForTopic(topic);
        }, 100);
      } else {
        console.error('Missing required data for fetching DPPs');
      }
    } catch (error) {
      console.error('Error in handleTopicSelect:', error);
      alert(`Error selecting topic: ${error.message}`);
    }
  };

  // Background fetch functions that don't block UI
  const fetchTopicsForSubject = async (subject) => {
    try {
      if (!numericGrade || !subject) {
        console.log('Missing required data for fetchTopicsForSubject:', { numericGrade, subject });
        return;
      }

      console.log('Fetching topics for subject:', { grade: numericGrade, subject: subject.key });
      
      // Use the actual topics API endpoint
      const response = await fetch(`${API_BASE_URL}/dpps/topics/${numericGrade}/${subject.key}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Topics API response:', data);
        if (data.success && Array.isArray(data.topics)) {
          const topics = data.topics.map(topicName => ({
            id: topicName,
            title: topicName,
            description: `${topicName} practice problems and exercises`,
            questionCount: 15,
            timeLimit: 45,
            difficulty: 'Medium',
            date: new Date(),
            content: `${topicName} DPP content`
          }));
          console.log('Normalized topics:', topics);
          setTopics(topics);
        } else {
          console.error('Topics API returned invalid data:', data);
          // Use fallback if API returns invalid data
          setTopics(getFallbackTopics());
        }
      } else {
        console.error('Topics API error:', response.status, response.statusText);
        // Use fallback if API fails
        setTopics(getFallbackTopics());
      }
    } catch (err) {
      console.error('Background topics fetch failed:', err);
      console.log('Using fallback data instead');
      // Use fallback topics on error
      setTopics(getFallbackTopics());
    }
  };

  // Helper function to get fallback topics
  const getFallbackTopics = () => [
    {
      id: 'general',
      title: 'General',
      description: 'General practice problems and exercises',
      questionCount: 10,
      timeLimit: 30,
      difficulty: 'Medium',
      date: new Date(),
      content: 'General DPP content'
    }
  ];

  const fetchDPPsForTopic = async (topic) => {
    try {
      if (!numericGrade || !selectedSubject || !topic) {
        console.log('Missing required data for fetchDPPsForTopic:', { numericGrade, selectedSubject, topic });
        return;
      }

      console.log('Fetching DPPs for topic:', { grade: numericGrade, subject: selectedSubject.key, topic: topic.title });
      
      // Use the topic-specific endpoint instead of filtering by subject
      const response = await fetch(`${API_BASE_URL}/dpps/topic/${numericGrade}/${selectedSubject.key}/${encodeURIComponent(topic.title)}`);

      if (response.ok) {
        const data = await response.json();
        console.log('DPPs API response for topic:', data);
        if (data.success && Array.isArray(data.dpps)) {
          const normalizedDpps = data.dpps.map(dpp => ({
            id: dpp.id || dpp._id,
            title: dpp.title,
            displayName: dpp.displayName || `DPP ${dpp.dppNumber || 1}`,
            description: dpp.description || '',
            questionCount: dpp.questionCount,
            timeLimit: dpp.timeLimit,
            difficulty: dpp.difficulty,
            date: dpp.date,
            content: dpp.content
          }));
          console.log('Normalized DPPs for topic:', normalizedDpps);
          setDpps(normalizedDpps);
        } else {
          console.error('DPPs API returned invalid data:', data);
          setDpps([]);
        }
      } else {
        console.error('DPPs API error for topic:', response.status, response.statusText);
        setDpps([]);
      }
    } catch (err) {
      console.error('Background DPPs fetch failed for topic:', err);
      console.log('Using fallback data instead');
      setDpps([]);
    }
  };

  const goBackToSubjects = () => {
    setCurrentView('subjects');
    setSelectedSubject(null);
    setTopics([]);
    setSelectedTopic(null);
    setDpps([]);
    setSelectedDPP(null);
    setError(null);
  };

  const goBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
  };

  const goBackToDPPs = () => {
    setSelectedDPP(null);
  };

  // Render loading state - removed since we use instant loading now
  // if (loading) {
  //   return (
  //     <div className="compact-papers">
  //       <div className="dpp-loading">
  //         <div className="loading-spinner"></div>
  //         <p>Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Note: Error state removed since we use fallback data

  return (
    <div className="dpp-page compact-papers">
      {/* Hero Section - Only show when no subject is selected */}
      {!selectedSubject && (
        <section className="papers-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">📚</span>
              <span className="badge-text">Daily Practice</span>
            </div>
            <h1 className="hero-title">
              Daily Practice <span className="gradient-text">Problems</span>
            </h1>
            <p className="hero-subtitle">
              Master concepts through daily practice problems and exercises. 
              Choose your subject and topic to access comprehensive DPPs designed for effective learning.
            </p>
          </div>
        </section>
      )}
      
      {/* Main Content */}
      <section className="papers-section">
        <div className="content-container">
          {/* Subjects View */}
          {currentView === 'subjects' && (
            <div className="fade-in">
              <div className="section-header dpp-subjects-header">
                <h2 className="header-title">
                  Choose Your <span className="gradient-text">Subject</span>
                </h2>
                <p className="header-subtitle">
                  Select a subject to access daily practice problems and exercises
                </p>
              </div>
              
              <div className="courses-subjects-grid">
                {subjects.map((subject, index) => (
                  <div
                    key={subject.key}
                    className="courses-subject-card"
                    onClick={() => handleSubjectSelect(subject)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="courses-subject-header">
                      <div className="courses-subject-icon" style={{ background: subject.color }}>
                        <span style={{ fontSize: '1.5rem' }}>{subject.icon}</span>
                      </div>
                      <div>
                        <h3 className="courses-subject-title">{subject.name}</h3>
                        <p className="courses-subject-description">{subject.description}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics View */}
          {currentView === 'topics' && selectedSubject && (
            <div className="fade-in">
              <div className="section-header">
                <button className="back-btn" onClick={goBackToSubjects}>
                  ← Back to Subjects
                </button>
                <div className="header-content">
                  <h2>{selectedSubject.name} Topics</h2>
                  <p>{topics.length} Topics available for practice</p>
                </div>
              </div>
              
              {topics.length === 0 ? (
                <div className="dpp-empty">
                  <div className="empty-icon">📝</div>
                  <h3>No Topics Available</h3>
                  <p>No topics have been created for this subject yet.</p>
                  <button className="retry-btn" onClick={goBackToSubjects}>
                    Choose Different Subject
                  </button>
                </div>
              ) : (
                <div className="topics-list">
                  {topics.map((topic) => (
                    <div key={topic.id} className="topic-list-item">
                      <div className="topic-list-icon" style={{ background: selectedSubject.color }}>
                        <span style={{ fontSize: '1.25rem' }}>📚</span>
                      </div>
                      <div className="topic-list-content">
                        <h3 className="topic-list-title">{topic.title}</h3>
                        <p className="topic-list-description">{topic.description}</p>
                      </div>
                      <div className="topic-list-actions">
                        <button 
                          className="view-topic-btn"
                          onClick={() => handleTopicSelect(topic)}
                        >
                          View DPPs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DPPs View */}
          {currentView === 'dpps' && selectedSubject && (
            <div className="fade-in">
              <div className="section-header">
                <button className="back-btn" onClick={goBackToTopics}>
                  ← Back to Topics
                </button>
                <div className="header-content">
                  <h2>{selectedSubject.name} DPPs</h2>
                  <p>{dpps.length} DPPs available for practice</p>
                </div>
              </div>
              
              {dpps.length === 0 ? (
                <div className="dpp-empty">
                  <div className="empty-icon">📝</div>
                  <h3>No DPPs Available</h3>
                  <p>No DPPs have been created for this subject yet.</p>
                  <button className="retry-btn" onClick={goBackToTopics}>
                    Choose Different Topic
                  </button>
                </div>
              ) : (
                <div className="dpps-list">
                  {dpps.map((dpp) => (
                    <div key={dpp.id} className="dpp-list-container">
                      <div
                        className="dpp-list-item"
                      >
                        <div className="dpp-list-icon" style={{ background: selectedSubject.color }}>
                          <span style={{ fontSize: '1.25rem' }}>📋</span>
                        </div>
                        <div className="dpp-list-content">
                          <h3 className="dpp-list-title">{dpp.title}</h3>
                          <p className="dpp-list-description">{dpp.description}</p>
                        </div>
                        <div className="dpp-list-actions">
                          <button 
                            className={`completion-toggle ${completionStatus[dpp.id] ? 'completed' : 'incomplete'}`}
                            onClick={() => {
                              setCompletionStatus(prev => ({
                                ...prev,
                                [dpp.id]: !prev[dpp.id]
                              }));
                            }}
                            title={completionStatus[dpp.id] ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {completionStatus[dpp.id] ? '✓' : '○'}
                          </button>
                          <button 
                            className="view-dpp-btn"
                            onClick={() => {
                              if (selectedDPP?.id === dpp.id) {
                                setSelectedDPP(null); // Hide the content
                              } else {
                                setSelectedDPP(dpp); // Show the content
                              }
                            }}
                          >
                            {selectedDPP?.id === dpp.id ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Inline DPP Content */}
                      {selectedDPP?.id === dpp.id && (
                        <div className="dpp-content-inline">
                          <div className="dpp-content-header">
                            <h4>{dpp.displayName}</h4>
                          </div>
                          <div className="dpp-content-text">
                            {dpp.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
