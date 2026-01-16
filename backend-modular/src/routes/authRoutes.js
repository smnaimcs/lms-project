// ==================== src/routes/authRoutes.js ====================
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));

module.exports = router;
