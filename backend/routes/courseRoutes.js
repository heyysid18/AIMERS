// backend/routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCoursesByGrade
} = require('../controllers/courseController');
const protect = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/grade/:grade', getCoursesByGrade);

// Protected route for teachers/admins (can extend role-based if needed)
router.post('/', protect, createCourse);

module.exports = router;
