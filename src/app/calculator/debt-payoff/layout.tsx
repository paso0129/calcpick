import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Debt Avalanche & Snowball Calculator - Compare with Extra Payments (Free)';
const DESCRIPTION =
  'Free debt payoff calculator. Compare debt avalanche vs snowball methods with extra payments. See exactly when you will be debt-free and how much total interest you save.';
const CANONICAL = `${SITE_URL}/calculator/debt-payoff`;

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

export default function DebtPayoffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
