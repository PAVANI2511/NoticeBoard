import React, { useRef } from 'react';
import './FileUploader.css';

const FileUploader = () => {
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    console.log('Dropped files:', e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    console.log('Selected file:', e.target.files[0]);
  };

  const handleSubmit = () => {
    alert('File successfully submitted!');
  };

  return (
    <div className="upload-container">
      <div
        className="upload-box"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <img
          src="clouds.webp"
          alt="Upload"
          className="upload-icon"
        />
        <p>Drag & Drop file here</p>
        <p>or</p>
        <button className="browse-btn" onClick={handleBrowseClick}>
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default FileUploader;