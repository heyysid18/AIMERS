// src/components/CourseCard.js
import React from "react";

export default function CourseCard({ iconClass, title, description, link }) {
  return (
    <div className="subject-card">
      <div className="subject-icon">
        <i className={iconClass}></i>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={link} className="subject-btn">Explore</a>
    </div>
  );
}
