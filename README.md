# 🎓 Learning Management System (LMS) - Complete Technical Documentation

A full-stack Learning Management System with integrated banking, built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Models Explained](#database-models-explained)
6. [Business Logic Flow](#business-logic-flow)
7. [Complete Setup Guide](#complete-setup-guide)
8. [API Reference](#api-reference)
9. [State Management](#state-management)
10. [Security & Validation](#security--validation)

---

## 1. System Overview

### 1.1 What Does This System Do?

This LMS simulates a complete learning platform ecosystem with three main actors:

**🎓 Learners** can:
- Create accounts and set up secure bank accounts
- Browse available courses
- Purchase courses using their balance
- Access course materials (videos, text, audio, quizzes)
- Track their learning progress
- Earn certificates upon completion

**👨‍🏫 Instructors** can:
- Upload courses with multiple material types
- Earn $200 instantly when uploading a course
- Receive 70% of course price when students enroll
- Edit and manage their course materials
- Track their earnings

**⚙️ Admin (LMS Platform)** can:
- Monitor all transactions
- View platform statistics
- Manage overall system health
- Retain 30% of all enrollment fees

### 1.2 Why This Architecture?

This project demonstrates:
- RESTful API design principles
- Database relationships and data modeling
- Transaction processing and state management
- Real-time balance updates
- Secure payment flow simulation
- Multi-user role-based access

---

## 2. Architecture Deep Dive

### 2.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│                      (React Frontend)                    │
│                                                          │
│  User Interface, State Management, Client-Side Logic    │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│                  (Node.js + Express Backend)             │
│                                                          │
│  API Routes, Business Logic, Validation, Controllers    │
└─────────────────────────────────────────────────────────┘
                         ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
│                    (MongoDB Database)                    │
│                                                          │
│  Users, Courses, Enrollments, Transactions, etc.        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Request-Response Cycle

Let's trace what happens when a learner enrolls in a course:

```
1. USER ACTION
   Learner clicks "Enroll Now" on "Web Development" course ($99)
   ↓
   
2. FRONTEND (React)
   - CourseCard.jsx captures the click event
   - Calls onEnroll() function passed from LearnerDashboard
   - LearnerDashboard calls enrollCourse() from api.js
   - api.js makes HTTP POST to /api/enrollments
   
   POST /api/enrollments
   Body: {
     learnerId: "507f1f77bcf86cd799439011",
     courseId: "507f1f77bcf86cd799439012",
     bankSecret: "secret123"
   }
   ↓
   
3. BACKEND (Express Route)
   - Request hits server.js
   - CORS middleware allows the request
   - body-parser parses JSON
   - Routes to: POST /api/enrollments handler
   ↓
   
4. BACKEND (Business Logic)
   a) Find learner in Users collection
   b) Find course in Courses collection
   c) Check if already enrolled (query Enrollments collection)
   d) Validate bank secret matches user's stored secret
   e) Get learner's bank account
   f) Check if balance >= course price ($99)
   
   If insufficient funds → return 400 error
   If valid → continue
   ↓
   
5. TRANSACTION PROCESSING
   a) Deduct $99 from learner's bank account
      LearnerAccount.balance: $1000 → $901
      
   b) Add $99 to LMS admin account
      LMSAccount.balance: $10000 → $10099
      
   c) Save both accounts to database
   
   d) Create transaction record:
      {
        transactionId: "TXN1705401234567",
        from: "learner_id",
        to: "admin_id",
        amount: 99,
        description: "Enrollment in Web Development"
      }
   ↓
   
6. ENROLLMENT CREATION
   Create new enrollment:
   {
     learnerId: "507f1f77bcf86cd799439011",
     courseId: "507f1f77bcf86cd799439012",
     completed: false,
     progress: 0,
     createdAt: new Date()
   }
   ↓
   
7. INSTRUCTOR PAYMENT (Revenue Share)
   a) Calculate 70% of $99 = $69.30
   b) Deduct $69.30 from LMS account
      LMSAccount.balance: $10099 → $10029.70
   c) Add $69.30 to instructor's account
      InstructorAccount.balance: $500 → $569.30
   d) Create transaction record for instructor payment
   ↓
   
8. RESPONSE SENT
   Backend sends JSON response:
   {
     success: true,
     enrollment: {...},
     transaction: {...},
     newBalance: 901
   }
   ↓
   
9. FRONTEND UPDATES
   - LearnerDashboard receives response
   - Updates local state: setEnrolledCourses([...courses, newCourseId])
   - Updates balance: onBalanceUpdate(901)
   - Shows success message
   - CourseCard re-renders showing "Enrolled" status
   - "Enroll Now" button changes to "Start Learning"
```

### 2.3 Data Flow Diagram

```
┌──────────┐      ┌──────────┐      ┌───────────┐      ┌──────────┐
│ Learner  │─────▶│   LMS    │─────▶│Instructor│      │ Database │
│ Account  │      │ Account  │      │ Account  │      │          │
└──────────┘      └──────────┘      └───────────┘      └──────────┘
    -$99             +$99              +$69.30              ▲
                     -$69.30                                │
                     ────────                                │
                     Net: +$29.70                           │
                     (30% platform fee)                     │
                                                            │
                     All changes saved here ────────────────┘
```

---

## 3. Backend Architecture

### 3.1 Server.js - The Heart of the Backend

**Location:** `backend/server.js`

This single file contains our entire backend. Here's how it's organized:

```javascript
// ============= SECTION 1: IMPORTS & SETUP =============
require('dotenv').config();           // Load environment variables
const express = require('express');    // Web framework
const cors = require('cors');          // Allow cross-origin requests
const mongoose = require('mongoose');  // MongoDB ODM

// ============= SECTION 2: MODEL IMPORTS =============
const User = require('./models/User');
const Course = require('./models/Course');
// ... (all 7 models)

// ============= SECTION 3: EXPRESS APP CONFIG =============
const app = express();
app.use(cors());                       // Enable CORS
app.use(bodyParser.json());            // Parse JSON bodies

// ============= SECTION 4: DATABASE CONNECTION =============
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    initializeData();                  // Seed if needed
  });

// ============= SECTION 5: UTILITY FUNCTIONS =============
const generateTransactionId = () => { ... }
const generateCertificateId = () => { ... }

// ============= SECTION 6: API ENDPOINTS =============

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  // Login logic
});

// Bank Routes
app.post('/api/bank/setup', async (req, res) => {
  // Bank setup logic
});

// Course Routes
app.get('/api/courses', async (req, res) => {
  // Get all courses
});

// Enrollment Routes
app.post('/api/enrollments', async (req, res) => {
  // Complex enrollment logic with transactions
});

// ... (25+ endpoints total)

// ============= SECTION 7: SERVER START =============
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3.2 Why This Structure?

**Advantages:**
- ✅ Simple to understand - everything in one place
- ✅ Easy to debug - no jumping between files
- ✅ Quick to develop - no file organization overhead
- ✅ Perfect for small-medium projects

**When to Refactor:**
- ❌ When file exceeds 1000 lines
- ❌ When multiple developers work on it
- ❌ When you need to reuse business logic

### 3.3 How Endpoints Work

Each endpoint follows this pattern:

```javascript
app.post('/api/enrollments', async (req, res) => {
  try {
    // 1. EXTRACT DATA from request
    const { learnerId, courseId, bankSecret } = req.body;
    
    // 2. VALIDATE INPUT
    if (!learnerId || !courseId || !bankSecret) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    // 3. FETCH FROM DATABASE
    const learner = await User.findById(learnerId);
    const course = await Course.findById(courseId);
    
    // 4. BUSINESS LOGIC
    if (learner.bankSecret !== bankSecret) {
      return res.status(401).json({ error: 'Invalid secret' });
    }
    
    // 5. DATABASE OPERATIONS
    await BankAccount.updateOne(
      { owner: learnerId },
      { $inc: { balance: -course.price } }
    );
    
    const enrollment = await Enrollment.create({
      learnerId,
      courseId,
      completed: false
    });
    
    // 6. SEND RESPONSE
    res.json({
      success: true,
      enrollment,
      newBalance: updatedBalance
    });
    
  } catch (error) {
    // 7. ERROR HANDLING
    res.status(500).json({ error: error.message });
  }
});
```

---

## 4. Frontend Architecture

### 4.1 React Component Hierarchy

```
App.jsx (Root Component)
│
├─ Login.jsx
│
├─ BankSetup.jsx
│
├─ LearnerDashboard.jsx
│  │
│  ├─ Navbar.jsx
│  ├─ MessageAlert.jsx
│  ├─ CourseCard.jsx (multiple instances)
│  └─ CourseViewer.jsx (modal)
│     └─ Shows course materials
│
├─ InstructorDashboard.jsx
│  │
│  ├─ Navbar.jsx
│  ├─ MessageAlert.jsx
│  ├─ MaterialUpload.jsx
│  ├─ CourseCard.jsx (multiple instances)
│  └─ CourseEditor.jsx (modal)
│
└─ AdminDashboard.jsx
   │
   ├─ Navbar.jsx
   └─ MessageAlert.jsx
```

### 4.2 State Management Flow

**App.jsx - The State Container**

```javascript
function App() {
  // ======= GLOBAL STATE =======
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [balance, setBalance] = useState(null);
  const [bankSecret, setBankSecret] = useState('');
  
  // ======= WHY THESE STATES? =======
  
  // currentUser: Stores logged-in user info
  // - Used to identify user across all components
  // - Contains: id, name, email, type
  
  // view: Controls which page to show
  // - Values: 'login' | 'bankSetup' | 'learnerDashboard' | 
  //           'instructorDashboard' | 'adminDashboard'
  
  // balance: User's current bank balance
  // - Updated after every transaction
  // - Displayed in Navbar
  
  // bankSecret: Learner's bank PIN
  // - Needed for all payment operations
  // - Stored only in memory (not localStorage)
  
  // ======= STATE FLOW =======
  
  // Login Success →
  const handleLoginSuccess = async (user, type) => {
    setCurrentUser(user);              // Store user
    if (user.bankSecret) {
      setBankSecret(user.bankSecret);  // Load secret if exists
    }
    await loadBalance(user.id);        // Fetch balance from backend
    setView(type + 'Dashboard');       // Navigate to dashboard
  };
  
  // Balance Update →
  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);            // Update after transaction
  };
  
  // Logout →
  const handleLogout = () => {
    setCurrentUser(null);              // Clear user
    setBalance(null);                  // Clear balance
    setBankSecret('');                 // Clear secret
    setView('login');                  // Back to login
  };
  
  return (
    <div>
      {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {view === 'learnerDashboard' && (
        <LearnerDashboard
          currentUser={currentUser}
          balance={balance}
          bankSecret={bankSecret}
          onBalanceUpdate={handleBalanceUpdate}
          onLogout={handleLogout}
        />
      )}
      {/* Other views... */}
    </div>
  );
}
```

### 4.3 Component Communication

**Example: How CourseCard Talks to LearnerDashboard**

```javascript
// LearnerDashboard.jsx (Parent)
function LearnerDashboard({ currentUser, balance, bankSecret, onBalanceUpdate }) {
  const [courses, setCourses] = useState([]);
  
  // This function will be passed to CourseCard
  const handleEnrollCourse = async (course) => {
    try {
      // Call API
      const response = await enrollCourse(
        currentUser.id,
        course.id,
        bankSecret
      );
      
      // Update parent state
      onBalanceUpdate(response.newBalance);
      
      // Update local state
      setEnrolledCourses([...enrolledCourses, course.id]);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={handleEnrollCourse}  // Pass function down
        />
      ))}
    </div>
  );
}

// CourseCard.jsx (Child)
function CourseCard({ course, onEnroll }) {
  return (
    <div>
      <h3>{course.title}</h3>
      <p>${course.price}</p>
      <button onClick={() => onEnroll(course)}>  {/* Call parent function */}
        Enroll Now
      </button>
    </div>
  );
}
```

**Data Flow:**
```
User clicks button in CourseCard
  ↓
Calls onEnroll(course) - goes UP to parent
  ↓
LearnerDashboard.handleEnrollCourse() executes
  ↓
Makes API call to backend
  ↓
Receives response
  ↓
Updates balance (goes UP to App.jsx via onBalanceUpdate)
  ↓
Updates enrolledCourses (local state)
  ↓
Re-render triggered
  ↓
CourseCard receives new props
  ↓
Shows "Enrolled" status
```

### 4.4 API Service Layer

**Location:** `frontend/src/services/api.js`

This file centralizes all backend communication:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ======= WHY THIS PATTERN? =======

// 1. CENTRALIZED: All API calls in one place
// 2. REUSABLE: Import anywhere you need
// 3. MAINTAINABLE: Change URL once, affects everywhere
// 4. TESTABLE: Easy to mock for testing

// Example function:
export const enrollCourse = async (learnerId, courseId, bankSecret) => {
  try {
    const response = await api.post('/enrollments', {
      learnerId,
      courseId,
      bankSecret
    });
    return response.data;  // Return only the data
  } catch (error) {
    // Standardize error handling
    throw error.response?.data || { error: 'Enrollment failed' };
  }
};
```

**Usage in Components:**

```javascript
import { enrollCourse } from '../services/api';

// In component:
const handleEnroll = async () => {
  try {
    const result = await enrollCourse(userId, courseId, secret);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.error);
  }
};
```

---

## 5. Database Models Explained

### 5.1 User Model - The Identity Foundation

**File:** `backend/models/User.js`

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,      // Must provide email
    unique: true,        // No duplicate emails
    lowercase: true,     // Auto-convert to lowercase
    trim: true          // Remove whitespace
  },
  password: {
    type: String,
    required: true
    // In production: Hash with bcrypt!
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['learner', 'instructor', 'admin'],  // Only these values allowed
    required: true
  },
  accountNumber: {
    type: String,
    default: null        // Set when user sets up bank
  },
  bankSecret: {
    type: String,
    default: null        // User's bank PIN
  }
}, {
  timestamps: true       // Auto-add createdAt, updatedAt
});
```

**Real-World Example:**

```javascript
// When learner logs in:
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "alice@example.com",
  password: "pass123",           // Should be hashed!
  name: "Alice Learner",
  type: "learner",
  accountNumber: "ACC_ALICE_001",
  bankSecret: "secret123",
  createdAt: ISODate("2026-01-01T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-16T14:30:00.000Z")
}
```

**Why These Fields?**

- **email**: Unique identifier for login
- **type**: Determines what features user can access
- **accountNumber**: Links to BankAccount collection
- **bankSecret**: Validates payment transactions (like a PIN)

### 5.2 Course Model - The Learning Content

**File:** `backend/models/Course.js`

```javascript
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0              // Can't be negative
  },
  instructor: {
    type: String,       // Instructor's name
    required: true
  },
  instructorId: {
    type: String,       // Reference to User._id
    required: true      // For queries like "show instructor's courses"
  },
  materials: [{         // Array of learning materials
    type: {
      type: String,
      enum: ['video', 'text', 'audio', 'mcq']
    },
    title: String,      // e.g., "Introduction to React"
    content: String,    // Actual text content or quiz questions
    url: String         // Link to video/audio file
  }]
}, {
  timestamps: true
});
```

**Real-World Example:**

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  title: "Web Development Fundamentals",
  description: "Learn HTML, CSS, and JavaScript basics",
  price: 99,
  instructor: "John Doe",
  instructorId: "507f1f77bcf86cd799439013",
  materials: [
    {
      type: "video",
      title: "Introduction to HTML",
      url: "https://example.com/videos/html-intro.mp4",
      content: null
    },
    {
      type: "text",
      title: "CSS Basics",
      content: "CSS stands for Cascading Style Sheets...",
      url: null
    },
    {
      type: "mcq",
      title: "JavaScript Quiz",
      content: "Q1: What is a variable? A) ..., B) ...",
      url: null
    }
  ],
  createdAt: ISODate("2026-01-10T09:00:00.000Z")
}
```

