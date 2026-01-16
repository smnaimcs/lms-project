# 🎓 Learning Management System (LMS)

A full-stack web application simulating a complete Learning Management System with integrated banking, course management, and certification features.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [User Flows](#user-flows)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Team & Contribution](#team--contribution)

---

## 🎯 Overview

This Learning Management System is a comprehensive platform that connects three key entities:

1. **Learners** - Enroll in courses, complete lessons, and earn certificates
2. **Instructors** - Upload courses, manage materials, and earn revenue
3. **LMS Organization** - Manage platform, process transactions, and oversee operations

### Key Highlights

- 💳 Integrated banking system for secure transactions
- 📚 Support for multiple material types (video, text, audio, MCQ)
- 🏆 Automatic certificate generation upon course completion
- 💰 Revenue sharing model (70% instructor, 30% platform)
- 📊 Real-time progress tracking
- 🎨 Modern, responsive UI with Tailwind CSS

---

## ✨ Features

### For Learners

- ✅ User registration and authentication
- ✅ Bank account setup with secure PIN
- ✅ Browse 5 pre-loaded courses
- ✅ Enroll in courses with automatic payment processing
- ✅ Interactive course viewer with material navigation
- ✅ Track progress across all enrolled courses
- ✅ Mark individual lessons as complete
- ✅ Earn certificates upon course completion
- ✅ Real-time balance updates

### For Instructors

- ✅ Upload new courses with multiple materials
- ✅ Add/edit course materials (video, audio, text, quiz)
- ✅ Receive $200 upload fee per course
- ✅ Earn 70% revenue share on enrollments
- ✅ View course statistics
- ✅ Track earnings and balance

### For Administrators

- ✅ View platform statistics
- ✅ Monitor all transactions
- ✅ Track total courses and enrollments
- ✅ Oversee revenue and balances
- ✅ Platform health metrics

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Learner   │  │ Instructor │  │   Admin    │            │
│  │ Dashboard  │  │ Dashboard  │  │ Dashboard  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                    REST API (JSON)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Endpoints & Controllers              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic & Services                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                  MongoDB Connection
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Users │ │Course│ │Enroll│ │Trans │ │Cert  │ │Bank  │   │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Example: Course Enrollment

```
1. Learner clicks "Enroll Now"
   ↓
2. Frontend sends POST /api/enrollments
   ↓
3. Backend validates bank secret
   ↓
4. Process payment (Learner → LMS)
   ↓
5. Create enrollment record
   ↓
6. Transfer revenue to instructor (LMS → Instructor)
   ↓
7. Return success with updated balance
   ↓
8. Frontend updates UI
```

### Transaction Flow

```
Course Price: $99
├── Learner Account: -$99
├── LMS Account: +$99
│   └── LMS Account: -$69.30 (70%)
│       └── Instructor Account: +$69.30
└── LMS Retains: $29.70 (30%)
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Tailwind CSS | 3.x | Styling |
| Axios | 1.6.0 | HTTP client |
| Lucide React | 0.263.1 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 14+ | Runtime environment |
| Express | 4.18.2 | Web framework |
| MongoDB | 6.0+ | Database |
| Mongoose | 8.0.0 | ODM |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.3.1 | Environment variables |

### Development Tools

- Nodemon - Auto-restart server
- ESLint - Code linting
- VS Code - IDE

---

## 📁 Project Structure

```
lms-project/
├── backend/
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Course.js               # Course schema
│   │   ├── Enrollment.js           # Enrollment schema
│   │   ├── Transaction.js          # Transaction schema
│   │   ├── Certificate.js          # Certificate schema
│   │   ├── BankAccount.js          # Bank account schema
│   │   └── Progress.js             # Progress tracking schema
│   ├── server.js                   # Main server file
│   ├── seed.js                     # Database seeding script
│   ├── package.json
│   ├── .env                        # Environment variables
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── BankSetup.jsx       # Bank account setup
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── MessageAlert.jsx    # Alert notifications
│   │   │   ├── CourseCard.jsx      # Course display card
│   │   │   ├── CourseViewer.jsx    # Course material viewer
│   │   │   ├── CourseEditor.jsx    # Instructor course editor
│   │   │   ├── MaterialUpload.jsx  # Material upload component
│   │   │   ├── LearnerDashboard.jsx    # Learner portal
│   │   │   ├── InstructorDashboard.jsx # Instructor portal
│   │   │   └── AdminDashboard.jsx      # Admin portal
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
│
└── README.md                        # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) or local installation
- **Git** (optional)

### Step 1: Clone or Download the Project

```bash
# Clone the repository
git clone <repository-url>

# Or download and extract the ZIP file
cd lms-project
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
EOF

# Note: Replace the MONGODB_URI with your actual MongoDB connection string
```

#### MongoDB Setup

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<dbname>` in your `.env` file

**Option B: Local MongoDB**

```bash
# Install MongoDB locally
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Use local connection string in .env
MONGODB_URI=mongodb://localhost:27017/lms
```

#### Seed the Database

```bash
# Run the seed script to populate initial data
npm run seed
```

**Expected Output:**
```
🌱 Starting database seed...
✅ Connected to MongoDB
✅ Created 6 users
✅ Created 4 bank accounts
✅ Created 5 courses
✅ Database seeded successfully!
```

#### Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
📊 Database already initialized
🚀 LMS Server running on http://localhost:3000
```

### Step 3: Frontend Setup

Open a **new terminal window** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3001
  On Your Network:  http://192.168.x.x:3001
```

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:3001
```

You should see the LMS login page! 🎉

---

## 🔑 Default Login Credentials

### Learners
- **Email:** `alice@example.com` | **Password:** `pass123`
- **Email:** `bob@example.com` | **Password:** `pass123`

### Instructors
- **Email:** `john@example.com` | **Password:** `pass123`
- **Email:** `jane@example.com` | **Password:** `pass123`
- **Email:** `bob.j@example.com` | **Password:** `pass123`

### Admin
- **Email:** `admin@lms.com` | **Password:** `admin123`

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /auth/login
Login a user.

**Request:**
```json
{
  "email": "alice@example.com",
  "password": "pass123",
  "type": "learner"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Alice Learner",
    "email": "alice@example.com",
    "type": "learner",
    "accountNumber": "ACC123",
    "bankSecret": "secret123",
    "bankSetup": true
  }
}
```

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "type": "learner"
}
```

### Bank Endpoints

#### POST /bank/setup
Setup bank account for a user.

**Request:**
```json
{
  "userId": "user_id_here",
  "accountNumber": "ACC12345",
  "bankSecret": "mySecret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank account setup successful",
  "balance": 1000
}
```

#### GET /bank/balance/:userId
Get user's bank balance.

**Response:**
```json
{
  "success": true,
  "balance": 1000,
  "accountNumber": "ACC12345"
}
```

### Course Endpoints

#### GET /courses
Get all courses.

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": "...",
      "title": "Web Development Fundamentals",
      "instructor": "John Doe",
      "price": 99,
      "description": "Learn HTML, CSS, and JavaScript",
      "materials": [...]
    }
  ]
}
```

