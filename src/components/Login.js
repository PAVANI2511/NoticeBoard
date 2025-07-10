import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye } from 'react-icons/fa';
import Navbar from './Navbar';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [emailRequired, setEmailRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    setLoggedIn(false);
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,}$/.test(password);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setError('');
    setEmailRequired(false);
    setEmailValid(val ? isValidEmail(val) : null);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setError('');
    setPasswordRequired(false);
    setPasswordValid(val ? isValidPassword(val) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailEmpty = !email;
    const isPasswordEmpty = !password;

    setEmailRequired(isEmailEmpty);
    setPasswordRequired(isPasswordEmpty);

    if (isEmailEmpty || isPasswordEmpty) return;

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.tokens) {
        localStorage.setItem('jwtToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        setLoggedIn(true);
        navigate('/Departments');
      } else {
        setError(data.detail || 'Invalid credentials. Try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar onProfileClick={() => setShowProfile(!showProfile)} isLoggedIn={loggedIn} />

      <div className="card-wrapper">
        <div className="login-card">
          <div className="login-left">
            <img src="/smartboard.jpg" alt="Login Visual" className="left-image" />
          </div>

          <div className="login-right">
            <h2 className="login-title">Login</h2>

            <form onSubmit={handleSubmit} autoComplete="off" className="form-block">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                className="input-field"
                value={email}
                onChange={handleEmailChange}
              />
              <div className="validation-msg">
                {emailRequired && <p className="error-text">Email is required.</p>}
                {emailValid === false && <p className="error-text">Invalid email format.</p>}
                {emailValid === true && <p className="success-text">Valid email ✅</p>}
              </div>

              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter Password"
                  className="input-field password-input"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  className="toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FaEye />
                </span>
              </div>

              <div className="validation-msg">
                {passwordRequired && <p className="error-text">Password is required.</p>}
                {passwordValid === false && (
                  <p className="error-text">
                    Password must include uppercase, lowercase, number, and special character.
                  </p>
                )}
                {passwordValid === true && <p className="success-text">Strong password ✅</p>}
              </div>

              <button type="submit" className="visible-login" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              {error && <p className="error-text" style={{ marginTop: '10px' }}>{error}</p>}
            </form>

            <div className="options">
              <label className="remember-label">
                <input type="checkbox" /> Remember me
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
    </>
  );
}

export default Login;
