const Course = require('../models/Course');
const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const Transaction = require('../models/Transaction');
const { generateTransactionId } = require('../utils/generateIds');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({
      success: true,
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        price: c.price,
        instructor: c.instructor,
        instructorId: c.instructorId,
        materials: c.materials
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadCourse = async (req, res) => {
  try {
    const { instructorId, title, description, price, materials } = req.body;
    
    const instructor = await User.findById(instructorId);
    
    if (!instructor || instructor.type !== 'instructor') {
      return res.status(403).json({ error: 'Only instructors can upload courses' });
    }
    
    const newCourse = await Course.create({
      title,
      description,
      price: parseFloat(price),
      instructor: instructor.name,
      instructorId,
      materials: materials || []
    });
    
    // Pay instructor for uploading
    const uploadFee = 200;
    const instructorAccount = await BankAccount.findOne({ accountNumber: instructor.accountNumber });
    const lmsAccount = await BankAccount.findOne({ accountNumber: 'ACC_LMS' });
    
    if (lmsAccount && instructorAccount) {
      lmsAccount.balance -= uploadFee;
      instructorAccount.balance += uploadFee;
      
      await lmsAccount.save();
      await instructorAccount.save();
      
      await Transaction.create({
        transactionId: generateTransactionId(),
        from: 'admin1',
        to: instructorId,
        amount: uploadFee,
        description: `Payment for uploading course: ${title}`,
        status: 'completed'
      });
    }
    
    res.json({
      success: true,
      course: newCourse,
      payment: uploadFee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.instructorId });
    res.json({
      success: true,
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        price: c.price,
        instructor: c.instructor,
        instructorId: c.instructorId,
        materials: c.materials
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { instructorId, materials } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (course.instructorId !== instructorId) {
      return res.status(403).json({ error: 'You can only edit your own courses' });
    }
    
    course.materials = materials;
    await course.save();
    
    res.json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        instructor: course.instructor,
        instructorId: course.instructorId,
        materials: course.materials
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  uploadCourse,
  getInstructorCourses,
  updateCourseMaterials
};
