import React from 'react';
import Link from 'next/link';
import { Bot, Shield, Heart, ArrowUpRight } from 'lucide-react';
import { InstagramIcon as Instagram } from '@/components/ui/instagram-icon';
import { TechieLogo } from '@/components/ui/techie-logo';

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#FED7E2] bg-[#FFE8EE] text-[#6B4E58] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <TechieLogo size="md" />
            </Link>
            <p className="text-xs text-[#6B4E58] max-w-sm mb-4 leading-relaxed">
              Official Meta Graph API compliant Instagram conversation automation platform. Turn comments into conversions, accept direct payments via UPI (muthurajc@slc), and scale with zero spam.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-[#10B981]">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span>Official Meta Tech Partner Standards</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-[#1F1216] text-xs font-bold uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/#features" className="hover:text-[#E11D48] transition-colors">Workflow Builder</Link></li>
              <li><Link href="/#templates" className="hover:text-[#E11D48] transition-colors">Template Library</Link></li>
              <li><Link href="/dashboard/conversations" className="hover:text-[#E11D48] transition-colors">Smart Inbox</Link></li>
              <li><Link href="/dashboard/analytics" className="hover:text-[#E11D48] transition-colors">Analytics Engine</Link></li>
              <li><Link href="/#pricing" className="hover:text-[#E11D48] transition-colors">Pricing & UPI</Link></li>
            </ul>
          </div>

          {/* Solutions links */}
          <div>
            <h4 className="text-[#1F1216] text-xs font-bold uppercase tracking-wider mb-3">Use Cases</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/#creators" className="hover:text-[#E11D48] transition-colors">For Creators</Link></li>
              <li><Link href="/#business" className="hover:text-[#E11D48] transition-colors">E-Commerce & Brands</Link></li>
              <li><Link href="/#agencies" className="hover:text-[#E11D48] transition-colors">Growth Agencies</Link></li>
              <li><Link href="/#coaches" className="hover:text-[#E11D48] transition-colors">Coaches & Consultants</Link></li>
            </ul>
          </div>

          {/* Legal and compliance */}
          <div>
            <h4 className="text-[#1F1216] text-xs font-bold uppercase tracking-wider mb-3">Compliance & UPI</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/privacy" className="hover:text-[#E11D48] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#E11D48] transition-colors">Terms of Service</Link></li>
              <li><Link href="/#pricing" className="hover:text-[#E11D48] transition-colors">UPI Direct: muthurajc@slc</Link></li>
              <li><Link href="/security" className="hover:text-[#E11D48] transition-colors">Meta Security Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#FED7E2] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 TechieDMTool Inc. Crafted with sweet pink & rose elegance for creators.</p>
          <div className="flex items-center gap-6">
            <span className="text-[#9E7D88]">Zero spam tolerance · Official Meta APIs only · UPI instant checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
