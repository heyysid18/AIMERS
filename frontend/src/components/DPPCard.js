// src/components/DPPCard.js
import React from "react";

export default function DPPCard({ icon, title, description, link }) {
  return (
    <div className="dpp-card">
      <div className="dpp-icon"><i className={icon}></i></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} className="dpp-btn">Download</a>
    </div>
  );
}
