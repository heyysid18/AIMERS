import React, { useState } from 'react';

const VideoPlayer = ({ videoUrl, title }) => {
  const [linkHover, setLinkHover] = useState(false);

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
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={linkHover ? linkHoverStyle : linkStyle}
          onMouseEnter={() => setLinkHover(true)}
          onMouseLeave={() => setLinkHover(false)}
        >
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

// Styles - Updated to match website theme
const containerStyle = {
  maxWidth: '100%',
  width: '100%',
  margin: '0',
  padding: '10px',
  backgroundColor: 'transparent',
  borderRadius: '0',
  boxShadow: 'none',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
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
  height: '0',
  paddingBottom: '50%', // Reduced from 56.25% to make video shorter
  marginBottom: '0',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)'
};

const iframeStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  border: 'none',
  objectFit: 'cover'
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
  padding: '12px 20px',
  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  fontSize: '0.9em',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4)',
  cursor: 'pointer'
};

const linkHoverStyle = {
  ...linkStyle,
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.6)'
};

const errorStyle = {
  textAlign: 'center',
  padding: '30px',
  color: '#ef4444',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '16px',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  backdropFilter: 'blur(10px)'
};

export default VideoPlayer; 