**Why This Structure?**

- **materials array**: One course has many materials
- **type field**: Frontend renders differently based on type
- **instructorId**: Easy to query "all courses by this instructor"
- **Embedded materials**: Fast retrieval (no joins needed)

### 5.3 Enrollment Model - The Learning Record

**File:** `backend/models/Enrollment.js`

```javascript
const enrollmentSchema = new mongoose.Schema({
  learnerId: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',      // Reference to Course model
    required: true
  },
  completed: {
    type: Boolean,
    default: false      // Changes to true when course finished
  },
  progress: {
    type: Number,
    default: 0,         // 0-100 percentage
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date,
    default: null       // Set when completed = true
  }
}, {
  timestamps: true
});
```

**Real-World Example:**

```javascript
// Alice enrolls in Web Development course
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  learnerId: "507f1f77bcf86cd799439011",
  courseId: ObjectId("507f1f77bcf86cd799439012"),
  completed: false,
  progress: 45,              // 45% complete
  completedAt: null,
  createdAt: ISODate("2026-01-15T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-16T15:00:00.000Z")
}

// When Alice finishes:
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  learnerId: "507f1f77bcf86cd799439011",
  courseId: ObjectId("507f1f77bcf86cd799439012"),
  completed: true,           // Changed!
  progress: 100,             // Changed!
  completedAt: ISODate("2026-01-20T18:30:00.000Z"),  // Set!
  createdAt: ISODate("2026-01-15T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-20T18:30:00.000Z")     // Updated!
}
```

