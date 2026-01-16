

// ==================== src/routes/bankRoutes.js ====================
const express = require('express');
const bankController = require('../controllers/bankController');

const router = express.Router();

router.post('/setup', bankController.setupBank.bind(bankController));
router.get('/balance/:userId', bankController.getBalance.bind(bankController));
router.post('/transaction', bankController.createTransaction.bind(bankController));

module.exports = router;
