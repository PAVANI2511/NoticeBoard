import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('You must be logged in to view/edit your profile.');
    } else {
      navigate('/profile');
    }
  };

  const handleStudentClick = () => {
    navigate('/student'); // Ensure this route exists in your router
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('jwtToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      alert("You're already logged out.");
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        alert(data.message || 'Logout successful');
        navigate('/');
      } else {
        alert(data.message || 'Error during logout');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <FaUserCircle
          className="profile-icon"
          onClick={() => setShowMenu(!showMenu)}
        />
        {showMenu && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={handleProfileClick}>
              Profile
            </div>
            <div className="dropdown-item" onClick={handleStudentClick}>
              Student
            </div>
            <hr />
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;