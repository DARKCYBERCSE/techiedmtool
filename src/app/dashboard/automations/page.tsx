'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Trash2, 
  Pause, 
  Play, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Eye,
  X,
  Send,
  Film,
  Sparkles
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';
import type { Automation } from '@/types';

export default function AutomationsPage() {
  const { automations, deleteAutomation, toggleAutomationStatus } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PAUSED'>('ALL');
  const [viewingAutomation, setViewingAutomation] = useState<Automation | null>(null);
  const [testCommentText, setTestCommentText] = useState('link');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteToastMsg, setDeleteToastMsg] = useState<string | null>(null);

  const handleDeleteConfirmed = (id: string) => {
    const target = automations.find((a) => a.id === id);
    deleteAutomation(id);
    setDeleteConfirmId(null);
    setDeleteToastMsg(`Automation "${target?.name || 'Workflow'}" deleted successfully!`);
    setTimeout(() => setDeleteToastMsg(null), 4000);
  };

  const filteredAutomations = automations.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Automations" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">Automation Rules</h2>
              <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
                Configure auto-responders, keyword conditions, and reel comment triggers.
              </p>
            </div>

            <Link
              href="/dashboard/automations/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              New Automation
            </Link>
          </div>

          {/* Success Notification Banner */}
          {deleteToastMsg && (
            <div className="p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-between gap-3 text-xs font-bold text-[#065F46] animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>{deleteToastMsg}</span>
              </div>
              <button onClick={() => setDeleteToastMsg(null)} className="text-[#065F46] hover:text-[#1F1216]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9E7D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search automations by name or description..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-medium text-[#1F1216] placeholder-[#9E7D88] focus:outline-none focus:border-[#F43F5E] shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FFFFFF] border border-[#FED7E2] self-start shadow-xs">
              {(['ALL', 'ACTIVE', 'PAUSED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    filterStatus === status ? 'bg-[#F43F5E] text-white shadow-xs' : 'text-[#6B4E58] hover:text-[#1F1216]'
                  }`}
                >
                  {status.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Automations Table / List */}
          {filteredAutomations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm">
              <Zap className="w-12 h-12 text-[#FB7185] mx-auto mb-4" />
              <h3 className="font-extrabold text-base text-[#1F1216] mb-1">No automations found</h3>
              <p className="text-xs text-[#6B4E58] mb-6 max-w-sm mx-auto">
                No matching automations found. Create your first workflow or clear search filters.
              </p>
              <Link
                href="/dashboard/automations/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md"
              >
                <Plus className="w-4 h-4" />
                Build First Automation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAutomations.map((auto) => {
                const keywords = auto.configuration?.conditions?.flatMap((c) => c.keywords || []) || [];
                const action = auto.configuration?.actions?.[0];

                return (
                  <div
                    key={auto.id}
                    className="p-5 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#F43F5E] transition-all shadow-sm"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            auto.status === 'ACTIVE' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                          }`}
                        />
                        <h3 className="font-extrabold text-[#1F1216] text-sm sm:text-base">{auto.name}</h3>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-[#E11D48] font-bold">
                          {auto.trigger_type.replace('_', ' ')}
                        </span>
                      </div>

                      {auto.description && (
                        <p className="text-xs text-[#6B4E58] max-w-2xl font-medium">{auto.description}</p>
                      )}

                      {/* Keywords Badges */}
                      {keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-[#9E7D88] font-bold">Triggers on:</span>
                          {keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg bg-[#FFF0F4] border border-[#FED7E2] text-[10px] font-mono text-[#E11D48] font-bold"
                            >
                              "{kw}"
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Reply preview */}
                      {action && (
                        <div className="text-xs text-[#6B4E58] bg-[#FFF5F7] p-3 rounded-2xl border border-[#FED7E2] italic font-medium">
                          Action: {action.content || action.linkUrl}
                        </div>
                      )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6 self-end md:self-center border-t md:border-t-0 border-[#FED7E2] pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-sm font-mono font-black text-[#1F1216]">
                          {auto.configuration?.stats?.repliedCount || 0}
                        </p>
                        <p className="text-[10px] text-[#9E7D88] uppercase tracking-wider font-bold">Sent DMs</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setViewingAutomation(auto);
                            setTestResult(null);
                          }}
                          className="p-2.5 rounded-xl border border-[#FED7E2] text-[#6B4E58] hover:text-[#F43F5E] hover:bg-[#FFF0F4] transition-colors"
                          title="View Automation Details & Trigger Test"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleAutomationStatus(auto.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                            auto.status === 'ACTIVE'
                              ? 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20'
                              : 'border-[#F59E0B]/40 text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20'
                          }`}
                          title={auto.status === 'ACTIVE' ? 'Pause Automation' : 'Activate Automation'}
                        >
                          {auto.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(auto.id)}
                          className="p-2.5 rounded-xl border border-[#FED7E2] text-[#9E7D88] hover:text-[#EF4444] hover:bg-[#FFF0F4] transition-colors"
                          title="Delete Automation"
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

          {/* View Automation Details & Test Modal */}
          {viewingAutomation && (
            <div 
              className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={(e) => {
                if (e.target === e.currentTarget) setViewingAutomation(null);
              }}
            >
              <div className="w-full max-w-xl rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-2xl space-y-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#FED7E2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF0F4] text-[#F43F5E] flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#1F1216]">{viewingAutomation.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]">
                          {viewingAutomation.trigger_type.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          viewingAutomation.status === 'ACTIVE' ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {viewingAutomation.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewingAutomation(null)}
                    className="p-1 rounded-lg text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FFF0F4]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Body */}
                <div className="space-y-4 text-xs font-medium text-[#6B4E58]">
                  {viewingAutomation.description && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2]">
                      <span className="text-[10px] uppercase font-bold text-[#9E7D88] block mb-1">Description</span>
                      <p className="text-[#1F1216]">{viewingAutomation.description}</p>
                    </div>
                  )}

                  {/* Trigger Keywords */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#9E7D88] block">Trigger Keywords</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(viewingAutomation.configuration?.conditions?.flatMap((c) => c.keywords || []) || []).map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#FECDD3] text-xs font-mono font-bold text-[#E11D48]"
                        >
                          "{kw}"
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Configured Reply Action */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#9E7D88] block">Automated Direct Reply</span>
                    <p className="text-xs text-[#1F1216] font-semibold bg-white p-3 rounded-xl border border-[#FED7E2] leading-relaxed">
                      {viewingAutomation.configuration?.actions?.[0]?.content || 
                       viewingAutomation.configuration?.actions?.[0]?.linkUrl || 
                       'No reply content configured'}
                    </p>
                  </div>

                  {/* Live Simulation / Trigger Test */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F4] to-[#FFE4E6] border border-[#FECDD3] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#1F1216] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F43F5E]" /> Test Comment-to-DM Trigger
                      </span>
                      <span className="text-[10px] text-[#9E7D88] font-bold">Simulator</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testCommentText}
                        onChange={(e) => setTestCommentText(e.target.value)}
                        placeholder="Type a comment (e.g. link, bot)..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const keywords = (viewingAutomation.configuration?.conditions?.flatMap((c) => c.keywords || []) || []).map((k) => k.toLowerCase());
                          const isMatch = keywords.some((kw) => testCommentText.toLowerCase().includes(kw));
                          if (isMatch) {
                            const action = viewingAutomation.configuration?.actions?.[0];
                            setTestResult(`MATCH! Automated DM sent: "${action?.content || action?.linkUrl}"`);
                          } else {
                            setTestResult(`NO MATCH: Comment "${testCommentText}" does not contain any of [${keywords.join(', ')}]`);
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white rose-button-primary shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Test
                      </button>
                    </div>

                    {testResult && (
                      <div className={`p-3 rounded-xl text-xs font-bold ${
                        testResult.startsWith('MATCH') 
                          ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]' 
                          : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                      }`}>
                        {testResult}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-[#FED7E2]">
                  <span className="text-[11px] text-[#9E7D88] font-medium font-mono">
                    ID: {viewingAutomation.id.slice(0, 16)}...
                  </span>

                  <button
                    onClick={() => setViewingAutomation(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white rose-button-primary shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId && (
            <div 
              className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={(e) => {
                if (e.target === e.currentTarget) setDeleteConfirmId(null);
              }}
            >
              <div className="w-full max-w-sm rounded-3xl border border-[#FECDD3] bg-[#FFFFFF] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-extrabold text-base text-[#1F1216]">Delete This Automation?</h3>
                  <p className="text-xs text-[#6B4E58] mt-1 font-medium">
                    This automation will be permanently removed and will stop listening for reel comments or DMs.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-[#6B4E58] bg-[#FFF0F4] hover:bg-[#FFE4E6]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteConfirmed(deleteConfirmId)}
                    className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-sm"
                  >
                    Delete Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
