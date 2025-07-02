import React, { useEffect, useState } from 'react';
import './TableView.css';

const TableView = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectAll, setSelectAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mailStats, setMailStats] = useState({ sent: 0, notSent: 0 });

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
    setSelectAll(!selectAll);
  };

  const handleResend = () => {
    alert('Resending emails to all unsent users...');
  };

  const showStatistics = () => {
    let sent = 0, notSent = 0;
    data.forEach(row => {
      if (row.status === 'sent') sent++;
      else notSent++;
    });
    setMailStats({ sent, notSent });
    setShowPopup(true);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="left-controls">
          <input
            type="checkbox"
            title="Select All"
            checked={selectAll}
            onChange={handleSelectAll}
            className="select-all-checkbox"
          />
          <button className="small-button resend-button" onClick={handleResend} title="Resend Unsent">
            <span role="img" aria-label="resend">🔁</span> <span>Resend</span>
          </button>
        </div>

        <h2>📊 Uploaded Excel Data</h2>

        <div className="right-controls">
          <button className="small-button green-button" onClick={showStatistics} title="View Statistics">
            <span role="img" aria-label="statistics">📈</span> <span>Statistics</span>
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
              {currentData.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {headers.map((col, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`}>{row[col] ?? ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-buttons">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              ◀ Prev
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Next ▶
            </button>
          </div>
        </>
      ) : (
        <p>No data available. Please upload a file first.</p>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>📊 Mail Delivery Statistics</h3>
            <p>✅ Mails Sent: <strong>{mailStats.sent}</strong></p>
            <p>❌ Mails Not Sent: <strong>{mailStats.notSent}</strong></p>
            <button className="close-button" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;
