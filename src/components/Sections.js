import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sections.css';

const Sections = () => {
  const navigate = useNavigate();
  const sectionList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const handleClick = (sec) => {
    navigate('/FileUploader'); 
  };

  return (
    <div className="sections-container">
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
  );
};

export default Sections;
