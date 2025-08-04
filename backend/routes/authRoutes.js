// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User'); // ✅ Import User model

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
//router.get('/profile', protect, authController.getProfile);

// ✅ Put: Update user profile info
router.put('/profile', protect, async (req, res) => {
  const { name, email } = req.body;
  const userId = req.userId; // provided by middleware

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).send({ error: "User not found" });

    res.json({ name: updatedUser.name, email: updatedUser.email });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send({ error: "Failed to update profile" });
  }
});

module.exports = router;
