'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  Check 
} from 'lucide-react';
import { TechieLogo } from '@/components/ui/techie-logo';
import { useApp } from '@/context/app-context';

export default function SignupPage() {
  const router = useRouter();
  const { registerUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'creator' | 'business' | 'agency'>('creator');
  const [loading, setLoading] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    // Register the account
    registerUser(email, name);

    // Save initial registered info for seamless login
    try {
      localStorage.setItem('techie_registered_email', email);
    } catch {}

    setCreatedSuccess(true);

    // Open login page after account creation
    setTimeout(() => {
      router.push(`/login?created=true&email=${encodeURIComponent(email)}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex flex-col justify-between p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6">
        <Link href="/">
          <TechieLogo size="md" animate />
        </Link>

        <Link
          href="/login"
          className="text-xs font-bold text-[#6B4E58] hover:text-[#E11D48] flex items-center gap-1.5"
        >
          <span>Already have an account?</span>
          <span className="text-[#E11D48] underline">Sign In</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md mx-auto w-full rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] text-[10px] font-black text-[#E11D48] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> Step 1: Create Account
          </div>
          <h2 className="text-2xl font-black text-[#1F1216] tracking-tight">
            Get Started Free
          </h2>
          <p className="text-xs text-[#6B4E58] mt-1 font-medium">
            Create your account to activate automated Instagram direct messaging.
          </p>
        </div>

        {createdSuccess ? (
          <div className="p-6 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-[#065F46]">Account Created Successfully!</h3>
            <p className="text-xs text-[#047857]">
              Opening login screen for <strong>{email}</strong>...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B4E58] mb-1">Full Name / Brand Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9E7D88] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Muthuraj C"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold text-[#6B4E58] mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9E7D88] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B4E58] mb-1">Profile Category</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as 'creator' | 'business' | 'agency')}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
              >
                <option value="creator">Instagram Creator / Influencer</option>
                <option value="business">E-Commerce & Local Business</option>
                <option value="agency">Marketing Agency / Client Manager</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF0F4] border border-[#FED7E2] space-y-1.5 text-[11px] text-[#6B4E58]">
              <div className="flex items-center gap-1.5 font-bold text-[#10B981]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Free Starter Plan Included</span>
              </div>
              <p>250 automated DMs per month · Meta Graph API integration · No credit card required.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-[#6B4E58] font-medium">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#E11D48] hover:underline font-bold"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="text-center text-xs font-medium text-[#9E7D88]">
        By signing up you agree to TechieDMTool Terms of Service and Privacy Policy.
      </div>
    </div>
  );
}
