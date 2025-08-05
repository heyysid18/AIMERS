const DPP = require('../models/DPP');

// Create new DPP (admin/teacher)
exports.createDPP = async (req, res) => {
  try {
    const { title, content, date, grade, subject } = req.body;

    const newDPP = await DPP.create({
      title,
      content,
      date: new Date(date),
      grade: parseInt(grade),
      subject: subject.toLowerCase()
    });

    res.status(201).json(newDPP);
  } catch (err) {
    console.error('Error creating DPP:', err);
    res.status(500).json({ error: 'Failed to create DPP entry' });
  }
};

// Get all DPPs
exports.getAllDPPs = async (req, res) => {
  try {
    const dpps = await DPP.find().sort({ date: -1 });
    res.json(dpps);
  } catch (err) {
    console.error('Error fetching DPPs:', err);
    res.status(500).json({ error: 'Failed to fetch DPPs' });
  }
};

// Get DPPs by subject
exports.getDPPsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const dpps = await DPP.find({ subject: subject.toLowerCase() }).sort({ date: -1 });
    res.json(dpps);
  } catch (err) {
    console.error('Error fetching DPPs for subject:', err);
    res.status(500).json({ error: 'Failed to fetch DPPs for subject' });
  }
};
