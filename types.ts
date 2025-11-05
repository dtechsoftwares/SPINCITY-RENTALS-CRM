
export enum AppView {
  Dashboard,
  Contacts,
  Rentals,
  Repairs,
  Users,
  Settings,
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  avatar: string;
}

export interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  hookupType: string;
  notes?: string;
}
