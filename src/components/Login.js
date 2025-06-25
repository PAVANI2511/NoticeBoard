import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://192.168.0.145:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        navigate('/dashboard')
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-wrapper">
      <div className="login-card">
        <div className="login-left">
          <img src="/smartboard.jpg" alt="Login Visual" className="left-image" />
        </div>

        <div className="login-right">
          <h2 className="login-title">Login</h2>

          <form onSubmit={handleSubmit} autoComplete='off'>
            <input
              type="email"
              placeholder="Enter Email"
              className="input-field"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <input
              type="password"
              placeholder="Enter Password"
              className="input-field"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <div className="divider">
            <hr /> <span>or</span> <hr />
          </div>

          <p className="register-text">If you are not register</p>
          <button className="signin-btn" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default Login;