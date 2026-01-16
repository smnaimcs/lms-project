const express = require('express');
const router = express.Router();
const { enrollInCourse, getLearnerEnrollments } = require('../controllers/enrollmentController');

router.post('/', enrollInCourse);
router.get('/learner/:learnerId', getLearnerEnrollments);

module.exports = router;
