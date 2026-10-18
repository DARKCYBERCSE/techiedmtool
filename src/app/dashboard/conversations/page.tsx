'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Bot, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  User, 
  AlertCircle, 
  MoreVertical, 
  Zap,
  MessageSquare,
  PlayCircle
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';

export default function ConversationsPage() {
  const { conversations, sendMessage, activeAccount, simulateIncomingMessage } = useApp();
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter(
    (c) =>
      c.sender_username.toLowerCase().includes(search.toLowerCase()) ||
      c.last_message.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const handleQuickTestSimulate = () => {
    simulateIncomingMessage('Hey, can you send the guide please?', 'instagram_shopper');
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col h-screen overflow-hidden">
        <DashboardTopNav title="Conversations Inbox" />

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Conversation List */}
          <div className="w-80 border-r border-[#FED7E2] bg-[#FFE8EE]/70 flex flex-col">
            {/* Search Box */}
            <div className="p-3.5 border-b border-[#FED7E2]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9E7D88] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search in inbox..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#FED7E2] text-xs font-medium text-[#1F1216] placeholder-[#9E7D88] focus:outline-none focus:border-[#F43F5E] shadow-xs"
                />
              </div>
            </div>

            {/* List */}
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B4E58]">
                <MessageSquare className="w-8 h-8 text-[#FB7185] mx-auto mb-2" />
                <p className="font-bold text-[#1F1216]">No active chats</p>
                <p className="text-[11px] text-[#9E7D88] mt-1">Live customer DMs will sync automatically.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-[#FED7E2]/60">
                {filteredConversations.map((c) => {
                  const isSelected = c.id === activeConversation?.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                        isSelected ? 'bg-[#FFFFFF] border-l-4 border-[#F43F5E] shadow-xs' : 'hover:bg-[#FFF0F4]'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={c.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FECDD3]"
                        />
                        {c.automation_active && (
                          <span
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F43F5E] flex items-center justify-center text-[8px] text-white shadow-xs"
                            title="Automation Handled"
                          >
                            ⚡
                          </span>
                        )}
                      </div>

                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1F1216] truncate">
                            @{c.sender_username}
                          </span>
                          <span className="text-[10px] text-[#9E7D88]">{c.last_message_at}</span>
                        </div>
                        <p className="text-xs text-[#6B4E58] truncate leading-snug font-medium">{c.last_message}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Message Thread */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-[#FFF5F7]">
              {/* Thread Header */}
              <div className="h-14 px-6 border-b border-[#FED7E2] bg-[#FFFFFF] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#FED7E2]"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-[#1F1216] flex items-center gap-1.5">
                      @{activeConversation.sender_username}
                      <span className="text-[10px] font-normal text-[#6B4E58]">via Instagram DM</span>
                    </h3>
                    <p className="text-[10px] font-semibold text-[#10B981]">Official Meta Graph API Channel</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-[10px] font-bold text-[#E11D48]">
                    <Zap className="w-3 h-3 text-[#F43F5E]" />
                    Automation Engine Active
                  </span>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeConversation.messages.map((m) => {
                  const isOutbound = m.direction === 'OUTBOUND';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-[#9E7D88] mb-1 px-1 font-semibold">
                        <span>{isOutbound ? `@${activeAccount?.username || 'me'}` : `@${m.sender_username}`}</span>
                        {m.automation_id && (
                          <span className="text-[#E11D48] flex items-center gap-0.5 ml-1 font-bold">
                            <Bot className="w-2.5 h-2.5" /> Auto-reply
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                          isOutbound
                            ? 'bg-gradient-to-r from-[#F43F5E] to-[#EC4899] text-white rounded-tr-none shadow-md'
                            : 'bg-[#FFFFFF] text-[#1F1216] border border-[#FED7E2] rounded-tl-none shadow-xs'
                        }`}
                      >
                        {m.content}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-[#9E7D88] px-1 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Just now</span>
                        {isOutbound && <CheckCheck className="w-3 h-3 text-[#E11D48]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSend} className="p-4 border-t border-[#FED7E2] bg-[#FFFFFF] flex items-center gap-2 shadow-xs">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Write a message to reply directly via official Meta API..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] placeholder-[#9E7D88] focus:outline-none focus:border-[#F43F5E]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-2.5 rounded-xl rose-button-primary text-white text-xs font-bold shadow hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FFF5F7]">
              <div className="w-16 h-16 rounded-3xl bg-[#FFE4E6] text-[#F43F5E] flex items-center justify-center mb-3 shadow-xs">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-[#1F1216] text-base mb-1">Inbox Ready for Live Conversations</h3>
              <p className="text-xs text-[#6B4E58] max-w-sm mb-6 leading-relaxed font-medium">
                No active conversations yet. As soon as followers message your connected Instagram or comment on reels, threads will appear here with automated and manual replies.
              </p>
              <button
                onClick={handleQuickTestSimulate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md"
              >
                <PlayCircle className="w-4 h-4" />
                Simulate Sample Test DM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
