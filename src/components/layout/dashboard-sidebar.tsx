'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  LayoutDashboard, 
  Zap, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  CreditCard, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { TechieLogo } from '@/components/ui/techie-logo';
import { useApp } from '@/context/app-context';

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, activeAccount, dmsUsedCount, dmsLimit } = useApp();

  const navigationItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Automations', href: '/dashboard/automations', icon: Zap },
    { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
    { name: 'Templates', href: '/dashboard/templates', icon: FileText },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Instagram Accounts', href: '/dashboard/accounts', icon: Instagram },
    { name: 'Billing & UPI', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r border-[#FED7E2] bg-[#FFE8EE] flex flex-col justify-between shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & collapse trigger */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#FED7E2]">
          {!collapsed ? (
            <Link href="/dashboard">
              <TechieLogo size="md" animate />
            </Link>
          ) : (
            <TechieLogo size="sm" showText={false} />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[#6B4E58] hover:text-[#E11D48] hover:bg-[#FED7E2]/60 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active Account indicator */}
        <div className="p-3">
          <div className={`p-2.5 rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <img
                src={activeAccount?.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Account"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FB7185]"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#10B981] ring-1 ring-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#1F1216] truncate">@{activeAccount?.username || 'No Account'}</p>
                <p className="text-[10px] text-[#6B4E58] flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981]" /> Meta Verified
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-3 space-y-1 mt-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F43F5E] to-[#EC4899] text-white shadow-md shadow-[#F43F5E]/20'
                    : 'text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FED7E2]/50'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#FB7185]'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Plan */}
      <div className="p-3 border-t border-[#FED7E2] space-y-2">
        {!collapsed && (
          <div className="px-3 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#FED7E2] shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#6B4E58] uppercase text-[10px] font-bold tracking-wider">Plan Usage</span>
              <span className="text-[#E11D48] font-bold capitalize">{user.plan}</span>
            </div>
            <div className="w-full bg-[#FFE4E6] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#F43F5E] to-[#EC4899] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(2, Math.round((dmsUsedCount / dmsLimit) * 100)))}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[10px]">
              <span className="text-[#6B4E58] font-medium">{dmsUsedCount} / {dmsLimit.toLocaleString()} DMs</span>
              <span className="text-[#E11D48] font-bold">UPI: muthurajc@slc</span>
            </div>
          </div>
        )}

        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-[#FED7E2]/40 transition-colors ${collapsed ? 'justify-center p-1' : ''}`}>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-[#FB7185]"
          />
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-[#1F1216] truncate">{user.name}</p>
              <p className="text-[10px] text-[#6B4E58] truncate">{user.email}</p>
            </div>
          )}
          {!collapsed && (
            <Link href="/" title="Sign Out" className="p-1 text-[#6B4E58] hover:text-[#EF4444] transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
