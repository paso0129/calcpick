import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Professional Calculator with Scientific Mode (Free, 2026)';
const DESCRIPTION =
  'Free online calculator with standard and scientific modes. Trigonometry, logarithms, exponents, and history. Works in any browser, no signup, no install.';
const CANONICAL = `${SITE_URL}/calculator/basic`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function BasicCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
