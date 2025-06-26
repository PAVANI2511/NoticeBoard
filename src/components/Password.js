import React, { useState } from 'react';
import './Password.css';

function Password() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerifyOtp = () => {
    const correctOtp = '123456'; // Replace with server-validated OTP

    if (otp === correctOtp) {
      setSuccess(true);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="password-container">
      <h2>Verify OTP</h2>

      {!success ? (
        <>
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
        </>
      ) : (
        <div className="success-message">
          <h3>Success</h3>
          <p>OTP verified. You may now reset your password.</p>
        </div>
      )}
    </div>
  );
}

export default Password;
