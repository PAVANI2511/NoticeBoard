import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sections.css';

const Sections = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedYear = location.state?.selectedYear;
  const sectionList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const handleClick = (section) => {
    navigate('/dashboard', {
      state: {
        selectedYear,
        selectedSection: section
      }
    });
  };

  return (
    <div className="sections-container">
      <div className="card">
        <div className="header">Sections</div>
        <div className="section-buttons">
          {sectionList.map((sec, index) => (
            <button
              key={index}
              className="section-button"
              onClick={() => handleClick(sec)}
            >
              Section {sec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sections;
