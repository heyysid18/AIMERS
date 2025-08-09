const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserOTP = require('../models/UserOTP');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Fallback secret for local/dev to avoid crashes if env var is missing
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// Helper: SMS sender (Twilio if configured, else console)
async function sendSms(phone, message) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (sid && token && from) {
    const twilio = require('twilio')(sid, token);
    await twilio.messages.create({ to: phone, from, body: message });
  } else {
    console.log(`DEV SMS to ${phone}: ${message}`);
  }
}

// Helper: Send email (SMTP if configured, else console)
async function sendEmail(to, subject, text) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'no-reply@aimers.local';

  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: { user, pass }
    });
    await transporter.sendMail({ from, to, subject, text });
  } else {
    console.log(`DEV EMAIL to ${to}\nSubject: ${subject}\n${text}`);
  }
}

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ Send Phone OTP
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });

    // Basic rate limiting via existing record timing
    const now = new Date();
    const existing = await UserOTP.findOne({ phone }).sort({ createdAt: -1 });
    if (existing && existing.expiresAt > now && (now - existing.createdAt) < 60_000) {
      return res.status(429).json({ error: 'Please wait before requesting another OTP' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await UserOTP.deleteMany({ phone });
    await UserOTP.create({ phone, otpHash, expiresAt, attempts: 0, verified: false });

    await sendSms(phone, `Your AIMERS verification code is ${otp}. This code expires in 5 minutes.`);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('❌ sendPhoneOtp error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ✅ Verify Phone OTP
exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });

    const record = await UserOTP.findOne({ phone });
    if (!record) return res.status(400).json({ error: 'No OTP request found for this phone' });

    if (record.verified) return res.json({ success: true, message: 'Already verified' });

    if (record.expiresAt < new Date()) {
      await UserOTP.deleteMany({ phone });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (record.attempts >= 5) {
      await UserOTP.deleteMany({ phone });
      return res.status(429).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    const match = await bcrypt.compare(code, record.otpHash);
    if (!match) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: 'Invalid code' });
    }

    record.verified = true;
    await record.save();

    res.json({ success: true, message: 'Phone verified' });
  } catch (err) {
    console.error('❌ verifyPhoneOtp error:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

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

    // If phone is provided, require verified OTP
    if (phone) {
      const otpRecord = await UserOTP.findOne({ phone });
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: 'Please verify your phone number before registering' });
      }
    }

    // Backend validation for grade
    if ((role === undefined || role === 'student')) {
      const validGrades = [9, 10, 11, 12];
      if (!grade || !validGrades.includes(Number(grade))) {
        return res.status(400).json({ error: 'Grade is required and must be one of 9, 10, 11, or 12.' });
      }
    }

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
      phoneVerified: Boolean(phone),
      school,
      parentName,
      parentPhone,
      address
    });

    // Clear OTP record after use
    if (phone) await UserOTP.deleteMany({ phone });

    // Auto-login after successful registration for better UX
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        school: user.school
      }
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstError });
    }
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
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

// Google OAuth callback handler
exports.googleCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d',
  });
  const redirectUrl = `http://localhost:3000/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
  res.redirect(redirectUrl);
};

// ✅ Forgot Password - request reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Avoid user enumeration: return success anyway
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = expiresAt;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
    await sendEmail(user.email, 'Reset your AIMERS password', `Click the link below to reset your password (valid for 15 minutes):\n\n${resetUrl}`);

    res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    console.error('❌ forgotPassword error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

// ✅ Reset Password - finalize reset
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ error: 'Email, token and newPassword are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordResetTokenHash || !user.passwordResetExpiresAt) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    if (user.passwordResetExpiresAt < new Date()) {
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ error: 'Reset link expired' });
    }

    const match = await bcrypt.compare(token, user.passwordResetTokenHash);
    if (!match) return res.status(400).json({ error: 'Invalid reset token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('❌ resetPassword error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
