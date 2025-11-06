import { User, Contact, Rental, Repair, SmsSettings, InventoryItem, Sale, Vendor } from '../types';
import { getTodayDateString } from './dates';

// --- LocalStorage Helper Functions ---
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
    }
};

// --- Generic Data Operations ---
const fetchData = <T extends { id: string }>(key: string): T[] => {
    const items = getFromStorage<T[]>(key, []);
    // Simple reverse sort to mimic 'desc' order. Adjust if a real date field is needed.
    return items.reverse();
};

const createData = <T extends { id?: string }>(key: string, newData: Omit<T, 'id'>): T => {
    const items = getFromStorage<any[]>(key, []);
    const newItem = { ...newData, id: Date.now().toString() };
    saveToStorage(key, [...items, newItem]);
    return newItem as T;
};

const updateData = <T extends { id: string }>(key: string, updatedItem: T): void => {
    const items = getFromStorage<T[]>(key, []);
    const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    saveToStorage(key, updatedItems);
};

const deleteData = (key: string, id: string): void => {
    const items = getFromStorage<any[]>(key, []);
    const filteredItems = items.filter(item => item.id !== id);
    saveToStorage(key, filteredItems);
};


// --- Users ---
export const loadUsers = (): User[] => getFromStorage<User[]>('crm_users', []);
export const saveUsers = (users: User[]): void => saveToStorage('crm_users', users);
export const createUser = (user: Omit<User, 'id'>): User => createData<User>('crm_users', user);
export const updateUser = (user: User): void => updateData<User>('crm_users', user);
export const deleteUser = (id: string): void => deleteData('crm_users', id);

// --- Contacts ---
export const loadContacts = (): Contact[] => fetchData<Contact>('crm_contacts');
export const createContact = (contact: Omit<Contact, 'id'>) => createData<Contact>('crm_contacts', { ...contact, createdAt: getTodayDateString() });
export const updateContact = (contact: Contact) => updateData<Contact>('crm_contacts', contact);
export const deleteContact = (id: string) => deleteData('crm_contacts', id);

// --- Rentals ---
export const loadRentals = (): Rental[] => fetchData<Rental>('crm_rentals');
export const createRental = (rental: Omit<Rental, 'id'>) => createData<Rental>('crm_rentals', rental);
export const updateRental = (rental: Rental) => updateData<Rental>('crm_rentals', rental);
export const deleteRental = (id: string) => deleteData('crm_rentals', id);

// --- Repairs ---
export const loadRepairs = (): Repair[] => fetchData<Repair>('crm_repairs');
export const createRepair = (repair: Omit<Repair, 'id'>) => createData<Repair>('crm_repairs', repair);
export const updateRepair = (repair: Repair) => updateData<Repair>('crm_repairs', repair);
export const deleteRepair = (id: string) => deleteData('crm_repairs', id);

// --- Inventory ---
export const loadInventory = (): InventoryItem[] => fetchData<InventoryItem>('crm_inventory');
export const createInventory = (item: Omit<InventoryItem, 'id'>) => createData<InventoryItem>('crm_inventory', item);
export const updateInventory = (item: InventoryItem) => updateData<InventoryItem>('crm_inventory', item);
export const deleteInventory = (id: string) => deleteData('crm_inventory', id);

// --- Sales ---
export const loadSales = (): Sale[] => fetchData<Sale>('crm_sales');
export const createSale = (sale: Omit<Sale, 'id'>) => createData<Sale>('crm_sales', sale);
export const updateSale = (sale: Sale) => updateData<Sale>('crm_sales', sale);
export const deleteSale = (id: string) => deleteData('crm_sales', id);

// --- Vendors ---
export const loadVendors = (): Vendor[] => fetchData<Vendor>('crm_vendors');
export const createVendor = (vendor: Omit<Vendor, 'id'>) => createData<Vendor>('crm_vendors', vendor);
export const updateVendor = (vendor: Vendor) => updateData<Vendor>('crm_vendors', vendor);
export const deleteVendor = (id: string) => deleteData('crm_vendors', id);

// --- Settings ---
const defaultSmsSettings: SmsSettings = {
    apiKey: 'ae124c42ccedc3deea464278c208c7aa2aaac458f1d09f1919b047140c76cb87',
    senderId: 'SpinCity',
    endpointUrl: 'https://api.smsonlinegh.com/v5/message/sms/send',
};

export const loadSmsSettings = (): SmsSettings => getFromStorage('crm_smsSettings', defaultSmsSettings);
export const saveSmsSettings = (settings: SmsSettings): void => saveToStorage('crm_smsSettings', settings);

export const loadAdminKey = (): string => getFromStorage('crm_adminKey', 'admin');
export const saveAdminKey = (key: string): void => saveToStorage('crm_adminKey', key);

export const loadAppLogo = (): string | null => getFromStorage('crm_appLogo', null);
export const saveAppLogo = (logo: string | null): void => saveToStorage('crm_appLogo', logo);

export const loadSplashLogo = (): string | null => getFromStorage('crm_splashLogo', null);
export const saveSplashLogo = (logo: string | null): void => saveToStorage('crm_splashLogo', logo);


// --- Authentication ---
export const getCurrentUserId = (): string | null => getFromStorage('crm_currentUserId', null);
export const setCurrentUserId = (userId: string | null): void => saveToStorage('crm_currentUserId', userId);


// --- Backup & Restore ---
export const getBackupData = (): string => {
    const data = {
        users: loadUsers(),
        contacts: loadContacts(),
        rentals: loadRentals(),
        repairs: loadRepairs(),
        inventory: loadInventory(),
        sales: loadSales(),
        vendors: loadVendors(),
        settings: {
            sms: loadSmsSettings(),
            adminKey: loadAdminKey(),
            appLogo: loadAppLogo(),
            splashLogo: loadSplashLogo(),
        }
    };
    return JSON.stringify(data, null, 2);
};

export const restoreBackupData = (jsonData: string): { success: boolean, message: string } => {
    try {
        const data = JSON.parse(jsonData);

        if (!data.users || !data.contacts || !data.settings) {
            return { success: false, message: 'Invalid backup file structure.' };
        }

        saveToStorage('crm_users', data.users || []);
        saveToStorage('crm_contacts', data.contacts || []);
        saveToStorage('crm_rentals', data.rentals || []);
        saveToStorage('crm_repairs', data.repairs || []);
        saveToStorage('crm_inventory', data.inventory || []);
        saveToStorage('crm_sales', data.sales || []);
        saveToStorage('crm_vendors', data.vendors || []);
        
        if(data.settings) {
            saveToStorage('crm_smsSettings', data.settings.sms || defaultSmsSettings);
            saveToStorage('crm_adminKey', data.settings.adminKey || 'admin');
            saveToStorage('crm_appLogo', data.settings.appLogo || null);
            saveToStorage('crm_splashLogo', data.settings.splashLogo || null);
        }

        return { success: true, message: 'Data restored successfully! The application will now reload.' };
    } catch (error) {
        console.error("Restore error:", error);
        return { success: false, message: 'Failed to parse backup file. Please ensure it is a valid JSON file.' };
    }
};