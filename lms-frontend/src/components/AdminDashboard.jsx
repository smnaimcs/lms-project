// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, Users, BookOpen, TrendingUp, Activity } from 'lucide-react';
import Navbar from './Navbar';
import MessageAlert from './MessageAlert';
import { getPlatformStats, getTransactions } from '../services/api';

const AdminDashboard = ({ currentUser, balance, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, transactionsResponse] = await Promise.all([
        getPlatformStats(),
        getTransactions()
      ]);

      setStats(statsResponse.stats);
      setTransactions(transactionsResponse.transactions);
    } catch (error) {
      showMessage(error.error || 'Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} balance={balance} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>

        {message.text && (
          <MessageAlert 
            message={message.text} 
            type={message.type} 
            onClose={() => setMessage({ text: '', type: '' })}
          />
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Enrollments</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalEnrollments}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Platform Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Learners</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalLearners}</p>
                </div>
                <Users className="w-12 h-12 text-indigo-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Instructors</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalInstructors}</p>
                </div>
                <Users className="w-12 h-12 text-orange-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">LMS Balance</p>
                  <p className="text-3xl font-bold text-gray-800">${stats.lmsBalance.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-teal-500 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Recent Transactions
            </h2>
          </div>

          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transactions yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice().reverse().map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.from}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Platform Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Platform Health</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-purple-100 text-sm">Courses per Instructor</p>
              <p className="text-2xl font-bold">
                {stats ? (stats.totalCourses / stats.totalInstructors).toFixed(1) : 0}
              </p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Enrollments per Course</p>
              <p className="text-2xl font-bold">
                {stats ? (stats.totalEnrollments / stats.totalCourses).toFixed(1) : 0}
              </p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Revenue per Enrollment</p>
              <p className="text-2xl font-bold">
                ${stats && stats.totalEnrollments > 0 ? (stats.totalRevenue / stats.totalEnrollments).toFixed(2) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
