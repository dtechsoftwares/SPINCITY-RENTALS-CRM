
import React, { useState } from 'react';

const InputField = ({ label, description, type = 'text', value, placeholder }: { label: string, description?: string, type?: string, value: string, placeholder?: string }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  
  return (
    <div>
      <label className="block text-lg font-semibold text-white mb-1">{label}</label>
      {description && <p className="text-sm text-gray-300 mb-2">{description}</p>}
      <div className="relative">
        <input 
          type={isPassword && !show ? 'password' : 'text'}
          defaultValue={value}
          placeholder={placeholder}
          className="w-full bg-brand-light border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-lime"
        />
        {isPassword && (
          <button onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 px-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const ToggleSwitch = ({ label, description, enabled, setEnabled }: { label: string, description: string, enabled: boolean, setEnabled: (enabled: boolean) => void }) => (
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold text-white">{label}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-brand-lime' : 'bg-gray-600'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const Settings: React.FC = () => {
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);

    return (
        <div className="p-8 text-brand-text bg-lime-800 min-h-full">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold border-b border-lime-600 pb-2 mb-6">Account Credentials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="SMS Login" value="ajrsagoe@cicadasitsolutions.com" />
                        <InputField label="SMS Password" type="password" value="somepassword" />
                    </div>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold border-b border-lime-600 pb-2 mb-6">Security & Registration</h2>
                    <InputField 
                        label="Admin Registration Key" 
                        description="This key is required for the initial admin registration."
                        type="password"
                        value="anothersecret"
                    />
                </section>

                <section>
                    <h2 className="text-2xl font-bold border-b border-lime-600 pb-2 mb-6">SMS API</h2>
                    <div className="flex items-end space-x-4">
                        <div className="flex-grow">
                             <InputField 
                                label="SMS Online GH API Key" 
                                value="superlongapikeythatshouldbehidden"
                             />
                        </div>
                        <button className="bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                            Check Balance
                        </button>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold border-b border-lime-600 pb-2 mb-6">Client Notifications</h2>
                    <p className="mb-6 text-gray-300">Manage automated notifications sent to clients.</p>
                    <div className="space-y-6 bg-brand-dark/20 p-6 rounded-lg">
                        <ToggleSwitch 
                            label="SMS Notifications"
                            description="Send text message updates for appointments and repairs."
                            enabled={smsEnabled}
                            setEnabled={setSmsEnabled}
                        />
                        <hr className="border-lime-700"/>
                         <ToggleSwitch 
                            label="Email Notifications"
                            description="Send email confirmations and rental agreement updates."
                            enabled={emailEnabled}
                            setEnabled={setEmailEnabled}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
