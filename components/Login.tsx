import React, { useState } from 'react';
import { User } from '../types';
import { CloseIcon } from './Icons';
import { defaultLogoBase64 } from '../utils/assets';
import * as db from '../utils/storage';

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

// FIX: Added Input component definition to resolve 'Cannot find name' error.
const Input = ({ label, type = 'text', name, value, onChange, required=false, placeholder='' }: { label: string, type?: string, name: string, value: string, onChange: (e: React.ChangeEvent<any>) => void, required?: boolean, placeholder?: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-text" />
    </div>
);


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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAdminKey, setRegAdminKey] = useState('');
  const [regError, setRegError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulate async operation
    await new Promise(res => setTimeout(res, 300));

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // NOTE: This is a simple password check for a local-only app.
    // Do not use this method if the app were to go online.
    if (user && user.password === password) {
        onLogin(user);
    } else {
        setError('Invalid email or password.');
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setIsSubmitting(true);
    
    await new Promise(res => setTimeout(res, 300));

    if (regPassword.length < 4) {
        setRegError("Password should be at least 4 characters.");
        setIsSubmitting(false);
        return;
    }
    
    if (users.some(u => u.email.toLowerCase() === regEmail.toLowerCase())) {
        setRegError("An account with this email already exists.");
        setIsSubmitting(false);
        return;
    }

    const isFirstUser = users.length === 0;
    if (isFirstUser) {
        if (regAdminKey.length < 4) {
            setRegError('Admin Key must be at least 4 characters long.');
            setIsSubmitting(false);
            return;
        }
        db.saveAdminKey(regAdminKey); // Save the admin key on first registration
    }

    const newUser: Omit<User, 'id'> = {
        name: regName,
        email: regEmail,
        password: regPassword, // Storing password directly as this is an offline app
        role: isFirstUser ? 'Admin' : 'User',
        avatar: `https://picsum.photos/seed/${regName}/80/80`
    };

    const createdUser = db.createUser(newUser);
    onRegisterSuccess(createdUser);

    setIsSubmitting(false);
    setIsRegisterModalOpen(false);
  };
  
  // If no users exist, show the admin creation screen instead of the login form
  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-brand-green flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <div className="mb-6">
            <img src={splashLogo || defaultLogoBase64} alt="Spin City Rentals Logo" className="w-32 h-32 mx-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Create Admin Account</h2>
          <p className="text-center text-gray-500 mb-6">Welcome! As the first user, you will become the administrator.</p>
          
          {regError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{regError}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" name="name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
            <Input label="Email Address" type="email" name="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            <Input label="Password (min. 4 characters)" type="password" name="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
            <Input label="Set Admin Key" type="password" name="adminKey" value={regAdminKey} onChange={(e) => setRegAdminKey(e.target.value)} required placeholder="Create a secret key for admin actions"/>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-green-dark transition-colors disabled:bg-gray-400 mt-6">
              {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>
          <p className="text-center mt-8 text-xs text-gray-400">Powered By: Cicadas IT Solutions</p>
        </div>
      </div>
    );
  }

  // Otherwise, show the regular login screen
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
            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-green-dark transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-6">
            <button onClick={() => setIsRegisterModalOpen(true)} className="text-sm text-brand-green hover:underline disabled:text-gray-400">
              New here? Register now
            </button>
          </div>
          <p className="text-center mt-8 text-xs text-gray-400">Powered By: Cicadas IT Solutions</p>
      </div>
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Register New User">
          <p className="text-gray-600 mb-4">Create a new account to access the CRM.</p>
          {regError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{regError}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
              <Input label="Full Name" name="name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
              <Input label="Email Address" type="email" name="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              <Input label="Password (min. 4 characters)" type="password" name="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
              <div className="flex justify-end space-x-4 pt-2">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark disabled:bg-gray-400">
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default Login;