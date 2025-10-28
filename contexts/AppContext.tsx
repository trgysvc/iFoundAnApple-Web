import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  User,
  Device,
  UserRole,
  DeviceStatus,
  AppNotification,
} from "../types.ts";
import { translations } from "../constants.ts";
import { secureLogger } from "../utils/security.ts";
import { supabase } from "../utils/supabaseClient.ts";
import { encryptUserProfile, decryptUserProfile } from "../utils/encryptionManager.ts";
// import { useNavigate } from 'react-router-dom'; // Removed as useNavigate cannot be used in AppContext

type Language = "en" | "tr" | "fr" | "ja" | "es";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (
    user: Omit<User, "id" | "password_hash" | "role">,
    pass: string
  ) => Promise<boolean>;
  signInWithOAuth: (provider: "google" | "apple") => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  devices: Device[];
  addDevice: (
    device: Omit<Device, "id" | "userId" | "status">,
    isLost: boolean
  ) => Promise<boolean>;
  getUserDevices: (userId: string) => Promise<Device[]>;
  getDeviceById: (deviceId: string) => Promise<Device | undefined>;
  makePayment: (deviceId: string) => Promise<void>;
  confirmExchange: (deviceId: string, userId: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllAsReadForCurrentUser: () => void;
  refreshNotifications: () => Promise<void>;
  checkForExistingMatches: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<any>;
  showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  updateUserProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    tcKimlikNo?: string;
    phoneNumber?: string;
    address?: string;
    iban?: string;
  }) => Promise<boolean>;
  supabaseClient: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- LocalStorage Hook ---
// A custom hook to persist state to localStorage.
// SECURITY NOTE: In a real-world application, sensitive data like users, devices,
// and especially bank info should NEVER be stored in localStorage. This is a simplified
// approach for this prototype. A production app must use a secure backend server with a
// database and proper authentication/authorization mechanisms.
const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
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
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Removed defaultAdminUser as user management is now handled by Supabase

// Parse user name from OAuth provider metadata
const parseOAuthUserName = (userMetadata: any): { firstName?: string; lastName?: string } => {
  // Try direct fields first (from our own registration)
  if (userMetadata.first_name && userMetadata.last_name) {
    return {
      firstName: userMetadata.first_name,
      lastName: userMetadata.last_name,
    };
  }

  // Google OAuth provides given_name and family_name
  if (userMetadata.given_name || userMetadata.family_name) {
    return {
      firstName: userMetadata.given_name,
      lastName: userMetadata.family_name,
    };
  }

  // Apple OAuth provides name object
  if (userMetadata.name) {
    if (typeof userMetadata.name === 'object') {
      return {
        firstName: userMetadata.name.firstName || userMetadata.name.first,
        lastName: userMetadata.name.lastName || userMetadata.name.last,
      };
    }
  }

  // Fallback: Try to parse full_name
  if (userMetadata.full_name) {
    const nameParts = userMetadata.full_name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      return {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
      };
    } else if (nameParts.length === 1) {
      return {
        firstName: nameParts[0],
        lastName: '',
      };
    }
  }

  // Last resort: parse from email
  if (userMetadata.email) {
    const emailName = userMetadata.email.split('@')[0];
    return {
      firstName: emailName,
      lastName: '',
    };
  }

  return { firstName: undefined, lastName: undefined };
};

