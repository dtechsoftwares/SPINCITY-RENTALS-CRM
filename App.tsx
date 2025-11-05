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
import * as db from './utils/storage';
import { getTodayDateString } from './utils/dates';
import Spinner from './components/Spinner';
import Notification from './components/Notification';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const DemoModeBanner = () => (
    <div className="bg-yellow-100 border-b-2 border-yellow-300 text-yellow-800 p-3 text-center text-sm w-full">
        <strong>Demo Mode:</strong> Firebase is not configured. All data is stored in your browser and will be lost if you clear your cache.
        Update <code className="font-mono bg-yellow-200 p-1 rounded">utils/storage.ts</code> to connect to a database.
    </div>
);

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
  const [appLoading, setAppLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [splashLogo, setSplashLogo] = useState<string | null>(null);
  const [smsSettings, setSmsSettings] = useState<SmsSettings>({ apiKey: '', senderId: '', endpointUrl: '' });
  const [adminKey, setAdminKey] = useState<string>('');
  
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      // Load settings first as they are needed for preloader/login
      setSplashLogo(await db.loadSplashLogo());
      setAdminKey(await db.loadAdminKey());

      if (db.isFirebaseConfigured()) {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            setIsActionLoading(true);
            if (firebaseUser) {
              const loadedUsers = await db.loadUsers();
              setUsers(loadedUsers);
              const appUser = loadedUsers.find(u => u.email.toLowerCase() === firebaseUser.email?.toLowerCase());
              setCurrentUser(appUser || null);

              if (appUser) {
                setContacts(await db.loadContacts());
                setRentals(await db.loadRentals());
                setRepairs(await db.loadRepairs());
                setInventory(await db.loadInventory());
                setSales(await db.loadSales());
                setVendors(await db.loadVendors());
                setAppLogo(await db.loadAppLogo());
                setSmsSettings(await db.loadSmsSettings());
              }
            } else {
              setCurrentUser(null);
              setUsers(await db.loadUsers()); // still load users for registration check
            }
          } catch (error) {
            console.error("Error during auth state change processing:", error instanceof Error ? error.message : String(error));
            showNotification('Failed to load user data.');
          } finally {
            setAppLoading(false);
            setIsActionLoading(false);
          }
        });
        return () => unsubscribe();
      } else {
        // Demo Mode: Load from localStorage
        setIsActionLoading(true);
        const loadedUsers = await db.loadUsers();
        setUsers(loadedUsers);
        const loggedInUser = await db.loadCurrentUser();
        setCurrentUser(loggedInUser);

        if (loggedInUser) {
          setContacts(await db.loadContacts());
          setRentals(await db.loadRentals());
          setRepairs(await db.loadRepairs());
          setInventory(await db.loadInventory());
          setSales(await db.loadSales());
          setVendors(await db.loadVendors());
          setAppLogo(await db.loadAppLogo());
          setSmsSettings(await db.loadSmsSettings());
        }
        setAppLoading(false);
        setIsActionLoading(false);
      }
    };

    loadInitialData().catch(error => {
        console.error("Failed to load initial app data:", error instanceof Error ? error.message : String(error));
        showNotification('A critical error occurred while loading the app.');
        setAppLoading(false); // Ensure app doesn't hang on preloader
    });
  }, []);
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAction = async (action: () => void | Promise<any>) => {
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const result = await action();
      return result;
    } catch (error) {
      console.error("An error occurred during the action:", error instanceof Error ? error.message : String(error));
      showNotification('An error occurred. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewChange = (view: AppView) => {
    if (view === currentView) return;
    // Use the action handler to show spinner for view changes for better UX feedback.
    handleAction(() => {
        setCurrentView(view);
    });
  };

  const handleLogin = (user: User) => {
    if (!db.isFirebaseConfigured()) {
        handleAction(() => db.saveCurrentUser(user));
    }
    setCurrentUser(user);
    handleViewChange(AppView.Dashboard);
    showNotification(`Welcome back, ${user.name}!`);
  };

  // --- Internal Unwrapped Functions ---
  const internalCreateUser = async (newUser: Omit<User, 'id'>) => {
    const createdUser = await db.createUser(newUser);
    setUsers(users => [...users, createdUser]);
    return createdUser;
  };
  
  const internalUpdateInventory = async (updatedItem: InventoryItem) => {
    await db.updateInventory(updatedItem);
    setInventory(inventory => inventory.map(i => i.id === updatedItem.id ? updatedItem : i));
  };


  // --- Wrapped Handlers for Components ---
  const handleRegisterSuccess = (newUser: Omit<User, 'id'>) => handleAction(async () => {
    const createdUser = await internalCreateUser(newUser);
    if(createdUser) {
        if (!db.isFirebaseConfigured()) {
            await db.saveCurrentUser(createdUser);
        }
        setCurrentUser(createdUser);
        handleViewChange(AppView.Dashboard);
    }
  });

  const handleLogout = () => handleAction(async () => {
    if (db.isFirebaseConfigured()) {
        await signOut(getAuth());
    } else {
        await db.clearCurrentUser();
    }
    setCurrentUser(null);
  });
  
  const handleCreateUser = (newUser: Omit<User, 'id'>) => handleAction(async () => {
    return await internalCreateUser(newUser);
  });
  
  const handleUpdateUser = (updatedUser: User) => handleAction(async () => {
    await db.updateUser(updatedUser);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
        if (!db.isFirebaseConfigured()) {
            await db.saveCurrentUser(updatedUser);
        }
    }
  });
  
  const handleDeleteUser = (userId: string) => handleAction(async () => {
    await db.deleteUser(userId);
    setUsers(users.filter(u => u.id !== userId));
  });

  const handleUpdateLogo = (logo: string | null) => handleAction(async () => {
    await db.saveAppLogo(logo);
    setAppLogo(logo);
  });

  const handleUpdateSplashLogo = (logo: string | null) => handleAction(async () => {
    await db.saveSplashLogo(logo);
    setSplashLogo(logo);
  });

  const handleCreateContact = (newContact: Omit<Contact, 'id'>) => handleAction(async () => {
    const contactWithDate = { ...newContact, createdAt: getTodayDateString() };
    const createdContact = await db.createContact(contactWithDate);
    setContacts([createdContact, ...contacts]);
  });
  
  const handleUpdateContact = (updatedContact: Contact) => handleAction(async () => {
    await db.updateContact(updatedContact);
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
  });
  
  const handleDeleteContact = (contactId: string) => handleAction(async () => {
    await db.deleteContact(contactId);
    setContacts(contacts.filter(c => c.id !== contactId));
  });

  const handleCreateRental = (newRental: Omit<Rental, 'id'>) => handleAction(async () => {
    const createdRental = await db.createRental(newRental);
    setRentals([createdRental, ...rentals]);
  });

  const handleUpdateRental = (updatedRental: Rental) => handleAction(async () => {
    await db.updateRental(updatedRental);
    setRentals(rentals.map(r => r.id === updatedRental.id ? updatedRental : r));
  });

  const handleDeleteRental = (rentalId: string) => handleAction(async () => {
    await db.deleteRental(rentalId);
    setRentals(rentals.filter(r => r.id !== rentalId));
  });

  const handleCreateRepair = (newRepair: Omit<Repair, 'id'>) => handleAction(async () => {
    const createdRepair = await db.createRepair(newRepair);
    setRepairs([createdRepair, ...repairs]);
  });

  const handleUpdateRepair = (updatedRepair: Repair) => handleAction(async () => {
    await db.updateRepair(updatedRepair);
    setRepairs(repairs.map(r => r.id === updatedRepair.id ? updatedRepair : r));
  });

  const handleDeleteRepair = (repairId: string) => handleAction(async () => {
    await db.deleteRepair(repairId);
    setRepairs(repairs.filter(r => r.id !== repairId));
  });

  const handleCreateInventory = (newItem: Omit<InventoryItem, 'id'>) => handleAction(async () => {
    const createdItem = await db.createInventory(newItem);
    setInventory([createdItem, ...inventory]);
  });

  const handleUpdateInventory = (updatedItem: InventoryItem) => handleAction(() => internalUpdateInventory(updatedItem));

  const handleDeleteInventory = (itemId: string) => handleAction(async () => {
    await db.deleteInventory(itemId);
    setInventory(inventory.filter(i => i.id !== itemId));
  });

  const handleCreateSale = (newSale: Omit<Sale, 'id'>) => handleAction(async () => {
    const createdSale = await db.createSale(newSale);
    setSales(sales => [createdSale, ...sales]);
    const soldItem = inventory.find(i => i.id === newSale.itemId);
    if(soldItem) {
        await internalUpdateInventory({ ...soldItem, status: 'Sold' });
    }
  });

  const handleUpdateSale = (updatedSale: Sale) => handleAction(async () => {
    const originalSale = sales.find(s => s.id === updatedSale.id);
    await db.updateSale(updatedSale);
    setSales(sales.map(s => s.id === updatedSale.id ? updatedSale : s));

    if (originalSale && originalSale.itemId !== updatedSale.itemId) {
        const oldItem = inventory.find(i => i.id === originalSale.itemId);
        const newItem = inventory.find(i => i.id === updatedSale.itemId);
        if(oldItem) await internalUpdateInventory({ ...oldItem, status: 'Available' });
        if(newItem) await internalUpdateInventory({ ...newItem, status: 'Sold' });
    }
  });

  const handleDeleteSale = (saleId: string) => handleAction(async () => {
    const saleToDelete = sales.find(s => s.id === saleId);
    await db.deleteSale(saleId);
    setSales(sales.filter(s => s.id !== saleId));
    if(saleToDelete) {
        const item = inventory.find(i => i.id === saleToDelete.itemId);
        if(item) await internalUpdateInventory({ ...item, status: 'Available' });
    }
  });

  const handleCreateVendor = (newVendor: Omit<Vendor, 'id'>) => handleAction(async () => {
    const createdVendor = await db.createVendor(newVendor);
    setVendors([createdVendor, ...vendors]);
  });

  const handleUpdateVendor = (updatedVendor: Vendor) => handleAction(async () => {
    await db.updateVendor(updatedVendor);
    setVendors(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
  });

  const handleDeleteVendor = (vendorId: string) => handleAction(async () => {
    await db.deleteVendor(vendorId);
    setVendors(vendors.filter(v => v.id !== vendorId));
  });

  const handleUpdateSmsSettings = (settings: SmsSettings) => handleAction(async () => {
    await db.saveSmsSettings(settings);
    setSmsSettings(settings);
  });
  
  const handleUpdateAdminKey = (key: string) => handleAction(async () => {
    await db.saveAdminKey(key);
    setAdminKey(key);
    showNotification('Admin Registration Key updated successfully!');
  });

  if (appLoading) {
    return <Preloader splashLogo={splashLogo} />;
  }

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} onRegisterSuccess={handleRegisterSuccess} adminKey={adminKey} splashLogo={splashLogo} isFirebaseConfigured={db.isFirebaseConfigured()} />;
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
        return <Dashboard contacts={contacts} rentals={rentals} repairs={repairs} users={users} />;
    }

    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard contacts={contacts} rentals={rentals} repairs={repairs} users={users} />;
      case AppView.Inventory:
        return <Inventory inventory={inventory} vendors={vendors} currentUser={currentUser} onCreateItem={handleCreateInventory} onUpdateItem={handleUpdateInventory} onDeleteItem={handleDeleteInventory} showNotification={showNotification} adminKey={adminKey} />;
      case AppView.SalesLog:
        return <SalesLog sales={sales} inventory={inventory} currentUser={currentUser} onCreateSale={handleCreateSale} onUpdateSale={handleUpdateSale} onDeleteSale={handleDeleteSale} showNotification={showNotification} adminKey={adminKey} />;
      case AppView.Vendors:
        return <Vendors vendors={vendors} inventory={inventory} currentUser={currentUser} onCreateVendor={handleCreateVendor} onUpdateVendor={handleUpdateVendor} onDeleteVendor={handleDeleteVendor} showNotification={showNotification} adminKey={adminKey} />;
      case AppView.Users:
        return <Users users={users} currentUser={currentUser} onCreateUser={handleCreateUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} showNotification={showNotification} adminKey={adminKey} />;
      case AppView.Contacts:
        return <Contacts contacts={contacts} currentUser={currentUser} onCreateContact={handleCreateContact} onUpdateContact={handleUpdateContact} onDeleteContact={handleDeleteContact} showNotification={showNotification} adminKey={adminKey} />;
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
        return <Rentals rentals={rentals} contacts={contacts} currentUser={currentUser} onCreateRental={handleCreateRental} onUpdateRental={handleUpdateRental} onDeleteRental={handleDeleteRental} showNotification={showNotification} adminKey={adminKey} />;
      case AppView.Repairs:
        return <Repairs repairs={repairs} contacts={contacts} currentUser={currentUser} onCreateRepair={handleCreateRepair} onUpdateRepair={handleUpdateRepair} onDeleteRepair={handleDeleteRepair} showNotification={showNotification} adminKey={adminKey} />;
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
        {!db.isFirebaseConfigured() && <DemoModeBanner />}
        <Header viewName={getViewName(currentView)} user={currentUser} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;