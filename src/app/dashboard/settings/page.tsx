'use client';

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Trash2, 
  Download, 
  Check, 
  ShieldCheck, 
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';

export default function SettingsPage() {
  const { user, updateUserProfile } = useApp();
  const [displayName, setDisplayName] = useState(user.name || 'Muthuraj C');
  const [email, setEmail] = useState(user.email || 'creator@techiedmtool.com');
  const [avatar, setAvatar] = useState(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notificationDMs, setNotificationDMs] = useState(true);
  const [notificationErrors, setNotificationErrors] = useState(true);

  const presetAvatars = [
    { label: 'Creator Pink', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { label: 'Pro Modern', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    { label: 'Agency Executive', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' },
    { label: 'Creative Tech', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(displayName, email, avatar);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Platform Settings" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-4xl mx-auto w-full">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">Account & Security</h2>
            <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
              Manage your personal credentials, webhook notifications, and privacy options.
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] space-y-6 shadow-sm">
            <h3 className="text-sm font-black text-[#1F1216] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#F43F5E]" />
              Personal Profile & Avatar
            </h3>

            {/* Avatar Preview & Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2]">
              <div className="relative">
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-[#FB7185] shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10B981] ring-2 ring-white" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-xs font-bold text-[#6B4E58]">Profile Picture URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                />
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-[#9E7D88] uppercase tracking-wider">Presets:</span>
                  {presetAvatars.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setAvatar(p.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        avatar === p.url
                          ? 'bg-[#F43F5E] text-white shadow-xs'
                          : 'bg-[#FFFFFF] border border-[#FED7E2] text-[#6B4E58] hover:border-[#F43F5E]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6B4E58] mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B4E58] mb-1">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" /> Profile Updated!
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>

          {/* Notifications */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-[#1F1216] uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#EC4899]" />
              Notification Preferences
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] cursor-pointer">
                <div>
                  <p className="font-bold text-[#1F1216]">Daily Automation Summary</p>
                  <p className="text-[11px] text-[#6B4E58] font-medium">Receive a brief daily digest of messages handled and conversions.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationDMs}
                  onChange={(e) => setNotificationDMs(e.target.checked)}
                  className="w-4 h-4 accent-[#F43F5E]"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] cursor-pointer">
                <div>
                  <p className="font-bold text-[#1F1216]">Meta API & Token Expiry Alerts</p>
                  <p className="text-[11px] text-[#6B4E58] font-medium">Alert me immediately if an Instagram account needs re-authentication.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationErrors}
                  onChange={(e) => setNotificationErrors(e.target.checked)}
                  className="w-4 h-4 accent-[#F43F5E]"
                />
              </label>
            </div>
          </div>

          {/* Data Export & Danger Zone */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#FECDD3] bg-[#FFFFFF] space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-[#EF4444] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2]">
              <div>
                <p className="text-xs font-bold text-[#1F1216]">Export All Data</p>
                <p className="text-[11px] text-[#6B4E58] font-medium">Download complete logs, configurations, and conversation backups in JSON.</p>
              </div>
              <button
                type="button"
                onClick={() => alert("Data export zip generated successfully.")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#E11D48] bg-[#FFFFFF] hover:bg-[#FFE4E6] border border-[#FECDD3] flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download Archive
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFF5F7] border border-[#FECDD3]">
              <div>
                <p className="text-xs font-bold text-[#EF4444]">Delete Account & Revoke Tokens</p>
                <p className="text-[11px] text-[#6B4E58] font-medium">Irreversibly delete your profile, unsubscribe all webhooks, and wipe data.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete your TechieDMTool account? This action cannot be reversed.")) {
                    window.location.href = "/";
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#EF4444] bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
