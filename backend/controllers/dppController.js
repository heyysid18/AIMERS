const DPP = require('../models/DPP');

// Create new DPP (admin/teacher)
exports.createDPP = async (req, res) => {
  try {
    const { title, content, date, grade, subject, topic, dppNumber, questionCount, timeLimit, difficulty, description } = req.body;

    const newDPP = await DPP.create({
      title,
      content,
      date: new Date(date),
      grade: parseInt(grade),
      subject: subject.toLowerCase(),
      topic: topic || 'General', // Default to 'General' if no topic provided
      dppNumber: dppNumber || 1,
      questionCount: questionCount || 10,
      timeLimit: timeLimit || 30,
      difficulty: difficulty || 'Medium',
      description: description || ''
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

// Get DPPs by topic
exports.getDPPsByTopic = async (req, res) => {
  try {
    const { grade, subject, topic } = req.params;
    const dpps = await DPP.find({ 
      grade: parseInt(grade), 
      subject: subject.toLowerCase(), 
      topic: topic 
    }).sort({ dppNumber: 1 });
    
    res.json({
      success: true,
      topic: topic,
      dpps: dpps,
      count: dpps.length
    });
  } catch (err) {
    console.error('Error fetching DPPs for topic:', err);
    res.status(500).json({ error: 'Failed to fetch DPPs for topic' });
  }
};
