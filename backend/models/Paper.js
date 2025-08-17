const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['papers', 'dpps', 'pdfs']
  },
  className: {
    type: String,
    required: true,
    enum: ['9th', '10th', '11th', '12th']
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology']
  },
  year: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true,
    enum: ['board', 'aimers', 'other'],
    default: 'other'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
paperSchema.index({ fileType: 1, className: 1, subject: 1, type: 1 });

module.exports = mongoose.model('Paper', paperSchema); 