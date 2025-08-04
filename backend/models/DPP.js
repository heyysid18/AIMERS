const mongoose = require("mongoose");

const dppSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  grade: { type: Number, required: true, enum: [9, 10, 11, 12] },
  subject: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DPP", dppSchema);
