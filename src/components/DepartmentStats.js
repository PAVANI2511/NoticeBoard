import React, { useState } from 'react';
import './DepartmentStats.css';

const DepartmentStats = () => {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Department List
  const departments = ['CSM', 'CSD', 'CSC', 'CAI', 'CSN', 'CSE', 'ECE', 'EEE', 'MEC', 'CIV'];

  // Year List
  const years = ['1', '2', '3', '4'];

  // Section List
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Mock Dynamic Data
  const data = {};

  departments.forEach(dept => {
    data[dept] = {};
    years.forEach(year => {
      data[dept][year] = {};
      sections.forEach(section => {
        // Just for demo, random values
        const sent = Math.floor(Math.random() * 60);
        const notSent = 60 - sent;
        data[dept][year][section] = { sent, notSent };
      });
    });
  });

  const getStats = () => {
    if (selectedDept && selectedYear && selectedSection) {
      return data[selectedDept][selectedYear][selectedSection];
    }
    return null;
  };

  return (
    <div className="dept-stats-container">
      <h2>📊 Mail Delivery Stats</h2>

      <div className="dropdown-group">
        <label>Department:</label>
        <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedYear(''); setSelectedSection(''); }}>
          <option value="">--Select--</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {selectedDept && (
        <div className="dropdown-group">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setSelectedSection(''); }}>
            <option value="">--Select--</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {selectedYear && (
        <div className="dropdown-group">
          <label>Section:</label>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">--Select--</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      )}

      {selectedSection && (
        <div className="result-card">
          <h3>Results for {selectedDept} - Year {selectedYear} - Section {selectedSection}</h3>
          <p>✅ Mails Sent: <strong>{getStats().sent}</strong></p>
          <p>❌ Mails Not Sent: <strong>{getStats().notSent}</strong></p>
        </div>
      )}
    </div>
  );
};

export default DepartmentStats;