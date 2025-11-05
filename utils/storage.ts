import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch, getDoc, Firestore } from 'firebase/firestore';
import { User, Contact, Rental, Repair, SmsSettings, InventoryItem, Sale, Vendor } from '../types';
import { getTodayDateString } from './dates';

// IMPORTANT: Replace with your actual Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDvTLdwXoVkXmZJqZuV15KZG07dw1cG18",
  authDomain: "spincitycrm.firebaseapp.com",
  projectId: "spincitycrm",
  storageBucket: "spincitycrm.firebaseapp.com",
  messagingSenderId: "589728984815",
  appId: "1:589728984815:web:240625c48b39230a7c351a"
};

export const isFirebaseConfigured = (): boolean => {
    return firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

let db: Firestore;

if (isFirebaseConfigured()) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} else {
    console.warn("Firebase is not configured. Running in Demo Mode. Please update firebaseConfig in utils/storage.ts");
}


// --- LOCAL STORAGE FALLBACK ---

const localStorageKeys = {
    users: 'crm_users',
    contacts: 'crm_contacts',
    rentals: 'crm_rentals',
    repairs: 'crm_repairs',
    inventory: 'crm_inventory',
    sales: 'crm_sales',
    vendors: 'crm_vendors',
    settingsSms: 'crm_settings_sms',
    settingsAdminKey: 'crm_settings_admin_key',
    settingsAppLogo: 'crm_settings_app_logo',
    settingsSplashLogo: 'crm_settings_splash_logo',
    currentUser: 'crm_current_user',
};

const defaultUsers: Omit<User, 'id'>[] = [];

