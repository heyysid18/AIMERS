import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import PDFViewer from "../components/PDFViewer";

export default function PaperViewPage() {
  const { class: paperClass, subject, year } = useParams();
  const navigate = useNavigate();

  // Fix the subject folder name - convert to lowercase and handle spaces properly
  const subjectFolder = subject?.toLowerCase().replace(/\s+/g, "");
  const fileUrl = `http://localhost:5000/uploads/papers/${paperClass}/${subjectFolder}/${year}.pdf`;

  const containerRef = useRef(null);
  const [fileExists, setFileExists] = useState(null); // null=loading, true=exists, false=missing
  const [error, setError] = useState(null);

  // Check if PDF exists before loading
  useEffect(() => {
    setFileExists(null);
    setError(null);
    
    console.log('Checking file URL:', fileUrl);
    
    fetch(fileUrl, { 
      method: "HEAD",
      mode: 'cors'
    })
      .then((res) => {
        console.log('PDF check response:', res.status, res.headers);
        if (res.ok) {
          setFileExists(true);
        } else {
          setFileExists(false);
          setError(`File not found (Status: ${res.status})`);
        }
      })
      .catch((error) => {
        console.error('PDF check error:', error);
        setFileExists(false);
        setError(`Network error: ${error.message}`);
      });
  }, [fileUrl]);

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
              fileUrl={fileUrl} 
              title={`${subject} Board Paper ${year}`}
            />
          </div>
        )}
      </main>
    </div>
  );
}
