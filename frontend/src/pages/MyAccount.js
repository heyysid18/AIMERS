import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function MyAccount() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    dppProgress: [],
    videoProgress: [],
    studyStreak: 0,
    totalStudyTime: 0,
    subjects: []
  });

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set mock data for development
      setMockDashboardData();
    }
  };

  const setMockDashboardData = () => {
    setDashboardData({
      dppProgress: [
        { subject: "Mathematics", completed: 45, total: 60, percentage: 75 },
        { subject: "Physics", completed: 38, total: 55, percentage: 69 },
        { subject: "Chemistry", completed: 42, total: 58, percentage: 72 },
        { subject: "Biology", completed: 35, total: 50, percentage: 70 }
      ],
      videoProgress: [
        { subject: "Mathematics", watched: 12, total: 20, percentage: 60 },
        { subject: "Physics", watched: 15, total: 18, percentage: 83 },
        { subject: "Chemistry", watched: 10, total: 16, percentage: 62 },
        { subject: "Biology", watched: 8, total: 14, percentage: 57 }
      ],
      studyStreak: 7,
      totalStudyTime: 156,
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology"]
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="compact-account">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="compact-account">
      {/* Header */}
      <header className="account-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">My Account</h1>
            {user && (
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
          
          <div className="header-actions">
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="account-content">
        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-fire"></i>
              </div>
              <div className="stat-content">
                <h3>{dashboardData.studyStreak}</h3>
                <p>Day Streak</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{dashboardData.totalStudyTime}h</h3>
                <p>Study Time</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-content">
                <h3>{dashboardData.subjects.length}</h3>
                <p>Subjects</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-content">
                <h3>85%</h3>
                <p>Overall Progress</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="progress-section">
          <div className="section-header">
            <h2>Subject Progress</h2>
            <p>Track your progress across all subjects</p>
          </div>
          
          <div className="progress-grid">
            {dashboardData.dppProgress.map((subject, index) => (
              <div key={subject.subject} className="progress-card">
                <div className="progress-header">
                  <h4>{subject.subject}</h4>
                  <span className="progress-percentage">{subject.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <span>{subject.completed} of {subject.total} completed</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Access your learning resources</p>
          </div>
          
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-play"></i>
              </div>
              <div className="action-content">
                <h3>Continue Learning</h3>
                <p>Resume your last watched video</p>
              </div>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="action-content">
                <h3>Today's DPP</h3>
                <p>Complete today's practice problems</p>
              </div>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-download"></i>
              </div>
              <div className="action-content">
                <h3>Download Papers</h3>
                <p>Access previous year papers</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
