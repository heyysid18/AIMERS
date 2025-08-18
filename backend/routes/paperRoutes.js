const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');

// Get all papers
router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ uploadedAt: -1 });
    
    const formattedPapers = papers.map(paper => ({
      id: paper._id,
      className: paper.className,
      subject: paper.subject,
      filename: paper.originalName,
      year: paper.year,
      type: paper.type,
      size: paper.size,
      uploadedAt: paper.uploadedAt,
      url: `${req.protocol}://${req.get('host')}/api/pdf/${paper._id}`
    }));
    
    console.log(`📚 Fetched ${formattedPapers.length} papers from MongoDB`);
    res.json({ papers: formattedPapers });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// Get board papers
router.get('/board', async (req, res) => {
  try {
    const boardPapers = await Paper.find({ type: 'board' }).sort({ uploadedAt: -1 });
    
    const formattedPapers = boardPapers.map(paper => ({
      id: paper._id,
      className: paper.className,
      subject: paper.subject,
      filename: paper.originalName,
      year: paper.year,
      type: paper.type,
      size: paper.size,
      uploadedAt: paper.uploadedAt,
      url: `${req.protocol}://${req.get('host')}/api/pdf/${paper._id}`
    }));
    
    console.log(`📚 Fetched ${formattedPapers.length} board papers from MongoDB`);
    res.json({ papers: formattedPapers });
  } catch (error) {
    console.error('Error fetching board papers:', error);
    res.status(500).json({ error: 'Failed to fetch board papers' });
  }
});

// Get AIMERS institute papers
router.get('/aimers', async (req, res) => {
  try {
    const aimersPapers = await Paper.find({ type: 'aimers' }).sort({ uploadedAt: -1 });
    
    const formattedPapers = aimersPapers.map(paper => ({
      id: paper._id,
      className: paper.className,
      subject: paper.subject,
      filename: paper.originalName,
      year: paper.year,
      type: paper.type,
      size: paper.size,
      uploadedAt: paper.uploadedAt,
      url: `${req.protocol}://${req.get('host')}/api/pdf/${paper._id}`
    }));
    
    console.log(`📚 Fetched ${formattedPapers.length} AIMERS papers from MongoDB`);
    res.json({ papers: formattedPapers });
  } catch (error) {
    console.error('Error fetching AIMERS papers:', error);
    res.status(500).json({ error: 'Failed to fetch AIMERS papers' });
  }
});

// Get papers by class and subject
router.get('/:class/:subject', async (req, res) => {
  try {
    const { class: className, subject } = req.params;
    const papers = await Paper.find({ 
      className, 
      subject: subject.toLowerCase() 
    }).sort({ uploadedAt: -1 });
    
    const formattedPapers = papers.map(paper => ({
      id: paper._id,
      className: paper.className,
      subject: paper.subject,
      filename: paper.originalName,
      year: paper.year,
      type: paper.type,
      size: paper.size,
      uploadedAt: paper.uploadedAt,
      url: `${req.protocol}://${req.get('host')}/api/pdf/${paper._id}`
    }));
    
    console.log(`📚 Fetched ${formattedPapers.length} papers for ${className} ${subject} from MongoDB`);
    res.json({ papers: formattedPapers });
  } catch (error) {
    console.error('Error fetching papers by class and subject:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// Check paper availability for a specific year
router.get('/check/:class/:subject/:year', async (req, res) => {
  try {
    const { class: className, subject, year } = req.params;
    
    const paper = await Paper.findOne({
      className,
      subject: subject.toLowerCase(),
      year
    });
    
    res.status(200).json({ 
      available: !!paper,
      filename: paper ? paper.originalName : null,
      paperId: paper ? paper._id : null
    });
  } catch (error) {
    console.error('Error checking paper availability:', error);
    res.status(500).json({ error: 'Failed to check paper availability' });
  }
});

// Debug route to check all papers in MongoDB
router.get('/debug/all', async (req, res) => {
  try {
    const allPapers = await Paper.find().sort({ uploadedAt: -1 });
    console.log(`🔍 Debug: Found ${allPapers.length} papers in MongoDB`);
    
    const debugInfo = allPapers.map(paper => ({
      id: paper._id,
      name: paper.name,
      originalName: paper.originalName,
      fileType: paper.fileType,
      className: paper.className,
      subject: paper.subject,
      year: paper.year,
      type: paper.type,
      size: paper.size,
      uploadedAt: paper.uploadedAt,
      hasContent: !!paper.content,
      contentLength: paper.content ? paper.content.length : 0
    }));
    
    res.json({ 
      totalPapers: allPapers.length,
      papers: debugInfo,
      message: 'Debug information for all papers'
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ error: 'Failed to get debug info' });
  }
});

// Delete a paper
router.delete('/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;
    
    const paper = await Paper.findByIdAndDelete(paperId);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Paper deleted successfully',
      deletedPaper: paper.originalName
    });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

module.exports = router; 