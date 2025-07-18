import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import Navbar from './Navbar';

function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+91',
    phone_number: '',
  });

  const [error, setError] = useState('');
  const [fieldMessages, setFieldMessages] = useState({});
  const [isLiveValid, setIsLiveValid] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,}$/;
  const usernameRegex = /^(?=[A-Za-z\d@$!%?#&]{5,})(?=(?:[^@$!%?#&]*[@$!%?#&][^@$!%?#&]*)$)(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?#&]+$/;
  const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|mits\.ac\.in)$/;

  const validatePhone = (code, number) => {
    if (code === '+91') {
      return /^[6-9]\d{9}$/.test(number)
        ? { valid: true, message: 'Phone number looks valid!' }
        : { valid: false, message: 'Indian phone number must be 10 digits starting with 6-9.' };
    }
    if (code === '+1') {
      return /^[2-9]\d{2}[2-9]\d{6}$/.test(number)
        ? { valid: true, message: 'phone number looks valid.' }
        : { valid: false, message: 'Invalid US phone number must be 10 digits.' };
    }
    if (code === '+44') {
      return /^[1-9]\d{9,10}$/.test(number)
        ? { valid: true, message: 'Phone number looks valid!' }
        : { valid: false, message: 'UK number must be 10–11 digits.' };
    }
    return { valid: false, message: 'Unsupported country code.' };
  };

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'phone_number') {
      const maxLen = form.countryCode === '+44' ? 11 : 10;
      if (value.length > maxLen) return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
    setError('');

    let message = '';
    let valid = null;

    if (name === 'username') {
      if (!usernameRegex.test(value)) {
        message = 'Username must contain letters, a number, and exactly one special character.';
        valid = false;
      } else {
        message = 'Username looks good!';
        valid = true;
      }
    } else if (name === 'email') {
      if (!emailRegex.test(value)) {
        message = 'Please enter a valid email address.';
        valid = false;
      } else {
        message = 'Email looks good!';
        valid = true;
      }
    } else if (name === 'password') {
      if (!strongPasswordRegex.test(value)) {
        message = 'Password must be at least 8 characters long with uppercase, lowercase, number, and symbol.';
        valid = false;
      } else {
        message = 'Strong password!';
        valid = true;
      }
    } else if (name === 'confirmPassword') {
      if (value !== form.password) {
        message = 'Passwords do not match.';
        valid = false;
      } else {
        message = 'Passwords match!';
        valid = true;
      }
    } else if (name === 'phone_number') {
      const result = validatePhone(form.countryCode, value);
      message = result.message;
      valid = result.valid;
    }

    setFieldMessages(prev => ({ ...prev, [name]: message }));
    setIsLiveValid(prev => ({ ...prev, [name]: valid }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, phone_number, countryCode } = form;

    if (!username || !email || !password || !confirmPassword || !phone_number) {
      setError('All fields are required.');
      return;
    }

    if (!usernameRegex.test(username)) {
      setError('Username must contain letters, a number, and exactly one special character.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setError('Password must be strong and meet all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const phoneCheck = validatePhone(countryCode, phone_number);
    if (!phoneCheck.valid) {
      setError(phoneCheck.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          phone_number,
          password,
          password_confirm: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed.');
      } else {
        alert('Account created successfully!');
        navigate('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="card-wrapper">
        <div className="login-card">
          <div className="login-left">
            <img src="/smartboard.jpg" alt="Sign In Visual" className="left-image" />
          </div>

          <div className="login-right">
            <h2 className="login-title">Sign In</h2>

            <form onSubmit={handleSubmit}>
              <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="input-username" />
              {fieldMessages.username && (
                <p className={`live-message-text ${isLiveValid.username ? 'valid' : 'invalid'}`}>
                  {isLiveValid.username ? <FaCheckCircle /> : <FaTimesCircle />} {fieldMessages.username}
                </p>
              )}

              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-field" />
              {fieldMessages.email && (
                <p className={`live-message-text ${isLiveValid.email ? 'valid' : 'invalid'}`}>
                  {isLiveValid.email ? <FaCheckCircle /> : <FaTimesCircle />} {fieldMessages.email}
                </p>
              )}

              <div className="password-field-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field"
                />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {fieldMessages.password && (
                <p className={`live-message-text ${isLiveValid.password ? 'valid' : 'invalid'}`}>
                  {isLiveValid.password ? <FaCheckCircle /> : <FaTimesCircle />} {fieldMessages.password}
                </p>
              )}

              <div className="password-field-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                />
                <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {fieldMessages.confirmPassword && (
                <p className={`live-message-text ${isLiveValid.confirmPassword ? 'valid' : 'invalid'}`}>
                  {isLiveValid.confirmPassword ? <FaCheckCircle /> : <FaTimesCircle />} {fieldMessages.confirmPassword}
                </p>
              )}

              <div className="combined-phone-field">
                <select name="countryCode" value={form.countryCode} onChange={handleChange} className="country-select">
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="phone-number-input"
                />
              </div>
              {fieldMessages.phone_number && (
                <p className={`live-message-text ${isLiveValid.phone_number ? 'valid' : 'invalid'}`}>
                  {isLiveValid.phone_number ? <FaCheckCircle /> : <FaTimesCircle />} {fieldMessages.phone_number}
                </p>
              )}

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="divider"><hr /><span>or</span><hr /></div>
            <p className="register-text">Already have an account?</p>
            <button className="login-btn visible-login" onClick={() => navigate('/')}>Log In</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
