
import React from 'react';
import { AppView } from '../types';
import { DashboardIcon, ContactsIcon, RentalsIcon, RepairsIcon, UsersIcon, SettingsIcon } from './Icons';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: AppView.Dashboard, icon: DashboardIcon, label: 'Dashboard' },
    { view: AppView.Contacts, icon: ContactsIcon, label: 'Contacts' },
    { view: AppView.Rentals, icon: RentalsIcon, label: 'Rentals' },
    { view: AppView.Repairs, icon: RepairsIcon, label: 'Repairs' },
    { view: AppView.Users, icon: UsersIcon, label: 'Users' },
    { view: AppView.Settings, icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-brand-light text-brand-text flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-brand-lime p-2 rounded-lg">
          <svg className="w-8 h-8 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m3 1v5.25m-3-5.25v5.25m-3-5.25l3 1m-3-1l-3 1m0 0v5.25m0 0l3 1m-3-1l-3-1" />
          </svg>
        </div>
        <h1 className="text-xl font-bold">SpinCity CRM</h1>
      </div>
      <nav className="flex-1 px-4 py-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center space-x-3 p-3 my-1 rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-brand-green bg-opacity-20 text-brand-lime'
                    : 'hover:bg-brand-dark hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-brand-dark">
        <div className="flex items-center space-x-3">
          <img src="https://picsum.photos/seed/admin/40/40" alt="Admin User" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">Admin User</p>
            <p className="text-sm text-gray-400">admin@spincity.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
