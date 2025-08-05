const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');
const DPP = require('../models/DPP');
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');

// Get dashboard data for authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's grade and subjects
    const userGrade = user.grade;
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

    // Calculate DPP progress for each subject
    const dppProgress = await Promise.all(
      subjects.map(async (subject) => {
        const totalDPPs = await DPP.countDocuments({
          grade: userGrade,
          subject: subject
        });

        // For now, we'll simulate completed DPPs
        // In a real implementation, you'd track this in a separate collection
        const completedDPPs = Math.floor(Math.random() * totalDPPs) + 10;
        const percentage = totalDPPs > 0 ? Math.round((completedDPPs / totalDPPs) * 100) : 0;

        return {
          subject,
          completed: completedDPPs,
          total: totalDPPs,
          percentage
        };
      })
    );

    // Calculate video progress for each subject
    const videoProgress = await Promise.all(
      subjects.map(async (subject) => {
        const course = await Course.findOne({
          grade: userGrade,
          subject: subject.toLowerCase()
        });

        const totalVideos = course ? course.videoTopics.length : 20;
        const watchedVideos = Math.floor(Math.random() * totalVideos) + 5;
        const percentage = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;

        return {
          subject,
          watched: watchedVideos,
          total: totalVideos,
          percentage
        };
      })
    );

    // Calculate study streak (simulated)
    const studyStreak = Math.floor(Math.random() * 15) + 3;
    const totalStudyTime = Math.floor(Math.random() * 200) + 100;

    // Generate recent activity
    const recentActivity = [
      {
        type: 'dpp',
        subject: 'Mathematics',
        action: 'Completed DPP',
        time: '2 hours ago'
      },
      {
        type: 'video',
        subject: 'Physics',
        action: 'Watched lecture',
        time: '4 hours ago'
      },
      {
        type: 'dpp',
        subject: 'Chemistry',
        action: 'Started DPP',
        time: '1 day ago'
      },
      {
        type: 'video',
        subject: 'Biology',
        action: 'Completed video',
        time: '2 days ago'
      }
    ];

    const dashboardData = {
      dppProgress,
      videoProgress,
      studyStreak,
      totalStudyTime,
      subjects,
      recentActivity
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get completion status for videos
router.get('/completion-status/:grade/:subject', protect, async (req, res) => {
  try {
    const { grade, subject } = req.params;
    const userId = req.user.id;

    // In a real implementation, you'd fetch from a UserProgress collection
    // For now, we'll return simulated data
    const completionStatus = {};
    
    // Simulate some completed videos
    const videoIds = ['video1', 'video2', 'video3', 'video4', 'video5'];
    videoIds.forEach((id, index) => {
      if (index < 2) { // First 2 videos completed
        completionStatus[id] = true;
      }
    });

    res.json({ completionStatus });
  } catch (error) {
    console.error('Error fetching completion status:', error);
    res.status(500).json({ error: 'Failed to fetch completion status' });
  }
});

// Get DPP progress for a specific class and subject
router.get('/dpp-progress/:grade/:subject', protect, async (req, res) => {
  try {
    const { grade, subject } = req.params;
    const userId = req.user.id;

    // Fetch real user progress from database
    const userProgress = await UserProgress.find({
      userId,
      type: 'dpp',
      subject: subject.toLowerCase(),
      grade: parseInt(grade)
    });

    const progress = {};
    userProgress.forEach(item => {
      if (item.completed) {
        progress[item.date] = true;
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Error fetching DPP progress:', error);
    res.status(500).json({ error: 'Failed to fetch DPP progress' });
  }
});

// Get paper progress for a specific class and subject
router.get('/paper-progress/:grade/:subject', protect, async (req, res) => {
  try {
    const { grade, subject } = req.params;
    const userId = req.user.id;

    // Fetch real user progress from database
    const userProgress = await UserProgress.find({
      userId,
      type: 'paper',
      subject: subject.toLowerCase(),
      grade: parseInt(grade)
    });

    const progress = {};
    userProgress.forEach(item => {
      if (item.completed) {
        progress[item.date] = true;
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Error fetching paper progress:', error);
    res.status(500).json({ error: 'Failed to fetch paper progress' });
  }
});

// Track DPP completion
router.post('/track-dpp', protect, async (req, res) => {
  try {
    const { dppId, subject, completed, grade, date } = req.body;
    const userId = req.user.id;

    // Find existing progress or create new one
    const existingProgress = await UserProgress.findOne({
      userId,
      type: 'dpp',
      itemId: dppId,
      subject: subject.toLowerCase(),
      grade: parseInt(grade),
      date
    });

    if (existingProgress) {
      // Update existing progress
      existingProgress.completed = completed;
      existingProgress.completedAt = completed ? new Date() : null;
      await existingProgress.save();
    } else {
      // Create new progress entry
      await UserProgress.create({
        userId,
        type: 'dpp',
        itemId: dppId,
        subject: subject.toLowerCase(),
        grade: parseInt(grade),
        date,
        completed,
        completedAt: completed ? new Date() : null
      });
    }

    res.json({ 
      success: true, 
      message: 'DPP progress tracked successfully' 
    });
  } catch (error) {
    console.error('DPP tracking error:', error);
    res.status(500).json({ error: 'Failed to track DPP progress' });
  }
});

// Track video progress
router.post('/track-video', protect, async (req, res) => {
  try {
    const { videoId, subject, watched, grade } = req.body;
    const userId = req.user.id;

    // In a real implementation, you'd save this to a UserProgress collection
    // For now, we'll just return success
    res.json({ 
      success: true, 
      message: 'Video progress tracked successfully' 
    });
  } catch (error) {
    console.error('Video tracking error:', error);
    res.status(500).json({ error: 'Failed to track video progress' });
  }
});

// Track paper completion
router.post('/track-paper', protect, async (req, res) => {
  try {
    const { paperId, subject, completed, grade, year } = req.body;
    const userId = req.user.id;

    // Find existing progress or create new one
    const existingProgress = await UserProgress.findOne({
      userId,
      type: 'paper',
      itemId: paperId,
      subject: subject.toLowerCase(),
      grade: parseInt(grade),
      date: year
    });

    if (existingProgress) {
      // Update existing progress
      existingProgress.completed = completed;
      existingProgress.completedAt = completed ? new Date() : null;
      await existingProgress.save();
    } else {
      // Create new progress entry
      await UserProgress.create({
        userId,
        type: 'paper',
        itemId: paperId,
        subject: subject.toLowerCase(),
        grade: parseInt(grade),
        date: year,
        completed,
        completedAt: completed ? new Date() : null
      });
    }

    res.json({ 
      success: true, 
      message: 'Paper progress tracked successfully' 
    });
  } catch (error) {
    console.error('Paper tracking error:', error);
    res.status(500).json({ error: 'Failed to track paper progress' });
  }
});

// Get study analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Simulated analytics data
    const analytics = {
      averageDailyStudyTime: 2.5,
      bestPerformingSubject: 'Physics',
      improvementRate: '+15%',
      peakStudyTime: '6:00 PM - 8:00 PM',
      weeklyStudyHours: [2, 3, 1, 4, 2, 3, 2],
      subjectPerformance: {
        Mathematics: 75,
        Physics: 83,
        Chemistry: 72,
        Biology: 70
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get progress report
router.get('/progress-report', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Generate a comprehensive progress report
    const progressReport = {
      studentName: user.name,
      grade: user.grade,
      reportDate: new Date().toISOString(),
      overallProgress: 78,
      subjectBreakdown: {
        Mathematics: { progress: 75, strength: 'Algebra', weakness: 'Geometry' },
        Physics: { progress: 83, strength: 'Mechanics', weakness: 'Thermodynamics' },
        Chemistry: { progress: 72, strength: 'Organic', weakness: 'Physical' },
        Biology: { progress: 70, strength: 'Botany', weakness: 'Zoology' }
      },
      recommendations: [
        'Focus more on Geometry concepts',
        'Practice Thermodynamics problems',
        'Review Physical Chemistry formulas',
        'Strengthen Zoology fundamentals'
      ],
      studyTips: [
        'Study for 2-3 hours daily',
        'Take regular breaks',
        'Practice previous year questions',
        'Join study groups'
      ]
    };

    res.json(progressReport);
  } catch (error) {
    console.error('Progress report error:', error);
    res.status(500).json({ error: 'Failed to generate progress report' });
  }
});

module.exports = router; 