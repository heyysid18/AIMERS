import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PDFViewer from "../components/PDFViewer";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export default function DPPViewerPage() {
  const { class: grade, subject, date } = useParams();
  const [dpp, setDpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dppType, setDppType] = useState(null); // 'text' or 'pdf'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDpp = async () => {
      setLoading(true);
      setError(null);
      setDppType(null);
      
      try {
        // First, try to get text-based DPP from database
        const processedSubject = subject.toLowerCase();
        const dbUrl = `${API_BASE_URL}/dpps/${grade}/${processedSubject}/${date}`;
        
        try {
          const dbRes = await axios.get(dbUrl);
          if (dbRes.data.dpp) {
            setDpp(dbRes.data.dpp);
            setDppType('text');
            return;
          }
        } catch (dbError) {
          // Database DPP not found, continue to PDF check
        }
        
        // If no database DPP, try PDF file
        // Try different filename patterns for PDF DPPs
        const possiblePdfUrls = [
          `http://localhost:5000/uploads/dpps/${grade}th/${processedSubject}/${date}.pdf`,
          `http://localhost:5000/uploads/dpps/${grade}th/${processedSubject}/${date.split('-')[0]}.pdf`, // year only
          `http://localhost:5000/uploads/dpps/${grade}th/${processedSubject}/${date.replace(/-/g, '')}.pdf`, // no dashes
          `http://localhost:5000/uploads/dpps/${grade}th/${processedSubject}/2023.pdf`, // existing file
          `http://localhost:5000/uploads/dpps/${grade}th/${processedSubject}/2024.pdf`, // other years
          `http://localhost:5000/uploads/dpps/${grade}th/${processedSubject}/2025.pdf`
        ];
        
        for (const pdfUrl of possiblePdfUrls) {
          try {
            const pdfResponse = await fetch(pdfUrl, { method: 'HEAD' });
            if (pdfResponse.ok) {
              setDpp({ title: `DPP for ${date}`, content: 'PDF DPP', pdfUrl });
              setDppType('pdf');
              return;
            }
          } catch (pdfError) {
            // Continue to next URL
          }
        }
        
        // If neither exists, show error
        setError('No DPP found for this date. Please check if the DPP has been uploaded.');
        
      } catch (err) {
        console.error('DPP Fetch Error:', err);
        setError(
          err.response?.data?.error || `Error: ${err.message}`
        );
        setDpp(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDpp();
  }, [grade, subject, date]);

  return (
    <div className="compact-dpp-viewer">
      <header className="viewer-header">
        <div className="header-content">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <i className="fas fa-arrow-left"></i>
            Back to DPPs
          </button>
          <div className="header-info">
            <h1 className="viewer-title">
              DPP for Grade {grade} {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </h1>
            <p className="viewer-subtitle">Date: {date}</p>
          </div>
        </div>
      </header>

      <main className="viewer-content">
        <div className="content-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading DPP content...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>DPP Not Found</h3>
              <p>{error}</p>
              <button 
                onClick={() => navigate(-1)}
                className="error-button"
              >
                <i className="fas fa-arrow-left"></i>
                Go Back
              </button>
            </div>
          ) : dpp ? (
            <div className="dpp-content">
              {dppType === 'text' ? (
                <div className="text-content">
                  <div className="content-header">
                    <h2>{dpp.title}</h2>
                    <div className="content-meta">
                      <span className="meta-item">
                        <i className="fas fa-calendar-alt"></i>
                        {date}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-book"></i>
                        {subject}
                      </span>
                    </div>
                  </div>
                  <div className="content-body">
                    <pre>{dpp.content}</pre>
                  </div>
                </div>
              ) : dppType === 'pdf' ? (
                <div className="pdf-content">
                  <div className="content-header">
                    <h2>PDF DPP</h2>
                    <div className="content-meta">
                      <span className="meta-item">
                        <i className="fas fa-file-pdf"></i>
                        PDF Document
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-calendar-alt"></i>
                        {date}
                      </span>
                    </div>
                  </div>
                  <div className="pdf-viewer-container">
                    <PDFViewer 
                      fileUrl={dpp.pdfUrl} 
                      title={`DPP for ${date}`}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
