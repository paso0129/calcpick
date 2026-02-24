'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { CALCULATORS } from '@/lib/constants';
import MobileMenu from './MobileMenu';

const utilityCalcs = CALCULATORS.filter((c) => c.category === 'Utility');
const financeCalcs = CALCULATORS.filter((c) => c.category === 'Finance');

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFinanceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-dark-surface/95 backdrop-blur-sm border-b border-dark-border">
        <div className="h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-success-400" />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-text-primary">
                Calc<span className="text-accent-500">Pick</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {utilityCalcs.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/calculator/${calc.slug}`}
                  className="text-sm text-text-secondary hover:text-accent-500 transition-colors"
                >
                  {calc.shortTitle}
                </Link>
              ))}

              {/* Finance Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setFinanceOpen(!financeOpen)}
                  onMouseEnter={() => setFinanceOpen(true)}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent-500 transition-colors"
                >
                  Finance
                  <svg className={`w-3.5 h-3.5 transition-transform ${financeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {financeOpen && (
                  <div
                    onMouseLeave={() => setFinanceOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-dark-surface border border-dark-border rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="py-1">
                      {financeCalcs.map((calc) => (
                        <Link
                          key={calc.slug}
                          href={`/calculator/${calc.slug}`}
                          onClick={() => setFinanceOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-accent-500 hover:bg-dark-elevated transition-colors"
                        >
                          <span className="text-base">{calc.icon}</span>
                          {calc.shortTitle}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-dark-elevated transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-dark-elevated transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
