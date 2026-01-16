// ==================== src/config/constants.js ====================
module.exports = {
  // Payment Constants
  COURSE_UPLOAD_FEE: 200,
  INSTRUCTOR_REVENUE_SHARE: 0.7, // 70%
  LMS_REVENUE_SHARE: 0.3,         // 30%

  // Initial Balances
  LEARNER_INITIAL_BALANCE: 1000,
  INSTRUCTOR_INITIAL_BALANCE: 500,
  LMS_INITIAL_BALANCE: 10000,

  // Account Numbers
  LMS_ACCOUNT_NUMBER: 'ACC_LMS',

  // Material Types
  MATERIAL_TYPES: ['video', 'audio', 'text', 'mcq'],

  // Transaction Status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
  },

  // User Types
  USER_TYPES: {
    LEARNER: 'learner',
    INSTRUCTOR: 'instructor',
    ADMIN: 'admin'
  }
};
