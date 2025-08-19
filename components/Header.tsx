
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { UserRole } from '../types';
import { Globe, LogOut, UserCircle, Bell, CheckCheck, Shield } from 'lucide-react';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { currentUser, logout, t, setLanguage, language, notifications, markNotificationAsRead, markAllAsReadForCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const userNotifications = currentUser ? notifications.filter(n => n.userId === currentUser.id) : [];
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notificationId: string, link: string) => {
    markNotificationAsRead(notificationId);
    navigate(link);
    setIsNotifOpen(false);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
      e.stopPropagation();
      markAllAsReadForCurrentUser();
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
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
              {t('appName')}
            </NavLink>
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-blue' : 'text-brand-gray-500 hover:text-brand-blue'}`}>
                {t('home')}
              </NavLink>
              {currentUser && (
                <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-blue' : 'text-brand-gray-500 hover:text-brand-blue'}`}>
                  {t('dashboard')}
                </NavLink>
              )}
              {currentUser && currentUser.role === UserRole.ADMIN && (
                 <NavLink to="/admin" className={({ isActive }) => `flex items-center text-sm font-medium ${isActive ? 'text-brand-blue' : 'text-brand-gray-500 hover:text-brand-blue'}`}>
                  <Shield className="w-4 h-4 mr-1.5" />
                  {t('adminDashboard')}
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
             {currentUser && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(prev => !prev)} className="p-2 rounded-full hover:bg-brand-gray-200 transition-colors">
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
                      <h3 className="font-semibold text-brand-gray-600">{t('notifications.title')}</h3>
                       {unreadCount > 0 && (
                         <button onClick={handleMarkAllRead} className="text-xs text-brand-blue hover:underline flex items-center space-x-1">
                           <CheckCheck className="w-4 h-4" />
                           <span>{t('notifications.markAllAsRead')}</span>
                         </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {userNotifications.length > 0 ? (
                        userNotifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n.id, n.link)}
                            className={`p-3 border-b border-brand-gray-100 cursor-pointer hover:bg-brand-gray-100 ${!n.isRead ? 'bg-brand-blue-light' : ''}`}
                          >
                            <p className="text-sm text-brand-gray-600">
                              {t(`notifications.${n.messageKey}`, n.replacements)}
                            </p>
                            <p className="text-xs text-brand-gray-400 mt-1">{timeSince(n.createdAt)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-center text-sm text-brand-gray-400">{t('notifications.noNotifications')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="relative">
              <select 
                onChange={(e) => setLanguage(e.target.value as 'en' | 'tr' | 'fr' | 'ja' | 'es')} 
                value={language}
                className="pl-8 pr-4 py-2 text-sm bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none"
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="fr">Français</option>
                <option value="ja">日本語</option>
                <option value="es">Español</option>
              </select>
              <Globe className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400 pointer-events-none" />
            </div>
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                    <UserCircle className="w-6 h-6 text-brand-gray-500" />
                    <span className="text-sm font-medium text-brand-gray-600 hidden sm:block">{currentUser.fullName}</span>
                </div>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                    <LogOut className="w-4 h-4 sm:mr-2"/>
                    <span className="hidden sm:inline">{t('logout')}</span>
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button onClick={() => navigate('/login')} variant="secondary" size="sm">{t('login')}</Button>
                <Button onClick={() => navigate('/register')} variant="primary" size="sm">{t('register')}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;