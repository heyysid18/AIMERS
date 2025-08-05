const express = require('express');
const router = express.Router();

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Test video topics endpoint
router.get('/videos/:grade/:subject', (req, res) => {
  const { grade, subject } = req.params;
  
  // Mock video topics data
  const videoTopics = [
    {
      _id: 'video1',
      topic: `Introduction to ${subject}`,
      url: 'https://www.youtube.com/watch?v=test1',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'video2',
      topic: `Basic ${subject} Concepts`,
      url: 'https://www.youtube.com/watch?v=test2',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'video3',
      topic: `Advanced ${subject} Topics`,
      url: 'https://www.youtube.com/watch?v=test3',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({ videoTopics });
});

module.exports = router; 