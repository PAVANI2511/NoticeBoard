import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Departments.css';

const Departments = () => {
  const navigate = useNavigate();

  const departments = [
    "Computer Science & Engineering (CSE)",
    "Computer Science & Engineering AI & ML (CSM)",
    "Computer Science & Engineering Artificial Intelligence (CAI)",
    "Computer Science & Engineering Data Science (CSD)",
    "Computer Science & Engineering Cyber Security (CSC)",
    "Electronics And Communication & Engineering (ECE)",
    "Electrical And Electronics Engineering (EEE)",
    "Mechanical Engineering (MEC)",
    "Civil Engineering (CIV)"
  ];

  const handleClick = (dept) => {
    navigate('/Year');
  };

  return (
    <div className="container">
      <div className="header">Departments</div>
      <div className="buttons">
        {departments.map((dept, index) => (
          <button
            key={index}
            className="dept-button"
            onClick={() => handleClick(dept)}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Departments;
