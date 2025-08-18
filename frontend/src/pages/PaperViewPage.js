import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import PDFViewer from "../components/PDFViewer";

export default function PaperViewPage() {
  const { class: paperClass, subject, year } = useParams();
  const navigate = useNavigate();

  // API base URL - Use localhost for local testing, Render URL for production
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://aimers-backend-clv3.onrender.com/api';

  const containerRef = useRef(null);
  const [fileExists, setFileExists] = useState(null); // null=loading, true=exists, false=missing
  const [error, setError] = useState(null);
  const [paperData, setPaperData] = useState(null);

  // Check if paper exists in MongoDB before loading
  useEffect(() => {
    setFileExists(null);
    setError(null);
    
    const checkPaperAvailability = async () => {
      try {
        console.log('Checking paper availability for:', paperClass, subject, year);
        
        const response = await fetch(`${API_BASE_URL}/papers/check/${paperClass}/${subject.toLowerCase()}/${year}`);
        const data = await response.json();
        
        console.log('Paper availability response:', data);
        
        if (data.available && data.paperId) {
          setFileExists(true);
          setPaperData({
            paperId: data.paperId,
            filename: data.filename,
            url: `${API_BASE_URL}/pdf/${data.paperId}`
          });
        } else {
          setFileExists(false);
          setError('Paper not found in database');
        }
      } catch (error) {
        console.error('Paper check error:', error);
        setFileExists(false);
        setError(`Network error: ${error.message}`);
      }
    };

    checkPaperAvailability();
  }, [paperClass, subject, year, API_BASE_URL]);

  // Disable right click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="compact-paper-viewer">
      {/* Header */}
      <header className="viewer-header">
        <div className="header-content">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Papers
          </button>
          <div className="header-info">
            <h1 className="viewer-title">
              {subject} Board Paper {year}
            </h1>
            <p className="viewer-subtitle">Class {paperClass}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="viewer-content" ref={containerRef}>
        {fileExists === null ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading paper...</p>
          </div>
        ) : fileExists === false ? (
          <div className="error-container">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Paper Not Found</h3>
            <p>{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="error-button"
            >
              <i className="fas fa-arrow-left"></i>
              Go Back
            </button>
          </div>
        ) : (
          <div className="pdf-viewer-container">
            <PDFViewer 
              fileUrl={paperData.url} 
              title={`${subject} Board Paper ${year}`}
            />
          </div>
        )}
      </main>
    </div>
  );
}