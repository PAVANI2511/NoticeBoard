import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hierarchy.css';

const Hierarchy = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const accessToken = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/students/hierarchy/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch hierarchy');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load hierarchy overview');
      }
    };

    fetchHierarchy();
  }, [accessToken]);

  const handleViewStudents = (branchCode, year) => {
    navigate(`/studentlist/${branchCode}/${year}`);
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!data) return <div className="loading">⏳ Loading hierarchy...</div>;

  return (
    <div className="hierarchy-container">
      <h2>📊 Student Hierarchy Overview</h2>
      <p><strong>Total Students:</strong> {data.total_students}</p>
      <p><strong>Total Branches:</strong> {data.total_branches}</p>

      <div className="branches">
        {data.branches && Object.entries(data.branches).map(([branchCode, branchData]) => (
          <div className="branch-card" key={branchCode}>
            <h3>{branchData.name}</h3>
            <p><strong>Total Students:</strong> {branchData.total_students}</p>
            <div className="years">
              {branchData.years && Object.entries(branchData.years).map(([year, yearData]) => (
                <div className="year-entry" key={year}>
                  <p>
                    <strong>{yearData.name}:</strong> {yearData.student_count} students
                  </p>
                  <button
                    className="studentlist-button"
                    onClick={() => handleViewStudents(branchCode, year)}
                  >
                    📋 View Student List
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hierarchy;