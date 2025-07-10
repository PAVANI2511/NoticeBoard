import React, { useState } from 'react';
import './DepartmentStats.css';
import Navbar from './Navbar'; 
const DepartmentStats = () => {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Department List
  const departments = ['CSM', 'CSD', 'CSC', 'CAI', 'CSN', 'CSE', 'ECE', 'EEE', 'MEC', 'CIV'];

  // Year List
  const years = ['1', '2', '3', '4'];

  // Mock Dynamic Data
  const data = {};

  departments.forEach(dept => {
    data[dept] = {};
    years.forEach(year => {
      const sent = Math.floor(Math.random() * 60);
      const notSent = 60 - sent;
      data[dept][year] = { sent, notSent };
    });
  });

  const getStats = () => {
    if (selectedDept && selectedYear) {
      return data[selectedDept][selectedYear];
    }
    return null;
  };

  return (
    
    <div className="dept-stats-container">
      <h2>📊 Mail Delivery Stats</h2>

      <div className="dropdown-group">
        <label>Department:</label>
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setSelectedYear('');
          }}
        >
          <option value="">--Select--</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {selectedDept && (
        <div className="dropdown-group">
          <label>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">--Select--</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {selectedDept && selectedYear && (
        <div className="result-card">
          <h3>Results for {selectedDept} - Year {selectedYear}</h3>
          <p>✅ Mails Sent: <strong>{getStats().sent}</strong></p>
          <p>❌ Mails Not Sent: <strong>{getStats().notSent}</strong></p>
        </div>
      )}
    </div>
  );
};

export default DepartmentStats;