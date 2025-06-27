import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);

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

    if (isEmailEmpty || isPasswordEmpty) {
      setError('');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password does not meet security requirements.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://192.168.0.145:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        navigate('/Departments');
      } else {
        setError(data.message || 'Invalid credentials. Please check your account.');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again later.');
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

          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="email"
              placeholder="Enter Email"
              className="input-field"
              value={email}
              onChange={handleEmailChange}
            />
            {emailRequired && <p className="error-text">Email is required.</p>}
            {emailValid === false && <p className="error-text">Please enter a valid email.</p>}
            {emailValid === true && <p className="success-text">Valid email ✅</p>}

            <input
              type="password"
              placeholder="Enter Password"
              className="input-field"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordRequired && <p className="error-text">Password is required.</p>}
            {passwordValid === false && (
              <p className="error-text">
                Password must be at least 8 characters, and include uppercase, lowercase, number, and special character.
              </p>
            )}
            {passwordValid === true && <p className="success-text">Strong password ✅</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            {error && !emailRequired && !passwordRequired && (
              <p className="error-text">{error}</p>
            )}
          </form>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a
              onClick={() => navigate('/Email')}
              className="Email"
              style={{ cursor: 'pointer' }}
            >
              Forgot password?
            </a>
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
