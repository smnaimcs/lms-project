// ==================== src/routes/index.js ====================
const express = require('express');
const authRoutes = require('./authRoutes');
const bankRoutes = require('./bankRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/bank', bankRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);

module.exports = router;
