import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Departments.css';
import Navbar from './Navbar';

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local fallback map for unknown branch codes
  const branchNameMap = {
    CSE: 'Computer Science & Engineering (CSE)',
    CAI: 'Computer Science & Engineering Artificial Intelligence (CAI)',
    CSM: 'Computer Science & Engineering AI & ML (CSM)',
    CSN: 'Computer Science & Engineering Networks (CSN)',
    CST: 'Computer Science & Engineering Technology (CST)',
    CSD: 'Computer Science & Engineering Data Science (CSD)',
    CSC: 'Computer Science & Engineering Cyber Security (CSC)',
    ECE: 'Electronics & Communication Engineering (ECE)',
    EEE: 'Electrical & Electronics Engineering (EEE)',
    MEC: 'Mechanical Engineering (MEC)',
    CIV: 'Civil Engineering (CIV)',
    ME: 'Mechanical Engineering (ME)', // fallback for ME
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:8000/api/students/branches/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('API Response Error Body:', errorBody);
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Patch department names using local map if missing
        const enrichedDepartments = data.branches.map((dept) => ({
          ...dept,
          name: dept.name || branchNameMap[dept.code] || `Unknown (${dept.code})`,
        }));

        setDepartments(enrichedDepartments);
      } catch (err) {
        setError('Failed to load departments.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleClick = (dept) => {
  navigate(`/Year/${dept.code}`);
};


  return (
    <>
      <Navbar />

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
          alignItems: 'center',
          paddingTop: '60px',
        }}
      >
        <div className="departments-card">
          <div className="departments-header">Departments</div>

          {loading && <p>Loading departments...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="departments-list">
            {departments.map((dept, index) => (
              <button
                key={index}
                className="dept-button"
                onClick={() => handleClick(dept)}
              >
                {dept.name} ({dept.student_count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Departments;