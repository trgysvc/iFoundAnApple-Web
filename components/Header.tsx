import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { UserRole } from "../types.ts";
import {
  Globe,
  LogOut,
  UserCircle,
  Bell,
  CheckCheck,
  Shield,
} from "lucide-react";
import Button from "./ui/Button";

const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    t,
    setLanguage,
    language,
    notifications,
    markNotificationAsRead,
    markAllAsReadForCurrentUser,
    refreshNotifications,
    checkForExistingMatches,
  } = useAppContext();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // New state for user menu
  const userMenuRef = useRef<HTMLDivElement>(null); // New ref for user menu

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userNotifications = currentUser
    ? notifications.filter((n) => n.user_id === currentUser.id)
    : [];
  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  // Debug logging removed to prevent infinite re-renders

  const handleNotificationClick = (notificationId: string, link: string) => {
    markNotificationAsRead(notificationId);
    navigate(link);
    setIsNotifOpen(false);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsReadForCurrentUser();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const timeSince = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-brand-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="text-2xl font-bold text-brand-blue">
              {t("appName")}
            </NavLink>
            <nav className="hidden md:flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive
                      ? "text-brand-blue"
                      : "text-brand-gray-500 hover:text-brand-blue"
                  }`
                }
              >
                {t("home")}
              </NavLink>
              {currentUser && currentUser.role === UserRole.ADMIN && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center text-sm font-medium ${
                      isActive
                        ? "text-brand-blue"
                        : "text-brand-gray-500 hover:text-brand-blue"
                    }`
                  }
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  {t("adminDashboard")}
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-brand-gray-200 transition-colors"
                >
                  <Bell className="w-5 h-5 text-brand-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-brand-gray-200 overflow-hidden">
                    <div className="p-3 flex justify-between items-center border-b">
                      <h3 className="font-semibold text-brand-gray-600">
                        {t("notifications.title")}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={refreshNotifications}
                          className="text-xs text-brand-blue hover:underline flex items-center space-x-1"
                        >
                          <span>🔄</span>
                          <span>Refresh</span>
                        </button>
                        <button
                          onClick={checkForExistingMatches}
                          className="text-xs text-brand-blue hover:underline flex items-center space-x-1"
                        >
                          <span>🔍</span>
                          <span>Check Matches</span>
                        </button>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-brand-blue hover:underline flex items-center space-x-1"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span>{t("notifications.markAllAsRead")}</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {userNotifications.length > 0 ? (
                        userNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() =>
                              handleNotificationClick(n.id, n.link)
                            }
                            className={`p-3 border-b border-brand-gray-100 cursor-pointer hover:bg-brand-gray-100 ${
                              !n.is_read ? "bg-brand-blue-light" : ""
                            }`}
                          >
                            <p className="text-sm text-brand-gray-600">
                              {t(`notifications.${n.message_key}`, n.replacements)}
                            </p>
                            <p className="text-xs text-brand-gray-400 mt-1">
                              {timeSince(n.created_at)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-center text-sm text-brand-gray-400">
                          {t("notifications.noNotifications")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* User Profile Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  variant="secondary"
                  size="sm"
                  className="hidden sm:inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-brand-gray-200 hover:bg-white hover:border-brand-blue hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-blue to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium text-brand-gray-700">{currentUser.fullName}</span>
                </Button>
                
                {/* Mobile button */}
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="sm:hidden p-2 rounded-full hover:bg-brand-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-blue to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-brand-gray-200 overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-brand-blue to-blue-600 px-4 py-3 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-semibold">
                          {currentUser.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{currentUser.fullName}</p>
                          <p className="text-blue-100 text-xs">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <NavLink
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-brand-gray-700 hover:bg-brand-blue-light hover:text-brand-blue transition-colors duration-200 group"
                      >
                        <UserCircle className="w-5 h-5 mr-3 text-brand-gray-400 group-hover:text-brand-blue transition-colors" />
                        <span className="font-medium">{t("profile")}</span>
                      </NavLink>
                      
                      <NavLink
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-brand-gray-700 hover:bg-brand-blue-light hover:text-brand-blue transition-colors duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-brand-gray-400 group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="font-medium">{t("dashboard")}</span>
                      </NavLink>

                      {/* Language Selector */}
                      <div className="px-4 py-3 border-t border-brand-gray-100">
                        <div className="flex items-center mb-2">
                          <Globe className="w-5 h-5 mr-3 text-brand-gray-400" />
                          <span className="text-sm font-medium text-brand-gray-700">{t("language")}</span>
                        </div>
                        <div className="relative">
                          <select
                            onChange={(e) =>
                              setLanguage(
                                e.target.value as "en" | "tr" | "fr" | "ja" | "es"
                              )
                            }
                            value={language}
                            className="w-full py-2 pl-3 pr-8 text-sm bg-brand-gray-100 border border-brand-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent appearance-none cursor-pointer hover:bg-brand-gray-200 transition-colors"
                          >
                            <option value="en">🇺🇸 English</option>
                            <option value="tr">🇹🇷 Türkçe</option>
                            <option value="fr">🇫🇷 Français</option>
                            <option value="ja">🇯🇵 日本語</option>
                            <option value="es">🇪🇸 Español</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-4 h-4 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-brand-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                        >
                          <LogOut className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors" />
                          <span className="font-medium">{t("logout")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Button
                  onClick={() => navigate("/login")}
                  variant="secondary"
                  size="sm"
                >
                  {t("login")}
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="primary"
                  size="sm"
                >
                  {t("register")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
