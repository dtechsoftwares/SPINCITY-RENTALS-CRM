

import { User, Contact, Rental, Repair, SmsSettings, InventoryItem, Sale, Vendor } from '../types';
import { getTodayDateString } from './dates';

const USERS_KEY = 'spincity_users';
const CURRENT_USER_KEY = 'spincity_current_user';
const APP_LOGO_KEY = 'spincity_app_logo';
const CONTACTS_KEY = 'spincity_contacts';
const RENTALS_KEY = 'spincity_rentals';
const REPAIRS_KEY = 'spincity_repairs';
const INVENTORY_KEY = 'spincity_inventory';
const SALES_KEY = 'spincity_sales';
const VENDORS_KEY = 'spincity_vendors';
const SMS_SETTINGS_KEY = 'spincity_sms_settings';
const ADMIN_KEY = 'spincity_admin_key';
const SPLASH_LOGO_KEY = 'spincity_splash_logo';


const defaultUsers: User[] = [
    { id: 2, name: 'Admin User', email: 'admin@spincity.com', password: 'admin', role: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40' },
];

const defaultContacts: Contact[] = [];
const defaultRentals: Rental[] = [];
const defaultRepairs: Repair[] = [];
const defaultInventory: InventoryItem[] = [];
const defaultSales: Sale[] = [];
const defaultVendors: Vendor[] = [];
const defaultSmsSettings: SmsSettings = {
    apiKey: 'ae124c42ccedc3deea464278c208c7aa2aaac458f1d09f1919b047140c76cb87',
    senderId: 'SpinCity',
    endpointUrl: 'https://api.smsonlinegh.com/v5/message/sms/send',
};
const defaultAdminKey = 'admin';

// Ensure new contacts get a creation date for reporting
const ensureContactsHaveDate = (contacts: any[]): Contact[] => {
    return contacts.map(c => ({...c, createdAt: c.createdAt || getTodayDateString()}))
}


export const loadUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        if (!usersJson) {
            // If no users in storage, load default admin and save them
            saveUsers(defaultUsers);
            return defaultUsers;
        }
        return JSON.parse(usersJson);
    } catch (e) {
        console.error("Failed to load users from localStorage", e);
        return defaultUsers;
    }
};

export const saveUsers = (users: User[]) => {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users to localStorage", e);
    }
};

export const loadCurrentUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error("Failed to load current user from localStorage", e);
        return null;
    }
};

export const saveCurrentUser = (user: User) => {
    try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
        console.error("Failed to save current user to localStorage", e);
    }
};

export const clearCurrentUser = () => {
    try {
        localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
        console.error("Failed to clear current user from localStorage", e);
    }
};

export const saveAppLogo = (logo: string | null) => {
    try {
        if (logo) {
            localStorage.setItem(APP_LOGO_KEY, logo);
        } else {
            localStorage.removeItem(APP_LOGO_KEY);
        }
    } catch (e) {
        console.error("Failed to save app logo to localStorage", e);
    }
};

export const loadAppLogo = (): string | null => {
    try {
        return localStorage.getItem(APP_LOGO_KEY);
    } catch (e) {
        console.error("Failed to load app logo from localStorage", e);
        return null;
    }
};

export const saveSplashLogo = (logo: string | null) => {
    try {
        if (logo) {
            localStorage.setItem(SPLASH_LOGO_KEY, logo);
        } else {
            localStorage.removeItem(SPLASH_LOGO_KEY);
        }
    } catch (e) {
        console.error("Failed to save splash logo to localStorage", e);
    }
};

export const loadSplashLogo = (): string | null => {
    try {
        return localStorage.getItem(SPLASH_LOGO_KEY);
    } catch (e) {
        console.error("Failed to load splash logo from localStorage", e);
        return null;
    }
};


export const loadContacts = (): Contact[] => {
    try {
        const contactsJson = localStorage.getItem(CONTACTS_KEY);
        const contacts = contactsJson ? JSON.parse(contactsJson) : [];
        return ensureContactsHaveDate(contacts);
    } catch (e) {
        console.error("Failed to load contacts from localStorage", e);
        return defaultContacts;
    }
};

