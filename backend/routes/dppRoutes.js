// backend/routes/dppRoutes.js

const express = require('express');
const router = express.Router();
const {
  createDPP,
  getAllDPPs,
  getDPPsBySubject,
  getDPPsByTopic
} = require('../controllers/dppController');
const protect = require('../middleware/authMiddleware');
const DPP = require('../models/DPP');

// Public routes
router.get('/', getAllDPPs);
router.get('/subject/:subject', getDPPsBySubject);

// ✅ Get DPPs directly by Grade and Subject (no topic filtering)
router.get('/by-grade/:grade/:subject', async (req, res) => {
  const { grade, subject } = req.params;

  try {
    console.log('🔍 Getting DPPs directly for subject:', { grade, subject });
    
    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid grade parameter. Must be a number.'
      });
    }
    
    // Get all DPPs for this subject, sorted by date
    const dpps = await DPP.find({
      grade: gradeNum,
      subject: subject.toLowerCase(),
      isActive: true
    }).sort({ date: -1 });
    
    console.log('📝 Found DPPs:', dpps.length);
    
    // Format for display
    const formattedDpps = dpps.map(dpp => ({
      id: dpp._id,
      title: dpp.title,
      displayName: dpp.displayName || `DPP ${dpp.dppNumber || 1}`,
      description: dpp.description,
      questionCount: dpp.questionCount,
      timeLimit: dpp.timeLimit,
      difficulty: dpp.difficulty,
      date: dpp.date,
      content: dpp.content
    }));
    
    res.json({
      success: true,
      subject: subject,
      dpps: formattedDpps,
      count: formattedDpps.length
    });
  } catch (err) {
    console.error('❌ Error getting subject DPPs:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ✅ Get all topics for a subject
router.get('/topics/:grade/:subject', async (req, res) => {
  const { grade, subject } = req.params;
  
  try {
    console.log('🔍 Getting topics for:', { grade, subject });
    
    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid grade parameter. Must be a number.'
      });
    }
    
    // Get unique topics for this grade and subject
    const topics = await DPP.distinct('topic', {
      grade: gradeNum,
      subject: subject.toLowerCase(),
      isActive: true
    });
    
    console.log('📚 Found topics:', topics);
    
    res.json({
      success: true,
      topics: topics.sort(),
      count: topics.length
    });
  } catch (err) {
    console.error('❌ Error getting topics:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ✅ Get all DPPs for a specific topic
router.get('/topic/:grade/:subject/:topic', getDPPsByTopic);

// Debug route to check DPP data
router.get('/debug/:grade/:subject', async (req, res) => {
  const { grade, subject } = req.params;
  
  try {
    console.log('🔍 Debug DPP route hit:', { grade, subject });
    
    // Convert grade to number and validate
    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid grade parameter. Must be a number.',
        received: { grade, subject },
        parsed: { gradeNum }
      });
    }
    
    console.log('📊 Parsed grade:', gradeNum);
    
    const dpps = await DPP.find({
      grade: gradeNum,
      subject: subject.toLowerCase()
    });
    
    console.log('📊 Found DPPs:', dpps.length);
    console.log('📋 DPP data:', dpps);
    
    res.json({
      success: true,
      debug: {
        grade: gradeNum,
        subject: subject.toLowerCase(),
        query: { grade: gradeNum, subject: subject.toLowerCase() },
        found: dpps.length,
        dpps: dpps
      }
    });
  } catch (err) {
    console.error('❌ Debug DPP error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      debug: { grade, subject }
    });
  }
});

// ✅ Enhanced DPP listing with filters and card layout
router.get('/cards/:grade/:subject', async (req, res) => {
  const { grade, subject } = req.params;
  const { year, difficulty, topic, search } = req.query;

  try {
    let query = {
      grade: parseInt(grade),
      subject: subject.toLowerCase(),
      isActive: true
    };

    // Add year filter
    if (year) {
      const startYear = new Date(year, 0, 1);
      const endYear = new Date(year, 11, 31, 23, 59, 59, 999);
      query.date = { $gte: startYear, $lte: endYear };
    }

    // Add difficulty filter
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      query.difficulty = difficulty;
    }

    // Add topic filter
    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } }
      ];
    }

    const dpps = await DPP.find(query)
      .sort({ order: 1, date: 1 })
      .select('title topic description questionCount timeLimit difficulty date order');

    // Format for card layout
    const formattedDpps = dpps.map(dpp => ({
      id: dpp._id,
      title: dpp.title,
      topic: dpp.topic,
      description: dpp.description,
      questionCount: dpp.questionCount,
      timeLimit: dpp.timeLimit,
      difficulty: dpp.difficulty,
      date: dpp.date,
      order: dpp.order,
      formattedDate: dpp.date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      difficultyColor: getDifficultyColor(dpp.difficulty)
    }));

    res.status(200).json({ 
      success: true,
      dpps: formattedDpps,
      total: formattedDpps.length,
      filters: { grade, subject, year, difficulty, topic, search }
    });
  } catch (err) {
    console.error('Error fetching DPP cards:', err);
    res.status(500).json({ error: 'Failed to fetch DPP cards.' });
  }
});

