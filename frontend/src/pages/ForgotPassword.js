import React, { useState } from 'react';
import { forgotPassword } from '../api/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setMessage('If that email exists, a reset link has been sent.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compact-auth">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-card visible" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="card-header"><h2 className="auth-title">Forgot Password</h2></div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {message && <div className="message error">{message}</div>}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 