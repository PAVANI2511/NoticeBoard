import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Email.css';

const Email = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || `OTP sent to: ${email}`);
        navigate('/Password', { state: { email } });
      } else {
        alert(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      alert('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-background">
      <div className="email-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email ID:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Registered Email"
            required
          />
          <div className="button-group">
            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              type="button"
              className="close-btn"
              onClick={() => setEmail('')}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Email;
