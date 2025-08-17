import React from "react";
import PDFViewer from "../components/PDFViewer";

export default function IframeTest() {
  const testPdfUrl = "http://localhost:5000/uploads/papers/10th/mathematics/2023.pdf";
  
  // Test different PDF URLs
  const testUrls = [
    "http://localhost:5000/uploads/papers/10th/mathematics/2023.pdf",
    "http://localhost:5000/test-pdf",
    "http://localhost:5000/api/pdf/papers/10th/mathematics/2023.pdf"
  ];
  
  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", height: "80vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#004aad" }}>
        PDF Viewer Test
      </h2>
      <div style={{ height: "100%", border: "2px solid #1a274d", borderRadius: "12px", overflow: "hidden" }}>
        <PDFViewer 
          fileUrl={testPdfUrl} 
          title="Test PDF - Mathematics 10th Class 2023"
        />
      </div>
    </div>
  );
}
