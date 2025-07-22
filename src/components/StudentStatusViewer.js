import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./Student.css"; 

const StudentStatusViewer = () => {
  const [status, setStatus] = useState("pending");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [fetchTriggered, setFetchTriggered] = useState(false);

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

  const handleFetch = async () => {
    try {
      setFetchTriggered(true);
      let url = `http://localhost:8000/api/students/students-by-email-status/?status=${status}`;
      if (branch) url += `&branch=${branch}`;
      if (year) url += `&year=${year}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to fetch students");

      setStudents(data.students || []);
      setError(null);
    } catch (err) {
      setStudents([]);
      setError(err.message);
    }
  };

  return (
    <div className="student-form">
      <h2>View Students by Email Status</h2>
      <form>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="missing_gmail">Missing Gmail</option>
          <option value="missing_room">Missing Room</option>
        </select>

        <label>Branch</label>
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">Select Branch</option>
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
          <button type="button" onClick={handleFetch}>
            Fetch Students
          </button>
        </div>
      </form>

      {/* Show error if any */}
      {error && (
        <p className="live-message-text invalid">
          <FaTimesCircle /> {error}
        </p>
      )}

      {/* Show student data if present */}
      {students.length > 0 ? (
        <div className="student-list">
          <h3>Total: {students.length}</h3>
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                <strong>{student.roll_number}</strong> - {student.name} ({student.branch}, Year {student.year})<br />
                Gmail: {student.gmail_address || "N/A"} | Hall: {student.exam_hall_number || "N/A"} | Email Sent:{" "}
                {student.email_sent ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        fetchTriggered && !error && (
          <p className="live-message-text invalid">
            <FaTimesCircle /> No students found for the selected criteria.
          </p>
        )
      )}
    </div>
  );
};

export default StudentStatusViewer;
