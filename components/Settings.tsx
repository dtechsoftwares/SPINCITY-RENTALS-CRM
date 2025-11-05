

import React, { useState, useEffect } from 'react';
import { SmsSettings } from '../types';

const InputField = ({ label, description, type = 'text', value, placeholder, name, onChange }: { label: string, description?: string, type?: string, value: string, placeholder?: string, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  
  return (
    <div>
      <label className="block text-lg font-semibold text-brand-text mb-1">{label}</label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      <div className="relative">
        <input 
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 px-4 text-gray-400">
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
      <h3 className="text-lg font-semibold text-brand-text">{label}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-brand-green' : 'bg-gray-200'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

interface SettingsProps {
    onUpdateLogo: (logo: string | null) => void;
    currentLogo: string | null;
    smsSettings: SmsSettings;
    onUpdateSmsSettings: (settings: SmsSettings) => void;
    adminKey: string;
    onUpdateAdminKey: (key: string) => void;
    currentSplashLogo: string | null;
    onUpdateSplashLogo: (logo: string | null) => void;
    showNotification: (message: string) => void;
}


const Settings: React.FC<SettingsProps> = ({ 
    onUpdateLogo, 
    currentLogo, 
    smsSettings, 
    onUpdateSmsSettings, 
    adminKey, 
    onUpdateAdminKey,
    currentSplashLogo,
    onUpdateSplashLogo,
    showNotification
}) => {
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    
    const [logoPreview, setLogoPreview] = useState<string | null>(currentLogo);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    
    const [splashLogoPreview, setSplashLogoPreview] = useState<string | null>(currentSplashLogo);
    const [splashLogoFile, setSplashLogoFile] = useState<File | null>(null);

    const [localSmsSettings, setLocalSmsSettings] = useState<SmsSettings>(smsSettings);
    const [localAdminKey, setLocalAdminKey] = useState(adminKey);
    
    const [senderIds, setSenderIds] = useState<string[]>(smsSettings.senderId ? [smsSettings.senderId] : []);
    const [isSenderIdLoading, setIsSenderIdLoading] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);


    useEffect(() => {
        setLocalSmsSettings(smsSettings);
    }, [smsSettings]);
    
    useEffect(() => {
        setLocalAdminKey(adminKey);
    }, [adminKey]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveLogo = () => {
        if (logoPreview) {
            onUpdateLogo(logoPreview);
            showNotification('Application Logo has been saved successfully.');
        }
    };

    const handleResetLogo = () => {
        setLogoPreview(null);
        setLogoFile(null);
        onUpdateLogo(null);
        showNotification('Logo has been reset to default.');
    };

    const handleSplashLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSplashLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSplashLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSplashLogo = () => {
        onUpdateSplashLogo(splashLogoPreview);
        showNotification('Splash screen logo updated successfully!');
    };

    const handleResetSplashLogo = () => {
        setSplashLogoPreview(null);
        setSplashLogoFile(null);
        onUpdateSplashLogo(null);
        showNotification('Splash screen logo has been reset to default.');
    };


    const handleSmsSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalSmsSettings(prev => ({...prev, [name]: value}));
    };
    
    const handleFetchSenderIds = async () => {
        if (!localSmsSettings.apiKey) {
            showNotification('Please enter your API Key first.');
            return;
        }
        setIsSenderIdLoading(true);
        try {
            // This is a MOCK API call. The user needs to replace with the actual endpoint if available.
            // The smsonlinegh.com docs do not clearly specify an endpoint for listing sender IDs.
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockSenderIds = ['SpinCity', 'Support', 'Alerts']; // Mocked data
            setSenderIds(mockSenderIds);
            
            // If current senderId is not in the new list, select the first one.
            if (!mockSenderIds.includes(localSmsSettings.senderId)) {
                setLocalSmsSettings(prev => ({ ...prev, senderId: mockSenderIds[0] || '' }));
            }
            showNotification('Sender IDs loaded successfully.');
        } catch (error) {
            console.error("Failed to fetch sender IDs", error);
            showNotification('Failed to load Sender IDs.');
        } finally {
            setIsSenderIdLoading(false);
        }
    };

    const handleTestConnection = async () => {
        if (!localSmsSettings.apiKey) {
            showNotification('Please enter an API Key to test the connection.');
            return;
        }
        setIsTestingConnection(true);
        try {
            const response = await fetch('https://api.smsonlinegh.com/v5/report/balance', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization': `key ${localSmsSettings.apiKey}`
                }
            });

            const result = await response.json();
            
            if (response.ok && result.handshake?.id === 0) {
                const balance = result.data?.balance || 'N/A';
                showNotification(`Connection successful! Balance: ${balance} credits.`);
            } else {
                throw new Error(result.handshake?.label || 'Invalid API Key or connection failed.');
            }
        } catch (error: any) {
            showNotification(`Connection failed: ${error.message}`);
        } finally {
            setIsTestingConnection(false);
        }
    };


    const handleSaveSmsSettings = () => {
        onUpdateSmsSettings(localSmsSettings);
        showNotification('SMS settings saved successfully!');
    };
    
    const handleSaveAdminKey = () => {
        if (localAdminKey.length < 4) {
            alert('Admin key must be at least 4 characters long.');
            return;
        }
        onUpdateAdminKey(localAdminKey);
    };

    return (
        <div className="p-8 text-brand-text">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-6">Branding</h2>
                    <div className="flex items-center space-x-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                         {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 rounded-lg object-contain bg-white p-2 border-2 border-gray-300" />
                         ) : (
                            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <p className="text-xs text-center text-gray-500">Default Logo</p>
                            </div>
                         )}
                         <div className="flex-grow">
                             <label className="block text-lg font-semibold text-brand-text mb-1">Application Logo</label>
                             <p className="text-sm text-gray-500 mb-3">Upload a new logo for the sidebar. Recommended size: 128x128px.</p>
                             <input 
                                 type="file" 
                                 accept="image/*" 
                                 onChange={handleLogoChange}
                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
                             />
                         </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={handleResetLogo} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Reset to Default</button>
                        <button onClick={handleSaveLogo} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark" disabled={!logoFile && logoPreview === currentLogo}>
                            Save Logo
                        </button>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-6">Splash Screen</h2>
                    <div className="flex items-center space-x-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                         {splashLogoPreview ? (
                            <img src={splashLogoPreview} alt="Splash Logo Preview" className="w-20 h-20 rounded-lg object-contain bg-white p-2 border-2 border-gray-300" />
                         ) : (
                            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <p className="text-xs text-center text-gray-500">Default Logo</p>
                            </div>
                         )}
                         <div className="flex-grow">
                             <label className="block text-lg font-semibold text-brand-text mb-1">Splash Screen Logo</label>
                             <p className="text-sm text-gray-500 mb-3">Upload a new logo for the splash and login pages.</p>
                             <input 
                                 type="file" 
                                 accept="image/*" 
                                 onChange={handleSplashLogoChange}
                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
                             />
                         </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={handleResetSplashLogo} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Reset to Default</button>
                        <button onClick={handleSaveSplashLogo} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark" disabled={!splashLogoFile && splashLogoPreview === currentSplashLogo}>
                            Save Splash Logo
                        </button>
                    </div>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-6">SMS Gateway Configuration</h2>
                    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <InputField 
                            label="API Key" 
                            description="Your API Key from smsonlinegh.com"
                            type="password" 
                            value={localSmsSettings.apiKey || ''} 
                            onChange={handleSmsSettingsChange} 
                            name="apiKey" />

                        <div>
                            <label className="block text-lg font-semibold text-brand-text mb-1">Sender ID</label>
                            <p className="text-sm text-gray-500 mb-2">The name that appears as the sender (must be approved).</p>
                            <div className="flex items-center space-x-2">
                                <select 
                                    name="senderId" 
                                    value={localSmsSettings.senderId || ''} 
                                    onChange={handleSmsSettingsChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green"
                                >
                                    {senderIds.length === 0 && <option value="">Enter API Key to load IDs</option>}
                                    {senderIds.map(id => <option key={id} value={id}>{id}</option>)}
                                </select>
                                <button onClick={handleFetchSenderIds} disabled={isSenderIdLoading} className="bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400">
                                    {isSenderIdLoading ? 'Loading...' : 'Load Sender IDs'}
                                </button>
                            </div>
                        </div>

                        <InputField 
                            label="API Endpoint URL" 
                            description="The full URL for the SMS send endpoint."
                            value={localSmsSettings.endpointUrl || ''} 
                            onChange={handleSmsSettingsChange} 
                            name="endpointUrl" />
                        
                        <div className="pt-2">
                             <button onClick={handleTestConnection} disabled={isTestingConnection} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">
                                {isTestingConnection ? 'Testing...' : 'Test Connection'}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                       <button onClick={handleSaveSmsSettings} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark">
                           Save SMS Settings
                       </button>
                   </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-6">Security & Registration</h2>
                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <InputField 
                            label="Admin Registration Key" 
                            description="This key is required for the initial admin registration."
                            type="password"
                            value={localAdminKey}
                            name="adminKey"
                            onChange={(e) => setLocalAdminKey(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end mt-6">
                        <button onClick={handleSaveAdminKey} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark" disabled={localAdminKey === adminKey}>
                            Save Key
                        </button>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-6">Notifications</h2>
                    <div className="space-y-6">
                        <ToggleSwitch
                            label="SMS Notifications"
                            description="Receive notifications via SMS for important events."
                            enabled={smsEnabled}
                            setEnabled={setSmsEnabled}
                        />
                        <ToggleSwitch
                            label="Email Notifications"
                            description="Receive notifications via email for summaries and alerts."
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