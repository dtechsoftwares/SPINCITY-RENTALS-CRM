

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CloseIcon } from './Icons';
import { defaultLogoBase64 } from '../utils/assets';

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
  splashLogo: string | null;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onRegisterSuccess, adminKey, splashLogo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [enteredAdminKey, setEnteredAdminKey] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);

  useEffect(() => {
    if (!isRegisterModalOpen) {
        setEnteredAdminKey('');
        setRegisterError('');
        setIsVerifyingKey(false);
    }
  }, [isRegisterModalOpen]);

  const performRegistration = () => {
    const adminUser = users.find(u => u.email === 'admin@spincity.com');
    if (adminUser) {
        onRegisterSuccess(adminUser);
    } else {
        setRegisterError('Default admin user not found. Please contact support.');
    }
  };

  useEffect(() => {
    if (enteredAdminKey.length > 0) {
      setRegisterError(''); // Clear previous error on new input
      const timer = setTimeout(() => {
        setIsVerifyingKey(true);
        // Simulate network delay for verification
        setTimeout(() => {
          if (enteredAdminKey === adminKey) {
            performRegistration();
          } else {
            setRegisterError('Invalid Admin Registration Key.');
          }
          setIsVerifyingKey(false);
        }, 1000);
      }, 700); // Debounce typing
      return () => clearTimeout(timer);
    }
  }, [enteredAdminKey, adminKey]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password.');
    }
  };
  
  return (
    <div className="min-h-screen bg-brand-green flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <div className="mb-6">
              <img src={splashLogo || defaultLogoBase64} alt="Spin City Rentals Logo" className="w-32 h-32 mx-auto object-contain" />
          </div>
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
          <p className="text-center mt-8 text-xs text-gray-400">Powered By: Cicadas IT Solutions</p>
      </div>
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Admin Registration">
          <p className="text-gray-600 mb-4">To register the first admin user and set up the system, please enter the Admin Registration Key.</p>
          {registerError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{registerError}</p>}
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Admin Registration Key</label>
                  <div className="relative">
                    <input 
                        type="password" 
                        value={enteredAdminKey} 
                        onChange={e => setEnteredAdminKey(e.target.value)} 
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green" 
                    />
                    {isVerifyingKey && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <div className="w-5 h-5 border-2 border-t-2 border-gray-200 border-t-brand-green rounded-full animate-spin"></div>
                        </div>
                    )}
                  </div>
              </div>
              <div className="flex justify-end space-x-4 pt-2">
                <button onClick={() => setIsRegisterModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
                <button disabled className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg opacity-50 cursor-not-allowed">
                    Auto-verifying...
                </button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default Login;