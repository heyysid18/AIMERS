import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/api';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setEmail(params.get('email') || '');
    setToken(params.get('token') || '');
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.length < 6) return setMessage('Password must be at least 6 characters');
    if (password !== confirmPassword) return setMessage('Passwords do not match');
    setLoading(true);
    try {
      await resetPassword({ email, token, newPassword: password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/auth'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compact-auth">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-card visible" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="card-header"><h2 className="auth-title">Reset Password</h2></div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              {message && <div className="message error">{message}</div>}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 