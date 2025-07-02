import React, { useEffect, useState } from 'react';
import './TableView.css';

const TableView = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const showStatistics = () => {
    alert(`Total Rows: ${data.length}\nHeaders: ${headers.length}`);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>📊 Uploaded Excel Data</h2>
        <button className="stats-button" onClick={showStatistics}>
          📈 Statistics
        </button>
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
    </div>
  );
};

export default TableView;