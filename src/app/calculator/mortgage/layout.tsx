import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Mortgage Calculator - Taxes, Insurance, PMI';
const DESCRIPTION =
  'Free mortgage calculator. Estimate monthly PITI payment including principal, interest, property tax, and homeowners insurance. Compare 15-year vs 30-year terms.';
const CANONICAL = `${SITE_URL}/calculator/mortgage`;

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

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
