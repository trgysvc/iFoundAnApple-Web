import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Device, UserRole, DeviceStatus, AppNotification } from '../types';
import { translations } from '../constants';
import { createClient } from '@supabase/supabase-js';
// import { useNavigate } from 'react-router-dom'; // Removed as useNavigate cannot be used in AppContext

type Language = 'en' | 'tr' | 'fr' | 'ja' | 'es';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'password_hash' | 'role'>, pass: string) => Promise<boolean>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  devices: Device[];
  addDevice: (device: Omit<Device, 'id' | 'userId' | 'status'>, isLost: boolean) => Promise<boolean>;
  getUserDevices: (userId: string) => Promise<Device[]>;
  getDeviceById: (deviceId: string) => Promise<Device | undefined>;
  makePayment: (deviceId: string) => void;
  confirmExchange: (deviceId: string, userId: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllAsReadForCurrentUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- LocalStorage Hook ---
// A custom hook to persist state to localStorage.
// SECURITY NOTE: In a real-world application, sensitive data like users, devices,
// and especially bank info should NEVER be stored in localStorage. This is a simplified
// approach for this prototype. A production app must use a secure backend server with a
// database and proper authentication/authorization mechanisms.
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Removed defaultAdminUser as user management is now handled by Supabase

const supabaseUrl = 'https://zokkxkyhabihxjskdcfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2t4a3loYWJpaHhqc2tkY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQyMDMsImV4cCI6MjA3MTE5MDIwM30.Dvnl7lUwezVDGY9I6IIgfoJXWtaw1Un_idOxTlI0xwQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('app-lang', 'en');
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Supabase will manage current user
  // const [users, setUsers] = useLocalStorage<User[]>('users', [defaultAdminUser]); // Removed as users are now managed by Supabase
  const [devices, setDevices] = useLocalStorage<Device[]>('devices', []);
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('notifications', []);
  // const navigate = useNavigate(); // Removed as useNavigate cannot be used in AppContext

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Here you might fetch user metadata from your 'profiles' table if needed
        // For now, we'll just set a basic user object
        setCurrentUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata.full_name || session.user.email!, // Assuming full_name in metadata
          role: UserRole.USER, // Default role for now, can fetch from profiles table
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata.full_name || session.user.email!,
          role: UserRole.USER,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    const keys = key.split('.');
    let translation: any = translations[language];
    for (const k of keys) {
        translation = translation?.[k];
    }
    
    let enTranslation: any = translations['en'];
    for (const k of keys) {
        enTranslation = enTranslation?.[k];
    }

    let finalTranslation = translation || enTranslation || key;

    if (typeof finalTranslation === 'string' && replacements) {
        Object.keys(replacements).forEach(placeholder => {
            finalTranslation = finalTranslation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return finalTranslation;
  }, [language]);
  
  const addNotification = useCallback((
    userId: string, 
    messageKey: keyof typeof translations.en.notifications, 
    link: string, 
    replacements?: Record<string, string | number>
  ) => {
    console.log("addNotification: Function called with:", { userId, messageKey, link, replacements }); // Added for debugging
    const newNotification: AppNotification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      userId,
      messageKey,
      link,
      isRead: false,
      createdAt: new Date().toISOString(),
      replacements
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [setNotifications]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    if (data.user) {
      setCurrentUser({
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata.full_name || data.user.email!,
        role: UserRole.USER,
      });
      return true;
    }
    return false;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      setCurrentUser(null);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin, // Redirects back to the app after OAuth
      },
    });
    if (error) {
      console.error(`Error signing in with ${provider}:`, error.message);
    }
    // Supabase will handle the redirect, so no need for explicit setCurrentUser here
  };

  const register = async (userData: Omit<User, 'id' | 'password_hash' | 'role'>, pass: string): Promise<boolean> => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: userData.email,
      password: pass,
      options: {
        data: {
          full_name: userData.fullName,
        },
      },
    });
    if (error) {
      console.error('Registration error:', error.message);
      return false;
    }
    if (signUpData.user) {
      setCurrentUser({
        id: signUpData.user.id,
        email: signUpData.user.email!,
        fullName: signUpData.user.user_metadata.full_name || signUpData.user.email!,
        role: UserRole.USER,
      });
      // Optionally, insert user data into a 'profiles' table here if you need to store more information
      // await supabase.from('profiles').insert([{ id: data.user.id, full_name: userData.fullName, email: userData.email, role: UserRole.USER }]);
      return true;
    }
    return false;
  };

  const addDevice = async (deviceData: Omit<Device, 'id' | 'userId' | 'status'>, isLost: boolean): Promise<boolean> => {
    if (!currentUser) {
        console.warn("addDevice: No current user, cannot add device.");
        return false;
    }
    console.log("addDevice: Current User ID:", currentUser.id);

    const newDevicePayload = {
      ...deviceData,
      userId: currentUser.id,
      status: isLost ? DeviceStatus.LOST : DeviceStatus.REPORTED,
      exchangeConfirmedBy: [],
    };

    console.log("addDevice: Payload being sent to Supabase:", newDevicePayload); // Added for debugging

    try {
      const { data, error } = await supabase.from('devices').insert([newDevicePayload]).select();
      if (error) {
        console.error("Error adding device to Supabase:", error.message);
        return false;
      } else {
        console.log("Device added to Supabase:", data);
        
        const newDevice = (data as Device[])[0];
        if (!newDevice) {
          console.error("addDevice: Could not retrieve new device data after insertion.");
          return true; // Still consider it a success as the device was added
        }

        // Check for a match with existing devices in Supabase
        let matched = false;
        let lostDevice: Device | undefined;
        let foundDevice: Device | undefined;

        if (newDevice.status === DeviceStatus.LOST) {
          // New device is LOST, look for a REPORTED one
          const { data: matchedData } = await supabase.from('devices').select('*')
            .eq('status', DeviceStatus.REPORTED)
            .eq('serialNumber', newDevice.serialNumber)
            .eq('model', newDevice.model)
            .neq('userId', newDevice.userId)
            .single();
          
          if (matchedData) {
            matched = true;
            lostDevice = newDevice;
            foundDevice = matchedData as Device;
          }
        } else if (newDevice.status === DeviceStatus.REPORTED) {
          // New device is REPORTED, look for a LOST one
          const { data: matchedData } = await supabase.from('devices').select('*')
            .eq('status', DeviceStatus.LOST)
            .eq('serialNumber', newDevice.serialNumber)
            .eq('model', newDevice.model)
            .neq('userId', newDevice.userId)
            .single();

          if (matchedData) {
            matched = true;
            lostDevice = matchedData as Device;
            foundDevice = newDevice;
          }
        }

        if (matched && lostDevice && foundDevice) {
          console.log("Match found! Lost device:", lostDevice, "Found device:", foundDevice);

          // Update statuses in Supabase
          await supabase.from('devices').update({ status: DeviceStatus.PAYMENT_PENDING }).eq('id', lostDevice.id);
          await supabase.from('devices').update({ status: DeviceStatus.MATCHED }).eq('id', foundDevice.id);

          // Send notifications
          console.log("addDevice: Calling addNotification for lost device owner.", lostDevice.userId, 'matchFoundOwner', `/device/${lostDevice.id}`, { model: lostDevice.model });
          addNotification(lostDevice.userId, 'matchFoundOwner', `/device/${lostDevice.id}`, { model: lostDevice.model });
          console.log("addDevice: Calling addNotification for found device finder.", foundDevice.userId, 'matchFoundFinder', `/device/${foundDevice.id}`, { model: foundDevice.model });
          addNotification(foundDevice.userId, 'matchFoundFinder', `/device/${foundDevice.id}`, { model: foundDevice.model });
        }

        return true;
      }
    } catch (e) {
      console.error("Unhandled error adding device:", e);
      return false;
    }
  };

  const getUserDevices = async (userId: string): Promise<Device[]> => {
    if (!userId) {
      console.warn("getUserDevices: No userId provided.");
      return [];
    }
    const { data, error } = await supabase.from('devices').select('*').eq('userId', userId).order('createdAt', { ascending: false }); // Order by createdAt
    if (error) {
      console.error("Error fetching devices from Supabase:", error.message);
      return [];
    }
    return (data as Device[]) || [];
  };

  const getDeviceById = async (deviceId: string): Promise<Device | undefined> => {
    if (!deviceId) {
      console.warn("getDeviceById: No deviceId provided.");
      return undefined;
    }
    const { data, error } = await supabase.from('devices').select('*').eq('id', deviceId).single();
    if (error) {
      console.error("Error fetching device by ID from Supabase:", error.message);
      return undefined;
    }
    return (data as Device) || undefined;
  };
  
  // --- Core Logic: Payment ---
  // When the owner makes a payment for a matched device.
  const makePayment = (deviceId: string) => {
    setDevices(prev => {
        const ownerDevice = prev.find(d => d.id === deviceId);
        if (!ownerDevice) return prev;

        // Find the corresponding finder's device.
        const finderDevice = prev.find(d => 
            d.serialNumber.toLowerCase() === ownerDevice.serialNumber.toLowerCase() && 
            d.model.toLowerCase() === ownerDevice.model.toLowerCase() && 
            d.id !== ownerDevice.id
        );

        // Notify the finder that payment has been received.
        if (finderDevice) {
          addNotification(finderDevice.userId, 'paymentReceivedFinder', `/device/${finderDevice.id}`, { model: finderDevice.model });
        }
        
        // Update both devices to EXCHANGE_PENDING status.
        return prev.map(d => {
            if (d.id === ownerDevice.id || (finderDevice && d.id === finderDevice.id)) {
                return { ...d, status: DeviceStatus.EXCHANGE_PENDING };
            }
            return d;
        });
    });
  };
  
  // --- Core Logic: Exchange Confirmation ---
  // A two-party confirmation system for the physical exchange.
  const confirmExchange = (deviceId: string, userId: string) => {
    setDevices(prev => {
        let device = prev.find(d => d.id === deviceId);
        if (!device) return prev;

        const alreadyConfirmed = device.exchangeConfirmedBy?.includes(userId);
        if (alreadyConfirmed) return prev; // Prevent double confirmation.

        // Find the matching device to update both records simultaneously.
        let matchingDevice = prev.find(d => 
            d.serialNumber.toLowerCase() === device!.serialNumber.toLowerCase() &&
            d.model.toLowerCase() === device!.model.toLowerCase() &&
            d.id !== device!.id
        );
        if (!matchingDevice) return prev; // Should not happen in a normal flow.

        // Add the current user's ID to the list of confirmations.
        const updatedConfirmedBy = [...(device.exchangeConfirmedBy || []), userId];
        
        let finalStatus = device.status;
        
        // If both parties have confirmed, the transaction is complete.
        if (updatedConfirmedBy.length === 2) {
            finalStatus = DeviceStatus.COMPLETED;
            // Send final notifications to both parties.
            addNotification(device.userId, 'transactionCompletedOwner', `/device/${device.id}`, {model: device.model});
            addNotification(matchingDevice.userId, 'transactionCompletedFinder', `/device/${matchingDevice.id}`, {model: matchingDevice.model});
        } 
        // If only one party has confirmed, notify the other party.
        else if (updatedConfirmedBy.length === 1) {
            const otherUserId = device.userId === userId ? matchingDevice.userId : device.userId;
            const otherUserDevice = device.userId === userId ? matchingDevice : device;
            addNotification(otherUserId, 'exchangeConfirmationNeeded', `/device/${otherUserDevice.id}`, {model: otherUserDevice.model});
        }
        
        // Update both devices with the new status and confirmation list.
        return prev.map(d => {
            if (d.id === device!.id || d.id === matchingDevice!.id) {
                return { ...d, status: finalStatus, exchangeConfirmedBy: updatedConfirmedBy };
            }
            return d;
        });
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllAsReadForCurrentUser = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };


  const value = {
    language,
    setLanguage,
    t,
    currentUser,
    login,
    logout,
    register,
    signInWithOAuth,
    devices,
    addDevice,
    getUserDevices,
    getDeviceById,
    makePayment,
    confirmExchange,
    notifications,
    markNotificationAsRead,
    markAllAsReadForCurrentUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
