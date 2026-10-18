'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  QrCode, 
  ArrowRight, 
  RefreshCw, 
  Bot, 
  CreditCard,
  Sparkles,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/app-context';
import { TechieLogo } from '@/components/ui/techie-logo';

export default function TechieAdminPage() {
  const { upiVerifications, verifyUpiPayment, rejectUpiPayment, submitUpiVerification, user } = useApp();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  // Manual payment entry form state
  const [manualEmail, setManualEmail] = useState('');
  const [manualUtr, setManualUtr] = useState('');
  const [manualPlan, setManualPlan] = useState<'pro' | 'agency'>('pro');
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'techie') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid passcode! Access restricted to authorized operators only.');
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = manualUtr.replace(/\D/g, '');
    if (!manualEmail.trim() || cleanUtr.length !== 12) return;

    submitUpiVerification({
      userEmail: manualEmail.trim(),
      userName: manualEmail.split('@')[0],
      utrNumber: cleanUtr,
      planId: manualPlan,
      planName: manualPlan === 'pro' ? 'Creator Pro' : 'Agency Scale',
      amountINR: manualPlan === 'pro' ? 2999 : 9999,
    });

    setManualEmail('');
    setManualUtr('');
    setManualSuccess(true);
    setTimeout(() => setManualSuccess(false), 3000);
  };

  const filtered = upiVerifications.filter(
    (v) =>
      v.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      v.utrNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalVerifiedRevenue = upiVerifications
    .filter((v) => v.status === 'VERIFIED')
    .reduce((sum, v) => sum + v.amountINR, 0);

  const pendingCount = upiVerifications.filter((v) => v.status === 'PENDING').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex flex-col justify-between p-6">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-8">
          <Link href="/">
            <TechieLogo size="md" animate />
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-[#1F1216] tracking-tight">Techie Payment Operator</h2>
            <p className="text-xs text-[#6B4E58] mt-1 font-medium">
              Enter official operator passcode to access UPI verification & subscription management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B4E58] mb-1">Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter passcode (e.g. techie)"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] text-sm font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-xs font-semibold text-[#EF4444] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-lg shadow-[#F43F5E]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              Unlock Verification Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-[#9E7D88] text-center mt-6">
            Authorized access only · Protected via Techie Security Gateway
          </p>
        </div>

        <div className="text-center text-xs text-[#9E7D88]">
          TechieDMTool Operator Portal · Direct UPI: muthurajc@slc
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FED7E2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#FB7185] p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-[#FFFFFF] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#F43F5E]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#1F1216]">Techie Payment Verification Station</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                  Operator Live
                </span>
              </div>
              <p className="text-xs text-[#6B4E58] font-medium">
                Official UPI Receiver: <strong className="text-[#E11D48] font-mono">muthurajc@slc</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#E11D48] bg-white border border-[#FED7E2] hover:bg-[#FFF0F4] transition-colors shadow-xs"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B4E58] bg-[#FFE8EE] hover:bg-[#FED7E2] transition-colors"
            >
              Lock Station
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl border border-[#FED7E2] bg-white shadow-sm">
            <span className="text-xs font-bold text-[#6B4E58]">Verified UPI Revenue</span>
            <p className="text-3xl font-black text-[#1F1216] font-mono mt-1">₹{totalVerifiedRevenue.toLocaleString()}</p>
            <span className="text-[11px] text-[#10B981] font-bold mt-1 block">Real-time credited amount</span>
          </div>

          <div className="p-6 rounded-3xl border border-[#FED7E2] bg-white shadow-sm">
            <span className="text-xs font-bold text-[#6B4E58]">Pending Verifications</span>
            <p className="text-3xl font-black text-[#E11D48] font-mono mt-1">{pendingCount}</p>
            <span className="text-[11px] text-[#6B4E58] font-medium mt-1 block">Awaiting UTR match</span>
          </div>

          <div className="p-6 rounded-3xl border border-[#FED7E2] bg-white shadow-sm">
            <span className="text-xs font-bold text-[#6B4E58]">Receiver UPI Address</span>
            <p className="text-xl font-black text-[#1F1216] font-mono mt-1">muthurajc@slc</p>
            <span className="text-[11px] text-[#10B981] font-bold mt-1 block">Bank settlement linked</span>
          </div>
        </div>

        {/* Manual Record Form */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#1F1216] uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#F43F5E]" />
            Manual Payment Entry & Direct Approval
          </h3>
          <p className="text-xs text-[#6B4E58] font-medium">
            Record a direct UPI transaction received in your bank app and instantly activate the user's plan.
          </p>

          <form onSubmit={handleAddManual} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="User Email (e.g. user@gmail.com)"
              required
              className="px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E]"
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={manualUtr}
              onChange={(e) => setManualUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="12-digit UTR (e.g. 428919028192)"
              required
              className="px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-mono font-semibold text-[#1F1216] focus:outline-none focus:border-[#F43F5E] tracking-wider"
            />
            <select
              value={manualPlan}
              onChange={(e) => setManualPlan(e.target.value as 'pro' | 'agency')}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-bold text-[#1F1216]"
            >
              <option value="pro">Creator Pro (₹2,999)</option>
              <option value="agency">Agency Scale (₹9,999)</option>
            </select>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white rose-button-primary shadow-sm hover:opacity-95"
            >
              + Record & Queue Payment
            </button>
          </form>

          {manualSuccess && (
            <div className="p-3 rounded-xl bg-[#D1FAE5] border border-[#A7F3D0] text-xs font-bold text-[#10B981] flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>UPI payment recorded! You can now verify and approve it below.</span>
            </div>
          )}
        </div>

        {/* Verification Queue Table */}
        <div className="rounded-3xl border border-[#FED7E2] bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[#1F1216]">Submitted UPI Verification Queue</h3>
              <p className="text-xs text-[#6B4E58] font-medium">Verify 12-digit UPI UTR numbers against your bank credit notification.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9E7D88] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or UTR..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF5F7] border border-[#FED7E2] text-xs font-medium text-[#1F1216] placeholder-[#9E7D88] focus:outline-none focus:border-[#F43F5E]"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-[#FED7E2] bg-[#FFF5F7]">
              <QrCode className="w-10 h-10 text-[#FB7185] mx-auto mb-3" />
              <h4 className="font-extrabold text-[#1F1216] text-sm">No payment verifications in queue</h4>
              <p className="text-xs text-[#6B4E58] max-w-sm mx-auto mt-1 font-medium">
                When users complete payment to muthurajc@slc and enter their UTR number, requests will appear here for 1-click verification.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#FED7E2] text-[#9E7D88] uppercase tracking-wider font-extrabold">
                    <th className="pb-3">User Email</th>
                    <th className="pb-3">UTR / Ref No</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Submitted At</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FED7E2]/60 text-[#6B4E58]">
                  {filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-[#FFF5F7]">
                      <td className="py-3.5 font-bold text-[#1F1216]">{v.userEmail}</td>
                      <td className="py-3.5 font-mono text-[11px] font-bold text-[#E11D48]">{v.utrNumber}</td>
                      <td className="py-3.5 font-semibold text-[#1F1216]">{v.planName}</td>
                      <td className="py-3.5 font-mono font-black text-[#1F1216]">₹{v.amountINR.toLocaleString()}</td>
                      <td className="py-3.5 text-[11px] font-medium text-[#9E7D88]">
                        {new Date(v.submittedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'VERIFIED'
                            ? 'bg-[#D1FAE5] text-[#10B981]'
                            : v.status === 'REJECTED'
                            ? 'bg-[#FEE2E2] text-[#EF4444]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        {v.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => verifyUpiPayment(v.id)}
                              className="px-3 py-1 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[11px] shadow-xs"
                            >
                              Verify & Activate
                            </button>
                            <button
                              onClick={() => rejectUpiPayment(v.id)}
                              className="px-3 py-1 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#EF4444] font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {v.status === 'VERIFIED' && (
                          <span className="text-[#10B981] font-bold text-xs flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" /> Activated
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
