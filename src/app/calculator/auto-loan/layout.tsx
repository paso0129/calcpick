import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Car Payment Calculator with Down Payment & Trade-In (Free, 2026)';
const DESCRIPTION =
  'Free car payment calculator. Estimate monthly auto loan payment with down payment, trade-in value, and interest rate. Instant results for new or used cars, no signup.';
const CANONICAL = `${SITE_URL}/calculator/auto-loan`;

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

export default function AutoLoanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
