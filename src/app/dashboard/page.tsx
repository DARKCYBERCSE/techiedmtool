'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  Play, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  QrCode
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';

export default function DashboardOverviewPage() {
  const { automations, activeAccount, conversations, toggleAutomationStatus, user, dmsUsedCount, dmsLimit } = useApp();

  const totalAutomations = automations.length;
  const activeCount = automations.filter((a) => a.status === 'ACTIVE').length;
  const totalTriggered = automations.reduce(
    (sum, a) => sum + (a.configuration?.stats?.triggeredCount || 0),
    0
  );
  const totalReplied = automations.reduce(
    (sum, a) => sum + (a.configuration?.stats?.repliedCount || 0),
    0
  );
  const totalFailed = automations.reduce(
    (sum, a) => sum + (a.configuration?.stats?.failedCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Dashboard Overview" />

        <main className="p-6 sm:p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-gradient-to-r from-[#FFFFFF] via-[#FFF0F4] to-[#FFE4E6] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-[11px] font-bold text-[#E11D48] mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                Meta Graph API v21.0 Active · UPI: muthurajc@slc
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">
                Welcome back, {user.name}!
              </h2>
              <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
                {activeAccount ? (
                  <>
                    Connected to <strong className="text-[#E11D48]">@{activeAccount.username}</strong> · Real-time DMs processed: <strong className="text-[#1F1216] font-mono">{dmsUsedCount}</strong>
                  </>
                ) : (
                  <>
                    No Instagram account connected yet. Connect your handle to start automating DMs.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeAccount ? (
                <Link
                  href="/dashboard/automations/new"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/20"
                >
                  <Plus className="w-4 h-4" />
                  Create Automation
                </Link>
              ) : (
                <Link
                  href="/dashboard/accounts"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/20"
                >
                  <Plus className="w-4 h-4" />
                  Connect Instagram
                </Link>
              )}
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B4E58] mb-3">
                <span className="text-xs font-bold">Messages Handled</span>
                <MessageSquare className="w-4 h-4 text-[#F43F5E]" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#1F1216] font-mono">{totalTriggered}</p>
                <p className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-bold">
                  <TrendingUp className="w-3 h-3" /> Live incoming events
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B4E58] mb-3">
                <span className="text-xs font-bold">Automated Replies Sent</span>
                <Zap className="w-4 h-4 text-[#EC4899]" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#1F1216] font-mono">{totalReplied}</p>
                <p className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-bold">
                  <TrendingUp className="w-3 h-3" /> Real-time deliveries
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B4E58] mb-3">
                <span className="text-xs font-bold">Active Automation Rules</span>
                <Bot className="w-4 h-4 text-[#10B981]" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#1F1216] font-mono">{activeCount} / {totalAutomations}</p>
                <p className="text-[11px] text-[#6B4E58] mt-1 font-medium">
                  {totalAutomations - activeCount} paused or drafts
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-5 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B4E58] mb-3">
                <span className="text-xs font-bold">Live Plan Usage</span>
                <AlertCircle className="w-4 h-4 text-[#E11D48]" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#1F1216] font-mono">{dmsUsedCount} / {dmsLimit.toLocaleString()}</p>
                <p className="text-[11px] text-[#9E7D88] mt-1 font-medium">
                  Monthly quota limit
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Automations List (Col 2) */}
            <div className="lg:col-span-2 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FED7E2]">
                <div>
                  <h3 className="font-extrabold text-[#1F1216] text-base">Active Automations</h3>
                  <p className="text-xs text-[#6B4E58]">Workflow engines monitoring your direct messages</p>
                </div>
                <Link
                  href="/dashboard/automations"
                  className="text-xs font-bold text-[#E11D48] hover:underline flex items-center gap-1"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {automations.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-[#FED7E2] bg-[#FFF5F7]">
                  <Zap className="w-8 h-8 text-[#FB7185] mx-auto mb-2" />
                  <p className="font-extrabold text-[#1F1216] text-xs">No active automation rules yet</p>
                  <p className="text-[11px] text-[#6B4E58] mt-1 mb-4">
                    Create a custom keyword rule or install one from our ready templates.
                  </p>
                  <Link
                    href="/dashboard/templates"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white rose-button-primary shadow-xs"
                  >
                    Browse Templates
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {automations.map((auto) => (
                    <div
                      key={auto.id}
                      className="p-4 rounded-2xl border border-[#FED7E2] bg-[#FFF9FA] flex items-center justify-between hover:border-[#F43F5E] transition-colors shadow-xs"
                    >
                      <div className="overflow-hidden pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              auto.status === 'ACTIVE' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                            }`}
                          />
                          <h4 className="text-xs sm:text-sm font-bold text-[#1F1216] truncate">{auto.name}</h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#E11D48] font-bold">
                            {auto.trigger_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B4E58] truncate">{auto.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#9E7D88]">
                          <span>Replies: <strong className="text-[#1F1216] font-mono">{auto.configuration?.stats?.repliedCount || 0}</strong></span>
                          <span>•</span>
                          <span>Last fired: {auto.configuration?.stats?.lastExecutedAt ? 'Active' : 'Awaiting trigger'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleAutomationStatus(auto.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            auto.status === 'ACTIVE'
                              ? 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20'
                              : 'border-[#F59E0B]/40 text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20'
                          }`}
                        >
                          {auto.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Conversations stream (Col 1) */}
            <div className="rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FED7E2]">
                  <h3 className="font-extrabold text-[#1F1216] text-base">Recent Conversations</h3>
                  <Link
                    href="/dashboard/conversations"
                    className="text-xs font-bold text-[#E11D48] hover:underline flex items-center gap-1"
                  >
                    Open Inbox <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {conversations.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-[#FED7E2] bg-[#FFF5F7]">
                    <MessageSquare className="w-8 h-8 text-[#FB7185] mx-auto mb-2" />
                    <p className="font-extrabold text-[#1F1216] text-xs">No conversations yet</p>
                    <p className="text-[11px] text-[#6B4E58] mt-1 font-medium">
                      Incoming DMs or test events will appear here in real time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.slice(0, 4).map((conv) => (
                      <div
                        key={conv.id}
                        className="p-3 rounded-2xl border border-[#FED7E2] bg-[#FFF9FA] flex items-start gap-3 hover:bg-[#FFF0F4] transition-colors"
                      >
                        <img
                          src={conv.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FECDD3]"
                        />
                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[#1F1216] truncate">@{conv.sender_username}</p>
                            <span className="text-[10px] text-[#9E7D88]">{conv.last_message_at}</span>
                          </div>
                          <p className="text-xs text-[#6B4E58] truncate mt-0.5">{conv.last_message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast Quick Actions */}
              <div className="mt-6 pt-4 border-t border-[#FED7E2]">
                <p className="text-[10px] uppercase font-bold text-[#6B4E58] tracking-wider mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard/templates"
                    className="p-2.5 rounded-xl border border-[#FED7E2] bg-[#FFF5F7] hover:bg-[#FFE4E6] text-center text-xs text-[#E11D48] font-bold block transition-colors"
                  >
                    Browse Templates
                  </Link>
                  <Link
                    href="/techie"
                    className="p-2.5 rounded-xl border border-[#FED7E2] bg-[#FFF5F7] hover:bg-[#FFE4E6] text-center text-xs text-[#E11D48] font-bold block transition-colors"
                  >
                    /techie Verify
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