**Why This Model?**

- **Tracks relationship**: Which learner is in which course
- **Progress tracking**: Can show "45% complete"
- **Completion status**: Trigger certificate generation
- **Timestamps**: Know when enrolled and completed

### 5.4 Transaction Model - The Financial Record

**File:** `backend/models/Transaction.js`

```javascript
const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true         // Prevent duplicates
  },
  from: {
    type: String,        // User ID who pays
    required: true
  },
  to: {
    type: String,        // User ID who receives
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true       // What was this for?
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true       // createdAt is the transaction time
});
```

**Real-World Example - Course Enrollment:**

```javascript
// Transaction 1: Learner pays LMS
{
  _id: ObjectId("..."),
  transactionId: "TXN1705401234567",
  from: "507f1f77bcf86cd799439011",  // Alice
  to: "admin_id",                     // LMS
  amount: 99,
  description: "Enrollment in Web Development Fundamentals",
  status: "completed",
  createdAt: ISODate("2026-01-16T14:30:00.000Z")
}

// Transaction 2: LMS pays instructor (happens automatically)
{
  _id: ObjectId("..."),
  transactionId: "TXN1705401234568",
  from: "admin_id",                   // LMS
  to: "507f1f77bcf86cd799439013",    // John (instructor)
  amount: 69.30,                      // 70% of $99
  description: "Revenue share for Web Development Fundamentals enrollment",
  status: "completed",
  createdAt: ISODate("2026-01-16T14:30:01.000Z")  // 1 second later
}
```

