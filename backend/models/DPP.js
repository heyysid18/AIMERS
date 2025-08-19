const mongoose = require("mongoose");

const dppSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // displayName: String, // Temporarily commented out to test
  content: { type: String, required: true },
  date: { type: Date, required: true },
  grade: { type: Number, required: true, enum: [9, 10, 11, 12] },
  subject: { type: String, required: true },
  
  // Enhanced fields for topic-based organization
  topic: { type: String, required: true }, // e.g., "Algebra", "Geometry"
  dppNumber: { type: Number, default: 0 }, // e.g., 1, 2, 3 for DDP1, DDP2, DDP3
  topicOrder: { type: Number, default: 0 }, // Order within topic
  
  // DPP details
  questionCount: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 30 }, // in minutes
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  description: { type: String, default: '' },
  
  // Progress tracking
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient topic-based queries
dppSchema.index({ grade: 1, subject: 1, topic: 1, dppNumber: 1 });

// Update timestamp on save
dppSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("DPP", dppSchema);
