const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const BankAccount = require('../models/BankAccount');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.transactionId,
        from: t.from,
        to: t.to,
        amount: t.amount,
        description: t.description,
        timestamp: t.createdAt,
        status: t.status
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalLearners = await User.countDocuments({ type: 'learner' });
    const totalInstructors = await User.countDocuments({ type: 'instructor' });
    
    const lmsAccount = await BankAccount.findOne({ accountNumber: 'ACC_LMS' });
    
    const transactions = await Transaction.find({ to: 'admin1' });
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      stats: {
        totalCourses,
        totalEnrollments,
        totalRevenue,
        totalLearners,
        totalInstructors,
        lmsBalance: lmsAccount ? lmsAccount.balance : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllTransactions, getPlatformStats };
