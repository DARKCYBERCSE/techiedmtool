'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bot, Sparkles, ArrowRight, ShieldCheck, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { TechieLogo } from '@/components/ui/techie-logo';
import { useApp } from '@/context/app-context';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  useEffect(() => {
    const isCreated = searchParams.get('created') === 'true';
    const emailParam = searchParams.get('email');
    if (isCreated) {
      setJustCreated(true);
    }
    if (emailParam) {
      setEmail(emailParam);
    } else {
      try {
        const saved = localStorage.getItem('techie_registered_email');
        if (saved) setEmail(saved);
      } catch {}
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    loginUser(email);
    const targetUrl = searchParams.get('redirect') || '/dashboard';
    setTimeout(() => {
      setLoading(false);
      window.location.href = targetUrl;
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto w-full rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-xl">
      {/* Account Created Success Banner */}
      {justCreated && (
        <div className="mb-6 p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-start gap-3 text-xs font-semibold text-[#065F46] animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-[#065F46]">Account Created Successfully!</p>
            <p className="text-[11px] text-[#047857] mt-0.5 font-medium">
              Please enter your password below to sign in and open your dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Redirect Notice */}
      {!justCreated && searchParams.get('redirect') && (
        <div className="mb-6 p-3.5 rounded-2xl bg-[#FFF0F4] border border-[#FED7E2] flex items-center gap-2.5 text-xs font-bold text-[#E11D48] animate-in fade-in duration-150">
          <Lock className="w-4 h-4 text-[#F43F5E] flex-shrink-0" />
          <span>Please sign in first to access your billing and payment dashboard.</span>
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-[#1F1216] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-[#6B4E58] mt-1 font-medium">
          Sign in to access your active Instagram automations and conversations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#6B4E58] mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#9E7D88] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@example.com"
              required
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#6B4E58] mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#9E7D88] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Authenticating...' : 'Sign In & Open Dashboard'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#6B4E58] font-medium">
        Don't have an account yet?{' '}
        <Link
          href="/signup"
          className="text-[#E11D48] hover:underline font-bold"
        >
          Get Started Free (Create Account)
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex flex-col justify-between p-6">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-8">
        <Link href="/">
          <TechieLogo size="md" animate />
        </Link>

        <Link
          href="/signup"
          className="text-xs font-bold text-[#E11D48] hover:underline"
        >
          Create New Account →
        </Link>
      </div>

      <Suspense fallback={
        <div className="max-w-md mx-auto w-full p-8 text-center bg-white rounded-3xl border border-[#FED7E2]">
          <p className="text-xs font-bold text-[#6B4E58]">Loading Login...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>

      <div className="text-center text-xs font-medium text-[#9E7D88]">
        By signing in you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
}
