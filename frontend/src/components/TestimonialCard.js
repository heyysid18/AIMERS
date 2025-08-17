// src/components/TestimonialCard.js
import React from "react";

export default function TestimonialCard({ name, role, quote, color = "#22a6f1" }) {
  return (
    <div className="testimonial-fancy-card">
      <div className="testimonial-quote-mark" style={{ background: color }}>
        <i className="fas fa-quote-left"></i>
      </div>
      <div className="testimonial-quote">{quote}</div>
      <div className="testimonial-user">
        <span className="testimonial-name">{name}</span>
        <span className="testimonial-role">{role}</span>
      </div>
    </div>
  );
}