// Helper function for difficulty colors
function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'Easy': return '#10b981'; // Green
    case 'Medium': return '#f59e0b'; // Yellow
    case 'Hard': return '#ef4444'; // Red
    default: return '#6b7280'; // Gray
  }
}

// ✅ Check DPP availability by date - MOVED BEFORE THE DATE ROUTE
router.get('/check/:grade/:subject/:date', async (req, res) => {
  const { grade, subject, date } = req.params;

  const gradeNum = parseInt(grade);
  if (isNaN(gradeNum)) {
    return res.status(400).json({ error: 'Invalid grade parameter. Must be a number.' });
  }

  try {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const dpp = await DPP.findOne({
      grade: gradeNum,
      subject: subject.toLowerCase(),
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    res.status(200).json({ 
      available: !!dpp,
      dpp: dpp || null
    });
  } catch (err) {
    console.error('Error checking DPP availability:', err);
    res.status(500).json({ error: 'Failed to check DPP availability.' });
  }
});

// ✅ Get Text DPPs by Grade and Subject
router.get('/:grade/:subject', async (req, res) => {
  const { grade, subject } = req.params;

  try {
    const dpps = await DPP.find({
      grade: parseInt(grade),
      subject: subject.toLowerCase()
    }).sort({ date: 1 });

    res.status(200).json({ textDpps: dpps });
  } catch (err) {
    console.error('Error fetching text DPPs:', err);
    res.status(500).json({ error: 'Failed to fetch text DPPs.' });
  }
});

// ✅ Get DPP by Date Route
router.get('/:grade/:subject/:date', async (req, res) => {
  const { grade, subject, date } = req.params;

  const gradeNum = parseInt(grade);
  if (isNaN(gradeNum)) {
    return res.status(400).json({ error: 'Invalid grade parameter. Must be a number.' });
  }

  try {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const dpps = await DPP.find({
      grade: gradeNum,
      subject: subject.toLowerCase(),
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!dpps || dpps.length === 0) {
      return res.status(404).json({ error: 'No DPP found for this date.' });
    }

    res.status(200).json({ dpp: dpps[0] });
  } catch (err) {
    console.error('Error fetching DPP by date:', err);
    res.status(500).json({ error: 'Failed to fetch DPP.' });
  }
});

// Protected route (for teachers/admin)
router.post('/', protect, createDPP);

// Temporary route to create sample DPPs for testing
router.post('/create-sample', async (req, res) => {
  try {
    console.log('🎯 Creating sample DPPs...');
    
    const sampleDPPs = [
      // Algebra Topic
      {
        title: "Linear Equations and Inequalities",
        content: "Practice problems on solving linear equations and inequalities with step-by-step solutions.",
        date: new Date('2024-01-15'),
        grade: 10,
        subject: "mathematics",
        topic: "Algebra",
        dppNumber: 1,
        topicOrder: 1,
        questionCount: 15,
        timeLimit: 45,
        difficulty: "Easy",
        description: "Basic concepts of algebra including linear equations"
      },
      {
        title: "Quadratic Equations",
        content: "Problems on quadratic equations, factoring, and completing the square.",
        date: new Date('2024-01-20'),
        grade: 10,
        subject: "mathematics",
        topic: "Algebra",
        dppNumber: 2,
        topicOrder: 2,
        questionCount: 20,
        timeLimit: 60,
        difficulty: "Medium",
        description: "Understanding quadratic equations and solving methods"
      },
      {
        title: "Polynomial Functions",
        content: "Advanced problems on polynomial functions and their properties.",
        date: new Date('2024-01-25'),
        grade: 10,
        subject: "mathematics",
        topic: "Algebra",
        dppNumber: 3,
        topicOrder: 3,
        questionCount: 18,
        timeLimit: 50,
        difficulty: "Hard",
        description: "Advanced algebra concepts and problem solving"
      },
      
      // Geometry Topic
      {
        title: "Triangle Properties",
        content: "Problems on triangle properties, theorems, and solving triangle problems.",
        date: new Date('2024-02-01'),
        grade: 10,
        subject: "mathematics",
        topic: "Geometry",
        dppNumber: 1,
        topicOrder: 1,
        questionCount: 16,
        timeLimit: 55,
        difficulty: "Medium",
        description: "Understanding triangle properties and solving problems"
      },
      {
        title: "Circle Theorems",
        content: "Practice on circle properties, theorems, and geometric proofs.",
        date: new Date('2024-02-05'),
        grade: 10,
        subject: "mathematics",
        topic: "Geometry",
        dppNumber: 2,
        topicOrder: 2,
        questionCount: 22,
        timeLimit: 65,
        difficulty: "Medium",
        description: "Circle geometry and theorem applications"
      },
      
      // Trigonometry Topic
      {
        title: "Basic Trigonometric Functions",
        content: "Introduction to sine, cosine, and tangent functions with applications.",
        date: new Date('2024-02-10'),
        grade: 10,
        subject: "mathematics",
        topic: "Trigonometry",
        dppNumber: 1,
        topicOrder: 1,
        questionCount: 18,
        timeLimit: 50,
        difficulty: "Medium",
        description: "Basic trigonometry concepts and problem solving"
      },
      {
        title: "Trigonometric Identities",
        content: "Advanced problems on trigonometric identities and equations.",
        date: new Date('2024-02-15'),
        grade: 10,
        subject: "mathematics",
        topic: "Trigonometry",
        dppNumber: 2,
        topicOrder: 2,
        questionCount: 20,
        timeLimit: 60,
        difficulty: "Hard",
        description: "Advanced trigonometry concepts and problem solving"
      }
    ];
    
    // Clear existing DPPs for this grade/subject
    await DPP.deleteMany({ grade: 10, subject: "mathematics" });
    
    // Create new sample DPPs
    const createdDPPs = await DPP.insertMany(sampleDPPs);
    
    console.log('✅ Sample DPPs created:', createdDPPs.length);
    
    res.json({
      success: true,
      message: `Created ${createdDPPs.length} sample DPPs`,
      dpps: createdDPPs
    });
  } catch (err) {
    console.error('❌ Error creating sample DPPs:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// GET route for easier testing (same functionality)
router.get('/create-sample', async (req, res) => {
  try {
    console.log('🎯 Creating sample DPPs via GET...');
    
    const sampleDPPs = [
      // Algebra Topic
      {
        title: "Linear Equations and Inequalities",
        content: "Practice problems on solving linear equations and inequalities with step-by-step solutions.",
        date: new Date('2024-01-15'),
        grade: 10,
        subject: "mathematics",
        topic: "Algebra",
        dppNumber: 1,
        topicOrder: 1,
        questionCount: 15,
        timeLimit: 45,
        difficulty: "Easy",
        description: "Basic concepts of algebra including linear equations"
      },
      {
        title: "Quadratic Equations",
        content: "Problems on quadratic equations, factoring, and completing the square.",
        date: new Date('2024-01-20'),
        grade: 10,
        subject: "mathematics",
        topic: "Algebra",
        dppNumber: 2,
        topicOrder: 2,
        questionCount: 20,
        timeLimit: 60,
        difficulty: "Medium",
        description: "Understanding quadratic equations and solving methods"
      },
      {
        title: "Polynomial Functions",
        content: "Advanced problems on polynomial functions and their properties.",
        date: new Date('2024-01-25'),
        grade: 10,
        subject: "mathematics",
        topic: "Algebra",
        dppNumber: 3,
        topicOrder: 3,
        questionCount: 18,
        timeLimit: 50,
        difficulty: "Hard",
        description: "Advanced algebra concepts and problem solving"
      },
      
      // Geometry Topic
      {
        title: "Triangle Properties",
        content: "Problems on triangle properties, theorems, and solving triangle problems.",
        date: new Date('2024-02-01'),
        grade: 10,
        subject: "mathematics",
        topic: "Geometry",
        dppNumber: 1,
        topicOrder: 1,
        questionCount: 16,
        timeLimit: 55,
        difficulty: "Medium",
        description: "Understanding triangle properties and solving problems"
      },
      {
        title: "Circle Theorems",
        content: "Practice on circle properties, theorems, and geometric proofs.",
        date: new Date('2024-02-05'),
        grade: 10,
        subject: "mathematics",
        topic: "Geometry",
        dppNumber: 2,
        topicOrder: 2,
        questionCount: 22,
        timeLimit: 65,
        difficulty: "Medium",
        description: "Circle geometry and theorem applications"
      },
      
      // Trigonometry Topic
      {
        title: "Basic Trigonometric Functions",
        content: "Introduction to sine, cosine, and tangent functions with applications.",
        date: new Date('2024-02-10'),
        grade: 10,
        subject: "mathematics",
        topic: "Trigonometry",
        dppNumber: 1,
        topicOrder: 1,
        questionCount: 18,
        timeLimit: 50,
        difficulty: "Medium",
        description: "Basic trigonometry concepts and problem solving"
      },
      {
        title: "Trigonometric Identities",
        content: "Advanced problems on trigonometric identities and equations.",
        date: new Date('2024-02-15'),
        grade: 10,
        subject: "mathematics",
        topic: "Trigonometry",
        dppNumber: 2,
        topicOrder: 2,
        questionCount: 20,
        timeLimit: 60,
        difficulty: "Hard",
        description: "Advanced trigonometry concepts and problem solving"
      }
    ];
    
    // Clear existing DPPs for this grade/subject
    await DPP.deleteMany({ grade: 10, subject: "mathematics" });
    
    // Create new sample DPPs
    const createdDPPs = await DPP.insertMany(sampleDPPs);
    
    console.log('✅ Sample DPPs created:', createdDPPs.length);
    
    res.json({
      success: true,
      message: `Created ${createdDPPs.length} sample DPPs`,
      dpps: createdDPPs
    });
  } catch (err) {
    console.error('❌ Error creating sample DPPs:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;
