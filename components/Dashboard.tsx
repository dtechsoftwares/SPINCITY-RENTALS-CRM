
import React from 'react';
import { ContactsIcon, RentalsIcon, RepairsIcon, UsersIcon } from './Icons';

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number, color: string }) => (
  <div className="bg-brand-light p-6 rounded-xl flex items-center space-x-4 shadow-lg">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  return (
    <div className="p-8 text-brand-text">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<ContactsIcon className="w-6 h-6 text-white"/>} title="New Contacts" value={0} color="bg-blue-500"/>
        <StatCard icon={<RentalsIcon className="w-6 h-6 text-white"/>} title="Active Rentals" value={0} color="bg-green-500"/>
        <StatCard icon={<RepairsIcon className="w-6 h-6 text-white"/>} title="Open Repairs" value={0} color="bg-yellow-500"/>
        <StatCard icon={<UsersIcon className="w-6 h-6 text-white"/>} title="System Users" value={2} color="bg-purple-500"/>
      </div>

      <div className="bg-brand-lime bg-opacity-20 text-brand-lime p-6 rounded-xl border border-brand-lime shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-white">Welcome to SpinCity Rentals CRM</h2>
        <p className="text-gray-300">
          This dashboard provides a high-level overview of your property management activities. Use the sidebar to navigate to specific sections for detailed information and actions. You can add new contacts, rentals, and more. Our integrated AI will provide helpful summaries and feedback to streamline your workflow.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
