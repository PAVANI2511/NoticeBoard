import React, { useEffect, useState } from 'react';
import './DepartmentStats.css'; // You can create custom styles here

const DepartmentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://127.0.0.1:8000/api/students/statistics/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stats-container">
      <h2>Department Statistics</h2>
      <div className="overall-stats">
        <p><strong>Total Students:</strong> {stats.total_students}</p>
        <p><strong>Students with Gmail:</strong> {stats.students_with_gmail}</p>
        <p><strong>Students with Room:</strong> {stats.students_with_room}</p>
        <p><strong>Emails Sent:</strong> {stats.emails_sent}</p>
        <p><strong>Emails Pending:</strong> {stats.emails_pending}</p>
      </div>

      <h3>Branch-wise Statistics</h3>
      {Object.entries(stats.branches_statistics).map(([branchCode, branchData]) => (
        <div key={branchCode} className="branch-card">
          <h4>{branchData.name}</h4>
          <p><strong>Total Students:</strong> {branchData.count}</p>
          <p><strong>Emails Sent:</strong> {branchData.emails_sent}</p>
          <p><strong>Students with Room:</strong> {branchData.with_room}</p>

          <div className="years-info">
            <h5>Year-wise Breakdown:</h5>
            {Object.entries(branchData.years).map(([yearKey, yearData]) => (
              <div key={yearKey} className="year-card">
                <p><strong>{yearData.name}</strong></p>
                <p>Count: {yearData.count}</p>
                <p>Emails Sent: {yearData.emails_sent}</p>
                <p>With Room: {yearData.with_room}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentStats;
