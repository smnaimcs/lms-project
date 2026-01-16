// ==================== src/routes/courseRoutes.js ====================
const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', courseController.getAllCourses.bind(courseController));
router.get('/:courseId', courseController.getCourseById.bind(courseController));
router.get('/instructor/:instructorId', courseController.getInstructorCourses.bind(courseController));
router.post('/', courseController.createCourse.bind(courseController));
router.put('/:courseId/materials', courseController.updateCourseMaterials.bind(courseController));

module.exports = router;
