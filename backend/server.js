// ==================== server.js (MongoDB Version) ====================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import Models
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Transaction = require('./models/Transaction');
const Certificate = require('./models/Certificate');
const BankAccount = require('./models/BankAccount');
const Progress = require('./models/Progress');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== MongoDB Connection ====================
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  initializeData();
})
.catch((error) => {
  console.error('❌ MongoDB Connection Error:', error);
  process.exit(1);
});

// ==================== Initialize Demo Data ====================
const initializeData = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📊 Database already initialized');
      return;
    }

    console.log('🌱 Seeding initial data...');

    // Create Users
    const users = await User.insertMany([
      { email: 'alice@example.com', password: 'pass123', name: 'Alice Learner', type: 'learner' },
      { email: 'bob@example.com', password: 'pass123', name: 'Bob Student', type: 'learner' },
      { email: 'john@example.com', password: 'pass123', name: 'John Doe', type: 'instructor', accountNumber: 'ACC001', bankSecret: 'secret1' },
      { email: 'jane@example.com', password: 'pass123', name: 'Jane Smith', type: 'instructor', accountNumber: 'ACC002', bankSecret: 'secret2' },
      { email: 'bob.j@example.com', password: 'pass123', name: 'Bob Johnson', type: 'instructor', accountNumber: 'ACC003', bankSecret: 'secret3' },
      { email: 'admin@lms.com', password: 'admin123', name: 'Admin User', type: 'admin', accountNumber: 'ACC_LMS', bankSecret: 'lms_secret' }
    ]);

    // Create Bank Accounts
    await BankAccount.insertMany([
      { accountNumber: 'ACC001', owner: users[2]._id.toString(), balance: 500 },
      { accountNumber: 'ACC002', owner: users[3]._id.toString(), balance: 500 },
      { accountNumber: 'ACC003', owner: users[4]._id.toString(), balance: 500 },
      { accountNumber: 'ACC_LMS', owner: users[5]._id.toString(), balance: 10000 }
    ]);

    // Create Courses
    await Course.insertMany([
      {
        title: 'Web Development Fundamentals',
        instructor: 'John Doe',
        instructorId: users[2]._id.toString(),
        price: 99,
        description: 'Learn HTML, CSS, and JavaScript basics',
        materials: [
          { type: 'video', title: 'Introduction to Web Dev', url: 'video1.mp4' },
          { type: 'text', title: 'HTML Basics', content: 'HTML is the foundation...' },
          { type: 'mcq', title: 'JavaScript Quiz', content: 'Quiz questions...' }
        ]
      },
      {
        title: 'Data Structures & Algorithms',
        instructor: 'Jane Smith',
        instructorId: users[3]._id.toString(),
        price: 149,
        description: 'Master DSA for coding interviews',
        materials: [
          { type: 'video', title: 'Arrays and Linked Lists', url: 'video2.mp4' },
          { type: 'text', title: 'Algorithm Analysis', content: 'Time complexity...' }
        ]
      },
      {
        title: 'Machine Learning Basics',
        instructor: 'Bob Johnson',
        instructorId: users[4]._id.toString(),
        price: 199,
        description: 'Introduction to ML and AI concepts',
        materials: [
          { type: 'video', title: 'ML Overview', url: 'video3.mp4' },
          { type: 'text', title: 'Linear Regression', content: 'Linear regression is...' }
        ]
      },
      {
        title: 'Database Management Systems',
        instructor: 'John Doe',
        instructorId: users[2]._id.toString(),
        price: 129,
        description: 'SQL and NoSQL databases explained',
        materials: [
          { type: 'video', title: 'SQL Basics', url: 'video4.mp4' }
        ]
      },
      {
        title: 'Cloud Computing Essentials',
        instructor: 'Jane Smith',
        instructorId: users[3]._id.toString(),
        price: 179,
        description: 'Learn AWS, Azure, and cloud architecture',
        materials: [
          { type: 'video', title: 'Cloud Introduction', url: 'video5.mp4' }
        ]
      }
    ]);

    console.log('✅ Initial data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// ==================== Utility Functions ====================
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
};

const generateCertificateId = () => {
  return 'CERT' + Date.now() + Math.random().toString(36).substr(2, 9);
};

// ==================== Authentication APIs ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, type } = req.body;
    
    const user = await User.findOne({ email, password, type });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        type: user.type,
        accountNumber: user.accountNumber,
        bankSecret: user.bankSecret, // Include bank secret for learners
        bankSetup: !!user.accountNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, type } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = await User.create({ email, password, name, type });
    
    res.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        type: newUser.type
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Bank APIs ====================

