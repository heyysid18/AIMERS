const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register a new user
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      grade, 
      phone, 
      school, 
      parentName, 
      parentPhone, 
      address 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      grade,
      phone,
      school,
      parentName,
      parentPhone,
      address
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// ✅ Login user and return JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ Store id as `id` in token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        school: user.school
      },
    });
  } catch (err) {
    console.error("❌ Login Failed:", err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// ✅ GET logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
