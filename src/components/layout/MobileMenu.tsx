'use client';

import Link from 'next/link';
import { CALCULATORS } from '@/lib/constants';

const utilityCalcs = CALCULATORS.filter((c) => c.category === 'Utility');
const financeCalcs = CALCULATORS.filter((c) => c.category === 'Finance');

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-72 bg-dark-surface border-l border-dark-border overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <span className="text-lg font-bold text-text-primary">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary rounded-lg"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <div className="mb-4">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
              Utility Tools
            </p>
            {utilityCalcs.map((calc) => (
              <Link
                key={calc.slug}
                href={`/calculator/${calc.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-accent-500 hover:bg-dark-elevated rounded-lg transition-colors"
              >
                <span className="text-lg">{calc.icon}</span>
                <span className="text-sm">{calc.shortTitle}</span>
              </Link>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
              Finance Calculators
            </p>
            {financeCalcs.map((calc) => (
              <Link
                key={calc.slug}
                href={`/calculator/${calc.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-accent-500 hover:bg-dark-elevated rounded-lg transition-colors"
              >
                <span className="text-lg">{calc.icon}</span>
                <span className="text-sm">{calc.shortTitle}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-dark-border pt-4">
            <Link href="/about" onClick={onClose} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-accent-500 rounded-lg transition-colors">
              About
            </Link>
            <Link href="/contact" onClick={onClose} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-accent-500 rounded-lg transition-colors">
              Contact
            </Link>
            <Link href="/privacy" onClick={onClose} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-accent-500 rounded-lg transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" onClick={onClose} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-accent-500 rounded-lg transition-colors">
              Terms of Service
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