const loadFromStorage = <T extends {id: string}>(key: string, defaultValue: T[] = [], seedData: Omit<T, 'id'>[] = []): T[] => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
        if (seedData.length > 0) {
            const seeded = seedData.map((item, index) => ({ ...item, id: (Date.now() + index).toString() } as T));
            localStorage.setItem(key, JSON.stringify(seeded));
            return seeded;
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from localStorage`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, data: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
    }
};


// --- Collection References ---
const usersCollection = () => collection(db, 'users');
const contactsCollection = () => collection(db, 'contacts');
const rentalsCollection = () => collection(db, 'rentals');
const repairsCollection = () => collection(db, 'repairs');
const inventoryCollection = () => collection(db, 'inventory');
const salesCollection = () => collection(db, 'sales');
const vendorsCollection = () => collection(db, 'vendors');
const settingsCollection = () => collection(db, 'settings');


// --- Generic Helper Functions ---
const fetchData = async <T>(getCol: () => any, lsKey: string, seedData: any[] = []): Promise<T[]> => {
    if (isFirebaseConfigured()) {
        const col = getCol();
        try {
            const snapshot = await getDocs(col);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
        } catch (e) {
            console.error(`Failed to load ${col.path} from Firestore`, e);
            return [];
        }
    } else {
        return Promise.resolve(loadFromStorage(lsKey, [], seedData));
    }
};

const createData = async <T extends {id: string}>(getCol: () => any, lsKey: string, data: Omit<T, 'id'>): Promise<T> => {
    if (isFirebaseConfigured()) {
        const docRef = await addDoc(getCol(), data);
        return { id: docRef.id, ...data } as T;
    } else {
        const items = loadFromStorage<T>(lsKey);
        const newItem = { ...data, id: Date.now().toString() } as T;
        saveToStorage(lsKey, [...items, newItem]);
        return Promise.resolve(newItem);
    }
};

const updateData = async <T extends {id: string}>(getCol: () => any, lsKey: string, data: T): Promise<void> => {
    if (isFirebaseConfigured()) {
        const col = getCol();
        const docRef = doc(col, data.id);
        const { id, ...dataToUpdate } = data;
        await updateDoc(docRef, dataToUpdate);
    } else {
        const items = loadFromStorage<T>(lsKey);
        const updatedItems = items.map(item => item.id === data.id ? data : item);
        saveToStorage(lsKey, updatedItems);
        return Promise.resolve();
    }
};

const deleteData = async (getCol: () => any, lsKey: string, id: string): Promise<void> => {
    if (isFirebaseConfigured()) {
        const col = getCol();
        const docRef = doc(col, id);
        await deleteDoc(docRef);
    } else {
        const items = loadFromStorage<{id: string}>(lsKey);
        const updatedItems = items.filter(item => item.id !== id);
        saveToStorage(lsKey, updatedItems);
        return Promise.resolve();
    }
};


// --- Users ---
export const loadUsers = (): Promise<User[]> => fetchData<User>(usersCollection, localStorageKeys.users, defaultUsers);
export const createUser = (user: Omit<User, 'id'>) => createData<User>(usersCollection, localStorageKeys.users, user);
export const updateUser = (user: User) => updateData<User>(usersCollection, localStorageKeys.users, user);
export const deleteUser = (id: string) => deleteData(usersCollection, localStorageKeys.users, id);

// --- Contacts ---
export const loadContacts = (): Promise<Contact[]> => fetchData<Contact>(contactsCollection, localStorageKeys.contacts);
export const createContact = (contact: Omit<Contact, 'id'>) => createData<Contact>(contactsCollection, localStorageKeys.contacts, contact);
export const updateContact = (contact: Contact) => updateData<Contact>(contactsCollection, localStorageKeys.contacts, contact);
export const deleteContact = (id: string) => deleteData(contactsCollection, localStorageKeys.contacts, id);

// --- Rentals ---
export const loadRentals = (): Promise<Rental[]> => fetchData<Rental>(rentalsCollection, localStorageKeys.rentals);
export const createRental = (rental: Omit<Rental, 'id'>) => createData<Rental>(rentalsCollection, localStorageKeys.rentals, rental);
export const updateRental = (rental: Rental) => updateData<Rental>(rentalsCollection, localStorageKeys.rentals, rental);
export const deleteRental = (id: string) => deleteData(rentalsCollection, localStorageKeys.rentals, id);

// --- Repairs ---
export const loadRepairs = (): Promise<Repair[]> => fetchData<Repair>(repairsCollection, localStorageKeys.repairs);
export const createRepair = (repair: Omit<Repair, 'id'>) => createData<Repair>(repairsCollection, localStorageKeys.repairs, repair);
export const updateRepair = (repair: Repair) => updateData<Repair>(repairsCollection, localStorageKeys.repairs, repair);
export const deleteRepair = (id: string) => deleteData(repairsCollection, localStorageKeys.repairs, id);

// --- Inventory ---
export const loadInventory = (): Promise<InventoryItem[]> => fetchData<InventoryItem>(inventoryCollection, localStorageKeys.inventory);
export const createInventory = (item: Omit<InventoryItem, 'id'>) => createData<InventoryItem>(inventoryCollection, localStorageKeys.inventory, item);
export const updateInventory = (item: InventoryItem) => updateData<InventoryItem>(inventoryCollection, localStorageKeys.inventory, item);
export const deleteInventory = (id: string) => deleteData(inventoryCollection, localStorageKeys.inventory, id);

// --- Sales ---
export const loadSales = (): Promise<Sale[]> => fetchData<Sale>(salesCollection, localStorageKeys.sales);
export const createSale = (sale: Omit<Sale, 'id'>) => createData<Sale>(salesCollection, localStorageKeys.sales, sale);
export const updateSale = (sale: Sale) => updateData<Sale>(salesCollection, localStorageKeys.sales, sale);
export const deleteSale = (id: string) => deleteData(salesCollection, localStorageKeys.sales, id);

// --- Vendors ---
export const loadVendors = (): Promise<Vendor[]> => fetchData<Vendor>(vendorsCollection, localStorageKeys.vendors);
export const createVendor = (vendor: Omit<Vendor, 'id'>) => createData<Vendor>(vendorsCollection, localStorageKeys.vendors, vendor);
export const updateVendor = (vendor: Vendor) => updateData<Vendor>(vendorsCollection, localStorageKeys.vendors, vendor);
export const deleteVendor = (id: string) => deleteData(vendorsCollection, localStorageKeys.vendors, id);


// --- Settings ---
const loadSetting = async <T>(docId: string, lsKey: string, defaultValue: T): Promise<T> => {
    if (isFirebaseConfigured()) {
        try {
            const docRef = doc(settingsCollection(), docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // Firestore returns the whole document, we need the value
                return (docSnap.data() as { value: T }).value;
            } else {
                await setDoc(docRef, { value: defaultValue });
                return defaultValue;
            }
        } catch (e) {
            console.error(`Failed to load setting ${docId}`, e);
            return defaultValue;
        }
    } else {
        const stored = localStorage.getItem(lsKey);
        return stored ? JSON.parse(stored) : defaultValue;
    }
};

const saveSetting = async <T>(docId: string, lsKey: string, data: T): Promise<void> => {
    if (isFirebaseConfigured()) {
        try {
            const docRef = doc(settingsCollection(), docId);
            // Store data under a 'value' field to keep it consistent
            await setDoc(docRef, { value: data }, { merge: true });
        } catch (e) {
            console.error(`Failed to save setting ${docId}`, e);
        }
    } else {
        saveToStorage(lsKey, data);
        return Promise.resolve();
    }
};

const defaultSmsSettings: SmsSettings = {
    apiKey: 'ae124c42ccedc3deea464278c208c7aa2aaac458f1d09f1919b047140c76cb87',
    senderId: 'SpinCity',
    endpointUrl: 'https://api.smsonlinegh.com/v5/message/sms/send',
};

export const loadSmsSettings = (): Promise<SmsSettings> => loadSetting('sms', localStorageKeys.settingsSms, defaultSmsSettings);
export const saveSmsSettings = (settings: SmsSettings): Promise<void> => saveSetting('sms', localStorageKeys.settingsSms, settings);

export const loadAdminKey = (): Promise<string> => loadSetting('adminKey', localStorageKeys.settingsAdminKey, 'admin');
export const saveAdminKey = (key: string): Promise<void> => saveSetting('adminKey', localStorageKeys.settingsAdminKey, key);

export const loadAppLogo = (): Promise<string | null> => loadSetting('appLogo', localStorageKeys.settingsAppLogo, null);
export const saveAppLogo = (logo: string | null): Promise<void> => saveSetting('appLogo', localStorageKeys.settingsAppLogo, logo);

export const loadSplashLogo = (): Promise<string | null> => loadSetting('splashLogo', localStorageKeys.settingsSplashLogo, null);
export const saveSplashLogo = (logo: string | null): Promise<void> => saveSetting('splashLogo', localStorageKeys.settingsSplashLogo, logo);

// --- Current User (localStorage only) ---
export const saveCurrentUser = async (user: User): Promise<void> => {
    if(!isFirebaseConfigured()) saveToStorage(localStorageKeys.currentUser, user);
};
export const loadCurrentUser = async (): Promise<User | null> => {
    if(isFirebaseConfigured()) return null; // Handled by onAuthStateChanged
    const stored = localStorage.getItem(localStorageKeys.currentUser);
    return stored ? JSON.parse(stored) : null;
};
export const clearCurrentUser = async (): Promise<void> => {
    if(!isFirebaseConfigured()) localStorage.removeItem(localStorageKeys.currentUser);
};