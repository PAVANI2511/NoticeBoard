import React, { useEffect, useState } from 'react';
import './TableView.css';
import { FaPaperPlane, FaChartBar } from 'react-icons/fa';

const TableView = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [stats, setStats] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('excelData')) || [];
    const storedHeaders = JSON.parse(localStorage.getItem('headers')) || [];
    setData(storedData);
    setHeaders(storedHeaders);
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const pageRowIds = currentData.map((_, index) => index + startIndex);
      setSelectedRows(pageRowIds);
    }
    setSelectAll(!selectAll);
  };

  const handleResend = () => {
    if (selectedRows.length === 0) {
      alert("⚠️ Please select at least one person to resend.");
    } else {
      alert("📧 Resend triggered for selected unsent records.");
    }
  };

  const showStatistics = async () => {
    try {
      const token = localStorage.getItem('jwtToken'); // Ensure token is stored
      const response = await fetch('http://localhost:8000/api/students/statistics/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
      setShowPopup(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch statistics. Please check your token or server.');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const countSent = data.filter(row => row.sent === true).length;
  const countUnsent = data.length - countSent;

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="left-controls">
          <input
            type="checkbox"
            className="select-all-checkbox"
            title="Select All"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <button className="small-button resend-button" onClick={handleResend}>
            <FaPaperPlane />
            Resend
          </button>
        </div>

        <h2>📊 Uploaded CSV Data</h2>

        <div className="right-controls">
          <button className="small-button green-button" onClick={showStatistics}>
            <FaChartBar />
            Statistics
          </button>
        </div>
      </div>

      {currentData.length > 0 ? (
        <>
          <table className="styled-table">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={`header-${idx}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, rowIndex) => {
                const actualIndex = startIndex + rowIndex;
                const isSelected = selectedRows.includes(actualIndex);
                return (
                  <tr key={`row-${rowIndex}`} className={isSelected ? 'selected' : ''}>
                    {headers.map((col, colIndex) => (
                      <td key={`cell-${rowIndex}-${colIndex}`}>
                        {row[col] ?? ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination-buttons">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              ◀ Prev
            </button>
            <span className="page-info">
              Page <br /> {currentPage} of {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next ▶
            </button>
          </div>
        </>
      ) : (
        <p>No data available. Please upload a file first.</p>
      )}

      {showPopup && stats && (
        <div className="popup-overlay">
          <div className="popup-content scrollable">
            <h3>📊 System Statistics</h3>
            <p><strong>Total Students:</strong> {stats.total_students}</p>
            <p><strong>With Gmail:</strong> {stats.students_with_gmail}</p>
            <p><strong>With Room Info:</strong> {stats.students_with_room}</p>
            <p><strong>Emails Sent:</strong> {stats.emails_sent}</p>
            <p><strong>Emails Pending:</strong> {stats.emails_pending}</p>

            <h4>📚 Branch-wise Statistics</h4>
            {Object.entries(stats.branches_statistics).map(([branchCode, branch]) => (
              <div key={branchCode} className="branch-block">
                <h5>{branch.name}</h5>
                <p><strong>Total:</strong> {branch.count} | <strong>Emails Sent:</strong> {branch.emails_sent} | <strong>With Room:</strong> {branch.with_room}</p>
                <ul>
                  {branch.years &&
                    Object.entries(branch.years).map(([yearCode, year]) => (
                      <li key={yearCode}>
                        {year.name}: {year.count} students, {year.emails_sent} sent, {year.with_room} with room
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;
