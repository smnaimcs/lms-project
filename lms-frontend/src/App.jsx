// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login';
import BankSetup from './components/BankSetup';
import LearnerDashboard from './components/LearnerDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getBalance } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [balance, setBalance] = useState(null);
  const [bankSecret, setBankSecret] = useState('');

  const loadBalance = async (userId) => {
    try {
      const response = await getBalance(userId);
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const handleLoginSuccess = async (user, type) => {
    setCurrentUser(user);

    // If learner needs bank setup
    if (type === 'learner' && !user.bankSetup) {
      setView('bankSetup');
    } else if (type === 'learner') {
      // Load bank secret from user data if it exists
      if (user.bankSecret) {
        setBankSecret(user.bankSecret);
      }
      // Load actual balance from database
      await loadBalance(user.id);
      setView('learnerDashboard');
    } else if (type === 'instructor') {
      // Load actual balance for instructor
      await loadBalance(user.id);
      setView('instructorDashboard');
    } else if (type === 'admin') {
      // Load actual balance for admin
      await loadBalance(user.id);
      setView('adminDashboard');
    }
  };

  const handleBankSetupComplete = (initialBalance, accountNumber, secret) => {
    setBalance(initialBalance);
    setBankSecret(secret);
    setView('learnerDashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setBalance(null);
    setBankSecret('');
  };

  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <div className="App">
      {view === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {view === 'bankSetup' && (
        <BankSetup 
          currentUser={currentUser}
          onSetupComplete={handleBankSetupComplete}
        />
      )}

      {view === 'learnerDashboard' && (
        <LearnerDashboard 
          currentUser={currentUser}
          bankSecret={bankSecret}
          balance={balance}
          onLogout={handleLogout}
          onBalanceUpdate={handleBalanceUpdate}
        />
      )}

      {view === 'instructorDashboard' && (
        <InstructorDashboard 
          currentUser={currentUser}
          balance={balance}
          onLogout={handleLogout}
          onBalanceUpdate={handleBalanceUpdate}
        />
      )}

      {view === 'adminDashboard' && (
        <AdminDashboard 
          currentUser={currentUser}
          balance={balance}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
