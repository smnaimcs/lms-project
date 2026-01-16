// ==================== src/controllers/enrollmentController.js ====================
const enrollmentService = require('../services/enrollmentService');

class EnrollmentController {
  async enrollInCourse(req, res, next) {
    try {
      const { learnerId, courseId, bankSecret } = req.body;
      
      if (!learnerId || !courseId || !bankSecret) {
        return res.status(400).json({ error: 'Learner ID, course ID, and bank secret are required' });
      }
      
      const result = await enrollmentService.enrollInCourse(learnerId, courseId, bankSecret);
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async getLearnerEnrollments(req, res, next) {
    try {
      const { learnerId } = req.params;
      
      const enrollments = await enrollmentService.getLearnerEnrollments(learnerId);
      
      res.json({
        success: true,
        enrollments
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EnrollmentController();
