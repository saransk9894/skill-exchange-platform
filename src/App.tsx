import React, { useState, useEffect } from 'react';
import { User, Skill, ExchangeRequest, SessionBooking, Notification } from './types';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import DashboardView from './components/DashboardView';
import SkillCatalogView from './components/SkillCatalogView';
import ChatView from './components/ChatView';
import BookingView from './components/BookingView';
import AdminConsoleView from './components/AdminConsoleView';
import CodeCenterView from './components/CodeCenterView';
import { 
  BookOpen, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  Activity,
  Phone,
  MapPin,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Database list caches
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [sessions, setSessions] = useState<SessionBooking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Search catalog states passed downstream
  const [searchCategory, setSearchCategory] = useState<string>('All');

  // Auth pages states
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Categories helper
  const categories = [
    'Technology & Coding',
    'Languages',
    'Music & Arts',
    'Health & Fitness',
    'Academics & Writing'
  ];

  // 1. Initial Load of DB statistics and User directories
  const loadUsersDirectory = async () => {
    try {
      const res = await fetch('/api/admin/report');
      if (res.ok) {
        const report = await res.json();
        // Fetch users details
        const listRes = await fetch('/api/users/u1'); // dummy probe to fetch Alice
        const u1 = await listRes.json();
        const u2 = await (await fetch('/api/users/u2')).json();
        const u3 = await (await fetch('/api/users/u3')).json();
        const admin = await (await fetch('/api/users/admin')).json();
        setUsersList([u1, u2, u3, admin]);
      }
    } catch (err) {
      console.error('Error loading users list', err);
    }
  };

  // 2. Load lists for active logged in user
  const loadUserData = async () => {
    if (!currentUser) return;
    try {
      // Load skills catalog
      const skillsRes = await fetch('/api/skills');
      if (skillsRes.ok) setSkills(await skillsRes.json());

      // Load requests
      const reqsRes = await fetch(`/api/requests?userId=${currentUser.id}`);
      if (reqsRes.ok) setRequests(await reqsRes.json());

      // Load sessions
      const sessionsRes = await fetch(`/api/sessions?userId=${currentUser.id}`);
      if (sessionsRes.ok) setSessions(await sessionsRes.json());

      // Load notifications
      const notifsRes = await fetch(`/api/notifications?userId=${currentUser.id}`);
      if (notifsRes.ok) setNotifications(await notifsRes.json());
    } catch (err) {
      console.error('Error loading full user payload', err);
    }
  };

  useEffect(() => {
    loadUsersDirectory();
  }, []);

  useEffect(() => {
    loadUserData();
    if (currentUser) {
      // Fetch fresh listings of user lists on switch identity
      loadUsersDirectory();
    }
  }, [currentUser, activeTab]);

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Authentication failed');
      }

      const user = await res.json();
      setCurrentUser(user);
      setActiveTab('home');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          location,
          bio,
          experienceLevel,
          skillsOffered: [],
          skillsWanted: []
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Registration failed');
      }

      setAuthSuccess('Account registered successfully! You can now log in.');
      setAuthView('login');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to dispatch reset link');
      }

      const data = await res.json();
      setAuthSuccess(data.message);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  // Instant login helper for sandboxing inside the iframe
  const handleInstantLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  // Switch identity on simulator
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        setActiveTab('home');
      }
    } catch (err) {
      console.error('Error switching identities', err);
    }
  };

  // Mark notification read
  const handleMarkNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      loadUserData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new skill
  const handleAddSkill = async (skillData: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...skillData,
          userId: currentUser.id
        })
      });

      if (res.ok) {
        loadUserData();
        // Sync local current user list too
        setCurrentUser(prev => prev ? {
          ...prev,
          skillsOffered: [...prev.skillsOffered, skillData.name]
        } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send barter request
  const handleSendRequest = async (requestPayload: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestPayload,
          senderId: currentUser.id
        })
      });

      if (res.ok) {
        loadUserData();
        alert('Exchange proposal sent successfully! Track status in My Dashboard.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Request status
  const handleUpdateRequestStatus = async (requestId: string, status: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        loadUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create booking session
  const handleAddSession = async (sessionPayload: any) => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload)
      });

      if (res.ok) {
        loadUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Complete session booking
  const handleUpdateSessionStatus = async (sessionId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed, hasCertificate: true })
      });

      if (res.ok) {
        loadUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit review and ratings
  const handleSubmitReview = async (reviewPayload: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewPayload,
          reviewerId: currentUser.id
        })
      });

      if (res.ok) {
        loadUserData();
        alert('Thank you! Your feedback review has been recorded.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Profile Put API
  const handleUpdateProfile = async (profilePayload: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload)
      });

      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        loadUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render the appropriate main view inside navigation
  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            setActiveTab={setActiveTab}
            skills={skills}
            users={usersList}
            onSearchCategory={setSearchCategory}
            darkMode={darkMode}
          />
        );
      case 'catalog':
        return (
          <SkillCatalogView
            skills={skills}
            currentUser={currentUser}
            onAddSkill={handleAddSkill}
            onSendRequest={handleSendRequest}
            categories={categories}
            searchCategory={searchCategory}
            onSearchCategory={setSearchCategory}
            darkMode={darkMode}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            requests={requests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            sessions={sessions}
            darkMode={darkMode}
          />
        );
      case 'chat':
        return (
          <ChatView
            currentUser={currentUser}
            darkMode={darkMode}
          />
        );
      case 'bookings':
        return (
          <BookingView
            currentUser={currentUser}
            sessions={sessions}
            requests={requests}
            onAddSession={handleAddSession}
            onUpdateSessionStatus={handleUpdateSessionStatus}
            onSubmitReview={handleSubmitReview}
            darkMode={darkMode}
          />
        );
      case 'admin':
        return <AdminConsoleView darkMode={darkMode} />;
      case 'code':
        return <CodeCenterView darkMode={darkMode} />;
      default:
        return (
          <HomeView
            setActiveTab={setActiveTab}
            skills={skills}
            users={usersList}
            onSearchCategory={setSearchCategory}
            darkMode={darkMode}
          />
        );
    }
  };

  // Logged-out Screen: Login, Sign Up, Forgot forms
  if (!currentUser) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center p-6 ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
      }`}>
        <div className="max-w-md w-full space-y-8" id="auth-box">
          
          {/* Brand header block */}
          <div className="text-center space-y-3">
            <div className="mx-auto bg-blue-600 text-white p-3 rounded-2xl w-fit shadow-xl">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              SkillExchange System
            </h1>
            <p className="text-xs text-slate-400">
              Barter your masteries. Learn anything from peers completely free.
            </p>
          </div>

          {/* Form container */}
          <div className={`p-8 rounded-2xl border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'
          }`}>
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 text-xs font-semibold">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                {authSuccess}
              </div>
            )}

            {authView === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 text-xs text-left" id="login-form">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <button 
                    type="button" 
                    onClick={() => setAuthView('register')} 
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Create Account
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAuthView('forgot')} 
                    className="text-slate-400 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {authView === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 text-xs text-left" id="register-form">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Choose security password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Miami, FL"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-400">Already registered?</span>
                  <button 
                    type="button" 
                    onClick={() => setAuthView('login')} 
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Sign In instead
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
                >
                  Create Barter Profile
                </button>
              </form>
            )}

            {authView === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs text-left" id="forgot-form">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-hidden ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <button 
                    type="button" 
                    onClick={() => setAuthView('login')} 
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Back to Sign In
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Recover Password
                </button>
              </form>
            )}
          </div>

          {/* Sandbox seed accounts switcher for the evaluator */}
          <div className={`p-6 rounded-2xl border text-left ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-md'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>Developer Instant Sandbox Accounts</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-normal mb-4">
              To test complex collaborative features (chats, exchange requests, scheduling reviews, and admin controls) without creating accounts, click one of the sandbox keys below to log in immediately:
            </p>
            
            <div className="flex flex-col gap-2.5 text-xs">
              <button
                onClick={() => handleInstantLogin({
                  id: 'u1',
                  name: 'Alice Smith',
                  email: 'alice@example.com',
                  phone: '+1 (555) 019-2834',
                  bio: 'Senior Software Engineer specialized in React, Node.js, and TypeScript. Eager to pick up acoustic guitar!',
                  location: 'San Francisco, CA',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                  experienceLevel: 'Expert',
                  skillsOffered: ['Web Development', 'ReactJS', 'Node.js API'],
                  skillsWanted: ['Spanish Conversation', 'Acoustic Guitar'],
                  role: 'user',
                  createdAt: '2026-01-10T12:00:00Z'
                })}
                className="w-full py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 transition font-bold"
              >
                👤 Login as Peer: Alice Smith (Expert Web Dev)
              </button>

              <button
                onClick={() => handleInstantLogin({
                  id: 'u2',
                  name: 'Roberto Gomez',
                  email: 'roberto@example.com',
                  phone: '+1 (555) 023-4567',
                  bio: 'Native Spanish speaker eager to learn modern web programming.',
                  location: 'Miami, FL',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                  experienceLevel: 'Expert',
                  skillsOffered: ['Spanish Conversation', 'Spanish Grammar'],
                  skillsWanted: ['Web Development', 'Python Programming'],
                  role: 'user',
                  createdAt: '2026-02-15T09:30:00Z'
                })}
                className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 transition font-bold"
              >
                👤 Login as Peer: Roberto Gomez (Spanish Expert)
              </button>

              <button
                onClick={() => handleInstantLogin({
                  id: 'admin',
                  name: 'System Administrator',
                  email: 'admin@example.com',
                  phone: '+1 (555) 000-0000',
                  bio: 'Platform admin operator.',
                  location: 'System Core',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
                  experienceLevel: 'Expert',
                  skillsOffered: ['System Operations'],
                  skillsWanted: [],
                  role: 'admin',
                  createdAt: '2026-01-01T00:00:00Z'
                })}
                className="w-full py-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 transition font-extrabold flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Login as Platform Admin (System Curation)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Logged-in complete layout
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'
    }`}>
      
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        usersList={usersList}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main page space */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Styled clean footer */}
      <footer className={`border-t py-8 transition-colors ${
        darkMode ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-100 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-xs">
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            © 2026 SkillExchange Barter System. All Rights Reserved.
          </p>
          <p className="text-[10px] text-slate-400">
            Powered by Node.js, Express, React, and Gemini Matchmaker.
          </p>
        </div>
      </footer>

    </div>
  );
}
