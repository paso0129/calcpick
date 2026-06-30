import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Compound Interest Calculator - Growth Over Time';
const DESCRIPTION =
  'Free compound interest calculator. Project investment growth with monthly contributions, custom rate, and any compounding frequency. See year-by-year breakdown.';
const CANONICAL = `${SITE_URL}/calculator/compound-interest`;

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

export default function CompoundInterestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
