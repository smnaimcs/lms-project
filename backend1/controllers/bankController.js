const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const Transaction = require('../models/Transaction');
const { generateTransactionId } = require('../utils/generateIds');

const setupBankAccount = async (req, res) => {
  try {
    const { userId, accountNumber, bankSecret } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.accountNumber = accountNumber;
    user.bankSecret = bankSecret;
    await user.save();
    
    let bankAccount = await BankAccount.findOne({ accountNumber });
    if (!bankAccount) {
      bankAccount = await BankAccount.create({
        accountNumber,
        owner: userId,
        balance: 1000
      });
    }
    
    res.json({
      success: true,
      message: 'Bank account setup successful',
      balance: bankAccount.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user || !user.accountNumber) {
      return res.status(404).json({ error: 'Bank account not found' });
    }
    
    const account = await BankAccount.findOne({ accountNumber: user.accountNumber });
    
    res.json({
      success: true,
      balance: account.balance,
      accountNumber: user.accountNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { fromUserId, toUserId, amount, description, bankSecret } = req.body;
    
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (fromUser.bankSecret !== bankSecret) {
      return res.status(401).json({ error: 'Invalid bank secret' });
    }
    
    const fromAccount = await BankAccount.findOne({ accountNumber: fromUser.accountNumber });
    const toAccount = await BankAccount.findOne({ accountNumber: toUser.accountNumber });
    
    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    
    await fromAccount.save();
    await toAccount.save();
    
    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      from: fromUserId,
      to: toUserId,
      amount,
      description,
      status: 'completed'
    });
    
    res.json({
      success: true,
      transaction,
      newBalance: fromAccount.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { setupBankAccount, getBalance, createTransaction };
