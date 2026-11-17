import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Layers, 
  RefreshCw, 
  Award, 
  ShieldAlert, 
  Trash2, 
  Activity, 
  Settings, 
  UserX,
  Sparkles,
  PieChart
} from 'lucide-react';

interface AdminConsoleViewProps {
  darkMode: boolean;
}

export default function AdminConsoleView({ darkMode }: AdminConsoleViewProps) {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminReport = async () => {
    try {
      const res = await fetch('/api/admin/report');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching admin reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReport();
  }, []);

  const handlePurgeFakeAccounts = async () => {
    try {
      const res = await fetch('/api/admin/remove-fake', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(data.message);
        fetchAdminReport();
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Error purging bot accounts', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user profile and their associated skill listings?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminReport();
      }
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  return (
    <div className="space-y-8 py-6 text-left" id="admin-view-container">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2.5 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Settings className="h-5 w-5 text-red-500 animate-spin-slow" />
            <span>Platform Admin Overseer Console</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit system metrics, curate active listed catalogs, and purge fake accounts or spam.
          </p>
        </div>
        
        {reports?.fakeAccounts?.length > 0 && (
          <button
            onClick={handlePurgeFakeAccounts}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl active:scale-95 transition flex items-center space-x-2 shadow-xs cursor-pointer"
            id="purge-spam-btn"
          >
            <UserX className="h-4 w-4" />
            <span>Purge All Spam Bots</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/10">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading admin ledger stats...</div>
      ) : (
        <>
          {/* Admin Stat Banners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">TOTAL USERS</span>
              <span className={`text-2xl font-extrabold block mt-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reports?.totalUsers}</span>
            </div>
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ACTIVE LISTINGS</span>
              <span className={`text-2xl font-extrabold block mt-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reports?.totalSkills}</span>
            </div>
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">BARTER SWAPS</span>
              <span className={`text-2xl font-extrabold block mt-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reports?.totalRequests}</span>
            </div>
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">COORDINATED LESSONS</span>
              <span className={`text-2xl font-extrabold block mt-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reports?.totalSessions}</span>
            </div>
            <div className={`p-5 rounded-2xl border bg-red-500/10 ${darkMode ? 'border-red-950' : 'border-red-100'}`}>
              <span className="text-[10px] text-red-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span>BOT ACCOUNTS</span>
                <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></span>
              </span>
              <span className="text-2xl font-extrabold block mt-2 tracking-tight text-red-600 dark:text-red-400">
                {reports?.fakeAccounts?.length}
              </span>
            </div>
          </div>

          {/* Lower layout content columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Active Accounts curation list */}
            <div className={`p-6 rounded-3xl border lg:col-span-2 space-y-4 ${
              darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
            }`}>
              <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Peer Users Directory Curation
              </h3>

              <div className="border rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-900 border-slate-100 dark:border-slate-900">
                {reports?.fakeAccounts?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Directory clear! No unapproved profiles detected in this sweep.
                  </div>
                ) : (
                  reports?.fakeAccounts?.map((fake: any) => (
                    <div 
                      key={fake.id}
                      className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs bg-red-500/5"
                    >
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-red-600 dark:text-red-400">{fake.name}</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-500/10 text-red-600 rounded-lg border border-red-500/10">Spam Bot</span>
                        </div>
                        <p className="text-slate-400 truncate max-w-sm">Email: {fake.email}</p>
                        <p className="italic text-slate-500">"{fake.bio}"</p>
                      </div>

                      <button
                        onClick={() => handleDeleteUser(fake.id)}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[10px] flex items-center space-x-1.5 shadow-xs cursor-pointer transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Purge Profile</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Platform reports dashboard */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
            }`}>
              <div className="flex items-center space-x-2.5 mb-4">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Admin Operations Console
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Use these panels to enforce community guidelines, remove unapproved advertisement accounts, and secure peer barter databases.
              </p>

              <div className="space-y-3 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-900">
                <p className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">LEDGER PROTOCOL:</span>
                  <span className="text-emerald-500 font-extrabold">MYSQL 8.0 READY</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">BACKEND REST SERVICE:</span>
                  <span className="text-indigo-500 font-extrabold">SPRING BOOT JPA</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">SWAP ALGORITHMS:</span>
                  <span className="text-blue-500 font-extrabold">GEMINI AI INTEGRATED</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">SECURITY INBOX:</span>
                  <span className="text-slate-500 font-bold">SSL_ACTIVE_PASS</span>
                </p>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
