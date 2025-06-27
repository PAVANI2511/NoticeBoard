import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Password.css';

function Password() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    const correctOtp = '123456';

    if (otp === correctOtp) {
      setError('');
      navigate('/ForgotPassword');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="password-container">
      <h2>Verify OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="otp-input"
      />

      <button onClick={handleVerifyOtp} className="verify-btn">
        Verify OTP
      </button>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Password;
