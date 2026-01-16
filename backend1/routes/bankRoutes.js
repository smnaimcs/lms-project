const express = require('express');
const router = express.Router();
const { setupBankAccount, getBalance, createTransaction } = require('../controllers/bankController');

router.post('/setup', setupBankAccount);
router.get('/balance/:userId', getBalance);
router.post('/transaction', createTransaction);

module.exports = router;
