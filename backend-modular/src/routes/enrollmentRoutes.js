// ==================== src/routes/enrollmentRoutes.js ====================
const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/', enrollmentController.enrollInCourse.bind(enrollmentController));
router.get('/learner/:learnerId', enrollmentController.getLearnerEnrollments.bind(enrollmentController));

module.exports = router;
