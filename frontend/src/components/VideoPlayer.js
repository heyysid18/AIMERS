import React, { useState } from 'react';

const VideoPlayer = ({ videoUrl, title }) => {

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div style={errorStyle}>
        <p>❌ Invalid YouTube URL</p>
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          Open in YouTube
        </a>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={videoContainerStyle}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={iframeStyle}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: '900px',
  width: '100%',
  margin: '20px auto',
  padding: '25px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(34, 166, 241, 0.15)',
  border: '1px solid #e6eef5'
};

const titleStyle = {
  color: '#004aad',
  fontWeight: '700',
  fontSize: '1.3em',
  marginBottom: '18px',
  textAlign: 'center'
};

const videoContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '350px',
  marginBottom: '18px'
};

const iframeStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  border: 'none'
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  flexWrap: 'wrap'
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#22a6f1',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9em'
};

const linkStyle = {
  padding: '8px 16px',
  backgroundColor: '#f8f9fa',
  color: '#004aad',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '0.9em',
  border: '1px solid #dee2e6'
};

const errorStyle = {
  textAlign: 'center',
  padding: '20px',
  color: '#dc3545',
  backgroundColor: '#f8d7da',
  borderRadius: '8px',
  border: '1px solid #f5c6cb'
};

export default VideoPlayer; 