// src/components/BankSetup.jsx
import React, { useState } from 'react';
import { CreditCard, Shield, ArrowRight } from 'lucide-react';
import MessageAlert from './MessageAlert';
import { setupBank } from '../services/api';

const BankSetup = ({ currentUser, onSetupComplete }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankSecret, setBankSecret] = useState('');
  const [confirmSecret, setConfirmSecret] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSetup = async () => {
    if (!accountNumber || !bankSecret || !confirmSecret) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    if (bankSecret !== confirmSecret) {
      showMessage('Secrets do not match', 'error');
      return;
    }

    if (bankSecret.length < 4) {
      showMessage('Secret must be at least 4 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await setupBank(currentUser.id, accountNumber, bankSecret);
      showMessage('Bank account setup successful!', 'success');
      setTimeout(() => {
        onSetupComplete(response.balance, accountNumber, bankSecret);
      }, 1000);
    } catch (error) {
      showMessage(error.error || 'Bank setup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bank Account Setup</h2>
          <p className="text-gray-600 mt-2">Set up your payment method to continue</p>
        </div>

        <MessageAlert 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ text: '', type: '' })}
        />

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Any alphanumeric value (e.g., ACC12345)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Secret/PIN
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Enter your secret PIN"
                value={bankSecret}
                onChange={(e) => setBankSecret(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 4 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Secret/PIN
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Confirm your secret PIN"
                value={confirmSecret}
                onChange={(e) => setConfirmSecret(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSetup()}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up...' : 'Complete Setup'}
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your account will be credited with $1000 initial balance for demo purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankSetup;