export const saveContacts = (contacts: Contact[]) => {
    try {
        localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    } catch (e) {
        console.error("Failed to save contacts to localStorage", e);
    }
};


export const loadRentals = (): Rental[] => {
    try {
        const rentalsJson = localStorage.getItem(RENTALS_KEY);
        return rentalsJson ? JSON.parse(rentalsJson) : [];
    } catch (e) {
        console.error("Failed to load rentals from localStorage", e);
        return defaultRentals;
    }
};

export const saveRentals = (rentals: Rental[]) => {
    try {
        localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
    } catch (e) {
        console.error("Failed to save rentals to localStorage", e);
    }
};

export const loadRepairs = (): Repair[] => {
    try {
        const repairsJson = localStorage.getItem(REPAIRS_KEY);
        return repairsJson ? JSON.parse(repairsJson) : [];
    } catch (e) {
        console.error("Failed to load repairs from localStorage", e);
        return defaultRepairs;
    }
};

export const saveRepairs = (repairs: Repair[]) => {
    try {
        localStorage.setItem(REPAIRS_KEY, JSON.stringify(repairs));
    } catch (e) {
        console.error("Failed to save repairs to localStorage", e);
    }
};

export const loadInventory = (): InventoryItem[] => {
    try {
        const inventoryJson = localStorage.getItem(INVENTORY_KEY);
        return inventoryJson ? JSON.parse(inventoryJson) : defaultInventory;
    } catch (e) {
        console.error("Failed to load inventory from localStorage", e);
        return defaultInventory;
    }
};

export const saveInventory = (inventory: InventoryItem[]) => {
    try {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    } catch (e) {
        console.error("Failed to save inventory to localStorage", e);
    }
};

export const loadSales = (): Sale[] => {
    try {
        const salesJson = localStorage.getItem(SALES_KEY);
        return salesJson ? JSON.parse(salesJson) : defaultSales;
    } catch (e) {
        console.error("Failed to load sales from localStorage", e);
        return defaultSales;
    }
};

export const saveSales = (sales: Sale[]) => {
    try {
        localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    } catch (e) {
        console.error("Failed to save sales to localStorage", e);
    }
};

export const loadVendors = (): Vendor[] => {
    try {
        const vendorsJson = localStorage.getItem(VENDORS_KEY);
        return vendorsJson ? JSON.parse(vendorsJson) : defaultVendors;
    } catch (e) {
        console.error("Failed to load vendors from localStorage", e);
        return defaultVendors;
    }
};

export const saveVendors = (vendors: Vendor[]) => {
    try {
        localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
    } catch (e) {
        console.error("Failed to save vendors to localStorage", e);
    }
};


export const loadSmsSettings = (): SmsSettings => {
    try {
        const settingsJson = localStorage.getItem(SMS_SETTINGS_KEY);
        if (!settingsJson) {
            saveSmsSettings(defaultSmsSettings);
            return defaultSmsSettings;
        }
        const parsed = JSON.parse(settingsJson);
        // If it's not the new format (doesn't have apiKey), reset to default.
        if (typeof parsed.apiKey === 'undefined') {
            saveSmsSettings(defaultSmsSettings);
            return defaultSmsSettings;
        }
        return parsed;
    } catch (e) {
        console.error("Failed to load SMS settings from localStorage", e);
        return defaultSmsSettings;
    }
};

export const saveSmsSettings = (settings: SmsSettings) => {
    try {
        localStorage.setItem(SMS_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Failed to save SMS settings to localStorage", e);
    }
};

export const loadAdminKey = (): string => {
    try {
        const key = localStorage.getItem(ADMIN_KEY);
        if (!key) {
            saveAdminKey(defaultAdminKey);
            return defaultAdminKey;
        }
        return key;
    } catch (e) {
        console.error("Failed to load admin key from localStorage", e);
        return defaultAdminKey;
    }
};

export const saveAdminKey = (key: string) => {
    try {
        localStorage.setItem(ADMIN_KEY, key);
    } catch (e) {
        console.error("Failed to save admin key to localStorage", e);
    }
};