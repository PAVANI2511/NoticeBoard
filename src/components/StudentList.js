import React, { useEffect, useState } from 'react';
import './StudentList.css';

const branchNameMap = {
  CSE: "Computer Science & Engineering (CSE)",
  CAI: "Computer Science & Engineering Artificial Intelligence (CAI)",
  CSM: "Computer Science & Engineering AI & ML (CSM)",
  CSN: "Computer Science & Engineering Networks (CSN)",
  CST: "Computer Science & Engineering Technology (CST)",
  CSD: "Computer Science & Engineering Data Science (CSD)",
  CSC: "Computer Science & Engineering Cyber Security (CSC)",
  ECE: "Electronics & Communication Engineering (ECE)",
  EEE: "Electrical & Electronics Engineering (EEE)",
  MEC: "Mechanical Engineering (MEC)",
  CIV: "Civil Engineering (CIV)",
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    phone_number: '',
    gmail_address: '',
    branch: '',
    year: '',
    exam_hall_number: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/students/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setStudents(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      if (response.status === 204) {
        setStudents(students.filter((s) => s.id !== id));
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setFormData({ ...student });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${editingStudent}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Update failed');
      const updated = await response.json();
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditingStudent(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredStudents = students.filter((s) => {
    const matchesRoll = s.roll_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = formData.branch === '' || s.branch === formData.branch;
    const matchesYear = formData.year === '' || s.year.toString() === formData.year;
    return matchesRoll && matchesBranch && matchesYear;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>Student List</h2>

      <input
        type="text"
        placeholder="Search by Roll Number"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      {/* Filter Dropdowns */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <select
          value={formData.branch}
          onChange={(e) => {
            setFormData({ ...formData, branch: e.target.value });
            setCurrentPage(1);
          }}
        >
          <option value="">All Branches</option>
          {Object.entries(branchNameMap).map(([code, fullName]) => (
            <option key={code} value={code}>{fullName}</option>
          ))}
        </select>

        <select
          value={formData.year}
          onChange={(e) => {
            setFormData({ ...formData, year: e.target.value });
            setCurrentPage(1);
          }}
        >
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : currentData.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ margin: 'auto', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Hall Number</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((student) => (
                <tr key={student.id}>
                  {editingStudent === student.id ? (
                    <>
                      <td><input name="roll_number" value={formData.roll_number} onChange={handleInputChange} /></td>
                      <td><input name="name" value={formData.name} onChange={handleInputChange} /></td>
                      <td>
                        <select name="branch" value={formData.branch} onChange={handleInputChange}>
                          {Object.entries(branchNameMap).map(([code, fullName]) => (
                            <option key={code} value={code}>{fullName}</option>
                          ))}
                        </select>
                      </td>
                      <td><input name="year" value={formData.year} onChange={handleInputChange} /></td>
                      <td><input name="exam_hall_number" value={formData.exam_hall_number} onChange={handleInputChange} /></td>
                      <td><input name="phone_number" value={formData.phone_number} onChange={handleInputChange} /></td>
                      <td><input name="gmail_address" value={formData.gmail_address} onChange={handleInputChange} /></td>
                      <td>
                        <button className="button2" onClick={handleUpdate}>Save</button>
                        <button className="button3" onClick={() => setEditingStudent(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{student.roll_number}</td>
                      <td>{student.name}</td>
                      <td style={{ maxWidth: '200px' }}>{branchNameMap[student.branch] || student.branch}</td>
                      <td>{student.year}</td>
                      <td>{student.exam_hall_number}</td>
                      <td>{student.phone_number}</td>
                      <td>{student.gmail_address}</td>
                      <td>
                        <button className="button1" onClick={() => handleEdit(student)}>Edit</button>
                        <button className="button4" onClick={() => handleDelete(student.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-buttons">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>◀ Prev</button>
            <span className="page-info">
              Page <br /> {currentPage} of {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next ▶</button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
