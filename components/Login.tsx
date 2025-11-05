

import React, { useState } from 'react';
import { User } from '../types';
import { CloseIcon } from './Icons';

// FIX: Make children optional to resolve misleading "missing children" type error.
const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children?: React.ReactNode, title: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-brand-text w-full max-w-md rounded-xl shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-text">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};


interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegisterSuccess: (user: User) => void;
  adminKey: string;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onRegisterSuccess, adminKey }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [enteredAdminKey, setEnteredAdminKey] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password.');
    }
  };
  
  const handleRegister = () => {
    if (enteredAdminKey === adminKey) {
        const adminUser = users.find(u => u.email === 'admin@spincity.com');
        if (adminUser) {
            onRegisterSuccess(adminUser);
        } else {
            setRegisterError('Default admin user not found. Please contact support.');
        }
    } else {
        setRegisterError('Invalid Admin Registration Key.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center mb-6 space-x-3">
            <div className="bg-brand-green p-2 rounded-lg">
                <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m3 1v5.25m-3-5.25v5.25m-3-5.25l3 1m-3-1l-3 1m0 0v5.25m0 0l3 1m-3-1l-3-1" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-brand-text">SpinCity CRM</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-brand-text">Login</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              />
            </div>
            <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-green-dark transition-colors">
              Login
            </button>
          </form>
          <div className="text-center mt-6">
            <button onClick={() => setIsRegisterModalOpen(true)} className="text-sm text-brand-green hover:underline">
              New here? Register now
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Admin Registration">
          <p className="text-gray-600 mb-4">To register the first admin user and set up the system, please enter the Admin Registration Key.</p>
          {registerError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{registerError}</p>}
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Admin Registration Key</label>
                  <input type="password" value={enteredAdminKey} onChange={e => setEnteredAdminKey(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div className="flex justify-end space-x-4 pt-2">
                <button onClick={() => setIsRegisterModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleRegister} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark">Verify &amp; Login</button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default Login;