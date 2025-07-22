import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Email.css';

const Email = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const personalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const collegeEmailRegex = /^[a-z0-9]+@mits\.ac\.in$/i;
    return personalEmailRegex.test(email) || collegeEmailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert('Please enter a valid personal or MITS college email.');
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
    <div
      className="email-background"
      style={{
        backgroundImage: "url('/wave-haikei.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
              onClick={() => navigate('/')}
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
