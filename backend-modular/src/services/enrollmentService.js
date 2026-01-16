// ==================== src/services/enrollmentService.js ====================
const Enrollment = require('../../models/Enrollment');
const Course = require('../../models/Course');
const User = require('../../models/User');
const bankService = require('./bankService');
const transactionService = require('./transactionService');
const { INSTRUCTOR_REVENUE_SHARE } = require('../config/constants');

class EnrollmentService {
  async enrollInCourse(learnerId, courseId, bankSecret) {
    const learner = await User.findById(learnerId);
    const course = await Course.findById(courseId);
    
    if (!learner || !course) {
      throw new Error('Learner or course not found');
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ learnerId, courseId });
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }
    
    // Validate bank secret
    await bankService.validateBankSecret(learnerId, bankSecret);
    
    // Get LMS admin user
    const lmsUser = await User.findOne({ type: 'admin' });
    
    // Process payment from learner to LMS
    const paymentResult = await bankService.processPayment(
      learnerId,
      lmsUser._id.toString(),
      course.price,
      bankSecret
    );
    
    // Create transaction record
    const learnerTransaction = await transactionService.createTransaction({
      from: learnerId,
      to: lmsUser._id.toString(),
      amount: course.price,
      description: `Enrollment in ${course.title}`,
      status: 'completed'
    });
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      learnerId,
      courseId,
      completed: false,
      progress: 0
    });
    
    // Pay instructor (70% of course price)
    const instructorPayment = course.price * INSTRUCTOR_REVENUE_SHARE;
    
    await bankService.processPayment(
      lmsUser._id.toString(),
      course.instructorId,
      instructorPayment
    );
    
    await transactionService.createTransaction({
      from: lmsUser._id.toString(),
      to: course.instructorId,
      amount: instructorPayment,
      description: `Revenue share for ${course.title} enrollment`,
      status: 'completed'
    });
    
    return {
      enrollment,
      transaction: learnerTransaction,
      newBalance: paymentResult.fromBalance
    };
  }

  async getLearnerEnrollments(learnerId) {
    const enrollments = await Enrollment.find({ learnerId }).populate('courseId');
    
    return enrollments.map(e => ({
      ...e.toObject(),
      courseId: e.courseId._id,
      course: {
        id: e.courseId._id,
        title: e.courseId.title,
        description: e.courseId.description,
        price: e.courseId.price,
        instructor: e.courseId.instructor,
        instructorId: e.courseId.instructorId,
        materials: e.courseId.materials
      }
    }));
  }

  async getEnrollmentById(enrollmentId) {
    return await Enrollment.findById(enrollmentId);
  }

  async checkEnrollment(learnerId, courseId) {
    return await Enrollment.findOne({ learnerId, courseId });
  }
}

module.exports = new EnrollmentService();