#### POST /courses
Upload a new course (instructors only).

**Request:**
```json
{
  "instructorId": "instructor_id",
  "title": "Advanced React",
  "description": "Master React.js",
  "price": 149,
  "materials": [
    {
      "type": "video",
      "title": "Introduction",
      "url": "https://example.com/video.mp4"
    },
    {
      "type": "text",
      "title": "Chapter 1",
      "content": "React basics..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "course": {...},
  "payment": 200
}
```

#### PUT /courses/:courseId/materials
Update course materials (instructors only).

**Request:**
```json
{
  "instructorId": "instructor_id",
  "materials": [...]
}
```

### Enrollment Endpoints

#### POST /enrollments
Enroll in a course.

**Request:**
```json
{
  "learnerId": "learner_id",
  "courseId": "course_id",
  "bankSecret": "mySecret123"
}
```

**Response:**
```json
{
  "success": true,
  "enrollment": {...},
  "transaction": {...},
  "newBalance": 901
}
```

#### GET /enrollments/learner/:learnerId
Get learner's enrollments.

### Progress Endpoints

#### GET /progress/:learnerId/:courseId
Get course progress for a learner.

**Response:**
```json
{
  "success": true,
  "progress": {
    "completedMaterials": [0, 1, 3],
    "lastAccessedMaterial": 3
  }
}
```

