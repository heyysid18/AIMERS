// src/components/PaperCard.js
import React from "react";

export default function PaperCard({ icon, title, description, downloadLink }) {
  return (
    <div className="paper-card">
      <div className="paper-icon"><i className={icon}></i></div>
      <h3 className="paper-title">{title}</h3>
      <p className="paper-desc">{description}</p>
      <a href={downloadLink} className="paper-btn">Download</a>
    </div>
  );
}
