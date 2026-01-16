const express = require('express');
const router = express.Router();
const { getAllTransactions, getPlatformStats } = require('../controllers/adminController');

router.get('/transactions', getAllTransactions);
router.get('/stats', getPlatformStats);

module.exports = router;