**Why This Matters?**

- **Audit trail**: Complete history of all money movements
- **Reconciliation**: Check if amounts match
- **Transparency**: Admin can see all transactions
- **Debugging**: If balance is wrong, check transactions

### 5.5 BankAccount Model - The Wallet

**File:** `backend/models/BankAccount.js`

```javascript
const bankAccountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: String,        // User ID
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0              // Can't go negative
  }
}, {
  timestamps: true
});
```

**Real-World Example:**

```javascript
// Alice's bank account
{
  _id: ObjectId("..."),
  accountNumber: "ACC_ALICE_001",
  owner: "507f1f77bcf86cd799439011",
  balance: 1000,
  createdAt: ISODate("2026-01-15T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-16T14:30:00.000Z")
}

// After buying $99 course:
{
  _id: ObjectId("..."),
  accountNumber: "ACC_ALICE_001",
  owner: "507f1f77bcf86cd799439011",
  balance: 901,        // Updated!
  createdAt: ISODate("2026-01-15T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-16T14:30:01.000Z")  // Updated!
}
```

### 5.6 Progress Model - The Learning Tracker

**File:** `backend/models/Progress.js`

```javascript
const progressSchema = new mongoose.Schema({
  learnerId: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedMaterials: [{
    type: Number        // Array of material indices
  }],
  lastAccessedMaterial: {
    type: Number,
    default: 0          // Index of last viewed material
  }
}, {
  timestamps: true
});

// Unique constraint: One progress record per learner per course
progressSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });
```

