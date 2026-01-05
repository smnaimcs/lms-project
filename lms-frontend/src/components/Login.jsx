// src/components/Login.jsx
import React, { useState } from 'react';
import { BookOpen, User, Upload, Lock, Mail, Key } from 'lucide-react';
import MessageAlert from './MessageAlert';
import { login } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleLogin = async (type) => {
    if (!email || !password) {
      showMessage('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password, type);
      showMessage(`Welcome ${response.user.name}!`, 'success');
      setTimeout(() => {
        onLoginSuccess(response.user, type);
      }, 500);
    } catch (error) {
      showMessage(error.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            LMS Platform
          </h1>
          <p className="text-gray-600 mt-2">Learning Management System</p>
        </div>

        <MessageAlert 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ text: '', type: '' })}
        />

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin('learner')}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleLogin('learner')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <User className="w-5 h-5" />
            {loading ? 'Logging in...' : 'Login as Learner'}
          </button>

          <button
            onClick={() => handleLogin('instructor')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            {loading ? 'Logging in...' : 'Login as Instructor'}
          </button>

          <button
            onClick={() => handleLogin('admin')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Learner:</strong> alice@example.com / pass123</p>
            <p><strong>Instructor:</strong> john@example.com / pass123</p>
            <p><strong>Admin:</strong> admin@lms.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
