'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Play,
  Image as ImageIcon,
  Film,
  ExternalLink,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';
import { TriggerType, KeywordMatchType } from '@/types';
import { InstagramMediaItem } from '@/lib/meta/instagram';

export default function NewAutomationBuilderPage() {
  const router = useRouter();
  const { createAutomation, activeAccount, user } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<TriggerType>('POST_COMMENT');
  const [matchType, setMatchType] = useState<KeywordMatchType>('CONTAINS');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(['price', 'guide', 'link']);
  const [actionType, setActionType] = useState<'SEND_DM' | 'SEND_LINK'>('SEND_LINK');
  const [replyText, setReplyText] = useState('Hey! Thanks for commenting on our post. Here is your direct access link:');
  const [linkUrl, setLinkUrl] = useState('https://techiedmtool.com/pricing');
  const [linkLabel, setLinkLabel] = useState('View Details & Booking');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  // Post / Reel Selection State
  const [targetScope, setTargetScope] = useState<'ALL_POSTS' | 'SPECIFIC_POST'>('SPECIFIC_POST');
  const [selectedMediaId, setSelectedMediaId] = useState<string>('');
  const [selectedMediaPermalink, setSelectedMediaPermalink] = useState<string>('');
  const [selectedMediaCaption, setSelectedMediaCaption] = useState<string>('');
  const [selectedMediaThumb, setSelectedMediaThumb] = useState<string>('');
  const [mediaList, setMediaList] = useState<InstagramMediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL');
  const [customPostUrl, setCustomPostUrl] = useState('');

  // Sample verified media for immediate testing if token is pending
  const fallbackMediaList: InstagramMediaItem[] = [
    {
      id: 'media_reel_101',
      caption: '🚀 5 Secret Growth Prompts for Creators in 2026! Comment "PROMPTS" and I will DM you the link automatically.',
      media_type: 'VIDEO',
      thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
      media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
      permalink: 'https://instagram.com/p/reel_growth_tips',
      timestamp: new Date().toISOString(),
      comments_count: 342,
      like_count: 2410,
    },
    {
      id: 'media_post_102',
      caption: '✨ The Complete 2026 Pricing Blueprint for Social Agencies & Influencers. Drop a comment for instant sheet access.',
      media_type: 'IMAGE',
      thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
      media_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
      permalink: 'https://instagram.com/p/pricing_blueprint_2026',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      comments_count: 184,
      like_count: 1250,
    },
    {
      id: 'media_reel_103',
      caption: '🎬 Behind the scenes of scaling from $0 to $10k/mo on Instagram. Comment "STORY" for our strategy roadmap.',
      media_type: 'VIDEO',
      thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      media_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      permalink: 'https://instagram.com/p/reel_scale_strategy',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      comments_count: 512,
      like_count: 4890,
    },
    {
      id: 'media_carousel_104',
      caption: '📸 10 DM Script Blueprints That Close Clients in 3 Messages or Less. Swipe & comment "SCRIPTS" below!',
      media_type: 'CAROUSEL_ALBUM',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      media_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      permalink: 'https://instagram.com/p/carousel_dm_scripts',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      comments_count: 275,
      like_count: 3100,
    },
  ];

  // Fetch real media from Meta API or fallback to active list
  useEffect(() => {
    let active = true;

    // Check if media was passed via query params (e.g. from Accounts page)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qMediaId = params.get('media_id');
      const qCaption = params.get('media_caption');
      const qThumb = params.get('media_thumb');
      if (qMediaId) {
        setSelectedMediaId(qMediaId);
        if (qCaption) setSelectedMediaCaption(decodeURIComponent(qCaption));
        if (qThumb) setSelectedMediaThumb(decodeURIComponent(qThumb));
        setTargetScope('SPECIFIC_POST');
      }
    }

    const loadMedia = async () => {
      setLoadingMedia(true);
      try {
        const targetToken = activeAccount?.access_token || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN : '');
        const res = await fetch(`/api/instagram/media?account_id=${activeAccount?.id || 'me'}&token=${targetToken || ''}`);
        const data = await res.json();
        if (active && data.success && data.media && data.media.length > 0) {
          setMediaList(data.media);
          if (!selectedMediaId) {
            setSelectedMediaId(data.media[0].id);
            setSelectedMediaCaption(data.media[0].caption || '');
            setSelectedMediaPermalink(data.media[0].permalink || '');
            setSelectedMediaThumb(data.media[0].thumbnail_url || data.media[0].media_url || '');
          }
        } else {
          setMediaList(fallbackMediaList);
          if (!selectedMediaId) {
            setSelectedMediaId(fallbackMediaList[0].id);
            setSelectedMediaCaption(fallbackMediaList[0].caption || '');
            setSelectedMediaPermalink(fallbackMediaList[0].permalink || '');
            setSelectedMediaThumb(fallbackMediaList[0].thumbnail_url || '');
          }
        }
      } catch {
        setMediaList(fallbackMediaList);
        if (!selectedMediaId) {
          setSelectedMediaId(fallbackMediaList[0].id);
          setSelectedMediaCaption(fallbackMediaList[0].caption || '');
          setSelectedMediaPermalink(fallbackMediaList[0].permalink || '');
          setSelectedMediaThumb(fallbackMediaList[0].thumbnail_url || '');
        }
      } finally {
        if (active) setLoadingMedia(false);
      }
    };

    loadMedia();
    return () => {
      active = false;
    };
  }, [activeAccount?.id, activeAccount?.access_token]);

  const handleSelectMedia = (m: InstagramMediaItem) => {
    setSelectedMediaId(m.id);
    setSelectedMediaCaption(m.caption || '');
    setSelectedMediaPermalink(m.permalink || '');
    setSelectedMediaThumb(m.thumbnail_url || m.media_url || '');
    setCustomPostUrl('');
  };

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
    if (keywords.length === 0) {
      setErrorMsg('Please specify at least one keyword trigger.');
      return;
    }
    if (triggerType === 'POST_COMMENT' && targetScope === 'SPECIFIC_POST' && !selectedMediaId && !customPostUrl.trim()) {
      setErrorMsg('Please select a Reel/Post or enter a post URL to attach this automation.');
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
        trigger: { 
          type: triggerType,
          postUrlOrId: targetScope === 'SPECIFIC_POST' ? (customPostUrl.trim() || selectedMediaId) : 'ALL_POSTS',
        },
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

  const filteredMedia = mediaList.filter((m) => {
    if (mediaFilter === 'ALL') return true;
    if (mediaFilter === 'VIDEO') return m.media_type === 'VIDEO';
    if (mediaFilter === 'IMAGE') return m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Visual Workflow Builder" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-5xl mx-auto w-full">
          {/* Top Bar Header */}
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
            {/* Step 0: Identity */}
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
                    placeholder="e.g. Viral Reel Comment to Pricing Guide"
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

            {/* Step 1: Trigger Event Selection */}
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
                  { id: 'POST_COMMENT', title: 'Comment on Reel or Post', desc: 'User comments on your feed media or Reels' },
                  { id: 'KEYWORD_MATCH', title: 'Keyword in Direct Message', desc: 'Any user sends a specific keyword in private DM' },
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

            {/* Step 1.5: Reel & Post Selector (Activated when trigger is POST_COMMENT) */}
            {triggerType === 'POST_COMMENT' && (
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#F43F5E] bg-[#FFFFFF] shadow-md space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FED7E2]">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#E11D48] flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#F43F5E]" />
                      Select Target Reel or Post
                    </h3>
                    <p className="text-xs text-[#6B4E58] mt-0.5 font-medium">
                      Choose which Instagram media triggers automated direct replies when users comment.
                    </p>
                  </div>

                  {/* Scope Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setTargetScope('SPECIFIC_POST')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        targetScope === 'SPECIFIC_POST'
                          ? 'bg-[#F43F5E] text-white shadow-xs'
                          : 'text-[#6B4E58] hover:text-[#1F1216]'
                      }`}
                    >
                      Specific Reel / Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetScope('ALL_POSTS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        targetScope === 'ALL_POSTS'
                          ? 'bg-[#F43F5E] text-white shadow-xs'
                          : 'text-[#6B4E58] hover:text-[#1F1216]'
                      }`}
                    >
                      All Reels & Posts
                    </button>
                  </div>
                </div>

                {targetScope === 'ALL_POSTS' ? (
                  <div className="p-5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#6B4E58] flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    <span>This automation will monitor comments on <strong>all current and future Reels & Posts</strong> on your connected Instagram account.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Media Type Filter Tabs */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#9E7D88] uppercase tracking-wider">Filter:</span>
                        {[
                          { id: 'ALL', label: 'All Media' },
                          { id: 'VIDEO', label: 'Reels only' },
                          { id: 'IMAGE', label: 'Posts / Carousels' },
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setMediaFilter(f.id as 'ALL' | 'VIDEO' | 'IMAGE')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              mediaFilter === f.id
                                ? 'bg-[#FFE4E6] text-[#E11D48] border border-[#FECDD3]'
                                : 'text-[#6B4E58] hover:text-[#1F1216]'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      <span className="text-[11px] text-[#9E7D88] font-bold">
                        {filteredMedia.length} posts found
                      </span>
                    </div>

                    {/* Media Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
                      {filteredMedia.map((m) => {
                        const isSelected = selectedMediaId === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleSelectMedia(m)}
                            className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all flex flex-col justify-between group bg-[#FFFFFF] shadow-xs ${
                              isSelected
                                ? 'border-[#F43F5E] ring-2 ring-[#F43F5E]/30 shadow-md scale-[1.02]'
                                : 'border-[#FED7E2] hover:border-[#FB7185]'
                            }`}
                          >
                            {/* Media Thumbnail */}
                            <div className="relative aspect-square w-full bg-[#FFF0F4] overflow-hidden">
                              <img
                                src={m.thumbnail_url || m.media_url}
                                alt="Instagram Post"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#1F1216]/75 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                                {m.media_type === 'VIDEO' ? <Play className="w-3 h-3 fill-current" /> : <ImageIcon className="w-3 h-3" />}
                                <span>{m.media_type === 'VIDEO' ? 'Reel' : 'Post'}</span>
                              </div>

                              {isSelected && (
                                <div className="absolute inset-0 bg-[#F43F5E]/20 flex items-center justify-center">
                                  <div className="w-8 h-8 rounded-full bg-[#F43F5E] text-white flex items-center justify-center shadow-lg">
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Caption preview & engagement */}
                            <div className="p-3 space-y-1.5">
                              <p className="text-[11px] text-[#1F1216] font-semibold line-clamp-2 leading-snug">
                                {m.caption || 'No caption available'}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-[#9E7D88] pt-1 border-t border-[#FED7E2]">
                                <span>💬 {m.comments_count || 0} comments</span>
                                <span>❤️ {m.like_count || 0}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Or paste direct URL */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-[#6B4E58] mb-1">
                        Or enter direct Instagram Post / Reel URL:
                      </label>
                      <input
                        type="url"
                        value={customPostUrl}
                        onChange={(e) => {
                          setCustomPostUrl(e.target.value);
                          if (e.target.value) setSelectedMediaId('custom_url');
                        }}
                        placeholder="https://www.instagram.com/reel/C3x9ZbP..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Trigger Keywords */}
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
                <div className="p-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] flex flex-wrap items-center gap-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-mono font-bold text-[#E11D48] shadow-xs"
                    >
                      "{kw}"
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
                    className="bg-transparent border-none text-xs font-semibold text-[#1F1216] focus:outline-none placeholder-[#9E7D88] flex-1 min-w-[160px] px-1"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Action Node */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#10B981] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-xs font-black text-[#10B981]">3</span>
                  Action Node (Direct Reply Dispatch)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B4E58] font-bold">Action Type:</span>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as 'SEND_DM' | 'SEND_LINK')}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
                  >
                    <option value="SEND_LINK">Send DM with Link Button</option>
                    <option value="SEND_DM">Plain Text DM Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B4E58] mb-1">Direct Message Content</label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Hey! Thanks for inquiring. Here is our direct link..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] placeholder-[#9E7D88] focus:border-[#F43F5E] focus:outline-none"
                  required
                />
              </div>

              {actionType === 'SEND_LINK' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#6B4E58] mb-1">Link URL</label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://techiedmtool.com/pricing"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] placeholder-[#9E7D88] focus:border-[#F43F5E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B4E58] mb-1">Button Call-to-Action Label</label>
                    <input
                      type="text"
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="View Pricing & Plans"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] placeholder-[#9E7D88] focus:border-[#F43F5E] focus:outline-none"
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
