import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; // CSV parser
import './FileUploader.css';
import Navbar from './Navbar';

const FileUploader = () => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [sendEmails, setSendEmails] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
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
      if (response.ok) {
        setMessage(`✅ File uploaded successfully!
Processed: ${result.processed_records}, 
Updated: ${result.updated_students}, 
Failed: ${result.failed_records}, 
Emails Sent: ${result.emails_sent}`);
      } else {
        setMessage(`❌ Error: ${result.detail || 'Upload failed'}`);
      }
    } catch (error) {
      setMessage('❌ Server error. Please try again later.');
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
            <button className="submit-button" onClick={handleSubmit}>
              Upload File
            </button>
            <button className="preview-button" onClick={handlePreview} disabled={!file}>
              Preview
            </button>
          </div>

          {file && <div className="file-info">{file.name}</div>}
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </>
  );
};

export default FileUploader;
