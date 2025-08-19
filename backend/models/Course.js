const mongoose = require("mongoose");

const videoTopicSchema = new mongoose.Schema({
  topic: { type: String, required: true }, // e.g., "Differentiation", "Integration"
  url: { type: String, required: true }, // YouTube video URL
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Mathematics - Grade 12"
  grade: { type: Number, required: true, enum: [9, 10, 11, 12] },
  subject: { type: String, required: true }, // e.g., "mathematics", "physics"
  description: { type: String, required: true }, // Course description
  videoTopics: [videoTopicSchema], // Array of video topics
  
  // Course metadata
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
courseSchema.index({ grade: 1, subject: 1 });

// Update timestamp on save
courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Course", courseSchema); 