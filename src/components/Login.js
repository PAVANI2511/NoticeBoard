import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,}$/.test(password);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(isValidEmail(value) ? '' : 'Invalid email format');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      isValidPassword(value)
        ? ''
        : 'Password must be 8+ chars with uppercase, lowercase, number, and symbol.'
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError('Both email and password are required.');
      return;
    }

    if (emailError || passwordError) {
      setFormError('Fix the above errors before submitting.');
      return;
    }

    setFormError('');
    setLoading(true);

    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const matched = storedUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (
        (email === 'test@example.com' && password === 'Test@1234') ||
        matched
      ) {
        navigate('/Departments');
      } else {
        setFormError('Invalid credentials. Try test@example.com / Test@1234');
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
          <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
            <input
              type="email"
              placeholder="Email"
              className={`input-field ${emailError ? 'invalid' : ''}`}
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="error-text">{emailError}</p>}

            <div className="password-field-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`input-field ${passwordError ? 'invalid' : ''}`}
                value={password}
                onChange={handlePasswordChange}
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && <p className="error-text">{passwordError}</p>}

            <button
              type="submit"
              className="visible-login"
              disabled={loading || emailError || passwordError}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            {formError && <p className="error-text">{formError}</p>}
          </form>

          <div className="options">
            <label className="remember-label">
              <input type="checkbox" /> Remember me
            </label>
            <span className="Email" onClick={() => navigate('/Email')}>Forgot password?</span>
          </div>

          <div className="divider">
            <hr />
            <span>or</span>
            <hr />
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
