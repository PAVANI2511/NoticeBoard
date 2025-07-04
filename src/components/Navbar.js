import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Logged out!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <FaUserCircle className="profile-icon" onClick={() => setShowMenu(!showMenu)} />
        {showMenu && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
            <div className="dropdown-item" onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;