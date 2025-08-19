import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const VideoModal = ({ onClose, videoUrl, videoTitle }) => {
  const [closeButtonHover, setCloseButtonHover] = useState(false);
  const [errorButtonHover, setErrorButtonHover] = useState(false);

  if (!videoUrl) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <button 
            style={closeButtonHover ? closeButtonHoverStyle : closeButtonStyle} 
            onClick={onClose}
            onMouseEnter={() => setCloseButtonHover(true)}
            onMouseLeave={() => setCloseButtonHover(false)}
          >
            ✕
          </button>
          <div style={errorContainerStyle}>
            <h3 style={errorTitleStyle}>Video Not Available</h3>
            <p style={errorMessageStyle}>The selected video is currently unavailable.</p>
            <button 
              style={errorButtonHover ? errorButtonHoverStyle : errorButtonStyle} 
              onClick={onClose}
              onMouseEnter={() => setErrorButtonHover(true)}
              onMouseLeave={() => setErrorButtonHover(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button 
          style={closeButtonHover ? closeButtonHoverStyle : closeButtonStyle} 
          onClick={onClose}
          onMouseEnter={() => setCloseButtonHover(true)}
          onMouseLeave={() => setCloseButtonHover(false)}
        >
          ✕
        </button>
        <VideoPlayer videoUrl={videoUrl} title={videoTitle} />
      </div>
    </div>
  );
};

// Styles - Updated to match website theme
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '10px'
};

const modalStyle = {
  position: 'relative',
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
  border: '1px solid rgba(71, 85, 105, 0.4)',
  borderRadius: '20px',
  width: '95vw',
  maxWidth: '1000px',
  maxHeight: '87vh',
  overflow: 'hidden',
  padding: '10px',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(79, 70, 229, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '20px',
  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  zIndex: 1001,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
};

const closeButtonHoverStyle = {
  ...closeButtonStyle,
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%)',
  transform: 'scale(1.1)',
  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
};

const errorContainerStyle = {
  padding: '50px 40px',
  textAlign: 'center',
  color: '#ffffff'
};

const errorTitleStyle = {
  color: '#ef4444',
  fontSize: '1.75rem',
  marginBottom: '1rem',
  fontWeight: '700',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
};

const errorMessageStyle = {
  color: '#e2e8f0',
  fontSize: '1.1rem',
  marginBottom: '2.5rem',
  lineHeight: '1.6',
  opacity: '0.9'
};

const errorButtonStyle = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
};

const errorButtonHoverStyle = {
  ...errorButtonStyle,
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
};

const videoTitleStyle = {
  textAlign: 'center',
  padding: '20px 20px 10px 20px',
  color: '#ffffff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
};

export default VideoModal; 