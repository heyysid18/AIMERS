// backend/routes/dppRoutes.js

const express = require('express');
const router = express.Router();
const {
  createDPP,
  getAllDPPs,
  getDPPsBySubject
} = require('../controllers/dppController');
const protect = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllDPPs);
router.get('/subject/:subject', getDPPsBySubject);

// Protected route (for teachers/admin)
router.post('/', protect, createDPP);

module.exports = router;
