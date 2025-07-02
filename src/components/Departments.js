// src/components/Departments.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Departments.css';

const Departments = () => {
  const navigate = useNavigate();

  const departments = [
    "Computer Science & Engineering (CSE)",
    "Computer Science & Engineering Artificial Intelligence (CAI)",
    "Computer Science & Engineering AI & ML (CSM)",
    "Computer Science & Engineering Networks (CSN)",
    "Computer Science & Engineering Technology (CST)",
    "Computer Science & Engineering Data Science (CSD)",
    "Computer Science & Engineering Cyber Security (CSC)",
    "Electronics And Communication Engineering (ECE)",
    "Electrical And Electronics Engineering (EEE)",
    "Mechanical Engineering (MEC)",
    "Civil Engineering (CIV)"
  ];

  const handleClick = (dept) => {
    navigate('/Year', { state: { selectedDepartment: dept } });
  };

  return (
    <div
      className="departments-background"
      style={{
        backgroundImage: "url('/wave-haikei.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="departments-card">
        <div className="departments-header">Departments</div>
        <div className="departments-list">
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
    </div>
  );
};

export default Departments;
