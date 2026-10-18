'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Layers, 
  Check, 
  HelpCircle,
  Play,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Clock,
  QrCode,
  Copy,
  Heart
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { useApp } from '@/context/app-context';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [upiCopied, setUpiCopied] = useState(false);

  const upiId = 'muthurajc@slc';

  const handlePlanClick = (planId: 'pro' | 'agency') => {
    // Check if user is actively authenticated in state or localStorage
    let isAuthed = user?.isAuthenticated;
    try {
      const savedUserStr = localStorage.getItem('techie_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      if (savedUser && savedUser.isAuthenticated) {
        isAuthed = true;
      }
    } catch {}

    if (isAuthed) {
      router.push(`/dashboard/billing?plan=${planId}`);
    } else {
      router.push(`/login?redirect=/dashboard/billing%3Fplan%3D${planId}`);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const faqs = [
    {
      q: "Does TechieDMTool support instant UPI payments?",
      a: "Yes! You can instantly activate any subscription tier using direct receiver UPI ID muthurajc@slc without middleman fees or international transaction taxes. Once you transfer, submit your 12-digit UTR for immediate verification."
    },
    {
      q: "Does TechieDMTool use official Instagram APIs?",
      a: "Yes, 100%. TechieDMTool connects exclusively through Meta's official Graph API and adheres strictly to Instagram Platform Terms. Your accounts remain completely safe from bans or shadowbans, unlike risky unofficial scrapers."
    },
    {
      q: "What types of Instagram accounts are supported?",
      a: "You need an Instagram Professional account (either Business or Creator) linked to a Facebook Page, as required by Meta's messaging permissions architecture."
    },
    {
      q: "How does the Comment-to-DM feature work?",
      a: "When a user comments on your Reels, Carousels, or feed posts with a specific keyword (e.g. 'GUIDE' or 'LINK'), our official Meta webhook catches the event and triggers an immediate direct message with your chosen link or resource."
    },
    {
      q: "Can I manage multiple client accounts with one login?",
      a: "Absolutely. Our Pro and Agency plans support multi-account switching, dedicated workflow isolation, and granular team management with one centralized dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216]">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden">
        {/* Dreamy Ambient Pink Rose Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#F43F5E]/18 via-[#EC4899]/12 to-transparent blur-[140px] pointer-events-none -z-10 rose-aura" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FECDD3] bg-[#FFE4E6]/80 text-xs font-bold text-[#E11D48] mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F43F5E]" />
            <span>INSTAGRAM AUTOMATION, REIMAGINED IN LUXURY ROSE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6 text-[#1F1216]">
            Turn Every Conversation <br />
            <span className="text-rose-gradient">
              Into an Opportunity.
            </span>
          </h1>

          {/* Supporting description */}
          <p className="text-base sm:text-xl text-[#6B4E58] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Automate Instagram conversations, respond in milliseconds, and turn comments into high-ticket sales with one unified, Meta-verified workspace. Seamless UPI direct checkout enabled.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white rose-button-primary shadow-xl shadow-[#F43F5E]/25 text-base active:scale-95"
            >
              Start Automating Free
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-[#E11D48] rose-button-secondary text-base"
            >
              <QrCode className="w-4 h-4 text-[#F43F5E]" />
              Pay with UPI (muthurajc@slc)
            </Link>
          </div>

          {/* Trust Caption */}
          <div className="flex items-center justify-center gap-3 text-xs font-semibold text-[#6B4E58]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Official Meta Graph API Integration · No Password Required · 100% Policy Compliant</span>
          </div>

          {/* Hero Visual Preview */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="rounded-3xl p-3 sm:p-4 border-2 border-[#FED7E2] bg-gradient-to-b from-[#FFFFFF] via-[#FFF9FA] to-[#FFF0F4] shadow-2xl backdrop-blur-xl">
              {/* Fake Window Bar */}
              <div className="flex items-center justify-between pb-3 px-3 border-b border-[#FED7E2]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FB7185]" />
                  <div className="w-3 h-3 rounded-full bg-[#F472B6]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-[11px] text-[#9E7D88] ml-2 font-mono font-semibold">techiedmtool.com/dashboard/automations/builder</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  Live Webhook Stream Connected
                </div>
              </div>

              {/* Visual Workflow Canvas Simulation */}
              <div className="p-4 sm:p-8 bg-[#FFF5F7]/80 rounded-2xl mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Node 1: Trigger */}
                <div className="rounded-2xl border-2 border-[#FECDD3] bg-[#FFFFFF] p-5 shadow-sm relative">
                  <span className="text-[10px] uppercase font-extrabold text-[#F43F5E] tracking-wider mb-2 block">Step 01: Trigger</span>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#F43F5E]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#1F1216]">Instagram DM or Comment</p>
                      <p className="text-[11px] text-[#6B4E58]">Any incoming conversation</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFF0F4] border border-[#FED7E2] text-xs font-mono font-bold text-[#E11D48]">
                    Event: message_received
                  </div>
                </div>

                {/* Node 2: Condition */}
                <div className="rounded-2xl border-2 border-[#FBCFE8] bg-[#FFFFFF] p-5 shadow-sm relative">
                  <span className="text-[10px] uppercase font-extrabold text-[#EC4899] tracking-wider mb-2 block">Step 02: Smart Condition</span>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#EC4899]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#1F1216]">Keyword Matching</p>
                      <p className="text-[11px] text-[#6B4E58]">Exact or Contains</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FECDD3] text-[10px] text-[#E11D48] font-mono font-bold">"price"</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FECDD3] text-[10px] text-[#E11D48] font-mono font-bold">"guide"</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FECDD3] text-[10px] text-[#E11D48] font-mono font-bold">"consult"</span>
                  </div>
                </div>

                {/* Node 3: Action */}
                <div className="rounded-2xl border-2 border-[#A7F3D0] bg-[#FFFFFF] p-5 shadow-sm relative">
                  <span className="text-[10px] uppercase font-extrabold text-[#10B981] tracking-wider mb-2 block">Step 03: Meta Send Action</span>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-[#10B981]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#1F1216]">Instant Response & Link</p>
                      <p className="text-[11px] text-[#6B4E58]">Delivered in &lt; 0.8s</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B4E58] italic bg-[#FFF0F4] p-2.5 rounded-xl border border-[#FED7E2]">
                    "Hey! Here is our pricing guide & UPI direct link: https://..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 border-t border-[#FED7E2] bg-[#FFF0F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#E11D48] mb-3">Designed for High-Converting Social Brands</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1F1216]">Every tool you need to scale conversations effortlessly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] hover:border-[#F43F5E] transition-all group shadow-sm hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#F43F5E] mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F1216] mb-2">Visual Workflow Engine</h3>
              <p className="text-sm text-[#6B4E58] leading-relaxed">
                Connect triggers, keyword conditions, and multi-step action branches with zero code. Save drafts, preview live payloads, and activate rules in one click.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] hover:border-[#EC4899] transition-all group shadow-sm hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] flex items-center justify-center text-[#EC4899] mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F1216] mb-2">Reel Comment to Direct Message</h3>
              <p className="text-sm text-[#6B4E58] leading-relaxed">
                Tell followers to comment "PRESET" or "VIP" on your reels. The engine instantly detects the comment and delivers the download link directly to their private inbox.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] hover:border-[#10B981] transition-all group shadow-sm hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#10B981] mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F1216] mb-2">Real-Time Conversation Analytics</h3>
              <p className="text-sm text-[#6B4E58] leading-relaxed">
                Track messages received, automation trigger success rates, peak activity hours, and top-converting keyword terms with zero vanity metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & UPI Section */}
      <section id="pricing" className="py-20 border-t border-[#FED7E2] bg-[#FFF5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#E11D48] mb-3">Simple, Transparent Pricing & UPI Checkout</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1F1216] mb-4">Invest in conversational conversion</p>
            
            {/* UPI ID Highlight Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] text-xs font-bold text-[#E11D48] mb-6 shadow-sm">
              <QrCode className="w-4 h-4 text-[#F43F5E]" />
              <span>Direct UPI ID: <strong>{upiId}</strong></span>
              <button
                onClick={handleCopyUpi}
                className="px-2 py-1 rounded-lg bg-white text-[10px] text-[#E11D48] hover:bg-[#FFF0F4] border border-[#FECDD3]"
              >
                {upiCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold text-[#1F1216] mb-1">Starter</h3>
                <p className="text-xs text-[#6B4E58] mb-6">Perfect for solo creators testing automated DMs.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#1F1216]">₹0</span>
                  <span className="text-xs text-[#6B4E58]">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-[#6B4E58]">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> 1 Connected Instagram Account</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> 250 Automated DMs / month</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> 3 Active Automation Rules</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> Standard Keyword Matching</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full mt-8 py-3 rounded-2xl text-xs font-bold text-[#E11D48] bg-[#FFF0F4] border border-[#FECDD3] hover:bg-[#FFE4E6] text-center block transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-8 rounded-3xl border-2 border-[#F43F5E] bg-gradient-to-b from-[#FFFFFF] to-[#FFF0F4] flex flex-col justify-between relative shadow-xl shadow-[#F43F5E]/15">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#F43F5E] to-[#EC4899] text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                Most Popular · UPI Enabled
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#1F1216] mb-1">Creator Pro</h3>
                <p className="text-xs text-[#6B4E58] mb-6">For influencers, coaches, and growing businesses.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#1F1216]">₹2,999</span>
                  <span className="text-xs text-[#6B4E58]">/ month (Direct UPI)</span>
                </div>
                <ul className="space-y-3 text-xs text-[#6B4E58]">
                  <li className="flex items-center gap-2 text-[#1F1216] font-semibold"><Check className="w-4 h-4 text-[#10B981]" /> 3 Connected Accounts</li>
                  <li className="flex items-center gap-2 text-[#1F1216] font-semibold"><Check className="w-4 h-4 text-[#10B981]" /> 5,000 Automated DMs / month</li>
                  <li className="flex items-center gap-2 text-[#1F1216] font-semibold"><Check className="w-4 h-4 text-[#10B981]" /> Unlimited Automation Rules</li>
                  <li className="flex items-center gap-2 text-[#1F1216] font-semibold"><Check className="w-4 h-4 text-[#10B981]" /> Reel & Post Comment to DM</li>
                  <li className="flex items-center gap-2 text-[#1F1216] font-semibold"><Check className="w-4 h-4 text-[#10B981]" /> Direct UPI Checkout (muthurajc@slc)</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handlePlanClick('pro')}
                className="w-full mt-8 py-3.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg text-center block transition-all"
              >
                Pay ₹2,999 via UPI
              </button>
            </div>

            {/* Agency Tier */}
            <div className="p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold text-[#1F1216] mb-1">Agency Scale</h3>
                <p className="text-xs text-[#6B4E58] mb-6">For marketing agencies managing multiple brands.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#1F1216]">₹9,999</span>
                  <span className="text-xs text-[#6B4E58]">/ month (Direct UPI)</span>
                </div>
                <ul className="space-y-3 text-xs text-[#6B4E58]">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> 15 Connected Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> 25,000 Automated DMs / month</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> Client Workspace Permissions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> Dedicated Webhook Prioritization</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#10B981]" /> Instant UPI Direct Activation</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handlePlanClick('agency')}
                className="w-full mt-8 py-3 rounded-2xl text-xs font-bold text-[#E11D48] bg-[#FFF0F4] border border-[#FECDD3] hover:bg-[#FFE4E6] text-center block transition-colors"
              >
                Start Agency Tier via UPI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 border-t border-[#FED7E2] bg-[#FFF0F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#E11D48] mb-3">Frequently Asked Questions</h2>
            <p className="text-3xl font-black text-[#1F1216]">Everything you need to know about TechieDMTool & UPI</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#FED7E2] bg-[#FFFFFF] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-[#1F1216]"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#F43F5E] font-black text-lg">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#6B4E58] leading-relaxed border-t border-[#FED7E2] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 border-t border-[#FED7E2] bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E6] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black text-[#1F1216] tracking-tight mb-6">
            Ready to convert every follower into a loyal customer?
          </h2>
          <p className="text-base text-[#6B4E58] max-w-xl mx-auto mb-8 font-medium">
            Connect your Instagram account in 2 minutes. Instant activation with direct UPI: <strong className="text-[#E11D48] font-mono">{upiId}</strong>.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white rose-button-primary shadow-xl shadow-[#F43F5E]/30 text-base transition-all active:scale-95"
          >
            Launch Your First Automation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
