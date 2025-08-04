const Course = require('../models/course');

// Create a new course (Admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, subject, grade, description } = req.body;

    const newCourse = await Course.create({
      title,
      subject,
      grade,
      description,
    });

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get courses by grade
exports.getCoursesByGrade = async (req, res) => {
  try {
    const grade = req.params.grade;
    const courses = await Course.find({ grade });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses for grade' });
  }
};
