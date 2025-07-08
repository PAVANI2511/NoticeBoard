import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FileUploader.css';
import Navbar from './Navbar';

const FileUploader = () => {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState('');
  const [csvData, setCsvData] = useState([]);
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

  const readCSV = (file) => {
    if (!file.name.endsWith('.csv')) {
      setMessage("❌ Please upload a valid .csv file.");
      return;
    }

    setFileName(file.name);
    setMessage('✅ CSV file uploaded.');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.trim().split('\n');
      if (lines.length === 0) {
        setMessage("⚠️ The file is empty.");
        return;
      }

      const [headerLine, ...dataLines] = lines;
      const headerRow = headerLine.split(',').map(h => h.trim());
      const finalData = dataLines.map(line => {
        const values = line.split(',').map(v => v.trim());
        return Object.fromEntries(headerRow.map((key, index) => [key, values[index] ?? '']));
      });

      setHeaders(headerRow);
      setCsvData(finalData);
    };

    reader.onerror = () => {
      setMessage("❌ Error reading the file.");
    };

    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    readCSV(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    readCSV(e.target.files[0]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (csvData.length === 0) {
      setMessage("⚠️ Please upload a CSV file first.");
      return;
    }

    localStorage.setItem('excelData', JSON.stringify(csvData));
    localStorage.setItem('headers', JSON.stringify(headers));
    localStorage.setItem('branch', branch);
    localStorage.setItem('year', year);
    navigate('/tableview');
  };

  const handleUploadToBackend = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setMessage("⚠️ Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("send_emails", sendEmails);

    const accessToken = localStorage.getItem('jwtToken');
    if (!accessToken) {
      setMessage("❌ Missing access token. Please login again.");
      return;
    }

    setLoading(true);
    setMessage("⏳ Uploading...");

    try {
      const response = await fetch('http://localhost:8000/api/students/upload-rooms/', {
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
      console.error("Upload error:", error);
      setMessage(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="uploader-container" style={{
        backgroundImage: "url('/wave-haikei.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className="file-uploader-container">
          {branch && year && (
            <div className="context-info">
              <p><strong>Branch:</strong> {branch} | <strong>Year:</strong> {year}</p>
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
            <p>Drag & Drop CSV file here</p>
            <p>or</p>
            <button className="browse-button" onClick={handleBrowseClick}>Browse Files</button>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              hidden
            />
          </div>

          {fileName && (
            <div className="file-info">📄 <strong>{fileName}</strong></div>
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
