import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Personal Loan Calculator - Payment, Interest & Rate Estimator (Free, 2026)';
const DESCRIPTION =
  'Free personal loan calculator. Estimate monthly payments, total interest, and APR for unsecured personal loans from $1,000 to $100,000. Instant results, no signup.';
const CANONICAL = `${SITE_URL}/calculator/personal-loan`;

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

export default function PersonalLoanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
