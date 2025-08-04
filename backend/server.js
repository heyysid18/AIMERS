const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();


// ============================
// 1. Middleware
// ============================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
// Example: POST /api/upload/dpps/12th/mathematics
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
    // Convert className to grade number (e.g., "10th" -> 10)
    const grade = parseInt(className.replace('th', ''));
    
    // Find or create course
    let course = await Course.findOne({ grade, subject });
    
    if (!course) {
      // Create new course if it doesn't exist
      course = new Course({
        title: `${subject} - Grade ${className}`,
        grade,
        subject,
        description: `${subject} course for Grade ${className}`,
        videoTopics: []
      });
    }
    
    // Add video topic to the course
    if (!course.videoTopics) {
      course.videoTopics = [];
    }
    
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

// ✅ Get Text DPPs Route
app.get('/api/dpps/:grade/:subject', async (req, res) => {
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
app.get('/api/dpps/:grade/:subject/:date', async (req, res) => {
  const { grade, subject, date } = req.params;

  const gradeNum = parseInt(grade);
  if (isNaN(gradeNum)) {
    return res.status(400).json({ error: 'Invalid grade parameter. Must be a number.' });
  }

  try {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    console.log('DPP fetch query:', {
      grade: gradeNum,
      subject: subject.toLowerCase(),
      date,
      startOfDay,
      endOfDay
    });

    const dpps = await DPP.find({
      grade: gradeNum,
      subject: subject.toLowerCase(),
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    console.log('DPPs found:', dpps);

    if (!dpps || dpps.length === 0) {
      return res.status(404).json({ error: 'No DPP found for this date.' });
    }

    res.status(200).json({ dpp: dpps[0] });
  } catch (err) {
    console.error('Error fetching DPP by date:', err);
    res.status(500).json({ error: 'Failed to fetch DPP.' });
  }
});

// Add logging middleware for uploads
app.use('/uploads', (req, res, next) => {
  console.log('📁 Upload request:', req.method, req.url);
  next();
});

// ✅ Serve all uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ============================
// 3. Routes
// ============================

const Course = require('./models/course');
const DPP = require('./models/DPP');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const dppRoutes = require('./routes/dppRoutes');

app.use('/api/user', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dpps', dppRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ AIMERS API is running...');
});

// ============================
// 4. Database Connection
// ============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected.'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ============================
// 5. Launch Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
