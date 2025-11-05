import React, { useState } from 'react';
import { Contact } from '../types';
import { CloseIcon } from './Icons';

// Modal and Input components defined here as they are specific to this view's style
const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-brand-dark text-brand-text w-full max-w-2xl rounded-xl shadow-2xl border border-brand-light">
        <div className="flex justify-between items-center p-6 border-b border-brand-light">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type = 'text', placeholder, name, value, onChange }: { label: string, type?: string, placeholder?: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input 
      type={type} 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-brand-light border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-lime"
    />
  </div>
);

const Select = ({ label, name, value, onChange, children }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-brand-light border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-lime appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
        {children}
      </select>
    </div>
);


const Textarea = ({ label, name, value, onChange, placeholder }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-brand-light border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-lime"
        />
    </div>
);

const Contacts: React.FC<{ contacts: Contact[], setContacts: React.Dispatch<React.SetStateAction<Contact[]>> }> = ({ contacts, setContacts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    plan: '12-Month Smart Plan ($49.99/month)',
    hookupType: 'Electric Dryer Hookup',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewContact(prev => ({...prev, [name]: value}));
  };

  const handleAddContact = () => {
    const contactToAdd: Contact = { ...newContact, id: Date.now() };
    setContacts(prev => [contactToAdd, ...prev]);
    setIsModalOpen(false);
    // Reset form
    setNewContact({
      fullName: '', email: '', phone: '', address: '', plan: '12-Month Smart Plan ($49.99/month)', hookupType: 'Electric Dryer Hookup', notes: ''
    });
  };

  return (
    <div className="p-8 text-brand-text">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-brand-lime text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors">
          Add New Contact
        </button>
      </div>

      <div className="bg-brand-light shadow-lg rounded-xl p-6">
        {contacts.length > 0 ? (
          <ul>
            {contacts.map(contact => (
              <li key={contact.id} className="border-b border-brand-dark py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold">{contact.fullName}</p>
                  <p className="text-sm text-gray-400">{contact.email}</p>
                </div>
                 <div className="flex space-x-4 text-gray-400">
                    <button className="hover:text-brand-lime">View</button>
                    <button className="hover:text-brand-lime">Edit</button>
                    <button className="text-red-500 hover:text-red-400">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400 py-8">No contacts yet. Add one to get started!</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FIX: Wrapped handleInputChange to resolve type mismatch. This fixes this and the misleading 'children' prop error. */}
            <Input label="Full Name" name="fullName" value={newContact.fullName} onChange={(e) => handleInputChange(e)} />
            <Input label="Email Address" type="email" name="email" value={newContact.email} onChange={(e) => handleInputChange(e)} />
            <Input label="Phone Number" type="tel" name="phone" value={newContact.phone} onChange={(e) => handleInputChange(e)} />
            <Input label="Installation Address" name="address" value={newContact.address} onChange={(e) => handleInputChange(e)} />
            <Select label="Interested Plan" name="plan" value={newContact.plan} onChange={(e) => handleInputChange(e)}>
                <option>12-Month Smart Plan ($49.99/month)</option>
                <option>6-Month Flex Plan ($59.99/month)</option>
                <option>24-Month Value Plan ($39.99/month)</option>
            </Select>
            <Select label="Hook-up Type" name="hookupType" value={newContact.hookupType} onChange={(e) => handleInputChange(e)}>
                <option>Electric Dryer Hookup</option>
                <option>Gas Dryer Hookup</option>
            </Select>
          </div>
          <div className="mt-6">
              <Textarea label="Additional Notes or Questions" name="notes" value={newContact.notes ?? ''} onChange={(e) => handleInputChange(e)} />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors">
                Cancel
            </button>
            <button onClick={handleAddContact} className="bg-brand-lime text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-lime-400 transition-colors">
                Save Contact
            </button>
          </div>
      </Modal>
    </div>
  );
};

export default Contacts;