import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";

// Set workerSrc to enable PDF rendering!
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ fileUrl, title }) {
  const [pdfError, setPdfError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setPdfError(null);
    setNumPages(null);
    setPageNumber(1);
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    setPdfError(error);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        fontWeight: '600',
        color: '#333',
        fontSize: '1.1em'
      }}>
        {title || 'PDF Viewer'}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
        {pdfError ? (
          <div style={{ color: '#d32f2f', textAlign: 'center', fontSize: '1.1em' }}>
            ❌ Error loading PDF: {pdfError.message || 'Unknown error'}
          </div>
        ) : (
          <>
            {numPages && numPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: '16px',
                gap: '16px'
              }}>
                <button
                  onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                  disabled={pageNumber <= 1}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#22a6f1',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    opacity: pageNumber <= 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#22a6f1',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    opacity: pageNumber >= numPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div style={{ color: '#777', fontSize: '1.1em' }}>
                  🔄 Loading PDF...
                </div>
              }
              noData={<div>No PDF specified</div>}
              error={<div>Failed to load PDF.</div>}
              options={{ disableTextLayer: false, disableAnnotationLayer: true }}
            >
              <Page
                pageNumber={pageNumber}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={true}
              />
            </Document>
          </>
        )}
      </div>
    </div>
  );
} 