const DPP = require('../models/DPP');

// Create new DPP (admin/teacher)
exports.createDPP = async (req, res) => {
  try {
    const { title, subject, grade, chapter, fileUrl } = req.body;

    const newDPP = await DPP.create({
      title,
      subject,
      chapter,
      grade,
      fileUrl,
    });

    res.status(201).json(newDPP);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create DPP entry' });
  }
};

// Get all DPPs
exports.getAllDPPs = async (req, res) => {
  try {
    const dpps = await DPP.find().sort({ createdAt: -1 });
    res.json(dpps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch DPPs' });
  }
};

// Get DPPs by subject
exports.getDPPsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const dpps = await DPP.find({ subject });
    res.json(dpps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch DPPs for subject' });
  }
};
