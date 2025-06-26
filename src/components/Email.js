import React, { useState } from 'react';
import './Email.css';

const Email = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("{Password link sent to: ${email}");
  };

  return (
    <div className="email-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <label>email id:</label>
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