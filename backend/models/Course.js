const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  grade: { type: Number, required: true, enum: [9, 10, 11, 12] },
  subject: { type: String, required: true },
  description: String,
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  curriculumPdfUrl: String,
  videoTopics: [
    {
      topic: { type: String, required: true },
      url: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", courseSchema);