**Real-World Example:**

```javascript
// Course has 5 materials (indices 0, 1, 2, 3, 4)
// Alice completes materials 0, 1, and 3

{
  _id: ObjectId("..."),
  learnerId: "507f1f77bcf86cd799439011",
  courseId: ObjectId("507f1f77bcf86cd799439012"),
  completedMaterials: [0, 1, 3],     // Completed these
  lastAccessedMaterial: 3,            // Currently viewing this
  createdAt: ISODate("2026-01-16T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-16T15:00:00.000Z")
}

// When Alice marks material 2 complete:
{
  _id: ObjectId("..."),
  learnerId: "507f1f77bcf86cd799439011",
  courseId: ObjectId("507f1f77bcf86cd799439012"),
  completedMaterials: [0, 1, 2, 3],  // Added 2!
  lastAccessedMaterial: 2,            // Updated!
  updatedAt: ISODate("2026-01-16T15:30:00.000Z")  // Updated!
}
```

**How Frontend Uses This:**

```javascript
// CourseViewer.jsx
const materials = course.materials;  // 5 materials total
const completed = [0, 1, 3];         // From Progress model

// Show progress bar
const progress = (completed.length / materials.length) * 100;  // 60%

// Show checkmarks
materials.map((material, index) => (
  <div>
    {completed.includes(index) && <CheckIcon />}
    {material.title}
  </div>
));
```

### 5.7 Certificate Model - The Achievement

**File:** `backend/models/Certificate.js`

