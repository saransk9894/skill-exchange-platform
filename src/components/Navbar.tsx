import React, { useState } from 'react';
import { 
  BookOpen, 
  Bell, 
  Moon, 
  Sun, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Users,
  Activity,
  Code
} from 'lucide-react';
import { User, Notification } from '../types';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  usersList: User[];
  onSwitchUser: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({
  currentUser,
  onLogout,
  usersList,
  onSwitchUser,
  activeTab,
  setActiveTab,
  notifications,
  onMarkNotificationRead,
  darkMode,
  setDarkMode
}: NavbarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Explore Skills' },
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'chat', label: 'Chat Messages' },
    { id: 'bookings', label: 'Sessions & Bookings' },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-200 ${
      darkMode ? 'bg-slate-950/80 border-slate-900 text-white' : 'bg-white/80 border-slate-200/60 text-slate-800'
    } backdrop-blur-md shadow-xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SkillExchange
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 bg-blue-50/50 text-blue-700 rounded-md dark:bg-blue-950/50 dark:text-blue-300 font-semibold border border-blue-100/50 dark:border-blue-900/30">
                v1.0
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-1.5 bg-slate-100/55 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/30 dark:border-slate-800/20" id="desktop-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  activeTab === item.id
                    ? 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/30'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Java Code Tab */}
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-150 ${
                activeTab === 'code'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              Backend Code
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-3.5" id="navbar-actions">
            
            {/* Quick Multi-Identity Simulator */}
            <div className="relative">
              <select
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className={`text-xs border rounded-lg px-2.5 py-1.5 pr-8 appearance-none font-semibold cursor-pointer transition focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-200' 
                    : 'bg-white border-slate-200/80 text-slate-700 shadow-2xs'
                }`}
                title="Simulate logging in as different system profiles"
                id="identity-simulator"
              >
                {usersList.map(u => (
                  <option key={u.id} value={u.id}>
                    👤 {u.role === 'admin' ? '[Admin] ' : ''}{u.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
                <Users className="h-3 w-3" />
              </div>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-lg border transition-all duration-150 ${
                darkMode 
                  ? 'text-yellow-400 bg-slate-900 border-slate-800 hover:bg-slate-800' 
                  : 'text-slate-500 bg-white border-slate-200/60 hover:bg-slate-50 shadow-2xs'
              }`}
              id="theme-toggler"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {/* Notification bell */}
            <div className="relative" id="notification-bell">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowProfileDropdown(false);
                }}
                className={`p-1.5 rounded-lg border transition-all duration-150 relative ${
                  darkMode 
                    ? 'text-slate-300 bg-slate-900 border-slate-800 hover:bg-slate-800' 
                    : 'text-slate-500 bg-white border-slate-200/60 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <Bell className="h-3.5 w-3.5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className={`absolute right-0 mt-2.5 w-80 rounded-2xl shadow-xl border overflow-hidden z-50 ${
                  darkMode ? 'bg-slate-950 border-slate-900 text-slate-200' : 'bg-white border-slate-200/60 text-slate-700'
                } ring-1 ring-black/5`}>
                  <div className={`p-3.5 font-bold text-[10px] uppercase tracking-wider border-b flex justify-between items-center ${
                    darkMode ? 'border-slate-900 text-slate-400 bg-slate-950' : 'border-slate-100 text-slate-500 bg-slate-50/50'
                  }`}>
                    <span>Notifications ({unreadNotifs.length} Unread)</span>
                    <button 
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowNotifDropdown(false);
                      }} 
                      className="text-blue-600 hover:underline font-bold"
                    >
                      View Inbox
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900">
                    {notifications.length === 0 ? (
                      <div className="p-5 text-center text-xs text-slate-400">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            onMarkNotificationRead(n.id);
                            setShowNotifDropdown(false);
                            if (n.type === 'chat') setActiveTab('chat');
                            else if (n.type === 'request') setActiveTab('dashboard');
                            else if (n.type === 'session') setActiveTab('bookings');
                          }}
                          className={`p-3.5 text-xs transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
                            !n.read ? 'bg-blue-50/30 dark:bg-blue-950/10 font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <p className="line-clamp-2 leading-relaxed">{n.text}</p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 block font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu / Admin link */}
            <div className="relative" id="profile-dropdown">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center rounded-full transition-transform active:scale-95 focus:outline-hidden"
              >
                <img
                  className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 hover:ring-blue-600 transition-all shadow-xs"
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                />
              </button>

              {showProfileDropdown && (
                <div className={`absolute right-0 mt-2.5 w-56 rounded-2xl shadow-xl border overflow-hidden z-50 ${
                  darkMode ? 'bg-slate-950 border-slate-900 text-slate-200' : 'bg-white border-slate-200/60 text-slate-700'
                } ring-1 ring-black/5`}>
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/40">
                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center space-x-2 font-medium"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center space-x-2 animate-pulse"
                      >
                        <Shield className="h-3.5 w-3.5 text-red-500" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-900 my-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center space-x-2 font-semibold"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer links for safety */}
      <div className="md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex overflow-x-auto gap-2 items-center">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors ${
            activeTab === 'code'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Code className="h-3.5 w-3.5" />
          Java Code
        </button>
      </div>
    </header>
  );
}
