// ==================== backend/seed.js ====================
require('dotenv').config();
const mongoose = require('mongoose');

// Import Models
const User = require('./models/User');
const Course = require('./models/Course');
const BankAccount = require('./models/BankAccount');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

// Seed Data
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await BankAccount.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Users
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        email: 'alice@example.com',
        password: 'pass123',
        name: 'Alice Learner',
        type: 'learner',
        accountNumber: null,
        bankSecret: null
      },
      {
        email: 'bob@example.com',
        password: 'pass123',
        name: 'Bob Student',
        type: 'learner',
        accountNumber: null,
        bankSecret: null
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
    console.log('💰 Creating bank accounts...');
    const bankAccounts = await BankAccount.insertMany([
      {
        accountNumber: 'ACC001',
        owner: users[2]._id.toString(),
        balance: 500
      },
      {
        accountNumber: 'ACC002',
        owner: users[3]._id.toString(),
        balance: 500
      },
      {
        accountNumber: 'ACC003',
        owner: users[4]._id.toString(),
        balance: 500
      },
      {
        accountNumber: 'ACC_LMS',
        owner: users[5]._id.toString(),
        balance: 10000
      }
    ]);
    console.log(`✅ Created ${bankAccounts.length} bank accounts`);

    // Create Courses
    console.log('📚 Creating courses...');
    const courses = await Course.insertMany([
      {
        title: 'Web Development Fundamentals',
        instructor: 'John Doe',
        instructorId: users[2]._id.toString(),
        price: 99,
        description: 'Learn HTML, CSS, and JavaScript basics',
        materials: [
          {
            type: 'video',
            title: 'Introduction to Web Development',
            url: 'https://example.com/videos/web-intro.mp4',
            content: 'Introduction video content'
          },
          {
            type: 'text',
            title: 'HTML Basics',
            content: 'HTML is the foundation of web development. Learn about tags, elements, and structure...'
          },
          {
            type: 'mcq',
            title: 'JavaScript Quiz',
            content: 'Test your JavaScript knowledge with these questions...'
          }
        ]
      },
      {
        title: 'Data Structures & Algorithms',
        instructor: 'Jane Smith',
        instructorId: users[3]._id.toString(),
        price: 149,
        description: 'Master DSA for coding interviews',
        materials: [
          {
            type: 'video',
            title: 'Arrays and Linked Lists',
            url: 'https://example.com/videos/arrays-linkedlists.mp4',
            content: 'Understanding fundamental data structures'
          },
          {
            type: 'text',
            title: 'Algorithm Analysis',
            content: 'Time complexity and Big O notation explained...'
          },
          {
            type: 'mcq',
            title: 'Complexity Quiz',
            content: 'Test your understanding of time and space complexity...'
          }
        ]
      },
      {
        title: 'Machine Learning Basics',
        instructor: 'Bob Johnson',
        instructorId: users[4]._id.toString(),
        price: 199,
        description: 'Introduction to ML and AI concepts',
        materials: [
          {
            type: 'video',
            title: 'ML Overview',
            url: 'https://example.com/videos/ml-overview.mp4',
            content: 'Introduction to machine learning concepts'
          },
          {
            type: 'text',
            title: 'Linear Regression',
            content: 'Linear regression is a fundamental ML algorithm...'
          },
          {
            type: 'mcq',
            title: 'ML Fundamentals Quiz',
            content: 'Test your ML knowledge...'
          }
        ]
      },
      {
        title: 'Database Management Systems',
        instructor: 'John Doe',
        instructorId: users[2]._id.toString(),
        price: 129,
        description: 'SQL and NoSQL databases explained',
        materials: [
          {
            type: 'video',
            title: 'SQL Basics',
            url: 'https://example.com/videos/sql-basics.mp4',
            content: 'Introduction to SQL databases'
          },
          {
            type: 'text',
            title: 'Database Design',
            content: 'Learn about normalization, relationships, and schema design...'
          },
          {
            type: 'mcq',
            title: 'SQL Quiz',
            content: 'Test your SQL knowledge...'
          }
        ]
      },
      {
        title: 'Cloud Computing Essentials',
        instructor: 'Jane Smith',
        instructorId: users[3]._id.toString(),
        price: 179,
        description: 'Learn AWS, Azure, and cloud architecture',
        materials: [
          {
            type: 'video',
            title: 'Cloud Introduction',
            url: 'https://example.com/videos/cloud-intro.mp4',
            content: 'Introduction to cloud computing'
          },
          {
            type: 'text',
            title: 'AWS Services Overview',
            content: 'Learn about EC2, S3, RDS, Lambda and more...'
          },
          {
            type: 'mcq',
            title: 'Cloud Concepts Quiz',
            content: 'Test your cloud computing knowledge...'
          }
        ]
      }
    ]);
    console.log(`✅ Created ${courses.length} courses`);

    // Summary
    console.log('\n📊 Seed Summary:');
    console.log('─────────────────────────────────────');
    console.log(`👥 Users Created: ${users.length}`);
    console.log('   - Learners: 2 (alice@example.com, bob@example.com)');
    console.log('   - Instructors: 3 (john@example.com, jane@example.com, bob.j@example.com)');
    console.log('   - Admin: 1 (admin@lms.com)');
    console.log(`💰 Bank Accounts: ${bankAccounts.length}`);
    console.log(`📚 Courses: ${courses.length}`);
    console.log('─────────────────────────────────────');
    
    console.log('\n🔑 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Learner:    alice@example.com / pass123');
    console.log('Learner:    bob@example.com / pass123');
    console.log('Instructor: john@example.com / pass123');
    console.log('Instructor: jane@example.com / pass123');
    console.log('Instructor: bob.j@example.com / pass123');
    console.log('Admin:      admin@lms.com / admin123');
    console.log('─────────────────────────────────────');

    console.log('\n✅ Database seeded successfully!');
    console.log('🚀 You can now start your server with: npm run dev\n');

    // Close connection
    await mongoose.connection.close();
    console.log('📪 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
