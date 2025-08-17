const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const app = express();

// ============================
// 1. Middleware
// ============================

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  next();
});

// CORS Configuration
// Set NODE_ENV=production in Render environment variables to enable production CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aimers-frontend.onrender.com', 'https://heyysid18.github.io'] 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Length', 'Content-Range', 'Accept-Ranges']
}));
app.use(express.json());
app.use(passport.initialize());

// Google OAuth Strategy - Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: '', // No password for Google users
        role: 'student',
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
} else {
  console.log('⚠️  Google OAuth credentials not found. Google login will be disabled.');
}

// ============================
// Serve static files with correct MIME for .mjs files (PDF.js worker fix)
// ============================
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
      res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://aimers-frontend.onrender.com' 
      : 'http://localhost:3000');
      res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
}));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mjs')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// ============================
// 2. Multer Memory Storage Setup (for MongoDB)
// ============================

const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ 
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit (safe for MongoDB document storage)
  }
});

// Import Paper model
const Paper = require('./models/Paper');

// ✅ Dynamic Upload Route - Now stores in MongoDB
app.post('/api/upload/:fileType/:className/:subject', upload.single('pdf'), async (req, res) => {
  try {
    const { fileType, className, subject } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: '❌ No file uploaded.' });
    }

    // Check file size (should be under 15MB for MongoDB)
    if (req.file.size > 15 * 1024 * 1024) {
      return res.status(400).json({ error: '❌ File too large. Maximum size is 15MB.' });
    }

    // Convert file buffer to base64
    const base64Content = req.file.buffer.toString('base64');

    // Create paper document
    const paper = new Paper({
      name: req.file.originalname.replace(/\s/g, '_'),
      originalName: req.file.originalname,
      content: base64Content,
      contentType: req.file.mimetype,
      size: req.file.size,
      fileType,
      className,
      subject,
      year: req.body.year || new Date().getFullYear().toString(),
      type: req.body.type || 'other',
      uploadedBy: req.user?.id // If user is authenticated
    });

    await paper.save();

    console.log(`✅ File uploaded to MongoDB: ${req.file.originalname}`);

    return res.status(200).json({
      success: true,
      message: '✅ File uploaded successfully to database.',
      paperId: paper._id,
      filename: paper.name
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ 
      error: '❌ Failed to upload file to database.',
      details: error.message 
    });
  }
});

// ✅ PDF serving route from MongoDB
app.get('/api/pdf/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;
    
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Convert base64 back to buffer
    const fileBuffer = Buffer.from(paper.content, 'base64');

    // Set headers
    res.set('Content-Type', paper.contentType);
    res.set('Content-Length', paper.size);
    res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://aimers-frontend.onrender.com' 
      : 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Range');

    // Send file
    res.send(fileBuffer);

  } catch (error) {
    console.error('❌ PDF serving error:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
});

// ✅ Video Topic Upload Route
app.post('/api/upload/video', async (req, res) => {
  const { className, subject, topic, url } = req.body;

  if (!className || !subject || !topic || !url) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    let course = await Course.findOne({ grade: parseInt(className.replace('th', '')), subject });

    if (!course) {
      course = new Course({
        title: `${subject} - Grade ${className}`,
        grade: parseInt(className.replace('th', '')),
        subject,
        description: `${subject} course for Grade ${className}`,
        videoTopics: []
      });
    }

    if (!course.videoTopics) course.videoTopics = [];
    course.videoTopics.push({ topic, url });
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Video topic uploaded successfully.',
      data: { className, subject, topic, url }
    });
  } catch (err) {
    console.error('Error saving video topic:', err);
    res.status(500).json({ error: 'Failed to save video topic.' });
  }
});

// ✅ Get Video Topics Route
app.get('/api/videos/:grade/:subject', async (req, res) => {
  const { grade, subject } = req.params;

  try {
    const course = await Course.findOne({
      grade: parseInt(grade),
      subject: subject.toLowerCase()
    });

    if (!course || !course.videoTopics) {
      return res.status(200).json({ videoTopics: [] });
    }

    res.status(200).json({ videoTopics: course.videoTopics });
  } catch (err) {
    console.error('Error fetching video topics:', err);
    res.status(500).json({ error: 'Failed to fetch video topics.' });
  }
});

// ✅ Text DPP Upload Route
app.post('/api/upload/dpp', async (req, res) => {
  const { className, subject, title, content, date } = req.body;

  if (!className || !subject || !title || !content || !date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const grade = parseInt(className.replace('th', ''));
    const dppDate = new Date(date);
    if (isNaN(dppDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const newDpp = new DPP({
      title,
      content,
      date: dppDate,
      grade,
      subject: subject.toLowerCase()
    });

    await newDpp.save();

    res.status(200).json({
      success: true,
      message: 'Text DPP uploaded successfully.',
      data: { className, subject, title, content, date: dppDate }
    });
  } catch (err) {
    console.error('Error saving text DPP:', err);
    res.status(500).json({ error: 'Failed to save text DPP.' });
  }
});



// Add logging middleware for uploads
app.use('/uploads', (req, res, next) => {
  console.log('📁 Upload request:', req.method, req.url);
  next();
});

// ============================
// 3. Routes
// ============================

const Course = require('./models/Course');
const DPP = require('./models/DPP');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const dppRoutes = require('./routes/dppRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const testRoutes = require('./routes/testRoutes');
const paperRoutes = require('./routes/paperRoutes');

app.use('/api/user', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dpps', dppRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api', testRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ AIMERS API is running...');
});

// Test registration endpoint
app.post('/api/test-register', (req, res) => {
  console.log('Test registration endpoint hit');
  console.log('Request body:', req.body);
  res.json({ 
    success: true, 
    message: 'Test endpoint working',
    receivedData: req.body 
  });
});

// ✅ Video Topic Upload Route

// ============================
// 4. Database Connection
// ============================

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI not found in environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  process.exit(1);
}

console.log('🔌 Attempting to connect to MongoDB...');
console.log('MongoDB URI:', mongoUri ? `${mongoUri.substring(0, 20)}...` : 'NOT FOUND');

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Error details:', err);
    process.exit(1);
  });

// ============================
// 5. Launch Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
