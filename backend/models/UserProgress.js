const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ["dpp", "paper", "video"] 
  },
  itemId: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  grade: { 
    type: Number, 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  completedAt: { 
    type: Date 
  },
  date: { 
    type: String, 
    required: true 
  }, // For DPPs: "2025-01-15", For Papers: "2023"
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to ensure unique user-item combinations
userProgressSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model("UserProgress", userProgressSchema); 