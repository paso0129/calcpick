import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Student Loan Calculator - Compare Repayment Plans (Free, 2026)';
const DESCRIPTION =
  'Free student loan calculator. Compare standard, graduated, and income-driven repayment plans. Estimate monthly payment, total interest, and payoff date.';
const CANONICAL = `${SITE_URL}/calculator/student-loan`;

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

export default function StudentLoanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
