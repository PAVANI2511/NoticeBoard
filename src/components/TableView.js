import React, { useEffect, useState } from 'react';
import './TableView.css';

const TableView = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(false);
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

  const calculateStatistics = () => {
    let sent = 0;
    let notSent = 0;
    data.forEach(row => {
      if (row.sent) sent += Number(row.sent);
      if (row.notSent) notSent += Number(row.notSent);
    });
    return { sent, notSent };
  };

  const stats = calculateStatistics();

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>📊 Uploaded Excel Data</h2>
        <button className="stats-button" onClick={() => setShowStats(true)}>
          📈 Statistics
        </button>
      </div>

      {currentData.length > 0 ? (
        <>
          <div className="table-wrapper">
            {showStats && (
              <div className="overlay-card">
                <h3>📈 Mail Summary</h3>
                <p>✅ Sent: <strong>{stats.sent}</strong></p>
                <p>❌ Not Sent: <strong>{stats.notSent}</strong></p>
                <button onClick={() => setShowStats(false)}>Close</button>
              </div>
            )}

            <table className="styled-table">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th key={`header-${idx}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {headers.map((col, colIndex) => (
                      <td key={`cell-${rowIndex}-${colIndex}`}>{row[col] ?? ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-buttons">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              ◀ Prev
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next ▶
            </button>
          </div>
        </>
      ) : (
        <p>No data available. Please upload a file first.</p>
      )}
    </div>
  );
};

export default TableView;
