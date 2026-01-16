// ==================== NEW server.js ====================
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Initialize database and seed data
const initializeData = async () => {
  const User = require('./models/User');
  const Course = require('./models/Course');
  const BankAccount = require('./models/BankAccount');
  
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📊 Database already initialized');
      return;
    }

    console.log('🌱 Seeding initial data...');

    const users = await User.insertMany([
      { email: 'alice@example.com', password: 'pass123', name: 'Alice Learner', type: 'learner' },
      { email: 'bob@example.com', password: 'pass123', name: 'Bob Student', type: 'learner' },
      { email: 'john@example.com', password: 'pass123', name: 'John Doe', type: 'instructor', accountNumber: 'ACC001', bankSecret: 'secret1' },
      { email: 'jane@example.com', password: 'pass123', name: 'Jane Smith', type: 'instructor', accountNumber: 'ACC002', bankSecret: 'secret2' },
      { email: 'bob.j@example.com', password: 'pass123', name: 'Bob Johnson', type: 'instructor', accountNumber: 'ACC003', bankSecret: 'secret3' },
      { email: 'admin@lms.com', password: 'admin123', name: 'Admin User', type: 'admin', accountNumber: 'ACC_LMS', bankSecret: 'lms_secret' }
    ]);

    await BankAccount.insertMany([
      { accountNumber: 'ACC001', owner: users[2]._id.toString(), balance: 500 },
      { accountNumber: 'ACC002', owner: users[3]._id.toString(), balance: 500 },
      { accountNumber: 'ACC003', owner: users[4]._id.toString(), balance: 500 },
      { accountNumber: 'ACC_LMS', owner: users[5]._id.toString(), balance: 10000 }
    ]);

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
          { type: 'video', title: 'ML Overview', url: 'video3.mp4' }
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

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await initializeData();
    
    app.listen(PORT, () => {
      console.log(`🚀 LMS Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


// ==================== MIGRATION GUIDE ====================
/*
STEP-BY-STEP MIGRATION TO MODULAR STRUCTURE

1. BACKUP CURRENT server.js
   cp server.js server.old.js

2. CREATE FOLDER STRUCTURE
   mkdir -p src/{config,controllers,services,routes,middleware,utils}

3. INSTALL NEW DEPENDENCIES
   npm install morgan helmet compression express-validator

4. COPY FILES FROM ARTIFACTS:
   
   Config:
   - src/config/database.js
   - src/config/constants.js
   
   Utils:
   - src/utils/generators.js
   - src/utils/helpers.js
   
   Services:
   - src/services/authService.js
   - src/services/bankService.js
   - src/services/courseService.js
   - src/services/enrollmentService.js
   - src/services/transactionService.js
   
   Controllers:
   - src/controllers/authController.js
   - src/controllers/bankController.js
   - src/controllers/courseController.js
   - src/controllers/enrollmentController.js
   
   Routes:
   - src/routes/index.js
   - src/routes/authRoutes.js
   - src/routes/bankRoutes.js
   - src/routes/courseRoutes.js
   - src/routes/enrollmentRoutes.js
   
   Middleware:
   - src/middleware/errorHandler.js
   - src/middleware/logger.js
   
   App:
   - src/app.js

5. REPLACE server.js
   Replace your server.js with the NEW server.js above

6. UPDATE PACKAGE.JSON SCRIPTS
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js",
     "seed": "node seed.js"
   }

7. TEST THE SERVER
   npm run dev
   
   Should see:
   ✅ MongoDB Connected
   🌱 Seeding initial data...
   ✅ Initial data seeded successfully
   🚀 LMS Server running on http://localhost:3000

8. TEST API ENDPOINTS
   # Health check
   curl http://localhost:3000/api/health
   
   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"pass123","type":"learner"}'
   
   # Get courses
   curl http://localhost:3000/api/courses

9. VERIFY FRONTEND STILL WORKS
   - Frontend should work without any changes
   - All API endpoints remain the same
   - Only internal structure changed

10. OPTIONAL: ADD MORE FEATURES
    - Authentication middleware
    - Input validation
    - Rate limiting
    - API documentation (Swagger)

BENEFITS OF NEW STRUCTURE:
✅ Clean separation of concerns
✅ Easy to test individual components
✅ Scalable architecture
✅ Professional code organization
✅ Easy to add new features
✅ Better error handling
✅ Consistent code structure

TROUBLESHOOTING:
- If routes not found: Check route mounting in src/routes/index.js
- If errors occur: Check error middleware in src/middleware/errorHandler.js
- If DB not connecting: Check src/config/database.js
- If imports fail: Ensure correct relative paths (../)

YOUR CURRENT server.js WILL STILL WORK!
This is a complete refactor but maintains all functionality.
The frontend doesn't need any changes - all API endpoints stay the same!
*/
