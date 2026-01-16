const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');
const BankAccount = require('../models/BankAccount');
const Transaction = require('../models/Transaction');
const { generateTransactionId } = require('../utils/generateIds');

const enrollInCourse = async (req, res) => {
  try {
    const { learnerId, courseId, bankSecret } = req.body;
    
    const learner = await User.findById(learnerId);
    const course = await Course.findById(courseId);
    
    if (!learner || !course) {
      return res.status(404).json({ error: 'Learner or course not found' });
    }
    
    const existingEnrollment = await Enrollment.findOne({ learnerId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    if (learner.bankSecret !== bankSecret) {
      return res.status(401).json({ error: 'Invalid bank secret' });
    }
    
    const learnerAccount = await BankAccount.findOne({ accountNumber: learner.accountNumber });
    
    if (learnerAccount.balance < course.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    learnerAccount.balance -= course.price;
    await learnerAccount.save();
    
    const lmsAccount = await BankAccount.findOne({ accountNumber: 'ACC_LMS' });
    lmsAccount.balance += course.price;
    await lmsAccount.save();
    
    const learnerTransaction = await Transaction.create({
      transactionId: generateTransactionId(),
      from: learnerId,
      to: 'admin1',
      amount: course.price,
      description: `Enrollment in ${course.title}`,
      status: 'completed'
    });
    
    const enrollment = await Enrollment.create({
      learnerId,
      courseId,
      completed: false,
      progress: 0
    });
    
    // Pay instructor
    const instructorPayment = course.price * 0.7;
    const instructorAccount = await BankAccount.findOne({ 
      owner: course.instructorId 
    });
    
    if (instructorAccount) {
      lmsAccount.balance -= instructorPayment;
      instructorAccount.balance += instructorPayment;
      
      await lmsAccount.save();
      await instructorAccount.save();
      
      await Transaction.create({
        transactionId: generateTransactionId(),
        from: 'admin1',
        to: course.instructorId,
        amount: instructorPayment,
        description: `Revenue share for ${course.title} enrollment`,
        status: 'completed'
      });
    }
    
    res.json({
      success: true,
      enrollment,
      transaction: learnerTransaction,
      newBalance: learnerAccount.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLearnerEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      learnerId: req.params.learnerId 
    }).populate('courseId');
    
    res.json({
      success: true,
      enrollments: enrollments.map(e => ({
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
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { enrollInCourse, getLearnerEnrollments };
