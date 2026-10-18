'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Bot } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useApp();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check local storage for persisted login session
    try {
      const savedUserStr = localStorage.getItem('techie_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const isAuthed = user?.isAuthenticated || (savedUser && savedUser.isAuthenticated);

      if (!isAuthed) {
        // Not authenticated: redirect to login and preserve the intended target
        const redirectParam = encodeURIComponent(pathname);
        router.replace(`/login?redirect=${redirectParam}`);
        return;
      }
    } catch {
      if (!user?.isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
    }

    setCheckingAuth(false);
  }, [user?.isAuthenticated, pathname, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#FB7185] p-[1.5px] shadow-lg animate-pulse mb-4">
          <div className="w-full h-full bg-[#FFFFFF] rounded-[14px] flex items-center justify-center">
            <Bot className="w-6 h-6 text-[#F43F5E]" />
          </div>
        </div>
        <p className="text-xs font-bold text-[#6B4E58]">Verifying authenticated session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
