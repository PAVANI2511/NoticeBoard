import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentList.css';
import Navbar from './Navbar';

const StudentList = () => {
  const { branchCode, year } = useParams();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/students/branches/${branchCode}/years/${year}/students/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch student data');

        const data = await response.json();
        setStudents(data.students || []);
      } catch (err) {
        console.error(err);
        setError('❌ Error loading students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [branchCode, year, accessToken]);

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="student-list-container">
        <h2>🎓 Students - {branchCode.toUpperCase()}, Year {year}</h2>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.roll_no || index}>
                  <td>{index + 1}</td>
                  <td>{student.roll_no}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default StudentList;