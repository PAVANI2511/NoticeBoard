import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password format invalid.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Offline dummy test credentials
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const matched = storedUsers.find(
        (user) => user.email === email && user.password === password
      );

      // Hardcoded fallback test account
      if (
        (email === 'test@example.com' && password === 'Test@1234') ||
        matched
      ) {
        navigate('/Departments');
      } else {
        setError('Invalid credentials. Try test@example.com / Test@1234');
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="card-wrapper">
      <div className="login-card">
        <div className="login-left">
          <img src="/smartboard.jpg" alt="Login Visual" className="left-image" />
        </div>

        <div className="login-right">
          <h2 className="login-title">Login</h2>

          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="email"
              placeholder="Enter Email"
              className="input-field"
              value={email}
              onChange={handleEmailChange}
            />

            <input
              type="password"
              placeholder="Enter Password"
              className="input-field"
              value={password}
              onChange={handlePasswordChange}
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>

          <div className="options">
            <label className="remember-label">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="Email" onClick={() => navigate('/Email')}>
              Forgot password?
            </span>
          </div>

          <div className="divider">
            <hr /> <span>or</span> <hr />
          </div>

          <p className="register-text">If you are not registered</p>
          <button className="signin-btn" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
