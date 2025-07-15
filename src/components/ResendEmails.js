// src/components/ResendEmails.js
import React, { useState } from 'react';
import './ResendEmails.css';

const ResendEmails = () => {
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [studentIds, setStudentIds] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const resendEmails = async () => {
    const token = localStorage.getItem('jwtToken');
    const payload = {};

    if (studentIds.trim()) {
      payload.student_ids = studentIds.split(',').map(id => parseInt(id.trim(), 10));
    } else if (branch && year) {
      payload.branch = branch;
      payload.year = year;
    } else {
      payload.send_to_all = true;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/students/resend-pending-emails/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.error || 'Failed to resend emails');
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="resend-emails">
      <h2>Resend Emails to Pending Students</h2>

      <div className="input-group">
        <label>Branch (optional):</label>
        <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g. CSE" />

        <label>Year (optional):</label>
        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2" />

        <label>Student IDs (comma-separated, optional):</label>
        <input type="text" value={studentIds} onChange={(e) => setStudentIds(e.target.value)} placeholder="e.g. 1,2,3" />
      </div>

      <button onClick={resendEmails}>Resend Emails</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p><strong>{result.message}</strong></p>
          <p>Emails Sent: {result.emails_sent}, Failures: {result.email_failures}</p>
          <ul>
            {result.results.map((r, index) => (
              <li key={index}>
                {r.roll_number} - {r.name}: {r.success ? r.message : `❌ ${r.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResendEmails;
