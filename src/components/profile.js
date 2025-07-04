import React, { useState } from 'react';
import './profile.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    username: 'adminuser',
    email: 'admin@example.com',
    phone: '9876543210',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [validation, setValidation] = useState({});
  const [messages, setMessages] = useState({});

  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{5,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const validate = (name, value) => {
    let message = '';
    let valid = true;

    if (name === 'username') {
      if (!usernameRegex.test(value)) {
        message = 'Username must be at least 5 characters, include a letter, number & special character.';
        valid = false;
      } else {
        message = 'Valid username.';
      }
    } else if (name === 'email') {
      if (!emailRegex.test(value)) {
        message = 'Invalid email format.';
        valid = false;
      } else {
        message = 'Valid email.';
      }
    } else if (name === 'phone') {
      if (!phoneRegex.test(value)) {
        message = 'Phone must be 10 digits starting with 6-9.';
        valid = false;
      } else {
        message = 'Valid phone number.';
      }
    }

    setMessages(prev => ({ ...prev, [name]: message }));
    setValidation(prev => ({ ...prev, [name]: valid }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const isAllValid = Object.values(validation).every(Boolean);
    if (!isAllValid) {
      alert('Please correct the invalid fields before saving.');
      return;
    }
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container desktop-layout">
      <h2>Admin Profile</h2>
      <div className="profile-grid">

        {/* Username */}
        <div className="field">
          <label>Username:</label>
          {isEditing ? (
            <>
              <input type="text" name="username" value={admin.username} onChange={handleChange} />
              {messages.username && (
                <p className={`live-message-text ${validation.username ? 'valid' : 'invalid'}`}>
                  {validation.username ? <FaCheckCircle /> : <FaTimesCircle />} {messages.username}
                </p>
              )}
            </>
          ) : (
            <span>{admin.username}</span>
          )}
        </div>

        {/* Email */}
        <div className="field">
          <label>Email:</label>
          {isEditing ? (
            <>
              <input type="email" name="email" value={admin.email} onChange={handleChange} />
              {messages.email && (
                <p className={`live-message-text ${validation.email ? 'valid' : 'invalid'}`}>
                  {validation.email ? <FaCheckCircle /> : <FaTimesCircle />} {messages.email}
                </p>
              )}
            </>
          ) : (
            <span>{admin.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="field">
          <label>Phone:</label>
          {isEditing ? (
            <>
              <input type="tel" name="phone" value={admin.phone} onChange={handleChange} />
              {messages.phone && (
                <p className={`live-message-text ${validation.phone ? 'valid' : 'invalid'}`}>
                  {validation.phone ? <FaCheckCircle /> : <FaTimesCircle />} {messages.phone}
                </p>
              )}
            </>
          ) : (
            <span>{admin.phone}</span>
          )}
        </div>
      </div>

      <div className="buttons">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;