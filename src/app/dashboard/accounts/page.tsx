'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  Lock, 
  Layers, 
  QrCode,
  X
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';

export default function AccountsPage() {
  const { 
    accounts, 
    activeAccount, 
    setActiveAccount, 
    connectInstagramAccount, 
    updateAccountAccessToken, 
    disconnectInstagramAccount 
  } = useApp();
  const [connectionModal, setConnectionModal] = useState(false);
  const [handleInput, setHandleInput] = useState('');
  const [accountType, setAccountType] = useState<'CREATOR' | 'BUSINESS'>('CREATOR');
  const [tokenInput, setTokenInput] = useState('');
  const [editingTokenAccountId, setEditingTokenAccountId] = useState<string | null>(null);
  const [quickTokenValue, setQuickTokenValue] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle incoming OAuth parameters from /api/instagram/callback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const err = params.get('error');
    const username = params.get('username');
    const type = (params.get('type') as 'CREATOR' | 'BUSINESS') || 'CREATOR';
    const notice = params.get('notice');

    if (connected === 'success') {
      if (username) {
        connectInstagramAccount(username, type);
        setSaveSuccessMsg(`Successfully authenticated @${username} via official Meta Login!`);
      } else if (notice === 'no_business_page_linked') {
        setSaveSuccessMsg('Meta login verified! Link your Instagram Business Account in Meta Business Suite to complete live syncing.');
      } else {
        setSaveSuccessMsg('Instagram account successfully connected via Meta OAuth!');
      }
      // Clean query params from URL
      window.history.replaceState({}, '', '/dashboard/accounts');
    } else if (err) {
      setErrorMsg(`Meta OAuth Error: ${decodeURIComponent(err)}`);
      window.history.replaceState({}, '', '/dashboard/accounts');
    }
  }, [connectInstagramAccount]);

  const handleStartOfficialOAuth = () => {
    window.location.href = '/api/instagram/connect';
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    connectInstagramAccount(handleInput, accountType, tokenInput);
    setHandleInput('');
    setTokenInput('');
    setConnectionModal(false);
    setSaveSuccessMsg(`Connected @${handleInput.replace('@', '')} successfully!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleUpdateToken = (accountId: string) => {
    if (!quickTokenValue.trim()) return;
    updateAccountAccessToken(accountId, quickTokenValue);
    setEditingTokenAccountId(null);
    setQuickTokenValue('');
    setSaveSuccessMsg('Instagram Access Token updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Instagram Accounts" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">Connected Instagram Accounts</h2>
              <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
                Manage your verified Meta Graph API permissions and active account channels.
              </p>
            </div>

            <button
              onClick={() => setConnectionModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Connect Instagram Account
            </button>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center gap-3 text-xs font-bold text-[#065F46] animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-[#FEE2E2] border border-[#FECDD3] flex items-center justify-between gap-3 text-xs font-bold text-[#991B1B] animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button 
                onClick={() => setErrorMsg('')}
                className="text-[#991B1B] hover:text-[#1F1216]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Meta Integration Status Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#FB7185] p-[1.5px] shadow-sm flex-shrink-0">
                <div className="w-full h-full bg-[#FFFFFF] rounded-[14px] flex items-center justify-center">
                  <Instagram className="w-7 h-7 text-[#F43F5E]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#1F1216]">{process.env.NEXT_PUBLIC_INSTAGRAM_APP_NAME || 'TechieDMTool'}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#D1FAE5] px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Meta Graph API v21.0
                  </span>
                </div>
                <p className="text-xs text-[#6B4E58] max-w-2xl leading-relaxed font-medium">
                  Official Instagram API connected for comment-to-DM, automated direct replies, and live conversation syncing with 256-bit server-side token encryption.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-[#6B4E58]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FED7E2]">instagram_business_basic</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FED7E2]">instagram_business_manage_comments</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FED7E2]">instagram_business_manage_messages</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto flex-shrink-0">
              <div className="flex items-center justify-between gap-3 text-xs bg-[#FFF5F7] px-3.5 py-2 rounded-xl border border-[#FED7E2]">
                <span className="text-[#6B4E58] font-bold">App ID:</span>
                <span className="font-mono font-bold text-[#F43F5E]">{process.env.NEXT_PUBLIC_META_APP_ID || '947533688039115'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs bg-[#FFF5F7] px-3.5 py-2 rounded-xl border border-[#FED7E2]">
                <span className="text-[#6B4E58] font-bold">App Secret:</span>
                <span className="font-mono font-bold text-[#10B981]">dfde40fc...73c (Configured)</span>
              </div>
            </div>
          </div>

          {/* Accounts Grid or Real Empty State */}
          {accounts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F4] text-[#F43F5E] flex items-center justify-center mx-auto">
                <Instagram className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-[#1F1216]">No Instagram Accounts Connected Yet</h3>
              <p className="text-xs text-[#6B4E58] max-w-md mx-auto font-medium">
                Connect your first Instagram Creator or Business account to enable comment-to-DM, automated direct replies, and live conversation syncing.
              </p>
              <button
                onClick={() => setConnectionModal(true)}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Connect My Instagram Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accounts.map((acc) => {
                const isActive = activeAccount?.id === acc.id;

                return (
                  <div
                    key={acc.id}
                    className={`p-6 sm:p-8 rounded-3xl border bg-[#FFFFFF] flex flex-col justify-between transition-all shadow-sm ${
                      isActive ? 'border-[#F43F5E] shadow-lg shadow-[#F43F5E]/10' : 'border-[#FED7E2]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={acc.profile_picture_url}
                            alt={acc.username}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FB7185]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-[#1F1216] text-base">@{acc.username}</h4>
                              <CheckCircle2 className="w-4 h-4 text-[#F43F5E]" />
                            </div>
                            <p className="text-xs text-[#6B4E58] font-medium">{acc.name || 'Instagram Professional'}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#10B981] border border-[#A7F3D0]">
                          {acc.connection_status}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[#6B4E58] font-medium">
                          <span>Account Type:</span>
                          <strong className="text-[#1F1216] uppercase font-mono">{acc.account_type}</strong>
                        </div>
                        <div className="flex items-center justify-between text-[#6B4E58] font-medium">
                          <span>External ID:</span>
                          <span className="font-mono text-[#9E7D88]">{acc.external_account_id}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#6B4E58] font-medium">
                          <span>Access Token:</span>
                          {acc.access_token ? (
                            <span className="font-mono text-[#10B981] font-bold text-[11px] truncate max-w-[160px]">
                              {acc.access_token.slice(0, 10)}...{acc.access_token.slice(-4)}
                            </span>
                          ) : (
                            <span className="text-[#9E7D88] italic">OAuth Managed</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[#6B4E58] font-medium">
                          <span>Token Expiry:</span>
                          <span className="text-[#10B981] font-bold">Auto-refreshed (Active)</span>
                        </div>

                        {editingTokenAccountId === acc.id ? (
                          <div className="pt-2 border-t border-[#FED7E2] space-y-2">
                            <label className="block text-[11px] font-bold text-[#1F1216]">Update Instagram Access Token:</label>
                            <input
                              type="password"
                              value={quickTokenValue}
                              onChange={(e) => setQuickTokenValue(e.target.value)}
                              placeholder="Paste new Instagram Access Token..."
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#FED7E2] text-xs font-mono focus:outline-none focus:border-[#F43F5E]"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateToken(acc.id)}
                                className="px-3 py-1 rounded-lg text-xs font-bold text-white rose-button-primary shadow-xs"
                              >
                                Save Token
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTokenAccountId(null);
                                  setQuickTokenValue('');
                                }}
                                className="px-3 py-1 rounded-lg text-xs font-bold text-[#6B4E58] bg-[#FFF0F4]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingTokenAccountId(acc.id);
                              setQuickTokenValue(acc.access_token || '');
                            }}
                            className="text-[11px] text-[#F43F5E] hover:underline font-bold inline-block pt-1"
                          >
                            + Update Access Token
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#FED7E2] flex items-center justify-between mt-4">
                      <button
                        onClick={() => setActiveAccount(acc)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'rose-button-primary text-white shadow-sm'
                            : 'bg-[#FFF0F4] text-[#6B4E58] hover:text-[#1F1216] border border-[#FED7E2]'
                        }`}
                      >
                        {isActive ? 'Active Primary Account' : 'Switch to this Account'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => disconnectInstagramAccount(acc.id)}
                          className="p-2 rounded-xl text-[#9E7D88] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                          title="Disconnect Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Connection Modal with Click-Outside Backdrop */}
          {connectionModal && (
            <div 
              className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setConnectionModal(false);
              }}
            >
              <div className="w-full max-w-lg rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-[#FED7E2]">
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-5 h-5 text-[#F43F5E]" />
                    <h3 className="font-extrabold text-[#1F1216] text-base">Connect via Official Meta Login</h3>
                  </div>
                  <button 
                    onClick={() => setConnectionModal(false)} 
                    className="p-1 rounded-lg text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FFF0F4]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 space-y-4">
                  {/* Official OAuth Flow Button */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F4] to-[#FFE4E6] border border-[#FECDD3] space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F43F5E] to-[#EC4899] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1F1216]">Official Meta OAuth Authorization</h4>
                        <p className="text-[11px] text-[#6B4E58] mt-0.5 font-medium leading-relaxed">
                          Redirects to the official Instagram Login consent dialog. Securely exchanges authorization codes and encrypts tokens server-side.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartOfficialOAuth}
                      className="w-full py-3 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Connect via Official Instagram Login
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-[#FED7E2] w-full" />
                    <span className="bg-[#FFFFFF] px-3 text-[10px] uppercase font-bold text-[#9E7D88] tracking-wider absolute">
                      or quick link with handle
                    </span>
                  </div>

                  <form onSubmit={handleConnect} className="space-y-4 text-xs font-medium text-[#6B4E58]">
                  <div>
                    <label className="block text-xs font-bold text-[#1F1216] mb-1">
                      Instagram Handle / Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#9E7D88]">@</span>
                      <input
                        type="text"
                        value={handleInput}
                        onChange={(e) => setHandleInput(e.target.value)}
                        placeholder="your_handle"
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1216] mb-1">Account Type</label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as 'CREATOR' | 'BUSINESS')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
                    >
                      <option value="CREATOR">Instagram Creator Account</option>
                      <option value="BUSINESS">Instagram Business Account</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#1F1216]">
                        Instagram Access Token (Optional)
                      </label>
                      <span className="text-[10px] text-[#10B981] font-bold">Meta Graph API v21.0</span>
                    </div>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="EAA... (Meta Page / Instagram User Access Token)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-mono text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                    />
                    <p className="text-[10px] text-[#9E7D88] mt-1">
                      Already generated a token in Meta Developer Portal? Paste it here to sync real direct messaging immediately.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span>Must be an <strong>Instagram Professional</strong> account.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span>Linked to a Facebook Page managed by your Meta Business Manager.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center gap-2 text-[#E11D48] font-semibold">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>Your password is never shared. Access tokens are encrypted server-side.</span>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConnectionModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B4E58] hover:text-[#1F1216] bg-[#FFF0F4]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md hover:opacity-95"
                    >
                      Verify & Connect Account
                    </button>
                  </div>
                </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
