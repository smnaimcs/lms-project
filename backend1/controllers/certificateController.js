const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { generateCertificateId } = require('../utils/generateIds');

const completeCourse = async (req, res) => {
  try {
    const { learnerId, courseId } = req.body;
    
    const enrollment = await Enrollment.findOne({ learnerId, courseId });
    
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    if (enrollment.completed) {
      return res.status(400).json({ error: 'Course already completed' });
    }
    
    enrollment.completed = true;
    enrollment.completedAt = new Date();
    enrollment.progress = 100;
    await enrollment.save();
    
    const course = await Course.findById(courseId);
    const learner = await User.findById(learnerId);
    
    const certificate = await Certificate.create({
      certificateId: generateCertificateId(),
      learnerId,
      learnerName: learner.name,
      courseId,
      courseTitle: course.title,
      instructor: course.instructor
    });
    
    res.json({
      success: true,
      certificate,
      message: 'Congratulations! You have completed the course.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLearnerCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      learnerId: req.params.learnerId 
    });
    
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { completeCourse, getLearnerCertificates };
