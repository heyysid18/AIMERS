// backend/routes/dppRoutes.js

const express = require('express');
const router = express.Router();
const {
  createDPP,
  getAllDPPs,
  getDPPsBySubject
} = require('../controllers/dppController');
const protect = require('../middleware/authMiddleware');
const DPP = require('../models/DPP');

// Public routes
router.get('/', getAllDPPs);
router.get('/subject/:subject', getDPPsBySubject);

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

module.exports = router;
