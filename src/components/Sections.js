import React from 'react';
import './Sections.css';

const Sections = () => {
  const sectionList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  return (
    <div className="sections-container">
      <div className="header">Sections</div>
      <div className="section-buttons">
        {sectionList.map((sec, index) => (
          <button key={index} className="section-button">
            Section {sec}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sections;