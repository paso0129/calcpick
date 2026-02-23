'use client';

import Link from 'next/link';
import { CALCULATORS, SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-text-primary">
                Calc<span className="text-accent-500">Pick</span>
              </span>
            </Link>
            <p className="text-text-tertiary text-sm leading-relaxed">
              Free, accurate financial calculators to help you make smarter money decisions.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm mb-3">Calculators</h3>
            <ul className="space-y-2">
              {CALCULATORS.map((calc) => (
                <li key={calc.slug}>
                  <Link href={`/calculator/${calc.slug}`} className="text-text-tertiary hover:text-accent-500 text-sm transition-colors">
                    {calc.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-text-tertiary hover:text-accent-500 text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-text-tertiary hover:text-accent-500 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-text-tertiary hover:text-accent-500 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-tertiary hover:text-accent-500 text-sm transition-colors">Terms of Service</Link></li>
              <li>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new Event('open-cookie-settings'));
                    }
                  }}
                  className="text-text-tertiary hover:text-accent-500 text-sm transition-colors"
                >
                  Manage Privacy Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-6 text-center">
          <p className="text-text-tertiary text-xs">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Calculations are for informational purposes only and should not be considered financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
