// src/components/Button.js
import React from "react";

export default function Button({ label, onClick, type = "button" }) {
  return (
    <button className="cta-btn" type={type} onClick={onClick}>
      {label}
    </button>
  );
}
