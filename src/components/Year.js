import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Year.css';

const Year = () => {
  const navigate = useNavigate();

  const handleClick = (year) => {
    navigate('/Sections', { state: { selectedYear: year } });
  };

  return (
    <div className="container">
      <div className="header">Select Year</div>

      <button className="year-button" onClick={() => handleClick("1")}>1st Year</button>
      <button className="year-button" onClick={() => handleClick("2")}>2nd Year</button>
      <button className="year-button" onClick={() => handleClick("3")}>3rd Year</button>
      <button className="year-button" onClick={() => handleClick("4")}>4th Year</button>
    </div>
  );
};

export default Year;
