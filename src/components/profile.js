import React, { useEffect, useState } from 'react';
import './profile.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validation, setValidation] = useState({});
  const [messages, setMessages] = useState({});

  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{5,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[6-9]\d{9,14}$/;

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('jwtToken');
      console.log("Access Token:", accessToken);
      if (!accessToken) {
        alert('You must be logged in to view this page.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/auth/profile/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        console.log('Profile API status:', response.status);
        console.log('Profile API response:', data);

        if (response.ok) {
          setAdmin({
      username: data.user.username || '',
      email: data.user.email || '',
      phone_number: data.user.phone_number || '',
      });
        } else {
          alert('Failed to load profile. Check console for error details.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Something went wrong while loading your profile.');
      }
    };

    fetchProfile();
  }, []);

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
    } else if (name === 'phone_number') {
      if (!phoneRegex.test(value)) {
        message = 'Phone must start with 6-9 and be 10+ digits. "+" allowed.';
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
    alert('Profile updated successfully! (Note: Save logic not connected to backend)');
  };

  if (!admin) {
    return (
      <div className="profile-container desktop-layout">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container desktop-layout">
      <h2>Admin Profile</h2>
      <div className="profile-grid">
        {/* Username */}
        <div className="field">
          <label>Username:</label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="username"
                value={admin.username}
                onChange={handleChange}
              />
              {messages.username && (
                <p className={`live-message-text ${validation.username ? 'valid' : 'invalid'}`}>
                  {validation.username ? <FaCheckCircle /> : <FaTimesCircle />} {messages.username}
                </p>
              )}
            </>
          ) : (
            <span>{admin.username || 'N/A'}</span>
          )}
        </div>

        {/* Email */}
        <div className="field">
          <label>Email:</label>
          {isEditing ? (
            <>
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
              />
              {messages.email && (
                <p className={`live-message-text ${validation.email ? 'valid' : 'invalid'}`}>
                  {validation.email ? <FaCheckCircle /> : <FaTimesCircle />} {messages.email}
                </p>
              )}
            </>
          ) : (
            <span>{admin.email || 'N/A'}</span>
          )}
        </div>

        {/* Phone */}
        <div className="field">
          <label>Phone:</label>
          {isEditing ? (
            <>
              <input
                type="tel"
                name="phone_number"
                value={admin.phone_number}
                onChange={handleChange}
              />
              {messages.phone_number && (
                <p className={`live-message-text ${validation.phone_number ? 'valid' : 'invalid'}`}>
                  {validation.phone_number ? <FaCheckCircle /> : <FaTimesCircle />} {messages.phone_number}
                </p>
              )}
            </>
          ) : (
            <span>{admin.phone_number || 'N/A'}</span>
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