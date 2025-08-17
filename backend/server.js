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
// 2. Multer Dynamic File Upload Setup
// ============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fileType, className, subject } = req.params;
    const dir = path.join(__dirname, `public/uploads/${fileType}/${className}/${subject}`);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s/g, '_');
    cb(null, safeName);
  }
});

const upload = multer({ storage });

// ✅ Dynamic Upload Route
app.post('/api/upload/:fileType/:className/:subject', upload.single('pdf'), (req, res) => {
  const { fileType, className, subject } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: '❌ No file uploaded.' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileType}/${className}/${subject}/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    message: '✅ File uploaded successfully.',
    fileUrl
  });
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

// Test PDF route
app.get('/test-pdf', (req, res) => {
  const testPdfPath = path.join(__dirname, 'public/uploads/papers/10th/mathematics/2023.pdf');
  if (fs.existsSync(testPdfPath)) {
    res.set('Content-Type', 'application/pdf');
    res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://aimers-frontend.onrender.com' 
      : 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.sendFile(testPdfPath);
  } else {
    res.status(404).json({ error: 'Test PDF not found' });
  }
});

// PDF serving route with proper headers
app.get('/api/pdf/:fileType/:className/:subject/:filename', (req, res) => {
  const { fileType, className, subject, filename } = req.params;
  const pdfPath = path.join(__dirname, `public/uploads/${fileType}/${className}/${subject}/${filename}`);
  
  if (fs.existsSync(pdfPath)) {
    res.set('Content-Type', 'application/pdf');
    res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://aimers-frontend.onrender.com' 
      : 'http://localhost:3000');
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.sendFile(pdfPath);
  } else {
    res.status(404).json({ error: 'PDF not found' });
  }
});

// ============================
// 4. Database Connection
// ============================

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI not found in environment variables');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected.'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ============================
// 5. Launch Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
