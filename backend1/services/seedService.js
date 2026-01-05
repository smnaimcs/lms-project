const User = require('../models/User');
const Course = require('../models/Course');
const BankAccount = require('../models/BankAccount');

const initializeData = async () => {
  try {
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

module.exports = initializeData;
