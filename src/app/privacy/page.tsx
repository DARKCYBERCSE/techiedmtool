import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { TechieLogo } from '@/components/ui/techie-logo';

export const metadata = {
  title: 'Privacy Policy — TechieDMTool',
  description: 'Official Meta Graph API Privacy Policy for TechieDMTool. Explains our commitment to user data protection, token encryption, and Instagram Platform Terms compliance.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 18, 2026';

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex flex-col justify-between">
      <MarketingNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        {/* Back link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B4E58] hover:text-[#E11D48] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-[#FED7E2] pb-8 mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE4E6] border border-[#FECDD3] text-xs font-bold text-[#E11D48]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Meta Platform Terms & Privacy Standard Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F1216]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#6B4E58] font-medium">
            Effective Date: {lastUpdated} · TechieDMTool (App ID: 947533688039115)
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-[#6B4E58] leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#1F1216] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#F43F5E]" />
              1. Overview & Information We Collect
            </h2>
            <p>
              Welcome to <strong>TechieDMTool</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal information. TechieDMTool provides automated conversational management for Instagram Creators and Businesses using the official <strong>Meta Graph API</strong>.
            </p>
            <p>
              When you connect your Instagram account or sign up on our platform, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#1F1216]">
              <li><strong>Account Credentials:</strong> Your name, email address, display name, and avatar.</li>
              <li><strong>Instagram Account Data:</strong> Instagram account ID, username, account type (Creator or Business), profile picture, and follower counts required for automation triggers.</li>
              <li><strong>Messaging Data:</strong> Inbound message/comment events, keywords, sender usernames, and automated replies processed via official webhooks.</li>
              <li><strong>Payment Records:</strong> UPI transaction UTR reference numbers submitted for manual verification (Direct UPI: <code>muthurajc@slc</code>). We do NOT store debit/credit card details or banking PINs.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#1F1216] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#EC4899]" />
              2. How We Use Meta Graph API Data
            </h2>
            <p>
              We access your Instagram data strictly with your explicit consent via the official Meta Login dialog. Data accessed through Meta permissions is utilized exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#1F1216]">
              <li>Respond automatically to comments left by your followers on your public Reels and posts.</li>
              <li>Deliver automated direct messages and resource links requested via trigger keywords.</li>
              <li>Display conversation logs, delivery statuses, and response analytics in your private dashboard.</li>
            </ul>
            <p className="font-bold text-[#E11D48] pt-1">
              We never sell your personal information or Meta account data to third-party advertisers or data brokers.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#1F1216] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              3. Data Security & 256-Bit Token Encryption
            </h2>
            <p>
              Security is our core priority. All Meta Access Tokens and sensitive credentials are encrypted using industry-standard <strong>256-bit AES-GCM encryption</strong> at rest and transmitted strictly over encrypted TLS/HTTPS protocols. Access tokens are stored server-side and never exposed to the frontend browser or client-side JavaScript.
            </p>
            <p>
              Database access is guarded by <strong>PostgreSQL Row-Level Security (RLS)</strong>, guaranteeing that your conversations, automations, and account records are accessible only by your verified session.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#1F1216] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F43F5E]" />
              4. Data Retention and Account Deletion
            </h2>
            <p>
              You maintain full control over your data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#1F1216]">
              <li><strong>Disconnect Instagram:</strong> You can disconnect your Instagram account at any time from <code>/dashboard/accounts</code>. Upon disconnection, access tokens are permanently deleted from our active database.</li>
              <li><strong>Revoke in Meta:</strong> You can revoke permissions directly from your Facebook Settings &gt; Apps and Websites &gt; TechieDMTool.</li>
              <li><strong>Account Deletion:</strong> To request complete deletion of your account and historical logs, submit a request to our primary contact or utilize the Danger Zone in Platform Settings.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-3xl bg-white border border-[#FED7E2] shadow-sm space-y-3">
            <h2 className="text-base sm:text-lg font-black text-[#1F1216] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#EC4899]" />
              5. Contact Information & Developer Details
            </h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, our Meta API implementation, or your personal information, please reach out directly:
            </p>
            <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2] space-y-1 text-xs">
              <p><strong>Application:</strong> TechieDMTool (Meta App ID: 947533688039115)</p>
              <p><strong>Primary Contact Email:</strong> <a href="mailto:iamprince8899@gmail.com" className="text-[#E11D48] font-bold hover:underline">iamprince8899@gmail.com</a></p>
              <p><strong>Billing UPI ID:</strong> <span className="font-mono font-bold text-[#E11D48]">muthurajc@slc</span></p>
              <p><strong>Website:</strong> <a href="https://techiedmtool.vercel.app" className="text-[#E11D48] font-bold hover:underline">https://techiedmtool.vercel.app</a></p>
            </div>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
