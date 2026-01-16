// ==================== src/controllers/bankController.js ====================
const bankService = require('../services/bankService');

class BankController {
  async setupBank(req, res, next) {
    try {
      const { userId, accountNumber, bankSecret } = req.body;
      
      if (!userId || !accountNumber || !bankSecret) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const result = await bankService.setupBankAccount(userId, accountNumber, bankSecret);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBalance(req, res, next) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      const result = await bankService.getBalance(userId);
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req, res, next) {
    try {
      const { fromUserId, toUserId, amount, description, bankSecret } = req.body;
      
      if (!fromUserId || !toUserId || !amount) {
        return res.status(400).json({ error: 'From, to, and amount are required' });
      }
      
      const result = await bankService.processPayment(
        fromUserId,
        toUserId,
        amount,
        bankSecret
      );
      
      res.json({
        success: true,
        newBalance: result.fromBalance
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BankController();
