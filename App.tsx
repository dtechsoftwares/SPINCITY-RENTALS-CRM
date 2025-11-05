
import React, { useState, useEffect } from 'react';
import { AppView, User, Contact, Rental, Repair, SmsSettings } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Rentals from './components/Rentals';
import Repairs from './components/Repairs';
import Preloader from './components/Preloader';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Reports from './components/Reports';
import { loadUsers, saveUsers, loadCurrentUser, saveCurrentUser, clearCurrentUser, saveAppLogo, loadAppLogo, loadContacts, saveContacts, loadRentals, saveRentals, loadRepairs, saveRepairs, loadSmsSettings, saveSmsSettings, loadAdminKey, saveAdminKey, loadSplashLogo, saveSplashLogo } from './utils/storage';
import { getTodayDateString } from './utils/dates';
import Spinner from './components/Spinner';
import Notification from './components/Notification';

interface HeaderProps {
    viewName: string;
    user: User;
}

const Header: React.FC<HeaderProps> = ({ viewName, user }) => {
    return (
        <header className="bg-brand-light p-4 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-brand-text">{viewName}</h1>
            </div>
            <div className="flex items-center space-x-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-brand-text">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>
        </header>
    );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const [users, setUsers] = useState<User[]>(loadUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(loadCurrentUser());
  const [contacts, setContacts] = useState<Contact[]>(loadContacts());
  const [rentals, setRentals] = useState<Rental[]>(loadRentals());
  const [repairs, setRepairs] = useState<Repair[]>(loadRepairs());
  const [appLogo, setAppLogo] = useState<string | null>(loadAppLogo());
  const [splashLogo, setSplashLogo] = useState<string | null>(loadSplashLogo());
  const [smsSettings, setSmsSettings] = useState<SmsSettings>(loadSmsSettings());
  const [adminKey, setAdminKey] = useState<string>(loadAdminKey());
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000); // Splash screen for 4 seconds
    return () => clearTimeout(timer);
  }, []);
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification('');
    }, 3000); // Hide after 3 seconds
  };

  const handleAction = async (action: () => void | Promise<void>) => {
    setIsActionLoading(true);
    try {
      // Simulate a minimum delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      await action();
    } catch (error) {
      console.error("An error occurred during the action:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewChange = (view: AppView) => {
    if (view === currentView) return;
    
    handleAction(() => {
        setCurrentView(view);
    });
  };

  const handleLogin = (user: User) => handleAction(() => {
    setCurrentUser(user);
    saveCurrentUser(user);
    handleViewChange(AppView.Dashboard);
  });
  
  const handleRegisterSuccess = (user: User) => handleAction(() => {
    handleLogin(user);
    handleViewChange(AppView.Dashboard);
  });

  const handleLogout = () => handleAction(() => {
    setCurrentUser(null);
    clearCurrentUser();
  });
  
  const handleCreateUser = (newUser: Omit<User, 'id'>) => handleAction(() => {
    const updatedUsers = [...users, { ...newUser, id: Date.now() }];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  });
  
  const handleUpdateUser = (updatedUser: User) => handleAction(() => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
        saveCurrentUser(updatedUser);
    }
  });
  
  const handleDeleteUser = (userId: number) => handleAction(() => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  });

  const handleUpdateLogo = (logo: string | null) => handleAction(() => {
    setAppLogo(logo);
    saveAppLogo(logo);
  });

  const handleUpdateSplashLogo = (logo: string | null) => handleAction(() => {
    setSplashLogo(logo);
    saveSplashLogo(logo);
  });

  const handleCreateContact = (newContact: Omit<Contact, 'id'>) => handleAction(() => {
    const contactWithDate = { ...newContact, id: Date.now(), createdAt: getTodayDateString() };
    const updatedContacts = [contactWithDate, ...contacts];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  });
  
  const handleUpdateContact = (updatedContact: Contact) => handleAction(() => {
    const updatedContacts = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  });
  
  const handleDeleteContact = (contactId: number) => handleAction(() => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  });

  const handleCreateRental = (newRental: Omit<Rental, 'id'>) => handleAction(() => {
    const updatedRentals = [{...newRental, id: Date.now()}, ...rentals];
    setRentals(updatedRentals);
    saveRentals(updatedRentals);
  });

  const handleUpdateRental = (updatedRental: Rental) => handleAction(() => {
    const updatedRentals = rentals.map(r => r.id === updatedRental.id ? updatedRental : r);
    setRentals(updatedRentals);
    saveRentals(updatedRentals);
  });

  const handleDeleteRental = (rentalId: number) => handleAction(() => {
    const updatedRentals = rentals.filter(r => r.id !== rentalId);
    setRentals(updatedRentals);
    saveRentals(updatedRentals);
  });

  const handleCreateRepair = (newRepair: Omit<Repair, 'id'>) => handleAction(() => {
    const updatedRepairs = [{...newRepair, id: Date.now()}, ...repairs];
    setRepairs(updatedRepairs);
    saveRepairs(updatedRepairs);
  });

  const handleUpdateRepair = (updatedRepair: Repair) => handleAction(() => {
    const updatedRepairs = repairs.map(r => r.id === updatedRepair.id ? updatedRepair : r);
    setRepairs(updatedRepairs);
    saveRepairs(updatedRepairs);
  });

  const handleDeleteRepair = (repairId: number) => handleAction(() => {
    const updatedRepairs = repairs.filter(r => r.id !== repairId);
    setRepairs(updatedRepairs);
    saveRepairs(updatedRepairs);
  });

  const handleUpdateSmsSettings = (settings: SmsSettings) => handleAction(() => {
    setSmsSettings(settings);
    saveSmsSettings(settings);
  });
  
  const handleUpdateAdminKey = (key: string) => handleAction(() => {
    setAdminKey(key);
    saveAdminKey(key);
    showNotification('Admin Registration Key updated successfully!');
  });

  if (isLoading) {
    return <Preloader splashLogo={splashLogo} />;
  }

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} onRegisterSuccess={handleRegisterSuccess} adminKey={adminKey} splashLogo={splashLogo} />;
  }

  const getViewName = (view: AppView): string => {
    switch (view) {
      case AppView.Dashboard: return 'Dashboard';
      case AppView.Contacts: return 'Contacts';
      case AppView.Rentals: return 'Rentals';
      case AppView.Repairs: return 'Repairs';
      case AppView.Notifications: return 'Notifications';
      case AppView.Reports: return 'Reports';
      case AppView.Users: return 'Users';
      case AppView.Settings: return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard />;
      case AppView.Users:
        return <Users users={users} currentUser={currentUser} onCreateUser={handleCreateUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} showNotification={showNotification} />;
      case AppView.Contacts:
        return <Contacts contacts={contacts} onCreateContact={handleCreateContact} onUpdateContact={handleUpdateContact} onDeleteContact={handleDeleteContact} showNotification={showNotification} />;
      case AppView.Settings:
        return <Settings 
                    onUpdateLogo={handleUpdateLogo} 
                    currentLogo={appLogo} 
                    smsSettings={smsSettings} 
                    onUpdateSmsSettings={handleUpdateSmsSettings} 
                    adminKey={adminKey} 
                    onUpdateAdminKey={handleUpdateAdminKey}
                    currentSplashLogo={splashLogo}
                    onUpdateSplashLogo={handleUpdateSplashLogo}
                    showNotification={showNotification}
                />;
      case AppView.Rentals:
        return <Rentals rentals={rentals} contacts={contacts} onCreateRental={handleCreateRental} onUpdateRental={handleUpdateRental} onDeleteRental={handleDeleteRental} showNotification={showNotification} />;
      case AppView.Repairs:
        return <Repairs repairs={repairs} contacts={contacts} onCreateRepair={handleCreateRepair} onUpdateRepair={handleUpdateRepair} onDeleteRepair={handleDeleteRepair} showNotification={showNotification} />;
      case AppView.Notifications:
        return <Notifications contacts={contacts} handleAction={handleAction} />;
      case AppView.Reports:
        return <Reports contacts={contacts} rentals={rentals} repairs={repairs} handleAction={handleAction} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {notification && <Notification message={notification} onClose={() => setNotification('')} />}
      {isActionLoading && <Spinner />}
      <Sidebar currentView={currentView} setCurrentView={handleViewChange} onLogout={handleLogout} appLogo={appLogo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header viewName={getViewName(currentView)} user={currentUser} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;