import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Device, UserRole, DeviceStatus, AppNotification } from '../types';
import { translations } from '../constants';

type Language = 'en' | 'tr' | 'fr' | 'ja' | 'es';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  currentUser: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'password_hash' | 'role'>, pass: string) => boolean;
  users: User[];
  devices: Device[];
  addDevice: (device: Omit<Device, 'id' | 'userId' | 'status'>, isLost: boolean) => void;
  getUserDevices: (userId: string) => Device[];
  getDeviceById: (deviceId: string) => Device | undefined;
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

const defaultAdminUser: User = {
  id: 'admin_user_01',
  fullName: 'Admin',
  email: 'admin@ifoundanapple.app',
  password_hash: 'admin123', // Demo password
  role: UserRole.ADMIN,
};


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('app-lang', 'en');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('current-user', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', [defaultAdminUser]);
  const [devices, setDevices] = useLocalStorage<Device[]>('devices', []);
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('notifications', []);


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

  const login = (email: string, pass: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user && user.password_hash === pass) { 
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData: Omit<User, 'id' | 'password_hash' | 'role'>, pass: string): boolean => {
    if (users.some(u => u.email === userData.email)) {
      return false;
    }
    const newUser: User = { ...userData, id: `user_${Date.now()}`, password_hash: pass, role: UserRole.USER };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const addDevice = (deviceData: Omit<Device, 'id' | 'userId' | 'status'>, isLost: boolean) => {
    if (!currentUser) return;

    // Create the new device object first.
    const newDevice: Device = {
      ...deviceData,
      id: `device_${Date.now()}`,
      userId: currentUser.id,
      status: isLost ? DeviceStatus.LOST : DeviceStatus.REPORTED,
      exchangeConfirmedBy: [],
    };

    // Use a single, atomic state update to add the device and check for matches.
    setDevices(currentDevices => {
      // 1. Add the new device to the list.
      const devicesWithNew = [...currentDevices, newDevice];
      
      let matched = false;
      let lostDevice: Device | undefined;
      let foundDevice: Device | undefined;

      // 2. Check for a match against the new device.
      if (newDevice.status === DeviceStatus.LOST) {
        // New device is LOST, look for a REPORTED one.
        foundDevice = devicesWithNew.find(d => 
          d.id !== newDevice.id && // Ensure it's not the same device object.
          d.status === DeviceStatus.REPORTED &&
          d.serialNumber.toLowerCase() === newDevice.serialNumber.toLowerCase() &&
          d.model.toLowerCase() === newDevice.model.toLowerCase()
        );
        if (foundDevice) {
          matched = true;
          lostDevice = newDevice;
        }
      } 
      else if (newDevice.status === DeviceStatus.REPORTED) {
        // New device is REPORTED, look for a LOST one.
        lostDevice = devicesWithNew.find(d => 
          d.id !== newDevice.id && // Ensure it's not the same device object.
          d.status === DeviceStatus.LOST &&
          d.serialNumber.toLowerCase() === newDevice.serialNumber.toLowerCase() &&
          d.model.toLowerCase() === newDevice.model.toLowerCase()
        );
        if (lostDevice) {
          matched = true;
          foundDevice = newDevice;
        }
      }

      // 3. If a match was found, update statuses and notify users.
      if (matched && lostDevice && foundDevice) {
        addNotification(lostDevice.userId, 'matchFoundOwner', `/device/${lostDevice.id}`, { model: lostDevice.model });
        addNotification(foundDevice.userId, 'matchFoundFinder', `/device/${foundDevice.id}`, { model: foundDevice.model });
        
        // Return a new array with updated statuses.
        return devicesWithNew.map(d => {
          if (d.id === lostDevice!.id) return { ...d, status: DeviceStatus.PAYMENT_PENDING };
          if (d.id === foundDevice!.id) return { ...d, status: DeviceStatus.MATCHED };
          return d;
        });
      }
      
      // 4. If no match, just return the list with the new device added.
      return devicesWithNew;
    });
  };

  const getUserDevices = (userId: string) => {
    return devices.filter(d => d.userId === userId);
  };

  const getDeviceById = (deviceId: string) => {
    return devices.find(d => d.id === deviceId);
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
    users,
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