```javascript
const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true         // Each certificate is unique
  },
  learnerId: {
    type: String,<function_calls>
    <invoke name="artifacts">
    <parameter name="command">update</parameter>
    <parameter name="id">complete_readme</parameter>
    <parameter name="old_str">### 5.7 Certificate Model - The Achievement
    
    **File:** `backend/models/Certificate.js`
    
    ```javascript
    const certificateSchema = new mongoose.Schema({
      certificateId: {
        type: String,
        required: true,
        unique: true         // Each certificate is unique
      },
      learnerId: {
        type: String,</parameter>
    <parameter name="new_str">### 5.7 Certificate Model - The Achievement
    
    **File:** `backend/models/Certificate.js`
    
    ```javascript
    const certificateSchema = new mongoose.Schema({
      certificateId: {
        type: String,
        required: true,
        unique: true         // Each certificate is unique
      },
      learnerId: {
        type: String,
        required: true
      },
      learnerName: {
        type: String,
        required: true       // Printed on certificate
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      },
      courseTitle: {
        type: String,
        required: true       // Printed on certificate
      },
      instructor: {
        type: String,
        required: true       // Printed on certificate
      }
    }, {
      timestamps: true       // createdAt = issue date
    });
    ```
    
    **Real-World Example:**
    
    ```javascript
    {
      _id: ObjectId("..."),
      certificateId: "CERT1705401234567",
      learnerId: "507f1f77bcf86cd799439011",
      learnerName: "Alice Learner",
      courseId: ObjectId("507f1f77bcf86cd799439012"),
      courseTitle: "Web Development Fundamentals",
      instructor: "John Doe",
      createdAt: ISODate("2026-01-20T18:30:00.000Z")  // Issue date
    }
    ```
    
    ---
    
    ## 6. Business Logic Flow
    
    ### 6.1 Complete Enrollment Flow (Line by Line)
    
    ```javascript
    // POST /api/enrollments
    app.post('/api/enrollments', async (req, res) => {
      try {
        // ===== STEP 1: EXTRACT REQUEST DATA =====
        const { learnerId, courseId, bankSecret } = req.body;
        
        // ===== STEP 2: FETCH ENTITIES FROM DATABASE =====
        const learner = await User.findById(learnerId);
        // SQL equivalent: SELECT * FROM users WHERE _id = learnerId
        
        const course = await Course.findById(courseId);
        // SQL equivalent: SELECT * FROM courses WHERE _id = courseId
        
        // ===== STEP 3: VALIDATION CHECKS =====
        if (!learner || !course) {
          return res.status(404).json({ error: 'Not found' });
        }
        
        // Check duplicate enrollment
        const existing = await Enrollment.findOne({ learnerId, courseId });
        // SQL equivalent: 
        // SELECT * FROM enrollments 
        // WHERE learnerId = ? AND courseId = ?
        
        if (existing) {
          return res.status(400).json({ error: 'Already enrolled' });
        }
        
        // Verify bank secret (like entering PIN at ATM)
        if (learner.bankSecret !== bankSecret) {
          return res.status(401).json({ error: 'Invalid secret' });
        }
        
        // ===== STEP 4: GET BANK ACCOUNTS =====
        const learnerAccount = await BankAccount.findOne({ 
          accountNumber: learner.accountNumber 
        });
        
        const lmsUser = await User.findOne({ type: 'admin' });
        const lmsAccount = await BankAccount.findOne({ 
          accountNumber: lmsUser.accountNumber 
        });
        
        // ===== STEP 5: CHECK SUFFICIENT BALANCE =====
        if (learnerAccount.balance < course.price) {
          return res.status(400).json({ error: 'Insufficient funds' });
        }
        
        // ===== STEP 6: PROCESS PAYMENT (ATOMIC OPERATION) =====
        // Deduct from learner
        learnerAccount.balance -= course.price;
        await learnerAccount.save();
        
        // Add to LMS
        lmsAccount.balance += course.price;
        await lmsAccount.save();
        
        // ===== STEP 7: CREATE TRANSACTION RECORD =====
        const transaction = await Transaction.create({
          transactionId: generateTransactionId(),
          from: learnerId,
          to: lmsUser._id.toString(),
          amount: course.price,
          description: `Enrollment in ${course.title}`,
          status: 'completed'
        });
        
        // ===== STEP 8: CREATE ENROLLMENT =====
        const enrollment = await Enrollment.create({
          learnerId,
          courseId,
          completed: false,
          progress: 0
        });
        
        // ===== STEP 9: PAY INSTRUCTOR (70% REVENUE SHARE) =====
        const instructorPayment = course.price * 0.7;
        
        const instructorAccount = await BankAccount.findOne({ 
          owner: course.instructorId 
        });
        
        // Transfer from LMS to instructor
        lmsAccount.balance -= instructorPayment;
        await lmsAccount.save();
        
        instructorAccount.balance += instructorPayment;
        await instructorAccount.save();
        
        // Record instructor transaction
        await Transaction.create({
          transactionId: generateTransactionId(),
          from: lmsUser._id.toString(),
          to: course.instructorId,
          amount: instructorPayment,
          description: `Revenue share for ${course.title}`,
          status: 'completed'
        });
        
        // ===== STEP 10: SEND SUCCESS RESPONSE =====
        res.json({
          success: true,
          enrollment,
          transaction,
          newBalance: learnerAccount.balance
        });
        
      } catch (error) {
        // ===== STEP 11: ERROR HANDLING =====
        console.error('Enrollment error:', error);
        res.status(500).json({ error: error.message });
      }
    });
    ```
    
    **What Just Happened?**
    
    1. Learner pays $99
    2. Learner's balance: $1000 → $901
    3. LMS receives $99: $10000 → $10099
    4. LMS pays instructor $69.30 (70%): $10099 → $10029.70
    5. Instructor receives $69.30: $500 → $569.30
    6. LMS keeps $29.70 (30% platform fee)
    7. Two transactions recorded
    8. Enrollment created
    9. Frontend gets updated balance
    
    ---
    
    ## 7. Complete Setup Guide
    
    ### 7.1 Prerequisites Check
    
    ```bash
    # Check Node.js version (need v14+)
    node --version
    
    # Check npm
    npm --version
    
    # Check if MongoDB is accessible (if using local)
    mongosh --version
    ```
    
    ### 7.2 MongoDB Setup (Detailed)
    
    **Option A: MongoDB Atlas (Cloud)**
    
    1. **Create Account**
       - Go to https://www.mongodb.com/cloud/atlas
       - Sign up (free tier available)
       
    2. **Create Cluster**
       - Click "Build a Database"
       - Choose FREE "Shared" option
       - Select cloud provider (AWS recommended)
       - Choose region closest to you
       - Click "Create Cluster" (takes 3-5 minutes)
    
    3. **Create Database User**
       - Click "Database Access" (left sidebar)
       - Click "Add New Database User"
       - Authentication Method: Password
       - Username: `lmsuser`
       - Password: `lmspass123` (or auto-generate)
       - Database User Privileges: "Atlas admin"
       - Click "Add User"
    
    4. **Allow Network Access**
       - Click "Network Access" (left sidebar)
       - Click "Add IP Address"
       - Click "Allow Access from Anywhere" (0.0.0.0/0)
       - Note: In production, use specific IPs only
       - Click "Confirm"
    
    5. **Get Connection String**
       - Click "Database" (left sidebar)
       - Click "Connect" on your cluster
       - Click "Connect your application"
       - Driver: Node.js, Version: 4.1 or later
       - Copy connection string:
       ```
       mongodb+srv://lmsuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
       ```
       - Replace `<password>` with actual password
       - Add database name: `...mongodb.net/lms?retryWrites...`
    
    **Option B: Local MongoDB**
    
    ```bash
    # macOS
    brew tap mongodb/brew
    brew install mongodb-community@6.0
    brew services start mongodb-community@6.0
    
    # Ubuntu/Debian
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    
    # Windows
    # Download installer from mongodb.com
    # Run installer, choose "Complete"
    # Check "Install MongoD as a Service"
    ```
    
    Connection string: `mongodb://localhost:27017/lms`
    
    ### 7.3 Backend Setup (Step by Step)
    
    ```bash
    # 1. Create project directory
    mkdir lms-project
    cd lms-project
    
    # 2. Create backend folder
    mkdir backend
    cd backend
    
    # 3. Initialize npm
    npm init -y
    
    # 4. Install dependencies
    npm install express mongoose cors body-parser dotenv
    
    # 5. Install dev dependencies
    npm install --save-dev nodemon
    
    # 6. Create directory structure
    mkdir models
    
    # 7. Create .env file
    cat > .env << 'EOF'
    PORT=3000
    MONGODB_URI=mongodb+srv://lmsuser:lmspass123@cluster0.xxxxx.mongodb.net/lms?retryWrites=true&w=majority
    EOF
    
    # Replace with your actual MongoDB URI!
    
    # 8. Update package.json scripts
    # Edit package.json and add:
    {
      "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "seed": "node seed.js"
      }
    }
    
    # 9. Create all model files in models/ folder
    # Copy each model from the documentation above
    
    # 10. Create server.js
    # Copy the complete server.js code
    
    # 11. Create seed.js (optional)
    # Copy the seed script
    
    # 12. Test database connection
    npm run dev
    
    # Should see:
    # ✅ MongoDB Connected Successfully
    # 🚀 LMS Server running on http://localhost:3000
    ```
    
    ### 7.4 Frontend Setup (Step by Step)
    
    ```bash
    # 1. Open NEW terminal (keep backend running)
    cd ..  # Go back to lms-project directory
    
    # 2. Create React app
    npx create-react-app frontend
    cd frontend
    
    # 3. Install dependencies
    npm install axios lucide-react
    
    # 4. Install Tailwind CSS
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    
    # 5. Configure Tailwind
    # Edit tailwind.config.js:
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    
    # 6. Update src/index.css:
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    # 7. Create folder structure
    cd src
    mkdir components services
    
    # 8. Create all component files
    # Copy each component from documentation
    
    # 9. Create API service
    # Copy api.js into services/
    
    # 10. Update App.jsx and index.js
    # Copy from documentation
    
    # 11. Start frontend
    npm start
    
    # Should open browser at http://localhost:3001
    ```
    
    ### 7.5 Verification Tests
    
    ```bash
    # Test 1: Backend Health
    curl http://localhost:3000/api/health
    # Should return: {"status":"OK","timestamp":"..."}
    
    # Test 2: Get Courses
    curl http://localhost:3000/api/courses
    # Should return JSON array of 5 courses
    
    # Test 3: Login
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"alice@example.com","password":"pass123","type":"learner"}'
    # Should return user object
    
    # Test 4: Frontend loads
    # Open http://localhost:3001
    # Should see login page
    ```
    
    ---
    
    ## 8. API Reference
    
    ### Complete Endpoint List
    
    | Method | Endpoint | Description | Auth Required |
    |--------|----------|-------------|---------------|
    | POST | /api/auth/login | User login | No |
    | POST | /api/auth/register | Register new user | No |
    | POST | /api/bank/setup | Setup bank account | No |
    | GET | /api/bank/balance/:userId | Get balance | No |
    | POST | /api/bank/transaction | Create transaction | Yes |
    | GET | /api/courses | Get all courses | No |
    | GET | /api/courses/:id | Get course by ID | No |
    | GET | /api/courses/instructor/:id | Get instructor courses | No |
    | POST | /api/courses | Upload new course | Instructor |
    | PUT | /api/courses/:id/materials | Update materials | Instructor |
    | POST | /api/enrollments | Enroll in course | Learner |
    | GET | /api/enrollments/learner/:id | Get enrollments | Learner |
    | POST | /api/certificates | Complete course | Learner |
    | GET | /api/certificates/learner/:id | Get certificates | Learner |
    | GET | /api/progress/:learnerId/:courseId | Get progress | Learner |
    | POST | /api/progress | Update progress | Learner |
    | GET | /api/admin/stats | Platform stats | Admin |
    | GET | /api/admin/transactions | All transactions | Admin |
    
    ---
    
    ## 9. State Management
    
    ### Why We Don't Use Redux
    
    This project uses **React Context + Props** instead of Redux because:
    
    1. **Simple State**: Only 4 main state variables (user, view, balance, secret)
    2. **Linear Flow**: State flows down, callbacks flow up
    3. **No Complex Updates**: No deeply nested state
    4. **Learning Focus**: Better to understand React first
    
    **When to Use Redux:**
    - 10+ components need same state
    - Complex state updates across app
    - Time-travel debugging needed
    - Server state caching
    
    ---
    
    ## 10. Security & Validation
    
    ### Current Security Measures
    
    1. **Bank Secret Validation**
       - Required for all payments
       - Stored in memory only (not localStorage)
       - Verified server-side
    
    2. **Input Validation**
       - Required fields checked
       - Type validation (prices must be numbers)
       - Range validation (balance can't be negative)
    
    3. **Error Handling**
       - Try-catch on all async operations
       - User-friendly error messages
       - Server error logging
    
    ### Production Improvements Needed
    
    ```javascript
    // ❌ Current (insecure for production)
    password: String
    
    // ✅ Should use bcrypt
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ❌ Current (no authentication)
    app.post('/api/enrollments', async (req, res) => {
      // Anyone can call this
    });
    
    // ✅ Should use JWT middleware
    const jwt = require('jsonwebtoken');
    app.post('/api/enrollments', authenticateToken, async (req, res) => {
      // Only authenticated users
    });
    ```
    
    ---
    
    ## 🎓 Conclusion
    
    This LMS demonstrates:
    
    ✅ **Full-stack development** with MERN
    ✅ **RESTful API design** with Express
    ✅ **Database modeling** with Mongoose
    ✅ **State management** in React
    ✅ **Transaction processing** simulation
    ✅ **Component architecture** best practices
    
    **Next Steps:**
    1. Run the setup guide above
    2. Test all user flows
    3. Understand each model's purpose
    4. Trace a request from button click to database
    5. Prepare to explain the architecture
    
    **For Questions During Demo:**
    - Explain the enrollment flow step-by-step
    - Show how state updates across components
    - Demonstrate the revenue sharing calculation
    - Walk through the database relationships
    
    Good luck with your presentation! 🚀</parameter>