#### POST /progress
Update course progress.

**Request:**
```json
{
  "learnerId": "learner_id",
  "courseId": "course_id",
  "completedMaterials": [0, 1, 2, 3],
  "lastAccessedMaterial": 3
}
```

### Certificate Endpoints

#### POST /certificates
Complete a course and receive certificate.

**Request:**
```json
{
  "learnerId": "learner_id",
  "courseId": "course_id"
}
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "certificateId": "CERT1234567890",
    "learnerName": "Alice Learner",
    "courseTitle": "Web Development Fundamentals",
    "issuedAt": "2026-01-16T..."
  }
}
```

### Admin Endpoints

#### GET /admin/stats
Get platform statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalCourses": 5,
    "totalEnrollments": 12,
    "totalRevenue": 1188,
    "totalLearners": 2,
    "totalInstructors": 3,
    "lmsBalance": 9643.40
  }
}
```

#### GET /admin/transactions
Get all platform transactions.

---

## 👥 User Flows

### Learner Flow

```
1. Login → 2. Bank Setup → 3. Browse Courses → 4. Enroll & Pay 
   ↓
5. View Course Materials → 6. Mark Lessons Complete → 7. Get Certificate
```

**Detailed Steps:**

1. **Login**: Enter email/password, select "Login as Learner"
2. **Bank Setup**: Enter account number and PIN (first time only)
3. **Browse**: View 5 available courses with details
4. **Enroll**: Click "Enroll Now", payment processed automatically
5. **Learn**: Click "Start Learning", navigate through materials
6. **Progress**: Mark each lesson as complete
7. **Certificate**: Complete all lessons, receive certificate

### Instructor Flow

```
1. Login → 2. View Dashboard → 3. Upload Course → 4. Add Materials 
   ↓
