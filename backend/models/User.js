const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },
  grade: { 
    type: Number, 
    enum: [9, 10, 11, 12], 
    required: function() { return this.role === 'student'; }
  },
  phone: { 
    type: String, 
    required: false,
    trim: true
  },
  school: { 
    type: String, 
    required: false,
    trim: true
  },
  parentName: { 
    type: String, 
    required: false,
    trim: true
  },
  parentPhone: { 
    type: String, 
    required: false,
    trim: true
  },
  address: { 
    type: String, 
    required: false,
    trim: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
