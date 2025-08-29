import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  User,
  Device,
  UserRole,
  DeviceStatus,
  AppNotification,
} from "../types";
import { translations } from "../constants";
import { createClient } from "@supabase/supabase-js";
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

const supabaseUrl = "https://zokkxkyhabihxjskdcfg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2t4a3loYWJpaHhqc2tkY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQyMDMsImV4cCI6MjA3MTE5MDIwM30.Dvnl7lUwezVDGY9I6IIgfoJXWtaw1Un_idOxTlI0xwQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useLocalStorage<Language>("app-lang", "en");
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Supabase will manage current user
  // const [users, setUsers] = useLocalStorage<User[]>('users', [defaultAdminUser]); // Removed as users are now managed by Supabase
  const [devices, setDevices] = useLocalStorage<Device[]>("devices", []);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

  // Fetch initial notifications and subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      console.log("Fetching notifications for user:", currentUser.id);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
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
    console.log("Setting up real-time subscription for user:", currentUser.id);

    // Create a unique channel name for this user
    const channelName = `notifications_${currentUser.id}`;

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
          if (payload.new && (payload.new as any).user_id === currentUser.id) {
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
  }, [currentUser]); // Re-run when currentUser changes

  // Fallback: Refresh notifications every 10 seconds if real-time fails
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      console.log("Fallback: Refreshing notifications...");
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
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
  }, [currentUser]);

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

      console.log("Inserting notification payload:", notificationPayload);

      const { data, error } = await supabase
        .from("notifications")
        .insert([notificationPayload])
        .select();
      if (error) {
        console.error("Error adding notification to Supabase:", error.message);
        console.error("Error details:", error);
      } else {
        console.log("Notification added to Supabase:", data);
        console.log("Inserted notification data:", data[0]);
        console.log(
          "✅ Real-time update should be triggered for this notification"
        );

        // Replace temporary notification with real one from database
        const newNotification = data[0] as AppNotification;
        setNotifications((prev) => {
          // Remove temporary notification and add real one
          const filtered = prev.filter((n) => !n.id.startsWith("temp-"));
          return [newNotification, ...filtered];
        });
        console.log(
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
      console.error("Login error:", error.message);
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
      console.error("Logout error:", error.message);
    } else {
      setCurrentUser(null);
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

  const register = async (
    userData: Omit<User, "id" | "password_hash" | "role">,
    pass: string
  ): Promise<boolean> => {
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
      console.error("Registration error:", error.message);
      return false;
    }
    if (signUpData.user) {
      setCurrentUser({
        id: signUpData.user.id,
        email: signUpData.user.email!,
        fullName:
          signUpData.user.user_metadata.full_name || signUpData.user.email!,
        role: UserRole.USER,
      });
      // Optionally, insert user data into a 'profiles' table here if you need to store more information
      // await supabase.from('profiles').insert([{ id: data.user.id, full_name: userData.fullName, email: userData.email, role: UserRole.USER }]);
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

    const newDevicePayload = {
      ...deviceData,
      userId: currentUser.id,
      status: isLost ? DeviceStatus.LOST : DeviceStatus.REPORTED,
      exchangeConfirmedBy: [],
      // Remove updated_at as it doesn't exist in the database
    };

    console.log("addDevice: Payload being sent to Supabase:", newDevicePayload); // Added for debugging

    try {
      const { data, error } = await supabase
        .from("devices")
        .insert([newDevicePayload])
        .select();
      if (error) {
        console.error("Error adding device to Supabase:", error.message);
        return false;
      } else {
        console.log("Device added to Supabase:", data);

        const newDevice = (data as Device[])[0];
        if (!newDevice) {
          console.error(
            "addDevice: Could not retrieve new device data after insertion."
          );
          return true; // Still consider it a success as the device was added
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
            .eq("serialNumber", newDevice.serialNumber)
            .eq("model", newDevice.model)
            .neq("userId", newDevice.userId) // Don't match with same user
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
            .eq("serialNumber", newDevice.serialNumber)
            .eq("model", newDevice.model)
            .neq("userId", newDevice.userId) // Don't match with same user
            .maybeSingle();

          if (matchError) {
            console.error(
              "Error searching for matching LOST device:",
              matchError
            );
          }

          if (matchedData) {
            matched = true;
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

          // Update statuses in Supabase
          await supabase
            .from("devices")
            .update({ status: DeviceStatus.PAYMENT_PENDING })
            .eq("id", lostDevice.id);
          await supabase
            .from("devices")
            .update({ status: DeviceStatus.MATCHED })
            .eq("id", foundDevice.id);

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
      return false;
    }
  };

  const getUserDevices = async (userId: string): Promise<Device[]> => {
    if (!userId) {
      console.warn("getUserDevices: No userId provided.");
      return [];
    }
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false }); // Order by created_at
    if (error) {
      console.error("Error fetching devices from Supabase:", error.message);
      return [];
    }
    return (data as Device[]) || [];
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
    return (data as Device) || undefined;
  };

  // --- Core Logic: Payment ---
  // When the owner makes a payment for a matched device.
  const makePayment = async (deviceId: string) => {
    console.log("makePayment: Processing payment for device:", deviceId);
    console.log("makePayment: Current user:", currentUser?.id);

    try {
      // First, get the current device from the database to ensure we have the latest data
      const { data: ownerDevice, error: ownerError } = await supabase
        .from("devices")
        .select("*")
        .eq("id", deviceId)
        .single();

      if (ownerError || !ownerDevice) {
        console.error("Error fetching owner device:", ownerError);
        return;
      }

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

      console.log("makePayment: Finder device found:", finderDevice);

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
        .eq("id", finderDevice.id);

      if (updateFinderError) {
        console.error("Error updating finder device:", updateFinderError);
        return;
      }

      console.log("makePayment: Both devices updated to EXCHANGE_PENDING");

      // Update local state
      setDevices((prev) => {
        return prev.map((d) => {
          if (d.id === ownerDevice.id || d.id === finderDevice.id) {
            return { ...d, status: DeviceStatus.EXCHANGE_PENDING };
          }
          return d;
        });
      });

      // Send notification to the finder that payment has been received
      addNotification(
        finderDevice.userId,
        "paymentReceivedFinder",
        `/device/${finderDevice.id}`,
        { model: finderDevice.model }
      );

      console.log("makePayment: Payment processed successfully");
    } catch (error) {
      console.error("Error in makePayment:", error);
    }
  };

  // --- Core Logic: Exchange Confirmation ---
  // A two-party confirmation system for the physical exchange.
  const confirmExchange = (deviceId: string, userId: string) => {
    setDevices((prev) => {
      let device = prev.find((d) => d.id === deviceId);
      if (!device) return prev;

      const alreadyConfirmed = device.exchangeConfirmedBy?.includes(userId);
      if (alreadyConfirmed) return prev; // Prevent double confirmation.

      // Find the matching device to update both records simultaneously.
      let matchingDevice = prev.find(
        (d) =>
          d.serialNumber.toLowerCase() === device!.serialNumber.toLowerCase() &&
          d.model.toLowerCase() === device!.model.toLowerCase() &&
          d.id !== device!.id
      );
      if (!matchingDevice) return prev; // Should not happen in a normal flow.

      // Add the current user's ID to the list of confirmations.
      const updatedConfirmedBy = [
        ...(device.exchangeConfirmedBy || []),
        userId,
      ];

      let finalStatus = device.status;

      // If both parties have confirmed, the transaction is complete.
      if (updatedConfirmedBy.length === 2) {
        finalStatus = DeviceStatus.COMPLETED;
        // Send final notifications to both parties.
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
      // If only one party has confirmed, notify the other party.
      else if (updatedConfirmedBy.length === 1) {
        const otherUserId =
          device.userId === userId ? matchingDevice.userId : device.userId;
        const otherUserDevice =
          device.userId === userId ? matchingDevice : device;
        addNotification(
          otherUserId,
          "exchangeConfirmationNeeded",
          `/device/${otherUserDevice.id}`,
          { model: otherUserDevice.model }
        );
      }

      // Update both devices with the new status and confirmation list.
      return prev.map((d) => {
        if (d.id === device!.id || d.id === matchingDevice!.id) {
          return {
            ...d,
            status: finalStatus,
            exchangeConfirmedBy: updatedConfirmedBy,
          };
        }
        return d;
      });
    });
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

  const markAllAsReadForCurrentUser = useCallback(async () => {
    if (!currentUser) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", currentUser.id);
    if (error) {
      console.error("Error marking all notifications as read:", error.message);
    }
  }, [currentUser]);

  // Manual refresh function for testing
  const refreshNotifications = useCallback(async () => {
    if (!currentUser) return;
    console.log("Manual refresh of notifications triggered");
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
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
  }, [currentUser]);

  // Check for existing matches between devices
  const checkForExistingMatches = useCallback(async () => {
    if (!currentUser) return;
    console.log("Checking for existing device matches...");

    try {
      // Get all devices for the current user
      const { data: userDevices, error: userError } = await supabase
        .from("devices")
        .select("*")
        .eq("userId", currentUser.id);

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
    markAllAsReadForCurrentUser,
    refreshNotifications,
    checkForExistingMatches,
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
