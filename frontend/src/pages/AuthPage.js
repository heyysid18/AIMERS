// src/pages/AuthPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Theme.css";
import { useAuth } from "../contexts/AuthContext";
import { 
  registerUser,
  loginUser
} from "../api/api";

export default function AuthPage() {
  // Modes: "user-login", "user-register", "admin-login"
  const [mode, setMode] = useState("user-login");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Enhanced form state for registration
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
    phone: ""
  });
  
  const [message, setMessage] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Add animation state for card entrance
  const [cardVisible, setCardVisible] = useState(false);
  const cardRef = useRef();
  useEffect(() => {
    setTimeout(() => setCardVisible(true), 80);
  }, []);

  // Reset form when mode changes
  useEffect(() => {
    setMessage("");
    setShowPassword(false);
    setShowConfirm(false);
    if (mode === "user-register") {
      setForm({ name: "", email: "", password: "", confirmPassword: "", grade: "", phone: "" });
    } else {
      setForm({ name: "", email: "", password: "", confirmPassword: "", grade: "", phone: "" });
    }
  }, [mode]);

  // Handle Google OAuth redirect
  useEffect(() => {
    if (location.pathname === '/oauth-success') {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const name = params.get('name');
      const email = params.get('email');
      if (token && name && email) {
        login(token, { name, email });
        navigate('/');
      }
    }
  }, [location, login, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to: "${value}"`);
    setForm({ ...form, [name]: value });
  };

  const getPasswordStrength = useMemo(() => {
    const password = form.password || "";
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const capped = Math.min(score, 4);
    const labels = ["Too weak", "Weak", "Good", "Strong", "Excellent"];
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#22d3ee", "#6366f1"];
    return { score: capped, label: labels[Math.min(score, 4)], color: colors[Math.min(score, 4)] };
  }, [form.password]);

  const validateForm = () => {
    if (mode === "user-register") {
      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match");
        return false;
      }
      if (form.password.length < 6) {
        setMessage("Password must be at least 6 characters long");
        return false;
      }
      const validGrades = [9, 10, 11, 12];
      if (!form.grade || !validGrades.includes(Number(form.grade))) {
        setMessage("Please select a valid class (9, 10, 11, or 12)");
        return false;
      }
      // Phone validation completely removed - any phone number is accepted
      console.log('Form validation passed - phone number not required');
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    console.log('=== REGISTRATION DEBUG START ===');
    console.log('Form data:', form);
    console.log('Mode:', mode);
    console.log('Phone field value:', form.phone);
    console.log('Phone field length:', form.phone ? form.phone.length : 0);
    console.log('Phone field trimmed:', form.phone ? form.phone.trim() : 'N/A');

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      let response;
      if (mode === "user-login") {
        console.log('Attempting login...');
        response = await loginUser({ email: form.email, password: form.password });
      } else if (mode === "user-register") {
        const registrationData = {
          name: form.name,
          email: form.email,
          password: form.password,
          grade: form.grade,
        };
        
        // Always include phone if provided (no validation required)
        if (form.phone && form.phone.trim()) {
          registrationData.phone = form.phone.trim();
          console.log('Phone number included:', registrationData.phone);
        } else {
          console.log('No phone number provided');
        }
        
        console.log('Final registration data being sent:', registrationData);
        console.log('About to call registerUser API...');
        
        response = await registerUser(registrationData);
        console.log('Registration response received:', response);
      } else if (mode === "admin-login") {
        response = await loginUser({ email: form.email, password: form.password });
      }

      if (response.data.token) {
        console.log('Success! Token received:', response.data.token);
        login(response.data.token, response.data.user);
        navigate("/");
      } else if (response.data.message) {
        console.log('Response message:', response.data.message);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('=== REGISTRATION ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);
      
      setMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred"
      );
    }
    console.log('=== REGISTRATION DEBUG END ===');
  };

  const handleGoogleSignIn = () => {
    window.location.href = 'https://aimers-backend-clv3.onrender.com/api/auth/google';
  };

  const getModeTitle = () => {
    switch (mode) {
      case "user-login":
        return "Welcome Back";
      case "user-register":
        return "Join AIMERS";
      case "admin-login":
        return "Admin Access";
      default:
        return "Authentication";
    }
  };

  const getModeSubtitle = () => {
    switch (mode) {
      case "user-login":
        return "Sign in to continue";
      case "user-register":
        return "Create your account";
      case "admin-login":
        return "Access admin dashboard";
      default:
        return "";
    }
  };

  return (
    <div className="compact-auth">
      <div className="auth-container">
        <div className="auth-content two-panel">
          <div className="auth-left">
            <div className="auth-header">
              <div className="auth-badge">
                <span className="badge-icon">🎓</span>
                <span className="badge-text">AIMERS</span>
              </div>
              <h1 className="auth-title">{getModeTitle()}</h1>
              <p className="auth-subtitle">{getModeSubtitle()}</p>
            </div>
          </div>

          <div className="auth-right">
            <div className={`auth-card ${cardVisible ? 'visible' : ''}`} ref={cardRef}>
              <div className="card-header">
                <div className="mode-tabs">
                  <button
                    className={`mode-tab ${mode === "user-login" ? "active" : ""}`}
                    onClick={() => setMode("user-login")}
                  >
                    <i className="fas fa-user"></i>
                    <span>Student Login</span>
                  </button>
                  <button
                    className={`mode-tab ${mode === "user-register" ? "active" : ""}`}
                    onClick={() => setMode("user-register")}
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>Register</span>
                  </button>
                  <button
                    className={`mode-tab ${mode === "admin-login" ? "active" : ""}`}
                    onClick={() => setMode("admin-login")}
                  >
                    <i className="fas fa-shield-alt"></i>
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={`auth-form ${mode === "user-register" ? "two-col" : ""}`}>
                {mode === "user-register" && (
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-user"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-envelope"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-lock"></i>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter password"
                      required
                    />
                    <button type="button" className="visibility-toggle" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {mode === "user-register" && (
                    <div className="password-strength" aria-live="polite">
                      <div className={`bar ${getPasswordStrength.score >= 1 ? 'on' : ''}`}></div>
                      <div className={`bar ${getPasswordStrength.score >= 2 ? 'on' : ''}`}></div>
                      <div className={`bar ${getPasswordStrength.score >= 3 ? 'on' : ''}`}></div>
                      <div className={`bar ${getPasswordStrength.score >= 4 ? 'on' : ''}`}></div>
                      <span className="label" style={{ color: getPasswordStrength.color }}>{getPasswordStrength.label}</span>
                    </div>
                  )}
                </div>

                {mode === "user-register" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-lock"></i>
                        Confirm Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Re-enter password"
                          required
                        />
                        <button type="button" className="visibility-toggle" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password visibility">
                          <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-graduation-cap"></i>
                        Class/Grade
                      </label>
                      <select
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select class</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-phone"></i>
                        Phone
                      </label>
                      <div className="input-group">
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </>
                )}

                {message && (
                  <div className="message error">
                    <i className="fas fa-exclamation-circle"></i>
                    {message}
                  </div>
                )}

                <button type="submit" className="submit-button">
                  <i className="fas fa-sign-in-alt"></i>
                  {mode === "user-login" ? "Sign In" : mode === "user-register" ? "Create Account" : "Admin Login"}
                </button>
              </form>

              {mode === "user-login" && (
                <div className="social-login">
                  <div className="divider">
                    <span>or</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="google-button"
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      className="google-icon"
                    />
                    <span>Sign in with Google</span>
                  </button>
                  <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    <a href="/forgot-password" style={{ color: '#9aa4b2', textDecoration: 'none' }}>Forgot your password?</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}