// src/components/Navbar.jsx
import React from 'react';
import { BookOpen, DollarSign, LogOut, User } from 'lucide-react';

const Navbar = ({ currentUser, balance, onLogout }) => {
  const getUserTypeColor = () => {
    switch (currentUser?.type) {
      case 'learner':
        return 'from-indigo-500 to-purple-600';
      case 'instructor':
        return 'from-green-500 to-teal-600';
      case 'admin':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <nav className={`bg-gradient-to-r ${getUserTypeColor()} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LMS Platform</h1>
              <p className="text-xs text-white opacity-90">
                {currentUser?.type === 'learner' && 'Learner Portal'}
                {currentUser?.type === 'instructor' && 'Instructor Portal'}
                {currentUser?.type === 'admin' && 'Admin Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {balance !== null && (
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">${balance.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <User className="w-5 h-5 text-white" />
              <span className="text-white font-medium">{currentUser?.name}</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
