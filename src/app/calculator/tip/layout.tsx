import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Tip Calculator with Bill Split (Free, 2026)';
const DESCRIPTION =
  'Free tip calculator. Calculate tip amount and total per person for any group size. Pick a percentage or enter your own. Works for restaurants, delivery, and rides.';
const CANONICAL = `${SITE_URL}/calculator/tip`;

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

export default function TipCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
