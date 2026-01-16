// services/seedService.js
const User = require('../models/User');
const Course = require('../models/Course');
const BankAccount = require('../models/BankAccount');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Transaction = require('../models/Transaction');
const Progress = require('../models/Progress');

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
      { 
        email: 'alice@example.com', 
        password: 'pass123', 
        name: 'Alice Learner', 
        type: 'learner' 
      },
      { 
        email: 'bob@example.com', 
        password: 'pass123', 
        name: 'Bob Student', 
        type: 'learner' 
      },
      { 
        email: 'john@example.com', 
        password: 'pass123', 
        name: 'John Doe', 
        type: 'instructor', 
        accountNumber: 'ACC001', 
        bankSecret: 'secret1' 
      },
      { 
        email: 'jane@example.com', 
        password: 'pass123', 
        name: 'Jane Smith', 
        type: 'instructor', 
        accountNumber: 'ACC002', 
        bankSecret: 'secret2' 
      },
      { 
        email: 'bob.j@example.com', 
        password: 'pass123', 
        name: 'Bob Johnson', 
        type: 'instructor', 
        accountNumber: 'ACC003', 
        bankSecret: 'secret3' 
      },
      { 
        email: 'admin@lms.com', 
        password: 'admin123', 
        name: 'Admin User', 
        type: 'admin', 
        accountNumber: 'ACC_LMS', 
        bankSecret: 'lms_secret' 
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create Bank Accounts
    await BankAccount.insertMany([
      { accountNumber: 'ACC001', owner: users[2]._id.toString(), balance: 500 },
      { accountNumber: 'ACC002', owner: users[3]._id.toString(), balance: 500 },
      { accountNumber: 'ACC003', owner: users[4]._id.toString(), balance: 500 },
      { accountNumber: 'ACC_LMS', owner: users[5]._id.toString(), balance: 10000 }
    ]);
    console.log('✅ Created bank accounts');

    // Create Courses
    const courses = await Course.insertMany([
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
    console.log(`✅ Created ${courses.length} courses`);

    // Create some enrollments
    await Enrollment.insertMany([
      {
        learnerId: users[0]._id.toString(),
        courseId: courses[0]._id,
        completed: true,
        progress: 100,
        completedAt: new Date()
      },
      {
        learnerId: users[0]._id.toString(),
        courseId: courses[1]._id,
        completed: false,
        progress: 50
      },
      {
        learnerId: users[1]._id.toString(),
        courseId: courses[0]._id,
        completed: false,
        progress: 30
      }
    ]);
    console.log('✅ Created enrollments');

    // Create certificates for completed courses
    await Certificate.insertMany([
      {
        certificateId: 'CERT' + Date.now() + '001',
        learnerId: users[0]._id.toString(),
        learnerName: users[0].name,
        courseId: courses[0]._id,
        courseTitle: courses[0].title,
        instructor: courses[0].instructor
      }
    ]);
    console.log('✅ Created certificates');

    // Create initial transactions
    await Transaction.insertMany([
      {
        transactionId: 'TXN' + Date.now() + '001',
        from: 'system',
        to: users[2]._id.toString(),
        amount: 500,
        description: 'Initial balance for instructor',
        status: 'completed'
      },
      {
        transactionId: 'TXN' + Date.now() + '002',
        from: 'system',
        to: users[3]._id.toString(),
        amount: 500,
        description: 'Initial balance for instructor',
        status: 'completed'
      },
      {
        transactionId: 'TXN' + Date.now() + '003',
        from: 'system',
        to: users[5]._id.toString(),
        amount: 10000,
        description: 'Initial platform balance',
        status: 'completed'
      }
    ]);
    console.log('✅ Created transactions');

    // Create progress records
    await Progress.insertMany([
      {
        learnerId: users[0]._id.toString(),
        courseId: courses[0]._id,
        completedMaterials: [0, 1, 2],
        lastAccessedMaterial: 2
      },
      {
        learnerId: users[0]._id.toString(),
        courseId: courses[1]._id,
        completedMaterials: [0, 1],
        lastAccessedMaterial: 1
      },
      {
        learnerId: users[1]._id.toString(),
        courseId: courses[0]._id,
        completedMaterials: [0],
        lastAccessedMaterial: 0
      }
    ]);
    console.log('✅ Created progress records');

    console.log('✅ All initial data seeded successfully!');
    console.log('\n📋 Demo Users:');
    console.log('===============');
    console.log('Learners:');
    console.log('- alice@example.com / pass123');
    console.log('- bob@example.com / pass123');
    console.log('\nInstructors:');
    console.log('- john@example.com / pass123 (ACC001 / secret1)');
    console.log('- jane@example.com / pass123 (ACC002 / secret2)');
    console.log('- bob.j@example.com / pass123 (ACC003 / secret3)');
    console.log('\nAdmin:');
    console.log('- admin@lms.com / admin123 (ACC_LMS / lms_secret)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

module.exports = initializeData;
