'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Menu, 
  X, 
  HeartHandshake
} from 'lucide-react';
import { TechieLogo } from '@/components/ui/techie-logo';

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FED7E2] bg-[#FFF5F7]/85 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Rose Glow */}
        <Link href="/" className="group">
          <TechieLogo size="md" animate />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#6B4E58]">
          <Link href="/#features" className="hover:text-[#E11D48] transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-[#E11D48] transition-colors">Pricing & UPI</Link>
          <Link href="/#faq" className="hover:text-[#E11D48] transition-colors">FAQ</Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-[#6B4E58] hover:text-[#E11D48] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white rose-button-primary"
          >
            <Sparkles className="w-4 h-4 text-[#FFF0F4]" />
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#6B4E58] hover:text-[#E11D48] rounded-lg focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF0F4] border-b border-[#FED7E2] px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-[#6B4E58]">
            <Link 
              href="/#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E11D48]"
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E11D48]"
            >
              Pricing & UPI
            </Link>
            <Link 
              href="/#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E11D48]"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-4 border-t border-[#FED7E2] flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-[#6B4E58] bg-[#FFFFFF] border border-[#FED7E2]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white rose-button-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
