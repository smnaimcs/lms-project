// ==================== src/services/transactionService.js ====================
const Transaction = require('../../models/Transaction');
const { generateTransactionId } = require('../utils/generators');

class TransactionService {
  async createTransaction(transactionData) {
    const { from, to, amount, description, status = 'completed' } = transactionData;
    
    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      from,
      to,
      amount,
      description,
      status
    });
    
    return transaction;
  }

  async getAllTransactions() {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    
    return transactions.map(t => ({
      id: t.transactionId,
      from: t.from,
      to: t.to,
      amount: t.amount,
      description: t.description,
      timestamp: t.createdAt,
      status: t.status
    }));
  }

  async getTransactionsByUser(userId) {
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }]
    }).sort({ createdAt: -1 });
    
    return transactions;
  }

  async getTransactionById(transactionId) {
    return await Transaction.findOne({ transactionId });
  }
}

module.exports = new TransactionService();
