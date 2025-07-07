import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Year.css';

const Year = () => {
  const { branchCode } = useParams();
  const navigate = useNavigate();

  const [years, setYears] = useState([]);
  const [branchName, setBranchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const accessToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/students/branches/${branchCode}/years/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setBranchName(data.branch.name);
        setYears(data.years);
      } catch (error) {
        setError('Failed to load years.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [branchCode, accessToken]);

  const handleClick = (year) => {
    navigate('/FileUploader', {
      state: {
        branch: branchName,
        year: year.name,
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className="year-background"
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
      }}
    >
      <div className="container">
        <div className="header">Select Year - {branchName}</div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {years.map((y, index) => (
  <button
    key={y.year || index} // fallback to index if year is undefined
    className="year-button"
    onClick={() => handleClick(y)}
  >
    {y.name} ({y.student_count} students)
  </button>
))}
      </div>
    </div>
  );
};

export default Year;