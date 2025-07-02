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

  const showStatistics = () => {
    setShowPopup(true);
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

        <h2>📊 Uploaded Excel Data</h2>

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
                return (
                  <tr key={`row-${rowIndex}`}>
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
            <h3>📊 Mail Statistics</h3>
            <p><strong>✅ Sent:</strong> {countSent}</p>
            <p><strong>❌ Not Sent:</strong> {countUnsent}</p>
            <button className="close-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;
