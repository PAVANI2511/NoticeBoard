import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './FileUploader.css';
import Navbar from './Navbar';

const FileUploader = () => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [sendEmails, setSendEmails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null); // Store full API response
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
      setUploadResult(null); // Clear previous results
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage('Please select a file before uploading.');
      return;
    }

    setLoading(true);
    setMessage('📤 Uploading...');
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('send_emails', sendEmails);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/students/upload-rooms/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("📨 Upload API Result:", result);

      if (response.ok) {
        setUploadResult(result);
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error: ${result.detail || 'Upload failed'}`);
      }
    } catch (error) {
      setMessage('❌ Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!file) {
      setMessage('Please select a CSV file before previewing.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length > 0) {
          const headers = result.meta.fields;
          const enrichedData = result.data.map(row => ({ ...row, sent: false }));

          localStorage.setItem('excelData', JSON.stringify(enrichedData));
          localStorage.setItem('headers', JSON.stringify(headers));
          navigate('/TableView');
        } else {
          setMessage('❌ CSV file is empty or invalid.');
        }
      },
      error: (error) => {
        setMessage(`❌ Error parsing CSV: ${error.message}`);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div
        className="departments-background"
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
          paddingTop: '20px',
        }}
      >
        <div className="file-uploader-container">
          <div className="drop-area" onClick={handleBrowseClick}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/724/724933.png"
              alt="Upload Icon"
              className="upload-icon"
            />
            <p>Click or drag your CSV file here</p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            style={{ display: 'none' }}
          />

          <label>
            <input
              type="checkbox"
              checked={sendEmails}
              onChange={() => setSendEmails(!sendEmails)}
            />
            Send Emails to Students
          </label>

          <div className="button-group">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
            <button
              className="preview-button"
              onClick={handlePreview}
              disabled={!file || loading}
            >
              Preview
            </button>
          </div>

          {file && <div className="file-info">{file.name}</div>}
          {message && <div className="message">{message}</div>}

          {/* 📊 Full API Response Output */}
          {uploadResult && (
            <div className="upload-details">
              <h4>📊 Upload Summary</h4>
              <ul>
                <li><strong>Total Processed:</strong> {uploadResult.total_processed}</li>
                <li><strong>Updated:</strong> {uploadResult.updated_count}</li>
                <li><strong>Not Found:</strong> {uploadResult.not_found_count}</li>
                {uploadResult.not_found_roll_numbers?.length > 0 && (
                  <li>
                    <strong>Missing Roll Numbers:</strong> {uploadResult.not_found_roll_numbers.join(', ')}
                  </li>
                )}
                <li><strong>Emails Sent:</strong> {uploadResult.emails_sent}</li>
                <li><strong>Email Failures:</strong> {uploadResult.email_failures}</li>
              </ul>

              {uploadResult.email_results?.length > 0 && (
                <>
                  <h4>📬 Email Status per Student</h4>
                  <ul className="email-results">
                    {uploadResult.email_results.map((res) => (
                      <li
                        key={res.student_id}
                        style={{ color: res.success ? 'green' : 'red' }}
                      >
                        {res.roll_number} - {res.email} ➜ {res.message}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploader;
