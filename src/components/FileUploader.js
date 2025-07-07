import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './FileUploader.css';
import Navbar from './Navbar';

const FileUploader = () => {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState('');
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [message, setMessage] = useState('');
  const [sendEmails, setSendEmails] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const branch = location.state?.branch;
  const year = location.state?.year;

  useEffect(() => {
    if (!branch || !year) {
      setMessage("❌ Branch or Year not selected. Redirecting...");
      setTimeout(() => navigate('/Departments'), 3000);
    }
  }, [branch, year, navigate]);

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
    localStorage.setItem('branch', branch);
    localStorage.setItem('year', year);
    navigate('/tableview');
  };

  const handleUploadToBackend = async () => {
    if (!fileInputRef.current?.files[0]) {
      setMessage("⚠️ Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);
    formData.append("send_emails", sendEmails);

    const accessToken = localStorage.getItem('jwtToken');
    setLoading(true);
    setMessage("⏳ Uploading...");

    try {
      const response = await fetch("http://localhost:8000/api/students/upload-rooms/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ ${result.message}
Processed: ${result.processed_records}, Updated: ${result.updated_students}, 
Failed: ${result.failed_records}, Emails Sent: ${result.emails_sent}`);
      } else {
        setMessage(`❌ Upload failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error uploading to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="uploader-container"
        style={{
          backgroundImage: "url('/wave-haikei.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="file-uploader-container">
          {branch && year && (
            <div className="context-info">
              <p>
                <strong>Branch:</strong> {branch} | <strong>Year:</strong> {year}
              </p>
              <button
                className="hierarchy-button"
                onClick={() => navigate('/Hierarchy')}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                🔍 View Hierarchy
              </button>
            </div>
          )}

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

          <label style={{ marginTop: '10px' }}>
            <input
              type="checkbox"
              checked={sendEmails}
              onChange={(e) => setSendEmails(e.target.checked)}
            />{" "}
            Send emails to students
          </label>

          {message && <div className="message">{message}</div>}

          <button className="submit-button" onClick={handleSubmit}>
            Preview Table
          </button>

          <button
            className="submit-button"
            style={{ backgroundColor: '#2e8b57', marginTop: '10px' }}
            onClick={handleUploadToBackend}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload to Backend"}
          </button>
        </div>
      </div>
    </>
  );
};

export default FileUploader;