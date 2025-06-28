import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './FileUploader.css';

const FileUploader = () => {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState('');
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const readExcel = (file) => {
    if (!file) return;

    setFileName(file.name);
    setMessage('✅ File uploaded successfully.');

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const allRows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        blankrows: false,
      });

      if (allRows.length === 0) {
        setMessage('⚠️ The uploaded sheet is empty.');
        return;
      }

      const [rawHeaderRow, ...rawDataRows] = allRows;
      const headerRow = rawHeaderRow.filter((header) => header !== '');
      const dataRows = rawDataRows.filter((row) => row.some((cell) => cell !== ''));

      const finalData = dataRows.map((row) =>
        Object.fromEntries(headerRow.map((key, index) => [key, row[index] ?? '']))
      );

      setHeaders(headerRow);
      setExcelData(finalData);
    };

    reader.onerror = () => setMessage('❌ Failed to read file.');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    readExcel(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    readExcel(e.target.files[0]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (excelData.length === 0) {
      setMessage('⚠️ Please upload a file first.');
      return;
    }

    localStorage.setItem('excelData', JSON.stringify(excelData));
    localStorage.setItem('headers', JSON.stringify(headers));
    navigate('/tableview');
  };

  return (
    <div className="file-uploader-container">
      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <img src="/clouds.webp" alt="Upload" className="upload-icon" />
        <p>Drag & Drop file here</p>
        <p>or</p>
        <button className="browse-button" onClick={handleBrowseClick}>
          Browse Files
        </button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
        />
      </div>

      {fileName && (
        <div className="file-info">
          📄 <strong>{fileName}</strong>
        </div>
      )}

      {message && <div className="message">{message}</div>}

      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default FileUploader;
