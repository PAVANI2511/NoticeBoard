import React, { useEffect, useState } from 'react';
import './profile.css';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

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
          setAdmin(profileData);
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

  return (
    <div
      className="email-background"
      style={{
        backgroundImage: "url('/wave-haikei.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="profile-container desktop-layout">
        {!admin ? (
          <h2>Loading profile...</h2>
        ) : (
          <>
            <h2>Admin Profile</h2>
            <div className="profile-grid">
              <div className="field">
                <label>Username:</label>
                <span>{admin.username?.trim() || 'N/A'}</span>
              </div>

              <div className="field">
                <label>Email:</label>
                <span>{admin.email?.trim() || 'N/A'}</span>
              </div>

              <div className="field">
                <label>Phone:</label>
                <span>{admin.phone_number?.trim() || 'N/A'}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