// Setup bank account
app.post('/api/bank/setup', async (req, res) => {
  try {
    const { userId, accountNumber, bankSecret } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.accountNumber = accountNumber;
    user.bankSecret = bankSecret;
    await user.save();
    
    // Create or update bank account
    let bankAccount = await BankAccount.findOne({ accountNumber });
    if (!bankAccount) {
      bankAccount = await BankAccount.create({
        accountNumber,
        owner: userId,
        balance: 1000 // Initial balance
      });
    }
    
    res.json({
      success: true,
      message: 'Bank account setup successful',
      balance: bankAccount.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get balance
app.get('/api/bank/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user || !user.accountNumber) {
      return res.status(404).json({ error: 'Bank account not found' });
    }
    
    const account = await BankAccount.findOne({ accountNumber: user.accountNumber });
    
    res.json({
      success: true,
      balance: account.balance,
      accountNumber: user.accountNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
app.post('/api/bank/transaction', async (req, res) => {
  try {
    const { fromUserId, toUserId, amount, description, bankSecret } = req.body;
    
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (fromUser.bankSecret !== bankSecret) {
      return res.status(401).json({ error: 'Invalid bank secret' });
    }
    
    const fromAccount = await BankAccount.findOne({ accountNumber: fromUser.accountNumber });
    const toAccount = await BankAccount.findOne({ accountNumber: toUser.accountNumber });
    
    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Process transaction
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    
    await fromAccount.save();
    await toAccount.save();
    
    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      from: fromUserId,
      to: toUserId,
      amount,
      description,
      status: 'completed'
    });
    
    res.json({
      success: true,
      transaction,
      newBalance: fromAccount.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Course APIs ====================

// Get all courses
app.get('/api/courses', async (req, res) => {
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
});

// Get course by ID
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload course
app.post('/api/courses', async (req, res) => {
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
});

// Get instructor's courses
app.get('/api/courses/instructor/:instructorId', async (req, res) => {
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
});

// Update course materials
app.put('/api/courses/:courseId/materials', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { instructorId, materials } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Verify instructor owns this course
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
});

// ==================== Enrollment APIs ====================

// Enroll in course
app.post('/api/enrollments', async (req, res) => {
  try {
    const { learnerId, courseId, bankSecret } = req.body;
    
    const learner = await User.findById(learnerId);
    const course = await Course.findById(courseId);
    
    if (!learner || !course) {
      return res.status(404).json({ error: 'Learner or course not found' });
    }
    
    // Check if already enrolled
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
    
    // Process payment
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
    
    // Create enrollment
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
});

// Get learner's enrollments
app.get('/api/enrollments/learner/:learnerId', async (req, res) => {
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
});

// ==================== Certificate APIs ====================

// Get or create progress
app.get('/api/progress/:learnerId/:courseId', async (req, res) => {
  try {
    const { learnerId, courseId } = req.params;
    
    let progress = await Progress.findOne({ learnerId, courseId });
    
    if (!progress) {
      progress = await Progress.create({
        learnerId,
        courseId,
        completedMaterials: [],
        lastAccessedMaterial: 0
      });
    }
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progress
app.post('/api/progress', async (req, res) => {
  try {
    const { learnerId, courseId, completedMaterials, lastAccessedMaterial } = req.body;
    
    let progress = await Progress.findOne({ learnerId, courseId });
    
    if (!progress) {
      progress = await Progress.create({
        learnerId,
        courseId,
        completedMaterials: completedMaterials || [],
        lastAccessedMaterial: lastAccessedMaterial || 0
      });
    } else {
      progress.completedMaterials = completedMaterials || progress.completedMaterials;
      progress.lastAccessedMaterial = lastAccessedMaterial !== undefined 
        ? lastAccessedMaterial 
        : progress.lastAccessedMaterial;
      await progress.save();
    }
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Certificate APIs ====================

// Complete course
app.post('/api/certificates', async (req, res) => {
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
});

// Get certificates
app.get('/api/certificates/learner/:learnerId', async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      learnerId: req.params.learnerId 
    });
    
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Admin APIs ====================

// Get all transactions
app.get('/api/admin/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.transactionId,
        from: t.from,
        to: t.to,
        amount: t.amount,
        description: t.description,
        timestamp: t.createdAt,
        status: t.status
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get platform stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalLearners = await User.countDocuments({ type: 'learner' });
    const totalInstructors = await User.countDocuments({ type: 'instructor' });
    
    const lmsAccount = await BankAccount.findOne({ accountNumber: 'ACC_LMS' });
    
    const transactions = await Transaction.find({ to: 'admin1' });
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      stats: {
        totalCourses,
        totalEnrollments,
        totalRevenue,
        totalLearners,
        totalInstructors,
        lmsBalance: lmsAccount ? lmsAccount.balance : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`🚀 LMS Server running on http://localhost:${PORT}`);
});
