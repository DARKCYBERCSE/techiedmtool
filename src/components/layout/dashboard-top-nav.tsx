'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  ChevronDown, 
  X, 
  QrCode,
  CheckCircle2,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { useApp } from '@/context/app-context';

export function DashboardTopNav({ title }: { title?: string }) {
  const { 
    accounts, 
    activeAccount, 
    setActiveAccount, 
    connectInstagramAccount,
    dmsUsedCount,
    dmsLimit
  } = useApp();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [newHandle, setNewHandle] = useState('');

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const connectModalRef = useRef<HTMLDivElement>(null);

  // Close dropdowns and modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
        setNotificationMenuOpen(false);
        setConnectModalOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return;
    connectInstagramAccount(newHandle);
    setNewHandle('');
    setConnectModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#FED7E2] bg-[#FFF5F7]/95 backdrop-blur-md px-6 flex items-center justify-between shadow-xs">
      {/* Title / Breadcrumbs */}
      <div>
        <h1 className="text-lg font-extrabold text-[#1F1216] tracking-tight">{title || 'Dashboard'}</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* UPI ID Badge */}
        <Link 
          href="/dashboard/billing"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-xs font-bold text-[#E11D48] hover:bg-[#FFD1DC] transition-colors"
          title="Direct UPI ID for Billing"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>UPI: muthurajc@slc</span>
        </Link>

        {/* Account Switcher Dropdown with Click-Outside Close */}
        <div className="relative" ref={accountDropdownRef}>
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#FED7E2] bg-[#FFFFFF] hover:bg-[#FFF0F4] text-xs font-semibold text-[#1F1216] transition-colors shadow-xs"
          >
            <div className={`w-2 h-2 rounded-full ${activeAccount ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
            <span className="max-w-[120px] truncate">
              {activeAccount ? `@${activeAccount.username}` : 'No Account Connected'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#6B4E58]" />
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#FED7E2]">
                <p className="text-[10px] font-bold text-[#6B4E58] uppercase tracking-wider">
                  Instagram Accounts
                </p>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setConnectModalOpen(true);
                  }}
                  className="text-[10px] font-bold text-[#E11D48] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Connect
                </button>
              </div>

              {accounts.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-[#6B4E58] font-medium mb-2">No accounts connected yet</p>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setConnectModalOpen(true);
                    }}
                    className="w-full py-1.5 rounded-xl text-xs font-bold text-white rose-button-primary shadow-xs"
                  >
                    + Connect Account
                  </button>
                </div>
              ) : (
                <div className="py-1 space-y-1 max-h-48 overflow-y-auto">
                  {accounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setActiveAccount(acc);
                        setAccountMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        activeAccount?.id === acc.id 
                          ? 'bg-[#FFE4E6] text-[#E11D48] font-bold' 
                          : 'text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FFF0F4]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={acc.profile_picture_url} className="w-5 h-5 rounded-full object-cover" alt="" />
                        <span className="truncate">@{acc.username}</span>
                      </div>
                      {activeAccount?.id === acc.id && <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown with Click-Outside Close */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
            className="p-2 rounded-xl border border-[#FED7E2] bg-[#FFFFFF] text-[#6B4E58] hover:text-[#E11D48] hover:bg-[#FFF0F4] transition-colors relative shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E]" />
          </button>

          {notificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#FED7E2]">
                <h4 className="text-xs font-bold text-[#1F1216]">Notifications</h4>
                <button
                  onClick={() => setNotificationMenuOpen(false)}
                  className="text-xs text-[#9E7D88] hover:text-[#1F1216]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2]">
                  <p className="font-bold text-[#1F1216]">Live Webhook Active</p>
                  <p className="text-[11px] text-[#6B4E58] mt-0.5">Official Meta Graph API connection verified and ready.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2]">
                  <p className="font-bold text-[#1F1216]">UPI ID Available</p>
                  <p className="text-[11px] text-[#6B4E58] mt-0.5">Pay via muthurajc@slc for instant tier upgrade verification.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connect Instagram Modal with Backdrop Click-Outside */}
      {connectModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConnectModalOpen(false);
          }}
        >
          <div 
            ref={connectModalRef}
            className="w-full max-w-md rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#FED7E2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#F43F5E]">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1F1216] text-base">Connect Instagram Account</h3>
                  <p className="text-[11px] text-[#6B4E58]">Official Meta Professional Connection</p>
                </div>
              </div>
              <button 
                onClick={() => setConnectModalOpen(false)} 
                className="p-1 rounded-lg text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FFF0F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/instagram/connect';
                }}
                className="w-full py-3 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Connect via Official Instagram Login
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#FED7E2] w-full" />
                <span className="bg-[#FFFFFF] px-2.5 text-[9px] uppercase font-bold text-[#9E7D88] tracking-wider absolute">
                  or enter handle
                </span>
              </div>

              <form onSubmit={handleConnectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B4E58] mb-1">Instagram Handle / Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9E7D88]">@</span>
                  <input
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-[#1F1216] text-xs font-semibold focus:outline-none focus:border-[#F43F5E]"
                    placeholder="your_brand_name"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] text-[11px] text-[#E11D48] space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Meta API Requirements
                </p>
                <p>Must be an Instagram Business or Creator account connected to a Facebook Page.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B4E58] hover:text-[#1F1216] bg-[#FFE8EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white rose-button-primary shadow-md"
                >
                  Link Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}
    </header>
  );
}
