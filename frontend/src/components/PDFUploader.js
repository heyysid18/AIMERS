import React, { useState } from 'react';
import axios from 'axios';
import '../Theme.css';

// Constants
const TYPES = [
  { label: "DPP", value: "dpps" },
  { label: "Board Paper", value: "papers" }
];
const CLASSES = ["9th", "10th", "11th", "12th"];
const SUBJECTS = [
  "mathematics",
  "physics",
  "chemistry",
  "biology"
];

// API base URL - Use localhost for local testing, Render URL for production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://aimers-backend-clv3.onrender.com/api';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// SelectBox for concise usage below
function SelectBox({ label, value, setValue, options }) {
  return (
    <select value={value} onChange={e => setValue(e.target.value)} className="upload-select">
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || capitalize(opt)}
        </option>
      ))}
    </select>
  );
}

export default function PDFUploader() {
  // PDF upload state
  const [fileType, setFileType] = useState("dpps");
  const [className, setClassName] = useState("10th");
  const [subject, setSubject] = useState("mathematics");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Video topic upload state
  const [videoClass, setVideoClass] = useState("10th");
  const [videoSubject, setVideoSubject] = useState("mathematics");
  const [videoTopic, setVideoTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSuccess, setVideoSuccess] = useState(false);

  // Text DPP upload state
  const [dppClass, setDppClass] = useState("10th");
  const [dppSubject, setDppSubject] = useState("mathematics");
  const [dppTitle, setDppTitle] = useState("");
  const [dppContent, setDppContent] = useState("");
  const [dppSuccess, setDppSuccess] = useState(false);
  const [dppTopic, setDppTopic] = useState("");

  const resetForm = () => {
    setFile(null);
    setFileUrl("");
    setUploading(false);
    setUploadMessage("");
    setYear(new Date().getFullYear().toString());
    setVideoTopic("");
    setVideoUrl("");
    setVideoSuccess(false);
    setDppTitle("");
    setDppContent("");
    setDppTopic("");
    setDppSuccess(false);
  };

  // Handle PDF Upload
  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("❌ Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("year", year);

    try {
      setUploading(true);
      setUploadMessage("📤 Uploading...");
      
      const endpoint = `${API_BASE_URL}/upload/${fileType}/${className}/${subject}`;
      console.log('Uploading to:', endpoint);
      
      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log('Upload response:', res.data);
      setFileUrl(res.data.paperId ? `/api/pdf/${res.data.paperId}` : '');
      setUploadMessage("✅ " + res.data.message);
      
      // Reset form after successful upload
      setTimeout(() => {
        resetForm();
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage("❌ Upload failed: " + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  // Handle Video Topic Upload
  const handleVideoUpload = async () => {
    if (!videoTopic || !videoUrl) {
      alert("Please enter topic name and video link.");
      return;
    }
    
    try {
      console.log('Starting video upload...');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Sending video upload request:', {
        className: videoClass,
        subject: videoSubject,
        topic: videoTopic,
        url: videoUrl
      });
      
      const response = await axios.post(`${API_BASE_URL}/upload/video`, {
        className: videoClass,
        subject: videoSubject,
        topic: videoTopic,
        url: videoUrl,
      });
      
      console.log('Video upload response:', response.data);
      setVideoSuccess(true);
      setVideoTopic("");
      setVideoUrl("");
    } catch (error) {
      console.error('Video upload error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`❌ Failed to upload video link: ${errorMessage}`);
    }
  };

  // Handle Text DPP Upload
  const handleDppUpload = async () => {
    if (!dppTitle || !dppContent || !dppTopic) return alert("Please fill all DPP fields.");
    try {
      await axios.post(`${API_BASE_URL}/upload/dpp`, {
        className: dppClass,
        subject: dppSubject,
        title: dppTitle,
        content: dppContent,
        topic: dppTopic
      });
      setDppSuccess(true);
      setDppTitle("");
      setDppContent("");
      setDppTopic("");
    } catch {
      alert("❌ Failed to upload DPP.");
    }
  };

  // --- UI ---
  return (
    <div className="upload-page">
      <div className="upload-container">
        {/* Hero Section */}
        <div className="upload-hero">
          <div className="hero-badge">
            <span className="badge-icon">📤</span>
            <span className="badge-text">Content Upload</span>
          </div>
          <h1 className="hero-title">
            Upload <span className="gradient-text">Content</span>
          </h1>
          <p className="hero-subtitle">
            Upload PDFs, video topics, and text DPPs to expand our educational resources
          </p>
        </div>

        {/* PDF Upload Section */}
        <div className="upload-section">
          <div className="section-header">
            <div className="section-icon">📄</div>
            <h2>PDF Upload</h2>
            <p>Upload DPPs and Board Papers for students</p>
          </div>
          
          <div className="upload-form">
            <div className="form-row">
              <SelectBox label="Type" value={fileType} setValue={setFileType} options={TYPES} />
              <SelectBox label="Class" value={className} setValue={setClassName} options={CLASSES.map(e => ({ label: e, value: e }))} />
              <SelectBox label="Subject" value={subject} setValue={setSubject} options={SUBJECTS.map(sub => ({ label: capitalize(sub), value: sub }))} />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Year (e.g., 2023)"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="upload-input"
              />
              <small className="input-help">
                Enter the year for this paper (e.g., 2023 for 2023 board paper)
              </small>
            </div>
            
            <div className="file-upload-area">
              <input
                type="file"
                accept="application/pdf"
                onChange={e => { setFile(e.target.files[0]); setFileUrl(""); }}
                className="file-input"
                id="pdf-file"
              />
              <label htmlFor="pdf-file" className="file-label">
                <span className="file-icon">📁</span>
                <span className="file-text">
                  {file ? file.name : "Choose PDF file or drag and drop"}
                </span>
              </label>
            </div>
            
            <button onClick={handleUpload} className="upload-btn primary" disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
          
          {/* Upload Message */}
          {uploadMessage && (
            <div className={`upload-message ${uploadMessage.includes('✅') ? 'success' : 'error'}`}>
              {uploadMessage}
            </div>
          )}
          
          {fileUrl && (
            <div className="upload-success">
              <h4>✅ Uploaded Successfully!</h4>
              <a href={fileUrl} target="_blank" rel="noreferrer" className="view-link">View in new tab</a>
              <iframe
                src={fileUrl + "#toolbar=0"}
                width="100%"
                height="400px"
                title="Uploaded PDF Preview"
                className="pdf-preview"
              />
            </div>
          )}
        </div>

        {/* VIDEO TOPIC SECTION */}
        <div className="upload-section">
          <div className="section-header">
            <div className="section-icon">🎥</div>
            <h2>Video Topic Upload</h2>
            <p>Add video topics to the course content</p>
          </div>
          
          <div className="upload-form">
            <div className="form-row">
              <SelectBox label="Class" value={videoClass} setValue={setVideoClass} options={CLASSES.map(e => ({ label: e, value: e }))} />
              <SelectBox label="videoSubject" setValue={setVideoSubject} options={SUBJECTS.map(sub => ({ label: capitalize(sub), value: sub }))} />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Topic name (e.g., Differentiation, Integration)"
                value={videoTopic}
                onChange={e => setVideoTopic(e.target.value)}
                className="upload-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="url"
                placeholder="YouTube Video Link"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="upload-input"
              />
            </div>
            
            <button
              onClick={handleVideoUpload}
              className="upload-btn success"
              disabled={!videoTopic || !videoUrl}
            >
              Upload Video Link
            </button>
            
            {videoSuccess && (
              <div className="success-message">
                ✅ Video has been uploaded. It will appear in the Courses Page under Grade {videoClass} → {capitalize(videoSubject)} → {videoTopic}.
              </div>
            )}
          </div>
        </div>

        {/* TEXT DPP SECTION */}
        <div className="upload-section">
          <div className="section-header">
            <div className="section-icon">📝</div>
            <h2>Text DPP Upload</h2>
            <p>Create and upload text-based DPPs</p>
          </div>
          
          <div className="upload-form">
            <div className="form-row">
              <SelectBox label="Class" value={dppClass} setValue={setDppClass} options={CLASSES.map(e => ({ label: e, value: e }))} />
              <SelectBox label="Subject" value={dppSubject} setValue={setDppSubject} options={SUBJECTS.map(sub => ({ label: capitalize(sub), value: sub }))} />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="DPP Title (e.g., Day 1: Quadratic Equations)"
                value={dppTitle}
                onChange={e => setDppTitle(e.target.value)}
                className="upload-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Topic (e.g., Algebra, Geometry, Trigonometry)"
                value={dppTopic}
                onChange={e => setDppTopic(e.target.value)}
                className="upload-input"
              />
            </div>
            
            <div className="form-group">
              <textarea
                placeholder="Enter DPP content here... (Questions, problems, etc.)"
                value={dppContent}
                onChange={e => setDppContent(e.target.value)}
                className="upload-textarea"
                rows="6"
              />
            </div>
            
            <button
              onClick={handleDppUpload}
              className="upload-btn warning"
              disabled={!dppTitle || !dppContent || !dppTopic}
            >
              Upload Text DPP
            </button>
            
            {dppSuccess && (
              <div className="success-message">
                ✅ Text DPP has been uploaded. It will appear in the DPPs section under Grade {dppClass} → {capitalize(dppSubject)} → {dppTopic}.
              </div>
            )}
          </div>
        </div>

        {/* Reset Form */}
        {(fileUrl || videoSuccess || dppSuccess) && (
          <div className="upload-actions">
            <button onClick={resetForm} className="upload-btn outline">
              Upload Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
