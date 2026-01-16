// ==================== src/controllers/authController.js ====================
const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password, type } = req.body;
      
      if (!email || !password || !type) {
        return res.status(400).json({ error: 'Email, password, and type are required' });
      }
      
      const user = await authService.login(email, password, type);
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { email, password, name, type } = req.body;
      
      if (!email || !password || !name || !type) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const user = await authService.register(email, password, name, type);
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
