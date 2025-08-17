import React from 'react';
import VideoPlayer from './VideoPlayer';

const VideoModal = ({ isOpen, onClose, videoUrl, videoTitle }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          ✕
        </button>
        <VideoPlayer videoUrl={videoUrl} title={videoTitle} />
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalStyle = {
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: '12px',
  width: '85vw',
  maxWidth: '1000px',
  maxHeight: '80vh',
  overflow: 'auto',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  zIndex: 1001
};

export default VideoModal; 