5. Receive $200 → 6. Edit Materials → 7. Earn Revenue Share
```

**Detailed Steps:**

1. **Login**: Enter email/password, select "Login as Instructor"
2. **Dashboard**: View your courses and earnings
3. **Upload**: Click "Upload New Course", enter details
4. **Materials**: Add videos, text, quizzes
5. **Payment**: Receive $200 upload fee instantly
6. **Edit**: Click "Edit Materials" on any course
7. **Revenue**: Earn 70% when learners enroll

### Admin Flow

```
1. Login → 2. View Statistics → 3. Monitor Transactions → 4. Oversee Platform
```

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String,
  name: String,
  type: "learner" | "instructor" | "admin",
  accountNumber: String,
  bankSecret: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  instructor: String,
  instructorId: String,
  materials: [{
    type: "video" | "audio" | "text" | "mcq",
    title: String,
    content: String,
    url: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection

```javascript
{
  _id: ObjectId,
  learnerId: String,
  courseId: ObjectId,
  completed: Boolean,
  progress: Number (0-100),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection

```javascript
{
  _id: ObjectId,
  transactionId: String (unique),
  from: String,
  to: String,
  amount: Number,
  description: String,
  status: "pending" | "completed" | "failed",
  createdAt: Date
}
```

### BankAccounts Collection

```javascript
{
  _id: ObjectId,
  accountNumber: String (unique),
  owner: String,
  balance: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Certificates Collection

```javascript
{
  _id: ObjectId,
  certificateId: String (unique),
  learnerId: String,
  learnerName: String,
  courseId: ObjectId,
  courseTitle: String,
  instructor: String,
  createdAt: Date
}
```

### Progress Collection

```javascript
{
  _id: ObjectId,
  learnerId: String,
  courseId: ObjectId,
  completedMaterials: [Number],
  lastAccessedMaterial: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📸 Screenshots

### Login Page
Modern gradient design with role-based authentication.

### Learner Dashboard
- Course grid with enrollment status
- Real-time balance display
- Progress tracking

### Course Viewer
- Material sidebar navigation
- Progress bar
- Mark complete functionality
- Certificate generation

### Instructor Dashboard
- Course upload form
- Material editor
- Revenue statistics

### Admin Dashboard
- Platform statistics
- Transaction history
- User metrics

---

## 🧪 Testing

### Manual Testing Checklist

**Learner Tests:**
- [ ] Can register/login as learner
- [ ] Bank setup works correctly
- [ ] Can view all courses
- [ ] Can enroll in a course
- [ ] Payment deducts from balance
- [ ] Can view course materials
- [ ] Can mark lessons as complete
- [ ] Progress persists after logout
- [ ] Can complete course
- [ ] Certificate is generated

**Instructor Tests:**
- [ ] Can login as instructor
- [ ] Can upload new course
- [ ] Receives $200 upload fee
- [ ] Balance updates correctly
- [ ] Can add multiple materials
- [ ] Can edit existing courses
- [ ] Can add/remove materials
- [ ] Revenue share works (70%)

**Admin Tests:**
- [ ] Can login as admin
- [ ] Dashboard shows correct stats
- [ ] Transaction history visible
- [ ] All metrics accurate

### API Testing with cURL

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123","type":"learner"}'

# Test get courses
curl http://localhost:3000/api/courses
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: MongoDB connection failed**

```
❌ MongoDB Connection Error: ...
```

**Solution:**
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas cluster is running
- Check network access (whitelist IP in Atlas)
- Test connection string with MongoDB Compass

**Problem: Port already in use**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

**Problem: Module not found**

```
Error: Cannot find module ...
```

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Problem: Blank page / white screen**

**Solution:**
- Open browser console (F12) for errors
- Check backend is running on port 3000
- Verify API endpoints in `src/services/api.js`

**Problem: API calls failing / CORS errors**

**Solution:**
- Ensure backend server is running
- Check `API_BASE_URL` in frontend
- Verify CORS is enabled in backend

**Problem: Styles not loading**

**Solution:**
```bash
cd frontend
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Common Errors

**Bank Secret Error:**
- Logout and login again
- Redo bank setup
- Check browser console for secret value

**Enrollment Fails:**
- Check sufficient balance
- Verify bank secret is saved
- Check backend logs for errors

---

## 👨‍💻 Team & Contribution

### Project Team

- **Developer 1**: Backend API & Database
- **Developer 2**: Frontend UI & Components
- **Developer 3**: Integration & Testing

### Contribution Guidelines

1. **Code Style**: Follow existing patterns
2. **Comments**: Document complex logic
3. **Testing**: Test before committing
4. **Commits**: Clear, descriptive messages

### Future Enhancements

- [ ] JWT authentication
- [ ] Real video/audio player
- [ ] File upload for materials
- [ ] Email notifications
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Course reviews & ratings
- [ ] Search & filter
- [ ] Mobile app
- [ ] Live chat support
- [ ] Analytics dashboard

---

## 📄 License

This project is created for educational purposes as part of a university course project.

---

## 📞 Support

For questions or issues:
- Check the [Troubleshooting](#troubleshooting) section
- Review API documentation
- Contact team members

---

## 🙏 Acknowledgments

- Course instructors for project requirements
- MongoDB for database hosting
- React & Node.js communities
- Tailwind CSS for styling framework

---

## 📊 Project Statistics

- **Lines of Code**: ~8,000+
- **Components**: 15+
- **API Endpoints**: 25+
- **Database Collections**: 7
- **Features**: 30+
- **Development Time**: 2 weeks

---

**Built with ❤️ by the LMS Team**

**Version 1.0.0** | **Last Updated**: January 2026
