import React, { useState } from "react";
import "./Student.css"; // Reuse styling from Student form

const ResendEmails = () => {
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // <-- new

  const token = localStorage.getItem("jwtToken");

  const branchNameMap = {
    CSE: "Computer Science & Engineering (CSE)",
    CAI: "CSE - Artificial Intelligence",
    CSM: "CSE - AI & ML",
    CSN: "CSE - Networks",
    CST: "CSE - Technology",
    CSD: "CSE - Data Science",
    CSC: "CSE - Cyber Security",
    ECE: "Electronics & Communication Engineering",
    EEE: "Electrical & Electronics Engineering",
    MEC: "Mechanical Engineering",
    CIV: "Civil Engineering",
  };

  const resendEmails = async () => {
    const payload = {};

    if (branch && year) {
      payload.branch = branch;
      payload.year = year;
    } else {
      payload.send_to_all = true;
    }

    setLoading(true); // start loading
    setResult(null);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/students/resend-pending-emails/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || data.error || "Failed to resend emails");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="student-form">
      <h2>Resend Emails to Pending Students</h2>
      <form>
        <label>Department</label>
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">Select Department</option>
          {Object.entries(branchNameMap).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <div className="btn-group">
          <button type="button" onClick={resendEmails} disabled={loading}>
            {loading ? "Sending..." : "Resend Emails"}
          </button>
        </div>
      </form>

      {error && (
        <p className="live-message-text invalid">
          ❌ {error}
        </p>
      )}

      {result && (
        <div className="student-list">
          <p>
            <strong>{result.message}</strong>
          </p>
          <p>
            Emails Sent: {result.emails_sent}, Failures: {result.email_failures}
          </p>
          <ul>
            {result.results.map((r, index) => (
              <li key={index}>
                <strong>{r.roll_number}</strong> - {r.name}:{" "}
                {r.success ? r.message : `❌ ${r.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResendEmails;
