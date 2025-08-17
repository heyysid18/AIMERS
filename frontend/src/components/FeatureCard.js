// src/components/FeatureCard.js
import React from "react";

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <span className="feature-icon"><i className={icon}></i></span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}
