const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  uploadCourse,
  getInstructorCourses,
  updateCourseMaterials
} = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);
router.post('/', uploadCourse);
router.get('/instructor/:instructorId', getInstructorCourses);
router.put('/:courseId/materials', updateCourseMaterials);

module.exports = router;
