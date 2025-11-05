
import React, { useState } from 'react';
import { AppView, User, Contact } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Rentals from './components/Rentals';
import Repairs from './components/Repairs';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  
  // Mock data
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Abraham Junior Sagoe', email: 'dtechsoftwaress@gmail.com', role: 'Admin', avatar: 'https://picsum.photos/seed/abraham/40/40' },
    { id: 2, name: 'Admin User', email: 'admin@spincity.com', role: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40' },
  ]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const renderView = () => {
    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard />;
      case AppView.Users:
        return <Users users={users} />;
      case AppView.Contacts:
        return <Contacts contacts={contacts} setContacts={setContacts} />;
      case AppView.Settings:
        return <Settings />;
      case AppView.Rentals:
        return <Rentals />;
      case AppView.Repairs:
        return <Repairs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-dark">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
      <div className="absolute bottom-8 right-8 bg-purple-600 rounded-full p-3 shadow-lg cursor-pointer hover:bg-purple-700 transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    </div>
  );
};

export default App;
