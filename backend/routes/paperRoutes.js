const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Check paper availability for a specific year
router.get('/check/:class/:subject/:year', (req, res) => {
  try {
    const { class: className, subject, year } = req.params;
    const papersDir = path.join(__dirname, `../public/uploads/papers/${className}/${subject}`);
    
    if (!fs.existsSync(papersDir)) {
      return res.status(200).json({ available: false });
    }
    
    const files = fs.readdirSync(papersDir);
    const paperFile = files.find(file => file.endsWith('.pdf') && file.replace('.pdf', '') === year);
    
    res.status(200).json({ 
      available: !!paperFile,
      filename: paperFile || null
    });
  } catch (error) {
    console.error('Error checking paper availability:', error);
    res.status(500).json({ error: 'Failed to check paper availability' });
  }
});

// Get all papers
router.get('/', (req, res) => {
  try {
    const papersDir = path.join(__dirname, '../public/uploads/papers');
    const papers = [];
    
    if (fs.existsSync(papersDir)) {
      const classes = fs.readdirSync(papersDir);
      
      classes.forEach(className => {
        const classPath = path.join(papersDir, className);
        if (fs.statSync(classPath).isDirectory()) {
          const subjects = fs.readdirSync(classPath);
          
          subjects.forEach(subject => {
            const subjectPath = path.join(classPath, subject);
            if (fs.statSync(subjectPath).isDirectory()) {
              const files = fs.readdirSync(subjectPath);
              
              files.forEach(file => {
                if (file.endsWith('.pdf')) {
                  papers.push({
                    className,
                    subject,
                    filename: file,
                    year: file.replace('.pdf', ''),
                    url: `/uploads/papers/${className}/${subject}/${file}`
                  });
                }
              });
            }
          });
        }
      });
    }
    
    res.json({ papers });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// Get board papers
router.get('/board', (req, res) => {
  try {
    const papersDir = path.join(__dirname, '../public/uploads/papers');
    const boardPapers = [];
    
    if (fs.existsSync(papersDir)) {
      const classes = fs.readdirSync(papersDir);
      
      classes.forEach(className => {
        const classPath = path.join(papersDir, className);
        if (fs.statSync(classPath).isDirectory()) {
          const subjects = fs.readdirSync(classPath);
          
          subjects.forEach(subject => {
            const subjectPath = path.join(classPath, subject);
            if (fs.statSync(subjectPath).isDirectory()) {
              const files = fs.readdirSync(subjectPath);
              
              files.forEach(file => {
                if (file.endsWith('.pdf')) {
                  boardPapers.push({
                    className,
                    subject,
                    filename: file,
                    year: file.replace('.pdf', ''),
                    url: `/uploads/papers/${className}/${subject}/${file}`,
                    type: 'board'
                  });
                }
              });
            }
          });
        }
      });
    }
    
    res.json({ papers: boardPapers });
  } catch (error) {
    console.error('Error fetching board papers:', error);
    res.status(500).json({ error: 'Failed to fetch board papers' });
  }
});

// Get AIMERS institute papers
router.get('/aimers', (req, res) => {
  try {
    const papersDir = path.join(__dirname, '../public/uploads/papers');
    const aimersPapers = [];
    
    if (fs.existsSync(papersDir)) {
      const classes = fs.readdirSync(papersDir);
      
      classes.forEach(className => {
        const classPath = path.join(papersDir, className);
        if (fs.statSync(classPath).isDirectory()) {
          const subjects = fs.readdirSync(classPath);
          
          subjects.forEach(subject => {
            const subjectPath = path.join(classPath, subject);
            if (fs.statSync(subjectPath).isDirectory()) {
              const files = fs.readdirSync(subjectPath);
              
              files.forEach(file => {
                if (file.endsWith('.pdf')) {
                  aimersPapers.push({
                    className,
                    subject,
                    filename: file,
                    year: file.replace('.pdf', ''),
                    url: `/uploads/papers/${className}/${subject}/${file}`,
                    type: 'aimers'
                  });
                }
              });
            }
          });
        }
      });
    }
    
    res.json({ papers: aimersPapers });
  } catch (error) {
    console.error('Error fetching AIMERS papers:', error);
    res.status(500).json({ error: 'Failed to fetch AIMERS papers' });
  }
});

// Get papers by class and subject
router.get('/:class/:subject', (req, res) => {
  try {
    const { class: className, subject } = req.params;
    const papersDir = path.join(__dirname, `../public/uploads/papers/${className}/${subject}`);
    const papers = [];
    
    if (fs.existsSync(papersDir)) {
      const files = fs.readdirSync(papersDir);
      
      files.forEach(file => {
        if (file.endsWith('.pdf')) {
          papers.push({
            className,
            subject,
            filename: file,
            year: file.replace('.pdf', ''),
            url: `/uploads/papers/${className}/${subject}/${file}`
          });
        }
      });
    }
    
    res.json({ papers });
  } catch (error) {
    console.error('Error fetching papers by class and subject:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

module.exports = router; 