'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Check, 
  ShieldCheck,
  Building2,
  User,
  Users
} from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { TechieLogo } from '@/components/ui/techie-logo';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState<'creator' | 'business' | 'agency'>('creator');
  const [connected, setConnected] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('pricing');

  const handleFinish = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-8">
        <Link href="/">
          <TechieLogo size="md" animate />
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B4E58]">
          <span>Step {step} of 4</span>
          <div className="w-24 bg-[#FFE4E6] h-2 rounded-full overflow-hidden border border-[#FED7E2]">
            <div
              className="bg-gradient-to-r from-[#F43F5E] to-[#EC4899] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-xl mx-auto w-full rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-xl">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-[#F43F5E] uppercase tracking-wider">Welcome</span>
              <h2 className="text-2xl font-black text-[#1F1216] mt-1">What best describes you?</h2>
              <p className="text-xs text-[#6B4E58] mt-1 font-medium">
                We'll customize your automation templates and trigger blueprints based on your focus.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'creator' as const,
                  title: 'Content Creator / Influencer',
                  desc: 'Scale reel comment freebies, lead magnets, and brand deals.',
                  icon: User,
                },
                {
                  id: 'business' as const,
                  title: 'E-Commerce / Local Business',
                  desc: 'Answer pricing questions, share store menus, and convert shoppers.',
                  icon: Building2,
                },
                {
                  id: 'agency' as const,
                  title: 'Marketing Agency',
                  desc: 'Manage multiple client accounts and deliver high-converting campaigns.',
                  icon: Users,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = useCase === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUseCase(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all shadow-xs ${
                      isSelected
                        ? 'border-[#F43F5E] bg-[#FFE4E6]/50 text-[#1F1216] shadow-sm'
                        : 'border-[#FED7E2] bg-[#FFF5F7] text-[#6B4E58] hover:text-[#1F1216]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-[#F43F5E] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1F1216] mb-0.5">{item.title}</h4>
                      <p className="text-xs leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow hover:opacity-95 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-[#EC4899] uppercase tracking-wider">Authentication</span>
              <h2 className="text-2xl font-black text-[#1F1216] mt-1">Connect Instagram Account</h2>
              <p className="text-xs text-[#6B4E58] mt-1 font-medium">
                Link via Meta Graph API. No passwords required. 100% policy-compliant.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#FED7E2] bg-[#FFF5F7] space-y-3">
              <div className="flex items-center gap-3">
                <Instagram className="w-6 h-6 text-[#F43F5E]" />
                <div>
                  <h4 className="text-xs font-bold text-[#1F1216]">Instagram Professional Required</h4>
                  <p className="text-[11px] text-[#6B4E58] font-medium">Connected to a Facebook Page with Messaging enabled.</p>
                </div>
              </div>

              {!connected ? (
                <button
                  onClick={() => setConnected(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white rose-button-primary transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" /> Connect with Meta OAuth
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center gap-2.5 text-xs font-bold text-[#10B981]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Successfully connected <strong>@techie.creator</strong></span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#6B4E58] hover:text-[#1F1216]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-[#10B981] uppercase tracking-wider">Automation Setup</span>
              <h2 className="text-2xl font-black text-[#1F1216] mt-1">Choose your first rule</h2>
              <p className="text-xs text-[#6B4E58] mt-1 font-medium">
                Pick a pre-configured automation to launch right out of the box.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'pricing', title: 'Price & Rate Card Responder', kw: 'price, cost, rates' },
                { id: 'guide', title: 'Freebie / Lead Magnet Dispatch', kw: 'guide, freebie, link' },
                { id: 'consult', title: 'Discovery Call Scheduler', kw: 'call, consult, book' },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all shadow-xs ${
                    selectedTemplate === tpl.id
                      ? 'border-[#10B981] bg-[#D1FAE5]/60 text-[#1F1216]'
                      : 'border-[#FED7E2] bg-[#FFF5F7] text-[#6B4E58] hover:text-[#1F1216]'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#1F1216]">{tpl.title}</p>
                    <p className="text-[11px] text-[#6B4E58] mt-0.5 font-medium">Triggers on: {tpl.kw}</p>
                  </div>
                  {selectedTemplate === tpl.id && <Check className="w-4 h-4 text-[#10B981]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(2)} className="text-xs font-bold text-[#6B4E58] hover:text-[#1F1216]">
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#D1FAE5] text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#1F1216]">You are all set!</h2>
              <p className="text-xs text-[#6B4E58] mt-2 max-w-sm mx-auto leading-relaxed font-medium">
                Your workspace is ready. Your Instagram account is connected and your first automation engine is live.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl text-xs font-bold text-white rose-button-primary shadow-xl shadow-[#F43F5E]/30 hover:opacity-95"
            >
              Enter TechieDM Dashboard
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs font-medium text-[#9E7D88]">
        TechieDMTool · Meta Graph API Verified Partner Standards · UPI Direct Enabled
      </div>
    </div>
  );
}
