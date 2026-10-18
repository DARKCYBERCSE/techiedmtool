import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, ArrowLeft, Mail } from 'lucide-react';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export const metadata = {
  title: 'Terms of Service — TechieDMTool',
  description: 'Terms of Service for TechieDMTool Instagram DM automation platform.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'October 18, 2026';

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex flex-col justify-between">
      <MarketingNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B4E58] hover:text-[#E11D48] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-[#FED7E2] pb-8 mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-xs font-bold text-[#E11D48]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Official Instagram Platform Terms Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F1216]">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#6B4E58] font-medium">
            Effective Date: {lastUpdated} · TechieDMTool (App ID: 947533688039115)
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#6B4E58] leading-relaxed font-medium">
          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-2">
            <h2 className="text-base font-black text-[#1F1216]">1. Acceptance of Terms</h2>
            <p>
              By signing up, logging in, or connecting your Instagram Professional account to TechieDMTool, you agree to comply with these Terms of Service and Meta's official Platform Policies.
            </p>
          </section>

          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-2">
            <h2 className="text-base font-black text-[#1F1216]">2. Permitted Use & Anti-Spam Policy</h2>
            <p>
              TechieDMTool strictly operates as an opt-in conversational automation assistant. Users are prohibited from sending unsolicited spam, abusive, defamatory, or unlawful content through our automation channels. Violations may result in immediate suspension.
            </p>
          </section>

          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-2">
            <h2 className="text-base font-black text-[#1F1216]">3. Subscriptions & Direct UPI Payments</h2>
            <p>
              Paid subscription tiers (Creator Pro ₹2,999/mo, Agency Scale ₹9,999/mo) are settled directly via UPI (muthurajc@slc). Activations are processed manually after entering a valid 12-digit UTR reference number.
            </p>
          </section>

          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-2">
            <h2 className="text-base font-black text-[#1F1216]">4. Contact & Support</h2>
            <p>
              For inquiries regarding service terms, please contact: <a href="mailto:iamprince8899@gmail.com" className="text-[#E11D48] font-bold">iamprince8899@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