// Detect browser language and return appropriate default language
const getDefaultLanguage = (): Language => {
  // Check if there's already a saved language preference
  const savedLang = window.localStorage.getItem("app-lang");
  if (savedLang) {
    return JSON.parse(savedLang) as Language;
  }

  // Get browser language
  const browserLang = navigator.language.toLowerCase();
  
  // Supported languages that should auto-switch
  const supportedAutoLanguages: Record<string, Language> = {
    'tr': 'tr',      // Turkish
    'tr-tr': 'tr',
    'ja': 'ja',      // Japanese
    'ja-jp': 'ja',
    'es': 'es',      // Spanish
    'es-es': 'es',
    'es-mx': 'es',
    'fr': 'fr',      // French
    'fr-fr': 'fr',
    'fr-ca': 'fr',
  };

  // Check if browser language is in supported auto languages
  if (supportedAutoLanguages[browserLang]) {
    return supportedAutoLanguages[browserLang];
  }

  // Check if browser language starts with any of our supported language codes
  const langPrefix = browserLang.split('-')[0];
  if (supportedAutoLanguages[langPrefix]) {
    return supportedAutoLanguages[langPrefix];
  }

  // Default to English
  return 'en';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useLocalStorage<Language>("app-lang", getDefaultLanguage());
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Supabase will manage current user
  // const [users, setUsers] = useLocalStorage<User[]>('users', [defaultAdminUser]); // Removed as users are now managed by Supabase
  const [devices, setDevices] = useState<Device[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  // const navigate = useNavigate(); // Removed as useNavigate cannot be used in AppContext

  // Optimization: Memoize userId to prevent unnecessary re-renders
  // This ensures useEffect hooks only re-run when the actual ID changes, not when the currentUser object reference changes
  const userId = useMemo(() => currentUser?.id, [currentUser?.id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Parse user name from OAuth metadata
        const parsedNames = parseOAuthUserName(session.user.user_metadata);
        const fullName = session.user.user_metadata.full_name || 
                        `${parsedNames.firstName || ''} ${parsedNames.lastName || ''}`.trim() ||
                        session.user.email!;
        
        setCurrentUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: fullName,
          firstName: parsedNames.firstName,
          lastName: parsedNames.lastName,
          role: UserRole.USER,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      secureLogger.info(
        `Auth state change: ${event}`,
        session ? { hasSession: true } : { hasSession: false }
      );

      if (session) {
        secureLogger.userAction(
          "Setting current user from session",
          session.user.id
        );

        // Parse user name from OAuth metadata or regular sign-in
        const parsedNames = parseOAuthUserName(session.user.user_metadata);
        const fullName = session.user.user_metadata.full_name || 
                        `${parsedNames.firstName || ''} ${parsedNames.lastName || ''}`.trim() ||
                        session.user.email!;
        
        const initialUser = {
          id: session.user.id,
          email: session.user.email!,
          fullName: fullName,
          firstName: parsedNames.firstName,
          lastName: parsedNames.lastName,
          role: UserRole.USER,
        };

        secureLogger.info("Parsed user metadata", {
          provider: session.user.app_metadata?.provider,
          hasFirstName: !!parsedNames.firstName,
          hasLastName: !!parsedNames.lastName,
          source: session.user.user_metadata.given_name ? 'OAuth' : 'Regular',
        });

        setCurrentUser(initialUser);

        // Fetch additional profile data from userProfile table
        fetchUserProfile(session.user.id)
          .then((profileData) => {
            secureLogger.info("Profile fetch completed", {
              hasData: !!profileData,
            });
            if (profileData) {
              secureLogger.info("Profile data loaded successfully");
              setCurrentUser((prev) =>
                prev
                  ? {
                      ...prev,
                      firstName: profileData.first_name || prev.firstName,
                      lastName: profileData.last_name || prev.lastName,
                      fullName: profileData.first_name && profileData.last_name 
                        ? `${profileData.first_name} ${profileData.last_name}` 
                        : prev.fullName,
                      dateOfBirth: profileData.date_of_birth || undefined,
                      tcKimlikNo: profileData.tc_kimlik_no || undefined,
                      phoneNumber: profileData.phone_number || undefined,
                      address: profileData.address || undefined,
                      iban: profileData.iban || undefined,
                      bankInfo: profileData.bank_info || undefined,
                    }
                  : null
              );
            } else {
              secureLogger.info("No profile data found - creating profile for new user from OAuth/Auth");
              // Create profile for new user with parsed OAuth data
              createUserProfile(session.user.id, {
                firstName: parsedNames.firstName,
                lastName: parsedNames.lastName,
              }).then(() => {
                secureLogger.info("Profile created successfully with OAuth data");
              }).catch((error) => {
                secureLogger.error("Error creating user profile", error);
              });
            }
          })
          .catch((error) => {
            secureLogger.error("Error fetching profile data", error);
          });
      } else {
        secureLogger.info("Clearing current user - no session");
        setCurrentUser(null);
        setDevices([]);
        setNotifications([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user devices when user logs in
  // Optimized: Use userId instead of currentUser to prevent unnecessary re-fetches
  useEffect(() => {
    if (!userId) {
      setDevices([]);
      return;
    }

    const fetchUserDevices = async () => {
      try {
        const userDevices = await getUserDevices(userId);
        setDevices(userDevices);
      } catch (error) {
        console.error("Error fetching user devices:", error);
        setDevices([]);
      }
    };

    fetchUserDevices();
  }, [userId]);

  // Fetch initial notifications and subscribe to real-time updates
  // Optimized: Use userId instead of currentUser to prevent unnecessary re-subscriptions
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      console.log("Fetching notifications for user:", userId);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        console.log("Notifications fetched successfully:", data);
        setNotifications(data as AppNotification[]);
      }
    };

    fetchNotifications();

    // Real-time subscription for notifications
    console.log("Setting up real-time subscription for user:", userId);

    // Create a unique channel name for this user
    const channelName = `notifications_${userId}`;

    // Try a simpler real-time subscription first
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log("Real-time notification change received:", payload);

          // Only process notifications for the current user
          if (payload.new && (payload.new as any).user_id === userId) {
            if (payload.eventType === "INSERT") {
              console.log(
                "New notification inserted for current user:",
                payload.new
              );
              setNotifications((prev) => [
                payload.new as AppNotification,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              console.log(
                "Notification updated for current user:",
                payload.new
              );
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.new.id ? (payload.new as AppNotification) : n
                )
              );
            } else if (payload.eventType === "DELETE") {
              console.log(
                "Notification deleted for current user:",
                payload.old
              );
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id)
              );
            }
          } else {
            console.log(
              "Real-time event received but not for current user:",
              payload
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Real-time subscription active for notifications");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Real-time subscription error");
        } else if (status === "TIMED_OUT") {
          console.warn("⚠️ Real-time subscription timed out");
        } else if (status === "CLOSED") {
          console.log("🔒 Real-time subscription closed");
        }
      });

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [userId]); // Optimized: Only re-run when userId changes

  // Real-time subscription for devices
  // Optimized: Use userId instead of currentUser to prevent unnecessary re-subscriptions
  useEffect(() => {
    if (!userId) {
      return;
    }

    console.log("Setting up real-time subscription for devices for user:", userId);

    const devicesChannel = supabase
      .channel(`devices_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "devices",
        },
        async (payload) => {
          console.log("Real-time device change received:", payload);

          // Only process devices for the current user
          if (payload.new && (payload.new as any).userId === userId) {
            console.log("Device change for current user, refreshing devices...");
            
            // Refresh devices from Supabase
            try {
              const refreshedDevices = await getUserDevices(userId);
              setDevices(refreshedDevices);
              console.log("Devices refreshed successfully");
            } catch (error) {
              console.error("Error refreshing devices:", error);
            }
          } else if (payload.old && (payload.old as any).userId === userId) {
            console.log("Device deletion for current user, refreshing devices...");
            
            // Refresh devices from Supabase
            try {
              const refreshedDevices = await getUserDevices(userId);
              setDevices(refreshedDevices);
              console.log("Devices refreshed successfully after deletion");
            } catch (error) {
              console.error("Error refreshing devices after deletion:", error);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Devices real-time subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Real-time subscription active for devices");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Devices real-time subscription error");
        } else if (status === "TIMED_OUT") {
          console.warn("⚠️ Devices real-time subscription timed out");
        } else if (status === "CLOSED") {
          console.log("🔒 Devices real-time subscription closed");
        }
      });

    return () => {
      console.log("Cleaning up devices real-time subscription");
      supabase.removeChannel(devicesChannel);
    };
  }, [userId]); // Optimized: Only re-run when userId changes

  // Fallback: Refresh notifications every 10 seconds if real-time fails
  // Optimized: Use userId instead of currentUser
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      console.log("Fallback: Refreshing notifications...");
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fallback refresh error:", error.message);
      } else {
        console.log(
          "Fallback refresh successful, notifications count:",
          data?.length || 0
        );
        setNotifications(data as AppNotification[]);
      }
    }, 10000); // 10 seconds - more aggressive polling

    return () => clearInterval(interval);
  }, [userId]); // Optimized: Only re-run when userId changes

  const t = useCallback(
    (key: string, replacements?: Record<string, string | number>) => {
      const keys = key.split(".");
      let translation: any = translations[language];
      for (const k of keys) {
        translation = translation?.[k];
      }

      let enTranslation: any = translations["en"];
      for (const k of keys) {
        enTranslation = enTranslation?.[k];
      }

      let finalTranslation = translation || enTranslation || key;

      if (typeof finalTranslation === "string" && replacements) {
        Object.keys(replacements).forEach((placeholder) => {
          finalTranslation = finalTranslation.replace(
            `{${placeholder}}`,
            String(replacements[placeholder])
          );
        });
      }
      return finalTranslation;
    },
    [language]
  );

  const addNotification = useCallback(
    async (
      userId: string,
      messageKey: keyof typeof translations.en.notifications,
      link: string,
      replacements?: Record<string, string | number>
    ) => {
      console.log("addNotification: Function called with:", {
        userId,
        messageKey,
        link,
        replacements,
      });

      // Check if we have a valid user session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.error("No valid session found, cannot add notification");
        return;
      }

      console.log("Current session user ID:", session.user.id);

      const notificationPayload = {
        user_id: userId,
        message_key: messageKey,
        link,
        is_read: false,
        created_at: new Date().toISOString(),
        replacements,
      };

      secureLogger.info("Inserting notification", { userId: userId.slice(-4) });

      const { data, error } = await supabase
        .from("notifications")
        .insert([notificationPayload])
        .select();
      if (error) {
        secureLogger.error("Error adding notification to Supabase:", error);
      } else {
        secureLogger.info("Notification added successfully");
        secureLogger.info(
          "✅ Real-time update should be triggered for this notification"
        );

        // Replace temporary notification with real one from database
        const newNotification = data[0] as AppNotification;
        setNotifications((prev) => {
          // Remove temporary notification and add real one
          const filtered = prev.filter((n) => !n.id.startsWith("temp-"));
          return [newNotification, ...filtered];
        });
        secureLogger.info(
          "✅ Temporary notification replaced with real one from database"
        );
      }
    },
    []
  );

  const login = async (email: string, pass: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      secureLogger.error("Login error:", error);
      return false;
    }
    if (data.user) {
      const parsedNames = parseOAuthUserName(data.user.user_metadata);
      const fullName = data.user.user_metadata.full_name || 
                      `${parsedNames.firstName || ''} ${parsedNames.lastName || ''}`.trim() ||
                      data.user.email!;
      
      setCurrentUser({
        id: data.user.id,
        email: data.user.email!,
        fullName: fullName,
        firstName: parsedNames.firstName,
        lastName: parsedNames.lastName,
        role: UserRole.USER,
      });
      
      // Ensure user has a profile record
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) {
        secureLogger.info("Creating profile for user without profile record");
        await createUserProfile(data.user.id, {
          firstName: parsedNames.firstName,
          lastName: parsedNames.lastName,
        });
      }
      
      return true;
    }
    return false;
  };

  const logout = async () => {
    console.log("logout: Starting logout process...");

    try {
      // Clear local state first
      setCurrentUser(null);
      setDevices([]);
      setNotifications([]);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        throw error;
      } else {
        console.log("logout: Successfully signed out from Supabase");
      }

      console.log("logout: Logout completed successfully");
    } catch (error) {
      console.error("logout: Error during logout:", error);
      throw error;
    }
  };

  const signInWithOAuth = async (provider: "google" | "apple") => {
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

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      console.error("Error sending password reset email:", error.message);
      return false;
    }
    return true;
  };

  const register = async (
    userData: Omit<User, "id" | "password_hash" | "role">,
    pass: string
  ): Promise<boolean> => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: userData.email,
      password: pass,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        },
      },
    });
    if (error) {
      console.error("Registration error:", error.message);
      return false;
    }
    if (signUpData.user) {
      const fullName = signUpData.user.user_metadata.full_name || signUpData.user.email!;
      setCurrentUser({
        id: signUpData.user.id,
        email: signUpData.user.email!,
        fullName: fullName,
        firstName: signUpData.user.user_metadata.first_name || userData.firstName,
        lastName: signUpData.user.user_metadata.last_name || userData.lastName,
        role: UserRole.USER,
      });
      
      // Create user profile record
      try {
        await createUserProfile(signUpData.user.id, {
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
        secureLogger.info("User profile created successfully for new user");
      } catch (profileError) {
        secureLogger.error("Error creating user profile:", profileError);
        // Don't fail registration if profile creation fails
      }
      
      return true;
    }
    return false;
  };

  const addDevice = async (
    deviceData: Omit<Device, "id" | "userId" | "status">,
    isLost: boolean
  ): Promise<boolean> => {
    if (!currentUser) {
      console.warn("addDevice: No current user, cannot add device.");
      return false;
    }
    console.log("addDevice: Current User ID:", currentUser.id);

    // First, let's check if the devices table exists and get its structure
    const { data: tableInfo, error: tableError } = await supabase
      .from("devices")
      .select("*")
      .limit(1);

    if (tableError) {
      console.error("Error checking devices table:", tableError);
      return false;
    }

    console.log("Devices table structure check:", tableInfo);

    // Check what status values exist in the database
    const { data: statusCheck, error: statusError } = await supabase
      .from("devices")
      .select("status")
      .limit(10);

    if (statusError) {
      console.error("Error checking status values:", statusError);
    } else {
      console.log(
        "Status values in database:",
        statusCheck?.map((d) => d.status)
      );
    }

    // Database uses camelCase field names - no mapping needed
    const newDevicePayload = {
      model: deviceData.model,
      serialNumber: deviceData.serialNumber,
      color: deviceData.color,
      description: deviceData.description,
      rewardAmount: deviceData.rewardAmount,
      // marketValue field doesn't exist in database schema, removing
      invoice_url: deviceData.invoice_url, // For lost devices: invoice URL, for found devices: photo URLs (comma-separated)
      userId: currentUser.id,
      status: isLost ? DeviceStatus.LOST : DeviceStatus.REPORTED,
      exchangeConfirmedBy: null, // UUID array - start with null, will be populated later
      lost_date: isLost ? deviceData.lost_date : null, // Add lost date for lost devices, null for found
      lost_location: isLost ? deviceData.lost_location : null, // Add lost location for lost devices, null for found
      found_date: !isLost ? deviceData.found_date : null, // Add found date for found devices, null for lost
      found_location: !isLost ? deviceData.found_location : null, // Add found location for found devices, null for lost
    };

    console.log("addDevice: Payload being sent to Supabase:", newDevicePayload); // Added for debugging

    try {
      console.log(
        "addDevice: About to insert device with payload:",
        JSON.stringify(newDevicePayload, null, 2)
      );

      const { data, error } = await supabase
        .from("devices")
        .insert([newDevicePayload])
        .select();

      console.log(
        "addDevice: Supabase response - data:",
        data,
        "error:",
        error
      );

      if (error) {
        console.error("Error adding device to Supabase:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        return false;
      } else {
        console.log("Device added to Supabase:", data);

        // Database already uses camelCase - direct assignment
        const newDevice: Device = data[0];
        if (!newDevice) {
          console.error(
            "addDevice: Could not retrieve new device data after insertion."
          );
          return true; // Still consider it a success as the device was added
        }

        // Create audit log entry for device registration
        try {
          await supabase.from("audit_logs").insert({
            event_type: 'device_registration',
            event_category: 'device',
            event_action: 'create',
            event_severity: 'info',
            user_id: currentUser.id,
            resource_type: 'device',
            resource_id: newDevice.id,
            event_description: isLost ? 'Lost device registered' : 'Found device reported',
            event_data: {
              model: newDevice.model,
              serialNumber: newDevice.serialNumber,
              lost_date: newDevice.lost_date,
              lost_location: newDevice.lost_location,
              found_date: newDevice.found_date,
              found_location: newDevice.found_location,
              invoice_url: newDevice.invoice_url, // For lost: invoice, for found: photos
            },
          });
          console.log("Audit log created for device registration");
        } catch (auditError) {
          console.error("Error creating audit log:", auditError);
          // Don't fail the whole operation if audit log fails
        }

        // Check for a match with existing devices in Supabase
        let matched = false;
        let lostDevice: Device | undefined;
        let foundDevice: Device | undefined;

        if (newDevice.status === DeviceStatus.LOST) {
          // New device is LOST, look for a REPORTED one
          console.log("Searching for REPORTED device with:", {
            status: DeviceStatus.REPORTED,
            statusValue: DeviceStatus.REPORTED,
            serialNumber: newDevice.serialNumber,
            model: newDevice.model,
          });

          // First, let's see what devices exist with this serial number and model
          const { data: allMatchingDevices, error: allDevicesError } =
            await supabase
              .from("devices")
              .select("*")
              .eq("serialNumber", newDevice.serialNumber)
              .eq("model", newDevice.model);

          if (allDevicesError) {
            console.error(
              "Error fetching all matching devices:",
              allDevicesError
            );
          } else {
            console.log(
              "All devices with same serial number and model:",
              allMatchingDevices
            );
          }

          const { data: matchedData, error: matchError } = await supabase
            .from("devices")
            .select("*")
            .eq("status", DeviceStatus.REPORTED)
            .eq("serialNumber", newDevice.serialNumber) // Use snake_case
            .eq("model", newDevice.model)
            .neq("userId", newDevice.userId) // Use snake_case and don't match with same user
            .maybeSingle();

          if (matchError) {
            console.error(
              "Error searching for matching REPORTED device:",
              matchError
            );
          }

          if (matchedData) {
            matched = true;
            lostDevice = newDevice;
            // Database uses camelCase - direct assignment
            foundDevice = matchedData as Device;
          }
        } else if (newDevice.status === DeviceStatus.REPORTED) {
          // New device is REPORTED, look for a LOST one
          console.log("Searching for LOST device with:", {
            status: DeviceStatus.LOST,
            statusValue: DeviceStatus.LOST,
            serialNumber: newDevice.serialNumber,
            model: newDevice.model,
          });

          // First, let's see what devices exist with this serial number and model
          const { data: allMatchingDevices, error: allDevicesError } =
            await supabase
              .from("devices")
              .select("*")
              .eq("serialNumber", newDevice.serialNumber)
              .eq("model", newDevice.model);

          if (allDevicesError) {
            console.error(
              "Error fetching all matching devices:",
              allDevicesError
            );
          } else {
            console.log(
              "All devices with same serial number and model:",
              allMatchingDevices
            );
          }

          const { data: matchedData, error: matchError } = await supabase
            .from("devices")
            .select("*")
            .eq("status", DeviceStatus.LOST)
            .eq("serialNumber", newDevice.serialNumber) // Use snake_case
            .eq("model", newDevice.model)
            .neq("userId", newDevice.userId) // Use snake_case and don't match with same user
            .maybeSingle();

          if (matchError) {
            console.error(
              "Error searching for matching LOST device:",
              matchError
            );
          }

          if (matchedData) {
            matched = true;
            // Database uses camelCase - direct assignment
            lostDevice = matchedData as Device;
            foundDevice = newDevice;
          }
        }

        if (matched && lostDevice && foundDevice) {
          console.log(
            "Match found! Lost device:",
            lostDevice,
            "Found device:",
            foundDevice
          );

          // Update statuses in Supabase - BOTH devices should be MATCHED
          await supabase
            .from("devices")
            .update({ status: DeviceStatus.MATCHED, updated_at: new Date().toISOString() })
            .eq("id", lostDevice.id);
          await supabase
            .from("devices")
            .update({ status: DeviceStatus.MATCHED, updated_at: new Date().toISOString() })
            .eq("id", foundDevice.id);

          // Create audit log entries for device matching
          try {
            // Audit log for lost device owner
            await supabase.from("audit_logs").insert({
              event_type: 'device_matching',
              event_category: 'device',
              event_action: 'match',
              event_severity: 'info',
              user_id: lostDevice.userId,
              resource_type: 'device',
              resource_id: lostDevice.id,
              event_description: 'Device matched with finder',
              event_data: {
                matched_at: new Date().toISOString(),
                finder_user_id: foundDevice.userId,
                match_type: 'serial_number_and_model',
              },
            });

            // Audit log for found device finder
            await supabase.from("audit_logs").insert({
              event_type: 'device_matching',
              event_category: 'device',
              event_action: 'match',
              event_severity: 'info',
              user_id: foundDevice.userId,
              resource_type: 'device',
              resource_id: foundDevice.id,
              event_description: 'Device matched with owner',
              event_data: {
                matched_at: new Date().toISOString(),
                owner_user_id: lostDevice.userId,
                match_type: 'serial_number_and_model',
              },
            });

            console.log("Audit logs created for device matching");
          } catch (auditError) {
            console.error("Error creating audit logs:", auditError);
            // Don't fail the whole operation if audit log fails
          }

          // Send notifications
          console.log(
            "addDevice: Calling addNotification for lost device owner.",
            lostDevice.userId,
            "matchFoundOwner",
            `/device/${lostDevice.id}`,
            { model: lostDevice.model }
          );
          addNotification(
            lostDevice.userId,
            "matchFoundOwner",
            `/device/${lostDevice.id}`,
            { model: lostDevice.model }
          );
          console.log(
            "addDevice: Calling addNotification for found device finder.",
            foundDevice.userId,
            "matchFoundFinder",
            `/device/${foundDevice.id}`,
            { model: foundDevice.model }
          );
          addNotification(
            foundDevice.userId,
            "matchFoundFinder",
            `/device/${foundDevice.id}`,
            { model: foundDevice.model }
          );
        }

        // Send a notification to the user who added the device, regardless of a match
        const messageKey = isLost
          ? "deviceLostConfirmation"
          : "deviceReportedConfirmation"; // Need to add these keys to constants.ts

        console.log("Adding notification with messageKey:", messageKey);
        console.log("Notification payload:", {
          userId: currentUser.id,
          messageKey,
          link: `/device/${newDevice.id}`,
          replacements: { model: newDevice.model },
        });

        // Add notification immediately to local state for instant UI update
        const immediateNotification: AppNotification = {
          id: `temp-${Date.now()}`, // Temporary ID
          user_id: currentUser.id,
          message_key: messageKey,
          link: `/device/${newDevice.id}`,
          is_read: false,
          created_at: new Date().toISOString(),
          replacements: { model: newDevice.model },
        };

        setNotifications((prev) => [immediateNotification, ...prev]);
        console.log(
          "✅ Notification immediately added to local state for instant UI update"
        );

        // Also send to Supabase (this will trigger real-time update)
        addNotification(currentUser.id, messageKey, `/device/${newDevice.id}`, {
          model: newDevice.model,
        });
        return true;
      }
    } catch (e) {
      console.error("Unhandled error adding device:", e);
      console.error("Error stack:", e.stack);
      return false;
    }
  };

  const getUserDevices = async (userId: string): Promise<Device[]> => {
    console.log("getUserDevices: Called with userId:", userId);

    if (!userId) {
      console.warn("getUserDevices: No userId provided.");
      return [];
    }

    // First, let's test if we can access the devices table at all
    console.log("getUserDevices: Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase
      .from("devices")
      .select("id")
      .limit(1);

    console.log(
      "getUserDevices: Connection test - data:",
      testData,
      "error:",
      testError
    );

    if (testError) {
      console.error(
        "getUserDevices: Cannot access devices table:",
        testError.message
      );
      return [];
    }

    console.log("getUserDevices: Querying Supabase for devices...");
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("userId", userId) // Use snake_case field name
      .order("created_at", { ascending: false }); // Order by created_at

    console.log(
      "getUserDevices: Supabase response - data:",
      data,
      "error:",
      error
    );

    if (error) {
      console.error("Error fetching devices from Supabase:", error.message);
      return [];
    }

    // Database uses camelCase - direct assignment
    const devices: Device[] = (data || []) as Device[];

    console.log("getUserDevices: Returning mapped devices:", devices);
    return devices;
  };

  const getDeviceById = async (
    deviceId: string
  ): Promise<Device | undefined> => {
    if (!deviceId) {
      console.warn("getDeviceById: No deviceId provided.");
      return undefined;
    }
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("id", deviceId)
      .single();
    if (error) {
      console.error(
        "Error fetching device by ID from Supabase:",
        error.message
      );
      return undefined;
    }

    if (!data) return undefined;

    // Database uses camelCase - direct assignment
    const device: Device = data as Device;

    return device;
  };

  // --- Core Logic: Payment ---
  // When the owner makes a payment for a matched device.
  const makePayment = async (deviceId: string) => {
    console.log("makePayment: Processing payment for device:", deviceId);
    console.log("makePayment: Current user:", currentUser?.id);

    try {
      // First, get the current device from the database to ensure we have the latest data
      const { data: dbOwnerDevice, error: ownerError } = await supabase
        .from("devices")
        .select("*")
        .eq("id", deviceId)
        .single();

      if (ownerError || !dbOwnerDevice) {
        console.error("Error fetching owner device:", ownerError);
        return;
      }

      // Database uses camelCase - direct assignment
      const ownerDevice: Device = dbOwnerDevice as Device;

      console.log("makePayment: Owner device found:", ownerDevice);

      // Find the corresponding finder's device in the database
      const { data: finderDevice, error: finderError } = await supabase
        .from("devices")
        .select("*")
        .eq("serialNumber", ownerDevice.serialNumber)
        .eq("model", ownerDevice.model)
        .eq("status", DeviceStatus.MATCHED)
        .neq("id", ownerDevice.id)
        .maybeSingle();

      if (finderError) {
        console.error("Error finding matching device:", finderError);
        return;
      }

      if (!finderDevice) {
        console.error("No matching finder device found");
        return;
      }

      // Database uses camelCase - direct assignment
      const mappedFinderDevice: Device = finderDevice as Device;

      console.log("makePayment: Finder device found:", mappedFinderDevice);

      // Update both devices to EXCHANGE_PENDING status in the database
      const { error: updateOwnerError } = await supabase
        .from("devices")
        .update({ status: DeviceStatus.EXCHANGE_PENDING })
        .eq("id", ownerDevice.id);

      if (updateOwnerError) {
        console.error("Error updating owner device:", updateOwnerError);
        return;
      }

      const { error: updateFinderError } = await supabase
        .from("devices")
        .update({ status: DeviceStatus.EXCHANGE_PENDING })
        .eq("id", mappedFinderDevice.id);

      if (updateFinderError) {
        console.error("Error updating finder device:", updateFinderError);
        return;
      }

      console.log("makePayment: Both devices updated to EXCHANGE_PENDING");

      // Update local state
      setDevices((prev) => {
        return prev.map((d) => {
          if (d.id === ownerDevice.id || d.id === mappedFinderDevice.id) {
            return { ...d, status: DeviceStatus.EXCHANGE_PENDING };
          }
          return d;
        });
      });

      // Refresh devices from Supabase to ensure consistency
      if (currentUser) {
        const refreshedDevices = await getUserDevices(currentUser.id);
        setDevices(refreshedDevices);
      }

      // Send notification to the finder that payment has been received
      addNotification(
        mappedFinderDevice.userId,
        "paymentReceivedFinder",
        `/device/${mappedFinderDevice.id}`,
        { model: mappedFinderDevice.model }
      );

      console.log("makePayment: Payment processed successfully");
    } catch (error) {
      console.error("Error in makePayment:", error);
    }
  };

  // --- Core Logic: Exchange Confirmation ---
  // A two-party confirmation system for the physical exchange.
  const confirmExchange = async (deviceId: string, userId: string) => {
    try {
      // First, get the current device from Supabase
      const { data: deviceData, error: deviceError } = await supabase
        .from("devices")
        .select("*")
        .eq("id", deviceId)
        .single();

      if (deviceError || !deviceData) {
        console.error("Error fetching device for confirmation:", deviceError);
        return;
      }

      const device = deviceData as Device;
      const alreadyConfirmed = device.exchangeConfirmedBy?.includes(userId);
      if (alreadyConfirmed) return; // Prevent double confirmation.

      // Find the matching device in Supabase
      const { data: matchingDeviceData, error: matchingError } = await supabase
        .from("devices")
        .select("*")
        .eq("serialNumber", device.serialNumber)
        .eq("model", device.model)
        .neq("id", device.id)
        .single();

      if (matchingError || !matchingDeviceData) {
        console.error("Error finding matching device:", matchingError);
        return;
      }

      const matchingDevice = matchingDeviceData as Device;

      // Add the current user's ID to the list of confirmations
      const updatedConfirmedBy = [
        ...(device.exchangeConfirmedBy || []),
        userId,
      ];

      let finalStatus = device.status;

      // If both parties have confirmed, the transaction is complete
      if (updatedConfirmedBy.length === 2) {
        finalStatus = DeviceStatus.COMPLETED;
        
        // Update both devices in Supabase
        await supabase
          .from("devices")
          .update({ 
            status: finalStatus,
            exchangeConfirmedBy: updatedConfirmedBy
          })
          .eq("id", device.id);
        
        await supabase
          .from("devices")
          .update({ 
            status: finalStatus,
            exchangeConfirmedBy: updatedConfirmedBy
          })
          .eq("id", matchingDevice.id);

        // Send final notifications to both parties
        addNotification(
          device.userId,
          "transactionCompletedOwner",
          `/device/${device.id}`,
          { model: device.model }
        );
        addNotification(
          matchingDevice.userId,
          "transactionCompletedFinder",
          `/device/${matchingDevice.id}`,
          { model: matchingDevice.model }
        );
      }
      // If only one party has confirmed, notify the other party
      else if (updatedConfirmedBy.length === 1) {
        // Update both devices in Supabase
        await supabase
          .from("devices")
          .update({ 
            exchangeConfirmedBy: updatedConfirmedBy
          })
          .eq("id", device.id);
        
        await supabase
          .from("devices")
          .update({ 
            exchangeConfirmedBy: updatedConfirmedBy
          })
          .eq("id", matchingDevice.id);

        const otherUserId = device.userId === userId ? matchingDevice.userId : device.userId;
        const otherUserDevice = device.userId === userId ? matchingDevice : device;
        addNotification(
          otherUserId,
          "exchangeConfirmationNeeded",
          `/device/${otherUserDevice.id}`,
          { model: otherUserDevice.model }
        );
      }

      // Refresh devices from Supabase to ensure consistency
      if (currentUser) {
        const refreshedDevices = await getUserDevices(currentUser.id);
        setDevices(refreshedDevices);
      }
    } catch (error) {
      console.error("Error in confirmExchange:", error);
    }
  };

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
    if (error) {
      console.error("Error marking notification as read:", error.message);
    }
  }, []);

  // Optimized: Use userId in dependency array
  const markAllAsReadForCurrentUser = useCallback(async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);
    if (error) {
      console.error("Error marking all notifications as read:", error.message);
    }
  }, [userId]);

  // Manual refresh function for testing
  // Optimized: Use userId in dependency array
  const refreshNotifications = useCallback(async () => {
    if (!userId) return;
    console.log("Manual refresh of notifications triggered");
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Manual refresh error:", error.message);
    } else {
      console.log(
        "Manual refresh successful, notifications count:",
        data?.length || 0
      );
      setNotifications(data as AppNotification[]);
    }
  }, [userId]);

  // Check for existing matches between devices
  // Optimized: Use userId in dependency array
  const checkForExistingMatches = useCallback(async () => {
    if (!userId) return;
    console.log("Checking for existing device matches...");

    try {
      // Get all devices for the current user
      const { data: userDevices, error: userError } = await supabase
        .from("devices")
        .select("*")
        .eq("userId", userId);

      if (userError) {
        console.error("Error fetching user devices:", userError);
        return;
      }

      console.log("User devices:", userDevices);

      // Check for matches between LOST and REPORTED devices
      const lostDevices = userDevices.filter(
        (d) => d.status === DeviceStatus.LOST
      );
      const reportedDevices = userDevices.filter(
        (d) => d.status === DeviceStatus.REPORTED
      );

      console.log("Lost devices:", lostDevices);
      console.log("Reported devices:", reportedDevices);

      // Check for matches
      for (const lostDevice of lostDevices) {
        for (const reportedDevice of reportedDevices) {
          console.log("Comparing devices:", {
            lost: {
              serialNumber: lostDevice.serialNumber,
              model: lostDevice.model,
            },
            reported: {
              serialNumber: reportedDevice.serialNumber,
              model: reportedDevice.model,
            },
          });

          if (
            lostDevice.serialNumber.toLowerCase() ===
              reportedDevice.serialNumber.toLowerCase() &&
            lostDevice.model.toLowerCase() ===
              reportedDevice.model.toLowerCase()
          ) {
            console.log("🎯 EXISTING MATCH FOUND:", {
              lostDevice: {
                id: lostDevice.id,
                serialNumber: lostDevice.serialNumber,
                model: lostDevice.model,
              },
              reportedDevice: {
                id: reportedDevice.id,
                serialNumber: reportedDevice.serialNumber,
                model: reportedDevice.model,
              },
            });

            // Update statuses
            await supabase
              .from("devices")
              .update({ status: DeviceStatus.PAYMENT_PENDING })
              .eq("id", lostDevice.id);
            await supabase
              .from("devices")
              .update({ status: DeviceStatus.MATCHED })
              .eq("id", reportedDevice.id);

            console.log("✅ Device statuses updated for match");

            // Send notifications
            addNotification(
              lostDevice.userId,
              "matchFoundOwner",
              `/device/${lostDevice.id}`,
              { model: lostDevice.model }
            );
            addNotification(
              reportedDevice.userId,
              "matchFoundFinder",
              `/device/${reportedDevice.id}`,
              { model: reportedDevice.model }
            );
          } else {
            console.log("❌ No match:", {
              serialNumberMatch:
                lostDevice.serialNumber.toLowerCase() ===
                reportedDevice.serialNumber.toLowerCase(),
              modelMatch:
                lostDevice.model.toLowerCase() ===
                reportedDevice.model.toLowerCase(),
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking for existing matches:", error);
    }
  }, [currentUser, addNotification]);

  // Create user profile in userProfile table
  const createUserProfile = async (
    userId: string, 
    profileData: {
      firstName?: string;
      lastName?: string;
    }
  ) => {
    try {
      console.log("createUserProfile: Creating profile for user:", userId);

      const { data, error } = await supabase
        .from("userprofile")
        .insert([{
          user_id: userId,
          first_name: profileData.firstName || null,
          last_name: profileData.lastName || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error("createUserProfile: Error creating profile:", error);
        throw error;
      }

      console.log("createUserProfile: Profile created successfully:", data);
      return data;
    } catch (error) {
      console.error("createUserProfile: Error:", error);
      throw error;
    }
  };

  // Fetch user profile data from userProfile table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("fetchUserProfile: Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from("userprofile")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("fetchUserProfile: Error fetching profile:", error);
        return null;
      }

      // Decrypt sensitive fields if data exists
      if (data) {
        console.log("fetchUserProfile: Decrypting sensitive data");
        const decryptedData = await decryptUserProfile(data);
        console.log("fetchUserProfile: Profile data fetched and decrypted");
        return decryptedData;
      }

      console.log("fetchUserProfile: Profile data fetched:", data);
      return data;
    } catch (error) {
      console.error("fetchUserProfile: Error:", error);
      return null;
    }
  };

  // Update user profile information
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Implement proper notification system (toast, alert, etc.)
  };

  const updateUserProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    tcKimlikNo?: string;
    phoneNumber?: string;
    address?: string;
    iban?: string;
  }): Promise<boolean> => {
    if (!currentUser) {
      console.error("updateUserProfile: No current user");
      return false;
    }

    try {
      console.log(
        "updateUserProfile: Updating profile for user:",
        currentUser.id
      );
      console.log("updateUserProfile: Profile data:", profileData);

      // Generate fullName from firstName and lastName
      const fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();

      // Step 1: Update user metadata in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          full_name: fullName || undefined,
        },
      });

      if (authError) {
        console.error(
          "updateUserProfile: Error updating auth user:",
          authError
        );
        throw authError;
      }

      console.log("updateUserProfile: Auth user updated successfully");

      // Step 2: Encrypt sensitive data before saving
      const profileDataToEncrypt = {
        user_id: currentUser.id,
        first_name: profileData.firstName || null,
        last_name: profileData.lastName || null,
        date_of_birth: profileData.dateOfBirth || null,
        tc_kimlik_no: profileData.tcKimlikNo || null,
        phone_number: profileData.phoneNumber || null,
        address: profileData.address || null,
        iban: profileData.iban || null,
        bank_info: profileData.iban || null, // IBAN'ı bank_info'ya da kaydet (geriye uyumluluk)
        updated_at: new Date().toISOString(),
      };

      const encryptedProfileData = await encryptUserProfile(profileDataToEncrypt);
      console.log("updateUserProfile: Sensitive data encrypted");

      // Step 3: Update or insert profile data in userProfile table
      const { error: profileError } = await supabase.from("userprofile").upsert(
        encryptedProfileData,
        {
          onConflict: "user_id",
        }
      );

      if (profileError) {
        console.error(
          "updateUserProfile: Error updating profile table:",
          profileError
        );
        throw profileError;
      }

      console.log("updateUserProfile: Profile table updated successfully");

      // Step 3: Update local state
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              fullName: fullName || prev.fullName,
              dateOfBirth: profileData.dateOfBirth,
              tcKimlikNo: profileData.tcKimlikNo,
              phoneNumber: profileData.phoneNumber,
              address: profileData.address,
              iban: profileData.iban,
              bankInfo: profileData.iban, // IBAN'ı legacy bankInfo'ya da kaydet
            }
          : null
      );

      console.log("updateUserProfile: Profile updated successfully");
      return true;
    } catch (error) {
      console.error("updateUserProfile: Error updating profile:", error);
      return false;
    }
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
    resetPassword,
    devices,
    addDevice,
    getUserDevices,
    getDeviceById,
    makePayment,
    confirmExchange,
    notifications,
    markNotificationAsRead,
    markAllAsReadForCurrentUser,
    refreshNotifications,
    checkForExistingMatches,
    fetchUserProfile,
    showNotification,
    updateUserProfile,
    supabaseClient: supabase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
