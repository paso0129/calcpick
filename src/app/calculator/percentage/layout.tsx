import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Percentage Calculator - Find %, % of Total, % Change (Free, 2026)';
const DESCRIPTION =
  'Free percentage calculator. Solve "what is X% of Y", "X is what % of Y", and percentage increase or decrease. Instant answers, no signup.';
const CANONICAL = `${SITE_URL}/calculator/percentage`;

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

export default function PercentageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
