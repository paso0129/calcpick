import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Inflation Calculator - US CPI & Projection';
const DESCRIPTION =
  "Free inflation calculator. Convert past dollar amounts to today's value using US CPI data (1913–present), or project future inflation impact on your money.";
const CANONICAL = `${SITE_URL}/calculator/inflation`;

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

export default function InflationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
