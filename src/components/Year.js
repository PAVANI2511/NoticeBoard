import React from 'react';
import './Year.css';

const Year = () => {

  const handleClick = (year) => {
    alert("`You selected: ${year}");
    // You can redirect or perform other actions here
  };

  return (
    <div className="container">
      <div className="header">Year</div>

      <button className="year-button" onClick={() => handleClick("1st Year")}>1st Year</button>
      <button className="year-button" onClick={() => handleClick("2nd Year")}>2nd Year</button>
      <button className="year-button" onClick={() => handleClick("3rd Year")}>3rd Year</button>
      <button className="year-button" onClick={() => handleClick("4th Year")}>4th Year</button>
    </div>
  );
};

export default Year;