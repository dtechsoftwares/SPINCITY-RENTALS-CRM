

import React, { useState, useEffect } from 'react';
import { AppView, User, Contact, Rental, Repair, SmsSettings, InventoryItem, Sale, Vendor } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Rentals from './components/Rentals';
import Repairs from './components/Repairs';
import Inventory from './components/Inventory';
import SalesLog from './components/SalesLog';
import Vendors from './components/Vendors';
import Preloader from './components/Preloader';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Reports from './components/Reports';
import { loadUsers, saveUsers, loadCurrentUser, saveCurrentUser, clearCurrentUser, saveAppLogo, loadAppLogo, loadContacts, saveContacts, loadRentals, saveRentals, loadRepairs, saveRepairs, loadSmsSettings, saveSmsSettings, loadAdminKey, saveAdminKey, loadSplashLogo, saveSplashLogo, loadInventory, saveInventory, loadSales, saveSales, loadVendors, saveVendors } from './utils/storage';
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
  const [inventory, setInventory] = useState<InventoryItem[]>(loadInventory());
  const [sales, setSales] = useState<Sale[]>(loadSales());
  const [vendors, setVendors] = useState<Vendor[]>(loadVendors());
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
    showNotification(`Welcome, ${user.name}!`);
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

    const handleCreateInventory = (newItem: Omit<InventoryItem, 'id'>) => handleAction(() => {
        const updatedInventory = [{...newItem, id: Date.now()}, ...inventory];
        setInventory(updatedInventory);
        saveInventory(updatedInventory);
    });

    const handleUpdateInventory = (updatedItem: InventoryItem) => handleAction(() => {
        const updatedInventory = inventory.map(i => i.id === updatedItem.id ? updatedItem : i);
        setInventory(updatedInventory);
        saveInventory(updatedInventory);
    });

    const handleDeleteInventory = (itemId: number) => handleAction(() => {
        const updatedInventory = inventory.filter(i => i.id !== itemId);
        setInventory(updatedInventory);
        saveInventory(updatedInventory);
    });

    const handleCreateSale = (newSale: Omit<Sale, 'id'>) => handleAction(() => {
        const updatedSales = [{...newSale, id: Date.now()}, ...sales];
        setSales(updatedSales);
        saveSales(updatedSales);

        const updatedInventory = inventory.map(item => 
            item.id === newSale.itemId ? { ...item, status: 'Sold' as const } : item
        );
        setInventory(updatedInventory);
        saveInventory(updatedInventory);
    });

    const handleUpdateSale = (updatedSale: Sale) => handleAction(() => {
        const originalSale = sales.find(s => s.id === updatedSale.id);
        if (!originalSale) return;

        const updatedSales = sales.map(s => s.id === updatedSale.id ? updatedSale : s);
        setSales(updatedSales);
        saveSales(updatedSales);
        
        if (originalSale.itemId !== updatedSale.itemId) {
            const updatedInventory = inventory.map(item => {
                if (item.id === originalSale.itemId) {
                    return { ...item, status: 'Available' as const };
                }
                if (item.id === updatedSale.itemId) {
                    return { ...item, status: 'Sold' as const };
                }
                return item;
            });
            setInventory(updatedInventory);
            saveInventory(updatedInventory);
        }
    });

    const handleDeleteSale = (saleId: number) => handleAction(() => {
        const saleToDelete = sales.find(s => s.id === saleId);
        if (!saleToDelete) return;

        const updatedSales = sales.filter(s => s.id !== saleId);
        setSales(updatedSales);
        saveSales(updatedSales);
        
        const updatedInventory = inventory.map(item => 
            item.id === saleToDelete.itemId ? { ...item, status: 'Available' as const } : item
        );
        setInventory(updatedInventory);
        saveInventory(updatedInventory);
    });

    const handleCreateVendor = (newVendor: Omit<Vendor, 'id'>) => handleAction(() => {
        const updatedVendors = [{...newVendor, id: Date.now()}, ...vendors];
        setVendors(updatedVendors);
        saveVendors(updatedVendors);
    });

    const handleUpdateVendor = (updatedVendor: Vendor) => handleAction(() => {
        const updatedVendors = vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v);
        setVendors(updatedVendors);
        saveVendors(updatedVendors);
    });

    const handleDeleteVendor = (vendorId: number) => handleAction(() => {
        const updatedVendors = vendors.filter(v => v.id !== vendorId);
        setVendors(updatedVendors);
        saveVendors(updatedVendors);
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

  const isAdmin = currentUser.role === 'Admin';

  const getViewName = (view: AppView): string => {
    switch (view) {
      case AppView.Dashboard: return 'Dashboard';
      case AppView.Inventory: return 'Inventory Management';
      case AppView.Contacts: return 'Contacts';
      case AppView.Rentals: return 'Rentals';
      case AppView.SalesLog: return 'Sales Log';
      case AppView.Repairs: return 'Repairs';
      case AppView.Notifications: return 'Notifications';
      case AppView.Reports: return 'Reports';
      case AppView.Vendors: return 'Vendor Management';
      case AppView.Users: return 'Users';
      case AppView.Settings: return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderView = () => {
    const adminOnlyViews = [AppView.Users, AppView.Settings, AppView.Notifications, AppView.Reports];
    if (!isAdmin && adminOnlyViews.includes(currentView)) {
        // If a non-admin tries to access an admin view, show dashboard instead
        return <Dashboard contacts={contacts} rentals={rentals} repairs={repairs} users={users} />;
    }

    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard contacts={contacts} rentals={rentals} repairs={repairs} users={users} />;
      case AppView.Inventory:
        return <Inventory inventory={inventory} vendors={vendors} currentUser={currentUser} onCreateItem={handleCreateInventory} onUpdateItem={handleUpdateInventory} onDeleteItem={handleDeleteInventory} showNotification={showNotification} />;
      case AppView.SalesLog:
        return <SalesLog sales={sales} inventory={inventory} currentUser={currentUser} onCreateSale={handleCreateSale} onUpdateSale={handleUpdateSale} onDeleteSale={handleDeleteSale} showNotification={showNotification} />;
      case AppView.Vendors:
        return <Vendors vendors={vendors} inventory={inventory} currentUser={currentUser} onCreateVendor={handleCreateVendor} onUpdateVendor={handleUpdateVendor} onDeleteVendor={handleDeleteVendor} showNotification={showNotification} />;
      case AppView.Users:
        return <Users users={users} currentUser={currentUser} onCreateUser={handleCreateUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} showNotification={showNotification} />;
      case AppView.Contacts:
        return <Contacts contacts={contacts} currentUser={currentUser} onCreateContact={handleCreateContact} onUpdateContact={handleUpdateContact} onDeleteContact={handleDeleteContact} showNotification={showNotification} />;
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
        return <Rentals rentals={rentals} contacts={contacts} currentUser={currentUser} onCreateRental={handleCreateRental} onUpdateRental={handleUpdateRental} onDeleteRental={handleDeleteRental} showNotification={showNotification} />;
      case AppView.Repairs:
        return <Repairs repairs={repairs} contacts={contacts} currentUser={currentUser} onCreateRepair={handleCreateRepair} onUpdateRepair={handleUpdateRepair} onDeleteRepair={handleDeleteRepair} showNotification={showNotification} />;
      case AppView.Notifications:
        return <Notifications contacts={contacts} handleAction={handleAction} smsSettings={smsSettings} showNotification={showNotification} />;
      case AppView.Reports:
        return <Reports contacts={contacts} rentals={rentals} repairs={repairs} handleAction={handleAction} />;
      default:
        return <Dashboard contacts={contacts} rentals={rentals} repairs={repairs} users={users} />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {notification && <Notification message={notification} onClose={() => setNotification('')} />}
      {isActionLoading && <Spinner />}
      <Sidebar currentView={currentView} setCurrentView={handleViewChange} onLogout={handleLogout} appLogo={appLogo} currentUser={currentUser} />
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