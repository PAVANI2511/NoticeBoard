// src/components/StudentStatusViewer.js
import React, { useState } from 'react';
import './StudentStatusViewer.css';

const StudentStatusViewer = () => {
  const [status, setStatus] = useState('pending');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      let url = `http://127.0.0.1:8000/api/students/students-by-email-status/?status=${status}`;
      if (branch) url += `&branch=${branch}`;
      if (year) url += `&year=${year}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to fetch students');
      setStudents(data.students || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="student-status-viewer">
      <h2>View Students by Email Status</h2>

      <div className="filter-group">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="missing_gmail">Missing Gmail</option>
          <option value="missing_room">Missing Room</option>
        </select>

        <label>Branch:</label>
        <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g. CSE" />

        <label>Year:</label>
        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2" />

        <button onClick={fetchStudents}>Fetch</button>
      </div>

      {error && <p className="error">{error}</p>}

      {students.length > 0 && (
        <div className="student-list">
          <h3>Total: {students.length}</h3>
          <ul>
            {students.map(student => (
              <li key={student.id}>
                {student.roll_number} - {student.name} ({student.branch}, Year {student.year})<br />
                Gmail: {student.gmail_address || 'N/A'} | Hall: {student.exam_hall_number || 'N/A'} | Email Sent: {student.email_sent ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentStatusViewer;
