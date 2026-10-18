'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  QrCode,
  Copy,
  ArrowRight,
  X
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';

export default function BillingPage() {
  const { user, upgradePlan, dmsUsedCount, dmsLimit, submitUpiVerification } = useApp();
  const [successToast, setSuccessToast] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [upiModal, setUpiModal] = useState(false);
  const [userUtr, setUserUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  const [selectedPlanForUpi, setSelectedPlanForUpi] = useState<{ name: string; inr: number; planId: 'free' | 'pro' | 'agency' }>({
    name: 'Creator Pro',
    inr: 2999,
    planId: 'pro',
  });

  const upiId = 'muthurajc@slc';

  const plans = [
    {
      id: 'free' as const,
      name: 'Starter',
      priceINR: '₹0',
      period: '/ month',
      description: 'Test the water with core DM automation essentials.',
      features: [
        '1 Connected Instagram Account',
        '250 Automated DMs / month',
        '3 Active Automation Rules',
        'Standard Keyword Matching',
      ],
    },
    {
      id: 'pro' as const,
      name: 'Creator Pro',
      priceINR: '₹2,999',
      amountINR: 2999,
      period: '/ month',
      popular: true,
      description: 'High-volume conversions for influencers, coaches & brands.',
      features: [
        '3 Connected Instagram Accounts',
        '5,000 Automated DMs / month',
        'Unlimited Automation Rules',
        'Reel & Post Comment-to-DM',
        'Real-time Analytics & CSV Export',
        'Priority Webhook Handling',
      ],
    },
    {
      id: 'agency' as const,
      name: 'Agency Scale',
      priceINR: '₹9,999',
      amountINR: 9999,
      period: '/ month',
      description: 'Multi-brand workspace for marketing agencies.',
      features: [
        '15 Connected Accounts',
        '25,000 Automated DMs / month',
        'Client Workspace Permissions',
        'Custom Webhook Endpoints',
        'Dedicated Account Manager',
      ],
    },
  ];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2500);
  };

  const handleOpenUpiModal = (p: typeof plans[0]) => {
    if (p.id === 'free') {
      upgradePlan('free');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      return;
    }
    setSelectedPlanForUpi({
      name: p.name,
      inr: p.amountINR || 2999,
      planId: p.id,
    });
    setUserUtr('');
    setUtrError('');
    setUpiModal(true);
  };

  const handleConfirmUpiPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = userUtr.replace(/\D/g, '');
    if (cleanUtr.length !== 12) {
      setUtrError('UTR number must be exactly 12 numeric digits.');
      return;
    }

    setUtrError('');
    submitUpiVerification({
      userEmail: user.email,
      userName: user.name,
      utrNumber: cleanUtr,
      planId: selectedPlanForUpi.planId as 'pro' | 'agency',
      planName: selectedPlanForUpi.name,
      amountINR: selectedPlanForUpi.inr,
    });

    setUpiModal(false);
    setUserUtr('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4500);
  };

  const usagePercent = Math.min(100, Math.round((dmsUsedCount / dmsLimit) * 100));

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Billing & UPI Direct Checkout" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">
                Subscription & UPI Direct Payment
              </h2>
              <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
                Instant activation with zero gateway markup via official UPI ID: <strong className="text-[#E11D48] font-mono">{upiId}</strong>
              </p>
            </div>

            <Link
              href="/techie"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#E11D48] bg-white border border-[#FED7E2] hover:bg-[#FFF0F4] transition-colors self-start sm:self-auto shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              /techie Verification Portal
            </Link>
          </div>

          {/* Dedicated UPI Quick Pay Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-gradient-to-r from-[#FFFFFF] via-[#FFF0F4] to-[#FFE4E6] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F43F5E] to-[#EC4899] p-3 text-white flex items-center justify-center shadow-md shadow-[#F43F5E]/20 flex-shrink-0">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Instant Indian UPI Payment Enabled
                </div>
                <h3 className="text-base font-black text-[#1F1216]">Direct Receiver UPI ID: {upiId}</h3>
                <p className="text-xs text-[#6B4E58] mt-1 max-w-xl leading-relaxed font-medium">
                  Pay directly from Google Pay, PhonePe, Paytm, or CRED. Enter your 12-digit UTR reference number for instant verification.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyUpi}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#E11D48] bg-[#FFFFFF] border border-[#FECDD3] hover:bg-[#FFF1F2] transition-colors shadow-xs"
              >
                {upiCopied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                {upiCopied ? 'UPI Copied!' : 'Copy UPI ID'}
              </button>
              <button
                onClick={() => handleOpenUpiModal(plans[1])}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md"
              >
                <QrCode className="w-4 h-4" />
                Scan & Pay via UPI
              </button>
            </div>
          </div>

          {/* Current Plan Summary Card */}
          <div className="p-6 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#F43F5E] tracking-wider">Active Subscription</span>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#1F1216] capitalize">{user.plan} Tier</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#6B4E58] font-medium">
                Active plan for {user.email}. Upgraded in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B4E58] bg-[#FFF0F4] border border-[#FED7E2] hover:bg-[#FFE4E6] transition-colors"
                onClick={() => handleOpenUpiModal(plans[1])}
              >
                Upgrade via UPI
              </button>
            </div>
          </div>

          {/* Real Plan Usage Meter */}
          <div className="p-6 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#1F1216]">Live Message Quota Usage (Real-Time)</span>
              <span className="text-[#E11D48] font-mono">
                {dmsUsedCount} / {dmsLimit.toLocaleString()} DMs ({usagePercent}%)
              </span>
            </div>
            <div className="w-full bg-[#FFE4E6] rounded-full h-2.5 overflow-hidden border border-[#FED7E2]">
              <div 
                className="bg-gradient-to-r from-[#F43F5E] to-[#EC4899] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(2, usagePercent)}%` }}
              />
            </div>
            <p className="text-[11px] text-[#6B4E58] font-medium">
              {dmsLimit - dmsUsedCount} direct messages remaining in your current billing cycle.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {plans.map((p) => {
              const isCurrent = user.plan === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-6 sm:p-8 rounded-3xl border bg-[#FFFFFF] flex flex-col justify-between relative transition-all shadow-sm ${
                    p.popular
                      ? 'border-[#F43F5E] shadow-xl shadow-[#F43F5E]/15'
                      : 'border-[#FED7E2]'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#F43F5E] to-[#EC4899] text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                      Most Popular · UPI Enabled
                    </span>
                  )}

                  <div>
                    <h4 className="font-black text-[#1F1216] text-base mb-1">{p.name}</h4>
                    <p className="text-xs text-[#6B4E58] mb-4 min-h-[36px] font-medium">{p.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#1F1216] font-mono">{p.priceINR}</span>
                        <span className="text-xs text-[#6B4E58] font-medium">{p.period}</span>
                      </div>
                      <span className="text-[11px] text-[#10B981] font-bold">Direct UPI Checkout Enabled</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#6B4E58]">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                          <span className={p.popular ? 'text-[#1F1216] font-semibold' : ''}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenUpiModal(p)}
                    disabled={isCurrent}
                    className={`w-full mt-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#FFF0F4] text-[#9E7D88] cursor-default border border-[#FED7E2]'
                        : p.popular
                        ? 'rose-button-primary text-white shadow-md'
                        : 'bg-[#FFF0F4] border border-[#FECDD3] text-[#E11D48] hover:bg-[#FFE4E6]'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Upgrade via Direct UPI`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* UPI Payment Modal with Direct QR & UTR Submission */}
          {upiModal && (
            <div 
              className="fixed inset-0 z-50 bg-[#1F1216]/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setUpiModal(false);
              }}
            >
              <div className="w-full max-w-md rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#FED7E2]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48]">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#1F1216] text-base">Pay via UPI Direct</h3>
                      <p className="text-[11px] text-[#6B4E58] font-medium">Instant activation for {selectedPlanForUpi.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUpiModal(false)} 
                    className="p-1 rounded-lg text-[#6B4E58] hover:text-[#1F1216] hover:bg-[#FFF0F4]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-4">
                  {/* Generated QR Code */}
                  <div className="w-48 h-48 mx-auto p-3 rounded-2xl border-2 border-dashed border-[#F43F5E] bg-[#FFF5F7] flex flex-col items-center justify-center relative shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${upiId}&pn=TechieDMTool&am=${selectedPlanForUpi.inr}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-40 h-40 rounded-lg object-contain"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-[#6B4E58] font-medium">Payable Amount:</span>
                    <p className="text-2xl font-black text-[#E11D48] font-mono">₹{selectedPlanForUpi.inr.toLocaleString()}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFF0F4] border border-[#FED7E2] flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-[#6B4E58] uppercase font-bold tracking-wider">UPI ID</span>
                      <p className="text-sm font-mono font-bold text-[#1F1216]">{upiId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-2 rounded-xl bg-white text-[#E11D48] hover:bg-[#FFE4E6] border border-[#FED7E2] shadow-xs"
                      title="Copy UPI"
                    >
                      {upiCopied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Form to enter 12-digit UTR */}
                  <form onSubmit={handleConfirmUpiPayment} className="space-y-3 pt-1 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-[#6B4E58]">
                          Enter 12-digit UPI Reference / UTR Number
                        </label>
                        <span className={`text-[11px] font-mono font-bold ${
                          userUtr.length === 12 ? 'text-[#10B981]' : 'text-[#E11D48]'
                        }`}>
                          {userUtr.length}/12 digits
                        </span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{12}"
                        maxLength={12}
                        value={userUtr}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setUserUtr(digitsOnly);
                          setUtrError('');
                        }}
                        placeholder="e.g. 428919028192"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-mono font-bold text-[#1F1216] focus:outline-none focus:border-[#F43F5E] tracking-widest"
                      />
                      <p className="text-[10px] text-[#9E7D88] mt-1">
                        Only 12 numeric digits allowed (no letters, spaces, or more than 12 digits).
                      </p>

                      {utrError && (
                        <p className="text-[11px] font-bold text-[#E11D48] mt-1 bg-[#FFF0F4] p-1.5 rounded-lg border border-[#FECDD3]">
                          {utrError}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="submit"
                        disabled={userUtr.length !== 12}
                        className="w-full py-3.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> 
                        {userUtr.length === 12 ? 'Submit Payment for /techie Verification' : `Enter 12 digits to submit (${userUtr.length}/12)`}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUpiModal(false);
                          setUtrError('');
                        }}
                        className="w-full py-2 text-xs font-semibold text-[#6B4E58] hover:text-[#1F1216]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {successToast && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-[#10B981]/40 bg-[#FFFFFF] shadow-2xl text-xs font-bold text-[#1F1216]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>UPI Payment UTR submitted! Awaiting /techie verification approval.</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
