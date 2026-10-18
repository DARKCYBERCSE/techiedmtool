'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { InstagramAccount, Automation, ConversationThread, Template, MessageLog, UpiPaymentVerification } from '@/types';
import {
  INITIAL_DEMO_ACCOUNTS,
  INITIAL_DEMO_AUTOMATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_TEMPLATES,
} from '@/lib/mock-data';
import { evaluateAutomationRules } from '@/lib/automations/engine';

interface AppContextType {
  accounts: InstagramAccount[];
  activeAccount: InstagramAccount | null;
  setActiveAccount: (account: InstagramAccount) => void;
  connectInstagramAccount: (
    handle: string, 
    accountType?: 'CREATOR' | 'BUSINESS', 
    accessToken?: string,
    extra?: { name?: string; profilePictureUrl?: string; externalAccountId?: string }
  ) => InstagramAccount;
  updateAccountAccessToken: (accountId: string, token: string) => void;
  disconnectInstagramAccount: (accountId: string) => void;
  automations: Automation[];
  createAutomation: (automation: Omit<Automation, 'id' | 'created_at' | 'updated_at'>) => Automation;
  updateAutomation: (id: string, updates: Partial<Automation>) => void;
  deleteAutomation: (id: string) => void;
  toggleAutomationStatus: (id: string) => void;
  conversations: ConversationThread[];
  sendMessage: (conversationId: string, content: string) => void;
  simulateIncomingMessage: (text: string, senderUsername?: string) => void;
  templates: Template[];
  createTemplate: (template: Omit<Template, 'id' | 'created_at'>) => Template;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: string;
    plan: 'free' | 'pro' | 'agency';
    isAuthenticated: boolean;
  };
  updateUserProfile: (name: string, email: string, avatar?: string) => void;
  loginUser: (email: string, name?: string) => void;
  registerUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  upgradePlan: (plan: 'free' | 'pro' | 'agency') => void;
  dmsUsedCount: number;
  dmsLimit: number;
  upiVerifications: UpiPaymentVerification[];
  submitUpiVerification: (data: Omit<UpiPaymentVerification, 'id' | 'status' | 'submittedAt'>) => void;
  verifyUpiPayment: (id: string) => void;
  rejectUpiPayment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<InstagramAccount | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [dmsUsedCount, setDmsUsedCount] = useState<number>(0);

  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: string;
    plan: 'free' | 'pro' | 'agency';
    isAuthenticated: boolean;
  }>({
    id: '',
    email: '',
    name: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'creator',
    plan: 'free',
    isAuthenticated: false,
  });

  const [upiVerifications, setUpiVerifications] = useState<UpiPaymentVerification[]>([]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('techie_accounts');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        setAccounts(parsed);
        if (parsed.length > 0) setActiveAccount(parsed[0]);
      } else {
        // Auto-seed user's verified Instagram Creator Account from environment token
        const defaultAcc: InstagramAccount = {
          id: 'acc-techiemuthuraj',
          user_id: 'user-default',
          external_account_id: '28373437965671281',
          username: 'techiemuthuraj',
          name: 'Techie Muthuraj',
          profile_picture_url: 'https://scontent.cdninstagram.com/v/t51.82787-19/825326135_17881428522689519_8873317729779957728_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=102&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=G8kgqQPgZ24Q7kNvwGytY5w&_nc_oc=AdoKBV23LQnb7UpngvYAsO4JCnLzMac7xZPtiIVbbxwX75HLdiZkZ0KNDIynpmds_2QmvCzYEXiRuuHcu6VLPOlX&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&edm=AP4hL3IEAAAA&_nc_gid=HctZK2DO6qxnyKb-Olc2xA&_nc_tpa=Q5bMBQINWZdl4boXdojiE3PJWoG4SlDR3mP7r5-afuELjmWxk14KUpo8Of7K3Zt90DmtLp8-r9M1bn8S&oh=00_AQPS-d9kHR73euzeVsKCkbWqP8Ren_5_qJ7Nhv-03Y5K0w&oe=6ADAC06D',
          account_type: 'CREATOR',
          connection_status: 'CONNECTED',
          access_token: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || 'IGAAN7QQvMlLBBZAFlQVFRVa2d3c0plRjV4bzU1RW1jNkZANUVhIWUVhV2ZANNzlTM09XN3VpOHJpOVdmNTdGOTdfTVhoWjE0WHU4c01vczB0ZAmttV2x5bk9BSTJHeEtPV0h6aHQwVk84UnYxbVdmUDYwbnNiTzZAHWldQeEdmYjZASawZDZD',
          token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setAccounts([defaultAcc]);
        setActiveAccount(defaultAcc);
        try {
          localStorage.setItem('techie_accounts', JSON.stringify([defaultAcc]));
        } catch {}
      }

      const savedAutomations = localStorage.getItem('techie_automations');
      if (savedAutomations) setAutomations(JSON.parse(savedAutomations));

      const savedTemplates = localStorage.getItem('techie_templates');
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));

      const savedConvs = localStorage.getItem('techie_conversations');
      if (savedConvs) setConversations(JSON.parse(savedConvs));

      const savedCount = localStorage.getItem('techie_dms_count');
      if (savedCount) setDmsUsedCount(Number(savedCount) || 0);

      const savedVerifications = localStorage.getItem('techie_upi_verifications');
      if (savedVerifications) setUpiVerifications(JSON.parse(savedVerifications));

      const savedUser = localStorage.getItem('techie_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const dmsLimit = user.plan === 'free' ? 250 : user.plan === 'pro' ? 5000 : 25000;

  const connectInstagramAccount = (
    handle: string, 
    accountType: 'CREATOR' | 'BUSINESS' = 'CREATOR',
    accessToken?: string,
    extra?: {
      name?: string;
      profilePictureUrl?: string;
      externalAccountId?: string;
    }
  ): InstagramAccount => {
    const cleanHandle = handle.replace('@', '').trim();
    const newAccount: InstagramAccount = {
      id: `acc-${Date.now()}`,
      user_id: user.id,
      external_account_id: extra?.externalAccountId || `ig-${Date.now()}`,
      username: cleanHandle,
      name: extra?.name || `${cleanHandle} (Connected)`,
      profile_picture_url: extra?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      account_type: accountType,
      connection_status: 'CONNECTED',
      access_token: accessToken || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN : '') || '',
      token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [...accounts.filter(a => a.username.toLowerCase() !== cleanHandle.toLowerCase()), newAccount];
    setAccounts(updated);
    setActiveAccount(newAccount);
    try {
      localStorage.setItem('techie_accounts', JSON.stringify(updated));
    } catch {}
    return newAccount;
  };

  const updateAccountAccessToken = (accountId: string, token: string) => {
    const updated = accounts.map((acc) =>
      acc.id === accountId ? { ...acc, access_token: token, connection_status: 'CONNECTED' as const, updated_at: new Date().toISOString() } : acc
    );
    setAccounts(updated);
    if (activeAccount?.id === accountId) {
      setActiveAccount({ ...activeAccount, access_token: token });
    }
    try {
      localStorage.setItem('techie_accounts', JSON.stringify(updated));
    } catch {}
  };

  const disconnectInstagramAccount = (accountId: string) => {
    const updated = accounts.filter((a) => a.id !== accountId);
    setAccounts(updated);
    if (activeAccount?.id === accountId) {
      setActiveAccount(updated[0] || null);
    }
    try {
      localStorage.setItem('techie_accounts', JSON.stringify(updated));
    } catch {}
  };

  const loginUser = (email: string, name?: string) => {
    const updatedUser = {
      ...user,
      email,
      name: name || email.split('@')[0],
      isAuthenticated: true,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('techie_user', JSON.stringify(updatedUser));
    } catch {}
  };

  const updateUserProfile = (name: string, email: string, avatar?: string) => {
    const updatedUser = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      avatar: avatar && avatar.trim() ? avatar.trim() : user.avatar,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('techie_user', JSON.stringify(updatedUser));
    } catch {}
  };

  const registerUser = (email: string, name?: string) => {
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'creator',
      plan: 'free' as const,
      isAuthenticated: false, // will require login after registration
    };
    try {
      localStorage.setItem('techie_registered_user', JSON.stringify(newUser));
    } catch {}
  };

  const logoutUser = () => {
    const updatedUser = {
      id: '',
      email: '',
      name: '',
      avatar: '',
      role: 'creator',
      plan: 'free' as const,
      isAuthenticated: false,
    };
    setUser(updatedUser);
    try {
      localStorage.removeItem('techie_user');
    } catch {}
    window.location.href = '/login';
  };

  const createAutomation = (newAuto: Omit<Automation, 'id' | 'created_at' | 'updated_at'>): Automation => {
    const fullAutomation: Automation = {
      ...newAuto,
      id: `auto-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [fullAutomation, ...automations];
    setAutomations(updated);
    try {
      localStorage.setItem('techie_automations', JSON.stringify(updated));
    } catch {}
    return fullAutomation;
  };

  const updateAutomation = (id: string, updates: Partial<Automation>) => {
    const updated = automations.map((a) =>
      a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
    );
    setAutomations(updated);
    try {
      localStorage.setItem('techie_automations', JSON.stringify(updated));
    } catch {}
  };

  const deleteAutomation = (id: string) => {
    const updated = automations.filter((a) => a.id !== id);
    setAutomations(updated);
    try {
      localStorage.setItem('techie_automations', JSON.stringify(updated));
    } catch {}
  };

  const toggleAutomationStatus = (id: string) => {
    const updated: Automation[] = automations.map((a) => {
      if (a.id === id) {
        const nextStatus: 'ACTIVE' | 'PAUSED' = a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...a, status: nextStatus, updated_at: new Date().toISOString() };
      }
      return a;
    });
    setAutomations(updated);
    try {
      localStorage.setItem('techie_automations', JSON.stringify(updated));
    } catch {}
  };

  const sendMessage = (conversationId: string, content: string) => {
    const newMessage: MessageLog = {
      id: `msg-${Date.now()}`,
      user_id: user.id,
      instagram_account_id: activeAccount?.id || 'acc-primary',
      direction: 'OUTBOUND',
      sender_username: activeAccount?.username || 'me',
      content,
      status: 'DELIVERED',
      created_at: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            last_message: content,
            last_message_at: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Bump real DMs usage count
    setDmsUsedCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('techie_dms_count', String(next));
      } catch {}
      return next;
    });
  };

  const simulateIncomingMessage = (text: string, senderUsername = 'instagram_user') => {
    const inboundMessage: MessageLog = {
      id: `msg-${Date.now()}`,
      user_id: user.id,
      instagram_account_id: activeAccount?.id || 'acc-primary',
      direction: 'INBOUND',
      sender_username: senderUsername,
      content: text,
      status: 'DELIVERED',
      created_at: new Date().toISOString(),
    };

    // Check automation match
    const match = evaluateAutomationRules(
      {
        senderId: 'simulated-sender-id',
        senderUsername,
        text,
        instagramAccountId: activeAccount?.id || '',
      },
      automations
    );

    let outboundReply: MessageLog | null = null;
    if (match.matched && match.replyText) {
      let finalContent = match.replyText;
      if (match.linkUrl) {
        finalContent += ` ${match.linkUrl}`;
      }

      outboundReply = {
        id: `msg-${Date.now() + 1}`,
        user_id: user.id,
        instagram_account_id: activeAccount?.id || 'acc-primary',
        direction: 'OUTBOUND',
        sender_username: activeAccount?.username || 'techiedm.bot',
        content: finalContent,
        status: 'DELIVERED',
        automation_id: match.automation?.id,
        created_at: new Date(Date.now() + 500).toISOString(),
      };

      // Bump automation stats
      if (match.automation) {
        updateAutomation(match.automation.id, {
          configuration: {
            ...match.automation.configuration,
            stats: {
              triggeredCount: (match.automation.configuration.stats?.triggeredCount || 0) + 1,
              repliedCount: (match.automation.configuration.stats?.repliedCount || 0) + 1,
              failedCount: match.automation.configuration.stats?.failedCount || 0,
              lastExecutedAt: new Date().toISOString(),
            },
          },
        });
      }

      // Bump real usage count
      setDmsUsedCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('techie_dms_count', String(next));
        } catch {}
        return next;
      });
    }

    setConversations((prev) => {
      const existing = prev.find((c) => c.sender_username === senderUsername);
      if (existing) {
        const msgs = [...existing.messages, inboundMessage];
        if (outboundReply) msgs.push(outboundReply);
        const updated = prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                last_message: outboundReply ? outboundReply.content : text,
                last_message_at: 'Just now',
                messages: msgs,
              }
            : c
        );
        try {
          localStorage.setItem('techie_conversations', JSON.stringify(updated));
        } catch {}
        return updated;
      } else {
        const newThread: ConversationThread = {
          id: `conv-${Date.now()}`,
          instagram_account_id: activeAccount?.id || 'acc-primary',
          sender_username: senderUsername,
          sender_name: senderUsername.replace('_', ' ').toUpperCase(),
          last_message: outboundReply ? outboundReply.content : text,
          last_message_at: 'Just now',
          unread_count: 0,
          automation_active: true,
          messages: outboundReply ? [inboundMessage, outboundReply] : [inboundMessage],
        };
        const updated = [newThread, ...prev];
        try {
          localStorage.setItem('techie_conversations', JSON.stringify(updated));
        } catch {}
        return updated;
      }
    });
  };

  const createTemplate = (newTpl: Omit<Template, 'id' | 'created_at'>): Template => {
    const fullTemplate: Template = {
      ...newTpl,
      id: `tpl-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [fullTemplate, ...templates];
    setTemplates(updated);
    try {
      localStorage.setItem('techie_templates', JSON.stringify(updated));
    } catch {}
    return fullTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    const updated = templates.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTemplates(updated);
    try {
      localStorage.setItem('techie_templates', JSON.stringify(updated));
    } catch {}
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    try {
      localStorage.setItem('techie_templates', JSON.stringify(updated));
    } catch {}
  };

  const upgradePlan = (newPlan: 'free' | 'pro' | 'agency') => {
    const updated = { ...user, plan: newPlan };
    setUser(updated);
    try {
      localStorage.setItem('techie_user', JSON.stringify(updated));
    } catch {}
  };

  // UPI Verifications
  const submitUpiVerification = (data: Omit<UpiPaymentVerification, 'id' | 'status' | 'submittedAt'>) => {
    const newRecord: UpiPaymentVerification = {
      ...data,
      id: `upi-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...upiVerifications];
    setUpiVerifications(updated);
    try {
      localStorage.setItem('techie_upi_verifications', JSON.stringify(updated));
    } catch {}
  };

  const verifyUpiPayment = (id: string) => {
    const target = upiVerifications.find((v) => v.id === id);
    if (!target) return;

    const updated = upiVerifications.map((v) =>
      v.id === id ? { ...v, status: 'VERIFIED' as const, verifiedAt: new Date().toISOString() } : v
    );
    setUpiVerifications(updated);
    try {
      localStorage.setItem('techie_upi_verifications', JSON.stringify(updated));
    } catch {}

    // Upgrade the user's plan
    upgradePlan(target.planId);
  };

  const rejectUpiPayment = (id: string) => {
    const updated = upiVerifications.map((v) =>
      v.id === id ? { ...v, status: 'REJECTED' as const } : v
    );
    setUpiVerifications(updated);
    try {
      localStorage.setItem('techie_upi_verifications', JSON.stringify(updated));
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        accounts,
        activeAccount,
        setActiveAccount,
        connectInstagramAccount,
        updateAccountAccessToken,
        disconnectInstagramAccount,
        automations,
        createAutomation,
        updateAutomation,
        deleteAutomation,
        toggleAutomationStatus,
        conversations,
        sendMessage,
        simulateIncomingMessage,
        templates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        user,
        updateUserProfile,
        loginUser,
        registerUser,
        logoutUser,
        upgradePlan,
        dmsUsedCount,
        dmsLimit,
        upiVerifications,
        submitUpiVerification,
        verifyUpiPayment,
        rejectUpiPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
