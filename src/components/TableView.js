import React, { useEffect, useState } from 'react';
import './TableView.css';
import { FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TableView = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const navigate = useNavigate();

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
    navigate('/StudentDashboard');
  };

  const countSent = data.filter(row => row.sent === true).length;
  const countUnsent = data.length - countSent;

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="left-controls">
          {/* Removed checkbox and resend button */}
        </div>

        <h2>📊 Uploaded CSV Data</h2>

        <div className="right-controls">
          <button className="small-button green-button" onClick={showStatistics}>
            <FaChartBar />
            StudentDashboard
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
                    <td key={`cell-${rowIndex}-${colIndex}`}>
                      {row[col] ?? ''}
                    </td>
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
    </div>
  );
};

export default TableView;
