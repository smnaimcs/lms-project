// ==================== src/controllers/courseController.js ====================
const courseService = require('../services/courseService');
const { validatePrice, validateMaterials } = require('../utils/helpers');

class CourseController {
  async getAllCourses(req, res, next) {
    try {
      const courses = await courseService.getAllCourses();
      
      res.json({
        success: true,
        courses
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    try {
      const { courseId } = req.params;
      
      const course = await courseService.getCourseById(courseId);
      
      res.json({
        success: true,
        course
      });
    } catch (error) {
      next(error);
    }
  }

  async getInstructorCourses(req, res, next) {
    try {
      const { instructorId } = req.params;
      
      const courses = await courseService.getInstructorCourses(instructorId);
      
      res.json({
        success: true,
        courses
      });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req, res, next) {
    try {
      const { instructorId, title, description, price, materials } = req.body;
      
      if (!instructorId || !title || !price) {
        return res.status(400).json({ error: 'Instructor ID, title, and price are required' });
      }
      
      if (!validatePrice(price)) {
        return res.status(400).json({ error: 'Invalid price' });
      }
      
      if (!materials || materials.length === 0) {
        return res.status(400).json({ error: 'At least one material is required' });
      }
      
      const result = await courseService.createCourse(instructorId, {
        title,
        description,
        price,
        materials
      });
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourseMaterials(req, res, next) {
    try {
      const { courseId } = req.params;
      const { instructorId, materials } = req.body;
      
      if (!instructorId || !materials) {
        return res.status(400).json({ error: 'Instructor ID and materials are required' });
      }
      
      const course = await courseService.updateCourseMaterials(courseId, instructorId, materials);
      
      res.json({
        success: true,
        course
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
