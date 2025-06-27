import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Email.css';

const Email = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert(`Password link sent to: ${email}`);
    navigate('/Password');
  };

  return (
    <div className="email-container">
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
          <button type="submit" className="send-btn">Send Password</button>
          <button
            type="button"
            className="close-btn"
            onClick={() => setEmail('')}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default Email;
