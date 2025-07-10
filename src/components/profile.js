import React, { useEffect, useState } from 'react';
import './profile.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Regex Constants
const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{5,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[6-9]\d{9,14}$/;

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [originalAdmin, setOriginalAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validation, setValidation] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('jwtToken');
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
        if (response.ok) {
          const profileData = {
            username: data.user.username || '',
  email: data.user.email || '',
  phone_number: data.user.phone_number || '',
          };
          console.log('API Response:', data);
          setAdmin(profileData);
          setOriginalAdmin(profileData);
        } else {
          alert('Failed to load profile.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Something went wrong while loading your profile.');
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (admin) {
      Object.entries(admin).forEach(([key, value]) => validate(key, value));
    }
  }, [admin]);

  const validate = (name, value) => {
    let message = '';
    let valid = true;

    if (name === 'username') {
      if (!usernameRegex.test(value)) {
        message = 'Username must include a letter, number & special character (min 5 chars).';
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

    setMessages((prev) => ({ ...prev, [name]: message }));
    setValidation((prev) => ({ ...prev, [name]: valid }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setAdmin(originalAdmin);
    setIsEditing(false);
    setMessages({});
    setValidation({});
  };

  const handleSave = async () => {
    const isAllValid = Object.values(validation).every(Boolean);
    if (!isAllValid) {
      alert('Please correct the invalid fields before saving.');
      return;
    }

    try {
      const accessToken = localStorage.getItem('jwtToken');
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(admin),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setOriginalAdmin(admin);
        setIsEditing(false);
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
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
            <span>{admin.username?.trim() || 'N/A'}</span>
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
            <span>{admin.email?.trim() || 'N/A'}</span>
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
            <span>{admin.phone_number?.trim() || 'N/A'}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons">
        {isEditing ? (
          <>
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={!Object.values(validation).every(Boolean)}
            >
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
