

import React, { useState } from 'react';
import { Contact, SmsSettings } from '../types';

// FIX: Made `children` optional to resolve misleading "missing children" type error.
const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children?: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-semibold rounded-t-lg transition-colors -mb-px ${
            isActive ? 'bg-white text-lime-700 border-b-2 border-brand-green' : 'bg-transparent text-gray-500 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
);

const Select = ({ label, name, value, onChange, children, required=false }: { label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<any>) => void, children?: React.ReactNode, required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}{required && <span className="text-red-500">*</span>}</label>
      <select name={name} value={value} onChange={onChange} required={required} className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green appearance-none text-brand-text" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
        {children}
      </select>
    </div>
);

const Input = ({ label, name, value, onChange, required=false }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<any>) => void, required?: boolean }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}{required && <span className="text-red-500">*</span>}</label>
        <input name={name} value={value} onChange={onChange} required={required} className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-text" />
    </div>
);

const Textarea = ({ label, name, value, onChange, required=false, rows = 5 }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<any>) => void, required?: boolean, rows?: number }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}{required && <span className="text-red-500">*</span>}</label>
        <textarea name={name} value={value} onChange={onChange} required={required} rows={rows} className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green text-brand-text" />
    </div>
);


interface NotificationsProps {
    contacts: Contact[];
    handleAction: (action: () => void | Promise<void>) => void;
    smsSettings: SmsSettings;
    showNotification: (message: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ contacts, handleAction, smsSettings, showNotification }) => {
    const [activeTab, setActiveTab] = useState<'sms' | 'email'>('sms');
    
    // SMS state
    const [smsRecipient, setSmsRecipient] = useState<string>('');
    const [smsMessage, setSmsMessage] = useState('');

    // Email state
    const [emailRecipient, setEmailRecipient] = useState<string>('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const handleSendSms = () => {
        handleAction(async () => {
            if (!smsRecipient || !smsMessage) {
                showNotification('Please select a recipient and enter a message.');
                return;
            }
            if (!smsSettings.apiKey || !smsSettings.senderId || !smsSettings.endpointUrl) {
                showNotification('SMS Gateway is not configured. Please check Settings.');
                return;
            }
    
            const contact = contacts.find(c => c.id.toString() === smsRecipient);
            if (!contact) {
                showNotification('Selected contact not found.');
                return;
            }
            
            const body = new URLSearchParams();
            body.append('text', smsMessage);
            body.append('type', '0');
            body.append('sender', smsSettings.senderId);
            body.append('destinations', contact.phone.replace(/\D/g, ''));
    
            try {
                const response = await fetch(smsSettings.endpointUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'Authorization': `key ${smsSettings.apiKey}`
                    },
                    body: body
                });
    
                const resultText = await response.text();
                
                if (!response.ok) {
                    throw new Error(resultText || `HTTP error! status: ${response.status}`);
                }

                const result = JSON.parse(resultText);
                
                // From the docs, handshake.id === 0 is success
                if (result.handshake && result.handshake.id === 0) {
                    showNotification(`SMS sent successfully to ${contact.fullName}!`);
                    setSmsMessage(''); // Clear message on success
                } else {
                    const errorMessage = result.handshake?.label || 'An unknown error occurred.';
                    showNotification(`Failed to send SMS: ${errorMessage}`);
                }
    
            } catch (error: any) {
                console.error('SMS send error:', error);
                showNotification(`An error occurred: ${error.message}`);
            }
        });
    };

    const handleSendEmail = () => {
        handleAction(() => {
            if (!emailRecipient || !emailSubject || !emailBody) {
                alert('Please select a recipient and enter a subject and body.');
                return;
            }
            const contact = contacts.find(c => c.id.toString() === emailRecipient);
            alert(`Simulating Email send to ${contact?.fullName} (${contact?.email}):\n\nSubject: ${emailSubject}\n\n${emailBody}`);
            setEmailSubject('');
            setEmailBody('');
        });
    };

    return (
        <div className="p-8 text-brand-text">
            <h1 className="text-3xl font-bold mb-8">Notifications</h1>
            
            <div className="bg-white shadow-sm rounded-xl border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
                    <nav className="flex">
                        <TabButton isActive={activeTab === 'sms'} onClick={() => setActiveTab('sms')}>Send SMS</TabButton>
                        <TabButton isActive={activeTab === 'email'} onClick={() => setActiveTab('email')}>Send Email</TabButton>
                    </nav>
                </div>

                <div className="p-8">
                    {activeTab === 'sms' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-semibold text-brand-text">Compose SMS</h2>
                            <Select label="Recipient" name="smsRecipient" value={smsRecipient} onChange={e => setSmsRecipient(e.target.value)} required>
                                <option value="">-- Select a Contact --</option>
                                {contacts.map(c => <option key={c.id} value={c.id}>{c.fullName} - {c.phone}</option>)}
                            </Select>
                            <Textarea label="Message" name="smsMessage" value={smsMessage} onChange={e => setSmsMessage(e.target.value)} required />
                            <div className="flex justify-end">
                                <button onClick={handleSendSms} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark transition-colors">
                                    Send SMS
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'email' && (
                         <div className="space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-semibold text-brand-text">Compose Email</h2>
                            <Select label="Recipient" name="emailRecipient" value={emailRecipient} onChange={e => setEmailRecipient(e.target.value)} required>
                                <option value="">-- Select a Contact --</option>
                                {contacts.map(c => <option key={c.id} value={c.id}>{c.fullName} - {c.email}</option>)}
                            </Select>
                            <Input label="Subject" name="emailSubject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} required />
                            <Textarea label="Body" name="emailBody" value={emailBody} onChange={e => setEmailBody(e.target.value)} required rows={10} />
                            <div className="flex justify-end">
                                <button onClick={handleSendEmail} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark transition-colors">
                                    Send Email
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;