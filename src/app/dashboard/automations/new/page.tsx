'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bot, 
  ArrowLeft, 
  Zap, 
  MessageSquare, 
  Link as LinkIcon, 
  FileText, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';
import { TriggerType, KeywordMatchType } from '@/types';

export default function NewAutomationBuilderPage() {
  const router = useRouter();
  const { createAutomation, activeAccount, user } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<TriggerType>('KEYWORD_MATCH');
  const [matchType, setMatchType] = useState<KeywordMatchType>('CONTAINS');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(['pricing', 'rates', 'cost']);
  const [actionType, setActionType] = useState<'SEND_DM' | 'SEND_LINK'>('SEND_LINK');
  const [replyText, setReplyText] = useState('Hey! Thanks for reaching out. Here is our official link:');
  const [linkUrl, setLinkUrl] = useState('https://techiedmtool.com/pricing');
  const [linkLabel, setLinkLabel] = useState('View Pricing & Plans');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = keywordInput.trim().toLowerCase().replace(',', '');
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please provide a name for this automation.');
      return;
    }
    if (triggerType === 'KEYWORD_MATCH' && keywords.length === 0) {
      setErrorMsg('Please specify at least one keyword trigger.');
      return;
    }

    createAutomation({
      user_id: user.id,
      instagram_account_id: activeAccount?.id || 'acc-1',
      name,
      description,
      trigger_type: triggerType,
      status,
      configuration: {
        trigger: { type: triggerType },
        conditions: [
          {
            id: `c-${Date.now()}`,
            type: 'KEYWORD',
            matchType,
            keywords,
          },
        ],
        actions: [
          {
            id: `a-${Date.now()}`,
            type: actionType,
            content: replyText,
            linkUrl: actionType === 'SEND_LINK' ? linkUrl : undefined,
            linkLabel: actionType === 'SEND_LINK' ? linkLabel : undefined,
          },
        ],
        stats: {
          triggeredCount: 0,
          repliedCount: 0,
          failedCount: 0,
        },
      },
    });

    router.push('/dashboard/automations');
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Visual Workflow Builder" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/automations"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#6B4E58] hover:text-[#1F1216] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Automations
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStatus(status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE')}
                className="text-xs px-3.5 py-1.5 rounded-xl border border-[#FED7E2] bg-white text-[#6B4E58] font-bold"
              >
                Status: <strong className="text-[#E11D48]">{status}</strong>
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/25"
              >
                <Check className="w-4 h-4" /> Save & Activate
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs font-semibold text-[#EF4444] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Workflow Canvas */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#F43F5E]">Step 0: Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B4E58] mb-1">Automation Title</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="e.g. Reel Comment to Pricing Guide"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] placeholder-[#9E7D88] focus:border-[#F43F5E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B4E58] mb-1">Description (Internal)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Automatically sends pricing link when followers comment"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] placeholder-[#9E7D88] focus:border-[#F43F5E] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Node 1: Trigger Selection */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#EC4899] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-xs font-black text-[#EC4899]">1</span>
                  Trigger Node
                </h3>
                <span className="text-xs text-[#6B4E58] font-medium">When this event occurs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'KEYWORD_MATCH', title: 'Keyword in Direct Message', desc: 'Any user sends a specific keyword in private DM' },
                  { id: 'POST_COMMENT', title: 'Comment on Reel or Post', desc: 'User leaves a comment on eligible feed media' },
                  { id: 'INCOMING_MESSAGE', title: 'Any Incoming Message', desc: 'Instant greetings for first-time senders' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTriggerType(t.id as TriggerType)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      triggerType === t.id
                        ? 'border-[#EC4899] bg-[#FCE7F3]/70 text-[#1F1216] shadow-sm'
                        : 'border-[#FED7E2] bg-[#FFF5F7] text-[#6B4E58] hover:text-[#1F1216]'
                    }`}
                  >
                    <p className="text-xs font-black mb-1">{t.title}</p>
                    <p className="text-[11px] leading-relaxed font-medium">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Node 2: Conditions (Keywords) */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#F43F5E] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-xs font-black text-[#F43F5E]">2</span>
                  Condition Node (Keywords)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B4E58] font-bold">Match Type:</span>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as KeywordMatchType)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
                  >
                    <option value="CONTAINS">Contains Keyword</option>
                    <option value="EXACT">Exact Match Only</option>
                    <option value="STARTS_WITH">Starts With</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B4E58] mb-1">
                  Trigger Keywords (press Enter or comma to add)
                </label>
                <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] flex flex-wrap gap-2 items-center">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] text-xs font-mono font-bold text-[#E11D48]"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        className="text-[#9E7D88] hover:text-[#EF4444]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleAddKeyword}
                    placeholder="Type keyword and press Enter..."
                    className="bg-transparent text-xs font-medium text-[#1F1216] focus:outline-none flex-1 min-w-[180px]"
                  />
                </div>
              </div>
            </div>

            {/* Node 3: Outbound Action */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#10B981] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-xs font-black text-[#10B981]">3</span>
                  Action Node (Response)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType('SEND_DM')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                      actionType === 'SEND_DM' ? 'bg-[#10B981] text-white shadow-xs' : 'text-[#6B4E58] bg-[#FFF0F4]'
                    }`}
                  >
                    Direct Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('SEND_LINK')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                      actionType === 'SEND_LINK' ? 'bg-[#10B981] text-white shadow-xs' : 'text-[#6B4E58] bg-[#FFF0F4]'
                    }`}
                  >
                    DM with Resource Link
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B4E58] mb-1">Reply Message Content</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] placeholder-[#9E7D88] focus:border-[#10B981] focus:outline-none h-24 resize-none"
                  placeholder="Hey! Thanks for your interest..."
                  required
                />
              </div>

              {actionType === 'SEND_LINK' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#6B4E58] mb-1">Resource Link URL</label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B4E58] mb-1">Button Label (Optional)</label>
                    <input
                      type="text"
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="View Resource"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
