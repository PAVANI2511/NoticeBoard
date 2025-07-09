import React, { useEffect, useState } from 'react';
import './StudentList.css';

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

  const filteredStudents = students.filter((s) =>
    s.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>Student List</h2>

      <input
        type="text"
        placeholder="Search by Roll Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
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
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                {editingStudent === student.id ? (
                  <>
                    <td><input name="roll_number" value={formData.roll_number} onChange={handleInputChange} /></td>
                    <td><input name="name" value={formData.name} onChange={handleInputChange} /></td>
                    <td><input name="branch" value={formData.branch} onChange={handleInputChange} /></td>
                    <td><input name="year" value={formData.year} onChange={handleInputChange} /></td>
                    <td><input name="exam_hall_number" value={formData.exam_hall_number} onChange={handleInputChange} /></td>
                    <td><input name="phone_number" value={formData.phone_number} onChange={handleInputChange} /></td>
                    <td><input name="gmail_address" value={formData.gmail_address} onChange={handleInputChange} /></td>
                    <td>
                      <button className="button2" onClick={handleUpdate}>Save</button>
                      <button onClick={() => setEditingStudent(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{student.roll_number}</td>
                    <td>{student.name}</td>
                    <td>{student.branch}</td>
                    <td>{student.year}</td>
                    <td>{student.exam_hall_number}</td>
                    <td>{student.phone_number}</td>
                    <td>{student.gmail_address}</td>
                    <td>
                      <button className="button1" onClick={() => handleEdit(student)}>Edit</button>
                      <button onClick={() => handleDelete(student.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
